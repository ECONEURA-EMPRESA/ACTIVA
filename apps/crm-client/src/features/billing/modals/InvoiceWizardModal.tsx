import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PatientRepository } from '../../../data/repositories/PatientRepository';
import { SessionRepository } from '../../../data/repositories/SessionRepository';
import { BillingRepository } from '../../../data/repositories/BillingRepository';
import { GroupSessionRepository } from '../../../data/repositories/GroupSessionRepository';
import { format } from 'date-fns';
import { X, Search, Receipt, Calendar, Users, User, Building } from 'lucide-react';
import { useInvoiceController } from '../../../hooks/controllers/useInvoiceController';
import { useSettingsController } from '../../../hooks/controllers/useSettingsController';
import { ClinicSettings } from '../../../lib/types';

interface InvoiceWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type WizardMode = 'INDIVIDUAL' | 'GROUP';

export const InvoiceWizardModal: React.FC<InvoiceWizardModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [mode, setMode] = useState<WizardMode>('INDIVIDUAL');

    // Selection State
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null);
    const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const { createInvoice, isCreating } = useInvoiceController();

    // --- SETTINGS INTEGRATION ---
    const { settings, updateSettings } = useSettingsController();
    const [billingData, setBillingData] = useState<NonNullable<ClinicSettings['billing']>>({
        legalName: '',
        nif: '',
        address: '',
        logoUrl: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (settings?.billing) {
            setBillingData({
                legalName: settings.billing.legalName || '',
                nif: settings.billing.nif || '',
                address: settings.billing.address || '',
                logoUrl: settings.billing.logoUrl || '',
                email: settings.billing.email || '',
                phone: settings.billing.phone || ''
            });
        }
    }, [settings]);

    // --- DATA FETCHING ---

    // 1. Patients (for Individual Mode)
    const { data: patients = [] } = useQuery({
        queryKey: ['patients', 'list'],
        queryFn: () => PatientRepository.getAll(),
        enabled: isOpen && mode === 'INDIVIDUAL',
        staleTime: 0
    });

    // 2. Groups (for Group Mode)
    const { data: allGroupSessions = [] } = useQuery({
        queryKey: ['group_sessions_all'],
        queryFn: () => GroupSessionRepository.getAll(),
        enabled: isOpen && mode === 'GROUP',
    });

    // Extract unique Group Names
    const availableGroups = useMemo(() => {
        // Filter out undefined/null names and ensuring string type
        const uniqueNames = new Set(
            allGroupSessions
                .map(g => g.groupName)
                .filter((name): name is string => !!name)
        );
        return Array.from(uniqueNames);
    }, [allGroupSessions]);

    // 3. Unbilled Sessions (Based on Mode)
    const { data: billableSessions = [] } = useQuery({
        queryKey: ['billable_sessions', mode, selectedPatientId, selectedGroupName],
        queryFn: async () => {
            if (mode === 'INDIVIDUAL' && selectedPatientId) {
                // Fetch Subcollection Sessions
                const sessions = await SessionRepository.getSessionsByPatientId(selectedPatientId);
                return sessions
                    .filter(s => s.id && !s.paid)
                    .map(s => ({ ...s, patientId: selectedPatientId, _type: 'individual' as const }));
            }
            if (mode === 'GROUP' && selectedGroupName) {
                // Fetch Unbilled Groups
                const sessions = await BillingRepository.getUnbilledGroupSessions(selectedGroupName);
                return sessions.map(s => ({ ...s, _type: 'group' as const }));
            }
            return [];
        },
        enabled: (mode === 'INDIVIDUAL' && !!selectedPatientId) || (mode === 'GROUP' && !!selectedGroupName),
    });

    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    // --- HANDLERS ---

    const [customInvoiceNumber, setCustomInvoiceNumber] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Generate distinct default when opening
            setCustomInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        // 1. Validate
        if (mode === 'INDIVIDUAL' && !selectedPatient) return alert("Selecciona un paciente");
        if (mode === 'GROUP' && !selectedGroupName) return alert("Selecciona un grupo");
        if (selectedSessionIds.length === 0) return alert("Selecciona al menos una sesión");
        if (!customInvoiceNumber) return alert("El número de factura es obligatorio");

        // 2. UPSERT SETTINGS (Save Billing Info for future)
        try {
            await updateSettings({ billing: billingData });
        } catch (e: any) {
            console.error("Failed to auto-save settings", e);
            // Silent fail for settings, proceeding with invoice
        }

        // 3. Calculate
        const sessionsToBill = billableSessions.filter(s => selectedSessionIds.includes(String(s.id)));
        const total = sessionsToBill.reduce((acc, s) => acc + (Number(s.price) || 0), 0);

        // 4. Prepare Payload
        const invoicePayload = {
            id: crypto.randomUUID(),
            number: customInvoiceNumber, // USE CUSTOM NUMBER
            patientId: mode === 'INDIVIDUAL' ? (selectedPatient?.id as string) : 'GROUPS',
            patientName: mode === 'INDIVIDUAL' ? selectedPatient?.name || 'Cliente' : selectedGroupName || 'Grupo',
            date: new Date(invoiceDate).toISOString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'PENDING' as const,
            items: sessionsToBill.map(s => ({
                id: crypto.randomUUID(),
                description: mode === 'INDIVIDUAL'
                    ? `Sesión Individual - ${s.date}`
                    : `Sesión Grupal (${selectedGroupName}) - ${s.date}`,
                quantity: 1,
                unitPrice: Number(s.price) || 0,
                total: Number(s.price) || 0,
                sessionId: s.id as string
            })),
            subtotal: total,
            taxRate: 0,
            taxAmount: 0,
            total: total,
            notes: mode === 'INDIVIDUAL'
                ? `Factura música para ${selectedPatient?.name}`
                : `Factura de servicios grupales: ${selectedGroupName}`
        };

        const batchSessions = sessionsToBill.map(s => ({
            id: String(s.id),
            type: s._type,
            patientId: s.patientId,
            price: Number(s.price),
            date: String(s.date)
        }));

        // 5. Execute Batch
        try {
            await createInvoice({ invoice: invoicePayload, sessions: batchSessions });

            // alert('¡Factura Generada Correctamente!'); // REMOVED PER REQUEST
            onClose();
            // Reset
            setStep(1);
            setSelectedPatientId(null);
            setSelectedGroupName(null);
            setSelectedSessionIds([]);
        } catch (e) {
            console.error("Error creating invoice:", e);
            alert("Error al generar factura: " + e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh]">
                {/* HEAD */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Receipt size={24} className="text-pink-600" />
                            Nueva Factura
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">Asistente de Facturación Inteligente</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">

                    {/* STEP 1: MODE SELECTION */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-700 text-center">¿A quién vas a facturar?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => { setMode('INDIVIDUAL'); setStep(2); }}
                                    className="p-8 rounded-2xl border-2 border-slate-100 hover:border-pink-500 hover:bg-pink-50 transition-all group text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-white rounded-full shadow-sm mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <User size={32} className="text-slate-400 group-hover:text-pink-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl text-slate-800">Paciente Individual</h4>
                                        <p className="text-sm text-slate-400 mt-2">Crear factura para un único paciente basada en sus sesiones.</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setMode('GROUP'); setStep(2); }}
                                    className="p-8 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-white rounded-full shadow-sm mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Users size={32} className="text-slate-400 group-hover:text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl text-slate-800">Institución / Grupo</h4>
                                        <p className="text-sm text-slate-400 mt-2">Facturar un grupo completo o institución (Ej: Taller Memoria).</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: ENTITY SELECTION */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-700">
                                    {mode === 'INDIVIDUAL' ? 'Seleccionar Paciente' : 'Seleccionar Grupo'}
                                </h3>
                                <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Cambiar Modo</button>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-pink-500 font-medium"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto custom-scrollbar">
                                {mode === 'INDIVIDUAL'
                                    ? patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => { setSelectedPatientId(String(p.id)); setStep(3); }}
                                            className="flex items-center gap-3 p-3 hover:bg-pink-50 rounded-xl border border-transparent hover:border-pink-100 group transition-all text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-pink-100 group-hover:text-pink-600">
                                                {p.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{p.name}</p>
                                                <p className="text-xs text-slate-500">{(p.sessions?.filter(s => !s.paid)?.length || 0)} pendientes</p>
                                            </div>
                                        </button>
                                    ))
                                    : availableGroups.filter(g => g.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
                                        <button
                                            key={g}
                                            onClick={() => { setSelectedGroupName(g); setStep(3); }}
                                            className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100 group transition-all text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                                                <Users size={16} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{g}</p>
                                                <p className="text-xs text-slate-500">Facturación Grupal</p>
                                            </div>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SESSION SELECT */}
                    {step === 3 && (mode === 'INDIVIDUAL' ? selectedPatientId : selectedGroupName) && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-700">Seleccionar Sesiones</h3>
                                <button onClick={() => setStep(2)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Cambiar Selección</button>
                            </div>

                            {/* SELECT ALL */}
                            {billableSessions.length > 0 && (
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 accent-pink-600"
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedSessionIds(billableSessions.map(s => String(s.id)));
                                                else setSelectedSessionIds([]);
                                            }}
                                            checked={selectedSessionIds.length === billableSessions.length}
                                        />
                                        Seleccionar Todo
                                    </label>
                                    <span className="text-xs font-bold text-slate-400">
                                        Total: {billableSessions.reduce((acc, s) => acc + (Number(s.price) || 0), 0).toFixed(2)}€
                                    </span>
                                </div>
                            )}

                            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                                {billableSessions.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400">
                                        <p>No hay sesiones pendientes de cobro.</p>
                                    </div>
                                ) : (
                                    billableSessions.map(session => (
                                        <label key={session.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedSessionIds.includes(String(session.id)) ? 'bg-pink-50 border-pink-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-slate-300 accent-pink-600"
                                                checked={selectedSessionIds.includes(String(session.id))}
                                                onChange={(e) => {
                                                    const sid = String(session.id);
                                                    setSelectedSessionIds(prev =>
                                                        e.target.checked ? [...prev, sid] : prev.filter(id => id !== sid)
                                                    );
                                                }}
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-800 text-sm">
                                                    {mode === 'GROUP' && 'groupName' in session
                                                        ? (session as any).groupName
                                                        : (session.type === 'individual' ? 'Sesión Individual' : 'Sesión Grupal')}
                                                </p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {session.date} - {'time' in session ? (session as any).time : ''}
                                                </p>
                                            </div>
                                            <div className="font-black text-slate-700">
                                                {session.price}€
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: CONFIRMATION & BILLING CONFIG */}
                    {step === 4 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                            {/* LEFT: INVOICE SUMMARY */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                    <Receipt size={20} className="text-slate-400" /> Resumen Factura
                                </h3>

                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase">Cliente</p>
                                            <p className="font-bold text-slate-800 text-lg">
                                                {mode === 'INDIVIDUAL' ? selectedPatient?.name : selectedGroupName}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 font-bold uppercase">Fecha Emisión</p>
                                            <input
                                                type="date"
                                                value={invoiceDate}
                                                onChange={(e) => setInvoiceDate(e.target.value)}
                                                className="bg-transparent font-bold text-slate-800 text-right outline-none border-b border-dashed border-slate-300 focus:border-pink-500 w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-xs text-slate-400 font-bold uppercase">Número de Factura</label>
                                        <input
                                            type="text"
                                            value={customInvoiceNumber}
                                            onChange={(e) => setCustomInvoiceNumber(e.target.value)}
                                            className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 focus:border-pink-500 outline-none font-mono text-sm font-bold text-slate-700"
                                            placeholder="INV-000000"
                                        />
                                    </div>

                                    <div className="space-y-2 border-t border-slate-200 pt-4 max-h-48 overflow-y-auto custom-scrollbar">
                                        {billableSessions.filter(s => selectedSessionIds.includes(String(s.id))).map(s => (
                                            <div key={s.id} className="flex justify-between text-sm">
                                                <span className="text-slate-600">{s.date} - Sesión</span>
                                                <span className="font-mono font-medium">{s.price}€</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t-2 border-slate-800 mt-4 pt-4 flex justify-between items-center">
                                        <span className="font-black text-xl text-slate-900">TOTAL</span>
                                        <span className="font-black text-2xl text-pink-600">
                                            {billableSessions
                                                .filter(s => selectedSessionIds.includes(String(s.id)))
                                                .reduce((acc, s) => acc + (Number(s.price) || 0), 0)
                                                .toFixed(2)}€
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: ISSUER CONFIG (EDITABLE) */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                    <Building size={20} className="text-indigo-600" /> Datos del Emisor
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Personaliza los datos de TU empresa para esta factura. Se guardarán para la próxima.
                                </p>

                                <div className="space-y-4 p-6 border-2 border-dashed border-indigo-100 rounded-xl bg-indigo-50/30">
                                    {/* LOGO */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative group">
                                            {billingData.logoUrl ? (
                                                <img
                                                    src={billingData.logoUrl}
                                                    alt="Logo"
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400">
                                                    <Building size={24} />
                                                </div>
                                            )}
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                Cambiar
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            if (file.size > 2 * 1024 * 1024) { // 2MB Limit
                                                                alert("El logo es demasiado grande (Máx 2MB). Intenta con una imagen más pequeña.");
                                                                return;
                                                            }

                                                            // Compression Logic
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                const img = new Image();
                                                                img.onload = () => {
                                                                    const canvas = document.createElement('canvas');
                                                                    const MAX_WIDTH = 500;
                                                                    const MAX_HEIGHT = 500;
                                                                    let width = img.width;
                                                                    let height = img.height;

                                                                    if (width > height) {
                                                                        if (width > MAX_WIDTH) {
                                                                            height *= MAX_WIDTH / width;
                                                                            width = MAX_WIDTH;
                                                                        }
                                                                    } else {
                                                                        if (height > MAX_HEIGHT) {
                                                                            width *= MAX_HEIGHT / height;
                                                                            height = MAX_HEIGHT;
                                                                        }
                                                                    }

                                                                    canvas.width = width;
                                                                    canvas.height = height;
                                                                    const ctx = canvas.getContext('2d');
                                                                    ctx?.drawImage(img, 0, 0, width, height);

                                                                    // Compress to JPEG 0.7 to save space
                                                                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                                                                    setBillingData({ ...billingData, logoUrl: dataUrl });
                                                                };
                                                                img.src = event.target?.result as string;
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Nombre de Empresa / Autónomo</label>
                                            <input
                                                className="w-full bg-transparent border-b border-indigo-200 focus:border-indigo-600 font-bold text-indigo-900 outline-none transition-colors"
                                                placeholder="Ej: Clínica Activa S.L."
                                                value={billingData.legalName || ''}
                                                onChange={e => setBillingData({ ...billingData, legalName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* FIELDS */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NIF / CIF</label>
                                            <input
                                                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-sm font-mono"
                                                placeholder="B-12345678"
                                                value={billingData.nif || ''}
                                                onChange={e => setBillingData({ ...billingData, nif: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email (Opcional)</label>
                                            <input
                                                className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-sm"
                                                placeholder="facturas@empresa.com"
                                                value={billingData.email || ''}
                                                onChange={e => setBillingData({ ...billingData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dirección Fiscal</label>
                                        <textarea
                                            className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-sm min-h-[60px]"
                                            placeholder="Dirección completa..."
                                            value={billingData.address || ''}
                                            onChange={e => setBillingData({ ...billingData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 transition-all">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(prev => prev - 1 as any)}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            Atrás
                        </button>
                    )}

                    {step < 4 ? (
                        <button
                            onClick={() => {
                                // Validation before next
                                if (step === 3 && selectedSessionIds.length === 0) return alert("Selecciona al menos una sesión");
                                setStep(prev => prev + 1 as any);
                            }}
                            disabled={
                                (step === 1) || // Step 1 buttons do the nav
                                (step === 2 && ((mode === 'INDIVIDUAL' && !selectedPatientId) || (mode === 'GROUP' && !selectedGroupName))) ||
                                (step === 3 && selectedSessionIds.length === 0)
                            }
                            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-50 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                        >
                            Siguiente
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            disabled={isCreating}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all shadow-lg shadow-pink-200 disabled:opacity-70 flex items-center gap-2"
                        >
                            {isCreating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            Crear Factura Original
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

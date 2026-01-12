import React, { useState, useEffect } from 'react';
import {
    Activity,
    BarChart3,
    ClipboardCheck,
    DollarSign,
    ArrowLeft,
    Lightbulb,
    FileText,
    Trash2,
    Edit,
    PlusCircle,
    PenTool,
    CheckSquare,
    ShieldCheck,
    Music,
    Folder,
    Save,
    Phone,
    CalendarPlus,
} from 'lucide-react';
import { useCreateSession, useUpdateSession, useDeleteSession } from '../../api/mutations/useSessionMutations';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PatientAvatar } from '../../components/ui/PatientAvatar';
import { Toast } from '../../components/ui/Toast';
import { InvoiceGenerator } from '../../components/ui/InvoiceGenerator';
import { DocumentsTab } from './tabs/DocumentsTab';
import { PhaseProgress } from './components/PhaseProgress';

// Modals
import { EditProfileModal } from './modals/EditProfileModal';
import { AdmissionChecklistModal } from './modals/AdmissionChecklistModal';
import { SafetyModal } from './modals/SafetyModal'; // NEW
import { MusicalIdentityModal } from './modals/MusicalIdentityModal'; // NEW
import { CognitiveModal } from './modals/CognitiveModal';
import { SessionModal } from './modals/SessionModal';
import { ClinicalGuideModal } from './modals/ClinicalGuideModal';
import { ReportModal } from './modals/ReportModal';

import { TREATMENT_PHASES, getPhaseForSessionIndex } from '../../lib/clinicalUtils';
import { FORMULATION_OPTIONS, PATHOLOGY_MAP, MOBILITY_MAP } from '../../lib/patientUtils';

import { Patient, Session, FormulationData, ClinicalFormulation } from '../../lib/types';

const RISK_LABELS: Record<string, string> = {
    epilepsy: 'Epilepsia',
    dysphagia: 'Disfagia',
    flightRisk: 'Riesgo Fuga',
    psychomotorAgitation: 'Agitación',
    hyperacusis: 'Hiperacusia',
    chokingHazard: 'Riesgo Atragantamiento',
    disruptiveBehavior: 'Conducta Disruptiva',
};

import { useAuth } from '../../context/AuthContext';
import { EvidenceChart } from '../analytics/EvidenceChart';
import { PaywallModal } from '../../components/ui/PaywallModal';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useDeletePatient } from '../../api/queries';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useSettingsController } from '../../hooks/controllers/useSettingsController';

interface PatientDetailProps {
    patient: Patient;
    onBack: () => void;
    onUpdate: (updated: Patient) => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
    patient,
    onBack,
    onUpdate,
}) => {
    const { settings: clinicSettings } = useSettingsController();
    const { logActivity } = useActivityLog();
    const { canDelete, canViewFinancials, isPremium, demoMode } = useAuth();
    const [showPaywall, setShowPaywall] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Deletion Hook
    const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient(demoMode);

    const confirmDelete = () => {
        if (!patient.id) return;
        deletePatient(String(patient.id), {
            onSuccess: () => {
                logActivity('delete', `Paciente eliminado permanentemente: ${patient.name}`);
                setShowDeleteModal(false);
                showToast('Paciente eliminado correctamente', 'success');
                onBack(); // Return to directory
            },
            onError: (err: any) => {
                console.error(err);
                setShowDeleteModal(false);
                showToast('Error al eliminar paciente', 'error');
            }
        });
    };
    const [notification, setNotification] = useState<{
        msg: string;
        type: 'success' | 'error';
    } | null>(null);
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotification({ msg, type });
    };

    // ROBUST: cleanup timeout on unmount or change
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Modal State
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | undefined>(undefined);
    const [showCognitiveModal, setShowCognitiveModal] = useState(false);
    const [cognitiveInitialTab, setCognitiveInitialTab] = useState<'general' | 'moca' | 'mmse'>('general');
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showAdmissionChecklist, setShowAdmissionChecklist] = useState(false);

    // NEW MODAL STATES
    const [showSafetyModal, setShowSafetyModal] = useState(false);
    const [showIsoModal, setShowIsoModal] = useState(false);

    const [invoiceData, setInvoiceData] = useState<any>(null);

    const tabs = [
        { id: 'treatment', label: 'Plan de Tratamiento', icon: Activity }, // UNIFIED TAB
        { id: 'evaluation', label: 'Evaluación (0-3)', icon: BarChart3 },
        { id: 'sessions', label: 'Bitácora', icon: ClipboardCheck },
        { id: 'documents', label: 'Gestor Documental', icon: Folder },
        ...(canViewFinancials ? [{ id: 'billing', label: 'Facturación', icon: DollarSign }] : []),
        { id: 'discharge', label: 'Alta y Continuidad', icon: CheckSquare },
    ];

    const isChild = patient.age < 15;

    const validSessions = patient.sessions ? patient.sessions.filter((s) => !s.isAbsent) : [];
    const currentPhase =
        TREATMENT_PHASES.find((p) => {
            const parts = p.range.split('-');
            const min = parseInt(parts[0]);
            const max = parseInt(parts[1]);
            return validSessions.length >= min && validSessions.length <= max;
        }) || TREATMENT_PHASES[0];

    const [activeTab, setActiveTab] = useState('treatment');

    // TITANIUM MUTATIONS
    const { mutateAsync: createSession } = useCreateSession();
    const { mutateAsync: updateSession } = useUpdateSession();
    const { mutateAsync: deleteSession } = useDeleteSession();

    const handleDeleteSession = async (sessionId: string | number) => {
        // Confirmation is handled in the Modal
        try {
            if (patient.id) {
                await deleteSession({ patientId: String(patient.id), sessionId: String(sessionId) });
                logActivity('session', `Sesión eliminada de historial: ${patient.name}`);
                showToast('Sesión eliminada del historial', 'success');
                setShowSessionModal(false);
            } else {
                console.error('Titanium Error: Patient ID missing');
            }
        } catch (e) {
            console.error('Delete Error:', e);
            showToast('Error al eliminar', 'error');
        }
    };

    const handleSaveSession = async (sessionData: Session) => {
        const isNew = !selectedSession;

        try {
            if (isNew) {
                if (patient.id) {
                    await createSession({ patientId: String(patient.id), session: sessionData });

                    if (sessionData.isAbsent) {
                        logActivity('session', `Ausencia registrada por ${patient.name}`);
                    } else {
                        logActivity('session', `Sesión completada con ${patient.name}`);
                    }
                }
            } else {
                if (patient.id && sessionData.id) {
                    await updateSession({ patientId: String(patient.id), sessionId: String(sessionData.id), data: sessionData });

                    if (sessionData.paid) {
                        logActivity('finance', `Pago registrado: Sesión de ${patient.name}`);
                    } else if (sessionData.isAbsent) {
                        logActivity('session', `Sesión marcada como AUSENCIA: ${patient.name}`);
                    } else {
                        logActivity('session', `Sesión actualizada: ${patient.name}`);
                    }
                }
            }
            setShowSessionModal(false);
            showToast('Sesión guardada correctamente', 'success');
        } catch (e) {
            console.error('Save Error:', e);
            showToast('Error al guardar sesión', 'error');
        }
    };

    // Sort sessions descending (Newest first)
    // HELPER: Robust Date Parsing
    const parseSessionDate = (dStr: string) => {
        if (!dStr) return 0;
        if (dStr.includes('/')) {
            const [d, m, y] = dStr.split('/');
            return new Date(`${y}-${m}-${d}`).getTime();
        }
        return new Date(dStr).getTime();
    };

    const activeSessions = React.useMemo(() => {
        return [...(patient.sessions || [])].sort((a, b) => {
            return parseSessionDate(b.date) - parseSessionDate(a.date);
        });
    }, [patient.sessions]);

    // Calculate phases considering only valid (non-absent) sessions
    const sessionPhaseMap = React.useMemo(() => {
        const map: Record<string, number> = {};
        let validCount = 0;
        // Process chronologically (Oldest -> Newest)
        [...activeSessions].reverse().forEach((s) => {
            if (!s.isAbsent) {
                validCount++;
                map[s.id] = getPhaseForSessionIndex(validCount - 1);
            }
        });
        return map;
    }, [activeSessions]);

    interface FormulationSectionProps {
        title: string;
        optionsKey: keyof typeof FORMULATION_OPTIONS;
        fieldKey: keyof ClinicalFormulation;
        initialData: FormulationData | string | undefined;
        onSave: (fieldKey: keyof ClinicalFormulation, data: FormulationData) => void;
    }

    const FormulationSection: React.FC<FormulationSectionProps> = ({ title, optionsKey, fieldKey, initialData, onSave }) => {
        const isFormulationData = (val: any): val is FormulationData => {
            return typeof val === 'object' && val !== null && 'selected' in val;
        };

        const normalizeData = (val: any): FormulationData => {
            return isFormulationData(val)
                ? val
                : { selected: [], text: typeof val === 'string' ? val : '' };
        };

        const [localData, setLocalData] = useState<FormulationData>(normalizeData(initialData));
        const [isDirty, setIsDirty] = useState(false);

        useEffect(() => {
            const data = normalizeData(initialData);
            if (!data.text && patient.diagnosis) {
                let template = '';
                if (fieldKey === 'synthesis') {
                    template = `Paciente de ${patient.age} años con diagnóstico principal de ${patient.diagnosis}.` +
                        (patient.pathologyType ? ` Se clasifica dentro del espectro: ${PATHOLOGY_MAP[patient.pathologyType] || patient.pathologyType}.` : '');
                } else if (fieldKey === 'hypothesis') {
                    template = `Se propone intervención musicoterapéutica centrada en ${patient.diagnosis.toLowerCase().includes('demencia') ? 'estimulación cognitiva y reminiscencia' : 'regulación emocional y expresión'}.`;
                } else if (fieldKey === 'objectives') {
                    // AUTO-OBJECTIVES LOGIC
                    if (patient.diagnosis.toLowerCase().includes('alzheimer') || patient.diagnosis.toLowerCase().includes('demencia')) {
                        template = "1. Mantenimiento de funciones cognitivas (atención, memoria).\n2. Reducción de sintomatología conductual y ansiógena.\n3. Fomento de la conexión con el entorno y la identidad sonora.\n4. Estimulación de la memoria autobiográfica a través de la reminiscencia musical.";
                    } else if (patient.age < 18) {
                        template = "1. Fomentar la expresión emocional y la comunicación no verbal.\n2. Mejorar la atención conjunta y la interacción social.\n3. Desarrollo de habilidades motrices y rítmicas.\n4. Regulación sensorial y conductual.";
                    } else {
                        template = "1. Mejorar el bienestar emocional y la autopercepción.\n2. Facilitar la expresión de sentimientos bloqueados.\n3. Promover la relajación y reducción de estrés.\n4. Potenciar recursos creativos y de afrontamiento.";
                    }
                }
                if (template) {
                    data.text = template;
                    setIsDirty(true);
                }
            }
            setLocalData(data);
        }, [initialData, fieldKey, patient.diagnosis]);

        const handleCheck = (option: string) => {
            const newSelected = localData.selected.includes(option)
                ? localData.selected.filter((s) => s !== option)
                : [...localData.selected, option];
            setLocalData({ ...localData, selected: newSelected });
            setIsDirty(true);
        };

        const handleText = (text: string) => {
            setLocalData({ ...localData, text });
            setIsDirty(true);
        };

        const handleSaveClick = () => {
            onSave(fieldKey, localData);
            setIsDirty(false);
        };

        return (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                    <CheckSquare size={16} className="text-pink-600" /> {title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {(FORMULATION_OPTIONS[optionsKey] || []).map((opt: string) => (
                        <label
                            key={opt}
                            className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors border border-transparent hover:border-slate-100"
                        >
                            <input
                                type="checkbox"
                                className="mt-0.5 accent-pink-600 w-4 h-4"
                                checked={localData.selected.includes(opt)}
                                onChange={() => handleCheck(opt)}
                            />
                            <span className="leading-snug select-none">{opt}</span>
                        </label>
                    ))}
                </div>
                <textarea
                    className="input-pro text-sm h-32 resize-none bg-slate-50 border-slate-200 focus:bg-white mb-4"
                    placeholder="Detalles clínicos y observaciones..."
                    value={localData.text}
                    onChange={(e) => handleText(e.target.value)}
                />
                <div className="mt-auto flex justify-end">
                    <Button
                        size="sm"
                        variant={isDirty ? 'primary' : 'secondary'}
                        onClick={handleSaveClick}
                        icon={Save}
                        disabled={!isDirty}
                    >
                        {isDirty ? 'Guardar Cambios' : 'Actualizado'}
                    </Button>
                </div>
            </div>
        );
    };

    const handlePrintGlobalInvoice = () => {
        // INCLUIR TODAS LAS SESIONES REALIZADAS (PAGADAS O NO)
        // Se excluyen ausencias SOLO si no tienen precio (no cobradas)
        const allBillableSessions = activeSessions
            .filter((s) => !s.isAbsent || (s.price && s.price > 0))
            .sort((a, b) => {
                // Sort Chronologically for Invoice (Oldest -> Newest)
                const timeA = parseSessionDate(a.date);
                const timeB = parseSessionDate(b.date);
                return timeA - timeB;
            });



        if (allBillableSessions.length === 0)
            return alert('No se encontraron sesiones para facturar.');

        // Generate sequential invoice number roughly or use default
        const defaultNum = `FACT-${Date.now().toString().slice(-6)}`;
        setInvoiceData({
            clientName: patient.name,
            clientMeta: `Paciente Ref: ${patient.reference || '-'}`,
            sessions: allBillableSessions,
            invoiceNumber: defaultNum,
        });
        setShowInvoice(true);
    };

    const highRisks = patient.safetyProfile
        ? Object.entries(patient.safetyProfile)
            .filter(
                ([k, v]) =>
                    v === true &&
                    [
                        'epilepsy',
                        'dysphagia',
                        'flightRisk',
                        'psychomotorAgitation',
                        'chokingHazard',
                    ].includes(k),
            )
            .map(([k]) => k)
        : [];

    const isoNocivo = patient.musicalIdentity?.dislikes?.length || 0;

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 max-w-7xl mx-auto">
            {notification && (
                <Toast
                    message={notification.msg}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* --- MODALS --- */}

            {showSafetyModal && (
                <SafetyModal
                    onClose={() => setShowSafetyModal(false)}
                    isChild={isChild}
                    initialData={patient.safetyProfile || undefined}
                    onSave={(data) => {
                        onUpdate({ ...patient, safetyProfile: data });
                        logActivity('security', `Seguridad Clínica actualizada: ${patient.name}`);
                        setShowSafetyModal(false);
                        showToast('Protocolo de Seguridad Actualizado', 'success');
                    }}
                />
            )}

            {showIsoModal && (
                <MusicalIdentityModal
                    onClose={() => setShowIsoModal(false)}
                    initialData={patient.musicalIdentity || undefined}
                    onSave={(data) => {
                        onUpdate({ ...patient, musicalIdentity: data });
                        logActivity('security', `Identidad Sonora (ISO) actualizada: ${patient.name}`);
                        setShowIsoModal(false);
                        showToast('ISO Actualizado', 'success');
                    }}
                />
            )}

            {showSessionModal && (
                <SessionModal
                    initialData={selectedSession}
                    patientType={patient.pathologyType || 'other'}
                    onClose={() => setShowSessionModal(false)}
                    onSave={handleSaveSession}
                    onDelete={handleDeleteSession}
                />
            )}
            {showCognitiveModal && (
                <CognitiveModal
                    onClose={() => {
                        setShowCognitiveModal(false);
                        setCognitiveInitialTab('general');
                    }}
                    onSave={(data) => {
                        onUpdate({
                            ...patient,
                            cognitiveScores: { ...patient.cognitiveScores, ...data },
                            currentEval: data.functionalScores,
                        });
                        setShowCognitiveModal(false);
                        setCognitiveInitialTab('general');
                        showToast('Evaluación actualizada', 'success');
                    }}
                    initialData={patient.cognitiveScores}
                    initialScores={patient.currentEval}
                    initialTab={cognitiveInitialTab}
                    isChild={isChild}
                    isGeriatric={patient.age >= 60}
                />
            )}
            {showGuideModal && <ClinicalGuideModal onClose={() => setShowGuideModal(false)} />}
            {showEditProfile && (
                <EditProfileModal
                    onClose={() => setShowEditProfile(false)}
                    onSave={(data) => {
                        onUpdate({ ...patient, ...data });
                        setShowEditProfile(false);
                        showToast('Perfil actualizado', 'success');
                    }}
                    initialData={patient}
                />
            )}
            {showInvoice && invoiceData && (
                <InvoiceGenerator
                    data={invoiceData}
                    onClose={() => setShowInvoice(false)}
                    clinicSettings={clinicSettings || {}}
                />
            )}
            {showReportModal && (
                <ReportModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    patient={patient}
                    clinicSettings={clinicSettings || {}}
                />
            )}
            {showAdmissionChecklist && (
                <AdmissionChecklistModal
                    onClose={() => setShowAdmissionChecklist(false)}
                    onSave={(data: any) => {
                        onUpdate({
                            ...patient,
                            cognitiveScores: { ...patient.cognitiveScores, admissionChecks: data },
                        });
                        setShowAdmissionChecklist(false);
                        showToast('Checklist guardado', 'success');
                    }}
                    initialData={patient.cognitiveScores?.admissionChecks}
                    isChild={isChild}
                />
            )}

            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                limitType="session"
            />

            {/* --- CRITICAL ALERTS BANNER --- */}
            {(highRisks.length > 0 || isoNocivo > 0) && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-start gap-4 w-full md:w-auto">
                        <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-red-800 flex items-center gap-2 text-sm md:text-base">
                                ALERTA DE SEGURIDAD CLÍNICA
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {highRisks.includes('epilepsy') && (
                                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-[10px] md:text-xs font-bold rounded">
                                        EPILEPSIA
                                    </span>
                                )}
                                {highRisks.includes('dysphagia') && (
                                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-[10px] md:text-xs font-bold rounded">
                                        DISFAGIA
                                    </span>
                                )}
                                {highRisks.includes('flightRisk') && (
                                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-[10px] md:text-xs font-bold rounded">
                                        RIESGO FUGA
                                    </span>
                                )}
                                {highRisks.includes('psychomotorAgitation') && (
                                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-[10px] md:text-xs font-bold rounded">
                                        AGITACIÓN
                                    </span>
                                )}
                                {isoNocivo > 0 && (
                                    <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-[10px] md:text-xs font-bold rounded">
                                        ISO NOCIVO ACTIVO
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button
                    className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                    onClick={onBack}
                >
                    <ArrowLeft size={18} /> Volver al Directorio
                </button>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant="primary"
                        size="sm"
                        icon={CalendarPlus}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        onClick={() => {
                            setSelectedSession(undefined);
                            setShowSessionModal(true);
                        }}
                    >
                        AGENDAR CITA
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        icon={FileText}
                        onClick={() => setShowReportModal(true)}
                    >
                        Informe
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Lightbulb}
                        onClick={() => setShowGuideModal(true)}
                    >
                        Guía
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
                        icon={Phone}
                        onClick={() => {
                            const targetPhone = patient.contact || patient.caregiverPhone;
                            if (targetPhone) {
                                window.location.href = `tel:${targetPhone.replace(/\s/g, '')}`;
                                logActivity('system', `Llamada iniciada con ${patient.name}`);
                            } else {
                                showToast('No hay teléfono registrado', 'error');
                            }
                        }}
                    >
                        Llamar
                    </Button>
                    {canDelete && (
                        <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => setShowDeleteModal(true)}
                            disabled={isDeleting}
                        >
                            Eliminar Paciente
                        </Button>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="¿Eliminar Paciente?"
                message={`Esta acción eliminará permanentemente a ${patient.name} y todo su historial clínico, sesiones y documentos. Esta acción NO se puede deshacer.`}
                confirmLabel={isDeleting ? 'Eliminando...' : 'Sí, Eliminar Definitivamente'}
                isLoading={isDeleting}
            />
            <Card noPadding className="overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                <div className="px-4 md:px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-end -mt-10 text-center md:text-left">
                        <div className="relative">
                            <div className="p-1.5 bg-white rounded-full">
                                <PatientAvatar photo={patient.photo} name={patient.name} size="xl" />
                            </div>
                        </div>
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                {patient.name}
                                <button
                                    onClick={() => setShowEditProfile(true)}
                                    className="text-slate-400 hover:text-pink-600 transition-colors"
                                >
                                    <Edit size={20} />
                                </button>
                            </h1>
                            <p className="text-slate-500 font-medium">{PATHOLOGY_MAP[patient.diagnosis] || patient.diagnosis}</p>
                        </div>
                        <div className="flex gap-4 pb-4">
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase">Edad</p>
                                <p className="text-sm font-bold text-slate-700">{patient.age} años</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase">Ingreso</p>
                                <p className="text-sm font-bold text-slate-700">{patient.joinedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="border-b border-slate-200 sticky top-0 bg-[#F8FAFC]/95 backdrop-blur-sm z-10 pt-2 md:pt-4">
                <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar px-4 md:px-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 flex items-center gap-2 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <tab.icon size={18} /> {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">

                {/* UNIFIED TREATMENT TAB */}
                {activeTab === 'treatment' && (
                    <div className="animate-in fade-in space-y-8">

                        {/* 1. CLINICAL FORMULATION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormulationSection
                                title="Síntesis Diagnóstica"
                                optionsKey="synthesis"
                                fieldKey="synthesis"
                                initialData={patient.clinicalFormulation?.synthesis as any}
                                onSave={(key, data) => {
                                    onUpdate({
                                        ...patient,
                                        clinicalFormulation: {
                                            ...patient.clinicalFormulation,
                                            [key]: data
                                        }
                                    });
                                    logActivity('report', 'Síntesis Diagnóstica actualizada');
                                    showToast('Síntesis guardada correctamente', 'success');
                                }}
                            />
                            <FormulationSection
                                title="Objetivos Terapéuticos"
                                optionsKey="objectives"
                                fieldKey="objectives"
                                initialData={patient.clinicalFormulation?.objectives as any}
                                onSave={(key, data) => {
                                    onUpdate({
                                        ...patient,
                                        clinicalFormulation: {
                                            ...patient.clinicalFormulation,
                                            [key]: data
                                        }
                                    });
                                    logActivity('report', 'Objetivos actualizados');
                                    showToast('Objetivos guardados correctamente', 'success');
                                }}
                            />
                        </div>

                        {/* 2. SAFETY & ISO PROTOCOLS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* SAFETY */}
                            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 z-0 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <ShieldCheck className="text-red-600" size={20} /> Seguridad Clínica
                                        </h3>
                                        <Button size="sm" variant="secondary" onClick={() => setShowSafetyModal(true)}>
                                            Editar Seguridad
                                        </Button>
                                    </div>

                                    {patient.safetyProfile ? (
                                        <div className="space-y-4">
                                            {highRisks.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {highRisks.map((r) => (
                                                        <Badge key={r} variant="error">
                                                            {RISK_LABELS[r] || r}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-emerald-600 text-sm font-bold flex items-center gap-2">
                                                    <CheckSquare size={16} /> Sin riesgos físicos críticos
                                                </span>
                                            )}
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Movilidad</p>
                                                    <p className="font-bold text-slate-700 capitalize text-sm">
                                                        {MOBILITY_MAP[patient.safetyProfile.mobilityAid || 'none'] || patient.safetyProfile.mobilityAid}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Alergias</p>
                                                    <p className="text-sm text-slate-600 truncate">{patient.safetyProfile.allergies || 'Ninguna'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                            <Button size="sm" onClick={() => setShowSafetyModal(true)}>Configurar Seguridad</Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ISO */}
                            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 z-0 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Music className="text-indigo-600" size={20} /> Identidad Sonora (ISO)
                                        </h3>
                                        <Button size="sm" variant="secondary" onClick={() => setShowIsoModal(true)}>
                                            Editar ISO
                                        </Button>
                                    </div>
                                    {patient.musicalIdentity ? (
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">ISO Nocivo</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {patient.musicalIdentity.dislikes.length > 0 ?
                                                        patient.musicalIdentity.dislikes.map((s, i) => <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{s}</span>)
                                                        : <span className="text-xs text-slate-400">-</span>
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Favoritos</p>
                                                <p className="text-sm text-slate-600 truncate">
                                                    {patient.musicalIdentity.likes.join(', ') || 'Sin favoritos registrados'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Instrumentos</p>
                                                <p className="text-sm text-slate-600 truncate">
                                                    {patient.musicalIdentity.instrumentsOfInterest?.join(', ') || 'Ninguno registrado'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                            <Button size="sm" onClick={() => setShowIsoModal(true)}>Crear Perfil Musical</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. PHASE CARD */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex items-center gap-8 relative overflow-hidden">
                            <div
                                className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${TREATMENT_PHASES[1].color} opacity-10 rounded-full blur-3xl -mr-16 -mt-16`}
                            ></div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge variant="brand">Fase {currentPhase.id} de 5</Badge>
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        Plan de 20 Sesiones
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">{currentPhase.name}</h2>
                                <p className="text-slate-500">Objetivo: {currentPhase.focus}</p>
                            </div>
                            <div className="relative z-10 text-right">
                                <div className="text-4xl font-black text-slate-900">{validSessions.length}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase">Sesiones</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'evaluation' && (
                    <Card className="animate-in fade-in p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-slate-800 text-lg">Evolución Clínica</h3>
                            <div className="flex gap-4 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-slate-300 rounded-full" /> Línea Base
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full" /> Actual
                                </span>
                            </div>
                        </div>

                        <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
                                <BarChart3 size={16} className="text-pink-600" /> Curva de Progreso (Índice Global)
                            </h4>
                            <EvidenceChart sessions={patient.sessions || []} />
                        </div>

                        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 md:flex md:gap-8 gap-4">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                    MOCA (Cognitivo)
                                </span>
                                <span className="text-lg font-bold text-slate-800">
                                    {patient.cognitiveScores?.moca || '-'}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                    MMSE (Mini-Mental)
                                </span>
                                <span className="text-lg font-bold text-slate-800">
                                    {patient.cognitiveScores?.mmse || '-'}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                    GDS (Reisberg)
                                </span>
                                <span className="text-lg font-bold text-slate-800">
                                    {patient.cognitiveScores?.gds || '-'}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                    Fecha Evaluación
                                </span>
                                <span className="text-sm font-medium text-slate-600">
                                    {patient.cognitiveScores?.date || '-'}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="col-span-2 md:col-span-1 md:ml-auto h-fit my-auto w-full md:w-auto mt-2 md:mt-0"
                                onClick={() => setShowCognitiveModal(true)}
                                icon={PenTool}
                            >
                                Actualizar Evaluación
                            </Button>
                        </div>
                    </Card>
                )}

                {activeTab === 'documents' && (
                    <Card className="animate-in fade-in p-6">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                            <Folder className="text-pink-600" /> Expediente Digital
                        </h3>
                        <DocumentsTab />
                    </Card>
                )}

                {activeTab === 'sessions' && (
                    <div className="space-y-6 animate-in fade-in">
                        <PhaseProgress
                            sessionCount={validSessions.length}
                            adherence={
                                activeSessions.length > 0
                                    ? Math.round((validSessions.length / activeSessions.length) * 100)
                                    : 100
                            }
                        />
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Historial de Sesiones</h3>
                            <Button
                                icon={PlusCircle}
                                onClick={() => {
                                    if (!isPremium && (patient.sessions || []).length >= 1) {
                                        setShowPaywall(true);
                                        return;
                                    }
                                    setSelectedSession(undefined);
                                    setShowSessionModal(true);
                                }}
                            >
                                Nueva Sesión
                            </Button>
                        </div>
                        {activeSessions.map((s) => (
                            <div
                                key={s.id}
                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex gap-4"
                            >
                                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg h-fit min-w-[80px]">
                                    <span className="text-xs font-bold text-slate-400 uppercase">
                                        {new Date(s.date.split('/').reverse().join('-')).toLocaleDateString('es-ES', {
                                            month: 'short',
                                        })}
                                    </span>
                                    <span className="text-xl font-black text-slate-800">
                                        {new Date(s.date.split('/').reverse().join('-')).getDate()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-800">Sesión Clínica</h4>
                                            {s.isAbsent ? (
                                                <Badge variant="error">Ausencia</Badge>
                                            ) : (
                                                <Badge variant="neutral">Fase {sessionPhaseMap[s.id] || 1}</Badge>
                                            )}
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                icon={Edit}
                                                onClick={() => {
                                                    setSelectedSession(s);
                                                    setShowSessionModal(true);
                                                }}
                                            >
                                                {null}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-400 hover:bg-red-50 hover:text-red-600"
                                                icon={Trash2}
                                                onClick={() => handleDeleteSession(s.id)}
                                            >
                                                {null}
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{s.notes}</p>
                                    <div className="mt-3 flex gap-2">
                                        {s.activityDetails && Object.keys(s.activityDetails).length > 0
                                            ? Object.keys(s.activityDetails).map((k) => (
                                                <Badge key={k} variant="brand">
                                                    {k}
                                                </Badge>
                                            ))
                                            : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="animate-in fade-in">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700">Control de Pagos</h3>
                                <div className="flex gap-3">
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Deuda Total</p>
                                        <p className="text-xl font-black text-red-600">
                                            {activeSessions.reduce((acc, s) => acc + (s.paid ? 0 : s.price || 0), 0)} €
                                        </p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="md"
                                        onClick={handlePrintGlobalInvoice}
                                        icon={FileText}
                                    >
                                        Generar Factura Global
                                    </Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                                        <tr>
                                            <th className="px-6 py-3">Fecha</th>
                                            <th className="px-6 py-3">Concepto</th>
                                            <th className="px-6 py-3">Importe</th>
                                            <th className="px-6 py-3 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {activeSessions.map((s) => (
                                            <tr key={s.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-mono text-slate-500 whitespace-nowrap">
                                                    {s.date}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900 min-w-[200px]">
                                                    Sesión {s.type === 'group' ? 'Grupal' : 'Individual'}
                                                    {s.isAbsent && (
                                                        <span className="text-red-500 ml-2 text-xs font-bold">(Ausencia)</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-700">{s.price}€</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            const isPaying = !s.paid;
                                                            const updated = patient.sessions?.map((sess) =>
                                                                sess.id === s.id ? { ...sess, paid: isPaying } : sess,
                                                            );
                                                            if (updated) {
                                                                onUpdate({ ...patient, sessions: updated });
                                                                if (isPaying) logActivity('finance', `Pago registrado: Sesión de ${patient.name}`);
                                                            }
                                                        }}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${s.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                                    >
                                                        {s.paid ? 'PAGADO' : 'PENDIENTE'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'discharge' && (
                    <div className="animate-in fade-in space-y-6">
                        <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-100 flex items-start gap-6">
                            <div className="p-4 bg-white rounded-full text-emerald-600 shadow-sm">
                                <CheckSquare size={32} />
                            </div>
                            <div className="space-y-4 flex-1">
                                <h3 className="font-bold text-emerald-900 text-lg">
                                    Criterios de Alta Terapéutica
                                </h3>
                                <p className="text-emerald-800/80 leading-relaxed">
                                    El proceso de alta se inicia cuando se han alcanzado &gt;80% de los objetivos
                                    terapéuticos o por decisión clínica justificada. Asegúrese de completar el informe
                                    final antes de archivar el expediente.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-white p-4 rounded-lg border border-emerald-100 flex items-center gap-3">
                                        <div
                                            className={`w-3 h-3 rounded-full ${validSessions.length >= 20 ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        />
                                        <span className="text-sm font-medium text-slate-700">
                                            Ciclo Completo (20 Sesiones)
                                        </span>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-emerald-100 flex items-center gap-3">
                                        <div
                                            className={`w-3 h-3 rounded-full ${patient.cognitiveScores?.gds ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        />
                                        <span className="text-sm font-medium text-slate-700">
                                            Reevaluación Final Realizada
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setShowAdmissionChecklist(true)}
                                        variant="secondary"
                                        icon={ClipboardCheck}
                                    >
                                        Admisión
                                    </Button>
                                    <Button
                                        onClick={() => setShowReportModal(true)}
                                        variant="secondary"
                                        icon={FileText}
                                    >
                                        Informe
                                    </Button>
                                    <Button
                                        variant="danger"
                                        icon={Trash2}
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "¿Archivar paciente como 'Alta Clínica'? Esta acción moverá el expediente al histórico.",
                                                )
                                            ) {
                                                logActivity('system', `Alta Clínica: Paciente ${patient.name} archivado`);
                                                showToast('Paciente archivado correctamente', 'success');
                                                onBack();
                                            }
                                        }}
                                    >
                                        Archivar Expediente
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

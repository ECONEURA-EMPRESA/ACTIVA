import React, { useState } from 'react';
import {
    ShieldAlert,
    AlertTriangle,
    HeartPulse,
    CheckCircle2,
    X,
    ShieldCheck
} from 'lucide-react';
import { ClinicalSafetyProfile } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';

interface SafetyModalProps {
    onClose: () => void;
    onSave: (data: ClinicalSafetyProfile) => void;
    initialData?: ClinicalSafetyProfile;
    isChild?: boolean;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
    onClose,
    onSave,
    initialData,
    isChild = false,
}) => {
    const [safety, setSafety] = useState<ClinicalSafetyProfile>(
        initialData || {
            epilepsy: false,
            dysphagia: false,
            flightRisk: false,
            psychomotorAgitation: false,
            hyperacusis: false,
            chokingHazard: false,
            disruptiveBehavior: false,
            alerts: [],
            mobilityAid: 'none',
            allergies: '',
        },
    );

    const toggleSafety = (field: keyof ClinicalSafetyProfile) => {
        setSafety((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 max-h-[90vh]">
                {/* HEADER */}
                <div className="bg-red-50 p-6 flex justify-between items-center shrink-0 rounded-t-2xl border-b border-red-100">
                    <div>
                        <h2 className="text-xl font-black flex items-center gap-2 text-red-800">
                            <ShieldAlert className="text-red-600" size={24} />
                            Seguridad Clínica
                        </h2>
                        <p className="text-red-600/70 text-sm mt-0.5 font-medium">
                            Protocolo de Riesgos y Asistencia Física
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-400 hover:text-red-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* 1. ALERTAS */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <AlertTriangle size={14} /> Alertas Críticas (Semáforo Rojo)
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {!isChild && (
                                <>
                                    <RiskToggle
                                        label="Riesgo Fuga"
                                        desc="Deambulación errante"
                                        active={safety.flightRisk}
                                        onClick={() => toggleSafety('flightRisk')}
                                    />
                                    <RiskToggle
                                        label="Disfagia"
                                        desc="Riesgo Aspiración"
                                        active={safety.dysphagia}
                                        onClick={() => toggleSafety('dysphagia')}
                                    />
                                </>
                            )}
                            <RiskToggle
                                label="Epilepsia"
                                desc="Crisis convulsivas"
                                active={safety.epilepsy}
                                onClick={() => toggleSafety('epilepsy')}
                            />
                            <RiskToggle
                                label="Agitación"
                                desc="Conducta agresiva"
                                active={safety.psychomotorAgitation}
                                onClick={() => toggleSafety('psychomotorAgitation')}
                            />
                            {isChild && (
                                <>
                                    <RiskToggle
                                        label="Hiperacusia"
                                        desc="Sensibilidad Auditiva"
                                        active={safety.hyperacusis}
                                        onClick={() => toggleSafety('hyperacusis')}
                                    />
                                    <RiskToggle
                                        label="Atragantar"
                                        desc="Pica / Ingesta objetos"
                                        active={safety.chokingHazard}
                                        onClick={() => toggleSafety('chokingHazard')}
                                    />
                                </>
                            )}
                        </div>
                    </section>

                    {/* 2. MOVILIDAD */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <HeartPulse size={14} /> Movilidad y Asistencia
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                                { val: 'none', label: 'Autónoma' },
                                { val: 'cane', label: 'Bastón' },
                                { val: 'walker', label: 'Andador' },
                                { val: 'wheelchair', label: 'Silla Ruedas' },
                                { val: 'bed', label: 'Encamado' },
                            ].map((opt) => (
                                <button
                                    key={opt.val}
                                    onClick={() => setSafety({ ...safety, mobilityAid: opt.val as ClinicalSafetyProfile['mobilityAid'] })}
                                    className={`text-sm py-2 px-3 rounded-lg border font-medium transition-all ${safety.mobilityAid === opt.val
                                        ? 'bg-red-600 text-white border-red-600 shadow-md transform scale-105'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 3. ALERGIAS */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ShieldCheck size={14} /> Alergias y Contraindicaciones
                        </h3>
                        <textarea
                            className="w-full h-32 p-4 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:ring-0 resize-none text-slate-700 bg-slate-50 text-sm leading-relaxed"
                            placeholder="Escriba aquí alergias severas (medicamentos, alimentos) o contraindicaciones importantes..."
                            value={safety.allergies || ''}
                            onChange={(e) => setSafety({ ...safety, allergies: e.target.value })}
                        />
                    </section>

                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-2xl">
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => onSave(safety)}
                        className="bg-red-600 hover:bg-red-700 text-white border-red-700 shadow-lg shadow-red-100"
                        icon={CheckCircle2}
                    >
                        Confirmar Seguridad
                    </Button>
                </div>
            </div>
        </div>
    );
};

const RiskToggle = ({ label, desc, active, onClick }: { label: string; desc: string; active: boolean; onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`p-3 rounded-xl border cursor-pointer transition-all active:scale-95 ${active
            ? 'bg-red-50 border-red-500 ring-1 ring-red-500'
            : 'bg-white border-slate-200 hover:border-red-200 hover:shadow-sm'
            }`}
    >
        <div className="flex justify-between items-start mb-1">
            <h4 className={`font-bold text-sm ${active ? 'text-red-700' : 'text-slate-700'}`}>{label}</h4>
            {active && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
        </div>
        <p className="text-xs text-slate-400 leading-tight">
            {desc}
        </p>
    </div>
);

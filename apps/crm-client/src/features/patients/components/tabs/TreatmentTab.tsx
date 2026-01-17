import React, { useState } from 'react';
import { ShieldCheck, Music, CheckSquare } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { Patient, FormulationData, ClinicalSafetyProfile, MusicalIdentity } from '../../../../lib/types';
import { FormulationSection } from '../FormulationSection';
import { useActivityLog } from '../../../../hooks/useActivityLog';
import { TREATMENT_PHASES } from '../../../../lib/clinicalUtils';
import { MOBILITY_MAP } from '../../../../lib/patientUtils';
import { SafetyModal } from '../../modals/SafetyModal';
import { MusicalIdentityModal } from '../../modals/MusicalIdentityModal';
import { Toast } from '../../../../components/ui/Toast';

interface TreatmentTabProps {
    patient: Patient;
    onUpdate: (updated: Patient) => void;
}

const RISK_LABELS: Record<string, string> = {
    epilepsy: 'Epilepsia',
    dysphagia: 'Disfagia',
    flightRisk: 'Riesgo Fuga',
    psychomotorAgitation: 'Agitación',
    hyperacusis: 'Hiperacusia',
    chokingHazard: 'Riesgo Atragantamiento',
    disruptiveBehavior: 'Conducta Disruptiva',
};

export const TreatmentTab: React.FC<TreatmentTabProps> = ({ patient, onUpdate }) => {
    const { logActivity } = useActivityLog();
    const [showSafetyModal, setShowSafetyModal] = useState(false);
    const [showIsoModal, setShowIsoModal] = useState(false);
    const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const validSessions = patient.sessions ? patient.sessions.filter((s) => !s.isAbsent) : [];
    const currentPhase =
        TREATMENT_PHASES.find((p) => {
            const parts = p.range.split('-');
            const min = parseInt(parts[0]);
            const max = parseInt(parts[1]);
            return validSessions.length >= min && validSessions.length <= max;
        }) || TREATMENT_PHASES[0];

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

    return (
        <div className="animate-in fade-in space-y-8 relative">
            {notification && (
                <Toast
                    message={notification.msg}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* MODALS */}
            {showSafetyModal && (
                <SafetyModal
                    onClose={() => setShowSafetyModal(false)}
                    isChild={patient.age < 15}
                    initialData={patient.safetyProfile || undefined}
                    onSave={(data) => {
                        onUpdate({ ...patient, safetyProfile: data as ClinicalSafetyProfile });
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
                        onUpdate({ ...patient, musicalIdentity: data as MusicalIdentity });
                        logActivity('security', `Identidad Sonora (ISO) actualizada: ${patient.name}`);
                        setShowIsoModal(false);
                        showToast('ISO Actualizado', 'success');
                    }}
                />
            )}

            {/* 1. CLINICAL FORMULATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormulationSection
                    key={`${patient.id}-synthesis`}
                    title="Síntesis Diagnóstica"
                    optionsKey="synthesis"
                    fieldKey="synthesis"
                    initialData={patient.clinicalFormulation?.synthesis as FormulationData}
                    patient={patient}
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
                    key={`${patient.id}-objectives`}
                    title="Objetivos Terapéuticos"
                    optionsKey="objectives"
                    fieldKey="objectives"
                    initialData={patient.clinicalFormulation?.objectives as FormulationData}
                    patient={patient}
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
    );
};

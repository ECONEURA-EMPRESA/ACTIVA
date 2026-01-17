import React, { useMemo } from 'react';
import { Button } from '../../../../components/ui/Button';
import { CheckSquare, ClipboardCheck, FileText, Trash2 } from 'lucide-react';
import { Patient } from '../../../../lib/types';
import { useActivityLog } from '../../../../hooks/useActivityLog';


interface DischargeTabProps {
    patient: Patient;
    onBack: () => void;
    onShowAdmission: () => void;
    onShowReport: () => void;
}

export const DischargeTab: React.FC<DischargeTabProps> = ({ patient, onBack, onShowAdmission, onShowReport }) => {
    const { logActivity } = useActivityLog();
    // Local toast since this tab has a destructive action "Archivar" which shows a toast and then navigates
    // Wait, onBack navigates. 
    // Ideally toast should be up the chain or global.
    // The original code used local showToast helper.
    // We can use a local toast state here for the "Archivar" action feedback before navigation?
    // Or just alert/confirm and rely on parent?
    // Original used `confirm` (browser) then logActivity, showToast, onBack.

    const validSessions = useMemo(() => patient.sessions ? patient.sessions.filter(s => !s.isAbsent) : [], [patient.sessions]);

    const handleArchive = () => {
        if (confirm("¿Archivar paciente como 'Alta Clínica'? Esta acción moverá el expediente al histórico.")) {
            logActivity('system', `Alta Clínica: Paciente ${patient.name} archivado`);
            // We can't easily show toast and navigate immediately without global toast.
            // But we will call onBack.
            onBack();
        }
    };

    return (
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
                            onClick={onShowAdmission}
                            variant="secondary"
                            icon={ClipboardCheck}
                        >
                            Admisión
                        </Button>
                        <Button
                            onClick={onShowReport}
                            variant="secondary"
                            icon={FileText}
                        >
                            Informe
                        </Button>
                        <Button
                            variant="danger"
                            icon={Trash2}
                            onClick={handleArchive}
                        >
                            Archivar Expediente
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

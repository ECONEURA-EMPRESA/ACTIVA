import React, { useMemo } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { PlusCircle, Edit, Trash2, Copy } from 'lucide-react';
import { PhaseProgress } from '../PhaseProgress';
import { Patient, Session } from '../../../../lib/types';
import { getPhaseForSessionIndex } from '../../../../lib/clinicalUtils';

interface ClinicalHistoryTabProps {
    patient: Patient;
    activeSessions: Session[]; // Pre-sorted sessions
    onNewSession: () => void;
    onEditSession: (session: Session) => void;
    onDeleteSession: (sessionId: string | number) => void;
    onCloneSession?: (session: Session) => void; // TITANIUM: Cloning
    isPremium: boolean;
    onShowPaywall: () => void;
}

export const ClinicalHistoryTab: React.FC<ClinicalHistoryTabProps> = ({
    patient,
    activeSessions,
    onNewSession,
    onEditSession,
    onDeleteSession,
    onCloneSession,
    isPremium,
    onShowPaywall
}) => {

    // Derived state for view
    const validSessions = useMemo(() => activeSessions.filter((s) => !s.isAbsent), [activeSessions]);

    // Re-calculate phase map for display (Logic restored from PatientDetail)
    const sessionPhaseMap = useMemo(() => {
        const map: Record<string, number> = {};
        let validCount = 0;
        // Process chronologically (Oldest -> Newest) for correct phase index
        [...activeSessions].reverse().forEach((s) => {
            if (!s.isAbsent) {
                validCount++;
                map[s.id] = getPhaseForSessionIndex(validCount - 1);
            }
        });
        return map;
    }, [activeSessions]);

    return (
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
                            onShowPaywall();
                            return;
                        }
                        onNewSession();
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
                                {onCloneSession && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                                        icon={Copy}
                                        onClick={() => onCloneSession(s)}
                                        title="Clonar Sesión"
                                    >
                                        {null}
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    icon={Edit}
                                    onClick={() => onEditSession(s)}
                                >
                                    {null}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:bg-red-50 hover:text-red-600"
                                    icon={Trash2}
                                    onClick={() => onDeleteSession(s.id)}
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
    );
};

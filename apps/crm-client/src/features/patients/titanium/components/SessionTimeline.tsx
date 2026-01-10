import React from 'react';
import { Session } from '@monorepo/shared';
import { Card } from '../../../../components/ui/Card';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SessionTimelineProps {
    sessions: Session[];
    onAddSession: () => void;
}

export const SessionTimeline: React.FC<SessionTimelineProps> = ({ sessions, onAddSession }) => {
    // Sort by date desc (assuming date is sortable string dd/mm/yyyy or iso... 
    // actually our schema says dd/mm/yyyy, so we might need simple reverse if already sorted, 
    // or parse. For now, let's just map reverse if we assume implicit order, or just map.)
    // Let's assume sessions come in order or reverse order.

    const sortedSessions = [...sessions].reverse(); // Show newest first

    if (sessions.length === 0) {
        return (
            <Card className="p-8 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                <div className="flex flex-col items-center gap-3">
                    <Calendar className="w-10 h-10 text-slate-300" />
                    <p className="text-slate-500 font-medium">No hay sesiones registradas</p>
                    <button
                        onClick={onAddSession}
                        className="text-brand-600 hover:text-brand-700 text-sm font-semibold hover:underline"
                    >
                        Registrar primera sesión
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-600" />
                    Historial de Sesiones
                </h3>
            </div>

            <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {sortedSessions.slice(0, 5).map((session, index) => (
                    <div key={session.id || index} className="relative pl-10">
                        <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-brand-200 z-10" />
                        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {session.type === 'individual' ? 'Sesión Individual' : 'Sesión Grupal'}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">{session.date}</p>
                                </div>
                                {session.paid ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        PAGADO
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                                        <XCircle className="w-3 h-3" />
                                        PENDIENTE
                                    </span>
                                )}
                            </div>
                            {session.notes && (
                                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                                    {session.notes}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {sessions.length > 5 && (
                <div className="mt-4 text-center">
                    <button className="text-sm text-slate-500 hover:text-brand-600 font-medium">
                        Ver todas las {sessions.length} sesiones
                    </button>
                </div>
            )}
        </Card>
    );
};

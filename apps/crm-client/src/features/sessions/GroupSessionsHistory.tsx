import React from 'react';
import { useSessionController } from '../../hooks/controllers/useSessionController';
import { Users, Clock, Heart, Activity, Zap } from 'lucide-react';
import { GroupSession } from '../../lib/types';

interface GroupSessionsHistoryProps {
    sessions?: GroupSession[];
}

export const GroupSessionsHistory: React.FC<GroupSessionsHistoryProps> = ({ sessions }) => {
    const { groupHistory: internalHistory, isLoadingHistory } = useSessionController();

    // Helper to parse dates (handles ISO and DD/MM/YYYY)
    const parseDate = (dString: string) => {
        if (!dString) return 0;
        if (dString.includes('/')) {
            const [day, month, year] = dString.split('/').map(Number);
            return new Date(year, month - 1, day).getTime();
        }
        return new Date(dString).getTime();
    };

    // Sort by date descending if using props
    const displayHistory = sessions
        ? [...sessions].sort((a, b) => parseDate(b.date) - parseDate(a.date))
        : internalHistory;

    const loading = sessions ? false : isLoadingHistory;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        Bitácora Grupal
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Histórico completo de intervenciones grupales y métricas de evolución.
                    </p>
                </div>
            </header>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Placeholder Stats */}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="p-4 font-bold text-slate-600 text-sm w-32">Fecha</th>
                                <th className="p-4 font-bold text-slate-600 text-sm">Grupo / Actividad</th>
                                <th className="p-4 font-bold text-slate-600 text-sm w-48">Métricas</th>
                                <th className="p-4 font-bold text-slate-600 text-sm text-right">Participantes</th>
                                <th className="p-4 font-bold text-slate-600 text-sm text-right">Recaudación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Cargando historial...</td></tr>
                            ) : displayHistory.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No hay sesiones grupales registradas.</td></tr>
                            ) : (
                                displayHistory.map((s) => {
                                    const session = s as GroupSession;
                                    return (
                                        <tr key={session.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="p-4 font-bold text-slate-700 w-32 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-slate-300" />
                                                    {session.date}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">{session.groupName || 'Grupo Sin Nombre'}</div>
                                                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                                    {session.location && <span>📍 {session.location}</span>}
                                                    {session.time && <span>⏰ {session.time}</span>}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${(session.engagementScore || 0) >= 7 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                                                        }`}>
                                                        <Activity size={10} /> {session.engagementScore || '-'}
                                                    </div>
                                                    <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${(session.cohesionScore || 0) >= 7 ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                                                        }`}>
                                                        <Heart size={10} /> {session.cohesionScore || '-'}
                                                    </div>
                                                    {session.energyLevel && (
                                                        <div className="px-2 py-0.5 rounded-md text-[10px] font-bold border bg-amber-50 border-amber-200 text-amber-700 flex items-center gap-1">
                                                            <Zap size={10} /> {session.energyLevel === 'High' ? 'Alta' : session.energyLevel === 'Medium' ? 'Media' : 'Baja'}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                                                    <Users size={12} /> {session.participantNames?.length || 0}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-black text-slate-700">
                                                {session.price ? `${session.price} €` : '-'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, ArrowRight, LayoutGrid, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { GroupSession } from '../../lib/types';
import { GroupSessionsHistory } from '../sessions/GroupSessionsHistory'; // Imported History Component

interface GroupsDirectoryProps {
    groupSessions?: GroupSession[];
    onSelectGroup: (groupName: string) => void;
    onNewGroup: () => void;
}

export const GroupsDirectory: React.FC<GroupsDirectoryProps> = ({
    groupSessions = [],
    onSelectGroup,
    onNewGroup,
}) => {
    const [activeTab, setActiveTab] = useState<'directory' | 'history'>('directory');
    const [search, setSearch] = useState('');

    // 1. Extract Unique Groups from Sessions
    const activeGroups = useMemo(() => {
        const groups = new Map<string, { count: number; lastDate: string; participants: number }>();

        groupSessions.forEach(s => {
            if (!s.groupName) return;
            const existing = groups.get(s.groupName) || { count: 0, lastDate: '', participants: 0 };
            groups.set(s.groupName, {
                count: existing.count + 1,
                lastDate: s.date > existing.lastDate ? s.date : existing.lastDate,
                participants: Math.max(existing.participants, s.participantNames?.length || 0)
            });
        });

        return Array.from(groups.entries()).map(([name, stats]) => ({
            name,
            type: 'active' as const,
            ...stats
        }));
    }, [groupSessions]);

    const filteredGroups = activeGroups.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
            {/* Header Unified */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Gestión Grupal
                    </h1>
                    <p className="text-slate-500 mt-1">Directorio de grupos e histórico de intervenciones</p>
                </div>
                {activeTab === 'directory' && (
                    <div className="flex gap-3">
                        <Button icon={Plus} onClick={onNewGroup}>
                            Añadir Grupo
                        </Button>
                    </div>
                )}
            </header>

            {/* Main Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('directory')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'directory' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <LayoutGrid size={16} /> Directorio
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Clock size={16} /> Historial Global
                </button>
            </div>

            {/* Content Switch */}
            {activeTab === 'directory' ? (
                <>
                    {/* Toolbar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            className="input-pro pl-10"
                            placeholder="Buscar grupo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredGroups.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Users size={48} className="mx-auto mb-4 text-slate-300" />
                                <p className="font-bold text-slate-500">No hay grupos activos</p>
                                <p className="text-sm text-slate-400 mt-2">Crea uno nuevo para empezar a registrar sesiones</p>
                            </div>
                        )}

                        {filteredGroups.map((g) => (
                            <Card
                                key={g.name}
                                hoverable
                                onClick={() => onSelectGroup(g.name)}
                                className="cursor-pointer group relative overflow-hidden border border-slate-200"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex flex-col items-center text-center p-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-purple-200">
                                            <span className="text-2xl font-black">{g.name.charAt(0)}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-purple-600 transition-colors line-clamp-2">
                                            {g.name}
                                        </h3>
                                        <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                            Grupo Terapéutico
                                        </span>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-2 text-center">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sesiones</p>
                                            <p className="font-bold text-slate-700 text-lg">{g.count}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participantes</p>
                                            <p className="font-bold text-slate-700 text-lg">~{g.participants}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 flex justify-center border-t border-slate-50">
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-purple-600 flex items-center gap-1 transition-colors">
                                            Ver Evolución <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <GroupSessionsHistory />
            )}
        </div>
    );
};

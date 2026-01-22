import React from 'react';
import { Card } from '../../components/ui/Card';
import { Search, ShieldAlert, Loader2 } from 'lucide-react';
import { useActivityLog } from '../../hooks/useActivityLog';

export const AuditView: React.FC = () => {
    const { activities, isLoading } = useActivityLog();
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredLogs = activities.filter(log =>
        log.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.message?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ShieldAlert className="text-pink-600" /> Audit Log
                    </h1>
                    <p className="text-slate-500 text-lg mt-1">Registro de seguridad y cumplimiento HIPAA/GDPR</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                        className="input-pro pl-10"
                        placeholder="Buscar en logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <Card className="overflow-hidden" noPadding>
                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="animate-spin text-pink-600" />
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Mensaje</th>
                                <th className="px-6 py-4">Usuario ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        <span className={`px-2 py-1 rounded border text-xs uppercase ${log.type === 'security' ? 'bg-red-50 border-red-100 text-red-600' :
                                            log.type === 'delete' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                                'bg-slate-100 border-slate-200 text-slate-600'
                                            }`}>
                                            {log.type || 'SYSTEM'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 font-medium">{log.message || log.type}</td>
                                    <td className="px-6 py-4 text-slate-400 text-xs font-mono">{log.userId}</td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400">
                                        No se encontraron registros de auditoría.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
};

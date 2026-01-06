import React from 'react';
import { Card } from '../../components/ui/Card';
import { Search, ShieldAlert } from 'lucide-react';

const MOCK_LOGS = [
    { id: 1, action: 'LOGIN_SUCCESS', user: 'admin@activa.com', ip: '192.168.1.1', timestamp: '2023-10-25 09:00:00' },
    { id: 2, action: 'PATIENT_VIEW', user: 'admin@activa.com', target: 'Juan Pérez', timestamp: '2023-10-25 09:05:23' },
    { id: 3, action: 'NOTE_CREATED', user: 'terapeuta@activa.com', target: 'Maria García', timestamp: '2023-10-25 10:30:00' },
    { id: 4, action: 'SETTINGS_UPDATE', user: 'admin@activa.com', target: 'Global Config', timestamp: '2023-10-25 11:15:00' },
];

export const AuditView: React.FC = () => {
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
                    <input className="input-pro pl-10" placeholder="Buscar en logs..." />
                </div>
            </header>

            <Card className="overflow-hidden" noPadding>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Acción</th>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Detalle / IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_LOGS.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-500">{log.timestamp}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">
                                    <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-xs">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-pink-600 font-medium">{log.user}</td>
                                <td className="px-6 py-4 text-slate-500">{log.target || log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

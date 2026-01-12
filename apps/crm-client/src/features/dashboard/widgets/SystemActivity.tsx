import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Activity, UserPlus, Settings2, CalendarCheck, FileSignature, CreditCard, ShieldCheck, FileX, Loader2 } from 'lucide-react';
import { ActivityLogItem } from '../../../hooks/useActivityLog';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface SystemActivityProps {
    activities: ActivityLogItem[];
    isLoading?: boolean;
}

export const SystemActivity: React.FC<SystemActivityProps> = ({ activities, isLoading }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'patient': return <UserPlus size={16} className="text-emerald-600" />;
            case 'settings': return <Settings2 size={16} className="text-slate-600" />;
            case 'session': return <CalendarCheck size={16} className="text-pink-600" />;
            case 'report': return <FileSignature size={16} className="text-purple-600" />; // Premium Doc
            case 'finance': return <CreditCard size={16} className="text-amber-600" />; // Premium Pay
            case 'security': return <ShieldCheck size={16} className="text-indigo-600" />; // Premium Sec
            case 'delete': return <FileX size={16} className="text-red-500" />; // Premium Void
            default: return <Activity size={16} className="text-blue-600" />;
        }
    };

    return (
        <Card className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Activity className="text-indigo-500" /> Registro de Actividad
                </h3>
            </div>

            <div className="space-y-4 flex-1">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-indigo-500" size={24} />
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        Sin actividad registrada aún.
                    </div>
                ) : (
                    activities.map((item) => (
                        <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className="mt-1 p-2 bg-slate-50 rounded-lg shrink-0">
                                {getIcon(item.type)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 leading-tight">
                                    {item.message}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: es })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

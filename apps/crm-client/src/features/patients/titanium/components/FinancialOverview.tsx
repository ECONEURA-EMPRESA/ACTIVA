import { Card } from '../../../../components/ui/Card';
import { DollarSign, AlertCircle } from 'lucide-react';

interface FinancialOverviewProps {
    stats: {
        totalSessions: number;
        completedSessions: number;
        revenue: number;
        attendanceRate: number;
    };
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ stats }) => {
    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-brand-600" />
                Resumen Financiero
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                        Ingresos Totales
                    </p>
                    <p className="text-2xl font-bold text-emerald-900">
                        {stats.revenue}€
                    </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                        Asistencia
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                        {stats.attendanceRate}%
                    </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                        Total Sesiones
                    </p>
                    <p className="text-xl font-bold text-slate-800">
                        {stats.totalSessions}
                    </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">
                        Completadas
                    </p>
                    <p className="text-xl font-bold text-purple-900">
                        {stats.completedSessions}
                    </p>
                </div>
            </div>

            {stats.attendanceRate < 80 && stats.totalSessions > 5 && (
                <div className="mt-4 flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-800">
                        <strong>Atención:</strong> La tasa de asistencia está por debajo del 80%. Considera revisar el horario o recordatorios.
                    </p>
                </div>
            )}
        </Card>
    );
};

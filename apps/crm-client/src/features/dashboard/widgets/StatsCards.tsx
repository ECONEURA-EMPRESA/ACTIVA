import React from 'react';
import { Users, CalendarDays } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

interface StatsCardsProps {
  activePatients: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ activePatients }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-8 flex items-center gap-6 hoverable transform transition-transform hover:-translate-y-1">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl shadow-inner">
          <Users size={32} />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
            Pacientes Activos
          </p>
          <h3 className="text-4xl font-black text-slate-900">{activePatients}</h3>
        </div>
      </Card>
      <Card className="p-8 flex items-center gap-6 hoverable transform transition-transform hover:-translate-y-1">
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-2xl shadow-inner">
          <CalendarDays size={32} />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
            Fecha Actual
          </p>
          <h3 className="text-2xl font-black text-slate-900 capitalize">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h3>
        </div>
      </Card>
    </div>
  );
};

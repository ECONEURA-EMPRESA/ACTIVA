import React from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Patient, Session } from '../../../lib/types';
import { TREATMENT_PHASES } from '../../../lib/constants';

interface RecentActivityProps {
  patients: Patient[];
  onNavigate: (view: string, patient?: Patient) => void;
}

interface RecentSession extends Session {
  patientName: string;
  patientId: string | number; // Ensure id is handled as string or number
  computedPhase?: number | null;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ patients, onNavigate }) => {
  // Función auxiliar para calcular fase basada en el número de sesión válida
  const getPhaseForSessionIndex = (index: number) => {
    // index es 0-based, el conteo es index + 1
    const count = index + 1;
    return (
      TREATMENT_PHASES.find((p) => {
        const [min, max] = p.range.split('-').map(Number);
        return count >= min && count <= max;
      })?.id || 1
    );
  };

  const recentSessions: RecentSession[] = patients
    .flatMap((p) => {
      // Obtenemos todas las sesiones válidas ordenadas cronológicamente (antiguas primero)
      const validSessionsAsc = (p.sessions || [])
        .filter((s) => !s.isAbsent)
        .sort((a, b) => {
          const [d1, m1, y1] = a.date.split('/');
          const [d2, m2, y2] = b.date.split('/');
          return new Date(`${y1}-${m1}-${d1}`).getTime() - new Date(`${y2}-${m2}-${d2}`).getTime();
        });

      // Mapeamos todas las sesiones para el dashboard
      return (p.sessions || []).map((s) => {
        let phaseDisplay = null;

        // Si asistió, calculamos en qué posición está dentro de las válidas
        if (!s.isAbsent) {
          const validIndex = validSessionsAsc.findIndex((vs) => vs.id === s.id);
          if (validIndex !== -1) {
            phaseDisplay = getPhaseForSessionIndex(validIndex);
          }
        }

        return {
          ...s,
          patientName: p.name,
          patientId: p.id,
          computedPhase: phaseDisplay, // Fase calculada automáticamente
        };
      });
    })
    .sort((a, b) => {
      const [d1, m1, y1] = a.date.split('/');
      const [d2, m2, y2] = b.date.split('/');
      // Descending order for display
      return new Date(`${y2}-${m2}-${d2}`).getTime() - new Date(`${y1}-${m1}-${d1}`).getTime();
    })
    .slice(0, 5);

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <Activity className="text-pink-500" /> Últimas Sesiones
        </h3>
        <button
          onClick={() => onNavigate('sessions')}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Ver todo
        </button>
      </div>
      <div className="space-y-3 flex-1">
        {recentSessions.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
            onClick={() => {
              const p = patients.find((pat) => pat.id === s.patientId);
              if (p) onNavigate('detail', p);
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-pink-600 font-black text-sm shrink-0 group-hover:scale-110 transition-transform">
              {s.patientName?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-slate-900">{s.patientName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {s.date} •{' '}
                {s.isAbsent ? (
                  <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                    Ausencia
                  </span>
                ) : s.computedPhase ? (
                  `Fase ${s.computedPhase}`
                ) : (
                  'Sesión'
                )}
              </p>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-300 group-hover:text-pink-500 transition-colors"
            />
          </div>
        ))}
        {recentSessions.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              icon={Activity}
              title="Sin actividad reciente"
              description="No hay sesiones registradas en los últimos días. ¡Comienza el día con energía!"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

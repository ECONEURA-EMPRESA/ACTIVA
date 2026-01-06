import React from 'react';
import {

  Users,
  Calendar,
  Activity,
  ChevronRight,
  Zap,
  PlusCircle,
  Search,
  Settings,
  UserCheck,
  FileText,
  CalendarDays,
  Hourglass,
} from 'lucide-react';
import { Button } from '../../components/ui/Button'; // Verify path
import { Card } from '../../components/ui/Card'; // Verify path
import { getPhaseForSessionIndex } from '../../lib/clinicalUtils';
import { Patient } from '../../lib/types';
import { downloadPatientsCSV } from '../../lib/exportUtils';
import { useAuth } from '../../context/AuthContext';
import { Download, Shield } from 'lucide-react';

interface DashboardViewProps {
  patients: Patient[];
  onViewChange: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ patients, onViewChange }) => {
  // Adapter
  const onNavigate = onViewChange;
  const onNewPatient = () => onViewChange('patients');

  // Internal state for search locally
  const [searchQuery, setSearchQuery] = React.useState('');

  const activePatients = patients.length;

  const recentSessions = patients
    .flatMap((p) => {
      const validSessionsAsc = (p.sessions || [])
        .filter((s) => !s.isAbsent)
        .sort((a, b) => {
          const d1 = new Date(a.date.split('/').reverse().join('-'));
          const d2 = new Date(b.date.split('/').reverse().join('-'));
          return d1.getTime() - d2.getTime();
        });

      return (p.sessions || []).map((s) => {
        let phaseDisplay = null;
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
          computedPhase: phaseDisplay,
        };
      });
    })
    .filter((s) => s.patientName?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const d1 = new Date(a.date.split('/').reverse().join('-'));
      const d2 = new Date(b.date.split('/').reverse().join('-'));
      return d2.getTime() - d1.getTime();
    })
    .slice(0, 5);

  const { role, login } = useAuth();

  // ... (rest of sorting logic remains, just hooking into render) ...

  return (
    <div className="space-y-8 animate-in fade-in max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 text-lg mt-1">Resumen de actividad clínica</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto items-center">
          <button
            onClick={() => login(role === 'admin' ? 'therapist' : 'admin')}
            className="flex items-center gap-2 px-3 py-1 bg-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-300 transition-colors"
          >
            <Shield size={12} /> {role === 'admin' ? 'MODO ADMIN' : 'MODO TERAPEUTA'}
          </button>
          {role === 'admin' && (
            <>
              <Button
                variant="secondary"
                size="md"
                icon={Download}
                onClick={() => downloadPatientsCSV(patients)}
              >
                Exp. DB
              </Button>
            </>
          )}
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              className="input-pro pl-10 py-3"
              placeholder="Buscar paciente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            icon={PlusCircle}
            onClick={onNewPatient}
            size="md"
            className="py-3 px-6 shadow-lg"
          >
            Nueva Admisión
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <h3 className="text-2xl font-black text-slate-900">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h3>
          </div>
        </Card>

        {/* Widget Lista de Espera (V2) */}
        <Card className="p-8 flex items-center gap-6 hoverable transform transition-transform hover:-translate-y-1">
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 rounded-2xl shadow-inner">
            <Hourglass size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
              Lista de Espera
            </p>
            <h3 className="text-4xl font-black text-slate-900">0</h3>
            <p className="text-[10px] text-amber-600 font-bold mt-1 max-w-[100px] leading-tight cursor-pointer hover:underline">
              VER SOLICITUDES PENDIENTES
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Activity className="text-pink-500" /> Últimas Sesiones
            </h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('sessions')}>
              Ver todo
            </Button>
          </div>
          <div className="space-y-3 flex-1">
            {recentSessions.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
                onClick={() => {
                  /* Need to handle navigation to detail with patient set */ /* Simple hack: tell parent to go to patients then select? Or just ignore for now as 'sessions' view is safer */ onNavigate(
                  'sessions',
                );
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
          </div>
        </Card>

        <Card className="p-6 h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Zap className="text-amber-500" /> Accesos Rápidos
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: UserCheck,
                label: 'Nueva Admisión',
                sub: 'Registrar paciente',
                color: 'pink',
                onClick: onNewPatient,
              },
              {
                icon: Calendar,
                label: 'Ver Agenda',
                sub: 'Calendario clínico',
                color: 'blue',
                onClick: () => onNavigate('calendar'),
              },
              {
                icon: FileText,
                label: 'Informes',
                sub: 'Plantillas y docs',
                color: 'emerald',
                onClick: () => onNavigate('reports'),
              },
              {
                icon: Settings,
                label: 'Configuración',
                sub: 'Ajustes sistema',
                color: 'amber',
                onClick: () => onNavigate('settings'),
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className={`p-5 rounded-2xl border border-slate-200 bg-white hover:border-${item.color}-200 hover:bg-${item.color}-50/30 transition-all text-left group hover:shadow-md`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <item.icon size={20} />
                </div>
                <h4 className={`font-bold text-slate-700 group-hover:text-${item.color}-700`}>
                  {item.label}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

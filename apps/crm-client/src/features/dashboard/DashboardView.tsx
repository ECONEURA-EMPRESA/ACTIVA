import React, { useMemo, useState } from 'react';
import { Shield, PlusCircle, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Patient } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { SystemActivity } from './widgets/SystemActivity';
import { useActivityLog } from '../../hooks/useActivityLog';
import { DailyAgendaWidget } from './widgets/DailyAgendaWidget';
import { PostItWidget } from './widgets/PostItWidget';

interface DashboardViewProps {
  patients: Patient[];
  onViewChange: (view: string, data?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ patients, onViewChange }) => {
  const { role, login } = useAuth();
  const { latestActivities, isLoading: isLogLoading } = useActivityLog();
  const [searchQuery, setSearchQuery] = useState('');

  // Lifted Date State for Coordination
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onNavigate = onViewChange;
  const onNewPatient = () => onViewChange('patients', { mode: 'new' });

  // Aggregate all sessions for the Widget (just for dots if needed)
  const allSessions = useMemo(() => {
    return patients.flatMap(p => (p.sessions || []).map(s => ({ ...s, patientId: p.id })));
  }, [patients]);

  return (
    <div className="h-[calc(100vh-100px)] min-h-[600px] animate-in fade-in max-w-[1800px] mx-auto pb-4 flex flex-col gap-6">

      {/* COMPACT HEADER */}
      {/* COMPACT HEADER (RESPONSIVE) */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Panel de Control
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Buscar paciente global..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => login(role === 'admin' ? 'therapist' : 'admin')}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Shield size={14} /> <span className="hidden sm:inline">{role === 'admin' ? 'ADMIN' : 'TERAPEUTA'}</span>
            </button>
            <Button
              icon={PlusCircle}
              onClick={onNewPatient}
              size="sm"
              className="shadow-lg shadow-indigo-200 flex-1 md:flex-none justify-center"
            >
              <span className="hidden sm:inline">Nueva Admisión</span>
              <span className="inline sm:hidden">Nuevo</span>
            </Button>
          </div>
        </div>
      </header>

      {/* RADICAL LAYOUT: FULL WIDTH AGENDA */}
      {/* RADICAL LAYOUT: DAILY AGENDA + ACTIVITY + NOTES */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-hidden">

        {/* LEFT: DAILY VISUAL AGENDA (2 COLS) */}
        <div className="xl:col-span-2 h-full overflow-hidden">
          <DailyAgendaWidget
            sessions={allSessions}
            patients={patients}
            onSessionClick={(_, p) => {
              if (p) onNavigate('patient-detail', p);
            }}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onNewAppointment={() => onViewChange('patients')}
          />
        </div>

        {/* RIGHT: ACTIVITY LOG + DAILY NOTES (1 COL STACKED) */}
        <div className="h-full flex flex-col gap-6 overflow-hidden">

          {/* Daily Post-it Note (TOP PRIORITY) */}
          <div className="shrink-0 h-[300px] border border-transparent">
            <PostItWidget date={selectedDate} />
          </div>

          {/* Activity Log (SECONDARY) */}
          <div className="flex-1 min-h-[300px] overflow-hidden">
            <SystemActivity activities={latestActivities} isLoading={isLogLoading} />
          </div>

        </div>
      </div>
    </div >
  );
};

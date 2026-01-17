import React, { useState } from 'react';
import { Search } from 'lucide-react';
// Button removed (unused)
import { Card } from '../../components/ui/Card';
import { Patient, Session, GroupSession } from '../../lib/types';
import { SessionModal, ExtendedSession } from '../../features/patients/modals/SessionModal';
import { GroupSessionModal } from './modals/GroupSessionModal';

interface SessionsManagerProps {
  patients: Patient[];
  groupSessions?: GroupSession[];
  onUpdatePatient: (updatedPatient: Patient) => void;
  filterMode?: 'individual' | 'group';
}

// Strict Discriminated Union for Display
type DisplaySession =
  | (Session & { type: 'individual'; patientName: string; patient: Patient })
  | (GroupSession & { type: 'group'; patientName: string });

export const SessionsManager: React.FC<SessionsManagerProps> = ({
  patients,
  groupSessions = [],
  onUpdatePatient,
  filterMode = 'individual',
}) => {
  const [search, setSearch] = useState('');
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{
    session: Session;
    patient: Patient;
  } | null>(null);

  // PREPARE DATA SOURCE
  const displaySessions: DisplaySession[] = React.useMemo(() => {
    if (filterMode === 'group') {
      // Use Master Group Sessions
      return groupSessions.map(g => ({
        ...g,
        type: 'group' as const,
        patientName: g.groupName || 'Grupo',
      }));
    } else {
      // Use Individual Sessions
      return patients.flatMap((p) =>
        (p.sessions || []).map((s) => ({
          ...s,
          patientName: p.name,
          patient: p,
          type: 'individual' as const
        })),
      );
    }
  }, [filterMode, groupSessions, patients]);


  const filteredSessions = displaySessions
    .filter((s) => s.type === (filterMode === 'group' ? 'group' : 'individual'))
    .filter(
      (s) => {
        // Strict property access based on discriminated union
        const notes = (s.type === 'individual' ? s.notes : s.observations) || '';

        const matchesSearch = s.patientName.toLowerCase().includes(search.toLowerCase()) ||
          notes.toLowerCase().includes(search.toLowerCase());

        const matchesGroup = s.type === 'group' && s.groupName?.toLowerCase().includes(search.toLowerCase());

        return matchesSearch || matchesGroup;
      }
    )
    .sort((a, b) => {
      // Robust Date Parsing
      const parse = (d: string) => {
        if (!d || typeof d !== 'string') return 0;
        if (d.includes('/')) {
          const [day, month, year] = d.split('/').map(Number);
          return new Date(year, month - 1, day).getTime();
        }
        return new Date(d).getTime();
      };
      return parse(b.date) - parse(a.date);
    });

  const handleSaveSession = (data: Session | ExtendedSession) => {
    // Adapter for ExtendedSession -> Session
    const newSession = data as Session;
    if (!newSession.type) newSession.type = 'individual'; // Default

    // En individual, encontramos al paciente y actualizamos
    if (selectedSession) {
      const p = selectedSession.patient;
      const updatedSessions =
        p.sessions?.map((s) => (s.id === newSession.id ? newSession : s)) || [];
      onUpdatePatient({ ...p, sessions: updatedSessions });
    } else {
      alert('Para crear nueva sesión individual, vaya a la ficha del paciente.');
    }
  };

  const handleSaveGroupSession = (newSession: GroupSession) => {
    if (newSession.participantNames) {
      patients.forEach((p) => {
        if (newSession.participantNames?.includes(p.name)) {
          const currentSessions = p.sessions || [];
          const adapterSession: Session = {
            id: newSession.id,
            date: newSession.date,
            time: newSession.time,
            type: 'group',
            notes: `Sesión Grupal: ${newSession.groupName}`,
            price: newSession.price,
            paid: newSession.paid,
            billable: true,
            isAbsent: false,
            activities: newSession.activities
          };
          onUpdatePatient({ ...p, sessions: [...currentSessions, adapterSession] });
        }
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Sesiones</h1>
          <p className="text-slate-500 mt-1">
            Histórico y control de{' '}
            {filterMode === 'group' ? 'talleres grupales (Master)' : 'sesiones individuales'}
          </p>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
        <input
          className="input-pro pl-10"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredSessions.map((s, i) => (
          <Card
            key={`${s.id}-${i}`}
            className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:border-pink-200 transition-colors cursor-pointer"
            onClick={() => {
              if (s.type === 'individual') {
                setSelectedSession({ session: s, patient: s.patient });
                setIsSessionModalOpen(true);
              }
            }}
          >
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-600 font-bold leading-tight">
                <span className="text-xl">{s.date.split(/[-/]/)[0] || '??'}</span>
                <span className="text-[9px] uppercase">
                  SESIÓN
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {/* Strict access */}
                  {s.type === 'group' ? (s.groupName || 'Sesión Grupal') : s.patientName}
                </h4>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {s.type === 'group' && (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {s.participantNames?.length || 0} Participantes
                    </span>
                  )}
                  <span>{s.price}€</span>
                  <span>• {s.paid ? 'Pagado' : 'Pendiente'}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              {s.type === 'group' ? (
                <div className="text-xs text-slate-400 max-w-xs truncate">{s.location}</div>
              ) : (
                <div className="text-xs text-slate-400 max-w-xs truncate">
                  {s.notes || 'Sin notas'}
                </div>
              )}
            </div>
          </Card>
        ))}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-medium">
            No se encontraron sesiones.
          </div>
        )}
      </div>

      {isSessionModalOpen && selectedSession && (
        <SessionModal
          onClose={() => setIsSessionModalOpen(false)}
          onSave={handleSaveSession}
          initialData={selectedSession.session}
          patientType={selectedSession.patient.pathologyType || 'other'}
        />
      )}

      {isGroupModalOpen && (
        <GroupSessionModal
          onClose={() => setIsGroupModalOpen(false)}
          onSave={handleSaveGroupSession}
        />
      )}
    </div>
  );
};

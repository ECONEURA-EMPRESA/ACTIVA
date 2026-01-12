import React, { useState } from 'react';
import { Search } from 'lucide-react';
// Button removed (unused)
import { Card } from '../../components/ui/Card';
import { Patient, Session, GroupSession } from '../../lib/types';
import { SessionModal } from '../../features/patients/modals/SessionModal';
import { GroupSessionModal } from './modals/GroupSessionModal';

interface SessionsManagerProps {
  patients: Patient[];
  groupSessions?: GroupSession[]; // NEW PROP
  onUpdatePatient: (updatedPatient: Patient) => void;
  filterMode?: 'individual' | 'group';
}

export const SessionsManager: React.FC<SessionsManagerProps> = ({
  patients,
  groupSessions = [], // Default to empty
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
  const displaySessions = React.useMemo(() => {
    if (filterMode === 'group') {
      // Use Master Group Sessions
      return groupSessions.map(g => ({
        ...g,
        type: 'group' as const,
        patientName: g.groupName || 'Grupo', // Map groupName to patientName for display compatibility or custom handle
        // Map other fields as necessary for the Card if they differ
      }));
    } else {
      // Use Individual Sessions
      return patients.flatMap((p) =>
        (p.sessions || []).map((s) => ({ ...s, patientName: p.name, patient: p, type: 'individual' as const })),
      );
    }
  }, [filterMode, groupSessions, patients]);


  const filteredSessions = displaySessions
    .filter((s) => s.type === (filterMode === 'group' ? 'group' : 'individual'))
    .filter(
      (s) => {
        const notes = (s as any).notes || (s as any).observations || '';
        return (
          s.patientName.toLowerCase().includes(search.toLowerCase()) ||
          notes.toLowerCase().includes(search.toLowerCase()) ||
          // Extra search for Group Name if mapped differently
          ((s as any).groupName && (s as any).groupName.toLowerCase().includes(search.toLowerCase()))
        );
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

  const handleSaveSession = (newSession: Session) => {
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
    // This logic is mostly for optimistic updates in App.tsx or local handling.
    // If we are using master list passed from parent, we might not need this here unless we emit up.
    // But existing logic tried to update patients. We will leave it harmless for now.
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
                setSelectedSession({ session: s as any, patient: (s as any).patient });
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
                  {s.type === 'group' ? (s.groupName || 'Sesión Grupal') : s.patientName}
                </h4>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {s.type === 'group' && (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {(s as any).participantNames?.length || 0} Participantes
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

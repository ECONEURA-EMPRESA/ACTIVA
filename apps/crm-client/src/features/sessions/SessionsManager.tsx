import React, { useState } from 'react';
import { Search, CalendarCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Patient, Session } from '../../lib/types';
import { SessionModal } from './modals/SessionModal';
import { GroupSessionModal } from './modals/GroupSessionModal';

interface SessionsManagerProps {
  patients: Patient[];
  onUpdatePatient: (updatedPatient: Patient) => void;
  filterMode?: 'individual' | 'group';
}

export const SessionsManager: React.FC<SessionsManagerProps> = ({
  patients,
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

  // Flatten all sessions
  const allSessions = patients.flatMap((p) =>
    (p.sessions || []).map((s) => ({ ...s, patientName: p.name, patient: p })),
  );

  const filteredSessions = allSessions
    .filter((s) => s.type === (filterMode === 'group' ? 'group' : 'individual'))
    .filter(
      (s) =>
        s.patientName.toLowerCase().includes(search.toLowerCase()) ||
        (s.notes && s.notes.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => {
      const [d1, m1, y1] = a.date.split('/');
      const [d2, m2, y2] = b.date.split('/');
      return new Date(`${y2}-${m2}-${d2}`).getTime() - new Date(`${y1}-${m1}-${d1}`).getTime();
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

  const handleSaveGroupSession = (newSession: Session) => {
    // Para sesiones grupales, añadimos la sesión a TODOS los pacientes participantes (por nombre o ID)
    if (newSession.participantNames) {
      patients.forEach((p) => {
        if (newSession.participantNames?.includes(p.name)) {
          const currentSessions = p.sessions || [];
          onUpdatePatient({ ...p, sessions: [...currentSessions, newSession] });
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
            {filterMode === 'group' ? 'talleres grupales' : 'sesiones individuales'}
          </p>
        </div>
        {filterMode === 'group' && (
          <Button onClick={() => setIsGroupModalOpen(true)} icon={CalendarCheck}>
            Nueva Sesión Grupal
          </Button>
        )}
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
        <input
          className="input-pro pl-10"
          placeholder="Buscar por paciente o notas..."
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
                <span className="text-xl">{s.date.split('/')[0]}</span>
                <span className="text-[9px] uppercase">
                  {
                    [
                      'Ene',
                      'Feb',
                      'Mar',
                      'Abr',
                      'May',
                      'Jun',
                      'Jul',
                      'Ago',
                      'Sep',
                      'Oct',
                      'Nov',
                      'Dic',
                    ][parseInt(s.date.split('/')[1]) - 1]
                  }
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {s.type === 'group' ? 'Sesión Grupal' : s.patientName}
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

      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onSave={handleSaveSession}
        patient={selectedSession?.patient}
        session={selectedSession?.session}
      />

      {isGroupModalOpen && (
        <GroupSessionModal
          onClose={() => setIsGroupModalOpen(false)}
          onSave={handleSaveGroupSession}
        />
      )}
    </div>
  );
};

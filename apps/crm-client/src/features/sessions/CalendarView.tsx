import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight, CalendarCheck, Users, Phone, AlertTriangle, Loader2 } from 'lucide-react';
import { Patient, GroupSession, NavigationPayload } from '../../lib/types';
import { Toast } from '../../components/ui/Toast';
import { useSessionController } from '../../hooks/controllers/useSessionController';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarViewProps {
  patients: Patient[];
  groupSessions: GroupSession[]; // Kept for now, should move to controller too eventually
  onNavigate: (view: string, data?: NavigationPayload) => void;
  onOpenGroupModal: (mode: 'schedule' | 'evolution', data?: GroupSession) => void;
  onOpenSessionModal: () => void;
  onOpenQuickAppointment: (mode: 'new' | 'existing') => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  patients,
  groupSessions,
  onNavigate,
  onOpenGroupModal,
  onOpenQuickAppointment,
}) => {
  // const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Derive date range for the query (current month)
  // We fetch a bit more (previous/next week) if needed, but per month is fine.
  // Using ISO 'YYYY-MM-DD'
  const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
  const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');

  // TITANIUM CONTROLLER
  const { sessions: fetchedSessions, isLoading, isError, error } = useSessionController({ start, end });

  // Map fetched sessions to UI Events
  // We need to look up Patient Name from the patients prop
  const individualEvents = fetchedSessions.map(session => {
    const patient = patients.find(p => String(p.id) === String(session.patientId)) || { name: 'Desconocido', contact: '' };
    return {
      ...session,
      title: patient.name, // Derived name
      patientName: patient.name,
      contact: patient.contact,
      dateObj: new Date(session.date), // Assumes ISO YYYY-MM-DD
      type: 'individual' as const,
      time: session.time, // EXPLICITLY INCLUDE TIME
    };
  });

  // Legacy Group Sessions (passed as prop for now, assuming not refactored yet)
  const groupEvents = groupSessions.map(s => {
    let dateObj: Date;
    if (s.date.includes('/')) {
      // Legacy DD/MM/YYYY
      const [d, m, y] = s.date.split('/');
      dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    } else {
      // ISO YYYY-MM-DD
      dateObj = new Date(s.date);
    }

    return {
      ...s,
      title: s.groupName || 'Grupo',
      type: 'group' as const,
      dateObj,
    };
  });

  const allEvents = [...individualEvents, ...groupEvents];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    return { days, firstDay: adjustedFirstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);



  // Selected Day Events
  const selectedEvents = allEvents.filter(
    (e) =>
      e.dateObj.getDate() === selectedDay.getDate() &&
      e.dateObj.getMonth() === selectedDay.getMonth() &&
      e.dateObj.getFullYear() === selectedDay.getFullYear(),
  );

  const handleMonthChange = (offset: number) => {
    setCurrentDate(prev => addMonths(prev, offset));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-2 animate-in fade-in max-w-[1600px] mx-auto relative overflow-y-auto lg:overflow-hidden">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col gap-4 bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <Button variant="ghost" onClick={() => handleMonthChange(-1)} icon={ChevronLeft}>
              {null}
            </Button>
            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <Button variant="ghost" onClick={() => handleMonthChange(1)} icon={ChevronRight}>
              {null}
            </Button>
            {isLoading && <Loader2 className="animate-spin text-slate-400" size={20} />}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onOpenQuickAppointment('existing')}
              icon={CalendarCheck}
            >
              Nueva Cita
            </Button>
            <Button size="sm" onClick={() => onOpenGroupModal('schedule')} icon={Users}>
              Grupal
            </Button>
          </div>
        </div>

        {/* Missing Index Warning */}
        {isError && (
          <div className="bg-amber-50 p-4 rounded-lg flex gap-4 items-center mb-4 border border-amber-200">
            <AlertTriangle className="text-amber-500" />
            <div className="text-sm text-amber-800">
              <strong>Requiere Configuración:</strong> Falta el índice compuesto "Collection Group" en Firebase.
              <br />
              <a href="#" className="underline" onClick={(e) => { e.preventDefault(); console.error(error); }}>Ver error en consola</a> para el enlace de creación.
            </div>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-7 gap-2 h-full">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="text-center font-bold text-slate-400 uppercase text-xs py-2">
              {d}
            </div>
          ))}

          {Array(firstDay)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-50/50 rounded-lg" />
            ))}

          {Array(days)
            .fill(null)
            .map((_, i) => {
              const day = i + 1;
              const dayEvents = allEvents.filter(
                (e) =>
                  e.dateObj.getDate() === day &&
                  e.dateObj.getMonth() === currentDate.getMonth() &&
                  e.dateObj.getFullYear() === currentDate.getFullYear(),
              );

              const isSelected =
                selectedDay.getDate() === day && selectedDay.getMonth() === currentDate.getMonth();
              const isToday =
                new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

              return (
                <div
                  key={day}
                  onClick={() =>
                    setSelectedDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                  }
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 min-h-[80px] ${isSelected
                    ? 'border-pink-500 ring-2 ring-pink-100 bg-pink-50'
                    : 'border-slate-100 hover:border-slate-300'
                    }`}
                >
                  <div className="flex justify-between">
                    <span
                      className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-slate-900 text-white' : 'text-slate-700'
                        }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-xs font-bold text-slate-400">{dayEvents.length}</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map((e, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full w-full ${e.type === 'group'
                          ? 'bg-indigo-400'
                          : 'isAbsent' in e && e.isAbsent
                            ? 'bg-red-400'
                            : 'bg-pink-400'
                          }`}
                        title={e.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mx-auto" />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 order-first lg:order-last">

        {/* Selected Day Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col h-full">
          <div className="mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-3xl font-black text-slate-900">{selectedDay.getDate()}</h2>
            <p className="text-slate-500 uppercase font-bold text-xs">
              {format(selectedDay, 'MMMM yyyy | EEEE', { locale: es })}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3 custom-scrollbar">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((e, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-white transition-colors"
                  onClick={() => {
                    if (e.type === 'individual') {
                      onNavigate(
                        'patient-detail',
                        patients.find(p => String(p.id) === String(e.patientId))
                      );
                    } else if (e.type === 'group') {
                      // Open Group Modal with Data
                      onOpenGroupModal('evolution', e);
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${e.type === 'group'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-pink-100 text-pink-700'
                        }`}
                    >
                      {e.type === 'group' ? 'Grupal' : (e.time || '10:00')}
                    </span>
                    {e.type === 'individual' && e.isAbsent && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">
                        Ausente
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm text-slate-800 truncate">{e.title}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {e.type === 'individual' ? e.notes || 'Sin notas' : e.observations || 'Sesión Grupal'}
                  </div>
                  {e.type === 'individual' && !e.isAbsent && e.contact && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={(evt) => {
                          evt.stopPropagation();
                          if (e.contact) {
                            window.location.href = `tel:${e.contact.replace(/\s/g, '')}`;
                          }
                        }}
                        className="text-[10px] font-bold text-slate-600 flex items-center gap-1 hover:bg-slate-50 px-2 py-1 rounded transition-colors"
                      >
                        <Phone size={12} /> Llamar
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 text-sm py-10 flex flex-col items-center gap-2">
                <CalendarCheck size={24} className="opacity-20" />
                <span>Sin sesiones</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

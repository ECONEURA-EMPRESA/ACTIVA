import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight, CalendarCheck, Users, StickyNote } from 'lucide-react';
import { Patient, GroupSession } from '../../lib/types';
import { Toast } from '../../components/ui/Toast';

interface CalendarViewProps {
  patients: Patient[];
  groupSessions: GroupSession[];
  onNavigate: (view: string, data?: any) => void;
  onOpenGroupModal: () => void;
  onOpenSessionModal: () => void; // Kept for interface compatibility
  onOpenQuickAppointment: (mode: 'new' | 'existing') => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  patients,
  groupSessions,
  onNavigate,
  onOpenGroupModal,
  onOpenQuickAppointment,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [dailyNotes, setDailyNotes] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Eventos combinados
  // Ensure we handle potentially undefined dates gracefully
  const individualEvents = patients.flatMap(
    (p) =>
      (p.sessions || [])
        .map((s, i) => {
          if (!s.date) return null;
          const [d, m, y] = s.date.split('/');
          return {
            ...s,
            id: `ind - ${p.id} -${i} `,
            patientId: p.id,
            title: p.name,
            type: 'individual' as const,
            dateObj: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)),
            isAbsent: s.isAbsent,
          };
        })
        .filter((e): e is NonNullable<typeof e> => e !== null),
  );

  const groupEvents = groupSessions
    .map((s, i) => {
      if (!s.date) return null;
      const [d, m, y] = s.date.split('/');
      return {
        ...s,
        id: `grp - ${i} `,
        title: s.location || 'Grupo',
        type: 'group' as const,
        dateObj: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)),
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

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

  // Mini calendario (Mes siguiente)
  const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  const { days: nextDays, firstDay: nextFirstDay } = getDaysInMonth(nextMonthDate);

  // Eventos del día seleccionado
  const selectedEvents = allEvents.filter(
    (e) =>
      e.dateObj.getDate() === selectedDay.getDate() &&
      e.dateObj.getMonth() === selectedDay.getMonth() &&
      e.dateObj.getFullYear() === selectedDay.getFullYear(),
  );

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  return (
    <div className="flex gap-6 h-full p-2 animate-in fade-in max-w-[1600px] mx-auto relative">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* IZQUIERDA: CALENDARIO PRINCIPAL GRANDE */}
      <div className="flex-1 flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <Button variant="ghost" onClick={() => handleMonthChange(-1)} icon={ChevronLeft}>
              {null}
            </Button>
            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide min-w-[200px] text-center">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <Button variant="ghost" onClick={() => handleMonthChange(1)} icon={ChevronRight}>
              {null}
            </Button>
          </div>
          <div className="flex gap-2">
            {/* Botón único Nueva Cita (default: Existing) */}
            <Button
              size="sm"
              onClick={() => onOpenQuickAppointment('existing')}
              icon={CalendarCheck}
            >
              Nueva Cita
            </Button>
            <Button size="sm" onClick={onOpenGroupModal} icon={Users}>
              Grupal
            </Button>
          </div>
        </div>

        {/* GRID CALENDARIO */}
        <div className="grid grid-cols-7 gap-2 h-full">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="text-center font-bold text-slate-400 uppercase text-xs py-2">
              {d}
            </div>
          ))}

          {Array(firstDay)
            .fill(null)
            .map((_, i) => (
              <div key={`empty - ${i} `} className="bg-slate-50/50 rounded-lg" />
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
                  className={`p - 2 rounded - xl border transition - all cursor - pointer flex flex - col gap - 1 min - h - [80px] ${isSelected
                    ? 'border-pink-500 ring-2 ring-pink-100 bg-pink-50'
                    : 'border-slate-100 hover:border-slate-300'
                    } `}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-pink-50/50');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('bg-pink-50/50');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-pink-50/50');
                    try {
                      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                      setToast({
                        msg: `Cita de ${data.title} reprogramada al día ${day} `,
                        type: 'success'
                      });
                    } catch (err) {
                      console.error('Drag error', err);
                    }
                  }}
                >
                  <div className="flex justify-between">
                    <span
                      className={`text - sm font - bold w - 6 h - 6 flex items - center justify - center rounded - full ${isToday ? 'bg-slate-900 text-white' : 'text-slate-700'
                        } `}
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
                          : (e as any).isAbsent
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

      {/* DERECHA: PANEL LATERAL */}
      <div className="w-80 flex flex-col gap-6">
        {/* MINI CALENDARIO MES SIGUIENTE */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hidden lg:block">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
            {nextMonthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="grid grid-cols-7 gap-1 text-[10px] text-center">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
              <span key={d} className="font-bold text-slate-300">
                {d}
              </span>
            ))}
            {Array(nextFirstDay)
              .fill(null)
              .map((_, i) => (
                <div key={i} />
              ))}
            {Array(nextDays)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="text-slate-500 py-1">
                  {i + 1}
                </div>
              ))}
          </div>
        </div>

        {/* DETALLE DEL DÍA */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col">
          <div className="mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-3xl font-black text-slate-900">{selectedDay.getDate()}</h2>
            <p className="text-slate-500 uppercase font-bold text-xs">
              {selectedDay.toLocaleDateString('es-ES', { month: 'long', weekday: 'long' })}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3 custom-scrollbar">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((e, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-white transition-colors"
                  onClick={() =>
                    e.type === 'individual' &&
                    onNavigate(
                      'detail',
                      patients.find((p) => p.id === e.patientId),
                    )
                  }
                  draggable="true"
                  onDragStart={(evt) => {
                    evt.dataTransfer.setData('text/plain', JSON.stringify(e));
                    evt.currentTarget.classList.add('opacity-50');
                  }}
                  onDragEnd={(evt) => {
                    evt.currentTarget.classList.remove('opacity-50');
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text - [10px] font - bold px - 1.5 py - 0.5 rounded uppercase ${e.type === 'group'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-pink-100 text-pink-700'
                        } `}
                    >
                      {e.type === 'group' ? 'Grupal' : 'Individual'}
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
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 text-sm py-10 flex flex-col items-center gap-2">
                <CalendarCheck size={24} className="opacity-20" />
                <span>Sin sesiones</span>
              </div>
            )}
          </div>

          <div>
            <label className="label-pro flex items-center gap-2 text-xs">
              <StickyNote size={12} /> Notas del Día
            </label>
            <textarea
              className="input-pro h-24 text-xs bg-yellow-50 border-yellow-100 resize-none focus:ring-yellow-200"
              placeholder="Recordatorios..."
              value={dailyNotes}
              onChange={(e) => setDailyNotes(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarCalendarProps {
  events?: { date: string; type: 'individual' | 'group' }[];
}

export const SidebarCalendar: React.FC<SidebarCalendarProps> = ({ events = [] }) => {
  const [calendarDate, setCalendarDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    return { days, firstDay: adjustedFirstDay };
  };

  const { days, firstDay } = getDaysInMonth(calendarDate);
  const today = new Date();

  const hasEvent = (day: number) => {
    return events.some((e) => {
      const [dStr, mStr, yStr] = e.date.split('/'); // Assuming DD/MM/YYYY format
      const d = parseInt(dStr, 10);
      const m = parseInt(mStr, 10) - 1; // 0-based
      const y = parseInt(yStr, 10);

      return d === day && m === calendarDate.getMonth() && y === calendarDate.getFullYear();
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mt-6 mx-2 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() - 1)))
          }
          className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
          {calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={() =>
            setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() + 1)))
          }
          className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
          <span key={d} className="text-[9px] font-black text-slate-300 uppercase">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array(firstDay)
          .fill(null)
          .map((_, i) => (
            <div key={`e-${i}`} />
          ))}
        {Array(days)
          .fill(null)
          .map((_, i) => {
            const day = i + 1;
            const isToday =
              day === today.getDate() &&
              calendarDate.getMonth() === today.getMonth() &&
              calendarDate.getFullYear() === today.getFullYear();
            const dayHasEvent = hasEvent(day);
            return (
              <div
                key={day}
                className={`h-7 w-7 flex items-center justify-center rounded-full text-[10px] relative transition-all duration-200
                            ${isToday ? 'bg-slate-900 text-white font-bold shadow-md' : 'text-slate-500 hover:bg-slate-50 font-medium'}
                        `}
              >
                {day}
                {dayHasEvent && (
                  <div
                    className={`absolute -bottom-0.5 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-pink-500'}`}
                  ></div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

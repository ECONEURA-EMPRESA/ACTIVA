import React, { useState } from 'react';
import { format, addMonths, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface MonthCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    className?: string;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
    selectedDate,
    onDateSelect,
    className
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Mon=0
        return { days, firstDay: adjustedFirstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentMonth);

    const handleMonthChange = (offset: number) => {
        setCurrentMonth(prev => addMonths(prev, offset));
    };

    return (
        <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm ${className}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" size="sm" onClick={() => handleMonthChange(-1)} icon={ChevronLeft} className="h-8 w-8 p-0">
                    <></>
                </Button>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => handleMonthChange(1)} icon={ChevronRight} className="h-8 w-8 p-0">
                    <></>
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                    <div key={d} className="text-[10px] font-black text-slate-400 uppercase py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array(firstDay).fill(null).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {Array(days).fill(null).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());

                    return (
                        <button
                            key={day}
                            onClick={() => onDateSelect(date)}
                            className={`
                                h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                                ${isSelected
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                                    : isToday
                                        ? 'bg-slate-100 text-slate-900 border border-slate-200'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                }
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

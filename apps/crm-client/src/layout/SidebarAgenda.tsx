import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SidebarAgendaProps {
    events?: any[];
}

export const SidebarAgenda: React.FC<SidebarAgendaProps> = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format: 14:05
    const timeString = currentTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Format: 12 Enero 2026
    const dateString = format(currentTime, "d 'de' MMMM, yyyy", { locale: es });

    return (
        <div className="mx-4 mb-6 text-center select-none cursor-default group">
            {/* BIG CLOCK */}
            <div className="text-5xl font-medium text-slate-400 tracking-tighter group-hover:text-slate-600 transition-colors duration-500">
                {timeString}
            </div>
            {/* DATE */}
            <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1 group-hover:text-pink-400 transition-colors duration-500">
                {dateString}
            </div>
        </div>
    );
};

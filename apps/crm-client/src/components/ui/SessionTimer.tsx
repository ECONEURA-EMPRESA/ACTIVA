import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlarmClock } from 'lucide-react';

interface SessionTimerProps {
    initialMinutes?: number;
    onComplete?: () => void;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ initialMinutes = 45, onComplete }) => {
    const [seconds, setSeconds] = useState(initialMinutes * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(s => s - 1);
            }, 1000);
        } else if (seconds <= 0 && isActive) {
            // Fix: Wrap in timeout to avoid 'setState during render' warning if sync
            const t = setTimeout(() => {
                setIsActive(false);
                onComplete?.();
            }, 0);
            return () => clearTimeout(t);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds, onComplete]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setSeconds(initialMinutes * 60);
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = ((initialMinutes * 60 - seconds) / (initialMinutes * 60)) * 100;
    const colorClass = seconds < 300 ? 'text-red-500' : 'text-slate-700';
    const bgClass = seconds < 300 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200';

    return (
        <div className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-colors ${bgClass}`}>
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                        className="text-slate-100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className={seconds < 300 ? 'text-red-500 transition-all duration-1000' : 'text-pink-500 transition-all duration-1000'}
                        strokeDasharray={`${100 - progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-400">
                    <AlarmClock size={14} />
                </div>
            </div>

            <div className="flex-1">
                <div className={`text-2xl font-black font-mono tracking-widest ${colorClass}`}>
                    {formatTime(seconds)}
                </div>
            </div>

            <div className="flex gap-1">
                <button
                    onClick={toggle}
                    className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`}
                >
                    {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <button
                    onClick={reset}
                    className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                >
                    <RotateCcw size={18} />
                </button>
            </div>
        </div>
    );
};

import React, { useMemo, useState } from 'react';
import { format, addDays, subDays, isSameDay, differenceInYears } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    ChevronLeft, ChevronRight, Calendar, User, Phone, Activity,
    Search, Plus
} from 'lucide-react';

import { Session, Patient } from '../../../lib/types';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';


type ExtendedSession = Session & { patientId?: string | number; time?: string };

interface DailyAgendaWidgetProps {
    sessions: ExtendedSession[];
    patients: Patient[];
    onSessionClick: (session: Session, patient?: Patient) => void;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    onNewAppointment?: () => void;
}

export const DailyAgendaWidget: React.FC<DailyAgendaWidgetProps> = ({
    sessions,
    patients,
    onSessionClick,
    selectedDate,
    onDateChange,
    onNewAppointment
}) => {
    // Helper for safe date parsing
    const parseSafeDate = (dateVal: string | Date | undefined): Date => {
        if (!dateVal) return new Date();
        if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? new Date() : dateVal;

        try {
            if (typeof dateVal === 'string') {
                if (dateVal.includes('/')) {
                    const parts = dateVal.split('/');
                    if (parts.length === 3) {
                        const d = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10);
                        const y = parseInt(parts[2], 10);
                        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                            return new Date(y, m - 1, d);
                        }
                    }
                }
                const parsed = new Date(dateVal);
                return isNaN(parsed.getTime()) ? new Date() : parsed;
            }
        } catch {
            return new Date();
        }
        return new Date();
    };

    // State for Search only (No more payment filters)
    const [searchTerm, setSearchTerm] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);

    // 1. Filter sessions for selected date
    const dailySessions = useMemo(() => {
        return sessions.filter(s => {
            const sDate = parseSafeDate(s.date as string | undefined);
            return isSameDay(sDate, selectedDate);
        });
    }, [sessions, selectedDate]);

    // 2. Apply Search Filter
    const filteredSessions = useMemo(() => {
        return dailySessions.filter(session => {
            const patient = patients.find(p => String(p.id) === String(session.patientId));
            if (!patient) return false;

            if (!searchTerm) return true;

            return (
                patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (patient.contact && patient.contact.includes(searchTerm))
            );
        });
    }, [dailySessions, searchTerm, patients]);

    return (
        <Card className="h-full flex flex-col bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden font-sans">

            {/* HERITAGE HEADER - Clean, White, Spacious */}
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-20">
                <button
                    onClick={() => onDateChange(subDays(selectedDate, 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all active:scale-95"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-1">
                        AGENDA DIARIA
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight capitalize">
                        {(() => {
                            try {
                                return !isNaN(selectedDate.getTime()) ? format(selectedDate, "EEEE d", { locale: es }) : "Agenda";
                            } catch { return "Agenda"; }
                        })()}
                        <span className="text-slate-300 font-light ml-2">
                            {(() => {
                                try {
                                    return !isNaN(selectedDate.getTime()) ? format(selectedDate, "MMMM", { locale: es }) : "";
                                } catch { return ""; }
                            })()}
                        </span>
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSearchVisible(!searchVisible)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${searchVisible ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600'}`}
                    >
                        <Search size={18} />
                    </button>
                    {onNewAppointment && (
                        <button
                            onClick={onNewAppointment}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95"
                            title="Nueva Cita"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                    <button
                        onClick={() => onDateChange(addDays(selectedDate, 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all active:scale-95"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* SEARCH BAR (Expandable) */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${searchVisible ? 'max-h-16 border-b border-slate-50' : 'max-h-0'}`}>
                <div className="p-4 bg-slate-50/50">
                    <input
                        autoFocus={searchVisible}
                        className="w-full bg-white border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 text-slate-600 placeholder:text-slate-300 shadow-sm"
                        placeholder="Buscar paciente por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* SPACIOUS LIST */}
            <div className="flex-1 overflow-y-auto w-full custom-scrollbar bg-slate-50/30 p-4 md:p-6 space-y-4">
                {Object.keys(
                    filteredSessions.reduce((acc, s) => {
                        const pid = String(s.patientId);
                        if (!acc[pid]) acc[pid] = [];
                        acc[pid].push(s);
                        return acc;
                    }, {} as Record<string, typeof sessions>)
                ).length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <EmptyState
                            icon={Calendar}
                            title="Agenda Libre"
                            description="No hay citas programadas para este día."
                            action={onNewAppointment ? {
                                label: "Nueva Cita",
                                onClick: onNewAppointment,
                                icon: Plus
                            } : undefined}
                        />
                    </div>
                ) : (
                    Object.entries(
                        filteredSessions.reduce((acc, s) => {
                            const pid = String(s.patientId);
                            if (!acc[pid]) acc[pid] = [];
                            acc[pid].push(s);
                            return acc;
                        }, {} as Record<string, typeof sessions>)
                    ).map(([patientId, patientSessions]) => {
                        const patient = patients.find(p => String(p.id) === patientId);
                        if (!patient) return null;

                        // Sort sessions by time logic could go here if needed

                        return (
                            <button
                                key={patientId}
                                onClick={() => onSessionClick(patientSessions[0], patient)}
                                className="group w-full bg-white rounded-2xl p-4 md:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 border border-slate-100/50 transition-all duration-300 flex items-center gap-5 relative overflow-hidden"
                            >
                                {/* Decorative Gradient on Hover */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* 0. TIMES COLUMN (Grouped) */}
                                <div className="flex flex-col items-center justify-center pr-4 border-r border-slate-100/50 min-w-[80px] py-1 gap-1">
                                    {patientSessions.map((s, idx) => {
                                        // SAFE DATE PARSING (Titanium Fix - Robust)
                                        let sessionDate = new Date();
                                        try {
                                            if (s.date && typeof s.date === 'string') {
                                                if (s.date.includes('/')) {
                                                    const parts = s.date.split('/');
                                                    if (parts.length === 3) {
                                                        const d = parseInt(parts[0], 10);
                                                        const m = parseInt(parts[1], 10);
                                                        const y = parseInt(parts[2], 10);
                                                        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                                                            sessionDate = new Date(y, m - 1, d);
                                                        }
                                                    }
                                                } else {
                                                    const parsed = new Date(s.date);
                                                    if (!isNaN(parsed.getTime())) {
                                                        sessionDate = parsed;
                                                    }
                                                }
                                            } else if ((s.date as unknown) instanceof Date) {
                                                sessionDate = s.date as unknown as Date;
                                            }

                                            // Final Safety Check
                                            if (isNaN(sessionDate.getTime())) {
                                                sessionDate = new Date();
                                            }
                                        } catch {
                                            sessionDate = new Date();
                                        }

                                        return (
                                            <div key={idx} className="flex flex-col items-center">
                                                <span className="text-xl md:text-2xl font-black text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                    {s.time || '10:00'}
                                                </span>
                                                {idx === 0 && (
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                                                        {format(sessionDate, 'd MMM', { locale: es })}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 1. PHOTO (Elevated) */}
                                <div className="shrink-0 relative">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-sm ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all">
                                        {patient.photo ? (
                                            <img
                                                src={patient.photo}
                                                alt={patient.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                <User size={24} strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 2. INFO BLOCK */}
                                <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
                                    <div className="flex items-center gap-2 w-full mb-1">
                                        <h3 className="text-base md:text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors">
                                            {patient.name}
                                        </h3>
                                        {(() => {
                                            try {
                                                if (patient.birthDate) {
                                                    const bDate = new Date(patient.birthDate);
                                                    if (!isNaN(bDate.getTime())) {
                                                        return (
                                                            <span className="shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                                                                {differenceInYears(new Date(), bDate)} AÑOS
                                                            </span>
                                                        );
                                                    }
                                                }
                                            } catch { return null; }
                                            return null;
                                        })()}
                                    </div>

                                    <div className="flex items-center gap-3 w-full">
                                        {/* Diagnosis Badge */}
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <Activity size={12} strokeWidth={2} />
                                            <span className="text-[11px] font-bold uppercase tracking-wide truncate max-w-[150px]">
                                                {patient.diagnosis || 'General'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. PHONE (Subtle, right aligned) */}
                                <div className="hidden sm:flex flex-col items-end gap-1 text-slate-400">
                                    <button
                                        onClick={(evt) => {
                                            evt.stopPropagation();
                                            if (patient.contact) {
                                                window.location.href = `tel:${patient.contact.replace(/\s/g, '')}`;
                                            }
                                        }}
                                        className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-200 hover:text-slate-800 transition-colors z-10"
                                        title="Llamar"
                                    >
                                        <Phone size={14} />
                                    </button>
                                    <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        {patient.contact}
                                    </span>
                                </div>

                                {/* Arrow Hint */}
                                <div className="text-slate-200 group-hover:translate-x-1 transition-transform">
                                    <ChevronRight size={20} />
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </Card>
    );
};

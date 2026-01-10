import React from 'react';
import { TREATMENT_PHASES } from '../../../lib/clinicalUtils';
import { Card } from '../../../components/ui/Card';
import { Check } from 'lucide-react';

interface PhaseProgressProps {
    sessionCount: number;
    adherence: number;
}

export const PhaseProgress: React.FC<PhaseProgressProps> = ({ sessionCount, adherence }) => {
    return (
        <Card className="p-6 mb-8 border-slate-200 shadow-sm relative overflow-hidden">
            {/* Background Decorative Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-0 opacity-50" />

            <div className="relative z-10">
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Plan de Tratamiento</h3>
                        <p className="text-slate-500 text-sm font-medium">Progreso de Fases Terapéuticas</p>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-black ${adherence >= 80 ? 'text-emerald-600' : adherence >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                                {adherence}%
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Adherencia</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium max-w-[120px] text-right leading-tight">
                            Basado en asistencia vs. ausencias
                        </p>
                    </div>
                </div>

                <div className="relative px-4">
                    {/* Connecting Line - Background */}
                    <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 rounded-full" />

                    {/* Connecting Line - Progress */}
                    <div
                        className="absolute top-5 left-8 h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `calc(${Math.min((sessionCount / 20) * 100, 100)}% - 2rem)`,
                            opacity: sessionCount > 0 ? 1 : 0
                        }}
                    />

                    <div className="grid grid-cols-5 gap-2 relative">
                        {TREATMENT_PHASES.map((phase) => {
                            const [min, max] = phase.range.split('-').map(Number);
                            const isCompleted = sessionCount > max;
                            const isActive = sessionCount >= min && sessionCount <= max;

                            let circleClasses = "w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500 mb-3 ";
                            if (isCompleted) {
                                circleClasses += `${phase.bg} ${phase.border} ${phase.text}`;
                            } else if (isActive) {
                                circleClasses += `${phase.color} text-white shadow-lg ring-4 ring-slate-50 scale-110`;
                            } else {
                                circleClasses += "bg-white border-slate-200 text-slate-300";
                            }

                            const textClass = isActive || isCompleted ? "text-slate-800" : "text-slate-400";

                            return (
                                <div key={phase.id} className="flex flex-col items-center group">
                                    <div className={circleClasses}>
                                        {isCompleted ? (
                                            <Check size={18} strokeWidth={3} />
                                        ) : (
                                            <span className="text-sm font-bold">{phase.id}</span>
                                        )}
                                    </div>

                                    <div className="text-center space-y-1">
                                        <p className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${textClass}`}>
                                            {phase.name.split(' ')[0]}
                                        </p>
                                        <p className="hidden md:block text-[10px] text-slate-400 font-medium max-w-[100px] leading-tight mx-auto">
                                            {phase.focus}
                                        </p>
                                        {isActive && (
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${phase.bg} ${phase.text}`}>
                                                En Curso
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
};

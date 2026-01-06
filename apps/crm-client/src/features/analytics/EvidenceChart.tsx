import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { Session } from '../../lib/types';

interface EvidenceChartProps {
    sessions: Session[];
}

export const EvidenceChart: React.FC<EvidenceChartProps> = ({ sessions }) => {
    // 1. Transform sessions into Chart Data
    // Filter only sessions with scores, sort by date ascending
    const data = sessions
        .filter((s) => s.scores && s.scores.length > 0 && !s.isAbsent)
        .sort((a, b) => {
            const dateA = a.date.split('/').reverse().join('-');
            const dateB = b.date.split('/').reverse().join('-');
            return new Date(dateA).getTime() - new Date(dateB).getTime();
        })
        .map((s) => {
            // Calculate Average Score or map specific areas
            // Let's map average for the main line, and maybe individual areas?
            // For simplicity/elegance, let's show the "Global Index" (Average)
            const average = s.scores!.reduce((a, b) => a + b, 0) / s.scores!.length;

            return {
                date: s.date.slice(0, 5), // 'DD/MM'
                fullDate: s.date,
                score: Number(average.toFixed(1)), // 0.0 - 3.0
                // ...EVALUATION_AREAS.reduce((acc, area, idx) => ({ ...acc, [area]: s.scores![idx] }), {})
            };
        });

    if (data.length < 2) {
        return (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
                <p className="text-slate-400 font-medium">Se necesitan al menos 2 sesiones para generar la curva evolutiva.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] font-sans">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC008C" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#EC008C" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        stroke="#94A3B8"
                        fontSize={12}
                        tickMargin={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        stroke="#94A3B8"
                        fontSize={12}
                        domain={[0, 3]}
                        ticks={[0, 1, 2, 3]}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: '#EC008C', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <ReferenceLine y={1.5} stroke="#CBD5E1" strokeDasharray="3 3" label={{ position: 'right', value: 'Obj.', fill: '#CBD5E1', fontSize: 10 }} />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#EC008C"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        name="Índice Global"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

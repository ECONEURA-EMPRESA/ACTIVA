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
    // 1. Transform sessions into Chart Data
    // Filter only sessions with scores, sort by date ascending
    const normalizedData = sessions
        .filter((s) => s.scores && s.scores.length > 0 && !s.isAbsent)
        .map(s => {
            // Normalize Date logic
            let dateObj: Date;
            if (s.date.includes('/')) {
                // Legacy DD/MM/YYYY
                const [day, month, year] = s.date.split('/');
                dateObj = new Date(`${year}-${month}-${day}`);
            } else {
                // ISO YYYY-MM-DD or other
                dateObj = new Date(s.date);
            }
            return { ...s, dateObj, timestamp: dateObj.getTime() };
        })
        .sort((a, b) => a.timestamp - b.timestamp);

    const data = normalizedData.map((s) => {
        // Calculate Average Score
        const average = s.scores!.reduce((a, b) => a + b, 0) / s.scores!.length;

        return {
            date: s.dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }), // '30/01'
            fullDate: s.dateObj.toLocaleDateString('es-ES'),
            score: Number(average.toFixed(1)), // 0.0 - 3.0
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
                <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC008C" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EC008C" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        stroke="#94A3B8"
                        fontSize={11}
                        tickMargin={15}
                        fontWeight={500}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        stroke="#94A3B8"
                        fontSize={11}
                        domain={[0, 3]}
                        ticks={[0, 1, 2, 3]}
                        fontWeight={500}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                            padding: '12px 16px',
                            fontFamily: 'inherit'
                        }}
                        itemStyle={{ color: '#EC008C', fontWeight: 'bold' }}
                        cursor={{ stroke: '#EC008C', strokeWidth: 2, strokeDasharray: '4 4' }}
                    />
                    <ReferenceLine y={1.5} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#EC008C"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        name="Índice Global"
                        animationDuration={1500}
                        dot={{ fill: '#fff', stroke: '#EC008C', strokeWidth: 3, r: 5 }}
                        activeDot={{ r: 8, fill: '#EC008C', stroke: '#fff', strokeWidth: 3 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

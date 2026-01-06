import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface CognitiveRadarProps {
  labels: string[];
  dataInitial: number[];
  dataCurrent: number[];
}

export const CognitiveRadar: React.FC<CognitiveRadarProps> = ({
  labels,
  dataInitial,
  dataCurrent,
}) => {
  // Transform arrays into object array for Recharts
  const data = labels.map((label, i) => ({
    subject: label,
    initial: dataInitial[i] || 0,
    current: dataCurrent[i] || 0,
    fullMark: 3,
  }));

  return (
    <div className="w-full h-[300px] font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} axisLine={false} />

          {/* Capa Base (Gris): Evaluación Inicial */}
          <Radar
            name="Evaluación Inicial"
            dataKey="initial"
            stroke="#94a3b8"
            strokeWidth={2}
            fill="#cbd5e1"
            fillOpacity={0.4}
          />

          {/* Capa Activa (Rosa): Evaluación Actual */}
          <Radar
            name="Evaluación Actual"
            dataKey="current"
            stroke="#ec4899"
            strokeWidth={3}
            fill="#ec4899"
            fillOpacity={0.5}
          />

          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

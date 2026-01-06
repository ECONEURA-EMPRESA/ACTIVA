import React from 'react';
import { Card } from '../../../components/ui/Card';
import { EVALUATION_AREAS } from '../../../lib/constants';
import { Patient } from '../../../lib/types';

interface EvaluationTabProps {
  patient: Patient;
}

export const EvaluationTab: React.FC<EvaluationTabProps> = ({ patient }) => {
  // Safety check mostly for initialEval/currentEval
  const initial = patient.initialEval || Array(EVALUATION_AREAS.length).fill(0);
  const current = patient.currentEval || Array(EVALUATION_AREAS.length).fill(0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cognitive Scores */}
        <Card className="p-6 h-full border-t-4 border-indigo-500">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
            <span>Evaluación Cognitiva</span>
            <span className="text-xs font-mono text-slate-400">
              {patient.cognitiveScores?.date || 'Sin fecha'}
            </span>
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                MOCA
              </div>
              <div className="text-3xl font-black text-indigo-600">
                {patient.cognitiveScores?.moca || '-'}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                MMSE
              </div>
              <div className="text-3xl font-black text-indigo-600">
                {patient.cognitiveScores?.mmse || '-'}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                GDS
              </div>
              <div className="text-3xl font-black text-indigo-600">
                {patient.cognitiveScores?.gds || '-'}
              </div>
            </div>
          </div>
        </Card>

        {/* Evolution Bars */}
        <Card className="p-6 h-full border-t-4 border-pink-500">
          <h3 className="font-bold text-slate-800 mb-6">Progreso por Áreas</h3>
          <div className="space-y-5">
            {EVALUATION_AREAS.map((area, index) => {
              const initVal = initial[index] || 0;
              const currVal = current[index] || 0;
              // 0-3 scale usually. Max 3.
              const initPct = (initVal / 3) * 100;
              const currPct = (currVal / 3) * 100;

              return (
                <div key={area}>
                  <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wide">
                    <span className="text-slate-600">{area}</span>
                    <span className="text-pink-600">{currVal}/3</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    {/* Initial marker */}
                    <div
                      className="absolute top-0 bottom-0 bg-slate-300 opacity-50 z-0"
                      style={{ width: `${initPct}%` }}
                    ></div>
                    {/* Current value */}
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-pink-500 to-rose-500 z-10 transition-all duration-1000"
                      style={{ width: `${currPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

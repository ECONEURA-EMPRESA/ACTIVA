import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { BarChart3, PenTool } from 'lucide-react';
import { EvidenceChart } from '../../../analytics/EvidenceChart';
import { Patient } from '../../../../lib/types';

interface EvaluationTabProps {
    patient: Patient;
    onOpenCognitive: () => void;
}

export const EvaluationTab: React.FC<EvaluationTabProps> = ({ patient, onOpenCognitive }) => {
    return (
        <Card className="animate-in fade-in p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 text-lg">Evolución Clínica</h3>
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-300 rounded-full" /> Línea Base
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-pink-500 rounded-full" /> Actual
                    </span>
                </div>
            </div>

            <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
                    <BarChart3 size={16} className="text-pink-600" /> Curva de Progreso (Índice Global)
                </h4>
                <EvidenceChart sessions={patient.sessions || []} />
            </div>

            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 md:flex md:gap-8 gap-4">
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        MOCA (Cognitivo)
                    </span>
                    <span className="text-lg font-bold text-slate-800">
                        {patient.cognitiveScores?.moca || '-'}
                    </span>
                </div>
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        MMSE (Mini-Mental)
                    </span>
                    <span className="text-lg font-bold text-slate-800">
                        {patient.cognitiveScores?.mmse || '-'}
                    </span>
                </div>
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        GDS (Reisberg)
                    </span>
                    <span className="text-lg font-bold text-slate-800">
                        {patient.cognitiveScores?.gds || '-'}
                    </span>
                </div>
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        Fecha Evaluación
                    </span>
                    <span className="text-sm font-medium text-slate-600">
                        {patient.cognitiveScores?.date || '-'}
                    </span>
                </div>
                <Button
                    size="sm"
                    variant="secondary"
                    className="col-span-2 md:col-span-1 md:ml-auto h-fit my-auto w-full md:w-auto mt-2 md:mt-0"
                    onClick={onOpenCognitive}
                    icon={PenTool}
                >
                    Actualizar Evaluación
                </Button>
            </div>
        </Card>
    );
};

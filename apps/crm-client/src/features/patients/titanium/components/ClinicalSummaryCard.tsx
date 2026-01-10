import React from 'react';
import { Patient } from '@monorepo/shared';
import { Card } from '../../../../components/ui/Card';
import { Brain, Lightbulb, Target } from 'lucide-react';

interface ClinicalSummaryCardProps {
    patient: Patient;
}

export const ClinicalSummaryCard: React.FC<ClinicalSummaryCardProps> = ({ patient }) => {
    const { clinicalFormulation, initialGoals } = patient;

    const hasFormulation = clinicalFormulation && (
        clinicalFormulation.synthesis ||
        clinicalFormulation.hypothesis
    );

    if (!hasFormulation && !initialGoals) {
        return (
            <Card className="p-6">
                <div className="text-center text-slate-400 py-8">
                    <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Sin formulación clínica registrada.</p>
                </div>
            </Card>
        );
    }

    const renderFormulation = (data?: string | { selected: string[]; text: string }) => {
        if (!data) return null;
        if (typeof data === 'string') return data;
        return data.text;
    };

    return (
        <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Brain className="w-5 h-5 text-brand-600" />
                Resumen Clínico
            </h3>

            {clinicalFormulation?.synthesis && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-slate-500" />
                        Síntesis del Caso
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {renderFormulation(clinicalFormulation.synthesis)}
                    </p>
                </div>
            )}

            {clinicalFormulation?.hypothesis && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        Hipótesis de Trabajo
                    </h4>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        {renderFormulation(clinicalFormulation.hypothesis)}
                    </p>
                </div>
            )}

            {initialGoals && (
                <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Objetivos Iniciales</h4>
                    <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-md italic">
                        "{initialGoals}"
                    </p>
                </div>
            )}
        </Card>
    );
};

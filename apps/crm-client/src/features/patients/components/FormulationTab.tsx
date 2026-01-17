import React from 'react';
import { Card } from '../../../components/ui/Card';
import { ClinicalFormulation, FormulationData } from '../../../lib/types';
import { FORMULATION_OPTIONS as FORMULATION_DATA } from '../../../lib/constants'; // Importing constant data

interface FormulationTabProps {
  data: ClinicalFormulation;
  isEditing: boolean;
  onChange: (field: string, value: unknown) => void;
}

export const FormulationTab: React.FC<FormulationTabProps> = ({ data, isEditing, onChange }) => {
  // Helper para manejar cambios en legacy vs new structure
  // Si data.synthesis es string (legacy), asumimos text. Si es objeto, usamos text y selected
  const getText = (field: string) => {
    const val = data ? data[field as keyof FormulationData] : undefined;
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null && 'text' in val) return (val as { text: string }).text || '';
    return '';
  };

  const getSelected = (field: string): string[] => {
    const val = data[field as keyof ClinicalFormulation];
    if (typeof val === 'object' && val !== null && 'selected' in val) return (val as { selected: string[] }).selected;
    return [];
  };

  const renderSection = (title: string, field: keyof typeof FORMULATION_DATA, color: string) => {
    const options = (FORMULATION_DATA as Record<string, string[]>)[field] || [];
    // const currentText = getText(title.toLowerCase()); // Simplificacion: usar el key correcto
    // Mejor usar un mapeo explícito
    const fieldKeyMap: Record<string, string> = {
      'Hipótesis de Trabajo': 'hypothesis',
      'Síntesis Diagnóstica': 'synthesis',
      'Habilidades Preservadas': 'preserved',
      'Dificultades Principales': 'difficulties',
      Reguladores: 'regulators',
    };
    const key = fieldKeyMap[title] || field;

    const currentSelections = getSelected(key);
    const textVal = getText(key);

    return (
      <Card className="p-6 border-l-4" style={{ borderColor: color }} noPadding>
        <div className="p-6">
          <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-[${color}]`}></div> {title}
          </h4>

          {isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => {
                      const newSel = currentSelections.includes(opt)
                        ? currentSelections.filter((s) => s !== opt)
                        : [...currentSelections, opt];
                      onChange(key, { text: textVal, selected: newSel });
                    }}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${currentSelections.includes(opt)
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <textarea
                className="input-pro min-h-[100px]"
                value={textVal}
                onChange={(e) =>
                  onChange(key, { text: e.target.value, selected: currentSelections })
                }
                placeholder={`Describa detalladamente...`}
              />
            </div>
          ) : (
            <div>
              {currentSelections.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentSelections.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                {textVal || (
                  <span className="text-slate-300 italic">Sin información registrada.</span>
                )}
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderSection('Síntesis Diagnóstica', 'synthesis', '#EC008C')}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSection('Habilidades Preservadas', 'preserved', '#10B981')}
        {renderSection('Dificultades Principales', 'difficulties', '#F59E0B')}
      </div>
      {renderSection('Hipótesis de Trabajo', 'hypothesis', '#6366F1')}
    </div>
  );
};

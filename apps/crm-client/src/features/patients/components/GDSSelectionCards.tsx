import React from 'react';


export const GDS_STAGES = [
  {
    id: 1,
    title: 'GDS 1: Sin Deterioro',
    desc: 'Ausencia de quejas cognitivas. Examen normal.',
    color: 'border-emerald-200 bg-emerald-50',
  },
  {
    id: 2,
    title: 'GDS 2: Queja Subjetiva',
    desc: 'Olvidos benignos (nombres, lugares). No objetivable.',
    color: 'border-emerald-200 bg-emerald-50',
  },
  {
    id: 3,
    title: 'GDS 3: Deterioro Leve',
    desc: 'Defecto claro. Se pierde en viajes, olvida nombres nuevos.',
    color: 'border-amber-200 bg-amber-50',
  },
  {
    id: 4,
    title: 'GDS 4: Deterioro Moderado',
    desc: 'No maneja finanzas complejas. Negación del déficit.',
    color: 'border-amber-200 bg-amber-50',
  },
  {
    id: 5,
    title: 'GDS 5: Mod-Grave',
    desc: 'Necesita ayuda para elegir ropa. Desorientación T/E.',
    color: 'border-orange-200 bg-orange-50',
  },
  {
    id: 6,
    title: 'GDS 6: Grave',
    desc: 'Dependencia vestir/baño. Incontinencia. Cambios carácter.',
    color: 'border-red-200 bg-red-50',
  },
  {
    id: 7,
    title: 'GDS 7: Muy Grave',
    desc: 'Pérdida lenguaje y motor. Dependencia total.',
    color: 'border-red-200 bg-red-50',
  },
];

interface GDSSelectionCardsProps {
  selected: number;
  onSelect: (val: number) => void;
}

export const GDSSelectionCards: React.FC<GDSSelectionCardsProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {GDS_STAGES.map((stage) => (
        <div
          key={stage.id}
          onClick={() => onSelect(stage.id)}
          className={`
                        cursor-pointer relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300
                        ${selected === stage.id
              ? 'border-pink-500 shadow-3d scale-[1.02] bg-white ring-2 ring-pink-200'
              : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-md'
            }
                    `}
        >
          <div
            className={`absolute top-0 right-0 px-2 py-1 text-[10px] font-bold rounded-bl-lg ${selected === stage.id ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            NIVEL {stage.id}
          </div>

          <h4
            className={`font-bold text-sm mb-2 ${selected === stage.id ? 'text-pink-700' : 'text-slate-800'}`}
          >
            {stage.title}
          </h4>

          <p className="text-xs text-slate-500 leading-relaxed font-medium">{stage.desc}</p>

          {selected === stage.id && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>
          )}
        </div>
      ))}
    </div>
  );
};

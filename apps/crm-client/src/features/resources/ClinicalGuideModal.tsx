import React from 'react';
import { X, BookOpen, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import { CLINICAL_GUIDES } from '../../lib/constants'; // Need to export these from constants

interface ClinicalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  pathologyType: string;
}

export const ClinicalGuideModal: React.FC<ClinicalGuideModalProps> = ({
  isOpen,
  onClose,
  pathologyType,
}) => {
  if (!isOpen) return null;

  const guide = CLINICAL_GUIDES[pathologyType] || CLINICAL_GUIDES['other'];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Guía Clínica</h2>
              <p className="text-sm text-slate-500 font-medium">
                Protocolo Sugerido: {guide.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {/* Objetivos */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Target size={18} className="text-blue-500" /> Objetivos Terapéuticos
            </h4>
            <ul className="space-y-2">
              {guide.objectives.map((o: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-600 bg-blue-50/50 p-3 rounded-xl border border-blue-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* Técnicas */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Lightbulb size={18} className="text-amber-500" /> Técnicas Recomendadas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {guide.techniques.map((t: string, i: number) => (
                <div
                  key={i}
                  className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm font-bold text-amber-800 text-center"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Precauciones */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <AlertTriangle size={18} className="text-red-500" /> Precauciones / Contraindicaciones
            </h4>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <ul className="space-y-2">
                {guide.precautions.map((p: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-bold text-red-700">
                    <AlertTriangle size={12} className="mt-0.5" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

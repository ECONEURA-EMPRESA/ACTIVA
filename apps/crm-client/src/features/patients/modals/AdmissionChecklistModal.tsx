import React, { useState } from 'react';
import { ClipboardCheck, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ADMISSION_CHECKS } from '../../../lib/constants';

interface AdmissionChecklistModalProps {
  onClose: () => void;
  onSave: (checks: { safety: string[]; prep: string[] }) => void;
  initialData?: { safety: string[]; prep: string[] };
  isChild?: boolean;
}

export const AdmissionChecklistModal: React.FC<AdmissionChecklistModalProps> = ({
  onClose,
  onSave,
  initialData,
  isChild = false,
}) => {
  const [checks, setChecks] = useState(initialData || { safety: [], prep: [] });

  // Determine which lists to use based on child/adult
  // Fallback to empty arrays if undefined in constants (though we updated them)
  const safetyItems = isChild
    ? ADMISSION_CHECKS.child_safety || []
    : ADMISSION_CHECKS.adult_safety || [];
  const prepItems = isChild ? ADMISSION_CHECKS.child_prep || [] : ADMISSION_CHECKS.adult_prep || [];

  const toggle = (type: 'safety' | 'prep', item: string) =>
    setChecks((prev) => {
      const list = prev[type] || [];
      return {
        ...prev,
        [type]: list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
      };
    });

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex gap-2 items-center text-slate-800">
            <ClipboardCheck className="text-pink-600" />
            Checklist de Admisión {isChild ? '(Infantil)' : '(Adulto)'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Safety Section */}
          <div className="bg-red-50/50 p-6 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} /> Seguridad y Contraindicaciones
            </h3>
            <div className="space-y-3">
              {safetyItems.map((i) => (
                <label key={i} className="flex gap-3 items-start cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={checks.safety.includes(i)}
                      onChange={() => toggle('safety', i)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm checked:bg-red-600 checked:border-red-600 focus:ring-2 focus:ring-red-200 transition-all"
                    />
                    <CheckCircle2
                      className="pointer-events-none absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      size={14}
                    />
                  </div>
                  <span
                    className={`text-sm transition-colors ${checks.safety.includes(i) ? 'text-red-800 font-medium' : 'text-slate-700 group-hover:text-slate-900'}`}
                  >
                    {i}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Prep Section */}
          <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100">
            <h3 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} /> Preparación 1ª Sesión
            </h3>
            <div className="space-y-3">
              {prepItems.map((i) => (
                <label key={i} className="flex gap-3 items-start cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={checks.prep.includes(i)}
                      onChange={() => toggle('prep', i)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm checked:bg-emerald-600 checked:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all"
                    />
                    <CheckCircle2
                      className="pointer-events-none absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      size={14}
                    />
                  </div>
                  <span
                    className={`text-sm transition-colors ${checks.prep.includes(i) ? 'text-emerald-800 font-medium' : 'text-slate-700 group-hover:text-slate-900'}`}
                  >
                    {i}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(checks);
              onClose();
            }}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2"
          >
            <ClipboardCheck size={16} />
            Guardar Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

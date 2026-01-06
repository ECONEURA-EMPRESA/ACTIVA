import React, { useState } from 'react';
import { X, ClipboardCheck, Lightbulb, CheckSquare, Save, ClipboardList } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import {
  CLINICAL_GUIDES,
  SESSION_ACTIVITIES,
  EVALUATION_AREAS,
  ClinicalGuideKey,
} from '../../../lib/clinicalUtils';
import { formatDateForInput, formatDateForDisplay } from '../../../lib/patientUtils';

interface SessionModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  patientType: string;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  onClose,
  onSave,
  initialData,
  patientType,
}) => {
  const [scores, setScores] = useState<number[]>(initialData?.scores || Array(9).fill(0));
  const [date, setDate] = useState(formatDateForInput(initialData?.date));
  const [sessionType] = useState(initialData?.type || 'individual');
  const [activityDetails, setActivityDetails] = useState<Record<string, string>>(
    initialData?.activityDetails || {},
  );
  const [isAbsent, setIsAbsent] = useState(initialData?.isAbsent || false);
  const [price, setPrice] = useState(initialData?.price || 50);
  const [isPaid, setIsPaid] = useState(initialData?.paid || false);

  // Safe guide retrieval
  const guideKey = patientType in CLINICAL_GUIDES ? (patientType as ClinicalGuideKey) : 'other';
  const guide = CLINICAL_GUIDES[guideKey] || CLINICAL_GUIDES.other;

  const toggleActivity = (actId: string) => {
    const newDetails = { ...activityDetails };
    if (newDetails[actId] !== undefined) {
      delete newDetails[actId];
    } else {
      newDetails[actId] = '';
    }
    setActivityDetails(newDetails);
  };

  const updateActivityDetail = (actId: string, text: string) => {
    setActivityDetails((prev) => ({ ...prev, [actId]: text }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-3d rounded-2xl animate-in zoom-in-95"
        noPadding={true}
      >
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 border-slate-100">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <ClipboardCheck className="text-pink-600" /> Bitácora de Sesión
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="brand">Enfoque: {guide.focus}</Badge>
              <span className="text-xs text-slate-400 font-medium">({guide.title})</span>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100/50 flex items-start gap-3">
          <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-amber-900 leading-snug">
            <strong>Recordatorio Clínico ({guide.title}):</strong> Objetivos prioritarios:{' '}
            {guide.objectives.join(', ')}. Técnicas sugeridas: {guide.techniques.join(', ')}.
            <span className="italic opacity-80 block mt-1">
              Precaución: {guide.precautions.join(', ')}.
            </span>
          </div>
        </div>

        <form
          className="p-8 space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const notes = formData.get('notes');
            const groupAnalysis = formData.get('groupAnalysis');
            const qual_mus = formData.get('qual_mus');
            const qual_emo = formData.get('qual_emo');
            const qual_cog = formData.get('qual_cog');
            const qual_fis = formData.get('qual_fis');

            onSave({
              id: initialData?.id || Date.now(),
              date: formatDateForDisplay(date),
              phase: 2,
              activityDetails,
              notes,
              scores,
              type: sessionType,
              groupAnalysis,
              qualitative: {
                musical: qual_mus,
                emotional: qual_emo,
                cognitive: qual_cog,
                physical: qual_fis,
              },
              price,
              paid: isPaid,
              isAbsent,
            });
          }}
        >
          <div className="flex justify-center mb-6 gap-6 items-end">
            <div className="flex flex-col w-1/3">
              <label className="label-pro">Fecha Sesión</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-pro"
                required
              />
            </div>
            <div className="flex flex-col w-1/3">
              <label className="label-pro">Estado Asistencia</label>
              <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAbsent(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isAbsent ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Asistió
                </button>
                <button
                  type="button"
                  onClick={() => setIsAbsent(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isAbsent ? 'bg-white text-red-600 shadow-sm ring-1 ring-red-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Ausencia
                </button>
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <label className="label-pro">Pago</label>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div className="flex flex-col pl-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Importe
                  </span>
                  <div className="flex items-baseline">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-16 bg-transparent font-bold text-lg text-slate-700 outline-none -mt-1"
                    />
                    <span className="text-xs font-bold text-slate-400">€</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaid(!isPaid)}
                  className={`ml-auto px-4 py-2 rounded-lg text-xs font-black tracking-wide transition-colors ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                >
                  {isPaid ? 'PAGADO' : 'PENDIENTE'}
                </button>
              </div>
            </div>
          </div>

          {!isAbsent && (
            <>
              <div className="space-y-4">
                <label className="label-pro flex items-center gap-2 text-slate-600">
                  <ClipboardList size={16} /> Desarrollo de la Sesión (Ejercicios)
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {SESSION_ACTIVITIES.map((act) => {
                    const isSelected = activityDetails[act.id] !== undefined;
                    return (
                      <div
                        key={act.id}
                        className={`border rounded-xl transition-all duration-300 ${isSelected ? 'border-pink-500 bg-pink-50/20 shadow-md transform -translate-y-0.5' : 'border-slate-200 bg-white hover:border-pink-200'}`}
                      >
                        <div
                          className="flex items-center gap-3 p-4 cursor-pointer"
                          onClick={() => toggleActivity(act.id)}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-pink-500 border-pink-500' : 'bg-white border-slate-300'}`}
                          >
                            {isSelected && <CheckSquare size={14} className="text-white" />}
                          </div>
                          <span
                            className={`text-sm font-bold ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}
                          >
                            {act.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in">
                            <textarea
                              className="w-full bg-white border border-pink-200 rounded-lg p-3 text-sm text-slate-700 h-24 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none shadow-inner"
                              placeholder={`Detalles: ${act.placeholder}`}
                              value={activityDetails[act.id]}
                              onChange={(e) => updateActivityDetail(act.id, e.target.value)}
                              autoFocus
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner">
                <label className="label-pro mb-6 text-center text-slate-500 w-full border-b border-slate-200 pb-2">
                  Evaluación Cualitativa por Áreas
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">
                      Respuesta Sonora-Musical
                    </label>
                    <textarea
                      name="qual_mus"
                      defaultValue={initialData?.qualitative?.musical}
                      className="input-pro h-24 resize-none text-sm bg-white"
                      placeholder="Ritmo, melodía, intensidad..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">
                      Respuesta Emocional
                    </label>
                    <textarea
                      name="qual_emo"
                      defaultValue={initialData?.qualitative?.emotional}
                      className="input-pro h-24 resize-none text-sm bg-white"
                      placeholder="Estado de ánimo..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">
                      Respuesta Cognitiva
                    </label>
                    <textarea
                      name="qual_cog"
                      defaultValue={initialData?.qualitative?.cognitive}
                      className="input-pro h-24 resize-none text-sm bg-white"
                      placeholder="Atención, memoria, lenguaje..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">
                      Respuesta Física/Motora
                    </label>
                    <textarea
                      name="qual_fis"
                      defaultValue={initialData?.qualitative?.physical}
                      className="input-pro h-24 resize-none text-sm bg-white"
                      placeholder="Movimiento, tono..."
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <label className="label-pro mb-4">Evaluación Cuantitativa (0-3)</label>
                <div className="grid grid-cols-2 gap-4">
                  {EVALUATION_AREAS.map((a, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                      <span className="text-xs font-medium text-slate-600">{a}</span>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((v) => (
                          <button
                            type="button"
                            key={v}
                            onClick={() => {
                              const n = [...scores];
                              n[i] = v;
                              setScores(n);
                            }}
                            className={`w-8 h-8 text-xs rounded-lg font-bold transition-all ${scores[i] === v ? 'bg-pink-500 text-white shadow-md scale-110' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <label className="label-pro">Notas Generales / Incidencias</label>
            <textarea
              name="notes"
              defaultValue={initialData?.notes}
              className="input-pro h-32 text-base"
              placeholder={
                isAbsent ? 'Motivo de la ausencia...' : 'Observaciones generales de la sesión...'
              }
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" icon={Save} className="shadow-lg hover:shadow-xl px-8">
              Guardar Sesión
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

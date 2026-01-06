import React, { useState } from 'react';
import { X, Save, Clock, Euro, ClipboardList, Mic2, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Session, QualitativeEval, Patient } from '../../../lib/types';
import { SESSION_ACTIVITIES, EVALUATION_AREAS } from '../../../lib/constants';
import { formatDateForInput } from '../../../lib/utils';
import { PatientAvatar } from '../../../components/ui/PatientAvatar';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: Session, scores: number[]) => void;
  patient?: Patient;
  session?: Session;
  selectedDate?: Date;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patient,
  session,
  selectedDate,
}) => {
  // Estado inicial basado en si es edición o nuevo
  const [date, setDate] = useState(
    session?.date
      ? formatDateForInput(session.date)
      : formatDateForInput(selectedDate?.toLocaleDateString('es-ES')),
  );
  const [price, setPrice] = useState(session?.price || 50);
  const [paid, setPaid] = useState(session?.paid || false);
  const [notes, setNotes] = useState(session?.notes || '');
  const [attendance, setAttendance] = useState<'present' | 'absent'>(
    session?.isAbsent ? 'absent' : 'present',
  );

  // Actividades y Notas Específicas
  const [activities, setActivities] = useState<Record<string, string>>(
    session?.activityDetails || {},
  );

  // Recurrencia (New V2 Feature)
  const [isRecurring] = useState(false);
  const [recurrenceFreq] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [recurrenceEnd] = useState('');

  // Evaluación Cualitativa
  const [qualitative, setQualitative] = useState<QualitativeEval>(
    session?.qualitative || { musical: '', emotional: '', cognitive: '', physical: '' },
  );

  // Puntuaciones (Scores)
  const [scores, setScores] = useState<number[]>(
    session?.scores ||
    (patient?.currentEval ? [...patient.currentEval] : Array(EVALUATION_AREAS.length).fill(0)),
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSession: Session = {
      id: session?.id || Date.now(),
      date: new Date(date).toLocaleDateString('es-ES'),
      type: 'individual',
      price: Number(price),
      paid,
      isAbsent: attendance === 'absent',
      notes,
      activityDetails: activities,
      qualitative,
      scores: attendance === 'absent' ? undefined : scores,
      recurrence: isRecurring ? {
        frequency: recurrenceFreq,
        daysOfWeek: [new Date(date).getDay()],
        endDate: recurrenceEnd
      } : undefined
    };

    onSave(newSession, scores);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            {patient && <PatientAvatar name={patient.name} photo={patient.photo} size="md" />}
            <div>
              <h2 className="text-xl font-black text-slate-800">Registro de Sesión</h2>
              <p className="text-sm text-slate-500 font-medium">{patient?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda: Datos Básicos */}
            <div className="space-y-6">
              <Card className="p-6 border-l-4 border-pink-500" noPadding>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="label-pro">Fecha</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input
                        type="date"
                        className="input-pro pl-10"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="label-pro">Honorarios (€)</label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input
                        type="number"
                        className="input-pro pl-10"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="label-pro mb-0 cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={paid}
                        onChange={(e) => setPaid(e.target.checked)}
                        className="accent-pink-600 w-4 h-4 rounded"
                      />
                      Pagado
                    </label>
                    <label className="label-pro mb-0 cursor-pointer flex items-center gap-2 ml-4">
                      <input
                        type="checkbox"
                        checked={attendance === 'absent'}
                        onChange={(e) => setAttendance(e.target.checked ? 'absent' : 'present')}
                        className="accent-red-600 w-4 h-4 rounded"
                      />
                      Ausente
                    </label>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-indigo-500" noPadding>
                <div className="p-6">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Mic2 size={16} className="text-indigo-500" /> Actividades
                  </h4>
                  <div className="space-y-3">
                    {SESSION_ACTIVITIES.map((act) => (
                      <div key={act.id}>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                          {act.label}
                        </label>
                        <input
                          className="input-pro py-2 text-xs"
                          placeholder={act.placeholder}
                          value={activities[act.id] || ''}
                          onChange={(e) =>
                            setActivities({ ...activities, [act.id]: e.target.value })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Columna Central: Evaluación Cualitativa */}
            <div className="lg:col-span-2 space-y-6">
              {attendance === 'present' ? (
                <>
                  <Card className="p-6" noPadding>
                    <div className="p-6">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ClipboardList size={18} className="text-amber-500" /> Notas Clínicas &
                        Análisis Cualitativo
                        <button
                          type="button"
                          onClick={() => alert("✨ Funcionalidad AI Copilot: En la versión final, esto generará un resumen automático basado en el audio de la sesión.")}
                          className="ml-auto text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                        >
                          <Sparkles size={14} /> Generar con IA
                        </button>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="label-pro text-pink-600">Musical</label>
                          <textarea
                            className="input-pro text-xs min-h-[80px]"
                            placeholder="Respuesta sonoro-musical..."
                            value={qualitative.musical}
                            onChange={(e) =>
                              setQualitative({ ...qualitative, musical: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label-pro text-blue-600">Emocional</label>
                          <textarea
                            className="input-pro text-xs min-h-[80px]"
                            placeholder="Estado anímico, expresión..."
                            value={qualitative.emotional}
                            onChange={(e) =>
                              setQualitative({ ...qualitative, emotional: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label-pro text-purple-600">Cognitiva</label>
                          <textarea
                            className="input-pro text-xs min-h-[80px]"
                            placeholder="Atención, memoria, lenguaje..."
                            value={qualitative.cognitive}
                            onChange={(e) =>
                              setQualitative({ ...qualitative, cognitive: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="label-pro text-emerald-600">Física</label>
                          <textarea
                            className="input-pro text-xs min-h-[80px]"
                            placeholder="Motor, postural, sensorial..."
                            value={qualitative.physical}
                            onChange={(e) =>
                              setQualitative({ ...qualitative, physical: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <label className="label-pro">Notas Generales / Incidencias</label>
                        <textarea
                          className="input-pro min-h-[60px]"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-slate-50" noPadding>
                    <div className="p-6">
                      <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">
                        Evaluación Cuantitativa (0-3)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {EVALUATION_AREAS.map((area, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">
                                {area}
                              </label>
                              <span className="text-xs font-black text-pink-600">
                                {scores[idx]}
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="3"
                              step="1"
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                              value={scores[idx]}
                              onChange={(e) => {
                                const newScores = [...scores];
                                newScores[idx] = parseInt(e.target.value);
                                setScores(newScores);
                              }}
                            />
                            <div className="flex justify-between text-[9px] text-slate-400 font-medium px-1">
                              <span>0</span>
                              <span>1</span>
                              <span>2</span>
                              <span>3</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <X size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">
                    Sesión Marcada como Ausente
                  </h3>
                  <p className="text-red-600 max-w-md">
                    No se registrarán datos clínicos ni puntuaciones para esta fecha. Puede añadir
                    notas administrativas si es necesario.
                  </p>
                  <textarea
                    className="input-pro mt-6 bg-white border-red-200"
                    placeholder="Motivo de la ausencia..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} icon={Save}>
            Guardar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

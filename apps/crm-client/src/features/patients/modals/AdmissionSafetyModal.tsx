import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Music,
  HeartPulse,
  BrainCircuit,
  CheckCircle2,
  X,
} from 'lucide-react';
import { ClinicalSafetyProfile, MusicalIdentity, PsychosocialContext } from '../../../lib/types';

interface AdmissionSafetyModalProps {
  onClose: () => void;
  onSave: (data: {
    safety: ClinicalSafetyProfile;
    iso: MusicalIdentity;
    ctx: PsychosocialContext;
  }) => void;
  initialData?: any;
  isChild?: boolean;
}

export const AdmissionSafetyModal: React.FC<AdmissionSafetyModalProps> = ({
  onClose,
  onSave,
  initialData,
  isChild = false,
}) => {
  // 1. SAFETY (SEMÁFORO ROJO)
  const [safety, setSafety] = useState<ClinicalSafetyProfile>(
    initialData?.safetyProfile || {
      epilepsy: false,
      dysphagia: false,
      flightRisk: false,
      psychomotorAgitation: false,
      hyperacusis: false,
      chokingHazard: false,
      disruptiveBehavior: false,
      alerts: [],
      mobilityAid: 'none',
      allergies: '',
    },
  );

  // 2. ISO (MUSICAL BLOOD TYPE)
  const [iso, setIso] = useState<MusicalIdentity>(
    initialData?.musicalIdentity || {
      likes: [],
      dislikes: [],
      biographicalSongs: [],
      instrumentsOfInterest: [],
      musicalTraining: false,
      sensitivityLevel: 'medium',
    },
  );

  // 3. CONTEXT
  const [ctx, setCtx] = useState<PsychosocialContext>(
    initialData?.socialContext || {
      livingSituation: 'family',
      caregiverNetwork: '',
      recentLifeEvents: [],
      occupation: '',
    },
  );

  // HELPERS
  const toggleSafety = (field: keyof ClinicalSafetyProfile) => {
    setSafety((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // UI SECTIONS
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl md:rounded-3xl shadow-2xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* HEADER */}
        <div className="bg-slate-900 p-4 md:p-6 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black flex items-center gap-2 md:gap-3">
              <ShieldAlert className="text-red-500 w-5 h-5 md:w-6 md:h-6" />
              Protocolo Seguridad/ISO
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5 md:mt-1">
              Triaje Clínico • {isChild ? 'Pediátrico' : 'Adultos'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-10">
          {/* SECTION 1: RED LIGHTS (RISKS) */}
          <section>
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3 md:mb-4 flex items-center gap-2 border-b pb-2 border-slate-100">
              <AlertTriangle className="text-red-600 w-5 h-5" />
              1. Semáforo Rojo
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {!isChild && (
                <>
                  <RiskToggle
                    label="Riesgo Fuga"
                    desc="Deambulación"
                    active={safety.flightRisk}
                    onClick={() => toggleSafety('flightRisk')}
                  />
                  <RiskToggle
                    label="Disfagia"
                    desc="Riesgo Aspiración"
                    active={safety.dysphagia}
                    onClick={() => toggleSafety('dysphagia')}
                  />
                </>
              )}

              <RiskToggle
                label="Epilepsia"
                desc="Musicógena"
                active={safety.epilepsy}
                onClick={() => toggleSafety('epilepsy')}
              />

              <RiskToggle
                label="Agitación"
                desc="Auto/Heteroagresión"
                active={safety.psychomotorAgitation}
                onClick={() => toggleSafety('psychomotorAgitation')}
              />

              {isChild && (
                <>
                  <RiskToggle
                    label="Hiperacusia"
                    desc="Dolor/Sensibilidad"
                    active={safety.hyperacusis}
                    onClick={() => toggleSafety('hyperacusis')}
                  />
                  <RiskToggle
                    label="Atragantar"
                    desc="Pica / Ingesta"
                    active={safety.chokingHazard}
                    onClick={() => toggleSafety('chokingHazard')}
                  />
                </>
              )}
            </div>
          </section>

          {/* SECTION 2: ISO (MUSICAL IDENTITY) */}
          <section>
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3 md:mb-4 flex items-center gap-2 border-b pb-2 border-slate-100">
              <Music className="text-indigo-600 w-5 h-5" />
              2. Identidad Sonora (ISO)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-red-50 p-4 md:p-6 rounded-2xl border border-red-100">
                <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2 text-sm md:text-base">
                  <ShieldAlert size={16} /> ISO Nocivo
                </h4>
                <TagInput
                  placeholder="Prohibido (ej: Sirenas)..."
                  tags={iso.dislikes}
                  onAdd={(t: string) => setIso((p) => ({ ...p, dislikes: [...p.dislikes, t] }))}
                  onRemove={(t: string) =>
                    setIso((p) => ({ ...p, dislikes: p.dislikes.filter((x) => x !== t) }))
                  }
                  color="red"
                />
              </div>

              <div className="bg-indigo-50 p-4 md:p-6 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2 text-sm md:text-base">
                  <HeartPulse size={16} /> Canciones Biográficas
                </h4>
                <TagInput
                  placeholder="Canción clave..."
                  tags={iso.biographicalSongs}
                  onAdd={(t: string) =>
                    setIso((p) => ({ ...p, biographicalSongs: [...p.biographicalSongs, t] }))
                  }
                  onRemove={(t: string) =>
                    setIso((p) => ({
                      ...p,
                      biographicalSongs: p.biographicalSongs.filter((x) => x !== t),
                    }))
                  }
                  color="indigo"
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: CONTEXT */}
          <section>
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3 md:mb-4 flex items-center gap-2 border-b pb-2 border-slate-100">
              <BrainCircuit className="text-emerald-600 w-5 h-5" />
              3. Contexto Psicosocial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label text-xs md:text-sm">Red de Apoyo / Cuidador</label>
                <textarea
                  className="input-pro w-full h-20 md:h-24 text-sm"
                  placeholder="¿Quién acompaña?"
                  value={ctx.caregiverNetwork}
                  onChange={(e) => setCtx((c) => ({ ...c, caregiverNetwork: e.target.value }))}
                />
              </div>
              <div>
                <label className="label text-xs md:text-sm">Eventos Vitales Recientes</label>
                <TagInput
                  placeholder="Duelos / Cambios..."
                  tags={ctx.recentLifeEvents}
                  onAdd={(t: string) =>
                    setCtx((c) => ({ ...c, recentLifeEvents: [...c.recentLifeEvents, t] }))
                  }
                  onRemove={(t: string) =>
                    setCtx((c) => ({
                      ...c,
                      recentLifeEvents: c.recentLifeEvents.filter((x) => x !== t),
                    }))
                  }
                  color="emerald"
                />
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex flex-col-reverse md:flex-row justify-end gap-3 shrink-0">
          <button onClick={onClose} className="btn-ghost w-full md:w-auto justify-center">
            Cancelar
          </button>
          <button
            onClick={() => onSave({ safety, iso, ctx })}
            className="btn-primary w-full md:w-auto justify-center flex items-center gap-2 shadow-xl shadow-indigo-200"
          >
            <CheckCircle2 size={18} />
            Confirmar Protocolo
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const RiskToggle = ({ label, desc, active, onClick }: any) => (
  <div
    onClick={onClick}
    className={`p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${active
      ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200'
      : 'bg-white border-slate-200 text-slate-500 hover:border-red-300'
      }`}
  >
    <div className="flex justify-between items-start">
      <h4 className="font-bold text-xs md:text-sm">{label}</h4>
      {active && <AlertTriangle size={16} className="text-white animate-pulse" />}
    </div>
    <p
      className={`text-[10px] md:text-xs mt-1 leading-tight ${active ? 'text-red-100' : 'text-slate-400'}`}
    >
      {desc}
    </p>
  </div>
);

const TagInput = ({ placeholder, tags, onAdd, onRemove, color }: any) => {
  const [val, setVal] = useState('');
  const handleKey = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (val.trim()) {
        onAdd(val.trim());
        setVal('');
      }
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t: string, i: number) => (
          <span
            key={i}
            className={`px-2 py-1 rounded bg-${color}-100 text-${color}-700 text-xs font-bold flex items-center gap-1`}
          >
            {t}{' '}
            <button onClick={() => onRemove(t)} className="hover:text-red-600">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <input
        className="input-pro w-full text-sm"
        placeholder={placeholder + ' (Enter)'}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKey}
      />
    </div>
  );
};

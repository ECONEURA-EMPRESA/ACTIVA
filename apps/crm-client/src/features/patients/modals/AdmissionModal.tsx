import React, { useState, useEffect, useRef } from 'react';
import { X, UserCheck, Hash, Users, Music, Printer, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { generatePatientReference, COMMON_PATHOLOGIES } from '../../../lib/patientUtils';
import { compressImage } from '../../../lib/utils';
import { Patient } from '../../../lib/types';

interface AdmissionModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Partial<Patient>;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({ onClose, onSave, initialData }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  const [diagnosisType, setDiagnosisType] = useState<string>(
    initialData?.pathologyType ? 'dementia' : '',
  );
  const [pathologyType, setPathologyType] = useState<string>(initialData?.pathologyType || 'other');
  const [hasConsent, setHasConsent] = useState<boolean>(initialData?.hasConsent || false);

  // REF PARA EL FORMULARIO
  const formRef = useRef<HTMLFormElement>(null);

  // ESTADOS PARA GENERACIÓN AUTOMÁTICA
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState(
    initialData?.joinedDate || new Date().toISOString().split('T')[0],
  );
  const [reference, setReference] = useState(initialData?.reference || '');
  const [isManualRef, setIsManualRef] = useState(!!initialData?.reference);
  const [age, setAge] = useState<string | number>(initialData?.age || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');

  // EFFECT: Calcular edad si cambia nacimiento
  useEffect(() => {
    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    }
  }, [birthDate]);

  // EFFECT: Generar referencia automáticamente
  useEffect(() => {
    if (!isManualRef && name && date) {
      const autoRef = generatePatientReference(name, date);
      setReference(autoRef);
    }
  }, [name, date, isManualRef]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      try {
        const compressed = await compressImage(f);
        setPhotoPreview(compressed);
      } catch (err) {
        console.error('Error compressing image:', err);
        console.error('Error compressing image:', err);
        // Toast should be triggered here ideally
        console.error('Error al procesar la imagen. Inténtelo de nuevo.');
      }
    }
  };

  const handleDiagnosisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDiagnosisType(val);
    const pathMap: Record<string, string> = {
      'Alzheimer y otras Demencias': 'dementia',
      'Deterioro Cognitivo Leve': 'dementia',
      Parkinson: 'neuro',
      'Daño Cerebral Adquirido': 'neuro',
      'Esclerosis Múltiple / ELA': 'neuro',
      'Depresión y Trastornos del Ánimo': 'mood',
      'Ansiedad y Estrés': 'mood',
      TEA: 'neuro',
      TDAH: 'neuro',
      'Parálisis Cerebral': 'neuro',
    };
    setPathologyType(pathMap[val] || 'other');
  };

  const handlePrintConsent = () => {
    console.info(`Generando Consentimiento para ${name}.`);
    // Logic for printing would go here
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-3d overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between bg-white sticky top-0 z-20">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Perfil' : 'Nueva Admisión'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X />
          </button>
        </div>
        <div className="p-8 overflow-y-auto">
          {/* FORMULARIO CON REFERENCIA (ref={formRef}) */}
          <form
            ref={formRef}
            id="formAd"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const d: any = Object.fromEntries(formData);

              d.age = Number(d.age);
              d.reference = reference;
              d.hasConsent = hasConsent; // Guardar estado del checkbox

              if (photoPreview) d.photo = photoPreview;

              // Logic for custom diagnosis
              if (d.diagnosisSelect === 'other' || !d.diagnosisSelect) {
                if (diagnosisType === 'Otras...' || diagnosisType === 'other') {
                  d.diagnosis = d.customDiagnosis;
                } else {
                  d.diagnosis = d.diagnosisSelect;
                }
              } else {
                d.diagnosis = d.diagnosisSelect;
              }

              const isOther = d.diagnosisSelect === 'other';
              if (isOther) {
                d.diagnosis = d.customDiagnosis;
              }

              d.pathologyType = pathologyType;
              delete d.diagnosisSelect;
              delete d.customDiagnosis;
              onSave(d);
            }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              <div className="flex flex-col items-center gap-3 mx-auto md:mx-0">
                <div className="relative group cursor-pointer w-32 h-32 rounded-full border-4 border-white shadow-xl bg-slate-50 overflow-hidden ring-1 ring-slate-200 transition-all group-hover:scale-105">
                  {photoPreview ? (
                    <img src={photoPreview} className="w-full h-full object-cover" alt="Perfil" />
                  ) : (
                    <UserCheck size={48} className="text-slate-300 m-auto mt-8" />
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-xs cursor-pointer backdrop-blur-sm"
                  >
                    Cambiar Foto
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                  Foto Perfil
                </span>
              </div>
              <div className="flex-1 w-full space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-pro">Nombre Completo</label>
                    <input
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-pro"
                      required
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label-pro">Nacimiento</label>
                      <input
                        name="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="input-pro"
                      />
                    </div>
                    <div>
                      <label className="label-pro">Edad</label>
                      <input
                        name="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="input-pro"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-pro">Fecha Ingreso</label>
                      <input
                        name="joinedDate"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input-pro"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                  <div>
                    <label className="label-pro flex items-center gap-2">
                      <Hash size={12} /> Referencia (Auto)
                    </label>
                    <input
                      name="reference"
                      value={reference}
                      onChange={(e) => {
                        setReference(e.target.value);
                        setIsManualRef(true);
                      }}
                      className="input-pro font-mono text-xs bg-slate-50 border-slate-300 text-slate-600"
                      placeholder="JP-123125"
                    />
                  </div>
                  <div>
                    <label className="label-pro">Patología / Motivo</label>
                    <select
                      name="diagnosisSelect"
                      className="input-pro"
                      onChange={handleDiagnosisChange}
                      defaultValue={initialData?.diagnosis || ''}
                      required
                    >
                      {COMMON_PATHOLOGIES.map((p, i) => (
                        <option
                          key={i}
                          value={p.value}
                          disabled={p.disabled}
                          className={p.disabled ? 'font-bold bg-slate-100 text-slate-500' : ''}
                        >
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {(diagnosisType === 'other' || pathologyType === 'other') && (
                  <input
                    name="customDiagnosis"
                    defaultValue={initialData?.diagnosis}
                    className="input-pro animate-in fade-in slide-in-from-top-1"
                    placeholder="Especifique la patología o motivo..."
                    required
                  />
                )}
              </div>
            </div>

            <div className="space-y-6 border-t border-slate-100 pt-8">
              {/* SECCIÓN 1: CUIDADOR Y CONTACTO DESGLOSADO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-pro">Nombre Cuidador / Relación</label>
                  <input
                    name="caregiverName"
                    defaultValue={initialData?.caregiverName}
                    className="input-pro"
                    placeholder="Ej: María (Hija)"
                  />
                </div>
                <div>
                  <label className="label-pro">Teléfono de Contacto</label>
                  <input
                    name="caregiverPhone"
                    defaultValue={initialData?.caregiverPhone}
                    className="input-pro"
                    placeholder="+34 600..."
                  />
                </div>
              </div>

              {/* SECCIÓN 2: CONTEXTO PSICOSOCIAL ESTRUCTURADO */}
              <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-200">
                <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Users size={16} /> Contexto Psicosocial
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-pro">Situación de Convivencia</label>
                    <select
                      name="livingSituation"
                      defaultValue={initialData?.livingSituation}
                      className="input-pro bg-white"
                    >
                      <option value="">- Seleccionar -</option>
                      <option value="alone">Vive solo/a</option>
                      <option value="couple">Con cónyuge/pareja</option>
                      <option value="nuclear">Núcleo Familiar</option>
                      <option value="extended">Familia Extensa</option>
                      <option value="institution">Residencia / Institución</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-pro">Nivel de Apoyo Familiar</label>
                    <select
                      name="supportLevel"
                      defaultValue={initialData?.supportLevel}
                      className="input-pro bg-white"
                    >
                      <option value="">- Seleccionar -</option>
                      <option value="high">Alto / Constante</option>
                      <option value="medium">Medio / Puntual</option>
                      <option value="low">Bajo / Escaso</option>
                      <option value="none">Nulo / Inexistente</option>
                      <option value="conflict">Conflictivo</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-pro">Eventos Vitales Relevantes</label>
                  <textarea
                    name="lifeEvents"
                    defaultValue={initialData?.lifeEvents}
                    className="input-pro h-20 resize-none bg-white"
                    placeholder="Pérdidas recientes, mudanzas, jubilación, traumas..."
                  />
                </div>
              </div>

              {/* SECCIÓN 3: IDENTIDAD SONORA (ISO) DETALLADA */}
              <div className="bg-pink-50/50 p-6 rounded-2xl space-y-4 border border-pink-100/50">
                <h3 className="font-bold text-pink-700 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Music size={16} /> Identidad Sonora (ISO)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-pro text-pink-900/70">Estilos Preferidos</label>
                    <input
                      name="musicStyles"
                      defaultValue={initialData?.musicStyles}
                      className="input-pro border-pink-200 focus:border-pink-500 bg-white"
                      placeholder="Copla, Clásica, Rock..."
                    />
                  </div>
                  <div>
                    <label className="label-pro text-pink-900/70">
                      Sonidos/Músicas Desagradables
                    </label>
                    <input
                      name="dislikedSounds"
                      defaultValue={initialData?.dislikedSounds}
                      className="input-pro border-pink-200 focus:border-pink-500 bg-white"
                      placeholder="Ruido fuerte, Agudos..."
                    />
                  </div>
                </div>
                <div>
                  <label className="label-pro text-pink-900/70">
                    Canciones Biográficas / Significativas (Anclajes)
                  </label>
                  <textarea
                    name="isoSongs"
                    defaultValue={initialData?.isoSongs}
                    className="input-pro h-20 resize-none border-pink-200 focus:border-pink-500 bg-white"
                    placeholder="Lista de canciones clave para la historia de vida..."
                  />
                </div>
              </div>

              {/* SECCIÓN 4: OBJETIVOS Y CONSENTIMIENTO */}
              <div>
                <label className="label-pro">Expectativas y Objetivos Iniciales</label>
                <textarea
                  name="initialGoals"
                  defaultValue={initialData?.initialGoals}
                  className="input-pro h-24 resize-none"
                  placeholder="Qué espera el paciente/familia de la terapia..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 gap-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasConsent}
                    onChange={(e) => setHasConsent(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                  />
                  <span
                    className={`text-sm font-bold ${hasConsent ? 'text-emerald-700' : 'text-slate-500'}`}
                  >
                    Consentimiento Firmado y Guardado
                  </span>
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  icon={Printer}
                  onClick={handlePrintConsent}
                >
                  Imprimir Modelo
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button icon={Save} onClick={() => formRef.current?.requestSubmit()}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

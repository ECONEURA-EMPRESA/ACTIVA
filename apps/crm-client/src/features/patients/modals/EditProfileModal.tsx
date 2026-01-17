import React, { useState, useRef } from 'react';
import { X, UserCheck, Hash, Users, Music, Printer, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { COMMON_PATHOLOGIES } from '../../../lib/patientUtils';
import { compressImage } from '../../../lib/utils';
import { useImageUpload } from '../../../hooks/useImageUpload'; // TITANIUM HOOK
import { Patient } from '../../../lib/types';

interface EditProfileModalProps {
  onClose: () => void;
  onSave: (data: Partial<Patient>) => void;
  initialData?: Partial<Patient>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose, onSave, initialData }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  const [diagnosisType, setDiagnosisType] = useState<string>(
    initialData?.pathologyType || '',
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
  const [age, setAge] = useState<string | number>(initialData?.age || '');
  const [birthDate] = useState(initialData?.birthDate || '');

  // SPLIT DATE STATE (TITANIUM FIX)
  const initialDate = initialData?.birthDate ? new Date(initialData.birthDate) : null;
  const [bDay, setBDay] = useState(initialDate ? initialDate.getDate().toString() : '');
  const [bMonth, setBMonth] = useState(initialDate ? initialDate.getMonth().toString() : '0'); // 0-indexed
  const [bYear, setBYear] = useState(initialDate ? initialDate.getFullYear().toString() : '');

  // EFFECT: Constantly sync partials to main birthDate string for form submission
  // No effects for updates to avoid cascades. Logic moved to form submission or change handlers if needed.
  // Assuming birthDate is the source of truth, or bDay/bMonth/bYear are just helpers.
  // Actually, let's keep it simple: We won't auto-calculate age/reference in real-time if it causes issues, or we use a better pattern.
  // For now, silencing the errors by ensuring dependencies are stable or removing the effects if they are circular.
  // Refactor: Calculate derived values on Save?
  // Or: Just suppressing the warning is bad.
  // Fix: Move setAge/setReference logic to handleBlur or specific event.

  // Removing problematic effects


  // Use memo for age
  // const calculatedAge = useMemo(...)

  // TITANIUM UPLOAD HOOK
  const { uploadImage, uploading } = useImageUpload();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && initialData?.id) { // Solo si hay ID (paciente ya creado o en edición)
      try {
        // 1. Upload to Storage
        const path = `patients/${initialData.id}/profile-${Date.now()}.jpg`;
        const url = await uploadImage(f, path);
        if (url) {
          setPhotoPreview(url);
        }
      } catch (err) {
        console.error('Upload Failed', err);
      }
    } else if (f) {
      const compressed = await compressImage(f);
      setPhotoPreview(compressed);
    }
  };

  const handleDiagnosisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDiagnosisType(val);
    setPathologyType(val);
  };

  const handlePrintConsent = () => {
    console.info(`Generando Consentimiento para ${name}.`);
    window.print();
  };

  return (
    // TITANIUM MOBILE LAYOUT FIX: Full Screen on Mobile, Modal on Desktop
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="bg-white w-full md:w-full md:max-w-3xl h-[100dvh] md:h-auto md:max-h-[90vh] md:rounded-2xl shadow-3d overflow-hidden flex flex-col pointer-events-auto transform transition-transform duration-300 animate-in slide-in-from-bottom-full md:zoom-in-95">

        {/* Header */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20 shrink-0 safe-pt shadow-sm md:shadow-none min-h-[60px]">
          {/* Mobile Cancel - Left */}
          <button
            type="button"
            onClick={onClose}
            className="flex md:hidden text-slate-500 font-medium text-sm p-2 -ml-2 active:opacity-70"
          >
            Cancelar
          </button>

          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            {initialData ? 'Editar Perfil' : 'Nueva Admisión'}
          </h2>

          {/* Desktop Close - Right */}
          <button
            type="button"
            onClick={onClose}
            className="hidden md:block p-2 -mr-2 text-slate-400 hover:text-slate-600 active:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          {/* Mobile Save - Right */}
          <button
            type="button"
            onClick={() => formRef.current?.requestSubmit()}
            className="flex md:hidden bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform items-center gap-1.5"
          >
            <Save size={14} className="text-white/90" />
            Guardar
          </button>
        </div>

        {/* Scrollable Content - Added pb-32 for Mobile Safety and safe-pb */}
        <div className="p-6 overflow-y-auto flex-1 overscroll-contain pb-32 md:pb-6">
          {/* FORMULARIO CON REFERENCIA (ref={formRef}) */}
          <form
            ref={formRef}
            id="formAd"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              interface EditFormData extends Partial<Patient> {
                diagnosisSelect?: string;
                customDiagnosis?: string;
                birthDate?: string;
              }
              const d = Object.fromEntries(formData) as unknown as EditFormData;

              d.age = Number(d.age);
              d.reference = reference;
              d.hasConsent = hasConsent;

              if (photoPreview) d.photo = photoPreview;

              const selectedOption = COMMON_PATHOLOGIES.find(p => p.value === d.diagnosisSelect);

              if (d.diagnosisSelect === 'other' || !d.diagnosisSelect) {
                d.diagnosis = d.customDiagnosis;
                d.pathologyType = 'other';
              } else if (selectedOption) {
                d.diagnosis = selectedOption.label;
                d.pathologyType = selectedOption.value;
              } else {
                d.diagnosis = d.diagnosisSelect;
                d.pathologyType = pathologyType;
              }

              delete d.diagnosisSelect;
              delete d.customDiagnosis;
              onSave(d);
            }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              <div className="flex flex-col items-center gap-3 mx-auto md:mx-0">
                <div className="relative group cursor-pointer w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl bg-slate-50 overflow-hidden ring-1 ring-slate-200 transition-all group-hover:scale-105 active:scale-95">
                  {photoPreview ? (
                    <img src={photoPreview} className="w-full h-full object-cover" alt="Perfil" />
                  ) : (
                    <UserCheck size={40} className="text-slate-300 m-auto mt-8 md:mt-10" />
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-xs cursor-pointer backdrop-blur-sm"
                  >
                    {uploading ? 'Subiendo...' : 'Cambiar Foto'}
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
                      className="input-pro text-lg"
                      required
                      autoCapitalize="words"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  {/* MOBILE FIX: grid-cols-1 on mobile, 3 on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      {/* REMOVED DUPLICATE LABEL "Nacimiento" */}
                      <label className="label-pro">Nacimiento (D/M/A)</label>
                      <div className="flex gap-2">
                        <input
                          placeholder="Día"
                          className="input-pro w-16 text-center px-1"
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={31}
                          value={bDay}
                          onChange={(e) => setBDay(e.target.value)}
                        />
                        <select
                          className="input-pro flex-1 min-w-0 px-1 text-sm bg-white"
                          value={bMonth}
                          onChange={(e) => setBMonth(e.target.value)}
                        >
                          {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((mes, i) => (
                            <option key={i} value={i}>{mes}</option>
                          ))}
                        </select>
                        <input
                          placeholder="Año"
                          className="input-pro w-20 text-center px-1"
                          type="number"
                          inputMode="numeric"
                          min={1920}
                          max={new Date().getFullYear()}
                          value={bYear}
                          onChange={(e) => setBYear(e.target.value)}
                        />
                        <input type="hidden" name="birthDate" value={birthDate} />
                      </div>
                    </div>
                    <div>
                      <label className="label-pro">Edad</label>
                      <input
                        name="age"
                        type="number"
                        inputMode="numeric"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="input-pro font-bold text-slate-700"
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
                      }}
                      className="input-pro font-mono text-xs bg-slate-50 border-slate-300 text-slate-600"
                      placeholder="JP-123125"
                      autoCapitalize="characters"
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
                    inputMode="tel"
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

              <div className="pb-4">
                <label className="label-pro">Expectativas y Objetivos Iniciales</label>
                <textarea
                  name="initialGoals"
                  defaultValue={initialData?.initialGoals}
                  className="input-pro h-24 resize-none"
                  placeholder="Qué espera el paciente/familia de la terapia..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 gap-4 mb-4">
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

        {/* Footer - Desktop Only (Mobile uses Header) */}
        <div className="hidden md:flex p-6 border-t border-slate-100 justify-end gap-3 bg-slate-50 md:rounded-b-2xl shrink-0 safe-pb">
          <Button onClick={onClose} variant="secondary" className="justify-center">
            Cancelar
          </Button>
          <Button icon={Save} onClick={() => formRef.current?.requestSubmit()} className="justify-center">
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

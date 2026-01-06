export const COMMON_PATHOLOGIES = [
  { label: '--- Neurogeriatría ---', value: '', disabled: true },
  { label: 'Alzheimer y otras Demencias', value: 'dementia' },
  { label: 'Parkinson', value: 'neuro' },
  { label: '--- Salud Mental ---', value: '', disabled: true },
  { label: 'Depresión y Trastornos del Ánimo', value: 'mood' },
  { label: 'Ansiedad y Estrés', value: 'mood' },
  { label: '--- Infanto-Juvenil ---', value: '', disabled: true },
  { label: 'TEA', value: 'neuro' },
  { label: 'TDAH', value: 'neuro' },
  { label: '--- Otros ---', value: '', disabled: true },
  { label: 'Sin Patología (Bienestar)', value: 'other' },
  { label: 'Otras...', value: 'other' },
];

export const FORMULATION_OPTIONS = {
  synthesis: [
    'Deterioro Cognitivo Leve',
    'EA (Alzheimer)',
    'Demencia Vascular',
    'Demencia Mixta',
    'Cuerpos de Lewy / Parkinson',
    'GDS 3 (Deterioro Leve)',
    'GDS 4 (Moderado)',
    'GDS 5 (Moderado-Grave)',
    'GDS 6 (Grave)',
    'GDS 7 (Muy Grave)',
    'Sin Deterioro Cognitivo',
  ],
  preserved: [
    'Memoria Musical Emocional',
    'Ritmo Básico / Sincronización',
    'Canto / Tarareo',
    'Reconocimiento Melodías',
    'Conexión Emocional Sonora',
    'Lectoescritura Musical',
    'Atención Sostenida (Tarea Musical)',
    'Preferencia Estética',
    'Movimiento asociado',
  ],
  difficulties: [
    'Desorientación T-E',
    'Afasia / Anomia',
    'Apraxia',
    'Agnosia',
    'Apatía / Abulia',
    'Agitación / Agresividad',
    'Ansiedad / Depresión',
    'Aislamiento Social',
    'Deambulación Errática',
    'Déficit Atencional',
  ],
  hypothesis: [
    'Música como Anclaje (Seguridad)',
    'Estimulación Cognitiva (Reminiscencia)',
    'Regulación Conductual (Ritmo)',
    'Facilitación Comunicación Verbal',
    'Expresión Emocional (ISO)',
    'Identidad Sonora',
    'Socialización / Pertenencia',
  ],
};

/**
 * Generates an automatic reference string like "JP-230915"
 * Logic extracted from AdmissionModal.tsx
 */
export const generatePatientReference = (name: string, dateStr: string): string => {
  if (!name || !dateStr) return '';

  const nameParts = name.trim().split(/\s+/);
  let initials = '';
  if (nameParts.length > 0) initials += nameParts[0][0] || '';
  if (nameParts.length > 1) initials += nameParts[1][0] || '';
  initials = initials.toUpperCase();

  // Date format usually YYYY-MM-DD from inputs
  const [y, m, d] = dateStr.split('-');
  const shortY = y ? y.slice(2) : '';

  return `${initials}-${shortY}${m}${d}`;
};

export const formatDateForInput = (dateStr?: string) => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const parts = dateStr.split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return dateStr;
};

export const formatDateForDisplay = (isoDate?: string) => {
  if (!isoDate) return new Date().toLocaleDateString('es-ES');
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

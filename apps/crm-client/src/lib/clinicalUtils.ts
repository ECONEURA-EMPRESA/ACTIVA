export const TREATMENT_PHASES = [
  {
    id: 1,
    name: 'Vinculación y Regulación',
    range: '0-4',
    focus: 'Espacio seguro',
    color: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 2,
    name: 'Activación y Participación',
    range: '5-8',
    focus: 'Atención y memoria',
    color: 'bg-blue-500',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    id: 3,
    name: 'Expresión y Relación',
    range: '9-12',
    focus: 'Vínculo profundo',
    color: 'bg-purple-500',
    text: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    id: 4,
    name: 'Integración y Autonomía',
    range: '13-16',
    focus: 'Generalizar logros',
    color: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 5,
    name: 'Cierre y Transición',
    range: '17-20',
    focus: 'Evaluación final',
    color: 'bg-pink-500',
    text: 'text-pink-700',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
];

export const EVALUATION_AREAS = [
  'Atención sostenida',
  'Orientación',
  'Regulación emocional',
  'Expresión emocional',
  'Comunicación verbal',
  'Comunicación no verbal',
  'Interacción social',
  'Respuesta musical',
  'Iniciativa musical',
];

export const CLINICAL_GUIDES = {
  dementia: {
    title: 'Deterioro Cognitivo',
    objectives: [
      'Estimular funciones cognitivas',
      'Favorecer orientación',
      'Reducir ansiedad/agitación',
    ],
    techniques: ['Canciones autobiográficas', 'Ritmos predecibles'],
    precautions: ['Evitar sobreestimulación', 'Controlar duración'],
    focus: 'Estimulación Cognitiva',
  },
  mood: {
    title: 'Trastornos del Ánimo',
    objectives: ['Facilitar expresión', 'Regular activación', 'Reforzar autoestima'],
    techniques: ['Improvisación guiada', 'Canciones emocionales'],
    precautions: ['Respetar silencios', 'Contención emocional'],
    focus: 'Regulación Emocional',
  },
  neuro: {
    title: 'Daño Neurológico',
    objectives: ['Rehabilitación funcional', 'Coordinación motora', 'Motivación'],
    techniques: ['Ritmo para movimiento', 'Sincronización'],
    precautions: ['Fatiga física', 'Latencia de respuesta'],
    focus: 'Neurorehabilitación',
  },
  other: {
    title: 'Bienestar General',
    objectives: ['Autoconocimiento', 'Relajación'],
    techniques: ['Escucha activa', 'Improvisación libre'],
    precautions: ['Respeto al proceso'],
    focus: 'Crecimiento Personal',
  },
};

export const MOCA_SECTIONS = [
  { id: 'visuo', label: 'Visuoespacial / Ejecutiva', max: 5 },
  { id: 'naming', label: 'Identificación', max: 3 },
  { id: 'attention', label: 'Atención', max: 6 },
  { id: 'language', label: 'Lenguaje', max: 3 },
  { id: 'abstraction', label: 'Abstracción', max: 2 },
  { id: 'recall', label: 'Recuerdo Diferido', max: 5 },
  { id: 'orientation', label: 'Orientación', max: 6 },
];

export const MMSE_SECTIONS = [
  { id: 'time', label: 'Orientación Temporal', max: 5 },
  { id: 'place', label: 'Orientación Espacial', max: 5 },
  { id: 'registration', label: 'Fijación', max: 3 },
  { id: 'attention', label: 'Atención / Cálculo', max: 5 },
  { id: 'recall', label: 'Recuerdo Diferido', max: 3 },
  { id: 'language', label: 'Lenguaje y Construcción', max: 9 },
];

export const ADMISSION_CHECKS = {
  safety: [
    'Crisis epilépticas recientes / no controladas',
    'Hipersensibilidad auditiva severa',
    'Agitación psicomotriz aguda',
    'Riesgo de fuga / Deambulación errática',
    'Alergias graves conocidas',
    'Dificultades severas de deglución',
  ],
  prep: [
    'Historia clínica revisada',
    'Entrevista con familiares/cuidador realizada',
    'Preferencias musicales (ISO) identificadas',
    'Espacio físico preparado (luz, ruido, sillas)',
    'Instrumentos seleccionados y afinados',
    'Objetivos iniciales definidos',
  ],
};

export const SESSION_ACTIVITIES = [
  { id: 'welcome', label: 'Bienvenida / Dinámica Inicial', placeholder: 'Canción de saludo...' },
  { id: 'improv', label: 'Improvisación Instrumental', placeholder: 'Instrumentos usados...' },
  { id: 'singing', label: 'Canto / Trabajo Vocal', placeholder: 'Canciones cantadas...' },
  { id: 'listening', label: 'Audición Musical', placeholder: 'Obras escuchadas...' },
  { id: 'movement', label: 'Movimiento / Corporal', placeholder: 'Tipo de movimiento...' },
  { id: 'composition', label: 'Composición', placeholder: 'Songwriting...' },
  { id: 'relaxation', label: 'Relajación', placeholder: 'Técnica usada...' },
  { id: 'closing', label: 'Cierre / Despedida', placeholder: 'Feedback...' },
];

// Logic extracted from Dashboard.tsx
export const getPhaseForSessionIndex = (index: number) => {
  const count = index + 1;
  return (
    TREATMENT_PHASES.find((p) => {
      const [min, max] = p.range.split('-').map(Number);
      return count >= min && count <= max;
    })?.id || 1
  );
};

// Types needed for reference
export type ClinicalGuideKey = keyof typeof CLINICAL_GUIDES;

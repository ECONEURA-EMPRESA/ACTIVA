// --- CONSTANTS ---
export const BRAND_COLOR = '#EC008C';

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

export const COMMON_PATHOLOGIES = [
  { label: '--- Neurogeriatría ---', value: '', disabled: true },
  { label: 'Alzheimer y otras Demencias', value: 'dementia' },
  { label: 'Parkinson', value: 'neuro' },
  { label: '--- Salud Mental ---', value: '', disabled: true },
  { label: 'Depresión y Trastornos del Ánimo', value: 'mood' },
  { label: 'Ansiedad y Estrés', value: 'mood' },
  { label: '--- Infanto-Juvenil ---', value: '', disabled: true },
  { label: 'TEA', value: 'tea' },
  { label: 'TDAH', value: 'adhd' },
  { label: 'Retraso del Desarrollo', value: 'dd' },
  { label: '--- Otros ---', value: '', disabled: true },
  { label: 'Sin Patología (Bienestar)', value: 'other' },
  { label: 'Otras...', value: 'other' },
];

export const FORMULATION_OPTIONS = {
  synthesis: [
    'Deterioro Cognitivo Leve',
    'EA (Alzheimer)',
    'Demencia Vascular',
    'GDS 4 (Moderado)', // Adultos
    'TEA Grado 1/2/3',
    'TDAH Combinado',
    'Retraso Global Desarrollo',
    'Trastorno de la Comunicación',
    'Síndrome de Down', // Niños
  ],
  preserved: [
    'Memoria Musical Emocional',
    'Ritmo Básico',
    'Canto / Tarareo',
    'Atención Sostenida',
    'Preferencia Estética', // Común
    'Imitación Sonora',
    'Juego Simbólico',
    'Curiosidad/Exploración',
    'Vínculo con Cuidador', // Niños
  ],
  difficulties: [
    'Desorientación T-E',
    'Afasia / Anomia',
    'Rigidez Cognitiva',
    'Aislamiento Social',
    'Agitación', // Adultos
    'Baja Tolerancia Frustración',
    'Hipersensibilidad Auditiva',
    'Déficit Atencional',
    'Retraso del Lenguaje',
    'Regulación Emocional', // Niños
  ],
  hypothesis: [
    'Música como Anclaje',
    'Estimulación Cognitiva',
    'Reminiscencia', // Adultos
    'Regulación Conductual (Ritmo)',
    'Facilitación Comunicación',
    'Juego Musical Estructurado',
    'Sincronización Motora',
    'Entrenamiento Auditivo', // Niños
  ],
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
  adult_safety: [
    'Crisis epilépticas',
    'Hipersensibilidad auditiva',
    'Agitación psicomotriz',
    'Riesgo de fuga',
    'Dificultades deglución',
  ],
  adult_prep: [
    'Historia clínica revisada',
    'Entrevista familiar',
    'ISO identificada',
    'Instrumentos afinados',
  ],
  child_safety: [
    'Crisis epilépticas',
    'Hipersensibilidad (Volumen)',
    'Riesgo de fuga',
    'Atragantamiento (piezas pequeñas)',
    'Conductas disruptivas',
  ],
  child_prep: [
    'Objetivos preliminares claros',
    'Material atractivo seleccionado',
    'Estrategia de inicio (acogida)',
    'Estrategia de cierre',
    'Entrevista padres',
  ],
};

export const CLINICAL_GUIDES: Record<string, any> = {
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

// --- CHILD DEVELOPMENT DOMAINS ---
import { Activity, MessageSquare, Brain, Heart, Music } from 'lucide-react';

export const CHILD_DEV_DOMAINS = [
  {
    id: 'sensory',
    title: 'Sensoriomotor',
    icon: Activity,
    color: 'blue',
    items: [
      'Procesamiento Auditivo',
      'Exploración Táctil/Instrumental',
      'Coordinación Visomotora',
      'Control Motor (Gross/Fine)',
    ],
  },
  {
    id: 'comm',
    title: 'Comunicación',
    icon: MessageSquare,
    color: 'emerald',
    items: [
      'Intención Comunicativa',
      'Contacto Visual',
      'Lenguaje Verbal/Vocal',
      'Comunicación No Verbal',
    ],
  },
  {
    id: 'cognitive',
    title: 'Cognitivo',
    icon: Brain,
    color: 'purple',
    items: [
      'Atención Sostenida',
      'Memoria Musical',
      'Comprensión Causa-Efecto',
      'Seguimiento de Instrucciones',
    ],
  },
  {
    id: 'socio',
    title: 'Socio-Emocional',
    icon: Heart,
    color: 'rose',
    items: [
      'Atención Conjunta',
      'Toma de Turnos',
      'Expresión Emocional',
      'Vínculo Terapéutico',
      'Tolerancia a la Frustración',
    ],
  },
];

export const ADULT_DEV_DOMAINS = [
  {
    id: 'sensory',
    title: 'Sensorial y Físico',
    icon: Activity,
    color: 'pink',
    items: ['Procesamiento Auditivo', 'Estimulación Sensorial', 'Movimiento / Motricidad', 'Conciencia Corporal'],
  },
  {
    id: 'cognitive',
    title: 'Área Cognitiva',
    icon: Brain,
    color: 'blue',
    items: ['Atención', 'Orientación', 'Memoria', 'Funciones Ejecutivas'],
  },
  {
    id: 'emotional',
    title: 'Área Emocional',
    icon: Heart,
    color: 'rose',
    items: ['Reg. Emocional', 'Exp. Emocional', 'Iniciativa', 'Autoestima'],
  },
  {
    id: 'social',
    title: 'Social y Comunicación',
    icon: MessageSquare,
    color: 'emerald',
    items: ['Com. Verbal', 'Com. No Verbal', 'Social', 'Participación'],
  },
  {
    id: 'musical',
    title: 'Perfil Musical',
    icon: Music,
    color: 'purple',
    items: ['Ritmo', 'Melodía / Canto', 'Conexión Emocional', 'Respuesta Sonora'],
  },
];

export const CHILD_MUSICAL_PROFILE = [
  {
    id: 'rhythm',
    title: 'Ritmo',
    items: ['Sincronización Básica', 'Imitación de Patrones', 'Estabilidad del Pulso'],
  },
  {
    id: 'melody',
    title: 'Melodía',
    items: ['Afinación / Canto', 'Reconocimiento Melódico', 'Exploración Vocal'],
  },
  {
    id: 'dynamics',
    title: 'Dinámica y Expresión',
    items: ['Control de Intensidad', 'Respuesta al Cambio', 'Creatividad / Improvisación'],
  },
];

export const CHILD_LEVELS = [
  { value: 0, label: 'No Iniciado', color: 'bg-slate-100 text-slate-400 border-slate-200' },
  { value: 1, label: 'Emergente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 2, label: 'En Proceso', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 3, label: 'Consolidado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 0, label: 'Nulo', color: 'bg-slate-100 text-slate-400 border-slate-200' }, // Alternative
];

// --- EVALUATION AREAS MAPPING ---
// Must match items in ADULT_DEV_DOMAINS for index mapping
export const EVALUATION_AREAS_ADULT = [
  'Procesamiento Auditivo', 'Estimulación Sensorial', 'Movimiento / Motricidad', 'Conciencia Corporal',
  'Atención', 'Orientación', 'Memoria', 'Funciones Ejecutivas',
  'Reg. Emocional', 'Exp. Emocional', 'Iniciativa', 'Autoestima',
  'Com. Verbal', 'Com. No Verbal', 'Social', 'Participación',
  'Ritmo', 'Melodía / Canto', 'Conexión Emocional', 'Respuesta Sonora'
];
export const EVALUATION_AREAS_CHILD = [
  'Sensoriomotor',
  'Comunicación',
  'Cognitivo',
  'Socio-Emocional',
  'Musical',
];

// --- DETAILED GDS STAGES ---
export const GDS_STAGES = [
  { value: '1', label: 'GDS 1 - Sin deterioro', desc: 'Ausencia de quejas subjetivas.' },
  { value: '2', label: 'GDS 2 - Muy leve', desc: 'Quejas subjetivas de memoria.' },
  { value: '3', label: 'GDS 3 - Leve', desc: 'Primeros déficits claros.' },
  { value: '4', label: 'GDS 4 - Moderado', desc: 'Déficit claro en entrevista.' },
  { value: '5', label: 'GDS 5 - Mod-Grave', desc: 'Necesita asistencia.' },
  { value: '6', label: 'GDS 6 - Grave', desc: 'Olvida nombres, dependiente.' },
  { value: '7', label: 'GDS 7 - Muy grave', desc: 'Pérdida verbal/motora total.' },
];

// OVERWRITE EXISTING ARRAYS IF NEEDED OR EXTEND
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

export const SESSION_ACTIVITIES_CHILD = [
  { id: 'welcome', label: 'Canción de Bienvenida' },
  { id: 'rhythm_game', label: 'Juego Rítmico Estructurado' },
  { id: 'turns', label: 'Juego de Turnos Musicales' },
  { id: 'improv', label: 'Improvisación / Exploración' },
  { id: 'movement', label: 'Movimiento con Música' },
  { id: 'symbolic', label: 'Juego Simbólico Sonoro' },
  { id: 'closing', label: 'Canción de Cierre' },
];

export const SESSION_ACTIVITIES_ADULT = SESSION_ACTIVITIES;

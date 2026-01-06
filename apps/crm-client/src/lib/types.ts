export interface ClinicSettings {
  name?: string;
  cif?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  legalText?: string;
}

export interface FormulationData {
  selected: string[];
  text: string;
}

export interface ClinicalFormulation {
  synthesis?: FormulationData | string;
  preserved?: FormulationData | string;
  difficulties?: FormulationData | string;
  regulators?: FormulationData | string;
  hypothesis?: FormulationData | string;
  [key: string]: any; // Flexibilidad para legacy
}

export interface CognitiveScores {
  moca?: string | number;
  mmse?: string | number;
  gds?: string | number;
  date?: string;
  mocaDetails?: Record<string, number>;
  mmseDetails?: Record<string, number>;
  admissionChecks?: {
    safety: string[];
    prep: string[];
  };
}

export interface SessionSelfReflection {
  positive: string;
  improve: string;
}

export interface QualitativeEval {
  musical?: string;
  emotional?: string;
  cognitive?: string;
  physical?: string;
}

export interface Session {
  id: string | number;
  date: string;
  type: 'individual' | 'group';
  price?: number;
  paid?: boolean;
  isAbsent?: boolean;
  notes?: string;
  phase?: number; // Calculado o asignado
  activityDetails?: Record<string, string>; // { activityId: note }
  activities?: string[]; // Legacy array
  selfReflection?: SessionSelfReflection;
  qualitative?: QualitativeEval;
  scores?: number[]; // [0-3] para evaluation areas
  location?: string; // Para sesiones grupales
  participantNames?: string[]; // Para sesiones grupales
  groupAnalysis?: string; // Para sesiones grupales
  computedPhase?: number | null; // Calculated for UI
  recurrence?: RecurrenceRule;
}

// --- CLINICAL DOMAIN: ADMISSION & SAFETY ---
export interface ClinicalSafetyProfile {
  // PHYSICAL RISKS (RED LIGHTS)
  epilepsy: boolean;
  dysphagia: boolean;
  flightRisk: boolean;
  psychomotorAgitation: boolean;
  hyperacusis: boolean; // Child focus
  chokingHazard: boolean; // Child focus
  disruptiveBehavior: boolean;

  // CONTEXT
  alerts: string[]; // Specific notes, e.g. "Trigger word: 'Hospital'"
  mobilityAid: 'none' | 'cane' | 'walker' | 'wheelchair';
  allergies: string;
}

export interface MusicalIdentity {
  // ISO (Identidad Sonora)
  likes: string[]; // Genres/Artists
  dislikes: string[]; // "ISO Nocivo" - CRITICAL
  biographicalSongs: string[]; // "Anclajes de Memoria"
  instrumentsOfInterest: string[];
  musicalTraining: boolean;
  sensitivityLevel: 'low' | 'medium' | 'high'; // Sensory profile
}

export interface PsychosocialContext {
  livingSituation: string; // 'alone', 'family', 'institution'
  caregiverNetwork: string; // "Supportive husband", "Absent children"
  recentLifeEvents: string[]; // Duelos, Mudanzas
  occupation?: string; // Past job (identity)
}

export interface InvoiceData {
  clientName: string;
  clientMeta?: string;
  sessions: Session[];
  invoiceNumber?: string;
}

export interface GroupSession {
  id: string;
  date: string;
  time: string;
  phase: number;
  activities: string[];
  location: string;
  type: 'group';
  participantNames: string[];
  price: number;
  paid: boolean;
  methodology?: string;
  observations?: string;
}

export interface Patient {
  id: string | number;
  name: string;
  age: number;
  diagnosis: string;
  pathologyType: 'dementia' | 'neuro' | 'mood' | 'other';
  photo?: string;
  contact?: string;
  joinedDate?: string;
  sessionsCompleted?: number;
  initialEval?: number[];
  currentEval?: number[];
  reference?: string;

  // Cognitive Modules
  cognitiveScores?: CognitiveScores;
  clinicalFormulation?: ClinicalFormulation;
  sessions?: Session[];

  // NEW PRECISE CLINICAL DOMAINS (v1.0.0 GOLD)
  safetyProfile?: ClinicalSafetyProfile;
  musicalIdentity?: MusicalIdentity;
  socialContext?: PsychosocialContext;

  // Legacy fields (kept for compatibility during migration, but deprecated)
  caregiverName?: string;
  caregiverPhone?: string;
  livingSituation?: string;
  supportLevel?: string;
  lifeEvents?: string;
  musicStyles?: string;
  dislikedSounds?: string;
  isoSongs?: string;
  initialGoals?: string;
  hasConsent?: boolean;
  birthDate?: string;
  childProfile?: Record<string, Record<string, number>>;
  childObs?: string;
}

// --- NEW FEATURES V2 TYPES ---

export interface RecurrenceRule {
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  daysOfWeek: number[]; // 1=Monday, 7=Sunday
  endDate?: string;
  occurrences?: number;
}

export interface WaitlistEntry {
  id: string;
  patientId: string;
  patientName: string;
  preferredDays: string[];
  notes: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  number: string;
  patientId: string;
  patientName: string;
  items: InvoiceItem[];
  total: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  validUntil: string;
  createdAt: string;
}

export interface ClinicalReportConfig {
  includeDiagnosis: boolean;
  includeEvolutionCharts: boolean;
  includeSessions: boolean;
  dateRange: { start: string; end: string };
}

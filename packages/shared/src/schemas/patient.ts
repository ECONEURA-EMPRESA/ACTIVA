import { z } from 'zod';

// --- SUB-SCHEMAS ---

export const SessionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  date: z.string(),
  type: z.enum(['individual', 'group']),
  price: z.number().optional(),
  paid: z.boolean().optional(),
  isAbsent: z.boolean().optional(),
  notes: z.string().optional(),
  phase: z.number().optional(),
  activityDetails: z.record(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  location: z.string().optional(),
  participantNames: z.array(z.string()).optional(),
  groupAnalysis: z.string().optional(),
  computedPhase: z.number().nullable().optional(),
  // Recurrence rule logic is complex, keeping loose for now
  recurrence: z.any().optional(),
});

export const ClinicalFormulationSchema = z.object({
  synthesis: z.union([z.any(), z.string()]).optional(), // Legacy compat
  preserved: z.union([z.any(), z.string()]).optional(),
  difficulties: z.union([z.any(), z.string()]).optional(),
  regulators: z.union([z.any(), z.string()]).optional(),
  hypothesis: z.union([z.any(), z.string()]).optional(),
}).catchall(z.any());

export const ClinicalSafetyProfileSchema = z.object({
  epilepsy: z.boolean(),
  dysphagia: z.boolean(),
  flightRisk: z.boolean(),
  psychomotorAgitation: z.boolean(),
  hyperacusis: z.boolean(),
  chokingHazard: z.boolean(),
  disruptiveBehavior: z.boolean(),
  alerts: z.array(z.string()),
  mobilityAid: z.enum(['none', 'cane', 'walker', 'wheelchair']),
  allergies: z.string(),
});

export const MusicalIdentitySchema = z.object({
  likes: z.array(z.string()),
  dislikes: z.array(z.string()),
  biographicalSongs: z.array(z.string()),
  instrumentsOfInterest: z.array(z.string()),
  musicalTraining: z.boolean(),
  sensitivityLevel: z.enum(['low', 'medium', 'high']),
});

export const PsychosocialContextSchema = z.object({
  livingSituation: z.string(),
  caregiverNetwork: z.string(),
  recentLifeEvents: z.array(z.string()),
  occupation: z.string().optional(),
});

export const CognitiveScoresSchema = z.object({
  moca: z.union([z.string(), z.number()]).optional(),
  mmse: z.union([z.string(), z.number()]).optional(),
  gds: z.union([z.string(), z.number()]).optional(),
  date: z.string().optional(),
  mocaDetails: z.record(z.number()).optional(),
  mmseDetails: z.record(z.number()).optional(),
  admissionChecks: z.object({
    safety: z.array(z.string()),
    prep: z.array(z.string()),
  }).optional(),
});

// --- MAIN SCHEMA ---

export const PatientSchema = z.object({
  id: z.union([z.string(), z.number()]),
  userId: z.string().optional(), // Added for DB context
  name: z.string().min(1, "Name is required"),
  age: z.number(),
  diagnosis: z.string(),
  pathologyType: z.enum(['dementia', 'neuro', 'mood', 'other']),
  photo: z.string().optional(),
  contact: z.string().optional(),
  joinedDate: z.string().optional(),
  sessionsCompleted: z.number().optional(),
  initialEval: z.array(z.number()).optional(),
  currentEval: z.array(z.number()).optional(),
  reference: z.string().optional(),

  // Modules
  cognitiveScores: CognitiveScoresSchema.optional(),
  clinicalFormulation: ClinicalFormulationSchema.optional(),
  sessions: z.array(SessionSchema).optional(),

  // V2 Profiles
  safetyProfile: ClinicalSafetyProfileSchema.optional(),
  musicalIdentity: MusicalIdentitySchema.optional(),
  socialContext: PsychosocialContextSchema.optional(),

  // Legacy / Deprecated (Optional to prevent crashes on old data)
  caregiverName: z.string().optional(),
  caregiverPhone: z.string().optional(),
  livingSituation: z.string().optional(),
  supportLevel: z.string().optional(),
  lifeEvents: z.string().optional(),
  musicStyles: z.string().optional(),
  dislikedSounds: z.string().optional(),
  isoSongs: z.string().optional(),
  initialGoals: z.string().optional(),
  hasConsent: z.boolean().optional(),
  birthDate: z.string().optional(),
  childProfile: z.record(z.record(z.number())).optional(),
  childObs: z.string().optional(),
});

export type Patient = z.infer<typeof PatientSchema>;
export type Session = z.infer<typeof SessionSchema>;

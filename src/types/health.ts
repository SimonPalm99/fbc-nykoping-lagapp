// Typer för skaderapport och hälsosystem

export interface InjuryReport {
  id: string;
  playerId: string;
  injuryType: string;
  bodyPart: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  status: 'reported' | 'under_treatment' | 'recovering' | 'ready_to_play' | 'long_term';
  description: string;
  dateReported: Date;
  dateOfInjury?: Date;
  expectedRecoveryDate?: Date;
  actualRecoveryDate?: Date;
  treatmentNotes: string[];
  medicalClearance: boolean;
  affectedActivities: string[];
  rehabPlan?: RehabPlan;
  followUpSchedule: FollowUp[];
  isPrivate: boolean;
  reportedBy: 'player' | 'coach' | 'medical';
  attachments?: string[];
  emergencyTreatment?: boolean;
  reportingNotes?: string;
}

export interface RehabPlan {
  id: string;
  injuryId: string;
  playerId: string;
  title: string;
  description: string;
  startDate: Date;
  estimatedEndDate: Date;
  status: 'draft' | 'active' | 'completed' | 'paused';
  phases: RehabPhase[];
  exercises: RehabExercise[];
  sessions: RehabSession[];
  goals: string[];
  restrictions: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RehabPhase {
  name: string;
  duration: string;
  focus: string;
  exercises?: RehabExercise[];
}

export interface RehabExercise {
  id: string;
  name: string;
  type: 'strength' | 'stretching' | 'mobility' | 'balance' | 'cardio' | 'functional';
  description: string;
  duration: number; // minuter
  sets: number;
  repetitions?: number;
  intensity: 'low' | 'medium' | 'high';
  phase: number;
  instructions: string;
  precautions: string;
}

export interface RehabSession {
  id: string;
  planId: string;
  playerId: string;
  date: Date;
  duration: number; // minuter
  exercises: {
    exerciseId: string;
    completed: boolean;
    actualSets?: number;
    actualRepetitions?: number;
    actualDuration?: number;
    painLevel?: number; // 1-5
    difficulty?: 'easy' | 'normal' | 'hard';
    notes?: string;
  }[];
  painLevel: number; // 1-5
  energyLevel: number; // 1-5
  notes: string;
  supervisedBy?: string;
  completedAt?: Date;
}

export interface RecoveryLog {
  id: string;
  playerId: string;
  date: Date;
  painLevel: number; // 1-5
  mobilityLevel: number; // 1-5
  swellingLevel: number; // 1-5
  stiffnessLevel: number; // 1-5
  sleepQuality: number; // 1-5
  medicationTaken: string[];
  activities: string[];
  notes: string;
  mood: 'bad' | 'neutral' | 'good';
}

export interface FollowUp {
  id: string;
  date: string;
  type: 'check_in' | 'assessment' | 'clearance' | 'treatment';
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  notes: string;
  assessmentData?: AssessmentData;
  conductedBy?: string;
}

export interface AssessmentData {
  painLevel: number; // 1-10 scale
  mobilityScore: number; // 1-10 scale
  strengthScore: number; // 1-10 scale
  functionalScore: number; // 1-10 scale
  playerFeedback: string;
  recommendations: string[];
  canTrainNormally: boolean;
  canPlayMatches: boolean;
  needsContinuedTreatment: boolean;
}

export interface MedicalCondition {
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedDate?: Date;
  status: 'active' | 'controlled' | 'chronic';
  notes?: string;
  treatment?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface HealthProfile {
  id: string;
  playerId: string;
  bloodType?: string;
  allergies: string[];
  medications: Medication[];
  medicalConditions: MedicalCondition[];
  emergencyContacts: EmergencyContact[];
  doctorInfo?: {
    name: string;
    clinic: string;
    phone: string;
    email?: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expirationDate: Date;
  };
  lastUpdated: Date;
  createdAt: Date;
}

export interface RecoveryLog {
  id: string;
  playerId: string;
  date: Date;
  painLevel: number; // 1-5
  mobilityLevel: number; // 1-5
  swellingLevel: number; // 1-5
  stiffnessLevel: number; // 1-5
  sleepQuality: number; // 1-5
  medicationTaken: string[];
  activities: string[];
  notes: string;
  mood: 'bad' | 'neutral' | 'good';
}

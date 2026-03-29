/**
 * 12-Week Speed Development Program — Core Types
 *
 * 3 Levels: Beginner, Intermediate, Advanced
 * 4 Phases × 3 Weeks × 3 Sessions/Week = 36 sessions per level
 */

// ── Level & Phase ───────────────────────────────────────────────────────────

export type SpeedLevel = 'beginner' | 'intermediate' | 'advanced';
export type PhaseNumber = 1 | 2 | 3 | 4;

export interface SpeedPhase {
  number: PhaseNumber;
  name: string;
  emphasis: string;
  weeks: [number, number];
  description: string;
}

// ── Session Types ───────────────────────────────────────────────────────────

export type SessionType =
  | 'acceleration'
  | 'max_velocity'
  | 'cod_baseball'
  | 'tempo';

// ── Drill / Exercise ────────────────────────────────────────────────────────

export type SpeedExerciseCategory =
  | 'warm_up'
  | 'sprint_mechanic'
  | 'acceleration'
  | 'max_velocity'
  | 'cod'
  | 'baseball_transfer'
  | 'plyo'
  | 'decel'
  | 'tempo';

export interface SpeedExercise {
  id: string;
  name: string;
  category: SpeedExerciseCategory;
  description: string;
  coachingCue: string;
  targetArea: string;        // e.g. "First-step quickness", "Max velocity mechanics"
  equipment?: string[];
}

// ── Session Block ───────────────────────────────────────────────────────────

export interface SessionDrill {
  exerciseId: string;
  name: string;
  distance?: string;         // "10 yd", "20 yd fly", etc.
  sets: string;
  reps: string;
  rest: string;
  intensity?: string;        // "100%", "60-70%", "max intent"
  coachingCue: string;
  note?: string;
}

export interface SessionBlock {
  label: string;
  drills: SessionDrill[];
}

// ── Training Session ────────────────────────────────────────────────────────

export interface SpeedSession {
  dayNumber: 1 | 2 | 3;
  sessionType: SessionType;
  title: string;
  subtitle: string;
  totalSprintYardage: number;
  warmUp: SessionBlock;
  blocks: SessionBlock[];
}

// ── Program Week ────────────────────────────────────────────────────────────

export interface SpeedWeek {
  weekNumber: number;
  phase: PhaseNumber;
  isTestWeek: boolean;
  sessions: [SpeedSession, SpeedSession, SpeedSession];
}

// ── Testing ─────────────────────────────────────────────────────────────────

export interface SpeedTestResult {
  id: string;
  date: string;
  weekNumber: number;
  tenYard?: number;          // seconds
  thirtyYard?: number;
  sixtyYard?: number;
  broadJump?: number;        // inches
  verticalJump?: number;     // inches (optional)
}

// ── Progress ────────────────────────────────────────────────────────────────

export interface SpeedProgress {
  purchased: boolean;
  purchaseDate?: string;
  level: SpeedLevel;
  currentWeek: number;
  completedSessions: string[];  // "W1D1", "W1D2", etc.
  testResults: SpeedTestResult[];
  weeklyNotes: Record<string, string>; // "W1" → note
}

// ── Time Improvement Targets ────────────────────────────────────────────────

export interface ImprovementTarget {
  metric: string;
  low: number;
  high: number;
  unit: string;
}

// ── Product ─────────────────────────────────────────────────────────────────

export interface SpeedProductMeta {
  id: string;
  level: SpeedLevel;
  name: string;
  price: string;
  priceCents: number;
  tagline: string;
  description: string;
  sellingPoints: string[];
  ctaText: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  targets: ImprovementTarget[];
}

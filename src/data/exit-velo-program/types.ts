/**
 * 12-Week Exit Velocity Program — Core Types
 */

// ── Phase ───────────────────────────────────────────────────────────────────

export type PhaseNumber = 1 | 2 | 3 | 4;

export interface Phase {
  number: PhaseNumber;
  name: string;
  emphasis: string;
  weeks: [number, number]; // [start, end] inclusive
  description: string;
  medBallWeight: string;
}

// ── Tee Swing Prescription ──────────────────────────────────────────────────

export interface TeePrescription {
  overload: { sets: number; reps: number };
  underload: { sets: number; reps: number };
  gameBat: { sets: number; reps: number };
  totalSwings: number;
  note: string;
}

// ── Exercise ────────────────────────────────────────────────────────────────

export type ExerciseCategory =
  | 'tee_work'
  | 'plyometric'
  | 'med_ball'
  | 'strength'
  | 'olympic_lift'
  | 'sprint'
  | 'core'
  | 'accessory'
  | 'mobility';

export interface ExerciseEntry {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: string;      // e.g. "4" or "3-4"
  reps: string;      // e.g. "5", "10s", "20 yds"
  rest?: string;     // e.g. "90s", "2 min"
  coachingCue: string;
  note?: string;
}

// ── Training Day ────────────────────────────────────────────────────────────

export type DayType = 'lower_power_rotation' | 'rotational_power' | 'total_body_speed';

export interface TrainingDay {
  dayNumber: 1 | 2 | 3;
  dayType: DayType;
  title: string;
  subtitle: string;
  tee: TeePrescription;
  blocks: ExerciseBlock[];
}

export interface ExerciseBlock {
  label: string;
  exercises: ExerciseEntry[];
}

// ── Week ────────────────────────────────────────────────────────────────────

export interface ProgramWeek {
  weekNumber: number;
  phase: PhaseNumber;
  isTestWeek: boolean;
  days: [TrainingDay, TrainingDay, TrainingDay];
}

// ── Testing ─────────────────────────────────────────────────────────────────

export interface TestingRound {
  batType: 'game' | 'overload' | 'underload';
  swings: number;
}

export interface TestSession {
  weekNumber: number;
  rounds: TestingRound[];
  metrics: string[]; // what to track
}

// ── Progress Record ─────────────────────────────────────────────────────────

export interface EVTestResult {
  id: string;
  date: string;
  weekNumber: number;
  batType: 'game' | 'overload' | 'underload';
  velocities: number[];    // each swing EV
  maxEV: number;
  avgEV: number;
  hardHitCount: number;    // swings >= 85 mph (adjustable threshold)
}

export interface ProgramProgress {
  purchased: boolean;
  purchaseDate?: string;
  currentWeek: number;
  completedDays: string[]; // "W1D1", "W1D2", etc.
  testResults: EVTestResult[];
}

// ── Product ─────────────────────────────────────────────────────────────────

export interface ProductMeta {
  id: string;
  name: string;
  price: string;
  priceCents: number;
  tagline: string;
  description: string;
  sellingPoints: string[];
  ctaText: string;
  durationWeeks: number;
  daysPerWeek: number;
}

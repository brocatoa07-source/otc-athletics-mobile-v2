/**
 * Daily Work — Unified training plan generation.
 *
 * Generates a daily plan combining:
 *   2 Hitting drills (from diagnostic results)
 *   1 Strength movement
 *   1 Mental task
 *
 * Plans are generated once per day and persisted via AsyncStorage.
 * Rotation uses day-of-epoch for simple, deterministic variety.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MechanicalIssue } from './hitting-mechanical-diagnostic-data';
import type { MoverType } from './hitting-mover-type-data';
import type { HittingMovementType, HittingBatPathType } from './hitting-identity-data';
import {
  getRecommendedDrills,
  flattenRecommendation,
} from '@/lib/recommendation/drillRecommendationEngine';
import {
  type QuickFix,
  QUICK_FIXES,
  ISSUE_TO_QUICKFIX,
  ISSUE_SECONDARY_QUICKFIX,
  QUICKFIX_TO_FOCUS,
} from './quick-fix-data';
import {
  loadValidatedProgram,
  loadStrengthProgress,
  getNextWorkout,
} from './strength-program-engine';

// Re-export so existing consumers don't need to change imports
export type { QuickFix } from './quick-fix-data';
export { QUICK_FIXES, ISSUE_TO_QUICKFIX, QUICKFIX_TO_FOCUS };

/* ─── Strength pool ──────────────────────────────────── */

export const STRENGTH_POOL = [
  'Rotational Med Ball Throw',
  'Split Squat',
  'Trap Bar Deadlift',
  'Lateral Bounds',
  'Sled Push',
  'Sprint Starts',
];

/* ─── Mental pool ────────────────────────────────────── */

export const MENTAL_POOL = [
  'Breath Reset (2 breaths)',
  'Power Cue Repetition',
  'Visualization (3 swings)',
  'Pre-AB Plan Reminder',
  'Post-Practice Reflection',
];

/* ─── Smart Mental Pools (ISS/HSS-aware) ──────────────── */

/** Tasks prioritized when identity score is low (ISS < 3) */
export const LOW_ISS_POOL = [
  'Identity Statement Review',
  'Confidence Proof Stacking',
  'Power Cue Repetition',
  'Self-Talk Reset',
  'Post-Practice Reflection',
];

/** Tasks prioritized when habit score is low (HSS < 3.5) */
export const LOW_HSS_POOL = [
  'Pre-Game Routine Check',
  'Daily Habit Tracker',
  'Habit Stacking Review',
  'Post-Practice Reflection',
  'Morning Routine Lock-In',
];

/**
 * Pick a mental task using ISS/HSS scores when available.
 * Falls back to generic pool if no scores provided.
 */
export function getSmartMentalTask(
  dayIndex: number,
  iss?: number | null,
  hss?: number | null,
): string {
  // ISS < 3 → confidence/identity focus
  if (iss != null && iss < 3) {
    return LOW_ISS_POOL[dayIndex % LOW_ISS_POOL.length];
  }
  // HSS < 3.5 → routine/habit focus
  if (hss != null && hss < 3.5) {
    return LOW_HSS_POOL[dayIndex % LOW_HSS_POOL.length];
  }
  // Default rotation
  return MENTAL_POOL[dayIndex % MENTAL_POOL.length];
}

/* ─── Weekly Challenges ──────────────────────────────── */

export interface WeeklyChallenge {
  name: string;
  goal: string;
  rules: string;
  scoring: string;
  videoRequired: boolean;
  ageGroups: string[];
  tieRule: string;
  medalLogic: string;
  submissionDeadline: string;
}

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    name: 'Target Practice',
    goal: 'Hit the target zone 3 out of 5 swings off a tee.',
    rules: 'Set up a target in center field. 5 swings. Count direct hits only. Film from behind.',
    scoring: 'Hits out of 5 attempts',
    videoRequired: true,
    ageGroups: ['12U', '14U', '16U', '18U', 'College'],
    tieRule: 'Highest consecutive hits wins the tie.',
    medalLogic: '5/5 = Gold, 4/5 = Silver, 3/5 = Bronze',
    submissionDeadline: 'Sunday 11:59 PM local time',
  },
  {
    name: 'Back Net Challenge',
    goal: 'Hit a fly ball back to the catcher from a deep contact point.',
    rules: 'Tee set deep. Try to hit the ball backward. 5 attempts. Film from the side.',
    scoring: 'Best backward distance out of 5',
    videoRequired: true,
    ageGroups: ['12U', '14U', '16U', '18U', 'College'],
    tieRule: 'Most consistent backward contact wins.',
    medalLogic: 'Top 10% = Gold, Top 25% = Silver, Top 50% = Bronze',
    submissionDeadline: 'Sunday 11:59 PM local time',
  },
  {
    name: 'L-Screen Crossbar Challenge',
    goal: 'Hit the crossbar of the L-screen on a line drive.',
    rules: 'Standard front toss distance. 10 swings. Count crossbar hits. Film from the side.',
    scoring: 'Crossbar hits out of 10',
    videoRequired: true,
    ageGroups: ['12U', '14U', '16U', '18U', 'College'],
    tieRule: 'Fewest total swings to reach score wins.',
    medalLogic: '3+ hits = Gold, 2 hits = Silver, 1 hit = Bronze',
    submissionDeadline: 'Sunday 11:59 PM local time',
  },
];

/* ─── Unified Daily Work Plan ────────────────────────── */

export interface DailyWorkItem {
  id: string;
  type: 'hitting' | 'foundation' | 'strength' | 'mental';
  title: string;
  subtitle?: string;
  /** Quick fix tag label (hitting drills only) */
  tag?: string;
  tagColor?: string;
}

export interface UnifiedDailyWork {
  date: string;
  items: DailyWorkItem[];
  primaryFix: QuickFix;
  secondaryFix: QuickFix;
  completion: Record<string, boolean>;
}

const STORAGE_KEY = 'otc:daily-work';

function getLocalDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Generate the unified daily work plan.
 * Deterministic for a given day — same inputs always produce same outputs.
 */
export function generateUnifiedDailyWork(
  primaryIssue: MechanicalIssue,
  secondaryIssue: MechanicalIssue,
  age: number | null,
  moverType?: MoverType | null,
  /** Optional mental scores for smarter task selection */
  mentalScores?: { iss?: number | null; hss?: number | null } | null,
  /** New 2-axis identity (takes precedence over moverType when provided) */
  identity?: { movementType: HittingMovementType; batPathType: HittingBatPathType } | null,
  /** Pre-resolved OTC-S strength task (from getStrengthTaskForToday). When provided, replaces the static STRENGTH_POOL fallback. */
  resolvedStrengthTask?: string | null,
): UnifiedDailyWork {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const date = getLocalDateString();

  // ── Hitting drills (via recommendation engine) ────
  const rec = getRecommendedDrills({
    primaryIssue,
    secondaryIssue,
    moverType: moverType ?? null,
    movementType: identity?.movementType ?? null,
    batPathType: identity?.batPathType ?? null,
    age,
    recentDrills: [],
  });
  const flat = flattenRecommendation(rec);

  // Resolve quick fix labels for display
  let primaryKey = ISSUE_TO_QUICKFIX[primaryIssue];
  let secondaryKey = ISSUE_TO_QUICKFIX[secondaryIssue];
  if (primaryKey === secondaryKey) {
    secondaryKey =
      ISSUE_SECONDARY_QUICKFIX[secondaryIssue] ??
      ISSUE_SECONDARY_QUICKFIX[primaryIssue] ??
      Object.keys(QUICK_FIXES).find((k) => k !== primaryKey) ??
      primaryKey;
  }
  const primaryFix = QUICK_FIXES[primaryKey]!;
  const secondaryFix = QUICK_FIXES[secondaryKey]!;

  // ── Strength (OTC-S program when available, static fallback otherwise) ──
  const strengthTask = resolvedStrengthTask ?? STRENGTH_POOL[dayIndex % STRENGTH_POOL.length];

  // ── Mental (smart selection based on ISS/HSS) ───
  const mentalTask = getSmartMentalTask(dayIndex, mentalScores?.iss, mentalScores?.hss);

  // ── Build items list ──────────────────────────────
  const items: DailyWorkItem[] = [];

  // Add drills from the recommendation engine
  for (const entry of flat) {
    if (entry.role === 'reset') {
      items.push({
        id: 'foundation',
        type: 'foundation',
        title: entry.name,
        subtitle: 'Foundation drill',
        tag: 'Start Here',
        tagColor: '#22c55e',
      });
    } else if (entry.role === 'primary') {
      items.push({
        id: `hitting-${items.length + 1}`,
        type: 'hitting',
        title: entry.name,
        subtitle: `Primary fix: ${primaryFix.label}`,
        tag: primaryFix.label,
        tagColor: '#E10600',
      });
    } else {
      items.push({
        id: `hitting-${items.length + 1}`,
        type: 'hitting',
        title: entry.name,
        subtitle: `Secondary fix: ${secondaryFix.label}`,
        tag: secondaryFix.label,
        tagColor: '#3b82f6',
      });
    }
  }

  items.push({
    id: 'strength',
    type: 'strength',
    title: strengthTask,
    subtitle: 'Strength movement',
  });

  items.push({
    id: 'mental',
    type: 'mental',
    title: mentalTask,
    subtitle: 'Mental work',
  });

  // Default all completion to false
  const completion: Record<string, boolean> = {};
  for (const item of items) {
    completion[item.id] = false;
  }

  return { date, items, primaryFix, secondaryFix, completion };
}

/* ─── Persistence ────────────────────────────────────── */

/**
 * Load today's daily work from storage.
 * Returns null if no plan exists for today (needs generation).
 */
export async function loadDailyWork(): Promise<UnifiedDailyWork | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const plan: UnifiedDailyWork = JSON.parse(raw);
    if (plan.date !== getLocalDateString()) return null;
    return plan;
  } catch {
    return null;
  }
}

/**
 * Save today's daily work to storage.
 */
export async function saveDailyWork(plan: UnifiedDailyWork): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

/**
 * Update a single item's completion status and persist.
 */
export async function toggleDailyWorkItem(
  itemId: string,
): Promise<UnifiedDailyWork | null> {
  const plan = await loadDailyWork();
  if (!plan) return null;
  plan.completion[itemId] = !plan.completion[itemId];
  await saveDailyWork(plan);
  return plan;
}

/* ─── OTC-S Integration ─────────────────────────────── */

/**
 * Get a strength task label from the OTC-S program (next workout).
 * Returns the day label + focus (e.g. "Lower + Accel — Lower Body + Acceleration Mechanics")
 * or falls back to the static STRENGTH_POOL rotation.
 */
export async function getStrengthTaskForToday(): Promise<string> {
  try {
    const [program, progress] = await Promise.all([
      loadValidatedProgram(),
      loadStrengthProgress(),
    ]);
    if (program && progress) {
      const next = getNextWorkout(program, progress);
      if (next) {
        return `${next.workout.label} — ${next.workout.focus}`;
      }
    }
  } catch {}
  // Fallback to static pool
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return STRENGTH_POOL[dayIndex % STRENGTH_POOL.length];
}

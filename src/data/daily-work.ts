/**
 * Daily Work — Unified training plan generation.
 *
 * Generates a daily plan combining:
 *   2 Hitting drills (from diagnostic results)
 *   1 Strength movement
 *   1 Mental task
 *   1 Community challenge
 *
 * Plans are generated once per day and persisted via AsyncStorage.
 * Rotation uses day-of-epoch for simple, deterministic variety.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MechanicalIssue } from './hitting-mechanical-diagnostic-data';
import type { MoverType } from './hitting-mover-type-data';

/* ─── Quick Fix Definitions ──────────────────────────── */

export interface QuickFix {
  key: string;
  label: string;
  drills: string[];
}

export const QUICK_FIXES: Record<string, QuickFix> = {
  late: {
    key: 'late',
    label: 'Late',
    drills: ['Command Drill', 'Swing at Release', 'Heel Load Drill'],
  },
  lunging: {
    key: 'lunging',
    label: 'Lunging',
    drills: ['Step Back Drill', 'Ball Roll Drill', "Belli's Drill"],
  },
  stuck: {
    key: 'stuck',
    label: 'Stuck',
    drills: ['Happy Gilmore Drill', "Hook'em Drill", 'Bat on Shoulder Drill Series'],
  },
  'losing-posture': {
    key: 'losing-posture',
    label: 'Losing Posture',
    drills: ["Freddie's Drill", 'Mo Vaughn Drill', 'PVC Pipe Swings'],
  },
  'pulling-off': {
    key: 'pulling-off',
    label: 'Pulling Off',
    drills: ['Trout Step Drill', 'Finish Over Tee', 'Bat Throws'],
  },
  casting: {
    key: 'casting',
    label: 'Casting',
    drills: ['Steering Wheel Turns', 'Reverse Grip Drill', 'Deep Tee Series'],
  },
  'rolling-over': {
    key: 'rolling-over',
    label: 'Rolling Over',
    drills: ['No Roll Overs', 'Top Hand Bregman Drill', 'Out Front Tee Drill'],
  },
  'barrel-path': {
    key: 'barrel-path',
    label: 'Barrel Path',
    drills: ['Snap Series', 'Top Hand Open / V-Grip Drill', 'Split Grip Stop at Contact'],
  },
};

/* ─── Diagnostic Issue → Quick Fix mapping ───────────── */

export const ISSUE_TO_QUICKFIX: Record<MechanicalIssue, string> = {
  timing: 'late',
  weight_shift: 'lunging',
  early_rotation: 'stuck',
  disconnection: 'casting',
  swing_plane: 'losing-posture',
  barrel_path: 'barrel-path',
};

const ISSUE_SECONDARY_QUICKFIX: Partial<Record<MechanicalIssue, string>> = {
  early_rotation: 'pulling-off',
  barrel_path: 'rolling-over',
  swing_plane: 'barrel-path',
  disconnection: 'rolling-over',
};

/* ─── Quick Fix → Focus Area (vault section label) ─── */

export const QUICKFIX_TO_FOCUS: Record<string, string[]> = {
  late: ['Timing'],
  lunging: ['Forward Move'],
  stuck: ['Forward Move', 'Connection'],
  'losing-posture': ['Posture'],
  'pulling-off': ['Direction'],
  casting: ['Barrel Turn'],
  'rolling-over': ['Extension'],
  'barrel-path': ['Barrel Turn'],
};

/* ─── Mover Type → Drill Affinity ────────────────────── */
// Maps each mover type to the drills (across all quick fix pools)
// that best align with that movement style.
// Used to bias drill selection toward the athlete's swing identity.

const MOVER_DRILL_AFFINITY: Record<MoverType, Set<string>> = {
  torque: new Set([
    // Rotational acceleration drills
    'Steering Wheel Turns', 'Reverse Grip Drill', 'Deep Tee Series',
    'Snap Series', 'Top Hand Open / V-Grip Drill', 'Split Grip Stop at Contact',
    "Hook'em Drill", 'Bat on Shoulder Drill Series',
  ]),
  ground_force: new Set([
    // Stride and weight transfer drills
    'Step Back Drill', 'Ball Roll Drill', "Belli's Drill",
    'Heel Load Drill', 'Trout Step Drill', 'Happy Gilmore Drill',
  ]),
  flow: new Set([
    // Rhythm and connection drills
    "Freddie's Drill", 'Mo Vaughn Drill', 'PVC Pipe Swings',
    'Finish Over Tee', 'Bat Throws', 'No Roll Overs',
  ]),
  separation: new Set([
    // Stretch and coil drills
    'Command Drill', 'Swing at Release',
    'Top Hand Bregman Drill', 'Out Front Tee Drill',
    'Trout Step Drill', 'Happy Gilmore Drill',
  ]),
};

/* ─── Foundations drills (age ≤ 14 only) ─────────────── */

const FOUNDATIONS_DRILLS = [
  'Hold Finish',
  'Slow Motion Swing',
  'Arráez Drill',
  'Top Hand Bregman Drill',
  'Bottom Hand Drill',
];

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
  type: 'hitting' | 'foundation' | 'strength' | 'mental' | 'challenge';
  title: string;
  subtitle?: string;
  /** Quick fix tag label (hitting drills only) */
  tag?: string;
  tagColor?: string;
  /** Challenge data (challenge type only) */
  challenge?: WeeklyChallenge;
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
 * Pick the best drill from a quick fix pool.
 * If a mover type is provided, prefer a drill that matches the affinity.
 * Falls back to day-of-epoch rotation when no affinity match exists.
 */
export function pickDrill(
  drills: string[],
  dayIndex: number,
  moverType: MoverType | null,
): string {
  if (moverType) {
    const affinity = MOVER_DRILL_AFFINITY[moverType];
    const match = drills.find((d) => affinity.has(d));
    if (match) return match;
  }
  return drills[dayIndex % drills.length];
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
): UnifiedDailyWork {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const weekIndex = Math.floor(dayIndex / 7);
  const date = getLocalDateString();

  // ── Hitting drills ────────────────────────────────
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

  const mover = moverType ?? null;
  const mainDrill = pickDrill(primaryFix.drills, dayIndex, mover);
  const secondaryDrill = pickDrill(secondaryFix.drills, dayIndex, mover);

  // ── Foundation (age ≤ 14) ─────────────────────────
  const isYouth = age !== null && age <= 14;
  const foundationDrill = isYouth
    ? FOUNDATIONS_DRILLS[dayIndex % FOUNDATIONS_DRILLS.length]
    : null;

  // ── Strength ──────────────────────────────────────
  const strengthTask = STRENGTH_POOL[dayIndex % STRENGTH_POOL.length];

  // ── Mental ────────────────────────────────────────
  const mentalTask = MENTAL_POOL[dayIndex % MENTAL_POOL.length];

  // ── Challenge (rotates weekly) ────────────────────
  const challenge = WEEKLY_CHALLENGES[weekIndex % WEEKLY_CHALLENGES.length];

  // ── Build items list ──────────────────────────────
  const items: DailyWorkItem[] = [];

  if (foundationDrill) {
    items.push({
      id: 'foundation',
      type: 'foundation',
      title: foundationDrill,
      subtitle: 'Foundation drill',
      tag: 'Start Here',
      tagColor: '#22c55e',
    });
  }

  items.push({
    id: 'hitting-1',
    type: 'hitting',
    title: mainDrill,
    subtitle: `Primary fix: ${primaryFix.label}`,
    tag: primaryFix.label,
    tagColor: '#E10600',
  });

  items.push({
    id: 'hitting-2',
    type: 'hitting',
    title: secondaryDrill,
    subtitle: `Secondary fix: ${secondaryFix.label}`,
    tag: secondaryFix.label,
    tagColor: '#3b82f6',
  });

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

  items.push({
    id: 'challenge',
    type: 'challenge',
    title: challenge.name,
    subtitle: challenge.goal,
    challenge,
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

/* ─── Legacy exports for backward compat ─────────────── */

export interface DailyWorkPlan {
  primaryFix: QuickFix;
  secondaryFix: QuickFix;
  mainDrill: string;
  secondaryDrill: string;
  challengeDrill: string;
  foundationDrill: string | null;
}

export function generateDailyWork(
  primaryIssue: MechanicalIssue,
  secondaryIssue: MechanicalIssue,
  age: number | null,
): DailyWorkPlan {
  const dayIndex = Math.floor(Date.now() / 86_400_000);

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

  const mainDrill = primaryFix.drills[dayIndex % primaryFix.drills.length];
  const secondaryDrill = secondaryFix.drills[dayIndex % secondaryFix.drills.length];

  const challengePool = [
    primaryFix.drills[(dayIndex + 2) % primaryFix.drills.length],
    secondaryFix.drills[(dayIndex + 2) % secondaryFix.drills.length],
  ];
  const challengeDrill = challengePool[dayIndex % 2];

  const isYouth = age !== null && age <= 14;
  const foundationDrill = isYouth
    ? FOUNDATIONS_DRILLS[dayIndex % FOUNDATIONS_DRILLS.length]
    : null;

  return {
    primaryFix,
    secondaryFix,
    mainDrill,
    secondaryDrill,
    challengeDrill,
    foundationDrill,
  };
}

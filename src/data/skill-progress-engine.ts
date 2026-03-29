/**
 * Skill Progress Engine
 *
 * Tracks 13 real performance skills across 3 categories.
 * Scores are derived from athlete-logged performance challenge data —
 * NOT from content completion, journals, or video views.
 *
 * Scores = rolling average of last N entries per skill.
 *   Hitting: last 10
 *   Mental:  last 5
 *   Physical: last 5
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Skill Definitions ───────────────────────────────────────────────────────

export type SkillCategory = 'hitting' | 'mental' | 'physical';

export type HittingSkillKey =
  | 'timing'
  | 'barrel_control'
  | 'direction'
  | 'pitch_selection'
  | 'competitive_hitting';

export type MentalSkillKey =
  | 'confidence'
  | 'focus'
  | 'emotional_control'
  | 'resilience'
  | 'accountability';

export type PhysicalSkillKey = 'speed' | 'power' | 'strength';

export type SkillKey = HittingSkillKey | MentalSkillKey | PhysicalSkillKey;

export interface SkillMeta {
  key: SkillKey;
  label: string;
  category: SkillCategory;
  icon: string;
  color: string;
  unit: string;
  description: string;
  /** How many recent logs to average */
  windowSize: number;
}

export const HITTING_SKILLS: SkillMeta[] = [
  {
    key: 'timing',
    label: 'Timing',
    category: 'hitting',
    icon: 'timer-outline',
    color: '#E10600',
    unit: '%',
    description: 'Hard barrel % per round',
    windowSize: 10,
  },
  {
    key: 'barrel_control',
    label: 'Barrel Control',
    category: 'hitting',
    icon: 'baseball-outline',
    color: '#f97316',
    unit: '%',
    description: 'Barrel contact % per round',
    windowSize: 10,
  },
  {
    key: 'direction',
    label: 'Direction',
    category: 'hitting',
    icon: 'navigate-outline',
    color: '#eab308',
    unit: '%',
    description: 'Directional hard contact %',
    windowSize: 10,
  },
  {
    key: 'pitch_selection',
    label: 'Pitch Selection',
    category: 'hitting',
    icon: 'eye-outline',
    color: '#84cc16',
    unit: '%',
    description: 'Swing decision accuracy',
    windowSize: 10,
  },
  {
    key: 'competitive_hitting',
    label: 'Competitive Hitting',
    category: 'hitting',
    icon: 'trophy-outline',
    color: '#22c55e',
    unit: '%',
    description: 'Competitive round success rate',
    windowSize: 10,
  },
];

export const MENTAL_SKILLS: SkillMeta[] = [
  {
    key: 'confidence',
    label: 'Confidence',
    category: 'mental',
    icon: 'shield-checkmark-outline',
    color: '#A78BFA',
    unit: '/5',
    description: 'Conviction + response to failure',
    windowSize: 5,
  },
  {
    key: 'focus',
    label: 'Focus',
    category: 'mental',
    icon: 'eye-outline',
    color: '#8b5cf6',
    unit: '%',
    description: 'Reset success rate pitch-to-pitch',
    windowSize: 5,
  },
  {
    key: 'emotional_control',
    label: 'Emotional Control',
    category: 'mental',
    icon: 'heart-outline',
    color: '#c084fc',
    unit: '/5',
    description: 'Recovery score after mistakes',
    windowSize: 5,
  },
  {
    key: 'resilience',
    label: 'Resilience',
    category: 'mental',
    icon: 'trending-up-outline',
    color: '#7c3aed',
    unit: '/5',
    description: 'Bounce-back round performance',
    windowSize: 5,
  },
  {
    key: 'accountability',
    label: 'Accountability',
    category: 'mental',
    icon: 'checkbox-outline',
    color: '#6d28d9',
    unit: '%',
    description: 'Daily standards consistency',
    windowSize: 5,
  },
];

export const PHYSICAL_SKILLS: SkillMeta[] = [
  {
    key: 'speed',
    label: 'Speed',
    category: 'physical',
    icon: 'flash-outline',
    color: '#1DB954',
    unit: 's',
    description: 'Sprint times (10yd, 30yd, 60yd)',
    windowSize: 5,
  },
  {
    key: 'power',
    label: 'Power',
    category: 'physical',
    icon: 'flame-outline',
    color: '#22c55e',
    unit: '',
    description: 'Exit velo + med ball rotational velo',
    windowSize: 5,
  },
  {
    key: 'strength',
    label: 'Strength',
    category: 'physical',
    icon: 'barbell-outline',
    color: '#16a34a',
    unit: '',
    description: 'Relative strength (lift / bodyweight)',
    windowSize: 5,
  },
];

export const ALL_SKILLS: SkillMeta[] = [...HITTING_SKILLS, ...MENTAL_SKILLS, ...PHYSICAL_SKILLS];

export function getSkillMeta(key: SkillKey): SkillMeta {
  return ALL_SKILLS.find((s) => s.key === key)!;
}

// ── Skill Log Types ─────────────────────────────────────────────────────────

export type SkillLogType =
  // Hitting
  | 'hard_barrel_round'
  | 'barrel_contact_round'
  | 'direction_round'
  | 'decision_round'
  | 'competitive_round'
  // Mental
  | 'confidence_challenge'
  | 'focus_challenge'
  | 'emotional_control_challenge'
  | 'resilience_challenge'
  | 'accountability_check'
  // Physical
  | 'sprint_time'
  | 'med_ball_velocity'
  | 'exit_velocity'
  | 'jump_test'
  | 'strength_index';

/** Maps each log type to which skill it feeds */
export const LOG_TYPE_TO_SKILL: Record<SkillLogType, SkillKey> = {
  hard_barrel_round: 'timing',
  barrel_contact_round: 'barrel_control',
  direction_round: 'direction',
  decision_round: 'pitch_selection',
  competitive_round: 'competitive_hitting',
  confidence_challenge: 'confidence',
  focus_challenge: 'focus',
  emotional_control_challenge: 'emotional_control',
  resilience_challenge: 'resilience',
  accountability_check: 'accountability',
  sprint_time: 'speed',
  med_ball_velocity: 'power',
  exit_velocity: 'power',
  jump_test: 'power',
  strength_index: 'strength',
};

// ── Data Structures ─────────────────────────────────────────────────────────

export interface SkillLog {
  id: string;
  skillKey: SkillKey;
  logType: SkillLogType;
  /** Normalized 0–100 value (or 0–5 for mental scales) */
  value: number;
  /** Raw input data — e.g. { hardBarrels: 7, totalSwings: 10 } */
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface SkillScore {
  skillKey: SkillKey;
  /** 0–100 normalized score */
  score: number;
  /** Number of logs contributing to this score */
  logCount: number;
  updatedAt: string;
}

export interface SkillProgressState {
  scores: Record<SkillKey, SkillScore>;
  focusSkills: FocusSkills;
}

export interface FocusSkills {
  hitting: SkillKey[];    // top 2
  mental: SkillKey[];     // top 2
  physical: SkillKey[];   // top 2
}

// ── Storage ─────────────────────────────────────────────────────────────────

const LOGS_KEY = 'otc:skill-logs';
const SCORES_KEY = 'otc:skill-scores';
const FOCUS_KEY = 'otc:skill-focus';

// ── Scoring Engine ──────────────────────────────────────────────────────────

/**
 * Normalize a raw log value to 0–100 scale based on log type.
 */
export function normalizeLogValue(logType: SkillLogType, value: number): number {
  switch (logType) {
    // Hitting: already percentage (0–100)
    case 'hard_barrel_round':
    case 'barrel_contact_round':
    case 'direction_round':
    case 'decision_round':
    case 'competitive_round':
      return Math.max(0, Math.min(100, value));

    // Mental 1–5 scale → 0–100
    case 'confidence_challenge':
    case 'emotional_control_challenge':
    case 'resilience_challenge':
      return Math.max(0, Math.min(100, (value / 5) * 100));

    // Mental percentage
    case 'focus_challenge':
    case 'accountability_check':
      return Math.max(0, Math.min(100, value));

    // Sprint: lower is better. Rough scale: 7.0s (60yd) = 100, 9.0s = 0
    case 'sprint_time':
      return Math.max(0, Math.min(100, ((9.0 - value) / 2.0) * 100));

    // Med ball velocity: 50–90 mph range
    case 'med_ball_velocity':
      return Math.max(0, Math.min(100, ((value - 50) / 40) * 100));

    // Exit velo: 50–100 mph range
    case 'exit_velocity':
      return Math.max(0, Math.min(100, ((value - 50) / 50) * 100));

    // Jump: 15–35 inch range
    case 'jump_test':
      return Math.max(0, Math.min(100, ((value - 15) / 20) * 100));

    // Strength index: 0–100 scale already
    case 'strength_index':
      return Math.max(0, Math.min(100, value));

    default:
      return Math.max(0, Math.min(100, value));
  }
}

/**
 * Recalculate a skill score from its recent logs.
 */
export function recalculateSkillScore(logs: SkillLog[], skillKey: SkillKey): SkillScore {
  const meta = getSkillMeta(skillKey);
  const relevantLogs = logs
    .filter((l) => l.skillKey === skillKey)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, meta.windowSize);

  if (relevantLogs.length === 0) {
    return { skillKey, score: 0, logCount: 0, updatedAt: new Date().toISOString() };
  }

  const avg = relevantLogs.reduce((sum, l) => sum + l.value, 0) / relevantLogs.length;
  return {
    skillKey,
    score: Math.round(avg),
    logCount: relevantLogs.length,
    updatedAt: relevantLogs[0].createdAt,
  };
}

/**
 * Recalculate ALL skill scores from logs.
 */
export function recalculateAllScores(logs: SkillLog[]): Record<SkillKey, SkillScore> {
  const scores: Record<string, SkillScore> = {};
  for (const skill of ALL_SKILLS) {
    scores[skill.key] = recalculateSkillScore(logs, skill.key);
  }
  return scores as Record<SkillKey, SkillScore>;
}

// ── Focus Skills (Diagnostic-Driven) ────────────────────────────────────────

/**
 * Determine the 2 focus skills per category.
 * Priority: diagnostic-flagged weaknesses > lowest scores.
 * Scores do NOT reset when diagnostics change (Option B behavior).
 */
export function determineFocusSkills(
  scores: Record<SkillKey, SkillScore>,
  diagnosticHints?: Partial<Record<SkillCategory, SkillKey[]>>,
): FocusSkills {
  function pickTop2(category: SkillCategory, skills: SkillMeta[]): SkillKey[] {
    // If diagnostics provide focus hints, use those first
    const hints = diagnosticHints?.[category];
    if (hints && hints.length >= 2) return hints.slice(0, 2);

    // Otherwise, pick the 2 lowest scoring skills
    const sorted = [...skills].sort((a, b) => {
      const sa = scores[a.key]?.score ?? 0;
      const sb = scores[b.key]?.score ?? 0;
      return sa - sb;
    });

    // If we have hints but < 2, fill from lowest
    if (hints && hints.length === 1) {
      const remaining = sorted.filter((s) => s.key !== hints[0]);
      return [hints[0], remaining[0]?.key ?? sorted[0].key];
    }

    return sorted.slice(0, 2).map((s) => s.key);
  }

  return {
    hitting: pickTop2('hitting', HITTING_SKILLS),
    mental: pickTop2('mental', MENTAL_SKILLS),
    physical: pickTop2('physical', PHYSICAL_SKILLS),
  };
}

// ── Persistence ─────────────────────────────────────────────────────────────

export async function loadAllLogs(): Promise<SkillLog[]> {
  try {
    const raw = await AsyncStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveAllLogs(logs: SkillLog[]): Promise<void> {
  // Keep only last 100 logs per skill to prevent unbounded growth
  const trimmed: SkillLog[] = [];
  const counts: Record<string, number> = {};
  const sorted = [...logs].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  for (const log of sorted) {
    const c = counts[log.skillKey] ?? 0;
    if (c < 100) {
      trimmed.push(log);
      counts[log.skillKey] = c + 1;
    }
  }
  await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(trimmed));
}

export async function loadSkillScores(): Promise<Record<SkillKey, SkillScore>> {
  try {
    const raw = await AsyncStorage.getItem(SCORES_KEY);
    if (!raw) return buildEmptyScores();
    return JSON.parse(raw);
  } catch {
    return buildEmptyScores();
  }
}

export async function saveSkillScores(scores: Record<SkillKey, SkillScore>): Promise<void> {
  await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

export async function loadFocusSkills(): Promise<FocusSkills> {
  try {
    const raw = await AsyncStorage.getItem(FOCUS_KEY);
    if (!raw) return defaultFocusSkills();
    return JSON.parse(raw);
  } catch {
    return defaultFocusSkills();
  }
}

export async function saveFocusSkills(focus: FocusSkills): Promise<void> {
  await AsyncStorage.setItem(FOCUS_KEY, JSON.stringify(focus));
}

// ── Log Entry (Main API) ────────────────────────────────────────────────────

/**
 * Record a skill challenge log entry.
 * Automatically recalculates the affected skill score.
 *
 * @param logType - The type of challenge log
 * @param rawValue - The raw performance value (e.g. percentage, rating, time)
 * @param metadata - Optional additional data about the round
 * @returns The updated skill score for the affected skill
 */
export async function logSkillChallenge(
  logType: SkillLogType,
  rawValue: number,
  metadata: Record<string, unknown> = {},
): Promise<SkillScore> {
  const skillKey = LOG_TYPE_TO_SKILL[logType];
  const normalizedValue = normalizeLogValue(logType, rawValue);

  const newLog: SkillLog = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    skillKey,
    logType,
    value: normalizedValue,
    metadata: { ...metadata, rawValue },
    createdAt: new Date().toISOString(),
  };

  // Load existing logs, append, recalculate
  const logs = await loadAllLogs();
  logs.unshift(newLog);
  await saveAllLogs(logs);

  // Recalculate just this skill
  const updatedScore = recalculateSkillScore(logs, skillKey);

  // Load existing scores, update just this one, save
  const allScores = await loadSkillScores();
  allScores[skillKey] = updatedScore;
  await saveSkillScores(allScores);

  // Refresh focus skills
  const focus = determineFocusSkills(allScores);
  await saveFocusSkills(focus);

  return updatedScore;
}

/**
 * Get the full skill progress state (scores + focus).
 */
export async function getSkillProgressState(): Promise<SkillProgressState> {
  const [scores, focus] = await Promise.all([
    loadSkillScores(),
    loadFocusSkills(),
  ]);
  return { scores, focusSkills: focus };
}

/**
 * Get recent logs for a specific skill (for detail view).
 */
export async function getLogsForSkill(skillKey: SkillKey, limit = 20): Promise<SkillLog[]> {
  const logs = await loadAllLogs();
  return logs
    .filter((l) => l.skillKey === skillKey)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Update focus skills after a diagnostic is retaken.
 * Scores are NOT reset — only focus display changes.
 */
export async function updateFocusFromDiagnostics(
  hints: Partial<Record<SkillCategory, SkillKey[]>>,
): Promise<FocusSkills> {
  const scores = await loadSkillScores();
  const focus = determineFocusSkills(scores, hints);
  await saveFocusSkills(focus);
  return focus;
}

// ── Power & Strength Helpers ────────────────────────────────────────────────

/**
 * Compute a normalized Power Score (0–100) from measurable outputs.
 *
 * Inputs:
 *   exitVelo        — Exit velocity in mph
 *   medBallVelocity — Rotational med ball velocity in mph
 *   verticalJump    — Vertical jump in inches (optional)
 *
 * Each component is normalized to 0–100, then averaged.
 */
export function computePowerScore(inputs: {
  exitVelo: number;
  medBallVelocity: number;
  verticalJump?: number | null;
}): number {
  const { exitVelo, medBallVelocity, verticalJump } = inputs;

  // Exit velo: 50 mph = 0, 100 mph = 100
  const evScore = Math.max(0, Math.min(100, ((exitVelo - 50) / 50) * 100));

  // Med ball rotational velo: 50 mph = 0, 90 mph = 100
  const mbScore = Math.max(0, Math.min(100, ((medBallVelocity - 50) / 40) * 100));

  if (verticalJump != null && verticalJump > 0) {
    // Vertical jump: 15 in = 0, 35 in = 100
    const vjScore = Math.max(0, Math.min(100, ((verticalJump - 15) / 20) * 100));
    return Math.round((evScore + mbScore + vjScore) / 3);
  }

  return Math.round((evScore + mbScore) / 2);
}

/**
 * Compute a Strength Index (0–100) based on relative strength.
 *
 * Strength Index = (liftWeight / bodyweight) normalized.
 *
 * Example reference: trap bar deadlift
 *   Ratio 1.0 = beginner (~20)
 *   Ratio 2.0 = strong (~70)
 *   Ratio 2.5+ = elite (~100)
 */
export function computeStrengthIndex(inputs: {
  liftWeight: number;
  bodyweight: number;
}): number {
  const { liftWeight, bodyweight } = inputs;
  if (bodyweight <= 0) return 0;

  const ratio = liftWeight / bodyweight;

  // Map ratio to 0–100: 0.5 → 0, 2.5 → 100
  const score = Math.max(0, Math.min(100, ((ratio - 0.5) / 2.0) * 100));
  return Math.round(score);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildEmptyScores(): Record<SkillKey, SkillScore> {
  const scores: Record<string, SkillScore> = {};
  for (const skill of ALL_SKILLS) {
    scores[skill.key] = {
      skillKey: skill.key,
      score: 0,
      logCount: 0,
      updatedAt: '',
    };
  }
  return scores as Record<SkillKey, SkillScore>;
}

function defaultFocusSkills(): FocusSkills {
  return {
    hitting: ['timing', 'barrel_control'],
    mental: ['confidence', 'focus'],
    physical: ['speed', 'power'],
  };
}

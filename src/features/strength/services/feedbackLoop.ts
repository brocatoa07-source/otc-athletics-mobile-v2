/**
 * Feedback Loop — Compliance, Readiness, Outputs, Progression
 *
 * Collects data from existing systems and computes the three signals
 * required by the progression engine:
 *   - complianceRate  (from workout completion history)
 *   - readinessAvg    (from readiness check-in history)
 *   - outputTrend     (from performance trend snapshots)
 *
 * Also provides getProgressionDecision() which orchestrates everything.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadStrengthProgress,
  loadGeneratedProgram,
  type StrengthProgress,
} from '@/data/strength-program-engine';
import { computeReadinessScore, type ReadinessResult } from '@/data/readiness-engine';
import {
  loadSnapshots,
  type PerformanceTrendSnapshot,
  type TrendMetricKey,
} from '@/data/performance-trend';
import {
  computeProgression,
  type ProgressionInput,
  type ProgressionResult,
} from './progressionEngine';

// ── Storage Keys ────────────────────────────────────────────────────────────

const READINESS_HISTORY_KEY = 'otc:readiness-history';
const SESSION_LOG_KEY = 'otc:strength-session-log';
const PROGRESSION_STATE_KEY = 'otc:progression-state';

// ── Session RPE + Pain Tracking ─────────────────────────────────────────────

export interface SessionLog {
  date: string;        // YYYY-MM-DD
  workoutKey: string;  // e.g. "m1w2d3"
  rpe: number;         // 1-5 (1=easy, 5=maximal)
  pain: boolean;
  completedAt: string; // ISO timestamp
}

export async function saveSessionLog(log: SessionLog): Promise<void> {
  const raw = await AsyncStorage.getItem(SESSION_LOG_KEY);
  const history: SessionLog[] = raw ? JSON.parse(raw) : [];
  // Replace same-day entry if exists
  const filtered = history.filter(l => l.date !== log.date || l.workoutKey !== log.workoutKey);
  filtered.unshift(log);
  // Keep last 60 entries (roughly 2 months)
  await AsyncStorage.setItem(SESSION_LOG_KEY, JSON.stringify(filtered.slice(0, 60)));
}

export async function loadSessionLogs(): Promise<SessionLog[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Compliance Rate ─────────────────────────────────────────────────────────

/**
 * Compute compliance rate over the last N days.
 * compliance = completed workouts / (scheduled workouts per week × weeks)
 */
export async function computeComplianceRate(
  lookbackDays: number = 14,
): Promise<{ rate: number; completed: number; planned: number }> {
  const [progress, program] = await Promise.all([
    loadStrengthProgress(),
    loadGeneratedProgram(),
  ]);

  if (!progress || !program) {
    return { rate: 0, completed: 0, planned: 0 };
  }

  const daysPerWeek = program.daysPerWeek ?? 4;
  const weeks = Math.ceil(lookbackDays / 7);
  const planned = daysPerWeek * weeks;

  // Count completions in the lookback window
  // We use the session log (date-based) for accuracy, falling back to completion keys
  const logs = await loadSessionLogs();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - lookbackDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  let completed = 0;
  if (logs.length > 0) {
    completed = logs.filter(l => l.date >= cutoffStr).length;
  } else {
    // Fallback: count from completedWorkouts keys (less precise — no dates)
    completed = Object.values(progress.completedWorkouts).filter(Boolean).length;
    // Clamp to planned since we can't distinguish by date range
    completed = Math.min(completed, planned);
  }

  const rate = planned > 0 ? Math.min(1, completed / planned) : 0;
  return { rate, completed, planned };
}

/**
 * Get average session RPE from recent session logs.
 */
export async function getAverageSessionRPE(lookbackDays: number = 14): Promise<number | null> {
  const logs = await loadSessionLogs();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - lookbackDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const recent = logs.filter(l => l.date >= cutoffStr);
  if (recent.length === 0) return null;
  return recent.reduce((sum, l) => sum + l.rpe, 0) / recent.length;
}

/**
 * Count recent pain flags.
 */
export async function getPainFlagCount(lookbackDays: number = 14): Promise<number> {
  const logs = await loadSessionLogs();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - lookbackDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return logs.filter(l => l.date >= cutoffStr && l.pain).length;
}

// ── Readiness History ───────────────────────────────────────────────────────

export interface ReadinessHistoryEntry {
  date: string;    // YYYY-MM-DD
  score: number;   // 1-10
  answers: Record<string, number>;
}

/**
 * Save today's readiness to history (in addition to the existing single-result store).
 */
export async function saveReadinessToHistory(result: ReadinessResult): Promise<void> {
  const raw = await AsyncStorage.getItem(READINESS_HISTORY_KEY);
  const history: ReadinessHistoryEntry[] = raw ? JSON.parse(raw) : [];

  const today = new Date().toISOString().slice(0, 10);
  const entry: ReadinessHistoryEntry = {
    date: today,
    score: result.score,
    answers: result.answers,
  };

  // Replace same-day entry
  const filtered = history.filter(h => h.date !== today);
  filtered.unshift(entry);
  // Keep 30 days
  await AsyncStorage.setItem(READINESS_HISTORY_KEY, JSON.stringify(filtered.slice(0, 30)));
}

/**
 * Compute average readiness score over the last N days.
 * Returns default of 7 if no history exists.
 */
export async function computeReadinessAvg(
  lookbackDays: number = 7,
): Promise<{ avg: number; entries: number }> {
  try {
    const raw = await AsyncStorage.getItem(READINESS_HISTORY_KEY);
    const history: ReadinessHistoryEntry[] = raw ? JSON.parse(raw) : [];

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - lookbackDays);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    const recent = history.filter(h => h.date >= cutoffStr);

    if (recent.length === 0) {
      return { avg: 7, entries: 0 }; // Safe default
    }

    const avg = recent.reduce((sum, h) => sum + h.score, 0) / recent.length;
    return { avg: Math.round(avg * 10) / 10, entries: recent.length };
  } catch {
    return { avg: 7, entries: 0 };
  }
}

export async function loadReadinessHistory(): Promise<ReadinessHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(READINESS_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Output Trend ────────────────────────────────────────────────────────────

export type OutputTrend = 'improving' | 'flat' | 'declining' | 'unknown';

/**
 * Priority metrics to check for trend (in order).
 * Returns the first metric that has >=2 data points.
 */
const TREND_METRIC_PRIORITY: Array<{ key: TrendMetricKey; higherIsBetter: boolean }> = [
  { key: 'exitVelo', higherIsBetter: true },
  { key: 'broadJump', higherIsBetter: true },
  { key: 'verticalJump', higherIsBetter: true },
  { key: 'tenYard', higherIsBetter: false },
  { key: 'batSpeed', higherIsBetter: true },
  { key: 'throwingVelo', higherIsBetter: true },
  { key: 'rotationalPower', higherIsBetter: true },
  { key: 'sixtyYard', higherIsBetter: false },
];

/**
 * Compute output trend from performance snapshots.
 * Compares the two most recent values for the highest-priority metric with data.
 */
export async function computeOutputTrend(): Promise<{
  trend: OutputTrend;
  metric: string | null;
  latest: number | null;
  previous: number | null;
}> {
  const snapshots = await loadSnapshots();

  if (snapshots.length < 2) {
    return { trend: 'unknown', metric: null, latest: null, previous: null };
  }

  // Sort newest first
  const sorted = [...snapshots].sort(
    (a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime(),
  );

  for (const { key, higherIsBetter } of TREND_METRIC_PRIORITY) {
    // Find two most recent snapshots with this metric
    const withData = sorted.filter(s => s[key] != null);
    if (withData.length < 2) continue;

    const latest = withData[0][key]!;
    const previous = withData[1][key]!;
    const pctChange = ((latest - previous) / previous) * 100;

    let trend: OutputTrend;
    if (higherIsBetter) {
      trend = pctChange > 2 ? 'improving' : pctChange < -5 ? 'declining' : 'flat';
    } else {
      trend = pctChange < -2 ? 'improving' : pctChange > 5 ? 'declining' : 'flat';
    }

    return { trend, metric: key, latest, previous };
  }

  return { trend: 'unknown', metric: null, latest: null, previous: null };
}

// ── Progression State ───────────────────────────────────────────────────────

interface ProgressionState {
  currentDecision: ProgressionResult['decision'];
  weeksInState: number;
  lastUpdated: string;
}

async function loadProgressionState(): Promise<ProgressionState | null> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESSION_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

async function saveProgressionState(state: ProgressionState): Promise<void> {
  await AsyncStorage.setItem(PROGRESSION_STATE_KEY, JSON.stringify(state));
}

// ── Orchestrator ────────────────────────────────────────────────────────────

export interface ProgressionSnapshot {
  compliance: { rate: number; completed: number; planned: number };
  readiness: { avg: number; entries: number };
  output: { trend: OutputTrend; metric: string | null; latest: number | null; previous: number | null };
  sessionRPE: number | null;
  painFlags: number;
  result: ProgressionResult;
  weeksInState: number;
}

/**
 * Full orchestrator: collects all signals, computes progression, updates state.
 */
export async function getProgressionDecision(): Promise<ProgressionSnapshot> {
  // Gather all signals in parallel
  const [compliance, readiness, output, sessionRPE, painFlags, progress, prevState] = await Promise.all([
    computeComplianceRate(14),
    computeReadinessAvg(7),
    computeOutputTrend(),
    getAverageSessionRPE(14),
    getPainFlagCount(14),
    loadStrengthProgress(),
    loadProgressionState(),
  ]);

  // Determine current week type from program progress
  const weekNum = progress?.currentWeek ?? 1;
  const weekTypes: Array<'intro' | 'volume' | 'peak' | 'deload'> = ['intro', 'volume', 'peak', 'deload'];
  const currentWeekType = weekTypes[Math.min(weekNum - 1, 3)];

  // Track how long we've been in current state
  let weeksInState = prevState?.weeksInState ?? 0;

  const input: ProgressionInput = {
    complianceRate: compliance.rate,
    readinessAvg: readiness.avg,
    outputTrend: output.trend,
    currentWeekType,
    weeksInCurrentState: weeksInState,
  };

  const result = computeProgression(input);

  // Update state tracking
  if (prevState && prevState.currentDecision === result.decision) {
    weeksInState = prevState.weeksInState + 1;
  } else {
    weeksInState = 1;
  }

  await saveProgressionState({
    currentDecision: result.decision,
    weeksInState,
    lastUpdated: new Date().toISOString(),
  });

  return {
    compliance,
    readiness,
    output,
    sessionRPE,
    painFlags,
    result,
    weeksInState,
  };
}

// ── Streak Helpers ──────────────────────────────────────────────────────────

/**
 * Compute workout streak (consecutive days with at least one session logged).
 */
export async function computeWorkoutStreak(): Promise<number> {
  const logs = await loadSessionLogs();
  if (logs.length === 0) return 0;

  const uniqueDates = [...new Set(logs.map(l => l.date))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);

  // Must include today or yesterday to be active
  if (uniqueDates[0] !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (uniqueDates[0] !== yesterday.toISOString().slice(0, 10)) return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i - 1]);
    const prev = new Date(uniqueDates[i]);
    const diffDays = (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 1) streak++;
    else break;
  }

  return streak;
}

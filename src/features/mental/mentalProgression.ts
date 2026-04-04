/**
 * Mental Progression System
 *
 * Handles:
 *   - Mental check-in logging (confidence, focus, emotional control)
 *   - Daily mental work completion tracking
 *   - Level-up rules per lane
 *   - Progress calculation toward next level
 *   - Level-up detection and events
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logMentalMetric } from './mentalProgress';

// ── Storage Keys ────────────────────────────────────────────────────────────

const CHECKIN_KEY = 'otc:mental-checkins';
const COMPLETION_KEY = 'otc:mental-daily-completions';
const LEVEL_KEY = 'otc:mental-lane-levels';
const LEVELUP_KEY = 'otc:mental-level-ups';

// ── Check-In System (Part 1) ────────────────────────────────────────────────

export interface MentalCheckIn {
  date: string; // YYYY-MM-DD
  confidence: number; // 1-10
  focus: number; // 1-10
  emotionalControl: number; // 1-10
}

export async function saveMentalCheckIn(checkIn: MentalCheckIn): Promise<void> {
  // Save to check-in history
  const raw = await AsyncStorage.getItem(CHECKIN_KEY);
  const history: MentalCheckIn[] = raw ? JSON.parse(raw) : [];
  const filtered = history.filter(c => c.date !== checkIn.date);
  filtered.unshift(checkIn);
  await AsyncStorage.setItem(CHECKIN_KEY, JSON.stringify(filtered.slice(0, 60)));

  // Also feed into the mental metrics system
  await logMentalMetric('confidence', checkIn.confidence);
  await logMentalMetric('focus', checkIn.focus);
  await logMentalMetric('emotionalControl', checkIn.emotionalControl);
}

export async function loadMentalCheckIns(): Promise<MentalCheckIn[]> {
  try {
    const raw = await AsyncStorage.getItem(CHECKIN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function getTodayCheckIn(): Promise<MentalCheckIn | null> {
  const today = new Date().toISOString().slice(0, 10);
  const all = await loadMentalCheckIns();
  return all.find(c => c.date === today) ?? null;
}

// ── Daily Completion Tracking (Part 2) ──────────────────────────────────────

export type MentalTaskKey = 'tool' | 'reflection' | 'resetReps' | 'routineCue' | 'journal';

export interface DailyMentalCompletion {
  date: string;
  tool: boolean;
  reflection: boolean;
  resetReps: boolean;
  routineCue: boolean;
  journal: boolean;
}

const EMPTY_COMPLETION: Omit<DailyMentalCompletion, 'date'> = {
  tool: false, reflection: false, resetReps: false, routineCue: false, journal: false,
};

export async function loadTodayCompletion(): Promise<DailyMentalCompletion> {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const raw = await AsyncStorage.getItem(COMPLETION_KEY);
    const all: DailyMentalCompletion[] = raw ? JSON.parse(raw) : [];
    return all.find(c => c.date === today) ?? { date: today, ...EMPTY_COMPLETION };
  } catch {
    return { date: today, ...EMPTY_COMPLETION };
  }
}

export async function toggleMentalTask(task: MentalTaskKey): Promise<DailyMentalCompletion> {
  const today = new Date().toISOString().slice(0, 10);
  const raw = await AsyncStorage.getItem(COMPLETION_KEY);
  const all: DailyMentalCompletion[] = raw ? JSON.parse(raw) : [];
  const existing = all.find(c => c.date === today);
  const current = existing ?? { date: today, ...EMPTY_COMPLETION };

  current[task] = !current[task];

  const filtered = all.filter(c => c.date !== today);
  filtered.unshift(current);
  await AsyncStorage.setItem(COMPLETION_KEY, JSON.stringify(filtered.slice(0, 60)));

  // Update derived metrics
  await updateDerivedMetrics();

  return current;
}

async function updateDerivedMetrics(): Promise<void> {
  const completions = await loadAllCompletions();
  const last7 = completions.slice(0, 7);
  if (last7.length === 0) return;

  const routinePct = Math.round((last7.filter(c => c.routineCue).length / last7.length) * 100);
  const journalPct = Math.round((last7.filter(c => c.journal).length / last7.length) * 100);
  const resetPct = Math.round((last7.filter(c => c.resetReps).length / last7.length) * 100);

  await logMentalMetric('routineCompletion', routinePct);
  await logMentalMetric('journalCompletion', journalPct);
  await logMentalMetric('resetUsage', resetPct);
}

async function loadAllCompletions(): Promise<DailyMentalCompletion[]> {
  try {
    const raw = await AsyncStorage.getItem(COMPLETION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Completion Stats ────────────────────────────────────────────────────────

export interface CompletionStats {
  toolReps: number;
  reflections: number;
  resetReps: number;
  routineCues: number;
  journals: number;
  checkIns: number;
  routineCompletionPct: number;
  journalCompletionPct: number;
  resetUsagePct: number;
}

export async function getCompletionStats(lookbackDays: number = 14): Promise<CompletionStats> {
  const [completions, checkIns] = await Promise.all([
    loadAllCompletions(),
    loadMentalCheckIns(),
  ]);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - lookbackDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const recent = completions.filter(c => c.date >= cutoffStr);
  const recentCheckIns = checkIns.filter(c => c.date >= cutoffStr);

  const total = Math.max(recent.length, 1);

  return {
    toolReps: recent.filter(c => c.tool).length,
    reflections: recent.filter(c => c.reflection).length,
    resetReps: recent.filter(c => c.resetReps).length,
    routineCues: recent.filter(c => c.routineCue).length,
    journals: recent.filter(c => c.journal).length,
    checkIns: recentCheckIns.length,
    routineCompletionPct: Math.round((recent.filter(c => c.routineCue).length / total) * 100),
    journalCompletionPct: Math.round((recent.filter(c => c.journal).length / total) * 100),
    resetUsagePct: Math.round((recent.filter(c => c.resetReps).length / total) * 100),
  };
}

// ── Level-Up Rules (Part 3) ─────────────────────────────────────────────────

export interface LevelUpRequirement {
  label: string;
  check: (stats: CompletionStats, trendImproving: boolean) => boolean;
}

export interface LaneLevelRules {
  laneKey: string;
  /** Requirements for Level 0 → 1 */
  level1: LevelUpRequirement[];
  /** Requirements for Level 1 → 2 */
  level2: LevelUpRequirement[];
}

export const LEVEL_UP_RULES: LaneLevelRules[] = [
  {
    laneKey: 'confidence',
    level1: [
      { label: 'Complete 5 mental tool reps', check: (s) => s.toolReps >= 5 },
      { label: 'Log 3 confidence check-ins', check: (s) => s.checkIns >= 3 },
      { label: 'Complete 2 journal entries', check: (s) => s.journals >= 2 },
    ],
    level2: [
      { label: 'Confidence trend improving', check: (_, t) => t },
      { label: 'Routine completion ≥ 70%', check: (s) => s.routineCompletionPct >= 70 },
      { label: 'Journal completion ≥ 60%', check: (s) => s.journalCompletionPct >= 60 },
    ],
  },
  {
    laneKey: 'focus',
    level1: [
      { label: 'Complete 5 focus tool reps', check: (s) => s.toolReps >= 5 },
      { label: 'Log 3 focus check-ins', check: (s) => s.checkIns >= 3 },
      { label: 'Complete 3 reset reps', check: (s) => s.resetReps >= 3 },
    ],
    level2: [
      { label: 'Focus trend improving', check: (_, t) => t },
      { label: 'Routine completion ≥ 70%', check: (s) => s.routineCompletionPct >= 70 },
    ],
  },
  {
    laneKey: 'emotional_control',
    level1: [
      { label: 'Complete 5 reset reps', check: (s) => s.resetReps >= 5 },
      { label: 'Log 3 emotional control check-ins', check: (s) => s.checkIns >= 3 },
      { label: 'Complete 2 reflections', check: (s) => s.reflections >= 2 },
    ],
    level2: [
      { label: 'Emotional control trend improving', check: (_, t) => t },
      { label: 'Reset usage ≥ 70%', check: (s) => s.resetUsagePct >= 70 },
    ],
  },
  {
    laneKey: 'routines',
    level1: [
      { label: 'Routine completion ≥ 50%', check: (s) => s.routineCompletionPct >= 50 },
      { label: 'Complete 5 routine cue reps', check: (s) => s.routineCues >= 5 },
    ],
    level2: [
      { label: 'Routine completion ≥ 80%', check: (s) => s.routineCompletionPct >= 80 },
      { label: 'Log 5 check-ins', check: (s) => s.checkIns >= 5 },
    ],
  },
  {
    laneKey: 'self_talk',
    level1: [
      { label: 'Complete 3 journal entries', check: (s) => s.journals >= 3 },
      { label: 'Complete 3 reflections', check: (s) => s.reflections >= 3 },
    ],
    level2: [
      { label: 'Journal completion ≥ 60%', check: (s) => s.journalCompletionPct >= 60 },
      { label: 'Confidence trend improving', check: (_, t) => t },
    ],
  },
  {
    laneKey: 'pressure',
    level1: [
      { label: 'Complete 3 reflections', check: (s) => s.reflections >= 3 },
      { label: 'Log 3 check-ins', check: (s) => s.checkIns >= 3 },
    ],
    level2: [
      { label: 'Emotional control trend improving', check: (_, t) => t },
      { label: 'Confidence trend stable or improving', check: (_, t) => t },
    ],
  },
];

// ── Level State Persistence ─────────────────────────────────────────────────

export interface LaneLevelState {
  [laneKey: string]: number; // 0, 1, or 2
}

export async function loadLaneLevels(): Promise<LaneLevelState> {
  try {
    const raw = await AsyncStorage.getItem(LEVEL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export async function saveLaneLevels(levels: LaneLevelState): Promise<void> {
  await AsyncStorage.setItem(LEVEL_KEY, JSON.stringify(levels));
}

// ── Level-Up Evaluation ─────────────────────────────────────────────────────

export interface LevelUpProgress {
  laneKey: string;
  currentLevel: number;
  requirements: Array<{ label: string; met: boolean }>;
  allMet: boolean;
  progressPct: number;
}

/**
 * Evaluate level-up progress for a specific lane.
 */
export async function evaluateLevelUpProgress(
  laneKey: string,
  trendImproving: boolean,
): Promise<LevelUpProgress> {
  const [stats, levels] = await Promise.all([
    getCompletionStats(14),
    loadLaneLevels(),
  ]);

  const currentLevel = levels[laneKey] ?? 0;
  const rules = LEVEL_UP_RULES.find(r => r.laneKey === laneKey);

  if (!rules || currentLevel >= 2) {
    return {
      laneKey, currentLevel,
      requirements: [], allMet: false, progressPct: 100,
    };
  }

  const reqs = currentLevel === 0 ? rules.level1 : rules.level2;
  const evaluated = reqs.map(r => ({
    label: r.label,
    met: r.check(stats, trendImproving),
  }));

  const metCount = evaluated.filter(r => r.met).length;
  const allMet = metCount === evaluated.length;
  const progressPct = evaluated.length > 0 ? Math.round((metCount / evaluated.length) * 100) : 0;

  return { laneKey, currentLevel, requirements: evaluated, allMet, progressPct };
}

/**
 * Attempt to level up a lane. Returns true if level advanced.
 */
export async function attemptLevelUp(
  laneKey: string,
  trendImproving: boolean,
): Promise<{ leveled: boolean; newLevel: number }> {
  const progress = await evaluateLevelUpProgress(laneKey, trendImproving);

  if (!progress.allMet || progress.currentLevel >= 2) {
    return { leveled: false, newLevel: progress.currentLevel };
  }

  const levels = await loadLaneLevels();
  const newLevel = progress.currentLevel + 1;
  levels[laneKey] = newLevel;
  await saveLaneLevels(levels);

  // Record level-up event
  await recordLevelUp(laneKey, newLevel);

  return { leveled: true, newLevel };
}

// ── Level-Up Events (Part 6) ────────────────────────────────────────────────

export interface LevelUpEvent {
  laneKey: string;
  newLevel: number;
  date: string;
}

async function recordLevelUp(laneKey: string, newLevel: number): Promise<void> {
  const raw = await AsyncStorage.getItem(LEVELUP_KEY);
  const events: LevelUpEvent[] = raw ? JSON.parse(raw) : [];
  events.unshift({
    laneKey,
    newLevel,
    date: new Date().toISOString().slice(0, 10),
  });
  await AsyncStorage.setItem(LEVELUP_KEY, JSON.stringify(events.slice(0, 30)));
}

export async function getRecentLevelUps(lookbackDays: number = 7): Promise<LevelUpEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(LEVELUP_KEY);
    const events: LevelUpEvent[] = raw ? JSON.parse(raw) : [];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - lookbackDays);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return events.filter(e => e.date >= cutoffStr);
  } catch { return []; }
}

// ── Lane Name Helper ────────────────────────────────────────────────────────

const LANE_NAMES: Record<string, string> = {
  confidence: 'Confidence',
  focus: 'Focus',
  emotional_control: 'Emotional Control',
  routines: 'Routines',
  self_talk: 'Self-Talk',
  pressure: 'Pressure',
};

const LEVEL_NAMES = ['Awareness', 'Building', 'Competing'];

export function getLaneName(key: string): string {
  return LANE_NAMES[key] ?? key;
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level, 2)] ?? `Level ${level}`;
}

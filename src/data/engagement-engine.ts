/**
 * Engagement Engine — Daily Score, Streak, XP/Leveling, Badges, Challenges, Next Priority.
 *
 * Pure utility functions + AsyncStorage persistence.
 * No side effects — safe to import from any context.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Storage Keys ────────────────────────────────────────────────────────────

const STREAK_KEY = 'otc:training-streak';
const XP_KEY = 'otc:athlete-xp';
const BADGES_KEY = 'otc:athlete-badges';
const DAILY_SCORE_KEY = 'otc:daily-score';
const PR_KEY = 'otc:personal-records';
const CHALLENGE_KEY = 'otc:weekly-challenge';

// ── 1. Daily Score (0–100) ──────────────────────────────────────────────────

export interface DailyScoreBreakdown {
  hitting: number;   // 0–25
  strength: number;  // 0–25
  mental: number;    // 0–25
  recovery: number;  // 0–25
  total: number;     // 0–100
}

export interface DailyScoreRecord {
  date: string;
  breakdown: DailyScoreBreakdown;
}

export function computeDailyScore(completed: {
  hitting: boolean;
  strength: boolean;
  mental: boolean;
  recovery: boolean;
}): DailyScoreBreakdown {
  const hitting = completed.hitting ? 25 : 0;
  const strength = completed.strength ? 25 : 0;
  const mental = completed.mental ? 25 : 0;
  const recovery = completed.recovery ? 25 : 0;
  return { hitting, strength, mental, recovery, total: hitting + strength + mental + recovery };
}

export async function saveDailyScore(record: DailyScoreRecord): Promise<void> {
  await AsyncStorage.setItem(DAILY_SCORE_KEY, JSON.stringify(record));
}

export async function loadDailyScore(): Promise<DailyScoreRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(DAILY_SCORE_KEY);
    if (!raw) return null;
    const record: DailyScoreRecord = JSON.parse(raw);
    const today = getLocalDateString();
    if (record.date !== today) return null;
    return record;
  } catch {
    return null;
  }
}

// ── 2. Training Streak ──────────────────────────────────────────────────────

export interface StreakData {
  currentStreak: number;
  lastActiveDate: string;
  longestStreak: number;
}

export async function loadStreak(): Promise<StreakData> {
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    if (!raw) return { currentStreak: 0, lastActiveDate: '', longestStreak: 0 };
    return JSON.parse(raw);
  } catch {
    return { currentStreak: 0, lastActiveDate: '', longestStreak: 0 };
  }
}

export async function updateStreak(dailyScore: number): Promise<StreakData> {
  const streak = await loadStreak();
  const today = getLocalDateString();

  if (streak.lastActiveDate === today) return streak; // Already counted today

  const yesterday = getDateString(new Date(Date.now() - 86_400_000));

  if (dailyScore >= 50) {
    if (streak.lastActiveDate === yesterday) {
      streak.currentStreak += 1;
    } else if (streak.lastActiveDate !== today) {
      streak.currentStreak = 1; // Start new streak
    }
    streak.lastActiveDate = today;
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
  } else {
    // Score below 50 — reset streak (only if it's a new day)
    if (streak.lastActiveDate !== yesterday && streak.lastActiveDate !== today) {
      streak.currentStreak = 0;
    }
  }

  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  return streak;
}

// ── 3. XP & Leveling ────────────────────────────────────────────────────────

export interface XPData {
  totalXP: number;
  level: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpInLevel: number; // XP progress within current level
}

export const XP_REWARDS = {
  drillCompleted: 10,
  workoutCompleted: 25,
  mentalSession: 15,
  dailyScore75: 20,
  streakBonus: 5,   // per streak day milestone (every 7 days)
  prAchieved: 50,
  badgeEarned: 30,
  challengeCompleted: 100,
} as const;

const LEVEL_THRESHOLDS = [
  0,    // Level 1: 0–99
  100,  // Level 2: 100–299
  300,  // Level 3: 300–699
  700,  // Level 4: 700–1499
  1500, // Level 5: 1500–2999
  3000, // Level 6: 3000–5499
  5500, // Level 7: 5500–9999
  10000, // Level 8+
];

export function computeLevel(totalXP: number): XPData {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const xpForCurrentLevel = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const xpForNextLevel = LEVEL_THRESHOLDS[level] ?? xpForCurrentLevel + 5000;
  const xpInLevel = totalXP - xpForCurrentLevel;

  return { totalXP, level, xpForCurrentLevel, xpForNextLevel, xpInLevel };
}

export async function loadXP(): Promise<XPData> {
  try {
    const raw = await AsyncStorage.getItem(XP_KEY);
    if (!raw) return computeLevel(0);
    const { totalXP } = JSON.parse(raw);
    return computeLevel(totalXP ?? 0);
  } catch {
    return computeLevel(0);
  }
}

export async function addXP(amount: number): Promise<XPData> {
  const current = await loadXP();
  const newTotal = current.totalXP + amount;
  const updated = computeLevel(newTotal);
  await AsyncStorage.setItem(XP_KEY, JSON.stringify({ totalXP: newTotal }));
  return updated;
}

// ── 4. Skill Progress Bars ──────────────────────────────────────────────────

export interface SkillScores {
  confidence: number;  // 0–100
  focus: number;
  power: number;
  timing: number;
  consistency: number;
}

/**
 * Compute skill scores from available diagnostic and metric data.
 * Each skill maps to relevant data sources when available.
 */
export function computeSkillScores(inputs: {
  iss?: number | null;       // Identity Stability Score (1–5)
  hss?: number | null;       // Habit System Score (1–5)
  exitVelo?: number | null;  // Latest exit velocity
  exitVeloMax?: number | null;
  streakDays?: number;
  dailyScore?: number;
  archetypeScores?: Record<string, number> | null;
}): SkillScores {
  const { iss, hss, exitVelo, streakDays = 0, dailyScore = 0, archetypeScores } = inputs;

  // Confidence: ISS-driven (1–5 scale → 0–100)
  const confidence = iss != null ? Math.round(Math.min(100, (iss / 5) * 100)) : 50;

  // Focus: Combine HSS + daily completion
  const hssComponent = hss != null ? (hss / 5) * 60 : 30;
  const dailyComponent = (dailyScore / 100) * 40;
  const focus = Math.round(Math.min(100, hssComponent + dailyComponent));

  // Power: Exit velocity relative to benchmarks (50–100 mph range)
  const power = exitVelo != null
    ? Math.round(Math.min(100, Math.max(0, ((exitVelo - 50) / 50) * 100)))
    : 50;

  // Timing: Derived from archetype scores (lower reactor/overthinker = better timing)
  let timing = 50;
  if (archetypeScores) {
    const reactorPenalty = (archetypeScores.reactor ?? 0) / 15;
    const overthinkerPenalty = (archetypeScores.overthinker ?? 0) / 15;
    timing = Math.round(Math.min(100, Math.max(20, 80 - (reactorPenalty + overthinkerPenalty) * 15)));
  }

  // Consistency: Streak-based
  const consistency = Math.round(Math.min(100, Math.max(10, streakDays * 5 + dailyScore * 0.3)));

  return { confidence, focus, power, timing, consistency };
}

// ── 5. Personal Records ─────────────────────────────────────────────────────

export interface PersonalRecord {
  metricType: string;
  previousBest: number;
  newBest: number;
  achievedAt: string;
}

export interface PRStore {
  records: Record<string, number>; // metricType → best value
  recentPR: PersonalRecord | null; // Most recent PR (for modal display)
}

export async function loadPRStore(): Promise<PRStore> {
  try {
    const raw = await AsyncStorage.getItem(PR_KEY);
    if (!raw) return { records: {}, recentPR: null };
    return JSON.parse(raw);
  } catch {
    return { records: {}, recentPR: null };
  }
}

/**
 * Check if a new value is a PR. If so, updates the store and returns the PR info.
 * For sprint times, lower is better — pass `lowerIsBetter: true`.
 */
export async function checkAndRecordPR(
  metricType: string,
  newValue: number,
  lowerIsBetter = false,
): Promise<PersonalRecord | null> {
  const store = await loadPRStore();
  const currentBest = store.records[metricType];

  const isPR = currentBest == null
    || (lowerIsBetter ? newValue < currentBest : newValue > currentBest);

  if (!isPR) return null;

  const pr: PersonalRecord = {
    metricType,
    previousBest: currentBest ?? 0,
    newBest: newValue,
    achievedAt: new Date().toISOString(),
  };

  store.records[metricType] = newValue;
  store.recentPR = pr;
  await AsyncStorage.setItem(PR_KEY, JSON.stringify(store));

  return pr;
}

export async function clearRecentPR(): Promise<void> {
  const store = await loadPRStore();
  store.recentPR = null;
  await AsyncStorage.setItem(PR_KEY, JSON.stringify(store));
}

// ── 6. Achievement Badges ───────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Ionicons name
  color: string;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

export const ALL_BADGES: Badge[] = [
  { id: 'streak-3', name: '3-Day Streak', description: 'Train 3 days in a row', icon: 'flame-outline', color: '#f59e0b' },
  { id: 'streak-7', name: 'Week Warrior', description: 'Train 7 days in a row', icon: 'flame', color: '#f59e0b' },
  { id: 'streak-10', name: '10-Day Streak', description: 'Train 10 days in a row', icon: 'bonfire-outline', color: '#ef4444' },
  { id: 'streak-30', name: 'Iron Will', description: 'Train 30 days in a row', icon: 'bonfire', color: '#ef4444' },
  { id: 'first-pr', name: 'First PR', description: 'Set your first personal record', icon: 'trophy-outline', color: '#eab308' },
  { id: 'pr-5', name: 'PR Machine', description: 'Set 5 personal records', icon: 'trophy', color: '#eab308' },
  { id: 'mental-master', name: 'Mental Master', description: 'Complete all mental diagnostics', icon: 'brain-outline', color: '#A78BFA' },
  { id: 'strength-builder', name: 'Strength Builder', description: 'Complete 10 strength workouts', icon: 'barbell-outline', color: '#1DB954' },
  { id: 'consistency-king', name: 'Consistency King', description: 'Score 75+ on 7 different days', icon: 'ribbon-outline', color: '#3b82f6' },
  { id: 'level-5', name: 'Elite Athlete', description: 'Reach Level 5', icon: 'star', color: '#f59e0b' },
  { id: 'perfect-day', name: 'Perfect Day', description: 'Score 100 on your daily score', icon: 'sunny', color: '#22c55e' },
  { id: 'first-challenge', name: 'Challenger', description: 'Complete your first weekly challenge', icon: 'flag-outline', color: '#3b82f6' },
];

export async function loadEarnedBadges(): Promise<EarnedBadge[]> {
  try {
    const raw = await AsyncStorage.getItem(BADGES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function earnBadge(badgeId: string): Promise<EarnedBadge | null> {
  const earned = await loadEarnedBadges();
  if (earned.some((b) => b.badgeId === badgeId)) return null; // Already earned

  const newBadge: EarnedBadge = { badgeId, earnedAt: new Date().toISOString() };
  earned.push(newBadge);
  await AsyncStorage.setItem(BADGES_KEY, JSON.stringify(earned));
  return newBadge;
}

/**
 * Check and award badges based on current state.
 * Returns newly awarded badges (empty if none).
 */
export async function checkBadges(state: {
  streak: number;
  prCount: number;
  mentalComplete: boolean;
  workoutCount: number;
  highScoreDays: number;
  level: number;
  dailyScore: number;
}): Promise<EarnedBadge[]> {
  const newBadges: EarnedBadge[] = [];

  const checks: [string, boolean][] = [
    ['streak-3', state.streak >= 3],
    ['streak-7', state.streak >= 7],
    ['streak-10', state.streak >= 10],
    ['streak-30', state.streak >= 30],
    ['first-pr', state.prCount >= 1],
    ['pr-5', state.prCount >= 5],
    ['mental-master', state.mentalComplete],
    ['strength-builder', state.workoutCount >= 10],
    ['consistency-king', state.highScoreDays >= 7],
    ['level-5', state.level >= 5],
    ['perfect-day', state.dailyScore >= 100],
  ];

  for (const [id, condition] of checks) {
    if (condition) {
      const result = await earnBadge(id);
      if (result) newBadges.push(result);
    }
  }

  return newBadges;
}

// ── 7. Weekly Challenges ────────────────────────────────────────────────────

export interface WeeklyChallengeProgress {
  weekStart: string;
  challengeId: string;
  hittingSessions: number;
  strengthWorkouts: number;
  mentalSessions: number;
  completed: boolean;
}

export interface ChallengeDefinition {
  id: string;
  name: string;
  description: string;
  requirements: {
    hittingSessions: number;
    strengthWorkouts: number;
    mentalSessions: number;
  };
  xpReward: number;
  badgeId?: string;
}

export const CHALLENGE_ROTATION: ChallengeDefinition[] = [
  {
    id: 'barrel-week',
    name: 'Barrel Week',
    description: 'Complete 5 hitting, 3 strength, and 3 mental sessions',
    requirements: { hittingSessions: 5, strengthWorkouts: 3, mentalSessions: 3 },
    xpReward: 100,
    badgeId: 'first-challenge',
  },
  {
    id: 'grind-week',
    name: 'Grind Week',
    description: 'Complete 4 hitting, 4 strength, and 2 mental sessions',
    requirements: { hittingSessions: 4, strengthWorkouts: 4, mentalSessions: 2 },
    xpReward: 100,
  },
  {
    id: 'mental-fortress',
    name: 'Mental Fortress',
    description: 'Complete 3 hitting, 2 strength, and 5 mental sessions',
    requirements: { hittingSessions: 3, strengthWorkouts: 2, mentalSessions: 5 },
    xpReward: 120,
  },
  {
    id: 'full-send',
    name: 'Full Send Week',
    description: 'Complete 5 hitting, 5 strength, and 5 mental sessions',
    requirements: { hittingSessions: 5, strengthWorkouts: 5, mentalSessions: 5 },
    xpReward: 200,
  },
];

function getWeekStartDate(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  const monday = new Date(d.setDate(diff));
  return getDateString(monday);
}

export function getCurrentChallenge(): ChallengeDefinition {
  const weekNum = Math.floor(Date.now() / (7 * 86_400_000));
  return CHALLENGE_ROTATION[weekNum % CHALLENGE_ROTATION.length];
}

export async function loadChallengeProgress(): Promise<WeeklyChallengeProgress> {
  const weekStart = getWeekStartDate();
  const challenge = getCurrentChallenge();
  try {
    const raw = await AsyncStorage.getItem(CHALLENGE_KEY);
    if (raw) {
      const stored: WeeklyChallengeProgress = JSON.parse(raw);
      if (stored.weekStart === weekStart) return stored;
    }
  } catch {}
  return {
    weekStart,
    challengeId: challenge.id,
    hittingSessions: 0,
    strengthWorkouts: 0,
    mentalSessions: 0,
    completed: false,
  };
}

export async function incrementChallengeProgress(
  type: 'hitting' | 'strength' | 'mental',
): Promise<WeeklyChallengeProgress> {
  const progress = await loadChallengeProgress();
  const challenge = getCurrentChallenge();

  if (type === 'hitting') progress.hittingSessions += 1;
  else if (type === 'strength') progress.strengthWorkouts += 1;
  else progress.mentalSessions += 1;

  // Check if challenge is now complete
  const req = challenge.requirements;
  if (
    progress.hittingSessions >= req.hittingSessions &&
    progress.strengthWorkouts >= req.strengthWorkouts &&
    progress.mentalSessions >= req.mentalSessions
  ) {
    progress.completed = true;
  }

  await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(progress));
  return progress;
}

// ── 8. Next Priority Engine ─────────────────────────────────────────────────

export interface NextPriority {
  title: string;
  explanation: string;
  recommendedDrill?: string;
  drillRoute?: string;
  category: 'hitting' | 'strength' | 'mental' | 'recovery';
}

export function computeNextPriority(inputs: {
  iss?: number | null;
  hss?: number | null;
  streakDays: number;
  dailyScore: number;
  exitVelo?: number | null;
  archetypeKey?: string | null;
  mechanicalPrimary?: string | null;
}): NextPriority {
  const { iss, hss, streakDays, dailyScore, exitVelo, archetypeKey, mechanicalPrimary } = inputs;

  // Priority 1: Low ISS → identity work
  if (iss != null && iss < 3.0) {
    return {
      title: 'Strengthen your competitor identity',
      explanation: `Your Identity Stability Score (${iss.toFixed(1)}) suggests your confidence is tied to outcomes. Build a process-anchored identity.`,
      recommendedDrill: 'Identity Statement Review',
      drillRoute: '/(app)/training/mental/awareness',
      category: 'mental',
    };
  }

  // Priority 2: Low HSS → habit building
  if (hss != null && hss < 3.5) {
    return {
      title: 'Build stronger mental habits',
      explanation: `Your Habit System Score (${hss.toFixed(1)}) shows inconsistent routines. Lock in a daily mental prep process.`,
      recommendedDrill: 'Daily Habit Tracker',
      drillRoute: '/(app)/training/mental/accountability',
      category: 'mental',
    };
  }

  // Priority 3: Mechanical issue
  if (mechanicalPrimary) {
    const issueLabels: Record<string, string> = {
      bat_drag: 'Improve load timing',
      casting: 'Tighten your barrel path',
      rolling_over: 'Stay through the ball longer',
      lunging: 'Improve weight transfer',
      uppercutting: 'Level your swing plane',
      collapsing: 'Maintain posture through contact',
      early_extension: 'Stay connected longer',
      spinning_off: 'Control rotational sequencing',
      slow_hands: 'Improve bat speed',
      no_hip_lead: 'Lead with your hips',
    };
    const label = issueLabels[mechanicalPrimary] ?? 'Address your primary mechanical issue';
    return {
      title: label,
      explanation: `Your swing diagnostic identified ${mechanicalPrimary.replace(/_/g, ' ')} as a focus area.`,
      drillRoute: '/(app)/training/mechanical/daily-work',
      category: 'hitting',
    };
  }

  // Priority 4: Low streak → consistency
  if (streakDays < 3) {
    return {
      title: 'Build training consistency',
      explanation: `You're at a ${streakDays}-day streak. Hit 3+ consecutive days to build momentum.`,
      category: 'recovery',
    };
  }

  // Priority 5: Default — keep pushing
  return {
    title: 'Maintain your edge',
    explanation: 'You\'re training consistently. Keep pushing and aim for a perfect 100 daily score.',
    category: 'hitting',
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getLocalDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Metric Display Names ────────────────────────────────────────────────────

export const METRIC_DISPLAY: Record<string, { label: string; unit: string; lowerIsBetter?: boolean }> = {
  exit_velocity_mph: { label: 'Exit Velocity', unit: 'mph' },
  sprint_60yd_seconds: { label: 'Sprint Speed (60yd)', unit: 's', lowerIsBetter: true },
  sprint_10yd_seconds: { label: 'Sprint Speed (10yd)', unit: 's', lowerIsBetter: true },
  throw_velocity_mph: { label: 'Throw Velocity', unit: 'mph' },
  bat_speed_mph: { label: 'Bat Speed', unit: 'mph' },
  vertical_jump_inches: { label: 'Vertical Jump', unit: 'in' },
  broad_jump_inches: { label: 'Broad Jump', unit: 'in' },
  rot_power_watts: { label: 'Rotational Power', unit: 'W' },
  strength_index: { label: 'Strength Index', unit: '' },
};

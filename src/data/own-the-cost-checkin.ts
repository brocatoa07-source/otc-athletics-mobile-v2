/**
 * OWN THE COST CHECK-IN
 *
 * Daily behavioral accountability system.
 * Identity-driven, tap-based, under 15 seconds.
 *
 * Philosophy: Elite athletes must also be disciplined people.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/* ─── Types ──────────────────────────────────────── */

export type IdentityValue = 'yes' | 'somewhat' | 'no';
export type WorkValue = 'fully' | 'partially' | 'no';
export type EnergyValue = 'high' | 'okay' | 'low';
export type OTCFocusValue = 'locked_in' | 'in_and_out' | 'distracted';
export type ExcuseValue = 'none' | 'a_little' | 'yes';
export type ResponsibilityValue =
  | 'owned_everything'
  | 'avoided_once_or_twice'
  | 'avoided_more_than_should';
export type ChallengeValue = 'challenged_myself' | 'mix' | 'stayed_comfortable';
export type FailureResponseValue = 'leaned_into_it' | 'avoided_it' | 'none_today';

export interface OwnTheCostCheckInLog {
  id: string;
  date: string;

  /** Did I show up like the athlete I say I am? */
  identityAthlete: IdentityValue;
  /** Did I show up like the person I say I am? */
  identityPerson: IdentityValue;

  /** Did I complete what I needed to today? */
  workCompletion: WorkValue;

  /** Physical and mental energy */
  energy: EnergyValue;
  /** How focused was I? */
  focus: OTCFocusValue;

  /** Did I make excuses? */
  excuses: ExcuseValue;
  /** Where did I avoid responsibility? */
  responsibilityAvoidance: ResponsibilityValue;

  /** Did I challenge myself or stay comfortable? */
  challengeLevel: ChallengeValue;
  /** How did I respond to failure/difficulty? */
  failureResponse: FailureResponseValue;

  /** Optional: one win today */
  winReflection?: string;
  /** Optional: one thing to clean up tomorrow */
  cleanupReflection?: string;
}

/* ─── Scoring (internal, for feedback tier) ──────── */

const IDENTITY_SCORES: Record<IdentityValue, number> = { yes: 2, somewhat: 1, no: 0 };
const WORK_SCORES: Record<WorkValue, number> = { fully: 2, partially: 1, no: 0 };
const ENERGY_SCORES: Record<EnergyValue, number> = { high: 2, okay: 1, low: 0 };
const FOCUS_SCORES: Record<OTCFocusValue, number> = { locked_in: 2, in_and_out: 1, distracted: 0 };
const EXCUSE_SCORES: Record<ExcuseValue, number> = { none: 2, a_little: 1, yes: 0 };
const RESPONSIBILITY_SCORES: Record<ResponsibilityValue, number> = {
  owned_everything: 2,
  avoided_once_or_twice: 1,
  avoided_more_than_should: 0,
};
const CHALLENGE_SCORES: Record<ChallengeValue, number> = {
  challenged_myself: 2,
  mix: 1,
  stayed_comfortable: 0,
};
const FAILURE_SCORES: Record<FailureResponseValue, number> = {
  leaned_into_it: 2,
  avoided_it: 0,
  none_today: 1,
};

/** Max possible: 9 fields × 2 = 18 */
const MAX_SCORE = 18;

export type FeedbackTier = 'strong' | 'mixed' | 'weak';

export function scoreDayCheckIn(log: OwnTheCostCheckInLog): number {
  return (
    IDENTITY_SCORES[log.identityAthlete] +
    IDENTITY_SCORES[log.identityPerson] +
    WORK_SCORES[log.workCompletion] +
    ENERGY_SCORES[log.energy] +
    FOCUS_SCORES[log.focus] +
    EXCUSE_SCORES[log.excuses] +
    RESPONSIBILITY_SCORES[log.responsibilityAvoidance] +
    CHALLENGE_SCORES[log.challengeLevel] +
    FAILURE_SCORES[log.failureResponse]
  );
}

export function getFeedbackTier(log: OwnTheCostCheckInLog): FeedbackTier {
  const score = scoreDayCheckIn(log);
  const pct = score / MAX_SCORE;
  if (pct >= 0.75) return 'strong';
  if (pct >= 0.45) return 'mixed';
  return 'weak';
}

/* ─── Feedback Messages ──────────────────────────── */

const STRONG_MESSAGES = [
  'Today you showed up like the athlete you say you are. Stack another day.',
  'You owned today. The standard stays high when you do.',
  'Discipline showed up today. Keep stacking.',
];

const MIXED_MESSAGES = [
  'Some things were there today. Tomorrow is another chance to own it.',
  'Not your strongest day, but you showed up. That matters.',
  'There were gaps today. Identify them and close them tomorrow.',
];

const WEAK_MESSAGES = [
  'You were honest today. That\'s where real progress starts.',
  'Rough day. The fact that you checked in still counts. Reset tomorrow.',
  'Today wasn\'t the standard. Tomorrow can be different.',
];

export function getFeedbackMessage(tier: FeedbackTier, date: string): string {
  // Deterministic rotation based on date
  const dayNum = date.split('-').reduce((sum, part) => sum + Number(part), 0);
  const pool = tier === 'strong' ? STRONG_MESSAGES : tier === 'mixed' ? MIXED_MESSAGES : WEAK_MESSAGES;
  return pool[dayNum % pool.length];
}

/* ─── Streak Calculation ─────────────────────────── */

export function calculateStreak(logs: OwnTheCostCheckInLog[], todayStr: string): number {
  if (logs.length === 0) return 0;

  // Sort by date descending
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  // Must include today or yesterday to have an active streak
  const mostRecent = sorted[0].date;
  const yesterday = getDateString(new Date(new Date(todayStr).getTime() - 86_400_000));

  if (mostRecent !== todayStr && mostRecent !== yesterday) return 0;

  let streak = 1;
  let currentDate = mostRecent;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = getDateString(new Date(new Date(currentDate).getTime() - 86_400_000));
    if (sorted[i].date === prevDate) {
      streak++;
      currentDate = prevDate;
    } else if (sorted[i].date === currentDate) {
      // Duplicate for same day, skip
      continue;
    } else {
      break;
    }
  }

  return streak;
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Start your streak today.';
  if (streak === 1) return 'Day 1. The standard starts now.';
  if (streak < 7) return `${streak} days owning your standard.`;
  if (streak < 14) return `${streak} days. You\'re building something real.`;
  if (streak < 30) return `${streak} days. This is who you are now.`;
  return `${streak} days. Elite discipline.`;
}

/* ─── Storage ────────────────────────────────────── */

const STORAGE_KEY = 'otc:own-the-cost-checkins';

export async function loadCheckIns(): Promise<OwnTheCostCheckInLog[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveCheckIn(log: OwnTheCostCheckInLog): Promise<void> {
  const existing = await loadCheckIns();
  // Replace if same date exists, otherwise prepend
  const idx = existing.findIndex((l) => l.date === log.date);
  if (idx >= 0) {
    existing[idx] = log;
  } else {
    existing.unshift(log);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export async function loadTodayCheckIn(): Promise<OwnTheCostCheckInLog | null> {
  const all = await loadCheckIns();
  const today = getLocalDateString();
  return all.find((l) => l.date === today) ?? null;
}

export async function getStreakInfo(): Promise<{ streak: number; message: string }> {
  const all = await loadCheckIns();
  const today = getLocalDateString();
  const streak = calculateStreak(all, today);
  return { streak, message: getStreakMessage(streak) };
}

/* ─── Helpers ────────────────────────────────────── */

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getLocalDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

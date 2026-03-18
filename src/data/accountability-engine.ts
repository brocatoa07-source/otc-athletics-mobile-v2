/* ────────────────────────────────────────────────────
 * ACCOUNTABILITY SCORE ENGINE
 *
 * Tier-aware: score is computed only from the items
 * required at the athlete's current tier.
 * Weights are normalized across enabled items.
 *
 * Score is 0-100. Resets every Monday.
 * ──────────────────────────────────────────────────── */

import type { RequiredTodayEnabled } from '@/hooks/useRequiredTodayConfig';

export interface WeeklyChecklist {
  workoutsCompleted: number;
  workoutsTarget: number;        // from SC profile daysPerWeek
  readinessCheckins: number;
  readinessTarget: number;       // same as workoutsTarget
  metricsLogged: number;
  metricsTarget: number;         // 1 per week minimum (kept for display only, not scored)
  journalEntries: number;
  journalTarget: number;         // 2 per week
  courseSessionsDone: number;
  courseSessionsTarget: number;  // 2 per week
  skillWorkDaysCount: number;    // days skill work was completed this week
  habitsDaysCount: number;       // days habit tracker was completed this week
  habitsTarget: number;          // same as workoutsTarget (daily non-negotiable)
  addonDaysCount: number;        // days an add-on session was done this week
  addonTarget: number;           // 1 per week minimum
}

export interface AccountabilityResult {
  score: number;                // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  checklist: WeeklyChecklist;
  weekStart: string;            // ISO date of Monday
}

/** Base weights per standard item — normalized at runtime by which are enabled for the tier. */
const BASE_WEIGHTS: Record<keyof RequiredTodayEnabled, number> = {
  training:  0.30,
  readiness: 0.20,
  skillWork: 0.20,
  mental:    0.20,
  journal:   0.10,
};

function pct(done: number, target: number): number {
  if (target === 0) return 1;
  return Math.min(1, done / target);
}

export function computeAccountabilityScore(
  checklist: WeeklyChecklist,
  enabled?: RequiredTodayEnabled,
): number {
  // Default: all items enabled (backwards compatible)
  const cfg: RequiredTodayEnabled = enabled ?? {
    training: true, readiness: true, skillWork: true, mental: true, journal: true,
  };

  const completions: Record<keyof RequiredTodayEnabled, number> = {
    training:  pct(checklist.workoutsCompleted, checklist.workoutsTarget),
    readiness: pct(checklist.readinessCheckins, checklist.readinessTarget),
    skillWork: pct(checklist.skillWorkDaysCount ?? 0, Math.max(1, checklist.workoutsTarget)),
    mental:    pct(checklist.courseSessionsDone, checklist.courseSessionsTarget),
    journal:   pct(checklist.journalEntries, checklist.journalTarget),
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, isEnabled] of Object.entries(cfg) as [keyof RequiredTodayEnabled, boolean][]) {
    if (isEnabled) {
      weightedSum += completions[key] * BASE_WEIGHTS[key];
      totalWeight += BASE_WEIGHTS[key];
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round((weightedSum / totalWeight) * 100);
}

export function getGrade(score: number): AccountabilityResult['grade'] {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}

export function buildDefaultChecklist(daysPerWeek: number): WeeklyChecklist {
  return {
    workoutsCompleted: 0,
    workoutsTarget: daysPerWeek,
    readinessCheckins: 0,
    readinessTarget: daysPerWeek,
    metricsLogged: 0,
    metricsTarget: 1,
    journalEntries: 0,
    journalTarget: 2,
    courseSessionsDone: 0,
    courseSessionsTarget: 2,
    skillWorkDaysCount: 0,
    habitsDaysCount: 0,
    habitsTarget: daysPerWeek,
    addonDaysCount: 0,
    addonTarget: 1,
  };
}

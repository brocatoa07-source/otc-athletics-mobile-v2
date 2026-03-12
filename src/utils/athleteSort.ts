/**
 * athleteSort — pure priority-scoring utilities for the coach dashboard.
 * No Supabase, no React — fully testable in isolation.
 */

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  critical: '#ef4444',
  high:     '#f59e0b',
  medium:   '#3b82f6',
  low:      '#22c55e',
};

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  critical: 'CRITICAL',
  high:     'HIGH',
  medium:   'MEDIUM',
  low:      'LOW',
};

export interface AthleteForSort {
  daysSinceTouchpoint: number;  // days since coach/athlete last communicated
  hasVideoPending: boolean;     // athlete uploaded a video not yet reviewed
  daysSinceLastSession: number; // days since a workout_session was logged
}

/**
 * Score 0–100. Higher means the athlete needs more coach attention.
 *
 * Weights:
 *   - Touchpoint staleness  → up to 60 pts (maxes at ~14 days)
 *   - Pending video review  → 25 pts flat
 *   - No session in 7+ days → 15 pts flat
 */
export function scoreAthlete(a: AthleteForSort): number {
  const touchScore   = Math.min(Math.round(a.daysSinceTouchpoint * 4.3), 60);
  const videoScore   = a.hasVideoPending ? 25 : 0;
  const sessionScore = a.daysSinceLastSession >= 7 ? 15 : 0;
  return touchScore + videoScore + sessionScore;
}

export function getPriorityLevel(score: number): PriorityLevel {
  if (score >= 75) return 'critical';
  if (score >= 45) return 'high';
  if (score >= 20) return 'medium';
  return 'low';
}

/** Returns a new array sorted highest priority first. */
export function sortByPriority<T extends AthleteForSort>(athletes: T[]): T[] {
  return [...athletes].sort((a, b) => scoreAthlete(b) - scoreAthlete(a));
}

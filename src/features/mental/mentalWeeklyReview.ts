/**
 * Mental Weekly Review — Aggregates the athlete's mental week from real data.
 *
 * Data sources:
 *   - Mental check-ins (confidence, focus, emotional control)
 *   - Daily mental work completions (tool, reflection, reset, routine, journal)
 *   - Tool usage from completions
 *   - Journal entries
 *
 * Produces a structured review that feels like a coach reviewing the week.
 */

import {
  loadMentalCheckIns,
  loadTodayCompletion,
  getCompletionStats,
  type MentalCheckIn,
  type CompletionStats,
} from './mentalProgression';
import { computeMentalTrends, type MentalMetricTrend } from './mentalProgress';
import { computeMentalFocus, type MentalFocusState } from './mentalFocusEngine';

// ── Types ───────────────────────────────────────────────────────────────────

export interface MentalWeeklyReview {
  /** How many days of mental work were completed */
  daysCompleted: number;
  daysTarget: number;

  /** Average check-in scores */
  avgConfidence: number | null;
  avgFocus: number | null;
  avgEmotionalControl: number | null;

  /** Completion stats */
  stats: CompletionStats;

  /** Trends */
  trends: MentalMetricTrend[];

  /** Biggest challenge this week (lowest-scoring metric) */
  biggestChallenge: string | null;

  /** Pattern detected */
  patternNote: string | null;

  /** Focus for next week */
  nextWeekFocus: string;

  /** Coach summary */
  coachSummary: string;

  /** Reflection questions */
  reflections: string[];

  /** Current mental focus */
  currentFocus: MentalFocusState | null;
}

// ── Generator ───────────────────────────────────────────────────────────────

export async function generateMentalWeeklyReview(
  archetype: string | null,
): Promise<MentalWeeklyReview> {
  const [checkIns, stats, trends, focus] = await Promise.all([
    loadRecentCheckIns(7),
    getCompletionStats(7),
    computeMentalTrends(),
    computeMentalFocus(archetype),
  ]);

  // Average check-in scores
  const avgConfidence = checkIns.length > 0
    ? Math.round((checkIns.reduce((s, c) => s + c.confidence, 0) / checkIns.length) * 10) / 10
    : null;
  const avgFocus = checkIns.length > 0
    ? Math.round((checkIns.reduce((s, c) => s + c.focus, 0) / checkIns.length) * 10) / 10
    : null;
  const avgEmotionalControl = checkIns.length > 0
    ? Math.round((checkIns.reduce((s, c) => s + c.emotionalControl, 0) / checkIns.length) * 10) / 10
    : null;

  // Biggest challenge (lowest average from check-ins)
  let biggestChallenge: string | null = null;
  if (avgConfidence !== null && avgFocus !== null && avgEmotionalControl !== null) {
    const scores = [
      { label: 'Confidence', score: avgConfidence },
      { label: 'Focus', score: avgFocus },
      { label: 'Emotional Control', score: avgEmotionalControl },
    ];
    scores.sort((a, b) => a.score - b.score);
    if (scores[0].score < 7) {
      biggestChallenge = `${scores[0].label} was your lowest area this week (${scores[0].score}/10).`;
    }
  }

  // Pattern detection
  const patternNote = detectPattern(avgConfidence, avgFocus, avgEmotionalControl, stats);

  // Next week focus
  const nextWeekFocus = focus?.focusTitle ?? 'Continue building your mental habits.';

  // Coach summary
  const coachSummary = buildCoachSummary(stats, avgConfidence, avgFocus, avgEmotionalControl, checkIns.length);

  // Reflection questions
  const reflections = [
    'What did you handle well mentally this week?',
    'Where did you lose control or focus?',
    'What is one thing you will do better next week?',
  ];

  return {
    daysCompleted: stats.toolReps,
    daysTarget: 7,
    avgConfidence,
    avgFocus,
    avgEmotionalControl,
    stats,
    trends,
    biggestChallenge,
    patternNote,
    nextWeekFocus,
    coachSummary,
    reflections,
    currentFocus: focus,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function loadRecentCheckIns(days: number): Promise<MentalCheckIn[]> {
  const all = await loadMentalCheckIns();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return all.filter(c => c.date >= cutoffStr);
}

function detectPattern(
  conf: number | null,
  focus: number | null,
  ec: number | null,
  stats: CompletionStats,
): string | null {
  if (conf !== null && conf < 5 && stats.routineCompletionPct < 40) {
    return 'Confidence drops when routine completion is low. Build the habit first.';
  }
  if (focus !== null && focus < 5 && stats.resetUsagePct < 30) {
    return 'Focus suffers when resets are not used. Practice your between-pitch reset.';
  }
  if (ec !== null && ec < 5 && stats.journals < 2) {
    return 'Emotional control struggles when journaling is skipped. Writing processes emotion.';
  }
  if (stats.routineCompletionPct >= 70 && conf !== null && conf >= 7) {
    return 'Routine consistency is driving your confidence. Keep it up.';
  }
  return null;
}

function buildCoachSummary(
  stats: CompletionStats,
  conf: number | null,
  focus: number | null,
  ec: number | null,
  checkInCount: number,
): string {
  const parts: string[] = [];

  if (stats.toolReps >= 5) {
    parts.push('Strong mental work this week.');
  } else if (stats.toolReps >= 3) {
    parts.push('Decent effort on mental work this week.');
  } else {
    parts.push('Mental work was inconsistent this week.');
  }

  if (checkInCount >= 5) {
    parts.push('Check-in consistency was excellent.');
  } else if (checkInCount === 0) {
    parts.push('No mental check-ins logged — start checking in daily so we can track your mental state.');
  }

  if (conf !== null && conf >= 7) {
    parts.push('Confidence was solid.');
  } else if (conf !== null && conf < 5) {
    parts.push('Confidence needs rebuilding. Use your evidence log.');
  }

  if (stats.routineCompletionPct >= 70) {
    parts.push('Routines were consistent — that is the foundation.');
  } else if (stats.routineCompletionPct < 40) {
    parts.push('Routine completion was low. Consistency is the foundation of everything else.');
  }

  return parts.join(' ');
}

/**
 * Weekly Review — aggregates all feedback loop signals into one snapshot.
 *
 * Powers the Weekly Review screen and coach-facing summaries.
 */

import {
  getProgressionDecision,
  computeWorkoutStreak,
  type ProgressionSnapshot,
} from './feedbackLoop';
import {
  getProgressionMessage,
  getContextualNote,
  type ProgressionMessage,
} from '../config/progressionMessages';
import {
  type DirectionSummary,
  summarizeAdjustments,
  getAdjustmentMessage,
  getProgramAdjustments,
} from './programAdjustments';
import type { StrengthArchetype, StrengthNeed } from '../types/strengthProfile';
import { generateMentalReviewData, type MentalReviewData } from '../../mental/mentalFocusEngine';

export interface WeeklyReview {
  /** Raw progression snapshot with all signal data */
  snapshot: ProgressionSnapshot;

  /** Workout streak (consecutive days) */
  streak: number;

  /** Athlete-facing progression message */
  coachMessage: ProgressionMessage;

  /** Optional contextual note based on conditions */
  contextNote: string | null;

  /** Week summary grade */
  grade: 'A' | 'B' | 'C' | 'D' | 'F';

  /** Highlights for the week */
  highlights: string[];

  /** Areas to improve */
  improvements: string[];

  /** Program adjustment summary for next week */
  programAdjustmentSummary: DirectionSummary;

  /** Athlete-facing description of program changes */
  adjustmentMessage: string;

  /** Mental review data (if available) */
  mentalReview: MentalReviewData | null;
}

/**
 * Generate a full weekly review for the athlete.
 */
export async function generateWeeklyReview(
  archetype: StrengthArchetype = 'hybrid',
  biggestNeed: StrengthNeed = 'strength',
  mentalArchetype: string | null = null,
): Promise<WeeklyReview> {
  const [snapshot, streak] = await Promise.all([
    getProgressionDecision(),
    computeWorkoutStreak(),
  ]);

  const isDeload = snapshot.result.adjustments.some(
    a => a.note.toLowerCase().includes('deload'),
  );

  const coachMessage = getProgressionMessage(snapshot.result.decision, isDeload);
  const contextNote = getContextualNote({
    complianceRate: snapshot.compliance.rate,
    readinessAvg: snapshot.readiness.avg,
    painFlags: snapshot.painFlags,
    weeksInState: snapshot.weeksInState,
    streak,
  });

  const grade = computeGrade(snapshot, streak);
  const highlights = buildHighlights(snapshot, streak);
  const improvements = buildImprovements(snapshot);

  // Compute program adjustments for next week
  const weekTypes: Array<'intro' | 'volume' | 'peak' | 'deload'> = ['intro', 'volume', 'peak', 'deload'];
  const currentWeekType = weekTypes[Math.min(3, Math.max(0, (snapshot.weeksInState - 1) % 4))];

  const adjustments = getProgramAdjustments({
    progressionDecision: snapshot.result.decision,
    archetype,
    biggestNeed,
    complianceRate: snapshot.compliance.rate,
    readinessAvg: snapshot.readiness.avg,
    outputTrend: snapshot.output.trend,
    painFlags: snapshot.painFlags,
    isDeloadWeek: isDeload,
    currentWeekType,
  });

  const programAdjustmentSummary = summarizeAdjustments(adjustments);
  const adjustmentMessage = getAdjustmentMessage(adjustments);

  // Mental review (best-effort — won't fail the review if mental data is missing)
  let mentalReview: MentalReviewData | null = null;
  try {
    mentalReview = await generateMentalReviewData(mentalArchetype);
    // Inject mental insights into highlights/improvements
    if (mentalReview.strongestGain) highlights.push(mentalReview.strongestGain);
    if (mentalReview.weakestArea) improvements.push(mentalReview.weakestArea);
  } catch { /* mental data not available yet */ }

  return {
    snapshot,
    streak,
    coachMessage,
    contextNote,
    grade,
    highlights,
    improvements,
    programAdjustmentSummary,
    adjustmentMessage,
    mentalReview,
  };
}

// ── Grade ───────────────────────────────────────────────────────────────────

function computeGrade(snap: ProgressionSnapshot, streak: number): WeeklyReview['grade'] {
  let score = 0;

  // Compliance (0-40 points)
  score += Math.round(snap.compliance.rate * 40);

  // Readiness (0-20 points)
  score += Math.round((snap.readiness.avg / 10) * 20);

  // Output trend (0-20 points)
  if (snap.output.trend === 'improving') score += 20;
  else if (snap.output.trend === 'flat') score += 12;
  else if (snap.output.trend === 'unknown') score += 10;
  // declining = 0

  // Streak bonus (0-10 points)
  score += Math.min(10, streak * 2);

  // Pain penalty
  score -= snap.painFlags * 3;

  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

// ── Highlights ──────────────────────────────────────────────────────────────

function buildHighlights(snap: ProgressionSnapshot, streak: number): string[] {
  const out: string[] = [];

  if (snap.compliance.rate >= 0.9) out.push('Near-perfect compliance this period.');
  else if (snap.compliance.rate >= 0.8) out.push('Strong compliance — you showed up.');

  if (streak >= 7) out.push(`${streak}-day training streak.`);
  else if (streak >= 3) out.push(`${streak}-day streak and building.`);

  if (snap.readiness.avg >= 7) out.push('Readiness is high — your body is recovering well.');

  if (snap.output.trend === 'improving') out.push('Outputs are trending up.');

  if (snap.painFlags === 0) out.push('No pain flags — training is clean.');

  if (snap.sessionRPE !== null && snap.sessionRPE >= 3 && snap.sessionRPE <= 4) {
    out.push('Session effort is in the sweet spot.');
  }

  if (snap.result.decision === 'progress') out.push('Ready to progress.');

  return out.length > 0 ? out : ['Keep showing up. Data is building.'];
}

// ── Improvements ────────────────────────────────────────────────────────────

function buildImprovements(snap: ProgressionSnapshot): string[] {
  const out: string[] = [];

  if (snap.compliance.rate < 0.5) out.push('Compliance is low — consistency first.');
  else if (snap.compliance.rate < 0.8) out.push('Aim for 4+ sessions per week.');

  if (snap.readiness.avg < 5) out.push('Readiness is low — prioritize sleep and recovery.');
  if (snap.readiness.entries === 0) out.push('Check in daily so we can track your readiness.');

  if (snap.painFlags >= 2) out.push('Multiple pain flags — consider modifying or talking to a coach.');

  if (snap.sessionRPE !== null && snap.sessionRPE >= 4.5) {
    out.push('Average RPE is very high — watch for overtraining.');
  }

  if (snap.output.trend === 'declining') out.push('Outputs are dropping — recovery may be the issue.');
  if (snap.output.trend === 'unknown') out.push('Log a testing session to track your outputs.');

  return out;
}

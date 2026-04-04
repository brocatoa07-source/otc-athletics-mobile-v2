/**
 * Monthly Report System
 *
 * Aggregates a month of training data into a progress report.
 * Data sources: performance snapshots, compliance, readiness, lane progression.
 */

import { loadSnapshots, type TrendMetricKey } from '@/data/performance-trend';
import {
  computeComplianceRate,
  computeReadinessAvg,
  computeOutputTrend,
  loadSessionLogs,
  loadReadinessHistory,
  type OutputTrend,
} from './feedbackLoop';
import { getLaneStep } from '../config/myPathMapping';

export interface MonthlyReport {
  month: number;
  generatedAt: string;

  // Performance deltas
  metrics: MetricDelta[];

  // Training stats
  compliance: { rate: number; completed: number; planned: number };
  readinessAvg: number;
  avgRPE: number | null;
  painFlagCount: number;
  totalSessions: number;

  // Progression
  outputTrend: OutputTrend;
  laneLevel: number;
  previousLaneLevel: number;

  // Coach summary
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  coachSummary: string;
  focusNextMonth: string;

  // Highlights
  highlights: string[];
  improvements: string[];
}

interface MetricDelta {
  key: TrendMetricKey;
  label: string;
  current: number | null;
  previous: number | null;
  delta: number | null;
  improved: boolean;
  unit: string;
}

const METRIC_CONFIG: Array<{ key: TrendMetricKey; label: string; unit: string; higherIsBetter: boolean }> = [
  { key: 'exitVelo', label: 'Exit Velocity', unit: 'mph', higherIsBetter: true },
  { key: 'tenYard', label: '10-Yard Sprint', unit: 's', higherIsBetter: false },
  { key: 'broadJump', label: 'Broad Jump', unit: 'in', higherIsBetter: true },
  { key: 'verticalJump', label: 'Vertical Jump', unit: 'in', higherIsBetter: true },
  { key: 'batSpeed', label: 'Bat Speed', unit: 'mph', higherIsBetter: true },
  { key: 'throwingVelo', label: 'Throwing Velocity', unit: 'mph', higherIsBetter: true },
  { key: 'rotationalPower', label: 'Rotational Power', unit: 'mph', higherIsBetter: true },
];

/**
 * Generate a monthly report from all available data.
 */
export async function generateMonthlyReport(
  currentMonth: number,
): Promise<MonthlyReport> {
  const [
    snapshots,
    compliance,
    readiness,
    outputResult,
    sessionLogs,
    readinessHistory,
  ] = await Promise.all([
    loadSnapshots(),
    computeComplianceRate(30),
    computeReadinessAvg(30),
    computeOutputTrend(),
    loadSessionLogs(),
    loadReadinessHistory(),
  ]);

  // Compute metric deltas from last 2 snapshots
  const sorted = [...snapshots].sort(
    (a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime(),
  );
  const latest = sorted[0];
  const previous = sorted[1];

  const metrics: MetricDelta[] = METRIC_CONFIG.map(({ key, label, unit, higherIsBetter }) => {
    const curr = latest?.[key] ?? null;
    const prev = previous?.[key] ?? null;
    const delta = curr != null && prev != null ? curr - prev : null;
    const improved = delta != null ? (higherIsBetter ? delta > 0 : delta < 0) : false;
    return { key, label, current: curr, previous: prev, delta, improved, unit };
  }).filter(m => m.current != null || m.previous != null);

  // Session stats
  const cutoff30 = new Date();
  cutoff30.setDate(cutoff30.getDate() - 30);
  const cutoffStr = cutoff30.toISOString().slice(0, 10);
  const recentLogs = sessionLogs.filter(l => l.date >= cutoffStr);
  const avgRPE = recentLogs.length > 0
    ? recentLogs.reduce((s, l) => s + l.rpe, 0) / recentLogs.length
    : null;
  const painFlagCount = recentLogs.filter(l => l.pain).length;

  // Lane progression
  const laneLevel = getLaneStep(currentMonth);
  const previousLaneLevel = getLaneStep(Math.max(1, currentMonth - 1));

  // Grade
  const grade = computeMonthGrade(compliance.rate, readiness.avg, outputResult.trend, painFlagCount);

  // Coach summary
  const coachSummary = buildCoachSummary(compliance.rate, readiness.avg, outputResult.trend, metrics, grade);
  const focusNextMonth = buildFocusNextMonth(compliance.rate, readiness.avg, outputResult.trend);

  // Highlights / improvements
  const highlights: string[] = [];
  const improvements: string[] = [];

  if (compliance.rate >= 0.9) highlights.push('Near-perfect compliance.');
  else if (compliance.rate >= 0.8) highlights.push('Strong compliance this month.');
  if (readiness.avg >= 7) highlights.push('Readiness stayed high — recovering well.');
  if (outputResult.trend === 'improving') highlights.push('Outputs trending up.');
  if (painFlagCount === 0) highlights.push('No pain flags — training is clean.');
  metrics.filter(m => m.improved && m.delta != null).forEach(m => {
    highlights.push(`${m.label}: +${Math.abs(m.delta!).toFixed(1)} ${m.unit}`);
  });

  if (compliance.rate < 0.7) improvements.push('Consistency needs work.');
  if (readiness.avg < 5) improvements.push('Recovery and sleep need attention.');
  if (painFlagCount >= 3) improvements.push('Multiple pain flags — modify or see a coach.');
  if (outputResult.trend === 'declining') improvements.push('Outputs are declining — review load management.');

  return {
    month: currentMonth,
    generatedAt: new Date().toISOString(),
    metrics,
    compliance,
    readinessAvg: readiness.avg,
    avgRPE,
    painFlagCount,
    totalSessions: recentLogs.length,
    outputTrend: outputResult.trend,
    laneLevel,
    previousLaneLevel,
    grade,
    coachSummary,
    focusNextMonth,
    highlights,
    improvements,
  };
}

function computeMonthGrade(
  compliance: number, readiness: number, trend: OutputTrend, pain: number,
): MonthlyReport['grade'] {
  let score = 0;
  score += Math.round(compliance * 40);
  score += Math.round((readiness / 10) * 25);
  if (trend === 'improving') score += 25;
  else if (trend === 'flat') score += 15;
  else if (trend === 'unknown') score += 10;
  score -= pain * 3;
  score += 10; // base

  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function buildCoachSummary(
  compliance: number, readiness: number, trend: OutputTrend, metrics: MetricDelta[], grade: string,
): string {
  const parts: string[] = [];

  if (grade === 'A') parts.push('Outstanding month.');
  else if (grade === 'B') parts.push('Solid month of development.');
  else if (grade === 'C') parts.push('Decent effort this month, but there is room to grow.');
  else parts.push('This month needs honest reflection.');

  if (compliance >= 0.85) parts.push('Consistency was elite.');
  else if (compliance < 0.6) parts.push('Showing up more consistently is the first priority.');

  const improved = metrics.filter(m => m.improved);
  if (improved.length > 0) {
    parts.push(`Improved in ${improved.map(m => m.label.toLowerCase()).join(', ')}.`);
  }

  if (trend === 'improving') parts.push('Overall trend is moving in the right direction.');
  else if (trend === 'declining') parts.push('Outputs are dipping — prioritize recovery and consistency.');

  return parts.join(' ');
}

function buildFocusNextMonth(compliance: number, readiness: number, trend: OutputTrend): string {
  if (compliance < 0.6) return 'Show up. Consistency is the foundation of everything else.';
  if (readiness < 5) return 'Prioritize sleep and recovery. You cannot build on a broken foundation.';
  if (trend === 'declining') return 'Reduce intensity and focus on recovery to reverse the trend.';
  if (trend === 'improving') return 'Keep pushing. The system is working — stay the course.';
  return 'Maintain consistency and look for your next test window.';
}

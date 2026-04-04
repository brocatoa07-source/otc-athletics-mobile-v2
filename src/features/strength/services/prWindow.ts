/**
 * PR Window System
 *
 * Detects when conditions are optimal for the athlete to test
 * and set personal records. Opens when all signals align.
 *
 * Trigger conditions:
 *   - readinessAvg >= 7
 *   - complianceRate >= 85%
 *   - outputTrend = 'improving'
 *   - painFlags = 0
 */

import type { ProgressionSnapshot } from './feedbackLoop';

export interface PRWindowState {
  isOpen: boolean;
  reason: string;
  suggestedTests: string[];
  message: string;
}

const SUGGESTED_TESTS = [
  { key: 'sprint', label: '10-Yard Sprint', icon: 'flash' },
  { key: 'exitVelo', label: 'Exit Velocity', icon: 'baseball' },
  { key: 'broadJump', label: 'Broad Jump', icon: 'trending-up' },
  { key: 'verticalJump', label: 'Vertical Jump', icon: 'arrow-up' },
  { key: 'trapBar', label: 'Trap Bar Deadlift', icon: 'barbell' },
  { key: 'throwVelo', label: 'Throwing Velocity', icon: 'rocket' },
];

export { SUGGESTED_TESTS };

/**
 * Evaluate whether a PR window is open based on feedback loop signals.
 */
export function evaluatePRWindow(snapshot: ProgressionSnapshot): PRWindowState {
  const { compliance, readiness, output, painFlags } = snapshot;

  const highReadiness = readiness.avg >= 7;
  const highCompliance = compliance.rate >= 0.85;
  const improving = output.trend === 'improving';
  const noPain = painFlags === 0;

  const isOpen = highReadiness && highCompliance && improving && noPain;

  if (isOpen) {
    return {
      isOpen: true,
      reason: 'All signals are green. Your body is recovered, you\'re consistent, and outputs are trending up.',
      suggestedTests: SUGGESTED_TESTS.map(t => t.label),
      message: 'PR Window is open — test this week.',
    };
  }

  // Build reason why not open
  const blockers: string[] = [];
  if (!highReadiness) blockers.push(`readiness is ${readiness.avg.toFixed(1)}/10 (need 7+)`);
  if (!highCompliance) blockers.push(`compliance is ${Math.round(compliance.rate * 100)}% (need 85%+)`);
  if (!improving) blockers.push(`outputs are ${output.trend}`);
  if (!noPain) blockers.push(`${painFlags} pain flag${painFlags > 1 ? 's' : ''} reported`);

  return {
    isOpen: false,
    reason: `PR Window is closed: ${blockers.join(', ')}.`,
    suggestedTests: [],
    message: 'Keep building. PR Window will open when conditions align.',
  };
}

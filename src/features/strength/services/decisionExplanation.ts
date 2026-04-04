/**
 * Decision Explanation System
 *
 * Generates athlete-facing explanations for why their program changed.
 * Used in Weekly Review, Monthly Report, Coach Brain, and behavior notifications.
 */

import type { ProgressionSnapshot } from './feedbackLoop';
import type { PRWindowState } from './prWindow';

export interface DecisionExplanation {
  /** Short headline */
  headline: string;
  /** 1-2 sentence explanation */
  body: string;
  /** The key signals that drove the decision */
  drivers: DecisionDriver[];
  /** What happens next */
  nextStep: string;
}

export interface DecisionDriver {
  signal: string;
  value: string;
  impact: 'positive' | 'neutral' | 'negative';
}

/**
 * Generate a human-readable explanation of why the program changed.
 */
export function explainDecision(
  snapshot: ProgressionSnapshot,
  prWindow?: PRWindowState | null,
): DecisionExplanation {
  const { compliance, readiness, output, painFlags, result } = snapshot;
  const decision = result.decision;

  const drivers: DecisionDriver[] = [];

  // Build drivers list
  drivers.push({
    signal: 'Compliance',
    value: `${Math.round(compliance.rate * 100)}%`,
    impact: compliance.rate >= 0.8 ? 'positive' : compliance.rate >= 0.5 ? 'neutral' : 'negative',
  });

  drivers.push({
    signal: 'Readiness',
    value: `${readiness.avg.toFixed(1)}/10`,
    impact: readiness.avg >= 6 ? 'positive' : readiness.avg >= 4 ? 'neutral' : 'negative',
  });

  drivers.push({
    signal: 'Output Trend',
    value: output.trend,
    impact: output.trend === 'improving' ? 'positive' : output.trend === 'declining' ? 'negative' : 'neutral',
  });

  if (painFlags > 0) {
    drivers.push({
      signal: 'Pain Flags',
      value: `${painFlags}`,
      impact: 'negative',
    });
  }

  if (prWindow?.isOpen) {
    drivers.push({
      signal: 'PR Window',
      value: 'Open',
      impact: 'positive',
    });
  }

  // Generate explanation based on decision
  if (decision === 'progress') {
    return buildProgressExplanation(snapshot, drivers, prWindow);
  }
  if (decision === 'regress') {
    return buildRegressExplanation(snapshot, drivers);
  }
  return buildHoldExplanation(snapshot, drivers);
}

function buildProgressExplanation(
  snap: ProgressionSnapshot,
  drivers: DecisionDriver[],
  prWindow?: PRWindowState | null,
): DecisionExplanation {
  const parts: string[] = [];

  if (snap.compliance.rate >= 0.85 && snap.readiness.avg >= 7) {
    parts.push('Your readiness and compliance were both high.');
  } else if (snap.compliance.rate >= 0.8) {
    parts.push('Your compliance was strong.');
  }

  if (snap.output.trend === 'improving') {
    parts.push('Your outputs are trending up.');
  }

  parts.push('We are progressing your program.');

  const nextStep = prWindow?.isOpen
    ? 'PR Window is open — consider testing this week.'
    : 'Expect a slight increase in intensity and training stimulus.';

  return {
    headline: 'Program Advancing',
    body: parts.join(' '),
    drivers,
    nextStep,
  };
}

function buildHoldExplanation(
  snap: ProgressionSnapshot,
  drivers: DecisionDriver[],
): DecisionExplanation {
  const parts: string[] = [];

  const isDeload = snap.result.adjustments.some(a => a.note.toLowerCase().includes('deload'));

  if (isDeload) {
    parts.push('This is a planned deload week.');
    parts.push('Your body needs recovery to absorb recent training.');
    return {
      headline: 'Recovery Week',
      body: parts.join(' '),
      drivers,
      nextStep: 'Focus on sleep, nutrition, and light movement. Next week we push again.',
    };
  }

  if (snap.compliance.rate < 0.7) {
    parts.push('Compliance dropped this week.');
    parts.push('Program will hold until consistency improves.');
  } else if (snap.output.trend === 'declining') {
    parts.push('Outputs dipped slightly.');
    parts.push('We are holding to let your body adapt before pushing further.');
  } else if (snap.output.trend === 'unknown') {
    parts.push('Not enough output data to confirm progress.');
    parts.push('Program holds until we have clearer signals.');
  } else {
    parts.push('Signals are mixed or steady.');
    parts.push('Your body is adapting to the current stimulus.');
  }

  return {
    headline: 'Program Holding',
    body: parts.join(' '),
    drivers,
    nextStep: 'Maintain current plan. Show up, stay consistent, and the progress will follow.',
  };
}

function buildRegressExplanation(
  snap: ProgressionSnapshot,
  drivers: DecisionDriver[],
): DecisionExplanation {
  const parts: string[] = [];

  if (snap.painFlags >= 3) {
    parts.push('Multiple pain flags were reported.');
    parts.push('We are reducing load and shifting toward recovery.');
  } else if (snap.readiness.avg < 4) {
    parts.push('Your readiness has been low.');
    parts.push('Fatigue is elevated — we are pulling back to let you recover.');
  } else if (snap.compliance.rate < 0.5) {
    parts.push('Compliance was below 50%.');
    parts.push('We are simplifying the program to match your current capacity.');
  } else {
    parts.push('Recovery signals indicate you need a step back.');
    parts.push('We are reducing intensity so you can rebuild momentum.');
  }

  return {
    headline: 'Program Rebuilding',
    body: parts.join(' '),
    drivers,
    nextStep: 'Focus on showing up consistently and recovering well. We will push again when signals improve.',
  };
}

/**
 * Get a one-line version for compact display (notifications, banners).
 */
export function getDecisionOneLiner(snapshot: ProgressionSnapshot): string {
  const d = snapshot.result.decision;
  const c = Math.round(snapshot.compliance.rate * 100);
  const r = snapshot.readiness.avg.toFixed(0);

  if (d === 'progress') {
    return `Advancing — compliance ${c}%, readiness ${r}/10, outputs ${snapshot.output.trend}.`;
  }
  if (d === 'regress') {
    if (snapshot.painFlags >= 3) return `Rebuilding — pain flags elevated. Focus on recovery.`;
    if (snapshot.readiness.avg < 4) return `Rebuilding — readiness low at ${r}/10. Prioritize recovery.`;
    return `Rebuilding — compliance ${c}%. Show up first, then push.`;
  }
  return `Holding — signals are steady. Stay the course.`;
}

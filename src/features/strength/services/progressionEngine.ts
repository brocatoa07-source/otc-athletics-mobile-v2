/**
 * Phase 7 — Adaptive Progression Engine (v1)
 *
 * Reacts to:
 *   - compliance (did the athlete do the work?)
 *   - fatigue/readiness (is the athlete recovered?)
 *   - key output trend (are outputs improving, holding, or declining?)
 *
 * Produces one of three decisions:
 *   - PROGRESS: increase load, volume, or complexity
 *   - HOLD: maintain current prescription
 *   - REGRESS: reduce load, volume, or complexity
 *
 * This is deliberately simple for v1. The goal is a working feedback loop,
 * not a complex periodization model. Complexity comes in v2 once the
 * data pipeline and athlete compliance are stable.
 */

// ── Decision Output ─────────────────────────────────────────────────────────

export type ProgressionDecision = 'progress' | 'hold' | 'regress';

export interface ProgressionResult {
  decision: ProgressionDecision;
  reason: string;
  /** Specific adjustments to apply */
  adjustments: ProgressionAdjustment[];
}

export interface ProgressionAdjustment {
  target: 'volume' | 'load' | 'complexity' | 'speed_exposure' | 'reactive_volume';
  direction: 'increase' | 'maintain' | 'decrease';
  magnitude: 'small' | 'moderate';
  note: string;
}

// ── Input Signals ───────────────────────────────────────────────────────────

export interface ProgressionInput {
  /** Workout compliance: 0-1 (fraction of planned workouts completed in last 2 weeks) */
  complianceRate: number;

  /** Readiness/fatigue: 1-10 (athlete self-report average over last week, or default 7) */
  readinessAvg: number;

  /** Key output trend: 'improving' | 'flat' | 'declining' | 'unknown' */
  outputTrend: 'improving' | 'flat' | 'declining' | 'unknown';

  /** Current week type in the program */
  currentWeekType: 'intro' | 'volume' | 'peak' | 'deload';

  /** How many weeks the athlete has been in this progression state */
  weeksInCurrentState: number;
}

// ── Thresholds ──────────────────────────────────────────────────────────────

const COMPLIANCE_LOW = 0.5;    // Below 50% = regress
const COMPLIANCE_HIGH = 0.8;   // Above 80% = eligible to progress
const READINESS_LOW = 4;       // Below 4/10 = regress
const READINESS_HIGH = 6;      // Above 6/10 = eligible to progress
const STALE_HOLD_WEEKS = 4;   // If held for 4+ weeks with good compliance, try progress

// ── Core Logic ──────────────────────────────────────────────────────────────

/**
 * Determine the progression decision based on current athlete signals.
 *
 * Priority order:
 *   1. If in deload week → always HOLD (deload is sacred)
 *   2. If compliance is low → REGRESS (athlete isn't doing the work)
 *   3. If readiness is low → REGRESS (athlete is fatigued)
 *   4. If outputs are declining → HOLD or REGRESS depending on severity
 *   5. If compliance + readiness are high + outputs improving → PROGRESS
 *   6. Otherwise → HOLD
 */
export function computeProgression(input: ProgressionInput): ProgressionResult {
  const { complianceRate, readinessAvg, outputTrend, currentWeekType, weeksInCurrentState } = input;

  // Rule 1: Deload weeks are sacred — never progress during deload
  if (currentWeekType === 'deload') {
    return {
      decision: 'hold',
      reason: 'Deload week — maintain and recover.',
      adjustments: [
        { target: 'volume', direction: 'decrease', magnitude: 'moderate', note: 'Deload week — reduce volume as planned.' },
      ],
    };
  }

  // Rule 2: Low compliance → regress
  if (complianceRate < COMPLIANCE_LOW) {
    return {
      decision: 'regress',
      reason: `Compliance is ${Math.round(complianceRate * 100)}%. The athlete isn't completing enough of the planned work. Reduce volume and complexity to match their capacity.`,
      adjustments: [
        { target: 'volume', direction: 'decrease', magnitude: 'moderate', note: 'Reduce total volume to match actual capacity.' },
        { target: 'complexity', direction: 'decrease', magnitude: 'small', note: 'Simplify exercise selection.' },
      ],
    };
  }

  // Rule 3: Low readiness → regress
  if (readinessAvg < READINESS_LOW) {
    return {
      decision: 'regress',
      reason: `Average readiness is ${readinessAvg}/10. The athlete is fatigued. Reduce load and speed exposure to allow recovery.`,
      adjustments: [
        { target: 'load', direction: 'decrease', magnitude: 'small', note: 'Reduce working load by ~10%.' },
        { target: 'speed_exposure', direction: 'decrease', magnitude: 'small', note: 'Reduce high-velocity sprint volume.' },
        { target: 'reactive_volume', direction: 'decrease', magnitude: 'small', note: 'Reduce reactive plyo contacts.' },
      ],
    };
  }

  // Rule 4: Declining outputs → hold (or regress if readiness also borderline)
  if (outputTrend === 'declining') {
    if (readinessAvg < READINESS_HIGH) {
      return {
        decision: 'regress',
        reason: 'Outputs are declining and readiness is borderline. Pull back to recover before pushing again.',
        adjustments: [
          { target: 'volume', direction: 'decrease', magnitude: 'small', note: 'Slight volume reduction to aid recovery.' },
          { target: 'load', direction: 'maintain', magnitude: 'small', note: 'Maintain load but reduce sets.' },
        ],
      };
    }
    return {
      decision: 'hold',
      reason: 'Outputs are declining but readiness is adequate. Hold current prescription and monitor.',
      adjustments: [],
    };
  }

  // Rule 5: High compliance + high readiness + improving → progress
  if (complianceRate >= COMPLIANCE_HIGH && readinessAvg >= READINESS_HIGH && outputTrend === 'improving') {
    return {
      decision: 'progress',
      reason: 'Compliance, readiness, and outputs all trending well. Increase training stimulus.',
      adjustments: [
        { target: 'load', direction: 'increase', magnitude: 'small', note: 'Increase working load by ~5%.' },
        { target: 'volume', direction: 'increase', magnitude: 'small', note: 'Add one set to primary lifts.' },
      ],
    };
  }

  // Rule 6: Stale hold with good compliance → try small progress
  if (weeksInCurrentState >= STALE_HOLD_WEEKS && complianceRate >= COMPLIANCE_HIGH && readinessAvg >= READINESS_HIGH) {
    return {
      decision: 'progress',
      reason: `Held for ${weeksInCurrentState} weeks with good compliance and readiness. Time to push.`,
      adjustments: [
        { target: 'complexity', direction: 'increase', magnitude: 'small', note: 'Progress to next exercise variation.' },
      ],
    };
  }

  // Default: hold
  return {
    decision: 'hold',
    reason: 'Signals are mixed or neutral. Maintain current prescription and continue monitoring.',
    adjustments: [],
  };
}

/**
 * Get a human-readable summary of the progression decision.
 */
export function summarizeProgression(result: ProgressionResult): string {
  const emoji = result.decision === 'progress' ? '↑' : result.decision === 'regress' ? '↓' : '→';
  return `${emoji} ${result.decision.toUpperCase()}: ${result.reason}`;
}

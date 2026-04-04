/**
 * Phase 7 — Program Adjustment Engine
 *
 * Translates progression decisions into concrete program multipliers.
 * These multipliers are applied to sets, load, plyo contacts, sprint volume,
 * and complexity during workout rendering.
 *
 * The adjustment engine sits between the progression engine (which decides
 * progress/hold/regress) and the workout renderer (which displays exercises).
 *
 * Safety rules are enforced here — the engine will never allow dangerous
 * progression when signals indicate risk.
 */

import type { StrengthArchetype, StrengthNeed } from '../types/strengthProfile';

// ── Types ───────────────────────────────────────────────────────────────────

export interface ProgramAdjustmentInput {
  progressionDecision: 'progress' | 'hold' | 'regress';
  archetype: StrengthArchetype;
  biggestNeed: StrengthNeed;
  complianceRate: number;     // 0-1
  readinessAvg: number;       // 1-10
  outputTrend: 'improving' | 'flat' | 'declining' | 'unknown';
  painFlags: number;
  isDeloadWeek: boolean;
  currentWeekType: 'intro' | 'volume' | 'peak' | 'deload';
}

export interface ProgramAdjustments {
  /** Volume multiplier: -0.2 (reduce 20%) to +0.2 (increase 20%) */
  volumeAdjustment: number;
  /** Intensity/load multiplier: -0.1 to +0.1 */
  intensityAdjustment: number;
  /** Plyo contacts multiplier: -0.3 to +0.3 */
  plyoAdjustment: number;
  /** Sprint volume multiplier: -0.3 to +0.3 */
  sprintAdjustment: number;
  /** Lift volume multiplier: -0.2 to +0.2 */
  liftAdjustment: number;
  /** Complexity multiplier: -0.2 to +0.2 */
  complexityAdjustment: number;
  /** Flags */
  addRecovery: boolean;
  addMobility: boolean;
  reduceHeavy: boolean;
  reducePlyos: boolean;
  reduceSprintVolume: boolean;
  /** Primary training focus this period */
  focusOutput: 'strength' | 'elasticity' | 'speed' | 'rotation' | 'movement';
  /** Safety override applied */
  safetyOverride: string | null;
}

export interface DirectionSummary {
  volume: 'up' | 'same' | 'down';
  intensity: 'up' | 'same' | 'down';
  plyos: 'up' | 'same' | 'down';
  sprints: 'up' | 'same' | 'down';
  lifts: 'up' | 'same' | 'down';
  recovery: 'added' | 'same';
}

// ── Safety Rules ────────────────────────────────────────────────────────────

function applySafetyRules(
  input: ProgramAdjustmentInput,
): { decision: ProgramAdjustmentInput['progressionDecision']; override: string | null } {
  let decision = input.progressionDecision;
  let override: string | null = null;

  // Force REGRESS conditions
  if (input.readinessAvg <= 3) {
    decision = 'regress';
    override = 'Readiness critically low — forced regression.';
  } else if (input.painFlags >= 4) {
    decision = 'regress';
    override = 'Multiple pain flags — forced regression for safety.';
  } else if (input.complianceRate < 0.5) {
    decision = 'regress';
    override = 'Compliance below 50% — rebuild consistency first.';
  }

  // Force HOLD conditions (only if not already regressing)
  if (decision !== 'regress') {
    if (input.isDeloadWeek) {
      decision = 'hold';
      override = 'Deload week — holding as planned.';
    } else if (input.outputTrend === 'unknown') {
      if (decision === 'progress') {
        decision = 'hold';
        override = 'Output trend unknown — holding until data is available.';
      }
    }
  }

  // Block PROGRESS if conditions not met
  if (decision === 'progress') {
    if (input.readinessAvg < 5) {
      decision = 'hold';
      override = 'Readiness too low to progress safely.';
    } else if (input.painFlags >= 3) {
      decision = 'hold';
      override = 'Pain flags present — holding before progressing.';
    } else if (input.complianceRate < 0.7) {
      decision = 'hold';
      override = 'Compliance below 70% — build consistency before progressing.';
    }
  }

  return { decision, override };
}

// ── Need → Focus Mapping ────────────────────────────────────────────────────

const NEED_FOCUS: Record<StrengthNeed, ProgramAdjustments['focusOutput']> = {
  mobility: 'movement',
  stability_control: 'movement',
  strength: 'strength',
  elasticity: 'elasticity',
  speed_rotation: 'speed',
};

// ── Core Engine ─────────────────────────────────────────────────────────────

/**
 * Compute program adjustments based on progression decision + context.
 */
export function getProgramAdjustments(input: ProgramAdjustmentInput): ProgramAdjustments {
  const { decision, override } = applySafetyRules(input);
  const focusOutput = NEED_FOCUS[input.biggestNeed];

  if (decision === 'progress') {
    return buildProgressAdjustments(input, focusOutput, override);
  }
  if (decision === 'regress') {
    return buildRegressAdjustments(input, focusOutput, override);
  }
  return buildHoldAdjustments(input, focusOutput, override);
}

// ── PROGRESS ────────────────────────────────────────────────────────────────

function buildProgressAdjustments(
  input: ProgramAdjustmentInput,
  focusOutput: ProgramAdjustments['focusOutput'],
  safetyOverride: string | null,
): ProgramAdjustments {
  const base: ProgramAdjustments = {
    volumeAdjustment: 0.05,
    intensityAdjustment: 0.05,
    plyoAdjustment: 0.1,
    sprintAdjustment: 0.1,
    liftAdjustment: -0.05,  // Slightly reduce slow heavy to make room for speed/power
    complexityAdjustment: 0.1,
    addRecovery: false,
    addMobility: false,
    reduceHeavy: false,
    reducePlyos: false,
    reduceSprintVolume: false,
    focusOutput,
    safetyOverride,
  };

  // Archetype-specific progress biases
  if (input.archetype === 'static') {
    // Static athletes progressing = more elastic/speed work, less heavy volume
    base.plyoAdjustment = 0.15;
    base.sprintAdjustment = 0.15;
    base.liftAdjustment = -0.1;
    base.reduceHeavy = true;
  } else if (input.archetype === 'spring') {
    // Spring athletes progressing = more strength/control, keep reactive moderate
    base.liftAdjustment = 0.1;
    base.plyoAdjustment = 0.05;
    base.intensityAdjustment = 0.1;
  }

  // Need-specific progress emphasis
  if (input.biggestNeed === 'elasticity') {
    base.plyoAdjustment = Math.min(0.2, base.plyoAdjustment + 0.1);
    base.sprintAdjustment = Math.min(0.2, base.sprintAdjustment + 0.05);
  } else if (input.biggestNeed === 'speed_rotation') {
    base.sprintAdjustment = Math.min(0.2, base.sprintAdjustment + 0.1);
  } else if (input.biggestNeed === 'strength') {
    base.liftAdjustment = Math.min(0.15, base.liftAdjustment + 0.15);
    base.intensityAdjustment = Math.min(0.1, base.intensityAdjustment + 0.05);
  } else if (input.biggestNeed === 'mobility' || input.biggestNeed === 'stability_control') {
    base.addMobility = true;
    base.complexityAdjustment = 0.05; // Don't add too much complexity if mobility/stability limited
  }

  return base;
}

// ── HOLD ────────────────────────────────────────────────────────────────────

function buildHoldAdjustments(
  _input: ProgramAdjustmentInput,
  focusOutput: ProgramAdjustments['focusOutput'],
  safetyOverride: string | null,
): ProgramAdjustments {
  return {
    volumeAdjustment: 0,
    intensityAdjustment: 0,
    plyoAdjustment: 0,
    sprintAdjustment: 0,
    liftAdjustment: 0,
    complexityAdjustment: 0,
    addRecovery: false,
    addMobility: false,
    reduceHeavy: false,
    reducePlyos: false,
    reduceSprintVolume: false,
    focusOutput,
    safetyOverride,
  };
}

// ── REGRESS ─────────────────────────────────────────────────────────────────

function buildRegressAdjustments(
  input: ProgramAdjustmentInput,
  focusOutput: ProgramAdjustments['focusOutput'],
  safetyOverride: string | null,
): ProgramAdjustments {
  const base: ProgramAdjustments = {
    volumeAdjustment: -0.15,
    intensityAdjustment: -0.1,
    plyoAdjustment: -0.2,
    sprintAdjustment: -0.2,
    liftAdjustment: -0.15,
    complexityAdjustment: -0.15,
    addRecovery: true,
    addMobility: true,
    reduceHeavy: true,
    reducePlyos: true,
    reduceSprintVolume: true,
    focusOutput: 'movement', // Regress always focuses on movement quality
    safetyOverride,
  };

  // Severe regression for very low signals
  if (input.readinessAvg <= 3 || input.painFlags >= 4) {
    base.volumeAdjustment = -0.2;
    base.plyoAdjustment = -0.3;
    base.sprintAdjustment = -0.3;
    base.liftAdjustment = -0.2;
    base.complexityAdjustment = -0.2;
  }

  return base;
}

// ── Direction Summary ───────────────────────────────────────────────────────

function dir(val: number): 'up' | 'same' | 'down' {
  if (val > 0.01) return 'up';
  if (val < -0.01) return 'down';
  return 'same';
}

/**
 * Summarize adjustments into simple up/same/down directions for UI display.
 */
export function summarizeAdjustments(adj: ProgramAdjustments): DirectionSummary {
  return {
    volume: dir(adj.volumeAdjustment),
    intensity: dir(adj.intensityAdjustment),
    plyos: dir(adj.plyoAdjustment),
    sprints: dir(adj.sprintAdjustment),
    lifts: dir(adj.liftAdjustment),
    recovery: adj.addRecovery ? 'added' : 'same',
  };
}

// ── Adjustment Message ──────────────────────────────────────────────────────

const FOCUS_LABELS: Record<ProgramAdjustments['focusOutput'], string> = {
  strength: 'strength and force production',
  elasticity: 'speed and elasticity',
  speed: 'acceleration and rotational speed',
  rotation: 'rotational power and separation',
  movement: 'movement quality and recovery',
};

/**
 * Generate an athlete-facing message explaining what changed and why.
 */
export function getAdjustmentMessage(adj: ProgramAdjustments): string {
  const parts: string[] = [];

  // What's increasing
  const ups: string[] = [];
  if (adj.plyoAdjustment > 0.05) ups.push('reactive plyometrics');
  if (adj.sprintAdjustment > 0.05) ups.push('sprint intensity');
  if (adj.liftAdjustment > 0.05) ups.push('lifting volume');
  if (adj.intensityAdjustment > 0.05) ups.push('training intensity');
  if (adj.complexityAdjustment > 0.05) ups.push('exercise complexity');

  if (ups.length > 0) {
    parts.push(`This week your program is increasing ${ups.join(' and ')}.`);
  }

  // What's decreasing
  const downs: string[] = [];
  if (adj.reduceHeavy) downs.push('heavy lifting volume');
  if (adj.reducePlyos) downs.push('reactive plyo volume');
  if (adj.reduceSprintVolume) downs.push('sprint volume');
  if (adj.liftAdjustment < -0.05 && !adj.reduceHeavy) downs.push('lifting volume');
  if (adj.volumeAdjustment < -0.1) downs.push('overall volume');

  if (downs.length > 0) {
    parts.push(`${downs.join(' and ').charAt(0).toUpperCase() + downs.join(' and ').slice(1)} is reduced.`);
  }

  // What's added
  if (adj.addRecovery) parts.push('Recovery work has been added.');
  if (adj.addMobility && !adj.addRecovery) parts.push('Extra mobility work has been added.');

  // Focus
  parts.push(`Focus on ${FOCUS_LABELS[adj.focusOutput]} this week.`);

  // Safety override
  if (adj.safetyOverride) {
    parts.push(adj.safetyOverride);
  }

  // If everything is same (hold)
  if (parts.length <= 1 && ups.length === 0 && downs.length === 0) {
    return `Your program stays the same this week. Focus on ${FOCUS_LABELS[adj.focusOutput]} and keep building.`;
  }

  return parts.join(' ');
}

// ── Apply Multipliers ───────────────────────────────────────────────────────

/**
 * Apply volume adjustment to a base sets string like "4×5".
 * Returns the adjusted string, e.g., "3×5" or "5×5".
 */
export function applyVolumeMultiplier(setsStr: string, adjustment: number): string {
  const match = setsStr.match(/^(\d+)\s*[×x]\s*(\d+)$/i);
  if (!match) return setsStr;

  const sets = parseInt(match[1], 10);
  const reps = parseInt(match[2], 10);
  const adjustedSets = Math.max(1, Math.round(sets * (1 + adjustment)));

  return `${adjustedSets}×${reps}`;
}

/**
 * Apply a numeric multiplier and return clamped integer result.
 * Useful for plyo contacts, sprint distances, etc.
 */
export function applyMultiplier(base: number, adjustment: number, min: number = 1): number {
  return Math.max(min, Math.round(base * (1 + adjustment)));
}

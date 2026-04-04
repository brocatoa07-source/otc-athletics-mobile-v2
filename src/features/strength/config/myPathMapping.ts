/**
 * My Path Mapping — Deterministic my_path_start_point → lane title + ordered steps.
 *
 * Each MyPathStartPoint maps to a development lane with 4 ordered phases.
 */

import type { MyPathStartPoint } from '../types/strengthProfile';

export interface MyPathLane {
  startPoint: MyPathStartPoint;
  title: string;
  description: string;
  steps: [string, string, string, string];
}

export const MY_PATH_LANES: Record<MyPathStartPoint, MyPathLane> = {
  own_positions: {
    startPoint: 'own_positions',
    title: 'Own Your Positions',
    description: 'Access → Control → Strength → Transfer',
    steps: [
      'Improve movement access',
      'Control positions under load',
      'Add usable strength',
      'Transfer to speed and rotation',
    ],
  },

  build_strength_base: {
    startPoint: 'build_strength_base',
    title: 'Build Your Strength Base',
    description: 'Force → Eccentric/Iso → Speed-Strength → Transfer',
    steps: [
      'Improve base force output',
      'Build eccentric and isometric strength',
      'Express force faster',
      'Transfer to sport',
    ],
  },

  build_elasticity: {
    startPoint: 'build_elasticity',
    title: 'Build Elasticity',
    description: 'Stiffness → Rebound → Max V Rhythm → Baseball Movement',
    steps: [
      'Improve stiffness and rebound',
      'Convert force to quickness',
      'Refine max velocity rhythm',
      'Transfer to baseball movement',
    ],
  },

  improve_acceleration: {
    startPoint: 'improve_acceleration',
    title: 'Improve Acceleration',
    description: 'First Step → Projection → Rotational Speed → Position-Specific',
    steps: [
      'Sharpen first-step mechanics',
      'Improve projection and force transfer',
      'Add rotational speed transfer',
      'Transfer to position-specific movement',
    ],
  },

  improve_rotation: {
    startPoint: 'improve_rotation',
    title: 'Improve Rotation',
    description: 'Separation → Sequencing → Speed Expression → Baseball Actions',
    steps: [
      'Improve separation access',
      'Improve sequencing and decel',
      'Increase rotational speed expression',
      'Transfer to baseball actions',
    ],
  },
};

// ── Lane Progression Logic ──────────────────────────────────────────────────

/**
 * Determine which step (0-3) the athlete is on based on program month.
 * Months 1-2 = step 0, Months 3-4 = step 1, Month 5 = step 2, Month 6 = step 3.
 */
export function getLaneStep(currentMonth: number): number {
  if (currentMonth <= 2) return 0;
  if (currentMonth <= 4) return 1;
  if (currentMonth <= 5) return 2;
  return 3;
}

/**
 * Apply progression decision to lane advancement.
 * PROGRESS: move forward one step (if not at end)
 * HOLD: stay at current step
 * REGRESS: move back one step (if not at start)
 */
export function adjustLaneStep(
  currentStep: number,
  decision: 'progress' | 'hold' | 'regress',
): { step: number; changed: boolean; note: string } {
  if (decision === 'progress' && currentStep < 3) {
    return {
      step: currentStep + 1,
      changed: true,
      note: 'Advancing to the next phase of your development path.',
    };
  }
  if (decision === 'regress' && currentStep > 0) {
    return {
      step: currentStep - 1,
      changed: true,
      note: 'Repeating this phase to build a stronger foundation before advancing.',
    };
  }
  if (decision === 'progress' && currentStep >= 3) {
    return {
      step: currentStep,
      changed: false,
      note: 'You are at the final phase. Maintain and refine.',
    };
  }
  return {
    step: currentStep,
    changed: false,
    note: decision === 'hold'
      ? 'Staying at this phase. Your body is adapting.'
      : 'Continuing at the foundation phase.',
  };
}

/**
 * selectWorkoutBlocks — Workout block selection layer.
 *
 * Consumes:
 *   - monthly phase (governing constraint)
 *   - primary archetype
 *   - secondary need
 *   - programming bias arrays from strength profile
 *
 * Produces:
 *   - block variant selections for each workout block type
 *   - phase still governs load/volume; profile biases exercise selection
 *
 * The archetype does NOT override the whole program.
 * The phase still governs the month.
 * The profile only biases WITHIN the monthly system.
 */

import type {
  StrengthArchetype,
  StrengthNeed,
  ProgrammingBiases,
} from '../types/strengthProfile';

// ── Block Types ─────────────────────────────────────────────────────────────

export type WorkoutBlockType =
  | 'prep'
  | 'plyo'
  | 'sprint'
  | 'main_lift'
  | 'accessory'
  | 'conditioning';

export type MonthlyPhase = 'gpp' | 'strength' | 'power' | 'speed' | 'peaking' | 'deload';

export interface BlockSelection {
  blockType: WorkoutBlockType;
  /** Selected variant tags — used to filter/swap exercises within the block */
  variantTags: string[];
  /** Human-readable note explaining why this variant was selected */
  note: string;
}

export interface WorkoutBlockSelections {
  prep: BlockSelection;
  plyo: BlockSelection;
  sprint: BlockSelection;
  main_lift: BlockSelection;
  accessory: BlockSelection;
  conditioning: BlockSelection;
}

// ── Phase Constraints ───────────────────────────────────────────────────────

interface PhaseConstraint {
  /** Maximum exercise count per block */
  maxExercises: number;
  /** Volume modifier (1.0 = normal) */
  volumeModifier: number;
  /** Blocks to drop entirely in this phase */
  dropBlocks: WorkoutBlockType[];
  /** Override notes for this phase */
  phaseNote: string;
}

const PHASE_CONSTRAINTS: Record<MonthlyPhase, PhaseConstraint> = {
  gpp: { maxExercises: 5, volumeModifier: 1.0, dropBlocks: [], phaseNote: 'General prep — build base across all qualities.' },
  strength: { maxExercises: 4, volumeModifier: 1.1, dropBlocks: [], phaseNote: 'Strength emphasis — higher load, lower speed work.' },
  power: { maxExercises: 4, volumeModifier: 0.9, dropBlocks: [], phaseNote: 'Power emphasis — convert strength to speed.' },
  speed: { maxExercises: 4, volumeModifier: 0.8, dropBlocks: [], phaseNote: 'Speed emphasis — low volume, high quality.' },
  peaking: { maxExercises: 3, volumeModifier: 0.6, dropBlocks: ['conditioning'], phaseNote: 'Peaking — maintain, don\'t build. Freshness priority.' },
  deload: { maxExercises: 3, volumeModifier: 0.5, dropBlocks: ['conditioning'], phaseNote: 'Deload — recovery. Minimal stress.' },
};

// ── Selection Logic ─────────────────────────────────────────────────────────

/**
 * Select workout block variants based on monthly phase and strength profile.
 *
 * Phase governs constraints (volume, dropped blocks).
 * Profile biases exercise selection within phase rules.
 */
export function selectWorkoutBlocks(
  phase: MonthlyPhase,
  archetype: StrengthArchetype,
  secondaryNeed: StrengthNeed,
  biases: ProgrammingBiases,
): WorkoutBlockSelections {
  const constraint = PHASE_CONSTRAINTS[phase];

  return {
    prep: {
      blockType: 'prep',
      variantTags: biases.prep_bias,
      note: `${archetype} prep: ${biases.prep_bias.slice(0, 3).join(', ')}. ${constraint.phaseNote}`,
    },
    plyo: constraint.dropBlocks.includes('plyo')
      ? { blockType: 'plyo', variantTags: [], note: `Plyos dropped in ${phase} phase.` }
      : {
          blockType: 'plyo',
          variantTags: biases.plyo_bias,
          note: `${archetype} plyo: ${biases.plyo_bias.slice(0, 3).join(', ')}. Volume mod: ${constraint.volumeModifier}x.`,
        },
    sprint: {
      blockType: 'sprint',
      variantTags: biases.sprint_bias,
      note: `${archetype} sprint: ${biases.sprint_bias.slice(0, 3).join(', ')}. ${secondaryNeed === 'speed_rotation' ? 'Speed is primary need — prioritize.' : ''}`,
    },
    main_lift: {
      blockType: 'main_lift',
      variantTags: biases.strength_bias,
      note: `${archetype} strength: ${biases.strength_bias.slice(0, 3).join(', ')}. Max ${constraint.maxExercises} exercises.`,
    },
    accessory: {
      blockType: 'accessory',
      variantTags: biases.accessory_bias,
      note: `${archetype} + ${secondaryNeed} accessory: ${biases.accessory_bias.slice(0, 3).join(', ')}.`,
    },
    conditioning: constraint.dropBlocks.includes('conditioning')
      ? { blockType: 'conditioning', variantTags: [], note: `Conditioning dropped in ${phase} phase.` }
      : {
          blockType: 'conditioning',
          variantTags: biases.conditioning_bias,
          note: `${archetype} conditioning: ${biases.conditioning_bias.join(', ')}.`,
        },
  };
}

/**
 * Get a human-readable summary of how the profile changes the workout.
 * Use this for logging / debug to prove visible personalization.
 */
export function summarizeBlockDifferences(
  selections: WorkoutBlockSelections,
): string[] {
  const lines: string[] = [];
  for (const [block, sel] of Object.entries(selections)) {
    if (sel.variantTags.length > 0) {
      lines.push(`${block}: [${sel.variantTags.join(', ')}]`);
    } else {
      lines.push(`${block}: (dropped or empty)`);
    }
  }
  return lines;
}

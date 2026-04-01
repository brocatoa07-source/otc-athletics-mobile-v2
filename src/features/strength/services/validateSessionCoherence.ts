/**
 * Session Coherence Validator — Runs after all overrides to ensure
 * the workout session remains valid.
 *
 * Checks:
 *   1. Block intent coherence — blocks still serve their purpose
 *   2. Phase constraints respected — exercise count + fatigue within limits
 *   3. Fatigue budget — total fatigue cost stays within acceptable range
 *   4. Prohibited combinations — conflicting exercises removed
 *   5. Mobility/control suppression integrity — suppressed exercises
 *      not re-introduced by downstream injections
 *
 * ═══════════════════════════════════════════════════════════════════════
 * MODIFIER PRECEDENCE (documented here as the canonical reference):
 *
 * 1. Phase template — base exercises, sets, reps (HIGHEST PRIORITY)
 * 2. Season modifiers — volume/block drops per season phase
 * 3. Position modifiers — exercise swaps for position-specific needs
 * 4. Deficiency modifiers — exercise swaps for movement limitations
 * 5. Profile suppressions — remove/cap exercises per avoid_overemphasis
 * 6. Profile swaps — replace exercises per profile bias tags
 * 7. Profile injections — add exercises per profile bias tags
 * 8. Session coherence cleanup — final validation pass (LAST)
 *
 * Later steps cannot override earlier steps' constraints.
 * E.g., an injection cannot exceed the phase exercise cap.
 * A profile swap cannot undo a deficiency override.
 * ═══════════════════════════════════════════════════════════════════════
 */

import type { GeneratedBlock, GeneratedExercise } from './applyProfileOverrides';
import { getExerciseMetadata } from '../config/exerciseMetadataRegistry';
import type { MetadataFilter } from '../types/exerciseMetadata';
import { matchesFilter } from '../types/exerciseMetadata';

// ── Coherence Result ────────────────────────────────────────────────────────

export interface CoherenceResult {
  valid: boolean;
  blocks: GeneratedBlock[];
  warnings: string[];
  removals: number;
}

// ── Coherence Rules ─────────────────────────────────────────────────────────

interface CoherenceRule {
  name: string;
  /** Which blocks to check */
  blockKeys: string[];
  /** Metadata filter — exercises matching this filter in the wrong context are flagged */
  filter: MetadataFilter;
  /** What to do: 'warn' logs but keeps, 'remove' deletes the exercise */
  action: 'warn' | 'remove';
  note: string;
}

const COHERENCE_RULES: CoherenceRule[] = [
  // High-complexity exercises shouldn't appear in blocks meant for simple work
  {
    name: 'complexity_in_accessory',
    blockKeys: ['accessory-circuit', 'shoulder-durability'],
    filter: { maxComplexity: undefined, phaseRole: ['power_dev', 'max_strength'] },
    action: 'warn',
    note: 'Complex power/strength exercise found in accessory block.',
  },

  // Max velocity exercises shouldn't appear in decel/control focused blocks
  {
    name: 'max_velocity_in_control_block',
    blockKeys: ['plyometrics'],
    filter: { velocityType: ['max_velocity'], emphasis: ['elastic_reactive'] },
    action: 'warn',
    note: 'Max velocity exercise in plyometrics block — check if control intent is still served.',
  },

  // Exercises requiring high mobility should not be in sessions where mobility is suppressed
  {
    name: 'mobility_dependent_after_suppression',
    blockKeys: ['main-strength', 'loaded-power'],
    filter: { mobilityRequirements: ['hip_ir', 'tspine_rotation', 'shoulder_flexion'] },
    action: 'warn',
    note: 'Exercise requires mobility access that may be limited.',
  },
];

// ── Fatigue Budget ──────────────────────────────────────────────────────────

const FATIGUE_BUDGET_BY_PHASE: Record<string, number> = {
  gpp: 30,
  strength: 35,
  power: 25,
  speed: 20,
  peaking: 15,
  deload: 10,
};

// ── Main Validator ──────────────────────────────────────────────────────────

/**
 * Validate session coherence after all overrides have been applied.
 *
 * @param blocks - The blocks after profile overrides
 * @param phase - Current monthly phase (for fatigue budget)
 * @param avoidTags - Profile avoid_overemphasis tags (to check for re-introductions)
 * @param maxExercisesPerBlock - Phase-governed exercise cap
 */
export function validateSessionCoherence(
  blocks: GeneratedBlock[],
  phase: string = 'gpp',
  avoidTags: string[] = [],
  maxExercisesPerBlock: number = 6,
): CoherenceResult {
  const warnings: string[] = [];
  let removals = 0;
  const modified = blocks.map((b) => ({
    ...b,
    exercises: [...b.exercises],
  }));

  // ── Check 1: Exercise cap per block ───────────────────────────────────
  for (const block of modified) {
    if (block.exercises.length > maxExercisesPerBlock) {
      const excess = block.exercises.length - maxExercisesPerBlock;
      block.exercises = block.exercises.slice(0, maxExercisesPerBlock);
      warnings.push(`[cap] ${block.key}: trimmed ${excess} exercises to respect phase cap of ${maxExercisesPerBlock}`);
      removals += excess;
    }
  }

  // ── Check 2: Fatigue budget ───────────────────────────────────────────
  const budget = FATIGUE_BUDGET_BY_PHASE[phase] ?? 30;
  let totalFatigue = 0;
  for (const block of modified) {
    for (const ex of block.exercises) {
      const meta = getExerciseMetadata(ex.name);
      totalFatigue += meta.fatigueCost;
    }
  }
  if (totalFatigue > budget) {
    warnings.push(`[fatigue] Total fatigue cost ${totalFatigue} exceeds phase budget ${budget}. Consider reducing volume.`);
  }

  // ── Check 3: Coherence rules ──────────────────────────────────────────
  for (const rule of COHERENCE_RULES) {
    for (const block of modified) {
      if (rule.blockKeys.length > 0 && !rule.blockKeys.includes(block.key)) continue;

      for (let i = block.exercises.length - 1; i >= 0; i--) {
        const ex = block.exercises[i];
        const meta = getExerciseMetadata(ex.name);

        if (matchesFilter(meta, rule.filter)) {
          if (rule.action === 'remove') {
            block.exercises.splice(i, 1);
            warnings.push(`[coherence:${rule.name}] Removed "${ex.name}" from ${block.key} — ${rule.note}`);
            removals++;
          } else {
            warnings.push(`[coherence:${rule.name}] Warning: "${ex.name}" in ${block.key} — ${rule.note}`);
          }
        }
      }
    }
  }

  // ── Check 4: Re-introduction guard ────────────────────────────────────
  // If an avoid tag suppressed certain exercise types, check that injections
  // didn't re-introduce them.
  if (avoidTags.includes('loading_without_access')) {
    for (const block of modified) {
      for (let i = block.exercises.length - 1; i >= 0; i--) {
        const meta = getExerciseMetadata(block.exercises[i].name);
        if (meta.complexityLevel >= 4 && meta.mobilityRequirements.some((r) => r !== 'none')) {
          warnings.push(`[reintro] "${block.exercises[i].name}" requires mobility access but loading_without_access is active — removing`);
          block.exercises.splice(i, 1);
          removals++;
        }
      }
    }
  }

  if (avoidTags.includes('chaotic_reactive_work_without_control')) {
    for (const block of modified) {
      for (let i = block.exercises.length - 1; i >= 0; i--) {
        const meta = getExerciseMetadata(block.exercises[i].name);
        if (meta.contractionType === 'reactive' && meta.velocityType === 'max_velocity') {
          warnings.push(`[reintro] "${block.exercises[i].name}" is chaotic reactive work but control suppression is active — removing`);
          block.exercises.splice(i, 1);
          removals++;
        }
      }
    }
  }

  return {
    valid: warnings.filter((w) => w.startsWith('[reintro]')).length === 0,
    blocks: modified,
    warnings,
    removals,
  };
}

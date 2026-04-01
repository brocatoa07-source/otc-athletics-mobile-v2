/**
 * applyProfileOverrides — Post-processing layer that transforms generated
 * workout blocks based on the athlete's strength profile.
 *
 * Runs AFTER template-based generation and position/deficiency modifiers.
 * Phase still governs — overrides only bias selection WITHIN phase constraints.
 *
 * Three operations:
 *   1. INJECT — Add exercises to blocks matching bias tags
 *   2. SWAP — Replace exercises matching bias tags
 *   3. SUPPRESS — Remove/cap exercises matching avoid_overemphasis tags
 *
 * Order of operations: Suppress → Swap → Inject
 * (Remove bad stuff first, then replace, then add good stuff)
 */

import {
  INJECTION_RULES,
  SWAP_RULES,
  SUPPRESSION_RULES,
} from '../config/profileOverrideRules';
import { getExerciseMetadata } from '../config/exerciseMetadataRegistry';
import { matchesFilter } from '../types/exerciseMetadata';

// ── Types (match otcs-types.ts generated exercise format) ───────────────────

export interface GeneratedExercise {
  name: string;
  sets: string;
  cue: string;
  rest?: string;
  blockKey: string;
  isModified: boolean;
  modifiedBy?: 'position' | 'deficiency' | 'profile';
  modNote?: string;
}

export interface GeneratedBlock {
  key: string;
  label: string;
  exercises: GeneratedExercise[];
}

export interface ProfileOverrideInput {
  /** All bias tags for this block type (from selectWorkoutBlocks or direct from profile) */
  biasTags: string[];
  /** avoid_overemphasis tags from the profile */
  avoidTags: string[];
}

export interface OverrideResult {
  blocks: GeneratedBlock[];
  appliedInjections: number;
  appliedSwaps: number;
  appliedSuppressions: number;
  log: string[];
}

// ── Main Override Function ──────────────────────────────────────────────────

/**
 * Apply profile-driven overrides to a set of generated workout blocks.
 *
 * @param blocks - The generated blocks from the template engine
 * @param input - Profile bias tags and avoid tags
 * @param maxExercisesPerBlock - Phase-governed cap on exercises per block
 * @returns Modified blocks with override log
 */
export function applyProfileOverrides(
  blocks: GeneratedBlock[],
  input: ProfileOverrideInput,
  maxExercisesPerBlock: number = 6,
): OverrideResult {
  const { biasTags, avoidTags } = input;
  const log: string[] = [];
  let appliedInjections = 0;
  let appliedSwaps = 0;
  let appliedSuppressions = 0;

  // Deep clone to avoid mutation
  let modified = blocks.map((b) => ({
    ...b,
    exercises: b.exercises.map((e) => ({ ...e })),
  }));

  // ── Step 1: SUPPRESS (remove/cap based on avoid tags) ─────────────────
  for (const rule of SUPPRESSION_RULES) {
    if (!avoidTags.includes(rule.avoidTag)) continue;

    const affectedBlocks = rule.blockKeys.length > 0
      ? modified.filter((b) => rule.blockKeys.includes(b.key))
      : modified; // empty blockKeys = all blocks

    for (const block of affectedBlocks) {
      if (rule.action === 'remove') {
        const before = block.exercises.length;
        block.exercises = block.exercises.filter((ex) => {
          // Metadata filter takes priority when available
          if (rule.metadataFilter) {
            const meta = getExerciseMetadata(ex.name);
            if (matchesFilter(meta, rule.metadataFilter)) return false;
          }
          // Fall back to name pattern matching
          if (rule.namePatterns) {
            if (rule.namePatterns.some((pattern) => ex.name.includes(pattern))) return false;
          }
          return true;
        });
        const removed = before - block.exercises.length;
        if (removed > 0) {
          log.push(`SUPPRESS [${rule.avoidTag}]: Removed ${removed} exercise(s) from ${block.key} — ${rule.note}`);
          appliedSuppressions += removed;
        }
      }

      if (rule.action === 'cap' && rule.maxExercises != null) {
        if (block.exercises.length > rule.maxExercises) {
          const removed = block.exercises.length - rule.maxExercises;
          block.exercises = block.exercises.slice(0, rule.maxExercises);
          log.push(`SUPPRESS [${rule.avoidTag}]: Capped ${block.key} to ${rule.maxExercises} exercises (removed ${removed}) — ${rule.note}`);
          appliedSuppressions += removed;
        }
      }
    }
  }

  // ── Step 2: SWAP (replace exercises matching bias tags) ────────────────
  for (const rule of SWAP_RULES) {
    if (!biasTags.includes(rule.biasTag)) continue;

    for (const block of modified) {
      if (block.key !== rule.blockKey) continue;

      const idx = block.exercises.findIndex((ex) => ex.name.includes(rule.targetName));
      if (idx >= 0) {
        const oldName = block.exercises[idx].name;
        block.exercises[idx] = {
          ...rule.replacement,
          blockKey: block.key,
          isModified: true,
          modifiedBy: 'profile',
          modNote: `Swapped from "${oldName}" based on ${rule.biasTag} profile bias.`,
        };
        log.push(`SWAP [${rule.biasTag}]: "${oldName}" → "${rule.replacement.name}" in ${block.key}`);
        appliedSwaps++;
      }
    }
  }

  // ── Step 3: INJECT (add exercises matching bias tags) ──────────────────
  const injections = INJECTION_RULES.filter((r) => biasTags.includes(r.biasTag));

  // Sort by priority (lower = earlier in block)
  injections.sort((a, b) => a.priority - b.priority);

  for (const rule of injections) {
    const block = modified.find((b) => b.key === rule.blockKey);
    if (!block) continue;

    // Don't inject if block is already at max capacity
    if (block.exercises.length >= maxExercisesPerBlock) continue;

    // Don't inject if a similar exercise already exists
    const alreadyHas = block.exercises.some((ex) =>
      ex.name.toLowerCase().includes(rule.exercise.name.toLowerCase().split(' ')[0]),
    );
    if (alreadyHas) continue;

    block.exercises.push({
      ...rule.exercise,
      blockKey: block.key,
      isModified: true,
      modifiedBy: 'profile',
      modNote: `Added based on ${rule.biasTag} profile bias.`,
    });
    log.push(`INJECT [${rule.biasTag}]: "${rule.exercise.name}" added to ${block.key}`);
    appliedInjections++;
  }

  // ── Final phase cap ───────────────────────────────────────────────────
  for (const block of modified) {
    if (block.exercises.length > maxExercisesPerBlock) {
      block.exercises = block.exercises.slice(0, maxExercisesPerBlock);
    }
  }

  return {
    blocks: modified,
    appliedInjections,
    appliedSwaps,
    appliedSuppressions,
    log,
  };
}

/**
 * Collect all bias tags from a profile's programming bias arrays.
 */
export function collectBiasTags(profile: {
  prep_bias?: string[];
  plyo_bias?: string[];
  sprint_bias?: string[];
  strength_bias?: string[];
  accessory_bias?: string[];
  conditioning_bias?: string[];
  recovery_bias?: string[];
}): string[] {
  return [
    ...(profile.prep_bias ?? []),
    ...(profile.plyo_bias ?? []),
    ...(profile.sprint_bias ?? []),
    ...(profile.strength_bias ?? []),
    ...(profile.accessory_bias ?? []),
    ...(profile.conditioning_bias ?? []),
    ...(profile.recovery_bias ?? []),
  ];
}

/**
 * auditMetadata — Developer tooling for metadata governance.
 *
 * Reports:
 *   - exercises missing metadata (falling back to DEFAULT)
 *   - exercises with suspicious metadata combinations
 *   - generated sessions containing untagged exercises
 *   - registry coverage statistics
 *
 * Call auditSessionMetadata() after program generation to validate coverage.
 * Call auditRegistryCoverage() during development to check pattern gaps.
 */

import { getExerciseMetadata } from '../config/exerciseMetadataRegistry';
import { EXERCISE_METADATA_REGISTRY } from '../config/exerciseMetadataRegistry';
import { DEFAULT_METADATA } from '../types/exerciseMetadata';
import type { GeneratedBlock } from './applyProfileOverrides';

// ── Audit Result Types ──────────────────────────────────────────────────────

export interface MetadataAuditResult {
  totalExercises: number;
  taggedExercises: number;
  untaggedExercises: string[];
  coveragePercent: number;
  suspiciousCombinations: string[];
  registryPatternCount: number;
}

// ── Session Audit ───────────────────────────────────────────────────────────

/**
 * Audit a generated session's exercises for metadata coverage.
 * Logs warnings for untagged exercises in dev mode.
 */
export function auditSessionMetadata(
  blocks: GeneratedBlock[],
  logWarnings: boolean = __DEV__,
): MetadataAuditResult {
  const allExercises: string[] = [];
  const untagged: string[] = [];
  const suspicious: string[] = [];

  for (const block of blocks) {
    for (const ex of block.exercises) {
      allExercises.push(ex.name);
      const meta = getExerciseMetadata(ex.name);

      // Check if it fell back to DEFAULT
      if (meta === DEFAULT_METADATA) {
        untagged.push(ex.name);
      }

      // Suspicious: high fatigue exercise in a recovery/primer block
      if (
        (block.key === 'shoulder-durability' || block.key === 'sprint-cooldown') &&
        meta.fatigueCost >= 4
      ) {
        suspicious.push(`${ex.name} (fatigueCost ${meta.fatigueCost}) in ${block.key} block`);
      }

      // Suspicious: max_velocity exercise in a control-focused block
      if (
        block.key === 'rotational-core' &&
        meta.velocityType === 'max_velocity'
      ) {
        suspicious.push(`${ex.name} (max_velocity) in ${block.key} block`);
      }
    }
  }

  const result: MetadataAuditResult = {
    totalExercises: allExercises.length,
    taggedExercises: allExercises.length - untagged.length,
    untaggedExercises: untagged,
    coveragePercent: allExercises.length > 0
      ? Math.round(((allExercises.length - untagged.length) / allExercises.length) * 100)
      : 100,
    suspiciousCombinations: suspicious,
    registryPatternCount: EXERCISE_METADATA_REGISTRY.length,
  };

  if (logWarnings) {
    if (untagged.length > 0) {
      console.warn(`[metadata-audit] ${untagged.length} untagged exercises:`, untagged.slice(0, 5));
    }
    if (suspicious.length > 0) {
      console.warn(`[metadata-audit] ${suspicious.length} suspicious combinations:`, suspicious);
    }
    console.log(`[metadata-audit] Coverage: ${result.coveragePercent}% (${result.taggedExercises}/${result.totalExercises}), Registry: ${result.registryPatternCount} patterns`);
  }

  return result;
}

// ── Registry Coverage Audit ─────────────────────────────────────────────────

/**
 * Audit registry coverage against a list of exercise names from templates.
 * Use during development to find gaps.
 */
export function auditRegistryCoverage(exerciseNames: string[]): {
  covered: string[];
  uncovered: string[];
  coveragePercent: number;
} {
  const unique = [...new Set(exerciseNames)];
  const covered: string[] = [];
  const uncovered: string[] = [];

  for (const name of unique) {
    const meta = getExerciseMetadata(name);
    if (meta === DEFAULT_METADATA) {
      uncovered.push(name);
    } else {
      covered.push(name);
    }
  }

  return {
    covered,
    uncovered,
    coveragePercent: unique.length > 0
      ? Math.round((covered.length / unique.length) * 100)
      : 100,
  };
}

/**
 * Validate that an exercise's metadata makes sense.
 * Returns array of issues (empty = valid).
 */
export function validateExerciseMetadata(
  exerciseName: string,
): string[] {
  const meta = getExerciseMetadata(exerciseName);
  const issues: string[] = [];

  if (meta === DEFAULT_METADATA) {
    issues.push(`No metadata found for "${exerciseName}" — using DEFAULT`);
    return issues;
  }

  // High complexity should have high fatigue
  if (meta.complexityLevel >= 4 && meta.fatigueCost <= 1) {
    issues.push(`"${exerciseName}": complexity ${meta.complexityLevel} but fatigueCost only ${meta.fatigueCost}`);
  }

  // Recovery exercises should not have high fatigue
  if (meta.phaseRole === 'recovery' && meta.fatigueCost >= 3) {
    issues.push(`"${exerciseName}": recovery role but fatigueCost ${meta.fatigueCost}`);
  }

  // Max velocity exercises should not be complexity 1
  if (meta.velocityType === 'max_velocity' && meta.complexityLevel <= 1) {
    issues.push(`"${exerciseName}": max_velocity but complexity only ${meta.complexityLevel}`);
  }

  return issues;
}

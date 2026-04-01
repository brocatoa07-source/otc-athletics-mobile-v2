/**
 * validateStrengthProfile — Hard-fail validation for generated profiles.
 *
 * If any actionable output is missing, the profile is incomplete
 * and must NOT be saved. This prevents fake personalization.
 *
 * A profile that cannot change Daily Work, My Path, or programming
 * blocks is not useful enough to keep.
 */

import type { StrengthProfilePayload } from '../types/strengthProfile';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const VALID_ARCHETYPES = ['static', 'spring', 'hybrid'] as const;
const VALID_NEEDS = ['mobility', 'stability_control', 'strength', 'elasticity', 'speed_rotation'] as const;
const VALID_DAILY_WORK = ['mobility_access', 'position_control', 'strength_base', 'elastic_reactivity', 'speed_rotation'] as const;
const VALID_MY_PATH = ['own_positions', 'build_strength_base', 'build_elasticity', 'improve_acceleration', 'improve_rotation'] as const;

/**
 * Validate a generated strength profile payload.
 * Returns { valid: false, errors: [...] } if incomplete.
 */
export function validateStrengthProfile(payload: StrengthProfilePayload): ValidationResult {
  const errors: string[] = [];

  // Required identity fields
  if (!payload.primary_archetype || !VALID_ARCHETYPES.includes(payload.primary_archetype)) {
    errors.push(`Invalid primary_archetype: ${payload.primary_archetype}`);
  }
  if (!payload.secondary_need || !VALID_NEEDS.includes(payload.secondary_need)) {
    errors.push(`Invalid secondary_need: ${payload.secondary_need}`);
  }

  // Required routing fields
  if (!payload.daily_work_focus || !VALID_DAILY_WORK.includes(payload.daily_work_focus)) {
    errors.push(`Invalid daily_work_focus: ${payload.daily_work_focus}`);
  }
  if (!payload.my_path_start_point || !VALID_MY_PATH.includes(payload.my_path_start_point)) {
    errors.push(`Invalid my_path_start_point: ${payload.my_path_start_point}`);
  }

  // Required priority lists
  if (!payload.top_training_priorities || payload.top_training_priorities.length < 3) {
    errors.push(`top_training_priorities must have at least 3 items (got ${payload.top_training_priorities?.length ?? 0})`);
  }
  if (!payload.avoid_overemphasis || payload.avoid_overemphasis.length < 1) {
    errors.push('avoid_overemphasis must have at least 1 item');
  }

  // Required bias arrays — must be non-empty
  const requiredBiases: (keyof Pick<StrengthProfilePayload,
    'prep_bias' | 'plyo_bias' | 'sprint_bias' | 'strength_bias' | 'accessory_bias' | 'conditioning_bias'
  >)[] = ['prep_bias', 'plyo_bias', 'sprint_bias', 'strength_bias', 'accessory_bias', 'conditioning_bias'];

  for (const biasKey of requiredBiases) {
    const arr = payload[biasKey];
    if (!arr || arr.length === 0) {
      errors.push(`${biasKey} must not be empty`);
    }
  }

  // Confidence range
  if (typeof payload.archetype_confidence !== 'number' || payload.archetype_confidence < 0 || payload.archetype_confidence > 1) {
    errors.push(`archetype_confidence must be 0-1 (got ${payload.archetype_confidence})`);
  }

  return { valid: errors.length === 0, errors };
}

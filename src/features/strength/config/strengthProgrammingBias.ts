/**
 * Strength Programming Bias — Deterministic archetype + need → block override rules.
 *
 * Primary archetype sets the BASE bias (prep, plyo, sprint, strength, accessory, conditioning, recovery).
 * Secondary need MODIFIES the bias (adds emphasis, changes Daily Work + My Path, adds avoid rules).
 *
 * The archetype does NOT override the whole program.
 * The monthly phase still governs.
 * The profile only biases WITHIN the monthly system.
 */

import type {
  StrengthArchetype,
  StrengthNeed,
  ProgrammingBiases,
  DailyWorkFocus,
  MyPathStartPoint,
} from '../types/strengthProfile';

// ── Archetype Base Biases ───────────────────────────────────────────────────

export interface ArchetypeBiasConfig {
  biases: ProgrammingBiases;
  avoid_overemphasis: string[];
  programming_notes: string[];
  recommended_block_swaps: string[];
}

export const ARCHETYPE_BIAS: Record<StrengthArchetype, ArchetypeBiasConfig> = {
  static: {
    biases: {
      prep_bias: ['hip_ir_er_access', 'tspine_rotation', 'ankle_df', 'separation_access'],
      plyo_bias: ['elastic_reactive', 'extensive_contacts', 'pogo_progressions'],
      sprint_bias: ['max_velocity', 'dribbles', 'wickets', 'flying_sprints'],
      strength_bias: ['maintain_force_low_volume', 'speed_strength', 'contrast_work'],
      accessory_bias: ['mobility_ownership', 'selective_posterior_chain'],
      conditioning_bias: ['low_fatigue_speed_preserving'],
      recovery_bias: ['mobility_restoration', 'freshness', 'soft_tissue_recovery'],
    },
    avoid_overemphasis: ['heavy_eccentric_overload', 'excess_strength_volume'],
    programming_notes: [
      'Maintain force while improving elasticity and movement access.',
      'Avoid conditioning and grind volume that flatten speed quality.',
      'Layer elastic/reactive work on top of existing strength base.',
    ],
    recommended_block_swaps: [
      'Swap one heavy landing plyo slot for reactive ankle stiffness work.',
      'Swap one grind strength exposure for speed-strength contrast.',
    ],
  },

  spring: {
    biases: {
      prep_bias: ['position_ownership', 'rib_pelvis_control', 'scap_trunk_organization'],
      plyo_bias: ['controlled_landing', 'decel_stick', 'absorb_and_own'],
      sprint_bias: ['acceleration_resisted', 'short_bursts', 'decel_then_redirect'],
      strength_bias: ['max_strength', 'eccentric_strength', 'yielding_isometrics', 'overcoming_isometrics'],
      accessory_bias: ['posterior_chain', 'adductors', 'trunk_stiffness', 'unilateral_strength', 'scap_integrity'],
      conditioning_bias: ['controlled_field_work', 'sled_based_conditioning'],
      recovery_bias: ['tissue_capacity_support', 'position_recovery', 'lower_impact_repeat_work'],
    },
    avoid_overemphasis: ['excess_reactive_volume', 'too_much_max_velocity'],
    programming_notes: [
      'Build force and positional ownership before increasing chaos and top-end velocity.',
      'Do not let reactive work outpace tissue capacity.',
      'Prioritize eccentric and isometric strength to protect elastic system.',
    ],
    recommended_block_swaps: [
      'Swap one reactive plyo slot for landing/decel ownership.',
      'Bias main lift toward heavier bilateral force development.',
    ],
  },

  hybrid: {
    biases: {
      prep_bias: ['balanced_prep'],
      plyo_bias: ['balanced_plyo_exposure'],
      sprint_bias: ['balanced_accel_maxv'],
      strength_bias: ['balanced_strength_progression'],
      accessory_bias: ['secondary_need_driven'],
      conditioning_bias: ['phase_based'],
      recovery_bias: ['standard_phase_recovery'],
    },
    avoid_overemphasis: ['unnecessary_specialization'],
    programming_notes: [
      'Hybrid should never default to generic programming.',
      'Secondary need must drive emphasis and block selection.',
      'Keep core monthly structure, then bias using secondary need and top priorities.',
    ],
    recommended_block_swaps: [
      'Keep core monthly structure, then bias block selection using secondary need and top priorities.',
    ],
  },
};

// ── Secondary Need Overrides ────────────────────────────────────────────────

export interface NeedOverrideConfig {
  daily_work_focus: DailyWorkFocus;
  my_path_start_point: MyPathStartPoint;
  additional_biases: Partial<ProgrammingBiases>;
  additional_avoid: string[];
  additional_notes: string[];
}

export const NEED_OVERRIDE: Record<StrengthNeed, NeedOverrideConfig> = {
  mobility: {
    daily_work_focus: 'mobility_access',
    my_path_start_point: 'own_positions',
    additional_biases: {
      prep_bias: ['hip_ir_er_access', 'ankle_df_access', 'tspine_rotation_access', 'adductor_mobility', 'shoulder_access_reset'],
      accessory_bias: ['mobility_ownership'],
    },
    additional_avoid: ['loading_without_access'],
    additional_notes: [
      'Limited access is blocking usable positions. Restore access before chasing more output.',
      'Regress exercise depth/load until positions are owned.',
    ],
  },

  stability_control: {
    daily_work_focus: 'position_control',
    my_path_start_point: 'own_positions',
    additional_biases: {
      prep_bias: ['rib_pelvis_control', 'block_leg_control', 'scap_trunk_control'],
      accessory_bias: ['single_leg_control', 'anti_rotation', 'trunk_stiffness'],
    },
    additional_avoid: ['chaotic_reactive_work_without_control'],
    additional_notes: [
      'Force leaks are limiting transfer. Control must improve before chaos increases.',
      'Reduce chaotic/reactive options until ownership improves.',
    ],
  },

  strength: {
    daily_work_focus: 'strength_base',
    my_path_start_point: 'build_strength_base',
    additional_biases: {
      strength_bias: ['eccentric_loading', 'isometric_holds', 'posterior_chain_priority'],
      accessory_bias: ['unilateral_strength', 'trunk_strength'],
    },
    additional_avoid: ['hiding_weakness_behind_complexity'],
    additional_notes: [
      'Build base force first. Do not hide weakness behind complexity.',
      'Simpler progressions with higher load intent.',
    ],
  },

  elasticity: {
    daily_work_focus: 'elastic_reactivity',
    my_path_start_point: 'build_elasticity',
    additional_biases: {
      plyo_bias: ['pogos', 'rebound_work', 'stiffness_isos', 'line_hops'],
      sprint_bias: ['dribbles', 'maxv_rhythm'],
    },
    additional_avoid: ['excess_grind_volume'],
    additional_notes: [
      'Athlete needs better rebound, stiffness, and conversion of force into quickness.',
      'Keep strength, reduce grind. More tendon prep.',
    ],
  },

  speed_rotation: {
    daily_work_focus: 'speed_rotation',
    my_path_start_point: 'improve_acceleration',
    additional_biases: {
      sprint_bias: ['acceleration_mechanics', 'maxv_mechanics'],
      accessory_bias: ['separation_drills', 'medball_speed', 'anti_rotation_to_rotation'],
      conditioning_bias: ['low_fatigue_speed_preserving'],
    },
    additional_avoid: ['high_fatigue_conditioning'],
    additional_notes: [
      'Athlete has force or movement capacity but poor transfer to sprint and rotational outputs.',
      'Lower fatigue conditioning to preserve speed quality.',
    ],
  },
};

// ── Merge Logic ─────────────────────────────────────────────────────────────

/**
 * Merge archetype base biases with secondary need overrides.
 * Need overrides ADD to archetype biases (they don't replace).
 * Deduplicates array entries.
 */
export function mergeBiases(
  archetype: StrengthArchetype,
  need: StrengthNeed,
): {
  biases: ProgrammingBiases;
  avoid_overemphasis: string[];
  programming_notes: string[];
  recommended_block_swaps: string[];
  daily_work_focus: DailyWorkFocus;
  my_path_start_point: MyPathStartPoint;
} {
  const base = ARCHETYPE_BIAS[archetype];
  const override = NEED_OVERRIDE[need];

  const merged: ProgrammingBiases = { ...base.biases };

  // Merge additional biases from need override
  for (const [key, additions] of Object.entries(override.additional_biases)) {
    const biasKey = key as keyof ProgrammingBiases;
    if (additions && additions.length > 0) {
      merged[biasKey] = [...new Set([...merged[biasKey], ...additions])];
    }
  }

  return {
    biases: merged,
    avoid_overemphasis: [...new Set([...base.avoid_overemphasis, ...override.additional_avoid])],
    programming_notes: [...base.programming_notes, ...override.additional_notes],
    recommended_block_swaps: base.recommended_block_swaps,
    daily_work_focus: override.daily_work_focus,
    my_path_start_point: override.my_path_start_point,
  };
}

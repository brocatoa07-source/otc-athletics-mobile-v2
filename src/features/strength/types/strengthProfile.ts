/**
 * Strength Profile Domain Types
 *
 * Strict types for every field in the strength_profiles table
 * and every intermediate scoring/classification value.
 *
 * These types enforce the prescription engine contract:
 * Assessment → Archetype → Need → Priorities → Programming Overrides → Daily Work → My Path
 */

// ── Primary Archetypes ──────────────────────────────────────────────────────

export type StrengthArchetype = 'static' | 'spring' | 'hybrid';

// ── Secondary Needs ─────────────────────────────────────────────────────────

export type StrengthNeed =
  | 'mobility'
  | 'stability_control'
  | 'strength'
  | 'elasticity'
  | 'speed_rotation';

// ── Daily Work Focus ────────────────────────────────────────────────────────

export type DailyWorkFocus =
  | 'mobility_access'
  | 'position_control'
  | 'strength_base'
  | 'elastic_reactivity'
  | 'speed_rotation';

// ── My Path Start Point ─────────────────────────────────────────────────────

export type MyPathStartPoint =
  | 'own_positions'
  | 'build_strength_base'
  | 'build_elasticity'
  | 'improve_acceleration'
  | 'improve_rotation';

// ── Force / Control Bias ────────────────────────────────────────────────────

export type ForceBias = 'force_dominant' | 'elastic_dominant' | 'balanced';
export type ControlBias = 'stable' | 'leaky' | 'mixed';

// ── Programming Bias Arrays ─────────────────────────────────────────────────

export interface ProgrammingBiases {
  prep_bias: string[];
  plyo_bias: string[];
  sprint_bias: string[];
  strength_bias: string[];
  accessory_bias: string[];
  conditioning_bias: string[];
  recovery_bias: string[];
}

// ── Avoid Overemphasis ──────────────────────────────────────────────────────

export type AvoidOveremphasis = string[];

// ── Top Training Priorities ─────────────────────────────────────────────────

export type TopTrainingPriorities = [string, string, string, ...string[]];

// ── Raw Scores ──────────────────────────────────────────────────────────────

export interface ArchetypeScores {
  static: number;
  spring: number;
  hybrid: number;
}

export interface NeedScores {
  mobility: number;
  stability_control: number;
  strength: number;
  elasticity: number;
  speed_rotation: number;
}

// ── Full Strength Profile (matches DB row) ──────────────────────────────────

export interface StrengthProfile {
  id: string;
  user_id: string;
  version: string;

  primary_archetype: StrengthArchetype;
  archetype_confidence: number;

  secondary_need: StrengthNeed;

  force_bias: ForceBias;
  control_bias: ControlBias;

  // Raw individual scores
  mobility_score: number;
  stability_control_score: number;
  strength_score: number;
  elasticity_score: number;
  speed_rotation_score: number;

  static_score: number;
  spring_score: number;
  hybrid_score: number;

  top_training_priorities: string[];
  avoid_overemphasis: string[];

  daily_work_focus: DailyWorkFocus;
  my_path_start_point: MyPathStartPoint;

  prep_bias: string[];
  plyo_bias: string[];
  sprint_bias: string[];
  strength_bias: string[];
  accessory_bias: string[];
  conditioning_bias: string[];
  recovery_bias: string[];

  programming_notes: string[];
  recommended_block_swaps: string[];

  raw_need_scores: NeedScores;
  raw_archetype_scores: ArchetypeScores;

  generated_from_submission_id: string | null;
  generated_at: string;
  updated_at: string;
}

// ── Intermediate Build Result (before DB write) ─────────────────────────────

export type StrengthProfilePayload = Omit<StrengthProfile, 'id' | 'generated_at' | 'updated_at'>;

// ── Quiz Signal (scored from quiz answers) ──────────────────────────────────

export type ScoringSignal =
  // Archetype signals
  | 'strong_but_stiff'
  | 'poor_elasticity'
  | 'poor_max_velocity'
  | 'dead_off_ground'
  | 'limited_separation'
  | 'better_lift_outputs_than_jump_outputs'
  | 'bouncy_reactive'
  | 'poor_eccentric_control'
  | 'poor_deceleration'
  | 'weak_isometric_strength'
  | 'weak_max_strength'
  | 'poor_landing_ownership'
  | 'mixed_profile'
  | 'balanced_outputs'
  | 'no_clear_force_or_elastic_dominance'
  | 'moderate_across_all_buckets'
  // Need signals — mobility
  | 'hip_ir_limit'
  | 'ankle_df_limit'
  | 'tspine_limit'
  | 'shoulder_access_limit'
  // Need signals — stability_control
  | 'pelvis_control_limit'
  | 'block_leg_instability'
  | 'single_leg_control_limit'
  | 'scap_trunk_leak'
  // Need signals — strength
  | 'low_base_strength'
  | 'weak_posterior_chain'
  | 'low_eccentric_strength'
  // Need signals — elasticity
  | 'poor_rsi'
  | 'poor_rebound_quality'
  | 'poor_stiffness'
  // Need signals — speed_rotation
  | 'weak_acceleration'
  | 'poor_rotation_transfer'
  | 'poor_separation'
  | 'poor_max_velocity_transfer';

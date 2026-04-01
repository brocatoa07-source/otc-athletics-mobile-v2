/**
 * Assessment Signal Map — Maps each quiz answer to ScoringSignal[].
 *
 * The lifting-mover quiz has 20 questions with 4 options each.
 * Each option (a/b/c/d) produces 1-3 scoring signals that feed
 * the prescription engine.
 *
 * This replaces the old "tally mover types" approach with a
 * real signal-based assessment where individual answers map to
 * specific strength/need signals.
 *
 * Index: questionIndex → letterIndex → ScoringSignal[]
 */

import type { ScoringSignal } from '../types/strengthProfile';

/**
 * For each of the 20 questions, each answer option (a/b/c/d)
 * maps to a set of scoring signals.
 */
export const ANSWER_SIGNAL_MAP: Record<string, ScoringSignal[]>[] = [
  // Q1: Heavy back squat ascent
  {
    a: ['strong_but_stiff', 'better_lift_outputs_than_jump_outputs'],
    b: ['bouncy_reactive', 'poor_eccentric_control'],
    c: ['mixed_profile'],
    d: ['balanced_outputs'],
  },
  // Q2: Sprint stride pattern
  {
    a: ['strong_but_stiff', 'poor_max_velocity'],
    b: ['bouncy_reactive', 'poor_stiffness'],
    c: ['mixed_profile'],
    d: ['moderate_across_all_buckets'],
  },
  // Q3: Jump loading pattern
  {
    a: ['strong_but_stiff', 'dead_off_ground'],
    b: ['bouncy_reactive', 'poor_rsi'],
    c: ['no_clear_force_or_elastic_dominance'],
    d: ['balanced_outputs'],
  },
  // Q4: Most natural movement
  {
    a: ['strong_but_stiff', 'better_lift_outputs_than_jump_outputs'],
    b: ['bouncy_reactive'],
    c: ['mixed_profile'],
    d: ['moderate_across_all_buckets'],
  },
  // Q5: Recovery after sprint/jump
  {
    a: ['strong_but_stiff', 'poor_elasticity'],
    b: ['bouncy_reactive'],
    c: ['mixed_profile'],
    d: ['balanced_outputs'],
  },
  // Q6: Balance / single-leg control (inferred)
  {
    a: ['strong_but_stiff', 'single_leg_control_limit'],
    b: ['bouncy_reactive', 'poor_landing_ownership'],
    c: ['pelvis_control_limit'],
    d: ['mixed_profile'],
  },
  // Q7: Stiffness / reactivity feel
  {
    a: ['poor_elasticity', 'dead_off_ground'],
    b: ['bouncy_reactive', 'poor_rebound_quality'],
    c: ['mixed_profile'],
    d: ['moderate_across_all_buckets'],
  },
  // Q8: Eccentric control
  {
    a: ['strong_but_stiff'],
    b: ['poor_eccentric_control', 'weak_isometric_strength'],
    c: ['low_eccentric_strength'],
    d: ['mixed_profile'],
  },
  // Q9: Deceleration ability
  {
    a: ['strong_but_stiff', 'limited_separation'],
    b: ['poor_deceleration', 'poor_landing_ownership'],
    c: ['block_leg_instability'],
    d: ['balanced_outputs'],
  },
  // Q10: Mobility / range of motion
  {
    a: ['hip_ir_limit', 'ankle_df_limit'],
    b: ['tspine_limit', 'shoulder_access_limit'],
    c: ['hip_ir_limit', 'tspine_limit'],
    d: ['mixed_profile'],
  },
  // Q11: Core / trunk control
  {
    a: ['scap_trunk_leak', 'pelvis_control_limit'],
    b: ['bouncy_reactive', 'scap_trunk_leak'],
    c: ['mixed_profile'],
    d: ['moderate_across_all_buckets'],
  },
  // Q12: Max strength capacity
  {
    a: ['better_lift_outputs_than_jump_outputs'],
    b: ['weak_max_strength', 'low_base_strength'],
    c: ['mixed_profile'],
    d: ['weak_posterior_chain'],
  },
  // Q13: Acceleration / first step
  {
    a: ['strong_but_stiff', 'poor_max_velocity_transfer'],
    b: ['bouncy_reactive', 'weak_acceleration'],
    c: ['mixed_profile'],
    d: ['poor_separation', 'weak_acceleration'],
  },
  // Q14: Rotational power / med ball
  {
    a: ['strong_but_stiff', 'limited_separation'],
    b: ['bouncy_reactive', 'poor_rotation_transfer'],
    c: ['poor_rotation_transfer', 'poor_separation'],
    d: ['mixed_profile'],
  },
  // Q15: Landing ownership
  {
    a: ['strong_but_stiff'],
    b: ['poor_landing_ownership', 'poor_deceleration'],
    c: ['block_leg_instability'],
    d: ['mixed_profile'],
  },
  // Q16: Conditioning / work capacity
  {
    a: ['strong_but_stiff', 'poor_elasticity'],
    b: ['bouncy_reactive'],
    c: ['mixed_profile'],
    d: ['moderate_across_all_buckets'],
  },
  // Q17: Plyometric response
  {
    a: ['dead_off_ground', 'poor_rsi'],
    b: ['bouncy_reactive', 'poor_rebound_quality'],
    c: ['poor_stiffness'],
    d: ['mixed_profile'],
  },
  // Q18: Isometric / hold capacity
  {
    a: ['strong_but_stiff'],
    b: ['weak_isometric_strength', 'poor_eccentric_control'],
    c: ['low_base_strength'],
    d: ['mixed_profile'],
  },
  // Q19: Speed expression
  {
    a: ['poor_max_velocity', 'poor_max_velocity_transfer'],
    b: ['bouncy_reactive', 'weak_max_strength'],
    c: ['poor_separation', 'poor_rotation_transfer'],
    d: ['mixed_profile'],
  },
  // Q20: Ideal training style
  {
    a: ['strong_but_stiff', 'better_lift_outputs_than_jump_outputs'],
    b: ['bouncy_reactive'],
    c: ['mixed_profile', 'no_clear_force_or_elastic_dominance'],
    d: ['moderate_across_all_buckets'],
  },
];

/**
 * Convert quiz answers into scoring signals.
 * Each answer letter maps to 1-3 signals per question.
 */
export function answersToSignals(answers: ('a' | 'b' | 'c' | 'd')[]): ScoringSignal[] {
  const signals: ScoringSignal[] = [];

  for (let i = 0; i < answers.length && i < ANSWER_SIGNAL_MAP.length; i++) {
    const questionMap = ANSWER_SIGNAL_MAP[i];
    const letter = answers[i];
    const questionSignals = questionMap[letter];
    if (questionSignals) {
      signals.push(...questionSignals);
    }
  }

  return signals;
}

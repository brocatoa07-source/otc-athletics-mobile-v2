/**
 * Strength Scoring Matrix — Deterministic signal → score mapping.
 *
 * Layer A: Signal → Archetype scores (static / spring / hybrid)
 * Layer B: Signal → Need scores (mobility / stability / strength / elasticity / speed_rotation)
 *
 * Each quiz answer produces 1+ scoring signals.
 * Each signal maps to weighted contributions across archetypes and needs.
 * Totals determine classification.
 */

import type { ScoringSignal, ArchetypeScores, NeedScores } from '../types/strengthProfile';

// ── Signal Weights ──────────────────────────────────────────────────────────

interface SignalWeight {
  archetype: Partial<ArchetypeScores>;
  need: Partial<NeedScores>;
}

/**
 * Deterministic scoring matrix.
 * Every signal maps to weighted archetype and need contributions.
 */
export const SCORING_MATRIX: Record<ScoringSignal, SignalWeight> = {
  // ── ARCHETYPE: Static indicators ──────────────────────────────────────────
  strong_but_stiff: {
    archetype: { static: 3, hybrid: 1 },
    need: { mobility: 1, elasticity: 2 },
  },
  poor_elasticity: {
    archetype: { static: 3 },
    need: { elasticity: 3 },
  },
  poor_max_velocity: {
    archetype: { static: 2 },
    need: { speed_rotation: 2, elasticity: 1 },
  },
  dead_off_ground: {
    archetype: { static: 2 },
    need: { elasticity: 3 },
  },
  limited_separation: {
    archetype: { static: 2 },
    need: { mobility: 1, speed_rotation: 2 },
  },
  better_lift_outputs_than_jump_outputs: {
    archetype: { static: 3 },
    need: { elasticity: 2, speed_rotation: 1 },
  },

  // ── ARCHETYPE: Spring indicators ──────────────────────────────────────────
  bouncy_reactive: {
    archetype: { spring: 3, hybrid: 1 },
    need: { strength: 1 },
  },
  poor_eccentric_control: {
    archetype: { spring: 2 },
    need: { strength: 2, stability_control: 2 },
  },
  poor_deceleration: {
    archetype: { spring: 2 },
    need: { stability_control: 2, strength: 1 },
  },
  weak_isometric_strength: {
    archetype: { spring: 2 },
    need: { strength: 3 },
  },
  weak_max_strength: {
    archetype: { spring: 2 },
    need: { strength: 3 },
  },
  poor_landing_ownership: {
    archetype: { spring: 2 },
    need: { stability_control: 3, strength: 1 },
  },

  // ── ARCHETYPE: Hybrid indicators ──────────────────────────────────────────
  mixed_profile: {
    archetype: { hybrid: 3 },
    need: {},
  },
  balanced_outputs: {
    archetype: { hybrid: 3 },
    need: {},
  },
  no_clear_force_or_elastic_dominance: {
    archetype: { hybrid: 3 },
    need: {},
  },
  moderate_across_all_buckets: {
    archetype: { hybrid: 2, static: 1, spring: 1 },
    need: {},
  },

  // ── NEED: Mobility signals ────────────────────────────────────────────────
  hip_ir_limit: {
    archetype: { static: 1 },
    need: { mobility: 3 },
  },
  ankle_df_limit: {
    archetype: { static: 1 },
    need: { mobility: 3 },
  },
  tspine_limit: {
    archetype: { static: 1 },
    need: { mobility: 3 },
  },
  shoulder_access_limit: {
    archetype: {},
    need: { mobility: 3 },
  },

  // ── NEED: Stability / Control signals ─────────────────────────────────────
  pelvis_control_limit: {
    archetype: {},
    need: { stability_control: 3 },
  },
  block_leg_instability: {
    archetype: { spring: 1 },
    need: { stability_control: 3 },
  },
  single_leg_control_limit: {
    archetype: {},
    need: { stability_control: 3 },
  },
  scap_trunk_leak: {
    archetype: {},
    need: { stability_control: 3 },
  },

  // ── NEED: Strength signals ────────────────────────────────────────────────
  low_base_strength: {
    archetype: { spring: 1 },
    need: { strength: 3 },
  },
  weak_posterior_chain: {
    archetype: {},
    need: { strength: 3 },
  },
  low_eccentric_strength: {
    archetype: { spring: 1 },
    need: { strength: 3, stability_control: 1 },
  },

  // ── NEED: Elasticity signals ──────────────────────────────────────────────
  poor_rsi: {
    archetype: { static: 1 },
    need: { elasticity: 3 },
  },
  poor_rebound_quality: {
    archetype: { static: 1 },
    need: { elasticity: 3 },
  },
  poor_stiffness: {
    archetype: { static: 1 },
    need: { elasticity: 3 },
  },

  // ── NEED: Speed / Rotation signals ────────────────────────────────────────
  weak_acceleration: {
    archetype: {},
    need: { speed_rotation: 3 },
  },
  poor_rotation_transfer: {
    archetype: {},
    need: { speed_rotation: 3 },
  },
  poor_separation: {
    archetype: { static: 1 },
    need: { speed_rotation: 2, mobility: 1 },
  },
  poor_max_velocity_transfer: {
    archetype: { static: 1 },
    need: { speed_rotation: 3 },
  },
};

// ── Score Computation ────────────────────────────────────────────────────────

/**
 * Compute archetype and need scores from a list of scoring signals.
 */
export function computeScores(signals: ScoringSignal[]): {
  archetypeScores: ArchetypeScores;
  needScores: NeedScores;
} {
  const archetypeScores: ArchetypeScores = { static: 0, spring: 0, hybrid: 0 };
  const needScores: NeedScores = {
    mobility: 0, stability_control: 0, strength: 0, elasticity: 0, speed_rotation: 0,
  };

  for (const signal of signals) {
    const weight = SCORING_MATRIX[signal];
    if (!weight) continue;

    // Accumulate archetype scores
    for (const [key, val] of Object.entries(weight.archetype)) {
      archetypeScores[key as keyof ArchetypeScores] += val ?? 0;
    }

    // Accumulate need scores
    for (const [key, val] of Object.entries(weight.need)) {
      needScores[key as keyof NeedScores] += val ?? 0;
    }
  }

  return { archetypeScores, needScores };
}

/**
 * buildStrengthProfile — Prescription engine.
 *
 * Receives normalized quiz signals and submission ID.
 * Computes archetype scores, need scores, top priorities.
 * Derives force_bias, control_bias, avoid_overemphasis.
 * Derives daily_work_focus, my_path_start_point.
 * Derives all programming bias arrays.
 * Validates output — hard-fails if incomplete.
 *
 * Decision chain:
 * Assessment data → primary archetype → secondary need → top 3 priorities
 * → programming overrides → Daily Work focus → My Path starting lane
 */

import type {
  ScoringSignal,
  StrengthArchetype,
  StrengthNeed,
  ForceBias,
  ControlBias,
  StrengthProfilePayload,
  NeedScores,
  ArchetypeScores,
} from '../types/strengthProfile';
import { computeScores } from '../config/strengthScoringMatrix';
import { mergeBiases } from '../config/strengthProgrammingBias';
import { validateStrengthProfile } from './validateStrengthProfile';

// ── Priority categories for top-3 derivation ────────────────────────────────

const PRIORITY_LABELS: Record<string, string> = {
  mobility: 'Improve movement access',
  stability_control: 'Build positional control',
  strength: 'Build base strength',
  elasticity: 'Develop elastic qualities',
  speed_rotation: 'Improve speed and rotation transfer',
};

// ── Build Result ────────────────────────────────────────────────────────────

export interface BuildResult {
  success: boolean;
  payload?: StrengthProfilePayload;
  errors?: string[];
}

// ── Main Build Function ─────────────────────────────────────────────────────

export function buildStrengthProfile(
  signals: ScoringSignal[],
  userId: string,
  submissionId: string | null,
): BuildResult {
  console.log('[buildStrengthProfile] START — signals:', signals.length);

  // ── Layer A: Archetype scoring ────────────────────────────────────────────
  const { archetypeScores, needScores } = computeScores(signals);

  console.log('[buildStrengthProfile] Archetype scores:', archetypeScores);
  console.log('[buildStrengthProfile] Need scores:', needScores);

  // ── Classify primary archetype ────────────────────────────────────────────
  const primary_archetype = classifyArchetype(archetypeScores);
  const totalArchetype = archetypeScores.static + archetypeScores.spring + archetypeScores.hybrid;
  const archetype_confidence = totalArchetype > 0
    ? Math.round((archetypeScores[primary_archetype] / totalArchetype) * 100) / 100
    : 0.33;

  console.log('[buildStrengthProfile] Primary archetype:', primary_archetype, 'confidence:', archetype_confidence);

  // ── Layer B: Need scoring — classify secondary need ───────────────────────
  const secondary_need = classifyNeed(needScores);

  console.log('[buildStrengthProfile] Secondary need:', secondary_need);

  // ── Layer C: Priority derivation — top 3 ──────────────────────────────────
  const top_training_priorities = deriveTopPriorities(needScores);

  console.log('[buildStrengthProfile] Top priorities:', top_training_priorities);

  // ── Derive force_bias and control_bias ─────────────────────────────────────
  const force_bias = deriveForceBias(primary_archetype, needScores);
  const control_bias = deriveControlBias(needScores);

  // ── Merge programming biases ──────────────────────────────────────────────
  const merged = mergeBiases(primary_archetype, secondary_need);

  // ── Build payload ─────────────────────────────────────────────────────────
  const payload: StrengthProfilePayload = {
    user_id: userId,
    version: 'v1',

    primary_archetype,
    archetype_confidence,
    secondary_need,
    force_bias,
    control_bias,

    // Individual scores
    mobility_score: needScores.mobility,
    stability_control_score: needScores.stability_control,
    strength_score: needScores.strength,
    elasticity_score: needScores.elasticity,
    speed_rotation_score: needScores.speed_rotation,

    static_score: archetypeScores.static,
    spring_score: archetypeScores.spring,
    hybrid_score: archetypeScores.hybrid,

    top_training_priorities,
    avoid_overemphasis: merged.avoid_overemphasis,

    daily_work_focus: merged.daily_work_focus,
    my_path_start_point: merged.my_path_start_point,

    ...merged.biases,

    programming_notes: merged.programming_notes,
    recommended_block_swaps: merged.recommended_block_swaps,

    raw_need_scores: needScores,
    raw_archetype_scores: archetypeScores,

    generated_from_submission_id: submissionId,
  };

  // ── Validate ──────────────────────────────────────────────────────────────
  const validation = validateStrengthProfile(payload);
  if (!validation.valid) {
    console.error('[buildStrengthProfile] VALIDATION FAILED:', validation.errors);
    return { success: false, errors: validation.errors };
  }

  console.log('[buildStrengthProfile] COMPLETE — archetype:', primary_archetype,
    'need:', secondary_need, 'daily_work:', merged.daily_work_focus, 'my_path:', merged.my_path_start_point);

  return { success: true, payload };
}

// ── Classification Helpers ──────────────────────────────────────────────────

function classifyArchetype(scores: ArchetypeScores): StrengthArchetype {
  const { static: s, spring: sp, hybrid: h } = scores;
  if (s >= sp && s >= h) return 'static';
  if (sp >= s && sp >= h) return 'spring';
  return 'hybrid';
}

function classifyNeed(scores: NeedScores): StrengthNeed {
  const entries = Object.entries(scores) as [StrengthNeed, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function deriveTopPriorities(scores: NeedScores): string[] {
  const entries = Object.entries(scores) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  // Take top 3 (or all if fewer)
  return entries.slice(0, Math.max(3, entries.length))
    .map(([key]) => PRIORITY_LABELS[key] ?? key);
}

function deriveForceBias(archetype: StrengthArchetype, needs: NeedScores): ForceBias {
  if (archetype === 'static') return 'force_dominant';
  if (archetype === 'spring') return 'elastic_dominant';
  // Hybrid — check if strength need is significantly higher than elasticity
  if (needs.strength > needs.elasticity + 3) return 'force_dominant';
  if (needs.elasticity > needs.strength + 3) return 'elastic_dominant';
  return 'balanced';
}

function deriveControlBias(needs: NeedScores): ControlBias {
  const controlScore = needs.stability_control;
  if (controlScore >= 6) return 'leaky';
  if (controlScore >= 3) return 'mixed';
  return 'stable';
}

/* ────────────────────────────────────────────────
 * OTC RECOMMENDATION ENGINE — STRENGTH LAYER
 *
 * Vault-specific scoring configuration and item
 * mapping for the Strength system.
 *
 * This file provides the architecture for Strength
 * Vault integration. The catalog and identity types
 * are placeholders until the Strength Vault data
 * files are built out.
 *
 * USAGE:
 * When the Strength Vault catalog is ready, populate
 * STRENGTH_CATALOG with RecommendableItem entries
 * (or write an adapter like hittingRecommendationLayer
 * does for DrillMeta → RecommendableItem).
 * ──────────────────────────────────────────────── */

import type {
  RecommendableItem,
  VaultScoringConfig,
  ScoringInput,
  RecommendationStack,
  FlatRecommendation,
  ItemRole,
  Difficulty,
} from './recommendationTypes';
import {
  rankItems,
  pickTop,
  filterRecent,
  flattenStack,
  buildStack,
  getDayIndex,
  DEFAULT_SCORING_CONFIG,
} from './recommendationUtils';

/* ─── Strength identity types (placeholder) ────── */

/**
 * Placeholder athlete profiles for strength.
 * Replace with real profiles once the Strength Vault
 * identity system is designed.
 */
export type StrengthProfile =
  | 'speed_athlete'
  | 'power_athlete'
  | 'stability_athlete'
  | 'hybrid_athlete';

/* ─── Strength scoring config ──────────────────── */

/**
 * Strength prioritizes constraint + goal match equally
 * with heavy fatigue penalty (strength training has
 * real recovery cost).
 */
export const STRENGTH_SCORING_CONFIG: VaultScoringConfig = {
  ...DEFAULT_SCORING_CONFIG,
  constraintMatchWeight: 4,  // high — address movement deficiencies
  goalMatchWeight: 4,        // high — build athletic outcomes
  identityMatchWeight: 2,    // moderate — profile fit
  roleFitWeight: 1,
  difficultyFitWeight: 2,    // matters more — progression is key
  repetitionPenalty: -5,
  fatiguePenalty: -5,         // high — strength has real recovery cost
  baseScore: 10,
};

/* ─── Strength catalog (placeholder) ───────────── */

/**
 * Placeholder catalog. When the Strength Vault data
 * files are built, populate this with real items or
 * write an adapter function (like drillMetaToItem).
 */
const STRENGTH_CATALOG: RecommendableItem[] = [];

/**
 * Get the full strength item catalog in universal format.
 */
export function getStrengthCatalog(): RecommendableItem[] {
  return STRENGTH_CATALOG;
}

/* ─── Strength recommendation engine ───────────── */

export interface StrengthRecommendationInput {
  /** Movement deficiencies or weaknesses to address */
  activeConstraints: string[];
  /** Training goals (e.g. 'rotational-power', 'hip-mobility') */
  activeGoals: string[];
  /** Athlete's strength profile */
  strengthProfile: StrengthProfile | null;
  /** Athlete's current level */
  difficulty: Difficulty;
  /** Recently completed exercises (names or IDs) */
  recentExercises: string[];
  /** Whether the athlete is fatigued / in a deload phase */
  fatigueBudgetLow: boolean;
}

/**
 * Generate strength recommendations using the shared
 * scoring architecture.
 *
 * Returns a RecommendationStack:
 *   - 2 primary exercises
 *   - 1 support/accessory exercise
 *   - 1 optional reset/mobility exercise
 */
export function getStrengthRecommendations(
  input: StrengthRecommendationInput,
): RecommendationStack {
  const dayIndex = getDayIndex();
  const recentSet = new Set(input.recentExercises);
  const exclude = new Set<string>();

  // Filter catalog to non-reset items matching constraints
  const primaryPool = filterRecent(
    STRENGTH_CATALOG.filter(
      (item) =>
        item.constraints.some((c) => input.activeConstraints.includes(c)) &&
        !item.roles.includes('reset'),
    ),
    recentSet,
  );

  // Support pool: goal-matching items not in primary pool constraints
  const supportPool = filterRecent(
    STRENGTH_CATALOG.filter(
      (item) =>
        item.goals.some((g) => input.activeGoals.includes(g)) &&
        !item.roles.includes('reset'),
    ),
    recentSet,
  );

  // Build scoring input
  const scoringInput: ScoringInput = {
    activeConstraints: input.activeConstraints,
    activeGoals: input.activeGoals,
    identityKeys: input.strengthProfile ? [input.strengthProfile] : [],
    preferredRole: 'primary',
    difficultyFit: input.difficulty,
    recentItems: recentSet,
    dayIndex,
    fatigueBudgetLow: input.fatigueBudgetLow,
  };

  // Rank and pick primary (2 exercises)
  const rankedPrimary = rankItems(primaryPool, scoringInput, STRENGTH_SCORING_CONFIG);
  const primary = pickTop(rankedPrimary, 2, exclude);

  // Rank and pick support (1 exercise)
  const supportScoringInput = { ...scoringInput, preferredRole: 'support' as ItemRole };
  const rankedSupport = rankItems(supportPool, supportScoringInput, STRENGTH_SCORING_CONFIG);
  const support = pickTop(rankedSupport, 1, exclude);

  // Optional reset/mobility exercise
  const optional: RecommendableItem[] = [];
  const resetPool = STRENGTH_CATALOG.filter(
    (item) => item.roles.includes('reset') && !exclude.has(item.name),
  );
  if (resetPool.length > 0) {
    const resetScoringInput = { ...scoringInput, preferredRole: 'reset' as ItemRole };
    const rankedReset = rankItems(resetPool, resetScoringInput, STRENGTH_SCORING_CONFIG);
    const resets = pickTop(rankedReset, 1, exclude);
    optional.push(...resets);
  }

  return buildStack('strength', primary, support, optional);
}

/**
 * Convenience: flatten strength recommendations.
 */
export function flattenStrengthRecommendations(
  input: StrengthRecommendationInput,
): FlatRecommendation[] {
  return flattenStack(getStrengthRecommendations(input));
}

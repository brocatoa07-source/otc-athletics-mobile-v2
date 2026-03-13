/* ────────────────────────────────────────────────
 * OTC RECOMMENDATION ENGINE — SHARED UTILITIES
 *
 * Vault-agnostic scoring, ranking, and filtering
 * functions. Every vault-specific engine delegates
 * to these utilities.
 *
 * The scoring model is:
 *
 *   score =
 *     + constraint match   (issue the item solves)
 *     + goal match         (outcome the item builds)
 *     + identity match     (profile affinity)
 *     + role fit           (primary/support/reset)
 *     + difficulty fit     (beginner/intermediate/advanced)
 *     + day rotation       (deterministic daily variety)
 *     - repetition penalty (recently used items)
 *     - fatigue penalty    (high-cost items when budget is low)
 *
 * Each vault provides a VaultScoringConfig to weight
 * these factors differently.
 * ──────────────────────────────────────────────── */

import type {
  RecommendableItem,
  ScoredItem,
  ScoringInput,
  VaultScoringConfig,
  ItemRole,
  FlatRecommendation,
  RecommendationStack,
  Vault,
} from './recommendationTypes';

/* ─── Day index (deterministic per day) ──────────── */

/**
 * Returns a day-based index for deterministic rotation.
 * Same value all day, changes at midnight UTC.
 */
export function getDayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

/* ─── Default scoring config ─────────────────────── */

/**
 * Reasonable defaults. Vaults override what they need.
 */
export const DEFAULT_SCORING_CONFIG: VaultScoringConfig = {
  constraintMatchWeight: 4,
  goalMatchWeight: 3,
  identityMatchWeight: 3,
  roleFitWeight: 1,
  difficultyFitWeight: 1,
  repetitionPenalty: -5,
  fatiguePenalty: -3,
  baseScore: 10,
};

/* ─── Core scoring function ──────────────────────── */

/**
 * Score a single item against the current context.
 * Returns a ScoredItem with the total score and
 * a breakdown of contributing factors.
 */
export function scoreItem<T extends RecommendableItem>(
  item: T,
  input: ScoringInput,
  config: VaultScoringConfig,
  poolIndex: number,
  poolSize: number,
): ScoredItem<T> {
  let constraintMatch = 0;
  let goalMatch = 0;
  let identityMatch = 0;
  let roleFit = 0;
  let difficultyFit = 0;
  let repetitionPenalty = 0;
  let fatiguePenalty = 0;
  let dayRotation = 0;

  // ── Constraint match ──────────────────────────
  // How many of the item's constraints overlap with active constraints
  const constraintOverlap = item.constraints.filter(
    (c) => input.activeConstraints.includes(c),
  ).length;
  if (constraintOverlap > 0) {
    constraintMatch = constraintOverlap * config.constraintMatchWeight;
  }

  // ── Goal match ────────────────────────────────
  const goalOverlap = item.goals.filter(
    (g) => input.activeGoals.includes(g),
  ).length;
  if (goalOverlap > 0) {
    goalMatch = goalOverlap * config.goalMatchWeight;
  }

  // ── Identity / profile match ──────────────────
  const identityOverlap = item.identityAffinity.filter(
    (id) => input.identityKeys.includes(id),
  ).length;
  if (identityOverlap > 0) {
    identityMatch = identityOverlap * config.identityMatchWeight;
  }

  // ── Role fit ──────────────────────────────────
  if (item.roles.includes(input.preferredRole)) {
    roleFit = config.roleFitWeight;
  }

  // ── Difficulty fit ────────────────────────────
  if (item.difficulty === input.difficultyFit) {
    difficultyFit = config.difficultyFitWeight;
  }

  // ── Day-based rotation ────────────────────────
  if (poolSize > 0 && poolIndex === input.dayIndex % poolSize) {
    dayRotation = 1;
  }

  // ── Repetition penalty ────────────────────────
  if (input.recentItems.has(item.name) || input.recentItems.has(item.id)) {
    repetitionPenalty = config.repetitionPenalty;
  }

  // ── Fatigue penalty ───────────────────────────
  if (input.fatigueBudgetLow && item.fatigueCost === 'high') {
    fatiguePenalty = config.fatiguePenalty;
  }

  const score =
    config.baseScore +
    constraintMatch +
    goalMatch +
    identityMatch +
    roleFit +
    difficultyFit +
    dayRotation +
    repetitionPenalty +
    fatiguePenalty;

  return {
    item,
    score,
    factors: {
      constraintMatch,
      goalMatch,
      identityMatch,
      roleFit,
      difficultyFit,
      repetitionPenalty,
      fatiguePenalty,
      dayRotation,
    },
  };
}

/* ─── Rank a pool of items ───────────────────────── */

/**
 * Score and sort a pool of items.
 * Returns items sorted by score descending.
 */
export function rankItems<T extends RecommendableItem>(
  pool: T[],
  input: ScoringInput,
  config: VaultScoringConfig,
): ScoredItem<T>[] {
  return pool
    .map((item, idx) => scoreItem(item, input, config, idx, pool.length))
    .sort((a, b) => b.score - a.score);
}

/* ─── Pick top N unique items ────────────────────── */

/**
 * Pick the top N items from a ranked pool,
 * avoiding items already in the `exclude` set.
 */
export function pickTop<T extends RecommendableItem>(
  ranked: ScoredItem<T>[],
  count: number,
  exclude: Set<string>,
): T[] {
  const result: T[] = [];
  for (const scored of ranked) {
    if (result.length >= count) break;
    const key = scored.item.id || scored.item.name;
    if (!exclude.has(key) && !exclude.has(scored.item.name)) {
      result.push(scored.item);
      exclude.add(key);
      exclude.add(scored.item.name);
    }
  }
  return result;
}

/* ─── Filter recently used ───────────────────────── */

/**
 * Remove recently used items from a pool.
 * Falls back to the full pool if filtering
 * would leave it empty.
 */
export function filterRecent<T extends RecommendableItem>(
  pool: T[],
  recentItems: Set<string>,
): T[] {
  const filtered = pool.filter(
    (item) => !recentItems.has(item.name) && !recentItems.has(item.id),
  );
  return filtered.length > 0 ? filtered : pool;
}

/* ─── Build flat recommendation list ─────────────── */

/**
 * Convert a RecommendationStack into a flat list
 * with role assignments.
 */
export function flattenStack(stack: RecommendationStack): FlatRecommendation[] {
  const result: FlatRecommendation[] = [];

  for (const item of stack.primary) {
    result.push({
      id: item.id,
      name: item.name,
      vault: stack.vault,
      role: 'primary',
      item,
    });
  }

  for (const item of stack.support) {
    result.push({
      id: item.id,
      name: item.name,
      vault: stack.vault,
      role: 'support',
      item,
    });
  }

  for (const item of stack.optional) {
    result.push({
      id: item.id,
      name: item.name,
      vault: stack.vault,
      role: item.roles.includes('reset') ? 'reset'
        : item.roles.includes('reflection') ? 'reflection'
        : 'support',
      item,
    });
  }

  return result;
}

/* ─── Pool filtering by constraint ───────────────── */

/**
 * Filter a catalog to items matching at least one
 * of the given constraints.
 */
export function filterByConstraints<T extends RecommendableItem>(
  catalog: T[],
  constraints: string[],
): T[] {
  return catalog.filter(
    (item) => item.constraints.some((c) => constraints.includes(c)),
  );
}

/**
 * Filter a catalog to items matching at least one
 * of the given goals.
 */
export function filterByGoals<T extends RecommendableItem>(
  catalog: T[],
  goals: string[],
): T[] {
  return catalog.filter(
    (item) => item.goals.some((g) => goals.includes(g)),
  );
}

/* ─── Fatigue budget helper ──────────────────────── */

const FATIGUE_VALUES: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * Calculate total fatigue cost for a set of items.
 */
export function totalFatigueCost(items: RecommendableItem[]): number {
  return items.reduce(
    (sum, item) => sum + (FATIGUE_VALUES[item.fatigueCost] ?? 1),
    0,
  );
}

/* ─── Build recommendation stack helper ──────────── */

/**
 * Convenience: build a RecommendationStack from
 * pre-picked arrays.
 */
export function buildStack(
  vault: Vault,
  primary: RecommendableItem[],
  support: RecommendableItem[],
  optional: RecommendableItem[],
): RecommendationStack {
  return { vault, primary, support, optional };
}

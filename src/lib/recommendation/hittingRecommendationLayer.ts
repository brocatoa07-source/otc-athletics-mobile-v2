/* ────────────────────────────────────────────────
 * OTC RECOMMENDATION ENGINE — HITTING LAYER
 *
 * Vault-specific scoring configuration and item
 * mapping for the Hitting system.
 *
 * This file bridges the existing drill catalog
 * into the universal RecommendableItem schema and
 * provides hitting-specific scoring weights.
 *
 * MIGRATION PATH:
 * Current consumers import from drillRecommendationEngine.ts.
 * When ready to migrate, consumers switch to importing
 * from this file instead. Both coexist during transition.
 * ──────────────────────────────────────────────── */

import type {
  RecommendableItem,
  VaultScoringConfig,
  ScoringInput,
  RecommendationStack,
  FlatRecommendation,
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
import type { MechanicalIssue } from '@/data/hitting-mechanical-diagnostic-data';
import type { MoverType } from '@/data/hitting-mover-type-data';
import { DRILL_CATALOG, type DrillMeta } from '@/data/drill-catalog';
import { ISSUE_TO_QUICKFIX } from '@/data/quick-fix-data';

/* ─── Hitting scoring config ─────────────────────── */

/**
 * Hitting prioritizes constraint match (fix the issue)
 * with moderate goal and identity weighting.
 */
export const HITTING_SCORING_CONFIG: VaultScoringConfig = {
  ...DEFAULT_SCORING_CONFIG,
  constraintMatchWeight: 5,  // highest — fix the problem first
  goalMatchWeight: 3,        // medium — build toward outcomes
  identityMatchWeight: 3,    // medium — mover type affinity
  roleFitWeight: 1,
  difficultyFitWeight: 1,
  repetitionPenalty: -5,
  fatiguePenalty: -2,
  baseScore: 10,
};

/* ─── Map existing DrillMeta → RecommendableItem ─── */

/**
 * Convert a DrillMeta entry from the existing catalog
 * into a universal RecommendableItem.
 *
 * This mapping preserves all existing data while
 * adding the universal fields.
 */
export function drillMetaToItem(drill: DrillMeta): RecommendableItem {
  return {
    id: drill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: drill.name,
    vault: 'hitting',
    difficulty: drill.ageGroup === 'youth' ? 'beginner' : 'intermediate',

    // Map existing "issues" to constraints
    goals: mapIssuesToGoals(drill.issues),
    constraints: drill.issues,
    identityAffinity: drill.moverAffinity,

    // Map existing roles directly
    roles: drill.roles.map((r) => {
      if (r === 'foundation') return 'reset';
      return r;
    }) as RecommendableItem['roles'],

    fatigueCost: drill.roles.includes('reset') ? 'low' : 'medium',
    frequencyLimit: 'daily',
    ageGroup: drill.ageGroup,
  };
}

/**
 * Map quick-fix issue keys to positive hitting goals.
 */
function mapIssuesToGoals(issues: string[]): string[] {
  const goalMap: Record<string, string> = {
    late: 'timing',
    lunging: 'posture',
    stuck: 'direction',
    'pulling-off': 'posture',
    casting: 'barrel-turn',
    'rolling-over': 'extension',
    'barrel-path': 'barrel-turn',
    'inconsistent-contact': 'hard-contact',
  };

  const goals = new Set<string>();
  for (const issue of issues) {
    const goal = goalMap[issue];
    if (goal) goals.add(goal);
  }
  return Array.from(goals);
}

/* ─── Converted catalog (built once at import) ───── */

const _hittingItems: RecommendableItem[] = DRILL_CATALOG.map(drillMetaToItem);

/**
 * Get the full hitting item catalog in universal format.
 */
export function getHittingCatalog(): RecommendableItem[] {
  return _hittingItems;
}

/* ─── Hitting recommendation engine ──────────────── */

export interface HittingRecommendationInput {
  primaryIssue: MechanicalIssue;
  secondaryIssue: MechanicalIssue;
  moverType: MoverType | null;
  age: number | null;
  recentDrills: string[];
}

/**
 * Generate hitting recommendations using the shared
 * scoring architecture.
 *
 * Returns a RecommendationStack:
 *   - 2 primary fix drills
 *   - 1 secondary support drill
 *   - 1 optional reset/foundation drill (youth or unstable)
 */
export function getHittingRecommendations(
  input: HittingRecommendationInput,
): RecommendationStack {
  const dayIndex = getDayIndex();
  const recentSet = new Set(input.recentDrills);
  const exclude = new Set<string>();

  const primaryKey = ISSUE_TO_QUICKFIX[input.primaryIssue];
  const secondaryKey = ISSUE_TO_QUICKFIX[input.secondaryIssue];

  // Filter catalog to items matching primary constraint
  const primaryPool = filterRecent(
    _hittingItems.filter((item) => item.constraints.includes(primaryKey)),
    recentSet,
  );

  // Filter catalog to items matching secondary constraint
  const secondaryPool = filterRecent(
    _hittingItems.filter((item) =>
      item.constraints.includes(secondaryKey) &&
      !item.constraints.includes(primaryKey),
    ),
    recentSet,
  );

  // Build scoring input
  const isYouth = input.age !== null && input.age <= 14;
  const difficultyFit: Difficulty = isYouth ? 'beginner' : 'intermediate';

  const scoringInput: ScoringInput = {
    activeConstraints: [primaryKey, secondaryKey],
    activeGoals: [],
    identityKeys: input.moverType ? [input.moverType] : [],
    preferredRole: 'primary',
    difficultyFit,
    recentItems: recentSet,
    dayIndex,
    fatigueBudgetLow: false,
  };

  // Rank and pick primary (2 drills)
  const rankedPrimary = rankItems(primaryPool, scoringInput, HITTING_SCORING_CONFIG);
  const primary = pickTop(rankedPrimary, 2, exclude);

  // Rank and pick secondary (1 drill)
  const secondaryScoringInput = { ...scoringInput, preferredRole: 'support' as const };
  const rankedSecondary = rankItems(secondaryPool, secondaryScoringInput, HITTING_SCORING_CONFIG);
  const support = pickTop(rankedSecondary, 1, exclude);

  // Optional reset for youth or unstable patterns
  const optional: RecommendableItem[] = [];
  if (isYouth || input.primaryIssue === input.secondaryIssue) {
    const resetPool = _hittingItems.filter(
      (item) => item.roles.includes('reset') && !exclude.has(item.name),
    );
    const resetScoringInput = { ...scoringInput, preferredRole: 'reset' as const };
    const rankedReset = rankItems(resetPool, resetScoringInput, HITTING_SCORING_CONFIG);
    const resets = pickTop(rankedReset, 1, exclude);
    optional.push(...resets);
  }

  return buildStack('hitting', primary, support, optional);
}

/**
 * Convenience: flatten hitting recommendations.
 */
export function flattenHittingRecommendations(
  input: HittingRecommendationInput,
): FlatRecommendation[] {
  return flattenStack(getHittingRecommendations(input));
}

/* ─── Identity affinity mapping reference ────────── */

/**
 * How hitting mover types map to identityAffinity keys:
 *
 * torque_engine          → 'torque_engine'
 * ground_force           → 'ground_force'
 * linear_momentum        → 'linear_momentum'
 * elastic                → 'elastic'
 * compact_rotational     → 'compact_rotational'
 * explosive_quick_twitch → 'explosive_quick_twitch'
 *
 * Shortened keys for the universal schema:
 * torque, ground_force, linear, elastic, compact, quick_twitch
 *
 * The drill catalog currently uses full mover type slugs.
 * The identityAffinity field accepts both formats.
 */

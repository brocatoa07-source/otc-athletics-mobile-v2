/* ────────────────────────────────────────────────
 * OTC RECOMMENDATION ENGINE — MENTAL LAYER
 *
 * Vault-specific scoring configuration and item
 * mapping for the Mental system.
 *
 * This file bridges the existing mental tool catalog
 * into the universal RecommendableItem schema and
 * provides mental-specific scoring weights.
 *
 * MIGRATION PATH:
 * Current consumers import from mentalRecommendationEngine.ts.
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
  ItemRole,
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
import type { MentalStruggle } from '@/data/mental-struggles-data';
import type { MentalProfile } from '@/data/mental-profile-data';
import {
  MENTAL_TOOL_CATALOG,
  STRUGGLE_TO_QUICKFIX,
  type MentalToolMeta,
} from '@/data/mental-tool-catalog';

/* ─── Mental scoring config ──────────────────────── */

/**
 * Mental prioritizes goal match (build outcomes)
 * with moderate constraint and identity weighting.
 */
export const MENTAL_SCORING_CONFIG: VaultScoringConfig = {
  ...DEFAULT_SCORING_CONFIG,
  constraintMatchWeight: 3,  // medium — address the struggle
  goalMatchWeight: 5,        // highest — build mental skills
  identityMatchWeight: 3,    // medium — profile fit
  roleFitWeight: 1,
  difficultyFitWeight: 0,    // mental tools are difficulty-agnostic
  repetitionPenalty: -5,
  fatiguePenalty: -1,         // low — mental tools have low physical cost
  baseScore: 10,
};

/* ─── Map existing MentalToolMeta → RecommendableItem */

/**
 * Convert a MentalToolMeta entry from the existing catalog
 * into a universal RecommendableItem.
 */
export function mentalToolToItem(tool: MentalToolMeta): RecommendableItem {
  return {
    id: tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: tool.name,
    vault: 'mental',
    difficulty: 'intermediate',

    // Map existing "issues" to constraints (struggles they address)
    goals: mapIssuesToGoals(tool.issues),
    constraints: tool.issues,
    identityAffinity: tool.profileAffinity,

    // Map existing roles
    roles: tool.roles as ItemRole[],

    fatigueCost: 'low',
    frequencyLimit: 'daily',
  };
}

/**
 * Map mental quick-fix issue keys to positive mental goals.
 */
function mapIssuesToGoals(issues: string[]): string[] {
  const goalMap: Record<string, string> = {
    overthinking: 'focus',
    'pregame-nerves': 'routine',
    'confidence-drop': 'confidence',
    'emotional-frustration': 'emotional-regulation',
    'focus-loss': 'focus',
    'fear-of-failure': 'resilience',
    burnout: 'reset',
    'imposter-syndrome': 'identity',
  };

  const goals = new Set<string>();
  for (const issue of issues) {
    const goal = goalMap[issue];
    if (goal) goals.add(goal);
  }
  return Array.from(goals);
}

/* ─── Converted catalog (built once at import) ───── */

const _mentalItems: RecommendableItem[] = MENTAL_TOOL_CATALOG.map(mentalToolToItem);

/**
 * Get the full mental item catalog in universal format.
 */
export function getMentalCatalog(): RecommendableItem[] {
  return _mentalItems;
}

/* ─── Mental recommendation engine ───────────────── */

export interface MentalRecommendationInput {
  primaryStruggle: MentalStruggle;
  secondaryStruggle: MentalStruggle;
  mentalProfile: MentalProfile | null;
  recentTools: string[];
}

/**
 * Generate mental recommendations using the shared
 * scoring architecture.
 *
 * Returns a RecommendationStack:
 *   - 2 primary tools
 *   - 1 secondary support tool
 *   - 1 optional reflection prompt
 */
export function getMentalRecommendations(
  input: MentalRecommendationInput,
): RecommendationStack {
  const dayIndex = getDayIndex();
  const recentSet = new Set(input.recentTools);
  const exclude = new Set<string>();

  const primaryKey = STRUGGLE_TO_QUICKFIX[input.primaryStruggle];
  const secondaryKey = STRUGGLE_TO_QUICKFIX[input.secondaryStruggle];

  // Filter catalog to non-reflection items matching primary constraint
  const primaryPool = filterRecent(
    _mentalItems.filter(
      (item) => item.constraints.includes(primaryKey) && !item.roles.includes('reflection'),
    ),
    recentSet,
  );

  // Filter for secondary
  const secondaryPool = filterRecent(
    _mentalItems.filter(
      (item) =>
        item.constraints.includes(secondaryKey) &&
        !item.constraints.includes(primaryKey) &&
        !item.roles.includes('reflection'),
    ),
    recentSet,
  );

  // Build scoring input
  const scoringInput: ScoringInput = {
    activeConstraints: [primaryKey, secondaryKey],
    activeGoals: [],
    identityKeys: input.mentalProfile ? [input.mentalProfile] : [],
    preferredRole: 'primary',
    difficultyFit: 'intermediate',
    recentItems: recentSet,
    dayIndex,
    fatigueBudgetLow: false,
  };

  // Rank and pick primary (2 tools)
  const rankedPrimary = rankItems(primaryPool, scoringInput, MENTAL_SCORING_CONFIG);
  const primary = pickTop(rankedPrimary, 2, exclude);

  // Rank and pick secondary (1 tool)
  const secondaryScoringInput = { ...scoringInput, preferredRole: 'support' as const };
  const rankedSecondary = rankItems(secondaryPool, secondaryScoringInput, MENTAL_SCORING_CONFIG);
  const support = pickTop(rankedSecondary, 1, exclude);

  // Optional reflection
  const optional: RecommendableItem[] = [];
  const reflectionPool = _mentalItems.filter(
    (item) => item.roles.includes('reflection') && !exclude.has(item.name),
  );
  if (reflectionPool.length > 0) {
    const reflectionScoringInput = { ...scoringInput, preferredRole: 'reflection' as const };
    const rankedReflection = rankItems(reflectionPool, reflectionScoringInput, MENTAL_SCORING_CONFIG);
    const reflections = pickTop(rankedReflection, 1, exclude);
    optional.push(...reflections);
  }

  return buildStack('mental', primary, support, optional);
}

/**
 * Convenience: flatten mental recommendations.
 */
export function flattenMentalRecommendations(
  input: MentalRecommendationInput,
): FlatRecommendation[] {
  return flattenStack(getMentalRecommendations(input));
}

/* ─── Identity affinity mapping reference ────────── */

/**
 * How mental profiles map to identityAffinity keys:
 *
 * competitor          → 'competitor'
 * analyzer            → 'analyzer'
 * emotionally_reactive → 'emotionally_reactive'
 * steady_performer    → 'steady_performer'
 *
 * The mental tool catalog uses these directly as
 * profileAffinity values.
 */

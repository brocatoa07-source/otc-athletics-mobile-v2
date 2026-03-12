/**
 * Tier-based content access rules.
 *
 * Centralizes which Daily Work item types and feature depths
 * are available at each tier. Easy to extend when Mental and
 * Strength vaults mature.
 *
 * ── Tier ladder ──────────────────────────────────────
 *   WALK      → hitting only, limited troubleshooting
 *   SINGLE    → full hitting
 *   DOUBLE    → + mental (when ready)
 *   TRIPLE    → + strength (when ready)
 *   HOME_RUN  → everything
 *   COACH     → everything
 */

import type { CanonicalTier } from '@/hooks/useTier';
import type { DailyWorkItem } from '@/data/daily-work';

/* ─── Allowed Daily Work item types per tier ──────── */

type ItemType = DailyWorkItem['type'];

const TIER_ALLOWED_TYPES: Record<CanonicalTier | 'COACH', Set<ItemType>> = {
  WALK:     new Set(['hitting', 'foundation', 'challenge']),
  SINGLE:   new Set(['hitting', 'foundation', 'challenge']),
  DOUBLE:   new Set(['hitting', 'foundation', 'challenge', 'mental']),
  TRIPLE:   new Set(['hitting', 'foundation', 'challenge', 'mental', 'strength']),
  HOME_RUN: new Set(['hitting', 'foundation', 'challenge', 'mental', 'strength']),
  COACH:    new Set(['hitting', 'foundation', 'challenge', 'mental', 'strength']),
};

/**
 * Filter Daily Work items to only those the tier can access.
 */
export function filterDailyWorkItems(
  items: DailyWorkItem[],
  tier: CanonicalTier,
  isCoach: boolean,
): DailyWorkItem[] {
  const key = isCoach ? 'COACH' : tier;
  const allowed = TIER_ALLOWED_TYPES[key];
  return items.filter((item) => allowed.has(item.type));
}

/**
 * Get list of item types locked for this tier (for upgrade messaging).
 */
export function getLockedTypes(
  tier: CanonicalTier,
  isCoach: boolean,
): ItemType[] {
  if (isCoach) return [];
  const allowed = TIER_ALLOWED_TYPES[tier];
  const all: ItemType[] = ['hitting', 'foundation', 'strength', 'mental', 'challenge'];
  return all.filter((t) => !allowed.has(t));
}

/* ─── Troubleshooting access ─────────────────────── */

/**
 * Walk tier sees a preview of troubleshooting (issues + why only).
 * Single+ sees full troubleshooting with all drill recommendations.
 */
export function hasTroubleshootingPreviewOnly(
  tier: CanonicalTier,
  isCoach: boolean,
): boolean {
  return !isCoach && tier === 'WALK';
}

/** Max drills shown in troubleshooting for Walk preview. */
export const WALK_TROUBLESHOOTING_DRILL_LIMIT = 2;

/* ─── My Path access ─────────────────────────────── */

// My Path is available to all tiers (awareness + diagnostics).
// No filtering needed — it shows hitting-only content.

/* ─── Upgrade messaging helpers ──────────────────── */

const TIER_UPGRADE_TARGET: Partial<Record<CanonicalTier, string>> = {
  WALK: 'Single',
  SINGLE: 'Double',
  DOUBLE: 'Triple',
  TRIPLE: 'Home Run',
};

export function getUpgradeTargetLabel(tier: CanonicalTier): string | null {
  return TIER_UPGRADE_TARGET[tier] ?? null;
}

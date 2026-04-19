/**
 * Stripe configuration — maps app tiers to Stripe Price IDs.
 *
 * Price IDs are set in .env and loaded at build time via Expo.
 * In test mode, use Stripe Dashboard → Products → copy price_xxx IDs.
 */

import type { AthleteTier } from '@/types/database';

/** Tiers that can be purchased via Stripe */
export type PurchasableTier = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'HOME_RUN';

/** Stripe publishable key (for future Stripe SDK usage) */
export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

/** Whether the current tier can be upgraded to the target tier */
export function canUpgradeTo(current: AthleteTier, target: PurchasableTier): boolean {
  const rank: Record<string, number> = {
    WALK: 0, SINGLE: 1, DOUBLE: 2, TRIPLE: 3, HOME_RUN: 4, GRAND_SLAM: 5,
  };
  return rank[target] > rank[current];
}

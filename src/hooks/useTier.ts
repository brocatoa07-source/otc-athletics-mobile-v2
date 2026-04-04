import { useAuthStore } from '@/store/auth.store';
import type { AthleteTier } from '@/types/database';
import { useDevTierOverride } from '@/lib/dev-tier-override';

export type CanonicalTier = AthleteTier;

/**
 * In v2, the DB only stores canonical tier values.
 * This normalize function exists as a safety net for any edge cases.
 */
function normalize(raw: string | null | undefined): CanonicalTier {
  switch (raw) {
    case 'SINGLE':
      return 'SINGLE';
    case 'DOUBLE':
      return 'DOUBLE';
    case 'TRIPLE':
      return 'TRIPLE';
    case 'HOME_RUN':
      return 'HOME_RUN';
    case 'GRAND_SLAM':
      return 'GRAND_SLAM';
    default:
      return 'WALK';
  }
}

export function useTier() {
  const athlete = useAuthStore((s) => s.athlete);
  const coach = useAuthStore((s) => s.coach);
  const devTierOverride = useDevTierOverride();

  const isCoach = !!coach;

  // DEV override: when active, use the overridden tier instead of the real one
  const tier: CanonicalTier = devTierOverride ?? normalize(athlete?.tier);

  // Tier booleans
  const isWalk    = !isCoach && tier === 'WALK';
  const isSingle  = !isCoach && tier === 'SINGLE';
  const isDouble  = !isCoach && tier === 'DOUBLE';
  const isTriple  = !isCoach && tier === 'TRIPLE';
  const isHomeRun = !isCoach && tier === 'HOME_RUN';
  const isGrandSlam = !isCoach && tier === 'GRAND_SLAM';

  // ── Hitting Vault ──────────────────────────────────
  const hasLimitedHitting = isWalk;
  const hasFullHitting = isCoach || isSingle || isDouble || isTriple || isHomeRun || isGrandSlam;

  // ── Lifting Vault ──────────────────────────────────
  const hasLimitedLifting = isSingle || isDouble;
  const hasFullLifting = isCoach || isTriple || isHomeRun || isGrandSlam;

  // ── Mental Vault ───────────────────────────────────
  const hasLimitedMental = isSingle;
  const hasFullMental = isCoach || isDouble || isTriple || isHomeRun || isGrandSlam;

  // ── Guided Program ─────────────────────────────────
  const hasGuidedProgram = isCoach || isGrandSlam;

  // ── Coach's Corner ────────────────────────────────
  const hasCoachesCorner = isCoach || isSingle || isDouble || isTriple || isHomeRun || isGrandSlam;

  // ── 1-on-1 Coaching ──
  const hasCoaching = isCoach || isGrandSlam;

  // ── Messaging ─────────────────────────────────────
  const canMessage = isCoach || isDouble || isTriple || isHomeRun || isGrandSlam;
  const hasUnlimitedMessaging = isCoach || isDouble || isTriple || isHomeRun || isGrandSlam;

  return {
    isCoach,
    tier,

    // Tier booleans
    isWalk,
    isSingle,
    isDouble,
    isTriple,
    isHomeRun,
    isGrandSlam,

    // Content access
    hasLimitedHitting,
    hasFullHitting,
    hasLimitedLifting,
    hasFullLifting,
    hasLimitedMental,
    hasFullMental,
    hasCoachesCorner,
    hasGuidedProgram,
    hasCoaching,

    // Messaging
    canMessage,
    hasUnlimitedMessaging,
  };
}

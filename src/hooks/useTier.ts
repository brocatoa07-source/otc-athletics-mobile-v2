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

  // ── Hitting Vault ──────────────────────────────────
  // Walk: limited (intro drills only), Single+: complete
  const hasLimitedHitting = isWalk;
  const hasFullHitting = isCoach || isSingle || isDouble || isTriple || isHomeRun;

  // ── Lifting Vault ──────────────────────────────────
  // Walk: none, Single: limited preview, Double: limited preview, Triple+: complete
  const hasLimitedLifting = isSingle || isDouble;
  const hasFullLifting = isCoach || isTriple || isHomeRun;

  // ── Mental Vault ───────────────────────────────────
  // Walk: none, Single: limited (preview), Double+: complete
  const hasLimitedMental = isSingle;
  const hasFullMental = isCoach || isDouble || isTriple || isHomeRun;

  // ── Guided Program ─────────────────────────────────
  // Home Run only: full guided lifting + hitting + mental system
  const hasGuidedProgram = isCoach || isHomeRun;

  // ── Coach's Corner ────────────────────────────────
  const hasCoachesCorner = isCoach || isSingle || isDouble || isTriple || isHomeRun;

  // ── 1-on-1 Coaching (inquire through app, delivered outside) ──
  const hasCoaching = isCoach || isHomeRun;

  // ── Messaging ─────────────────────────────────────
  // Double, Triple, Home Run can DM coach. Walk + Single cannot.
  const canMessage = isCoach || isDouble || isTriple || isHomeRun;
  const hasUnlimitedMessaging = isCoach || isDouble || isTriple || isHomeRun;

  return {
    isCoach,
    tier,

    // Tier booleans
    isWalk,
    isSingle,
    isDouble,
    isTriple,
    isHomeRun,

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

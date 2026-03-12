import { useAuthStore } from '@/store/auth.store';
import type { AthleteTier } from '@/types/database';

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

  const isCoach = !!coach;
  const tier: CanonicalTier = normalize(athlete?.tier);

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
  // Walk: none, Single: limited, Double+: complete
  const hasLimitedLifting = isSingle;
  const hasFullLifting = isCoach || isDouble || isTriple || isHomeRun;

  // ── Mental Vault ───────────────────────────────────
  // Walk+Single: none, Double: limited, Triple+: complete
  const hasLimitedMental = isDouble;
  const hasFullMental = isCoach || isTriple || isHomeRun;

  // ── Guided Program ─────────────────────────────────
  // Home Run only: full guided lifting + hitting + mental system
  const hasGuidedProgram = isCoach || isHomeRun;

  // ── Coach's Corner ────────────────────────────────
  const hasCoachesCorner = isCoach || isSingle || isDouble || isTriple || isHomeRun;

  // ── 1-on-1 Coaching ───────────────────────────────
  const hasCoaching = isCoach || isHomeRun;

  // ── Messaging ─────────────────────────────────────
  // Direct messaging is Home Run only (+ coaches)
  const canMessage = isCoach || isHomeRun;
  const hasUnlimitedMessaging = isCoach || isHomeRun;

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

/**
 * Canonical Diagnostic Constants
 *
 * Single source of truth for all vault_type and diagnostic_type values.
 * Every quiz screen, service, and hook must reference these constants
 * instead of using raw strings.
 *
 * These values must exactly match the Supabase CHECK constraint on
 * diagnostic_submissions(vault_type, diagnostic_type).
 *
 * NOTE: Hitting vault has NO diagnostics (problem-first system).
 */

// ── Vault Types ─────────────────────────────────────────────────────────────

export const VAULT = {
  MENTAL: 'mental' as const,
  HITTING: 'hitting' as const,
  SC: 'sc' as const,
};

// ── Diagnostic Types ────────────────────────────────────────────────────────

export const DIAGNOSTIC = {
  // Mental vault (3 diagnostics → mental_profiles)
  ARCHETYPE: 'archetype' as const,
  IDENTITY: 'identity' as const,
  HABITS: 'habits' as const,

  // SC (Lifting) vault (1 diagnostic → strength_profiles)
  LIFTING_MOVER: 'lifting-mover' as const,
};

// ── Valid (vault, diagnostic) pairs ─────────────────────────────────────────

export const CANONICAL_PAIRS = [
  { vault: VAULT.MENTAL, diagnostic: DIAGNOSTIC.ARCHETYPE },
  { vault: VAULT.MENTAL, diagnostic: DIAGNOSTIC.IDENTITY },
  { vault: VAULT.MENTAL, diagnostic: DIAGNOSTIC.HABITS },
  { vault: VAULT.SC, diagnostic: DIAGNOSTIC.LIFTING_MOVER },
] as const;

// ── React Query Keys ────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  gateState: (userId: string) => ['gate-state', userId] as const,
  mentalProfile: (userId: string) => ['mental-profile', userId] as const,
  mentalSubmissions: (userId: string) => ['diagnostic-submissions-mental', userId] as const,
  strengthProfile: (userId: string) => ['strength-profile', userId] as const,
  diagnosticResult: (vault: string, diagnostic: string, userId: string) =>
    ['diagnostic-result', vault, diagnostic, userId] as const,
};

// ── AsyncStorage Cache Keys ─────────────────────────────────────────────────

export const CACHE_KEYS = {
  mentalProfileScores: 'otc:mental-profile-scores',
  mentalStruggles: 'otc:mental-struggles',
  mentalDailyWork: 'otc:mental-daily-work',
  liftingMoverType: 'otc:lifting-mover-type',
  strengthProfile: 'otc:strength-profile',
};

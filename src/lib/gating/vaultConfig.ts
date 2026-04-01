/**
 * Centralized vault diagnostic requirements.
 *
 * Each vault lists the diagnostics that must be completed to unlock it.
 * Vault unlock state is DERIVED from diagnostic_submissions records —
 * a vault is unlocked when ALL its required diagnostics have a submission row.
 *
 * NOTE: Hitting vault has NO diagnostics. It is problem-first.
 */

export type VaultType = 'mental' | 'hitting' | 'sc';

/**
 * Canonical diagnostic key type.
 * Every diagnostic_submissions.diagnostic_type value MUST be one of these.
 * If you add a new diagnostic, add it here first.
 *
 * NOTE: Hitting diagnostics (mover-type, mechanical) have been removed.
 * Hitting vault is now problem-first with no diagnostic gating.
 */
export type DiagnosticKey =
  | 'archetype'
  | 'identity'
  | 'habits'
  | 'lifting-mover';

/** Mental-only subset of DiagnosticKey. Used by mental quiz screens and scoring. */
export type MentalDiagnosticKey = Extract<DiagnosticKey, 'archetype' | 'identity' | 'habits'>;

/**
 * All valid (vault_type, diagnostic_type) pairs.
 */
export const CANONICAL_PAIRS: readonly { vault: VaultType; diagnostic: DiagnosticKey }[] = [
  { vault: 'mental', diagnostic: 'archetype' },
  { vault: 'mental', diagnostic: 'identity' },
  { vault: 'mental', diagnostic: 'habits' },
  { vault: 'sc', diagnostic: 'lifting-mover' },
] as const;

export interface DiagnosticRequirement {
  diagnosticType: DiagnosticKey;
  label: string;
  description: string;
}

export interface VaultConfig {
  vaultType: VaultType;
  label: string;
  requirements: DiagnosticRequirement[];
}

/**
 * The canonical list of vaults and their required diagnostics.
 * Adding a new diagnostic here is the ONLY change needed to extend gating.
 */
export const VAULT_CONFIGS: Record<VaultType, VaultConfig> = {
  mental: {
    vaultType: 'mental',
    label: 'Mental Vault',
    requirements: [
      {
        diagnosticType: 'archetype',
        label: 'Competitive Archetype',
        description: 'How you compete under pressure',
      },
      {
        diagnosticType: 'identity',
        label: 'Identity Alignment',
        description: 'How you see yourself as a player',
      },
      {
        diagnosticType: 'habits',
        label: 'Mental Habits',
        description: 'Your daily mental patterns',
      },
    ],
  },
  hitting: {
    vaultType: 'hitting',
    label: 'Hitting Vault',
    // No diagnostics — vault is problem-first. Troubleshooting is the main feature.
    requirements: [],
  },
  sc: {
    vaultType: 'sc',
    label: 'Lifting Vault',
    requirements: [
      {
        diagnosticType: 'lifting-mover',
        label: 'OTC Athletic Profile Assessment',
        description: 'Your strength expression style',
      },
    ],
  },
};

/** All vault types in display order */
export const VAULT_TYPES: VaultType[] = ['mental', 'hitting', 'sc'];

/**
 * Optional (bonus) diagnostics that appear in checklists but do NOT gate vault unlock.
 * NOTE: Hitting vault no longer has any diagnostics (optional or required).
 */
export const OPTIONAL_DIAGNOSTICS: Record<VaultType, DiagnosticRequirement[]> = {
  mental: [],
  hitting: [],
  sc: [],
};

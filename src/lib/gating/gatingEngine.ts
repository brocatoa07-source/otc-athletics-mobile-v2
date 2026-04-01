/**
 * Gating Engine — derives vault unlock state from diagnostic_submissions.
 *
 * Single source of truth: the `diagnostic_submissions` table.
 * A vault is unlocked when ALL its required diagnostics have a submission row.
 *
 * NOTE: Hitting vault has NO diagnostics — it is always unlocked (empty requirements).
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { VAULT_CONFIGS, type VaultType, type DiagnosticKey } from './vaultConfig';
import type { DiagnosticSubmission } from './diagnosticService';
import { fetchUserSubmissions } from './diagnosticService';

export interface GateState {
  mentalUnlocked: boolean;
  scUnlocked: boolean;
  hittingUnlocked: boolean;
  myPathUnlocked: boolean;
  mentalDiagnosticsComplete: boolean;
  mental: {
    archetypeDone: boolean;
    identityDone: boolean;
    habitsDone: boolean;
    completedCount: number;
    total: number;
  };
  sc: { moverDone: boolean };
}

const MENTAL_TOTAL = VAULT_CONFIGS.mental.requirements.length;

export const LOCKED_GATE_STATE: GateState = {
  mentalUnlocked: false,
  scUnlocked: false,
  hittingUnlocked: false,
  myPathUnlocked: false,
  mentalDiagnosticsComplete: false,
  mental: { archetypeDone: false, identityDone: false, habitsDone: false, completedCount: 0, total: MENTAL_TOTAL },
  sc: { moverDone: false },
};

function isVaultUnlocked(
  vaultType: VaultType,
  submissions: DiagnosticSubmission[],
): boolean {
  const config = VAULT_CONFIGS[vaultType];
  const vaultSubs = submissions.filter((s) => s.vault_type === vaultType);
  const completedTypes = new Set(vaultSubs.map((s) => s.diagnostic_type));
  return config.requirements.every((req) => completedTypes.has(req.diagnosticType));
}

function isDiagnosticDone(
  vaultType: VaultType,
  diagnosticType: DiagnosticKey,
  submissions: DiagnosticSubmission[],
): boolean {
  return submissions.some(
    (s) => s.vault_type === vaultType && s.diagnostic_type === diagnosticType,
  );
}

/**
 * Single source of truth for vault unlock + per-diagnostic completion.
 * Reads ONLY from diagnostic_submissions — no boolean columns elsewhere.
 */
export async function getGateState(
  supabase: SupabaseClient,
  userId: string,
): Promise<GateState> {
  try {
    const submissions = await fetchUserSubmissions(supabase, userId);

    if (__DEV__) {
      console.log('[gating] submissions:', submissions.length, submissions.map(
        (s) => `${s.vault_type}:${s.diagnostic_type}`
      ));
    }

    const archetypeDone = isDiagnosticDone('mental', 'archetype', submissions);
    const identityDone = isDiagnosticDone('mental', 'identity', submissions);
    const habitsDone = isDiagnosticDone('mental', 'habits', submissions);
    const mentalCompletedCount = [archetypeDone, identityDone, habitsDone].filter(Boolean).length;

    const mentalUnlocked = isVaultUnlocked('mental', submissions);
    const hittingUnlocked = isVaultUnlocked('hitting', submissions); // Always true (no requirements)
    const scUnlocked = isVaultUnlocked('sc', submissions);

    const scMoverDone = isDiagnosticDone('sc', 'lifting-mover', submissions);

    return {
      mentalUnlocked,
      hittingUnlocked,
      scUnlocked,
      myPathUnlocked: mentalUnlocked && hittingUnlocked && scUnlocked,
      mentalDiagnosticsComplete: mentalCompletedCount === MENTAL_TOTAL,
      mental: {
        archetypeDone,
        identityDone,
        habitsDone,
        completedCount: mentalCompletedCount,
        total: MENTAL_TOTAL,
      },
      sc: { moverDone: scMoverDone },
    };
  } catch (err) {
    console.error('[gating] getGateState failed — returning locked state:', err);
    return LOCKED_GATE_STATE;
  }
}

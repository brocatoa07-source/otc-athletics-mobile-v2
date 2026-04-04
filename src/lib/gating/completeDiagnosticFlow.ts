/**
 * completeDiagnosticFlow — Single orchestrator for all diagnostic submissions.
 *
 * Every quiz screen calls this ONE function instead of manually coordinating
 * submitDiagnostic, AsyncStorage caching, query invalidation, and navigation.
 *
 * Flow:
 *   1. Validate prerequisites (user session, valid vault/diagnostic pair)
 *   2. Submit to diagnostic_submissions via submitDiagnostic()
 *   3. Generate result if applicable (mental vault → mental_profiles)
 *   4. Cache to AsyncStorage (best-effort)
 *   5. Invalidate all relevant React Query keys
 *   6. Return typed success/failure result
 *
 * Error types:
 *   - prerequisite_missing: no user session or invalid diagnostic pair
 *   - submit_failed: Supabase upsert to diagnostic_submissions failed
 *   - generation_failed: result generation failed after successful submit
 *   - cache_failed: AsyncStorage write failed (non-critical, logged only)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitDiagnostic } from './diagnosticService';
import { generateDiagnosticResult } from './generateDiagnosticResult';
import { VAULT, DIAGNOSTIC, QUERY_KEYS, CACHE_KEYS, CANONICAL_PAIRS } from './diagnosticConstants';
import { logDiagnosticEvent, startTimer } from './diagnosticEvents';
import type { VaultType, DiagnosticKey } from './vaultConfig';

// ── Error types ─────────────────────────────────────────────────────────────

export type DiagnosticFlowError =
  | 'prerequisite_missing'
  | 'submit_failed'
  | 'generation_failed'
  | 'refetch_failed';

export interface DiagnosticFlowResult {
  success: boolean;
  error?: DiagnosticFlowError;
  errorMessage?: string;
  /** The submission ID from Supabase, if submit succeeded */
  submissionId?: string;
}

// ── Params ──────────────────────────────────────────────────────────────────

export interface CompleteDiagnosticFlowParams {
  supabase: SupabaseClient;
  queryClient: QueryClient;
  userId: string;
  vaultType: VaultType;
  diagnosticType: DiagnosticKey;
  resultPayload: Record<string, unknown>;
  /** Optional AsyncStorage key + value for cache write */
  cacheEntry?: { key: string; value: string };
}

// ── Validation ──────────────────────────────────────────────────────────────

function isValidPair(vault: string, diagnostic: string): boolean {
  return CANONICAL_PAIRS.some(
    (p) => p.vault === vault && p.diagnostic === diagnostic,
  );
}

// ── Main flow ───────────────────────────────────────────────────────────────

export async function completeDiagnosticFlow(
  params: CompleteDiagnosticFlowParams,
): Promise<DiagnosticFlowResult> {
  const { supabase, queryClient, userId, vaultType, diagnosticType, resultPayload, cacheEntry } = params;

  const elapsed = startTimer();

  // ── 1. Prerequisites ─────────────────────────────────────────────────────
  if (!userId) {
    logDiagnosticEvent({ event: 'diagnostic_submit_failed', vault: vaultType, diagnostic: diagnosticType, error: 'No userId' });
    return { success: false, error: 'prerequisite_missing', errorMessage: 'No user session. Please sign in again.' };
  }

  if (!isValidPair(vaultType, diagnosticType)) {
    logDiagnosticEvent({ event: 'diagnostic_submit_failed', vault: vaultType, diagnostic: diagnosticType, error: 'Invalid pair' });
    return { success: false, error: 'prerequisite_missing', errorMessage: `Invalid diagnostic type: ${vaultType}/${diagnosticType}` };
  }

  logDiagnosticEvent({ event: 'diagnostic_submit_started', vault: vaultType, diagnostic: diagnosticType, userId: userId.slice(0, 8) });

  // ── 2. Submit ─────────────────────────────────────────────────────────────
  let submissionId: string | undefined;
  try {
    const submission = await submitDiagnostic(supabase, {
      userId,
      vaultType,
      diagnosticType,
      resultPayload,
    });
    submissionId = submission.id;
    logDiagnosticEvent({ event: 'diagnostic_submit_succeeded', vault: vaultType, diagnostic: diagnosticType, durationMs: elapsed(), metadata: { submissionId } });
  } catch (err: any) {
    logDiagnosticEvent({ event: 'diagnostic_submit_failed', vault: vaultType, diagnostic: diagnosticType, error: err?.message, durationMs: elapsed() });
    return {
      success: false,
      error: 'submit_failed',
      errorMessage: err?.message ?? 'Failed to save your responses. Please check your connection and try again.',
    };
  }

  // ── 3. Generate result (vault-specific) ───────────────────────────────────
  if (vaultType === VAULT.MENTAL) {
    const { data: mentalSubs } = await supabase
      .from('diagnostic_submissions')
      .select('diagnostic_type')
      .eq('user_id', userId)
      .eq('vault_type', VAULT.MENTAL);

    const completedMental = new Set((mentalSubs ?? []).map((s: any) => s.diagnostic_type));
    const allMentalDone = completedMental.has(DIAGNOSTIC.ARCHETYPE)
      && completedMental.has(DIAGNOSTIC.IDENTITY)
      && completedMental.has(DIAGNOSTIC.HABITS);

    if (allMentalDone) {
      logDiagnosticEvent({ event: 'profile_generation_started', vault: 'mental' });
      const genResult = await generateDiagnosticResult({ supabase, userId, vaultType: VAULT.MENTAL });
      if (!genResult.success) {
        logDiagnosticEvent({ event: 'profile_generation_failed', vault: 'mental', error: genResult.error, durationMs: elapsed() });
        return {
          success: false,
          error: 'generation_failed',
          errorMessage: genResult.error ?? 'Profile generation failed after saving your responses.',
          submissionId,
        };
      }
      logDiagnosticEvent({ event: 'profile_generation_succeeded', vault: 'mental', durationMs: elapsed() });
    }
  }

  if (vaultType === VAULT.SC) {
    logDiagnosticEvent({ event: 'profile_generation_started', vault: 'sc' });
    const genResult = await generateDiagnosticResult({ supabase, userId, vaultType: VAULT.SC });
    if (!genResult.success) {
      logDiagnosticEvent({ event: 'profile_generation_failed', vault: 'sc', error: genResult.error, durationMs: elapsed() });
      return {
        success: false,
        error: 'generation_failed',
        errorMessage: genResult.error ?? 'Strength profile generation failed after saving your responses.',
        submissionId,
      };
    }
    logDiagnosticEvent({ event: 'profile_generation_succeeded', vault: 'sc', durationMs: elapsed() });
  }

  // ── 4. Cache to AsyncStorage (best-effort) ────────────────────────────────
  if (cacheEntry) {
    try {
      await AsyncStorage.setItem(cacheEntry.key, cacheEntry.value);
    } catch {
      // Non-critical
    }
  }

  // ── 5. Invalidate queries ─────────────────────────────────────────────────
  try {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gateState(userId) });

    if (vaultType === VAULT.MENTAL) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mentalSubmissions(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mentalProfile(userId) });
    } else if (vaultType === VAULT.SC) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.diagnosticResult(vaultType, diagnosticType, userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.strengthProfile(userId) });
    } else {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.diagnosticResult(vaultType, diagnosticType, userId) });
    }
  } catch {
    // Query invalidation failure is non-critical
  }

  logDiagnosticEvent({ event: 'diagnostic_submit_succeeded', vault: vaultType, diagnostic: diagnosticType, durationMs: elapsed(), metadata: { flowComplete: true } });
  return { success: true, submissionId };
}

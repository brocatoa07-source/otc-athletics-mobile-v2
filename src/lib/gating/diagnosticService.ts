/**
 * Diagnostic Submission Service
 *
 * Single source of truth for recording diagnostic completions.
 * All quiz screens call `submitDiagnostic()` instead of writing
 * to any other table directly.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { VaultType, DiagnosticKey } from './vaultConfig';

export interface DiagnosticSubmission {
  id: string;
  user_id: string;
  vault_type: VaultType;
  diagnostic_type: DiagnosticKey;
  result_payload: Record<string, unknown>;
  submitted_at: string;
  updated_at: string;
}

export interface SubmitDiagnosticParams {
  userId: string;
  vaultType: VaultType;
  diagnosticType: DiagnosticKey;
  resultPayload?: Record<string, unknown>;
}

/**
 * Record (or update) a diagnostic submission.
 * Uses UPSERT so retakes overwrite the previous row.
 */
export async function submitDiagnostic(
  supabase: SupabaseClient,
  params: SubmitDiagnosticParams,
): Promise<DiagnosticSubmission> {
  const { userId, vaultType, diagnosticType, resultPayload = {} } = params;

  if (__DEV__) {
    console.log('[diagnosticService] submitDiagnostic', { userId, vaultType, diagnosticType });
  }

  const { data, error } = await supabase
    .from('diagnostic_submissions')
    .upsert(
      {
        user_id: userId,
        vault_type: vaultType,
        diagnostic_type: diagnosticType,
        result_payload: resultPayload,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,vault_type,diagnostic_type' },
    )
    .select()
    .single();

  if (error) {
    console.error('[diagnosticService] submitDiagnostic FAILED', {
      code: error.code,
      message: error.message,
    });
    throw new Error(`Failed to save diagnostic: ${error.message}`);
  }

  if (__DEV__) {
    console.log('[diagnosticService] submitDiagnostic OK', { id: data.id });
  }

  return data as DiagnosticSubmission;
}

/**
 * Fetch all diagnostic submissions for a user.
 * Returns empty array on error (fail-safe for reads).
 */
export async function fetchUserSubmissions(
  supabase: SupabaseClient,
  userId: string,
): Promise<DiagnosticSubmission[]> {
  const { data, error } = await supabase
    .from('diagnostic_submissions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.warn('[diagnosticService] fetchUserSubmissions error:', error.code, error.message);
    return [];
  }

  return (data ?? []) as DiagnosticSubmission[];
}

/**
 * Delete all diagnostic submissions for a user (DEV reset only).
 */
export async function deleteAllSubmissions(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from('diagnostic_submissions')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.warn('[diagnosticService] deleteAllSubmissions error', error.message);
  }
}

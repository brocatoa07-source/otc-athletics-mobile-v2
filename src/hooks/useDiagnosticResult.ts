/**
 * useDiagnosticResult — Unified loader for diagnostic result display.
 *
 * Primary source: Supabase diagnostic_submissions.result_payload
 * Cache: AsyncStorage (best-effort write after Supabase fetch)
 *
 * The hook maps diagnosticType to the correct hydrator internally.
 * Callers do NOT need to pass their own hydrator.
 *
 * If Supabase has no row or the payload is malformed, result is null.
 * AsyncStorage alone cannot produce a non-null result.
 *
 * NOTE: Hitting diagnostics (mover-type, mechanical) have been removed.
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import type { VaultType } from '@/lib/gating/vaultConfig';
import { hydrateLiftingMover } from '@/lib/gating/hydrateResults';
import type { LiftingMoverType } from '@/data/lifting-mover-type-data';
import { CACHE_KEYS } from '@/lib/gating/diagnosticConstants';

// ── Result type map ─────────────────────────────────────────────────────────

/** Maps each diagnostic to its hydrated result type */
export type DiagnosticResultMap = {
  'lifting-mover': LiftingMoverType;
};

type SupportedDiagnostic = keyof DiagnosticResultMap;

// ── Hydrator dispatch ───────────────────────────────────────────────────────

function hydratePayload<K extends SupportedDiagnostic>(
  diagnosticType: K,
  payload: Record<string, unknown>,
): DiagnosticResultMap[K] | null {
  switch (diagnosticType) {
    case 'lifting-mover':
      return hydrateLiftingMover(payload) as DiagnosticResultMap[K] | null;
    default:
      return null;
  }
}

// ── AsyncStorage cache keys ─────────────────────────────────────────────────

const DIAGNOSTIC_CACHE_KEYS: Record<SupportedDiagnostic, string> = {
  'lifting-mover': CACHE_KEYS.liftingMoverType,
};

/** Best-effort cache write. Failures are silently ignored. */
function cacheResult(diagnosticType: SupportedDiagnostic, result: unknown): void {
  try {
    const key = DIAGNOSTIC_CACHE_KEYS[diagnosticType];
    if (diagnosticType === 'lifting-mover') {
      // Lifting mover stores raw slug string, not JSON
      AsyncStorage.setItem(key, result as string);
    } else {
      AsyncStorage.setItem(key, JSON.stringify(result));
    }
  } catch {
    // Cache write is best-effort only
  }
}

// ── Hook ────────────────────────────────────────────────────────────────────

export interface UseDiagnosticResultReturn<T> {
  /** The hydrated result, or null if not loaded / not taken / malformed */
  result: T | null;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Load a diagnostic result from Supabase, hydrate it, and optionally cache.
 *
 * @param vaultType - 'sc'
 * @param diagnosticType - 'lifting-mover'
 */
export function useDiagnosticResult<K extends SupportedDiagnostic>(
  vaultType: VaultType,
  diagnosticType: K,
): UseDiagnosticResultReturn<DiagnosticResultMap[K]> {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const { data: result = null, isLoading, isError } = useQuery({
    queryKey: ['diagnostic-result', vaultType, diagnosticType, userId],
    enabled: !!userId,
    staleTime: 5 * 60_000, // 5 minutes — results rarely change
    queryFn: useCallback(async () => {
      const { data, error } = await supabase
        .from('diagnostic_submissions')
        .select('result_payload')
        .eq('user_id', userId!)
        .eq('vault_type', vaultType)
        .eq('diagnostic_type', diagnosticType)
        .maybeSingle();

      if (error) {
        console.warn('[useDiagnosticResult] fetch error:', error.message);
        return null;
      }

      if (!data?.result_payload) return null;

      const hydrated = hydratePayload(diagnosticType, data.result_payload as Record<string, unknown>);

      if (hydrated != null) {
        // Best-effort cache write so other screens still work during migration
        cacheResult(diagnosticType, hydrated);
      }

      return hydrated;
    }, [userId, vaultType, diagnosticType]),
  });

  return { result, isLoading, isError };
}

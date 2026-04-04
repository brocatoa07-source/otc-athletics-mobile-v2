/**
 * useStrengthProfile — Load the generated strength profile from Supabase.
 *
 * Reads from the `strength_profiles` table (not diagnostic_submissions).
 * This is the interpreted prescription profile generated after the lifting-mover quiz.
 *
 * Parallel to useMentalProfile for the mental vault.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { QUERY_KEYS } from '@/lib/gating/diagnosticConstants';
import { logDiagnosticEvent } from '@/lib/gating/diagnosticEvents';
import type { StrengthProfile } from '@/features/strength/types/strengthProfile';

export interface UseStrengthProfileReturn {
  /** null while loading or when no profile exists */
  profile: StrengthProfile | null | undefined;
  isLoading: boolean;
  refetch: () => void;
}

export function useStrengthProfile(): UseStrengthProfileReturn {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: QUERY_KEYS.strengthProfile(user?.id ?? ''),
    queryFn: async () => {
      if (!user?.id) return null;
      try {
        const { data: profile, error } = await supabase
          .from('strength_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) {
          // Handle missing table gracefully (migration not yet applied)
          if (error.message?.includes('schema cache') || error.code === '42P01') {
            console.warn('[useStrengthProfile] Table not found — migration may not be applied yet');
            return null;
          }
          logDiagnosticEvent({ event: 'profile_read_failed', vault: 'sc', error: error.message });
          throw error;
        }
        if (profile) {
          logDiagnosticEvent({ event: 'profile_read_succeeded', vault: 'sc', metadata: { archetype: (profile as any).primary_archetype } });
        }
        return profile as StrengthProfile | null;
      } catch (err: any) {
        // Graceful fallback if table doesn't exist
        if (err?.message?.includes('schema cache') || err?.message?.includes('relation') || err?.code === '42P01') {
          console.warn('[useStrengthProfile] strength_profiles table not available');
          return null;
        }
        throw err;
      }
    },
    enabled: !!user?.id,
    retry: (failureCount, error: any) => {
      // Don't retry if the table doesn't exist
      if (error?.message?.includes('schema cache') || error?.code === '42P01') return false;
      return failureCount < 2;
    },
  });

  return {
    profile: isPending ? undefined : (data ?? null),
    isLoading: isPending,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.strengthProfile(user?.id ?? '') });
    },
  };
}

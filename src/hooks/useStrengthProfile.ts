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
      const { data: profile, error } = await supabase
        .from('strength_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) {
        console.warn('[useStrengthProfile] fetch error:', error.message);
        throw error;
      }
      return profile as StrengthProfile | null;
    },
    enabled: !!user?.id,
  });

  return {
    profile: isPending ? undefined : (data ?? null),
    isLoading: isPending,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.strengthProfile(user?.id ?? '') });
    },
  };
}

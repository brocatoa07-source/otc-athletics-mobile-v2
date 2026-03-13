import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import type { MentalProfile } from '@/types/database';
import type { DiagnosticType } from '@/data/mental-diagnostics-data';

export type { DiagnosticType };

export interface UseMentalProfileReturn {
  /** null while loading or when no profile exists */
  profile: MentalProfile | null | undefined;
  isLoading: boolean;
  /** Set of diagnostic types that have a completed session */
  completedTypes: Set<DiagnosticType>;
  allDiagnosticsComplete: boolean;
  /** Refetch profile + sessions */
  refetch: () => void;
}

export function useMentalProfile(): UseMentalProfileReturn {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['mental-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('mental_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as MentalProfile | null;
    },
    enabled: !!user?.id,
  });

  const sessionsQuery = useQuery({
    queryKey: ['diagnostic-submissions-mental', user?.id],
    queryFn: async () => {
      if (!user?.id) return [] as DiagnosticType[];
      const { data, error } = await supabase
        .from('diagnostic_submissions')
        .select('diagnostic_type')
        .eq('user_id', user.id)
        .eq('vault_type', 'mental');
      if (error) throw error;
      return (data ?? []).map((s) => s.diagnostic_type as DiagnosticType);
    },
    enabled: !!user?.id,
  });

  const completedTypes = new Set<DiagnosticType>(sessionsQuery.data ?? []);

  return {
    profile: profileQuery.isPending ? undefined : (profileQuery.data ?? null),
    isLoading: profileQuery.isPending || sessionsQuery.isPending,
    completedTypes,
    allDiagnosticsComplete:
      completedTypes.has('archetype') &&
      completedTypes.has('identity') &&
      completedTypes.has('habits'),
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['mental-profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['diagnostic-submissions-mental', user?.id] });
    },
  };
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import type { DBUser } from '@/types/database';

/**
 * React Query hook for fetching the current user's profile from `users` table.
 */
export function useProfile() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery<DBUser | null>({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId!)
        .maybeSingle();

      if (error) throw error;
      return (data as DBUser) ?? null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

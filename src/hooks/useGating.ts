import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import {
  getGateState,
  LOCKED_GATE_STATE,
  type GateState,
} from '@/lib/gating/gatingEngine';

export type { GateState };

/**
 * Single source of truth for vault unlock state.
 * Derives everything from diagnostic_submissions.
 * Automatically refetches on screen focus.
 */
export function useGating(): { gate: GateState; isLoading: boolean; refresh: () => void } {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const userId = user?.id;

  const { data: gate = LOCKED_GATE_STATE, isLoading } = useQuery({
    queryKey: ['gate-state', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (__DEV__) console.log('[useGating] queryFn running for userId:', userId);
      const state = await getGateState(supabase, userId!);
      if (__DEV__) console.log('[useGating] gate state:', JSON.stringify(state, null, 2));
      return state;
    },
    staleTime: 30_000,
  });

  const refresh = useCallback(() => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ['gate-state', userId] });
    }
  }, [queryClient, userId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { gate, isLoading, refresh };
}

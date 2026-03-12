import { useAuthStore } from '@/store/auth.store';

/**
 * Convenience hook for accessing auth state.
 * Thin selector over the Zustand store.
 */
export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);
  const dbUser = useAuthStore((s) => s.dbUser);
  const athlete = useAuthStore((s) => s.athlete);
  const coach = useAuthStore((s) => s.coach);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const isCoach = dbUser?.role === 'COACH';
  const isAthlete = dbUser?.role === 'ATHLETE';

  return {
    session,
    user,
    dbUser,
    athlete,
    coach,
    isHydrated,
    isCoach,
    isAthlete,
    clearAuth,
  };
}

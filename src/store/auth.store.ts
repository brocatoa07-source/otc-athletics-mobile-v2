import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Athlete, Coach, DBUser } from '@/types/database';

interface AuthState {
  session: Session | null;
  user: User | null;
  dbUser: DBUser | null;
  athlete: Athlete | null;
  coach: Coach | null;
  isHydrated: boolean;

  setSession: (session: Session | null) => void;
  fetchProfile: (userId: string) => Promise<void>;
  clearAuth: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  dbUser: null,
  athlete: null,
  coach: null,
  isHydrated: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
  },

  fetchProfile: async (userId: string) => {
    try {
      // 1. Read role from users table
      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error('[auth] Failed to fetch user row:', userError.message);
        set({ dbUser: null, athlete: null, coach: null });
        return;
      }

      if (!dbUser) {
        // Trigger may not have fired yet — retry once after a short delay
        await new Promise((r) => setTimeout(r, 1500));
        const { data: retryUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!retryUser) {
          console.warn('[auth] No users row found for', userId);
          set({ dbUser: null, athlete: null, coach: null });
          return;
        }
        set({ dbUser: retryUser as DBUser });
        await fetchRoleRow(retryUser as DBUser, userId, set);
        return;
      }

      set({ dbUser: dbUser as DBUser });

      // 2. Fetch role-specific row
      await fetchRoleRow(dbUser as DBUser, userId, set);
    } catch (err) {
      console.error('[auth] fetchProfile unexpected error:', err);
      set({ dbUser: null, athlete: null, coach: null });
    }
  },

  clearAuth: () =>
    set({
      session: null,
      user: null,
      dbUser: null,
      athlete: null,
      coach: null,
    }),

  hydrate: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        set({ session, user: session.user });
        await useAuthStore.getState().fetchProfile(session.user.id);
      } else {
        set({ session: null, user: null });
      }
    } catch (err) {
      console.error('[auth] hydrate error:', err);
    } finally {
      set({ isHydrated: true });
    }
  },
}));

/** Fetch the athlete or coach row for a given user. */
async function fetchRoleRow(
  dbUser: DBUser,
  userId: string,
  set: (state: Partial<AuthState>) => void,
) {
  if (dbUser.role === 'COACH') {
    const { data: coach, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) console.error('[auth] Failed to fetch coach row:', error.message);
    set({ coach: (coach as Coach) ?? null, athlete: null });
  } else {
    const { data: athlete, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) console.error('[auth] Failed to fetch athlete row:', error.message);
    set({ athlete: (athlete as Athlete) ?? null, coach: null });
  }
}

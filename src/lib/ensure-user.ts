/**
 * Idempotent helpers for creating / updating public.users and role rows.
 *
 * Uses UPSERT so the correct role is always written regardless of whether
 * the `handle_new_user` trigger fires first.
 *
 * v2 schema: tables are `athletes` and `coaches` (not `athlete_profiles` / `coach_profiles`).
 */
import { supabase } from './supabase';
import type { UserRole } from '@/types/database';

// ── public.users ──────────────────────────────────────────────────
interface EnsureUserParams {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export async function ensurePublicUser(params: EnsureUserParams) {
  if (__DEV__) {
    console.log('[ensurePublicUser] upserting', params.id, 'role=', params.role);
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: params.id,
        email: params.email,
        full_name: params.full_name,
        role: params.role,
      },
      { onConflict: 'id' },
    )
    .select()
    .single();

  if (error) {
    console.error('[ensurePublicUser] FAILED', {
      code: error.code,
      message: error.message,
    });
    throw new Error(`Failed to create user record: ${error.message}`);
  }

  if (__DEV__) {
    console.log('[ensurePublicUser] OK — role stored as', data.role);
  }
  return data;
}

// ── public.coaches ────────────────────────────────────────────────
interface EnsureCoachParams {
  user_id: string;
  connect_code?: string;
  specialization?: string | null;
  bio?: string | null;
}

export async function ensureCoach(params: EnsureCoachParams) {
  if (__DEV__) {
    console.log('[ensureCoach] upserting for user', params.user_id);
  }

  const { data, error } = await supabase
    .from('coaches')
    .upsert(
      {
        user_id: params.user_id,
        connect_code: params.connect_code ?? null,
        specialization: params.specialization ?? null,
        bio: params.bio ?? null,
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) {
    console.error('[ensureCoach] FAILED', {
      code: error.code,
      message: error.message,
    });
    throw new Error(`Failed to create coach record: ${error.message}`);
  }

  if (__DEV__) {
    console.log('[ensureCoach] OK — id=', data.id);
  }
  return data;
}

// ── public.athletes ───────────────────────────────────────────────
interface EnsureAthleteParams {
  user_id: string;
  sport?: string;
}

export async function ensureAthlete(params: EnsureAthleteParams) {
  if (__DEV__) {
    console.log('[ensureAthlete] upserting for user', params.user_id);
  }

  const { data, error } = await supabase
    .from('athletes')
    .upsert(
      {
        user_id: params.user_id,
        sport: params.sport ?? 'baseball',
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) {
    console.error('[ensureAthlete] FAILED', {
      code: error.code,
      message: error.message,
    });
    throw new Error(`Failed to create athlete record: ${error.message}`);
  }

  if (__DEV__) {
    console.log('[ensureAthlete] OK — id=', data.id);
  }
  return data;
}

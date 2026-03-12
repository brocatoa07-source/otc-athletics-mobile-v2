import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Returns the live authenticated Supabase user (verified via JWT network call).
 * Returns null if no valid session exists.
 * Use this for any DB write that requires RLS — never use a cached/store user ID.
 */
export async function getLiveUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

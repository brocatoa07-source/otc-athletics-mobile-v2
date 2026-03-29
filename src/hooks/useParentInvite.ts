/**
 * useParentInvite — Generate and redeem parent invite codes.
 *
 * Athlete side: generate a 6-character code, stored in parent_invite_codes table.
 * Parent side: redeem a code to create an athlete_parent_links row.
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

function generateAlphanumeric(len: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export interface ParentInviteCode {
  id: string;
  code: string;
  createdAt: string;
  redeemed: boolean;
}

export function useParentInvite() {
  const [loading, setLoading] = useState(false);

  /** Athlete: generate a new 6-char invite code */
  const generateCode = useCallback(async (athleteUserId: string): Promise<string | null> => {
    setLoading(true);
    try {
      const code = generateAlphanumeric(6);

      // Deactivate any existing unredeemed codes for this athlete
      await supabase
        .from('parent_invite_codes')
        .update({ is_active: false })
        .eq('athlete_id', athleteUserId)
        .eq('is_active', true);

      // Insert new code
      const { error } = await supabase
        .from('parent_invite_codes')
        .insert({
          athlete_id: athleteUserId,
          code,
          is_active: true,
          redeemed_by: null,
        });

      if (error) {
        if (__DEV__) console.error('[useParentInvite] generateCode error:', error.message);
        return null;
      }

      return code;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Athlete: get current active invite code */
  const getActiveCode = useCallback(async (athleteUserId: string): Promise<ParentInviteCode | null> => {
    const { data, error } = await supabase
      .from('parent_invite_codes')
      .select('id, code, created_at, redeemed_by')
      .eq('athlete_id', athleteUserId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      code: data.code,
      createdAt: data.created_at,
      redeemed: !!data.redeemed_by,
    };
  }, []);

  /** Parent: redeem an invite code to link to an athlete */
  const redeemCode = useCallback(async (parentUserId: string, code: string): Promise<{ ok: boolean; error?: string; linkedAthleteId?: string }> => {
    setLoading(true);
    try {
      const trimmed = code.trim().toUpperCase();

      // Look up the code
      const { data: invite, error: lookupErr } = await supabase
        .from('parent_invite_codes')
        .select('id, athlete_id, redeemed_by')
        .eq('code', trimmed)
        .eq('is_active', true)
        .maybeSingle();

      if (lookupErr || !invite) {
        return { ok: false, error: 'Invalid or expired code. Please check and try again.' };
      }

      if (invite.redeemed_by) {
        return { ok: false, error: 'This code has already been used.' };
      }

      // Check if already linked
      const { data: existing } = await supabase
        .from('athlete_parent_links')
        .select('id')
        .eq('parent_id', parentUserId)
        .eq('athlete_id', invite.athlete_id)
        .maybeSingle();

      if (existing) {
        return { ok: false, error: 'You are already linked to this athlete.' };
      }

      // Create the link
      const { error: linkErr } = await supabase
        .from('athlete_parent_links')
        .insert({
          parent_id: parentUserId,
          athlete_id: invite.athlete_id,
        });

      if (linkErr) {
        if (__DEV__) console.error('[useParentInvite] link error:', linkErr.message);
        return { ok: false, error: 'Could not create link. Please try again.' };
      }

      // Mark code as redeemed
      await supabase
        .from('parent_invite_codes')
        .update({ redeemed_by: parentUserId, is_active: false })
        .eq('id', invite.id);

      return { ok: true, linkedAthleteId: invite.athlete_id };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, generateCode, getActiveCode, redeemCode };
}

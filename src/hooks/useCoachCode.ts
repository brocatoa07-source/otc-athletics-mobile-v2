import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface CoachLookup {
  userId: string;
  fullName: string;
  bio?: string;
  specialization?: string;
}

export interface ActiveConnection {
  connectionId: string;
  coachName: string;
}

export interface PendingRequest {
  id: string;
  athlete_user_id: string;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
  athlete_name?: string;
  athlete_avatar?: string;
}

function generateAlphanumeric(len: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function useCoachCode() {
  const [loading, setLoading] = useState(false);

  const generateCode = useCallback(async (coachUserId: string): Promise<string | null> => {
    setLoading(true);
    try {
      const code = generateAlphanumeric(6);
      const { error } = await supabase
        .from('coaches')
        .update({ connect_code: code })
        .eq('user_id', coachUserId);

      if (error) return null;
      return code;
    } finally {
      setLoading(false);
    }
  }, []);

  const lookupCode = useCallback(async (code: string): Promise<CoachLookup | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('lookup_coach_by_code', { lookup_code: code });

      if (error) {
        if (__DEV__) console.error('[lookupCode] RPC error:', error.message, error.code);
        return null;
      }

      if (!data) return null;

      // RPC may return an array or a single object depending on function signature
      const row = Array.isArray(data) ? data[0] : data;
      if (!row || !row.user_id) return null;

      return {
        userId: row.user_id,
        fullName: row.full_name,
        bio: row.bio ?? undefined,
        specialization: row.specialization ?? undefined,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const submitRequest = useCallback(async (athleteUserId: string, coachUserId: string): Promise<{ ok: boolean; error?: string }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('submit_coach_request', {
          athlete_user_id: athleteUserId,
          coach_user_id: coachUserId,
        });

      if (error) return { ok: false, error: error.message };
      if (data === null) return { ok: false, error: 'Request already pending' };
      return { ok: true };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async (coachUserId: string): Promise<PendingRequest[]> => {
    const { data, error } = await supabase
      .rpc('fetch_pending_requests', { coach_user_id: coachUserId });

    if (error || !data || data.length === 0) return [];

    return data.map((r: any) => ({
      id: r.id,
      athlete_user_id: r.athlete_user_id,
      status: r.status,
      created_at: r.created_at,
      athlete_name: r.athlete_name ?? undefined,
      athlete_avatar: r.athlete_avatar ?? undefined,
    }));
  }, []);

  const approveRequest = useCallback(async (requestId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('approve_coach_request', { request_id: requestId });

      return !error && data === true;
    } finally {
      setLoading(false);
    }
  }, []);

  const denyRequest = useCallback(async (requestId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('deny_coach_request', { request_id: requestId });

      return !error && data === true;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkConnection = useCallback(async (athleteUserId: string): Promise<ActiveConnection | null> => {
    const { data, error } = await supabase
      .rpc('get_athlete_coach_connection', { athlete_user_id: athleteUserId });

    if (error || !data || data.length === 0) return null;
    const row = data[0];
    return {
      connectionId: row.connection_id,
      coachName: row.coach_name,
    };
  }, []);

  const disconnectCoach = useCallback(async (athleteUserId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('disconnect_coach', { athlete_user_id: athleteUserId });

      return !error && data === true;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    generateCode,
    lookupCode,
    submitRequest,
    fetchRequests,
    approveRequest,
    denyRequest,
    checkConnection,
    disconnectCoach,
  };
}

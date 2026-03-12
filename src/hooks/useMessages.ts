import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface MessageRow {
  id: string;
  created_at: string;
  conversation_id: string;
  sender_id: string;
  body: string | null;
  media_url: string | null;
  media_type: string | null;
  read_by: string[];
  sender: { id: string; full_name: string; avatar_url: string | null } | null;
}

export interface EnrichedMessage {
  id: string;
  created_at: string;
  conversation_id: string;
  sender_id: string;
  body?: string;
  media_url?: string;
  media_type?: 'video' | 'image';
  read_by: string[];
  sender?: { id: string; full_name: string; avatar_url?: string };
}

export function useMessages(conversationId: string | undefined) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const queryKey = ['messages', conversationId];

  const { data: messages = [], isLoading } = useQuery<EnrichedMessage[]>({
    queryKey,
    enabled: !!conversationId && !!user?.id,
    refetchInterval: 4000, // poll every 4s as fallback when realtime isn't delivering
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id ( id, full_name, avatar_url )')
        .eq('conversation_id', conversationId!)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const rows = (data ?? []) as MessageRow[];
      return rows.map(
        (r): EnrichedMessage => ({
          id: r.id,
          created_at: r.created_at,
          conversation_id: r.conversation_id,
          sender_id: r.sender_id,
          body: r.body ?? undefined,
          media_url: r.media_url ?? undefined,
          media_type: (r.media_type as 'video' | 'image') ?? undefined,
          read_by: Array.isArray(r.read_by) ? (r.read_by as string[]) : [],
          sender: r.sender
            ? {
                id: r.sender.id,
                full_name: r.sender.full_name,
                avatar_url: r.sender.avatar_url ?? undefined,
              }
            : undefined,
        }),
      );
    },
  });

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey });
        },
      )
      .subscribe((status, err) => {
        if (__DEV__) console.log('[useMessages] realtime status:', status, err?.message ?? '');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, qc]);

  const sendMessage = useMutation({
    mutationFn: async ({
      body,
      mediaUrl,
      mediaType,
    }: {
      body?: string;
      mediaUrl?: string;
      mediaType?: 'video' | 'image';
    }) => {
      if (!body?.trim() && !mediaUrl) throw new Error('Message has no content');

      const payload = {
        conversation_id: conversationId!,
        sender_id: user!.id,
        body: body?.trim() ?? null,
        media_url: mediaUrl ?? null,
        media_type: mediaType ?? null,
        read_by: [user!.id],
      };
      if (__DEV__) console.log('[sendMessage] inserting:', JSON.stringify(payload));

      const { data, error } = await supabase
        .from('messages')
        .insert(payload)
        .select();

      if (error) {
        if (__DEV__) console.error('[sendMessage] INSERT error:', error.message, error.code, error.details, error.hint);
        throw new Error(`Insert failed: ${error.message} (code: ${error.code})`);
      }

      if (!data || data.length === 0) {
        if (__DEV__) console.warn('[sendMessage] INSERT returned no rows — RLS may be silently blocking');
        throw new Error('Message was not saved. RLS policy may be blocking the insert.');
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const markRead = async () => {
    if (!conversationId || !user?.id) return;
    const unread = messages.filter((m) => !m.read_by.includes(user.id));
    for (const msg of unread) {
      await supabase
        .from('messages')
        .update({ read_by: [...msg.read_by, user.id] })
        .eq('id', msg.id);
    }
    if (unread.length > 0) {
      qc.invalidateQueries({ queryKey });
      qc.invalidateQueries({ queryKey: ['unread-counts'] });
    }
  };

  const unreadCount = messages.filter(
    (m) => m.sender_id !== user?.id && !m.read_by.includes(user?.id ?? ''),
  ).length;

  return { messages, isLoading, sendMessage, markRead, unreadCount };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface ConversationRow {
  id: string;
  created_at: string;
  created_by: string;
  conversation_type: string;
  conversation_members: Array<{
    user_id: string;
    role: string | null;
    users: { id: string; full_name: string; avatar_url: string | null } | null;
  }>;
}

export interface EnrichedConversation {
  id: string;
  created_at: string;
  created_by: string;
  conversation_type: 'dm';
  members: Array<{
    id: string;
    conversation_id: string;
    user_id: string;
    role?: 'athlete' | 'coach';
    joined_at: string;
    user?: { id: string; full_name: string; avatar_url?: string };
  }>;
  other_user?: { id: string; full_name: string; avatar_url?: string };
}

export function useConversations() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery<EnrichedConversation[]>({
    queryKey: ['conversations', user?.id],
    enabled: !!user?.id,
    refetchInterval: 10000, // poll every 10s so new conversations appear without remount
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_members (
            user_id, role,
            users:user_id ( id, full_name, avatar_url )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as ConversationRow[];

      return rows.map((row): EnrichedConversation => {
        const otherMember = row.conversation_members.find((m) => m.user_id !== user!.id);
        return {
          id: row.id,
          created_at: row.created_at,
          created_by: row.created_by,
          conversation_type: 'dm',
          members: row.conversation_members.map((m) => ({
            id: m.user_id,
            conversation_id: row.id,
            user_id: m.user_id,
            role: (m.role as 'athlete' | 'coach') ?? undefined,
            joined_at: row.created_at,
            user: m.users
              ? { id: m.users.id, full_name: m.users.full_name, avatar_url: m.users.avatar_url ?? undefined }
              : undefined,
          })),
          other_user: otherMember?.users
            ? {
                id: otherMember.users.id,
                full_name: otherMember.users.full_name,
                avatar_url: otherMember.users.avatar_url ?? undefined,
              }
            : undefined,
        };
      });
    },
  });

  const findOrCreateDM = useMutation({
    mutationFn: async ({
      targetUserId,
      targetRole,
      myRole,
    }: {
      targetUserId: string;
      targetRole: 'athlete' | 'coach';
      myRole: 'athlete' | 'coach';
    }): Promise<string> => {
      const { data: existing } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', user!.id);

      if (existing && existing.length > 0) {
        const convIds = existing.map((e) => e.conversation_id);
        const { data: shared } = await supabase
          .from('conversation_members')
          .select('conversation_id')
          .eq('user_id', targetUserId)
          .in('conversation_id', convIds);

        if (shared && shared.length > 0) {
          return shared[0].conversation_id;
        }
      }

      const { data: conv, error: convErr } = await supabase
        .from('conversations')
        .insert({ created_by: user!.id, conversation_type: 'dm' })
        .select('id')
        .single();

      if (convErr || !conv) throw convErr ?? new Error('Failed to create conversation');

      const { error: membersErr } = await supabase
        .from('conversation_members')
        .insert([
          { conversation_id: conv.id, user_id: user!.id, role: myRole },
          { conversation_id: conv.id, user_id: targetUserId, role: targetRole },
        ]);

      if (membersErr) throw membersErr;

      return conv.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  });

  return { conversations, isLoading, findOrCreateDM };
}

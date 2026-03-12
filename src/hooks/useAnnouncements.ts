import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Announcement } from '@/types/database';

export function useAnnouncements() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as Announcement[];
    },
  });

  const createAnnouncement = useMutation({
    mutationFn: async (payload: {
      title: string;
      body: string;
      audience: Announcement['audience'];
      is_pinned: boolean;
      attachments?: Announcement['attachments'];
      author_name?: string;
    }) => {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          author_id: user!.id,
          author_name: payload.author_name,
          author_role: 'coach',
          title: payload.title,
          body: payload.body,
          audience: payload.audience,
          is_pinned: payload.is_pinned,
          attachments: payload.attachments ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Announcement;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });

  const updateAnnouncement = useMutation({
    mutationFn: async ({
      id,
      ...fields
    }: Partial<Pick<Announcement, 'title' | 'body' | 'audience' | 'is_pinned' | 'attachments'>> & {
      id: string;
    }) => {
      const { error } = await supabase.from('announcements').update(fields).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });

  return { announcements, isLoading, createAnnouncement, updateAnnouncement, deleteAnnouncement };
}

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { Colors } from '@/constants/colors';
import type { CommunityPost } from '@/types/community';

interface PostCardProps {
  post: CommunityPost;
  section: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function PostCard({ post, section }: PostCardProps) {
  const user = useAuthStore((s) => s.user);
  const athlete = useAuthStore((s) => s.athlete);
  const qc = useQueryClient();

  const poster = post.poster as { full_name?: string; role?: string } | null;
  const name = poster?.full_name ?? 'Member';
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const isCoach = poster?.role === 'COACH';

  const reactions = post.community_reactions ?? [];
  const likeCount = reactions.filter((r) => r.reaction_type === 'LIKE').length;
  const fireCount = reactions.filter((r) => r.reaction_type === 'FIRE').length;
  const myLike = reactions.some((r) => r.athlete_id === athlete?.id && r.reaction_type === 'LIKE');
  const myFire = reactions.some((r) => r.athlete_id === athlete?.id && r.reaction_type === 'FIRE');

  const reactMutation = useMutation({
    mutationFn: async (type: 'LIKE' | 'FIRE') => {
      if (!athlete) return;
      const existing = reactions.find(
        (r) => r.athlete_id === athlete.id && r.reaction_type === type
      );
      if (existing) {
        await supabase.from('community_reactions').delete().eq('id', existing.id);
      } else {
        await supabase.from('community_reactions').insert({
          post_id: post.id,
          athlete_id: athlete.id,
          reaction_type: type,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community-posts', section] });
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.avatar, isCoach && styles.avatarCoach]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {isCoach && <Text style={styles.coachBadge}>COACH</Text>}
          </View>
          <Text style={styles.time}>{timeAgo(post.created_at)}</Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.reactions}>
        <TouchableOpacity
          style={styles.reactionBtn}
          onPress={() => reactMutation.mutate('LIKE')}
        >
          <Ionicons
            name={myLike ? 'heart' : 'heart-outline'}
            size={18}
            color={myLike ? Colors.error : Colors.textMuted}
          />
          {likeCount > 0 && <Text style={styles.reactionCount}>{likeCount}</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reactionBtn}
          onPress={() => reactMutation.mutate('FIRE')}
        >
          <Ionicons
            name="flame"
            size={18}
            color={myFire ? Colors.warning : Colors.textMuted}
          />
          {fireCount > 0 && <Text style={styles.reactionCount}>{fireCount}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    gap: 10,
    marginBottom: 8,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCoach: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  initials: { color: Colors.textPrimary, fontWeight: '800', fontSize: 12 },
  authorInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  coachBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    letterSpacing: 0.8,
  },
  time: { fontSize: 12, color: Colors.textMuted },
  content: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  reactions: { flexDirection: 'row', gap: 16 },
  reactionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reactionCount: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
});

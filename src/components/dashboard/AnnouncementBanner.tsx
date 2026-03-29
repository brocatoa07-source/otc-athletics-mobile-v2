/**
 * AnnouncementBanner — Conditional banner for new announcements or unread messages.
 *
 * Sources:
 *   Announcements: useAnnouncements() → checks if any announcement exists within last 7 days
 *   Messages: Supabase unread count query
 *
 * Hidden entirely when there are no new announcements and no unread messages.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, radius } from '@/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

export function AnnouncementBanner() {
  const userId = useAuthStore((s) => s.user?.id);

  // Check for recent announcements (last 7 days)
  const { data: recentAnnouncement } = useQuery({
    queryKey: ['dashboard-announcement', userId],
    enabled: !!userId,
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
      const { data } = await supabase
        .from('announcements')
        .select('id, title')
        .gte('created_at', weekAgo)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as { id: string; title: string } | null;
    },
  });

  // Check for total unread messages across all conversations
  const { data: unreadTotal = 0 } = useQuery({
    queryKey: ['dashboard-unread', userId],
    enabled: !!userId,
    staleTime: 30_000,
    queryFn: async () => {
      // Get all conversations the user is in
      const { data: memberships } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', userId!);

      if (!memberships?.length) return 0;

      const convIds = memberships.map((m) => m.conversation_id);
      const { data: messages } = await supabase
        .from('messages')
        .select('id, read_by')
        .in('conversation_id', convIds)
        .neq('sender_id', userId!);

      let count = 0;
      for (const msg of messages ?? []) {
        const readBy: string[] = Array.isArray(msg.read_by) ? msg.read_by : [];
        if (!readBy.includes(userId!)) count++;
      }
      return count;
    },
  });

  // Nothing to show
  if (!recentAnnouncement && unreadTotal === 0) return null;

  // Prioritize announcements, then unread messages
  if (recentAnnouncement) {
    return (
      <TouchableOpacity
        style={styles.banner}
        onPress={() => router.push('/(app)/announcements' as any)}
        activeOpacity={0.85}
      >
        <Ionicons name="megaphone" size={16} color={colors.info} />
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerLabel}>NEW ANNOUNCEMENT</Text>
          <Text style={styles.bannerText} numberOfLines={1}>{recentAnnouncement.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => router.push('/(app)/messages' as any)}
      activeOpacity={0.85}
    >
      <Ionicons name="chatbubble" size={16} color={colors.info} />
      <View style={{ flex: 1 }}>
        <Text style={styles.bannerText}>
          {unreadTotal} unread message{unreadTotal !== 1 ? 's' : ''}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{unreadTotal > 99 ? '99+' : unreadTotal}</Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.info + '30',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 12,
  },
  bannerLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.info,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.info,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
});

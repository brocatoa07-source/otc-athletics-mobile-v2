import { useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Colors } from '@/constants/colors';
import { useConversations, type EnrichedConversation } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { useTier } from '@/hooks/useTier';
import { supabase } from '@/lib/supabase';

/** Single query that fetches unread counts for all conversations at once. */
function useUnreadCounts(conversationIds: string[], userId: string | undefined) {
  return useQuery<Record<string, number>>({
    queryKey: ['unread-counts', userId, conversationIds.join(',')],
    enabled: conversationIds.length > 0 && !!userId,
    refetchInterval: 10000,
    queryFn: async () => {
      const { data } = await supabase
        .from('messages')
        .select('id, conversation_id, read_by')
        .in('conversation_id', conversationIds)
        .neq('sender_id', userId!);

      const counts: Record<string, number> = {};
      for (const msg of data ?? []) {
        const readBy: string[] = Array.isArray(msg.read_by) ? msg.read_by : [];
        if (!readBy.includes(userId!)) {
          counts[msg.conversation_id] = (counts[msg.conversation_id] ?? 0) + 1;
        }
      }
      return counts;
    },
  });
}

function ConversationRow({
  conversation,
  unreadCount,
}: {
  conversation: EnrichedConversation;
  unreadCount: number;
}) {
  const other = conversation.other_user;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/(app)/messages/${conversation.id}` as any)}
      activeOpacity={0.75}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {other?.full_name?.[0]?.toUpperCase() ?? '?'}
        </Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowName} numberOfLines={1}>
          {other?.full_name ?? 'Unknown'}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          Tap to open conversation
        </Text>
      </View>
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function MessagesIndexScreen() {
  const { conversations, isLoading } = useConversations();
  const { isCoach, user } = useAuth();
  const { canMessage } = useTier();
  const qc = useQueryClient();

  // Gate: if athlete cannot message, show upgrade CTA
  if (!canMessage && !isCoach) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.center}>
          <Ionicons name="lock-closed-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Messaging Locked</Text>
          <Text style={styles.emptySub}>
            Upgrade to Double or higher to message your coach directly.
          </Text>
          <TouchableOpacity
            style={{ marginTop: 12, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 10 }}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>View Plans</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const conversationIds = conversations.map((c) => c.id);
  const { data: unreadCounts = {} } = useUnreadCounts(conversationIds, user?.id);

  // Immediately refresh unread counts when returning from a thread
  useFocusEffect(
    useCallback(() => {
      qc.invalidateQueries({ queryKey: ['unread-counts'] });
    }, [qc]),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 28 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySub}>
            {isCoach
              ? "Go to an athlete's profile to start a conversation."
              : "Your coach will reach out here."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <ConversationRow
              conversation={item}
              unreadCount={unreadCounts[item.id] ?? 0}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  backBtn: { padding: 2 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textMuted },
  emptySub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  list: { paddingVertical: 8 },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 72 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  rowContent: { flex: 1, gap: 3 },
  rowName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  rowSub: { fontSize: 13, color: Colors.textMuted },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 11, fontWeight: '900', color: Colors.bg },
});

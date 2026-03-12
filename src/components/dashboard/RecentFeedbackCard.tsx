import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/common/Card';

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function RecentFeedbackCard() {
  const user = useAuthStore((s) => s.user);
  const { data: message } = useQuery({
    queryKey: ['last-coach-message', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('direct_messages')
        .select('*, sender:users!sender_id(id, full_name, avatar_url)')
        .eq('receiver_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data;
    },
  });

  if (!message) return null;

  const sender = message.sender as { id: string; full_name: string } | null;
  const initials = sender?.full_name
    ? sender.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : '?';

  return (
    <Card style={styles.card}>
      <Text style={styles.label}>RECENT COACH FEEDBACK</Text>
      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push('/(app)/messages' as any)}
      >
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{sender?.full_name ?? 'Coach'}</Text>
            <Text style={styles.time}>{formatTime(message.created_at)}</Text>
          </View>
          <Text style={styles.preview} numberOfLines={2}>
            {message.attachment_type
              ? `[${message.attachment_type}]`
              : message.message_text}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontWeight: '800', fontSize: 14 },
  content: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  time: { fontSize: 12, color: Colors.textMuted },
  preview: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
});

import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useAuth } from '@/hooks/useAuth';
import type { Announcement } from '@/types/database';

function AnnouncementCard({ item }: { item: Announcement }) {
  const date = new Date(item.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={[styles.card, item.is_pinned && styles.cardPinned]}
      onPress={() => router.push(`/(app)/announcements/${item.id}` as any)}
      activeOpacity={0.8}
    >
      {item.is_pinned && (
        <View style={styles.pinnedRow}>
          <Ionicons name="pin" size={11} color={Colors.primary} />
          <Text style={styles.pinnedText}>PINNED</Text>
        </View>
      )}
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardBody} numberOfLines={3}>{item.body}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardMeta}>{item.author_name ?? 'Coach'}</Text>
        <Text style={styles.cardMeta}>{date}</Text>
        {item.attachments && item.attachments.length > 0 && (
          <View style={styles.attachBadge}>
            <Ionicons name="attach" size={12} color={Colors.textMuted} />
            <Text style={styles.attachText}>{item.attachments.length}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function AnnouncementsScreen() {
  const { announcements, isLoading } = useAnnouncements();
  const { isCoach } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>OTC ATHLETICS</Text>
          <Text style={styles.title}>Announcements</Text>
        </View>
        {isCoach && (
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/(app)/announcements/create' as any)}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : announcements.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="megaphone-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No announcements yet</Text>
          {isCoach && (
            <Text style={styles.emptySub}>Tap + to post an announcement to your team.</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => <AnnouncementCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: 2 },
  label: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1.5 },
  title: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  createBtn: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { padding: 16, gap: 10, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  emptySub: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
  card: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  cardPinned: { borderColor: Colors.primary + '50' },
  pinnedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pinnedText: { fontSize: 9, fontWeight: '900', color: Colors.primary, letterSpacing: 1.2 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: Colors.textPrimary, lineHeight: 22 },
  cardBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  cardMeta: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  attachBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: 'auto' },
  attachText: { fontSize: 11, color: Colors.textMuted },
});

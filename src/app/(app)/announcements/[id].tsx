import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useAuth } from '@/hooks/useAuth';
import type { Announcement } from '@/types/database';

export default function AnnouncementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isCoach } = useAuth();
  const { deleteAnnouncement } = useAnnouncements();

  const { data: announcement, isLoading } = useQuery<Announcement | null>({
    queryKey: ['announcement', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Announcement | null;
    },
  });

  const handleDelete = () => {
    if (!announcement) return;
    Alert.alert('Delete Announcement', 'Are you sure you want to delete this announcement?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteAnnouncement.mutateAsync(announcement.id);
          router.back();
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!announcement) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Announcement not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const date = new Date(announcement.created_at).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const isOwn = announcement.author_id === user?.id;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Announcement</Text>
        {isCoach && isOwn && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(app)/announcements/create', params: { editId: id } } as any)}
              style={styles.actionBtn}
            >
              <Ionicons name="pencil-outline" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {announcement.is_pinned && (
          <View style={styles.pinnedBanner}>
            <Ionicons name="pin" size={14} color={Colors.primary} />
            <Text style={styles.pinnedText}>Pinned Announcement</Text>
          </View>
        )}

        <Text style={styles.title}>{announcement.title}</Text>

        <View style={styles.meta}>
          <Ionicons name="person-circle-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.metaText}>{announcement.author_name ?? 'Coach'}</Text>
          <Text style={styles.metaDot}>&middot;</Text>
          <Text style={styles.metaText}>{date}</Text>
        </View>

        <View style={styles.audienceBadge}>
          <Text style={styles.audienceText}>
            {announcement.audience === 'all' ? 'Everyone' : announcement.audience}
          </Text>
        </View>

        <Text style={styles.body}>{announcement.body}</Text>

        {announcement.attachments && announcement.attachments.length > 0 && (
          <View style={styles.attachments}>
            <Text style={styles.attachTitle}>ATTACHMENTS</Text>
            {announcement.attachments.map((att, i) => (
              <TouchableOpacity
                key={i}
                style={styles.attachRow}
                onPress={() => att.url && Linking.openURL(att.url)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={att.type === 'video' ? 'videocam-outline' : att.type === 'image' ? 'image-outline' : 'document-outline'}
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.attachName} numberOfLines={1}>
                  {att.name ?? att.url}
                </Text>
                <Ionicons name="open-outline" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  headerActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 6 },
  content: { padding: 20, gap: 14, paddingBottom: 48 },
  pinnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: Colors.primary + '15',
    borderRadius: 8,
  },
  pinnedText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, lineHeight: 30 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: Colors.textMuted },
  metaDot: { fontSize: 12, color: Colors.textMuted },
  audienceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  audienceText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  body: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textMuted },
  attachments: { gap: 8, marginTop: 8 },
  attachTitle: { fontSize: 10, fontWeight: '900', color: Colors.textMuted, letterSpacing: 1.5 },
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  attachName: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
});

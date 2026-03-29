/**
 * Video Detail — View a saved playbook video with metadata.
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { colors, radius } from '@/theme';
import {
  loadPlaybookVideos,
  deletePlaybookVideo,
  toggleVideoFavorite,
  getVideoCategoryLabel,
  getVideoCategoryColor,
  type PlaybookVideo,
} from '@/data/playbook';

const ACCENT = '#3b82f6';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [video, setVideo] = useState<PlaybookVideo | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      loadPlaybookVideos().then((all) => {
        setVideo(all.find((v) => v.id === id) ?? null);
      });
    }, [id]),
  );

  if (!video) return null;

  const catColor = getVideoCategoryColor(video.category);

  function handleDelete() {
    Alert.alert('Delete Video', `Delete "${video!.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePlaybookVideo(video!.id);
          router.back();
        },
      },
    ]);
  }

  async function handleFavorite() {
    await toggleVideoFavorite(video!.id);
    setVideo((prev) => prev ? { ...prev, favorite: !prev.favorite } : prev);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>SAVED VIDEO</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{video.title}</Text>
        </View>
        <TouchableOpacity onPress={handleFavorite} style={styles.favBtn}>
          <Ionicons
            name={video.favorite ? 'star' : 'star-outline'}
            size={20}
            color={video.favorite ? '#f59e0b' : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        <View style={styles.playerWrap}>
          <Video
            source={{ uri: video.videoUri }}
            style={styles.player}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
          />
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={[styles.catBadge, { backgroundColor: catColor + '15', borderColor: catColor + '30' }]}>
            <Text style={[styles.catBadgeText, { color: catColor }]}>
              {getVideoCategoryLabel(video.category)}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(video.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>

        {/* Tags */}
        {video.tags.length > 0 && (
          <View style={styles.tagRow}>
            {video.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Notes */}
        {video.notes.length > 0 && (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>NOTES</Text>
            <Text style={styles.notesText}>{video.notes}</Text>
          </View>
        )}

        {/* Delete */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={14} color={colors.error} />
          <Text style={styles.deleteBtnText}>Delete Video</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  favBtn: { padding: 4 },
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  playerWrap: {
    borderRadius: radius.lg, overflow: 'hidden',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  player: { width: '100%', aspectRatio: 16 / 9 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1,
  },
  catBadgeText: { fontSize: 10, fontWeight: '800' },
  dateText: { fontSize: 12, color: colors.textMuted },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: ACCENT + '12',
  },
  tagText: { fontSize: 10, fontWeight: '700', color: ACCENT },

  notesCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 6,
  },
  notesLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  notesText: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },

  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.error + '30',
  },
  deleteBtnText: { fontSize: 13, fontWeight: '700', color: colors.error },
});

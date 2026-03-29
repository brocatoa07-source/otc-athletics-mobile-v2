/**
 * Playbook — Athlete's personal performance notebook.
 *
 * Category filter + search + favorites + all 7 entry types + saved videos.
 */

import { useState, useCallback, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  loadPlaybookEntries, deletePlaybookEntry,
  loadPlaybookVideos, deletePlaybookVideo,
  getEntryTypeMeta, getVideoCategoryLabel, getVideoCategoryColor,
  ENTRY_TYPE_META,
  type PlaybookEntry, type PlaybookVideo, type PlaybookEntryType,
} from '@/data/playbook';

const ACCENT = '#3b82f6';

type FilterKey = 'all' | 'favorites' | 'videos' | PlaybookEntryType;

const FILTER_CHIPS: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'grid-outline' },
  { key: 'favorites', label: 'Starred', icon: 'star' },
  { key: 'note', label: 'Notes', icon: 'document-text-outline' },
  { key: 'journal', label: 'Journal', icon: 'book-outline' },
  { key: 'cue', label: 'Cues', icon: 'mic-outline' },
  { key: 'saved_drill', label: 'Drills', icon: 'baseball-outline' },
  { key: 'mental_tool', label: 'Mental', icon: 'sparkles-outline' },
  { key: 'routine', label: 'Routines', icon: 'repeat-outline' },
  { key: 'game_note', label: 'Game', icon: 'trophy-outline' },
  { key: 'videos', label: 'Videos', icon: 'videocam-outline' },
];

export default function PlaybookScreen() {
  const [entries, setEntries] = useState<PlaybookEntry[]>([]);
  const [videos, setVideos] = useState<PlaybookVideo[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadPlaybookEntries().then(setEntries);
      loadPlaybookVideos().then(setVideos);
    }, []),
  );

  // ── Filtering logic ────────────────────────────────────────────────────
  // Step 1: determine what's visible based on chip
  const showEntries = filter !== 'videos';
  const showVideos = filter === 'all' || filter === 'videos' || filter === 'favorites';

  // Step 2: filter entries by chip, then by search
  const filteredEntries = useMemo(() => {
    if (!showEntries) return [];
    let result = entries;
    if (filter === 'favorites') result = result.filter((e) => e.favorite);
    else if (filter !== 'all') result = result.filter((e) => e.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [entries, filter, search, showEntries]);

  // Step 3: filter videos by chip, then by search
  const filteredVideos = useMemo(() => {
    if (!showVideos) return [];
    let result = videos;
    if (filter === 'favorites') result = result.filter((v) => v.favorite);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((v) =>
        v.title.toLowerCase().includes(q) ||
        v.notes.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)) ||
        v.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [videos, filter, search, showVideos]);

  // Step 4: derived display states
  const hasRawData = entries.length > 0 || videos.length > 0;
  const hasFilteredResults = filteredEntries.length > 0 || filteredVideos.length > 0;
  const isGlobalEmpty = !hasRawData;
  const isFilterEmpty = hasRawData && !hasFilteredResults;

  // Friendly filter label for "no results" message
  const filterLabel = FILTER_CHIPS.find((c) => c.key === filter)?.label ?? '';

  function handleDeleteEntry(entry: PlaybookEntry) {
    Alert.alert('Delete', `Delete "${entry.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deletePlaybookEntry(entry.id);
        setEntries((prev) => prev.filter((e) => e.id !== entry.id));
      }},
    ]);
  }

  function handleDeleteVideo(video: PlaybookVideo) {
    Alert.alert('Delete', `Delete "${video.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deletePlaybookVideo(video.id);
        setVideos((prev) => prev.filter((v) => v.id !== video.id));
      }},
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>YOUR</Text>
          <Text style={styles.headerTitle}>Playbook</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(app)/playbook/new-entry?type=note' as any)}>
          <Ionicons name="add" size={20} color={ACCENT} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search playbook..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {FILTER_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            style={[styles.chip, filter === chip.key && styles.chipActive]}
            onPress={() => setFilter(filter === chip.key ? 'all' : chip.key)}
          >
            <Ionicons name={chip.icon as any} size={12} color={filter === chip.key ? ACCENT : colors.textMuted} />
            <Text style={[styles.chipText, filter === chip.key && { color: ACCENT }]}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Create */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {ENTRY_TYPE_META.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[styles.quickBtn, { borderColor: m.color + '30' }]}
              onPress={() => router.push(`/(app)/playbook/new-entry?type=${m.key}` as any)}
              activeOpacity={0.8}
            >
              <Ionicons name={m.icon as any} size={14} color={m.color} />
              <Text style={[styles.quickBtnText, { color: m.color }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.quickBtn, { borderColor: '#0891b230' }]}
            onPress={() => router.push('/(app)/playbook/new-video' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="videocam-outline" size={14} color="#0891b2" />
            <Text style={[styles.quickBtnText, { color: '#0891b2' }]}>Video</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Global empty state — no data at all */}
        {isGlobalEmpty && (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Your Playbook Is Empty</Text>
            <Text style={styles.emptyDesc}>
              Save what works for you — drills, cues, notes, routines, game notes, and videos.
            </Text>
          </View>
        )}

        {/* Entries */}
        {showEntries && filteredEntries.map((entry) => {
          const m = getEntryTypeMeta(entry.type);
          return (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => router.push(`/(app)/playbook/entry-detail?id=${entry.id}` as any)}
              onLongPress={() => handleDeleteEntry(entry)}
              activeOpacity={0.8}
            >
              <View style={[styles.entryIcon, { backgroundColor: m.color + '12' }]}>
                <Ionicons name={m.icon as any} size={16} color={m.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.entryMeta}>
                  <Text style={[styles.entryType, { color: m.color }]}>{m.label}</Text>
                  <Text style={styles.entryDate}>
                    {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  {entry.favorite && <Ionicons name="star" size={10} color="#f59e0b" />}
                </View>
                <Text style={styles.entryTitle} numberOfLines={1}>{entry.title}</Text>
                <Text style={styles.entryBody} numberOfLines={2}>{entry.body}</Text>
                {entry.tags.length > 0 && (
                  <View style={styles.entryTags}>
                    {entry.tags.slice(0, 3).map((tag) => (
                      <View key={tag} style={[styles.miniTag, { backgroundColor: m.color + '10' }]}>
                        <Text style={[styles.miniTagText, { color: m.color }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        {/* Videos */}
        {showVideos && filteredVideos.length > 0 && (
          <>
            {showEntries && filteredEntries.length > 0 && (
              <View style={styles.sectionDivider}>
                <Ionicons name="videocam" size={14} color="#0891b2" />
                <Text style={[styles.sectionLabel, { color: '#0891b2' }]}>SAVED VIDEOS</Text>
              </View>
            )}
            {filteredVideos.map((video) => {
              const catColor = getVideoCategoryColor(video.category);
              return (
                <TouchableOpacity
                  key={video.id}
                  style={styles.entryCard}
                  onPress={() => router.push(`/(app)/playbook/video-detail?id=${video.id}` as any)}
                  onLongPress={() => handleDeleteVideo(video)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.entryIcon, { backgroundColor: '#0891b212' }]}>
                    <Ionicons name="play-circle" size={18} color="#0891b2" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.entryMeta}>
                      <Text style={[styles.entryType, { color: catColor }]}>{getVideoCategoryLabel(video.category)}</Text>
                      <Text style={styles.entryDate}>
                        {new Date(video.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                      {video.favorite && <Ionicons name="star" size={10} color="#f59e0b" />}
                    </View>
                    <Text style={styles.entryTitle} numberOfLines={1}>{video.title}</Text>
                    {video.notes.length > 0 && <Text style={styles.entryBody} numberOfLines={1}>{video.notes}</Text>}
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* No results for current filter/search */}
        {isFilterEmpty && (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={24} color={colors.textMuted} />
            <Text style={styles.noResultsText}>
              {search.trim()
                ? `No results for "${search}"${filter !== 'all' ? ` in ${filterLabel}` : ''}.`
                : `No ${filterLabel.toLowerCase()} entries yet.`}
            </Text>
          </View>
        )}
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  addBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: ACCENT + '15', alignItems: 'center', justifyContent: 'center',
  },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 10, marginBottom: 4,
    paddingHorizontal: 12, paddingVertical: 9,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0 },

  chipRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: ACCENT + '15', borderColor: ACCENT + '30' },
  chipText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },

  content: { padding: 16, paddingBottom: 60, gap: 8 },

  // Quick create
  quickRow: { gap: 6, paddingBottom: 8, marginBottom: 4 },
  quickBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8,
    backgroundColor: colors.surface, borderWidth: 1,
  },
  quickBtnText: { fontSize: 11, fontWeight: '700' },

  // Entry cards
  entryCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 12,
  },
  entryIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  entryMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  entryType: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  entryDate: { fontSize: 9, fontWeight: '600', color: colors.textMuted },
  entryTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },
  entryBody: { fontSize: 12, color: colors.textMuted, lineHeight: 17, marginTop: 2 },
  entryTags: { flexDirection: 'row', gap: 4, marginTop: 4 },
  miniTag: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3 },
  miniTagText: { fontSize: 8, fontWeight: '700' },

  // Section divider
  sectionDivider: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 4 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },

  // Empty states
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  emptyDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19, paddingHorizontal: 16 },
  noResults: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  noResultsText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 19 },
});

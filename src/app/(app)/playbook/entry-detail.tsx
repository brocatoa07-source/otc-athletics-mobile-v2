/**
 * Entry Detail — View a playbook entry with edit/favorite/delete actions.
 */

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  loadPlaybookEntries, deletePlaybookEntry, toggleEntryFavorite,
  getEntryTypeMeta, type PlaybookEntry,
} from '@/data/playbook';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<PlaybookEntry | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      loadPlaybookEntries().then((all) => {
        setEntry(all.find((e) => e.id === id) ?? null);
      });
    }, [id]),
  );

  if (!entry) return null;

  const meta = getEntryTypeMeta(entry.type);

  async function handleFavorite() {
    await toggleEntryFavorite(entry!.id);
    setEntry((prev) => prev ? { ...prev, favorite: !prev.favorite } : prev);
  }

  function handleDelete() {
    Alert.alert('Delete Entry', `Delete "${entry!.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => { await deletePlaybookEntry(entry!.id); router.back(); },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={styles.typeBadge}>
            <Ionicons name={meta.icon as any} size={12} color={meta.color} />
            <Text style={[styles.typeLabel, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>{entry.title}</Text>
        </View>
        <TouchableOpacity onPress={handleFavorite} style={styles.favBtn}>
          <Ionicons
            name={entry.favorite ? 'star' : 'star-outline'}
            size={22}
            color={entry.favorite ? '#f59e0b' : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date */}
        <Text style={styles.date}>
          {new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>

        {/* Body */}
        <View style={styles.bodyCard}>
          <Text style={styles.bodyText}>{entry.body || 'No content.'}</Text>
        </View>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <View style={styles.tagRow}>
            {entry.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: meta.color + '12' }]}>
                <Text style={[styles.tagText, { color: meta.color }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Meta */}
        {entry.meta && (
          <View style={styles.metaCard}>
            <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{entry.meta}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push(`/(app)/playbook/new-entry?type=${entry.type}&id=${entry.id}` as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil-outline" size={16} color={meta.color} />
            <Text style={[styles.editBtnText, { color: meta.color }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
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
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  typeLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, marginTop: 2 },
  favBtn: { padding: 4 },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  date: { fontSize: 12, color: colors.textMuted },
  bodyCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16,
  },
  bodyText: { fontSize: 15, color: colors.textPrimary, lineHeight: 23 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: '700' },
  metaCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12,
    backgroundColor: colors.surface, borderRadius: radius.md,
  },
  metaText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: radius.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  editBtnText: { fontSize: 13, fontWeight: '700' },
  deleteBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.error + '30',
  },
  deleteBtnText: { fontSize: 13, fontWeight: '700', color: colors.error },
});

/**
 * Mobility Library — Master movement database.
 *
 * Searchable, filterable grid of every individual movement in the Mobility Bank.
 * Athletes can browse by body region category or search by name/cue.
 */

import { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  LIBRARY_CATEGORIES,
  filterLibraryDrills,
  getPrimaryCategory,
  formatDosage,
  DRILL_TYPE_LABELS,
} from '@/data/mobility-vault/library';

const ACCENT = '#0891b2';

export default function MobilityLibraryScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const drills = useMemo(
    () => filterLibraryDrills(activeCategory, search),
    [activeCategory, search],
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MOBILITY BANK</Text>
          <Text style={styles.headerTitle}>Movement Library</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{drills.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movements..."
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

      {/* Category Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <TouchableOpacity
          style={[styles.chip, !activeCategory && styles.chipActive]}
          onPress={() => setActiveCategory(null)}
        >
          <Text style={[styles.chipText, !activeCategory && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {LIBRARY_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.chip,
              activeCategory === cat.key && { backgroundColor: cat.color + '20', borderColor: cat.color + '40' },
            ]}
            onPress={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
          >
            <Ionicons
              name={cat.icon as any}
              size={12}
              color={activeCategory === cat.key ? cat.color : colors.textMuted}
            />
            <Text
              style={[
                styles.chipText,
                activeCategory === cat.key && { color: cat.color },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Drill List */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {drills.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={32} color={colors.textMuted} />
            <Text style={styles.emptyText}>No movements found</Text>
          </View>
        )}

        {drills.map((drill) => {
          const cat = getPrimaryCategory(drill);
          const typeLabel = DRILL_TYPE_LABELS[drill.drillType] ?? drill.drillType;
          const dosage = formatDosage(drill);

          return (
            <TouchableOpacity
              key={drill.id}
              style={styles.card}
              onPress={() => router.push(`/(app)/training/sc/mobility/movement?id=${drill.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{drill.title}</Text>
                  <Text style={styles.cardSub}>{cat.label} · {typeLabel}</Text>
                </View>
                <View style={styles.dosageBadge}>
                  <Text style={styles.dosageText}>{dosage}</Text>
                </View>
              </View>
              <Text style={styles.cardCue} numberOfLines={2}>{drill.coachingCue}</Text>
              {drill.difficulty === 'intermediate' && (
                <View style={styles.diffBadge}>
                  <Text style={styles.diffText}>Intermediate</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
  countBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    backgroundColor: ACCENT + '15',
  },
  countText: { fontSize: 12, fontWeight: '900', color: ACCENT },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md,
  },
  searchInput: {
    flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0,
  },

  chipRow: {
    paddingHorizontal: 16, paddingVertical: 8, gap: 6,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: ACCENT + '20', borderColor: ACCENT + '40',
  },
  chipText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  chipTextActive: { color: ACCENT },

  list: { padding: 16, paddingBottom: 60, gap: 8 },

  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14, gap: 6,
  },
  cardTop: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  catDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  cardSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  dosageBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  dosageText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
  cardCue: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },
  diffBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
    backgroundColor: '#f59e0b15', borderWidth: 1, borderColor: '#f59e0b30',
  },
  diffText: { fontSize: 9, fontWeight: '800', color: '#f59e0b' },

  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 14, color: colors.textMuted },
});

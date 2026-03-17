import { useState, useMemo, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { getAllTemplates } from '@/data/otcs-program';
import {
  OTCS_ALL_BLOCKS,
  type OtcsArchetype,
  type OtcsBlockKey,
  type OtcsDayKey,
} from '@/data/otcs-types';

/* ─── Category → Block Key Mapping (SCOPED) ─────── */

const CATEGORY_BLOCKS: Record<string, OtcsBlockKey[]> = {
  exercises: ['main-strength', 'antagonist', 'accessory-circuit', 'rotational-core', 'shoulder-durability'],
  mobility: ['shoulder-durability', 'sprint-warmup', 'sprint-cooldown'],
  power: ['plyometrics', 'loaded-power'],
  conditioning: ['sprint-drills', 'sprint-work'],
};

const CATEGORY_META: Record<string, { title: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  exercises: { title: 'Exercise Library', icon: 'barbell-outline', color: '#3b82f6' },
  mobility: { title: 'Mobility Bank', icon: 'body-outline', color: '#22c55e' },
  power: { title: 'Power Drills', icon: 'flash-outline', color: '#f59e0b' },
  conditioning: { title: 'Conditioning', icon: 'heart-outline', color: '#ef4444' },
};

/* ─── Subcategory definitions per tab ────────────── */

interface SubcategoryDef { key: string; label: string }

const SUBCATEGORIES: Record<string, SubcategoryDef[]> = {
  exercises: [
    { key: 'all', label: 'All' },
    { key: 'lower', label: 'Lower Body Strength' },
    { key: 'upper', label: 'Upper Body Strength' },
    { key: 'full-body', label: 'Unilateral Strength' },
    { key: 'accessory', label: 'Accessory / Durability' },
    { key: 'rotational-core', label: 'Rotational Core' },
    { key: 'shoulder', label: 'Shoulder Durability' },
  ],
  mobility: [
    { key: 'all', label: 'All' },
    { key: 'hip', label: 'Hip Mobility' },
    { key: 'shoulder', label: 'Shoulder Mobility' },
    { key: 'thoracic', label: 'Thoracic / T-Spine' },
    { key: 'ankle', label: 'Ankle / Foot' },
    { key: 'warmup', label: 'Warm-Up Prep' },
    { key: 'recovery', label: 'Recovery Mobility' },
  ],
  power: [
    { key: 'all', label: 'All' },
    { key: 'plyometrics', label: 'Plyometrics' },
    { key: 'loaded', label: 'Loaded Power' },
    { key: 'rotational', label: 'Rotational Power' },
    { key: 'acceleration', label: 'Acceleration Power' },
    { key: 'lateral', label: 'Lateral Power' },
  ],
  conditioning: [
    { key: 'all', label: 'All' },
    { key: 'sprint', label: 'Sprint Conditioning' },
    { key: 'tempo', label: 'Tempo Runs' },
    { key: 'cod', label: 'Change of Direction' },
    { key: 'aerobic', label: 'Aerobic Base' },
    { key: 'recovery', label: 'Recovery Conditioning' },
  ],
};

/* ─── Keyword matchers for fine-grained subcats ──── */

const KW: Record<string, Record<string, RegExp>> = {
  mobility: {
    hip: /hip|adductor|pigeon|90\/90|groin|glute|couch\s*stretch|hamstring\s*stretch/i,
    shoulder: /shoulder|scap|rotator|band\s*pull|external\s*rot|internal\s*rot|face\s*pull/i,
    thoracic: /thoracic|t-spine|cat.cow|book\s*open|windmill|open\s*book/i,
    ankle: /ankle|calf|tib|achilles|foot|soleus/i,
  },
  power: {
    rotational: /rotat|med\s*ball|twist|chop|shotput|scoop|slam/i,
    acceleration: /sled|resisted|sprint|acceleration|push\s*start/i,
    lateral: /lateral|shuffle|crossover|side.*bound|skater/i,
  },
  conditioning: {
    tempo: /tempo|jog|easy\s*run|aerobic\s*run/i,
    cod: /shuttle|agility|lateral\s*run|cut|change.*dir|pro\s*agility|5-10-5/i,
    aerobic: /aerobic|base|steady\s*state/i,
    recovery: /recovery|cool.*down|walk|light/i,
  },
};

/* ─── Types ──────────────────────────────────────── */

const ARCHETYPES: OtcsArchetype[] = ['static', 'spring', 'hybrid'];

interface UniqueExercise {
  name: string;
  cue: string;
  sets: string;
  blockKey: OtcsBlockKey;
  blockLabel: string;
  dayKey: OtcsDayKey;
  subcategory: string;
}

/* ─── Subcategory assignment ─────────────────────── */

function assignSubcategory(
  category: string,
  blockKey: OtcsBlockKey,
  dayKey: OtcsDayKey,
  name: string,
): string {
  if (category === 'exercises') {
    if (blockKey === 'accessory-circuit') return 'accessory';
    if (blockKey === 'rotational-core') return 'rotational-core';
    if (blockKey === 'shoulder-durability') return 'shoulder';
    if (dayKey === 'lower-accel') return 'lower';
    if (dayKey === 'upper-shoulder') return 'upper';
    return 'full-body';
  }

  if (category === 'mobility') {
    if (blockKey === 'sprint-warmup') {
      for (const [k, re] of Object.entries(KW.mobility)) { if (re.test(name)) return k; }
      return 'warmup';
    }
    if (blockKey === 'sprint-cooldown') {
      for (const [k, re] of Object.entries(KW.mobility)) { if (re.test(name)) return k; }
      return 'recovery';
    }
    if (blockKey === 'shoulder-durability') return 'shoulder';
    return 'warmup';
  }

  if (category === 'power') {
    if (blockKey === 'loaded-power') return 'loaded';
    for (const [k, re] of Object.entries(KW.power)) { if (re.test(name)) return k; }
    return 'plyometrics';
  }

  if (category === 'conditioning') {
    for (const [k, re] of Object.entries(KW.conditioning)) { if (re.test(name)) return k; }
    if (blockKey === 'sprint-drills') return 'sprint';
    return 'sprint';
  }

  return 'all';
}

/* ─── Extract & dedupe exercises ─────────────────── */

function extractExercises(filterBlocks: OtcsBlockKey[], category: string): UniqueExercise[] {
  const seen = new Set<string>();
  const result: UniqueExercise[] = [];

  for (const arch of ARCHETYPES) {
    const templates = getAllTemplates(arch);
    for (const month of templates) {
      for (const day of month.days) {
        for (const block of day.blocks) {
          if (!filterBlocks.includes(block.key)) continue;
          for (const ex of block.exercises) {
            if (seen.has(ex.name)) continue;
            seen.add(ex.name);
            const meta = OTCS_ALL_BLOCKS.find((b) => b.key === block.key);
            result.push({
              name: ex.name,
              cue: ex.cue,
              sets: ex.sets,
              blockKey: block.key,
              blockLabel: meta?.label ?? block.key,
              dayKey: day.key,
              subcategory: assignSubcategory(category, block.key, day.key, ex.name),
            });
          }
        }
      }
    }
  }

  return result;
}

/* ─── Component ──────────────────────────────────── */

export default function ExercisesScreen() {
  const { hasFullLifting, isCoach } = useTier();

  // Single/Walk tier guard
  useEffect(() => {
    if (!hasFullLifting && !isCoach) {
      router.replace('/(app)/training/sc' as any);
    }
  }, [hasFullLifting, isCoach]);

  const { category = 'exercises' } = useLocalSearchParams<{ category?: string }>();
  const meta = CATEGORY_META[category] ?? CATEGORY_META.exercises;
  const filterBlocks = CATEGORY_BLOCKS[category] ?? CATEGORY_BLOCKS.exercises;
  const subcategories = SUBCATEGORIES[category] ?? SUBCATEGORIES.exercises;

  const [search, setSearch] = useState('');
  const [activeSubcat, setActiveSubcat] = useState('all');

  const allExercises = useMemo(() => extractExercises(filterBlocks, category), [category]);

  const filtered = useMemo(() => {
    let items = allExercises;
    if (activeSubcat !== 'all') {
      items = items.filter((ex) => ex.subcategory === activeSubcat);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.cue.toLowerCase().includes(q) ||
          ex.blockLabel.toLowerCase().includes(q),
      );
    }
    return items;
  }, [allExercises, activeSubcat, search]);

  const grouped = useMemo(() => {
    const map: Record<string, UniqueExercise[]> = {};
    for (const ex of filtered) {
      if (!map[ex.blockLabel]) map[ex.blockLabel] = [];
      map[ex.blockLabel].push(ex);
    }
    return Object.entries(map);
  }, [filtered]);

  // Only show subcategories that have ≥1 exercise in the full set
  const visibleSubcats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ex of allExercises) {
      counts.set(ex.subcategory, (counts.get(ex.subcategory) ?? 0) + 1);
    }
    return subcategories.filter((s) => s.key === 'all' || (counts.get(s.key) ?? 0) > 0);
  }, [allExercises, subcategories]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={[styles.headerIcon, { backgroundColor: meta.color + '18' }]}>
          <Ionicons name={meta.icon} size={18} color={meta.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{meta.title}</Text>
          <Text style={styles.headerSub}>{filtered.length} exercises</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${meta.title.toLowerCase()}...`}
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Subcategory Filter Pills */}
      {visibleSubcats.length > 2 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {visibleSubcats.map((sub) => {
            const active = activeSubcat === sub.key;
            return (
              <TouchableOpacity
                key={sub.key}
                style={[
                  styles.filterPill,
                  active && { backgroundColor: meta.color, borderColor: meta.color },
                ]}
                onPress={() => setActiveSubcat(sub.key === activeSubcat ? 'all' : sub.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, active && { color: '#fff' }]}>
                  {sub.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {grouped.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySub}>
              {search
                ? `No exercises match "${search}"`
                : 'No exercises in this category'}
            </Text>
          </View>
        ) : (
          grouped.map(([blockLabel, items]) => (
            <View key={blockLabel} style={styles.group}>
              <Text style={styles.groupLabel}>{blockLabel}</Text>
              {items.map((ex) => (
                <View key={ex.name} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  <Text style={styles.exerciseSets}>{ex.sets}</Text>
                  <Text style={styles.exerciseCue}>{ex.cue}</Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Styles ─────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  headerSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },

  /* ── Search ─────────────────────────────────────── */
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg,
  },
  searchInput: {
    flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0,
  },

  /* ── Filter Pills ───────────────────────────────── */
  filterRow: {
    paddingHorizontal: 16, paddingVertical: 8, gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterPillText: {
    fontSize: 12, fontWeight: '700', color: colors.textSecondary,
  },

  /* ── Content ────────────────────────────────────── */
  content: { padding: 16, paddingBottom: 60, gap: 20 },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  emptySub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },

  group: { gap: 8 },
  groupLabel: {
    fontSize: 11, fontWeight: '900', letterSpacing: 1.2,
    color: colors.textMuted, textTransform: 'uppercase',
    marginBottom: 2,
  },
  exerciseCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 4,
  },
  exerciseName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  exerciseSets: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  exerciseCue: { fontSize: 12, color: colors.textMuted, lineHeight: 17, marginTop: 2 },
});

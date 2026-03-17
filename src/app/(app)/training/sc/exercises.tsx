import { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { getAllTemplates } from '@/data/otcs-program';
import {
  OTCS_ALL_BLOCKS,
  type OtcsArchetype,
  type OtcsBlockKey,
  type OtcsExercise,
} from '@/data/otcs-types';

/* ─── Category → Block Key Mapping ───────────────── */

const CATEGORY_BLOCKS: Record<string, OtcsBlockKey[]> = {
  exercises: [], // empty = all blocks
  mobility: ['shoulder-durability', 'sprint-warmup', 'sprint-cooldown'],
  power: ['plyometrics', 'loaded-power'],
  conditioning: ['sprint-drills', 'sprint-work', 'accessory-circuit'],
};

const CATEGORY_META: Record<string, { title: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  exercises: { title: 'Exercise Library', icon: 'barbell-outline', color: '#3b82f6' },
  mobility: { title: 'Mobility Bank', icon: 'body-outline', color: '#22c55e' },
  power: { title: 'Power Drills', icon: 'flash-outline', color: '#f59e0b' },
  conditioning: { title: 'Conditioning', icon: 'heart-outline', color: '#ef4444' },
};

const ARCHETYPES: OtcsArchetype[] = ['static', 'spring', 'hybrid'];

interface UniqueExercise {
  name: string;
  cue: string;
  sets: string;
  blockKey: OtcsBlockKey;
  blockLabel: string;
}

function extractExercises(filterBlocks: OtcsBlockKey[]): UniqueExercise[] {
  const seen = new Set<string>();
  const result: UniqueExercise[] = [];

  for (const arch of ARCHETYPES) {
    const templates = getAllTemplates(arch);
    for (const month of templates) {
      for (const day of month.days) {
        for (const block of day.blocks) {
          // Filter by category blocks (empty = all)
          if (filterBlocks.length > 0 && !filterBlocks.includes(block.key)) continue;

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
            });
          }
        }
      }
    }
  }

  return result;
}

export default function ExercisesScreen() {
  const { category = 'exercises' } = useLocalSearchParams<{ category?: string }>();
  const meta = CATEGORY_META[category] ?? CATEGORY_META.exercises;
  const filterBlocks = CATEGORY_BLOCKS[category] ?? [];

  const exercises = useMemo(() => extractExercises(filterBlocks), [category]);

  // Group by block
  const grouped = useMemo(() => {
    const map: Record<string, UniqueExercise[]> = {};
    for (const ex of exercises) {
      if (!map[ex.blockLabel]) map[ex.blockLabel] = [];
      map[ex.blockLabel].push(ex);
    }
    return Object.entries(map);
  }, [exercises]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={[styles.headerIcon, { backgroundColor: meta.color + '18' }]}>
          <Ionicons name={meta.icon} size={18} color={meta.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{meta.title}</Text>
          <Text style={styles.headerSub}>{exercises.length} exercises</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {grouped.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No exercises found</Text>
            <Text style={styles.emptySub}>This section doesn't have content yet.</Text>
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
  content: { padding: 16, paddingBottom: 60, gap: 20 },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  emptySub: { fontSize: 13, color: colors.textSecondary },

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

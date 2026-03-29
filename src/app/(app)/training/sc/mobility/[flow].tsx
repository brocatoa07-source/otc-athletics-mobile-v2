/**
 * Flow Detail Screen — Shows a single flow with all its drills.
 *
 * Route: /(app)/training/sc/mobility/[flow] where [flow] is the flow slug
 */

import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { FLOWS } from '@/data/mobility-vault/flows';
import { DRILL_LIBRARY } from '@/data/mobility-vault/drills';
import { MOBILITY_VAULT_CATEGORIES } from '@/data/mobility-vault/categories';
import type { FlowDrillEntry, Drill } from '@/data/mobility-vault/types';

export default function FlowDetailScreen() {
  const { flow: flowSlug } = useLocalSearchParams<{ flow: string }>();
  const flowData = FLOWS.find((f) => f.slug === flowSlug);
  const [completedDrills, setCompletedDrills] = useState<Set<number>>(new Set());

  if (!flowData) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Flow Not Found</Text>
        </View>
        <View style={styles.empty}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.textMuted} />
          <Text style={styles.emptyText}>This flow could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const catMeta = MOBILITY_VAULT_CATEGORIES.find((c) => c.slug === flowData.category);
  const accent = catMeta?.color ?? '#0891b2';
  const totalDrills = flowData.drills.filter((d) => !d.optional).length;
  const completedCount = flowData.drills.filter((d, i) => !d.optional && completedDrills.has(i)).length;

  function toggleDrill(index: number) {
    setCompletedDrills((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: accent }]}>
            {catMeta?.title.toUpperCase() ?? 'FLOW'}
          </Text>
          <Text style={styles.headerTitle}>{flowData.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View style={[styles.heroCard, { borderColor: accent + '25' }]}>
          <View style={styles.heroRow}>
            <View style={[styles.heroIcon, { backgroundColor: accent + '15' }]}>
              <Ionicons name={catMeta?.icon as any ?? 'body-outline'} size={24} color={accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroPurpose}>{flowData.purpose}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={accent} />
              <Text style={styles.metaText}>{flowData.durationMinutes} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="speedometer-outline" size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>{flowData.intensity}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="barbell-outline" size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>{flowData.drills.length} drills</Text>
            </View>
          </View>

          {flowData.whenToUse && (
            <View style={styles.whenCard}>
              <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
              <Text style={styles.whenText}>{flowData.whenToUse}</Text>
            </View>
          )}
        </View>

        {/* Breathing prescription */}
        {flowData.breathingPrescription && (
          <View style={styles.breathCard}>
            <Ionicons name="leaf-outline" size={14} color="#8b5cf6" />
            <Text style={styles.breathText}>{flowData.breathingPrescription}</Text>
          </View>
        )}

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={[styles.sectionLabel, { color: accent }]}>DRILLS</Text>
          <Text style={styles.progressText}>{completedCount}/{totalDrills}</Text>
        </View>

        {/* Drill cards */}
        {flowData.drills.map((entry, idx) => {
          const drill = DRILL_LIBRARY[entry.drillId];
          if (!drill) return null;
          const done = completedDrills.has(idx);
          return (
            <DrillCard
              key={`${entry.drillId}-${idx}`}
              entry={entry}
              drill={drill}
              index={idx}
              accent={accent}
              done={done}
              onToggle={() => toggleDrill(idx)}
            />
          );
        })}

        {/* Coach notes */}
        {flowData.coachNotes && (
          <View style={styles.coachCard}>
            <Ionicons name="bulb-outline" size={14} color="#f59e0b" />
            <Text style={styles.coachText}>{flowData.coachNotes}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Drill Card ──────────────────────────────────────────────────────────────

function DrillCard({
  entry, drill, index, accent, done, onToggle,
}: {
  entry: FlowDrillEntry; drill: Drill; index: number;
  accent: string; done: boolean; onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // Determine display values (entry overrides > drill defaults)
  const reps = entry.reps ?? drill.defaultReps;
  const timeSec = entry.timeSec ?? drill.defaultTimeSec;
  const breaths = entry.breaths ?? drill.defaultBreaths;
  const sides = entry.sides ?? drill.defaultSides;
  const cue = entry.coachingCueOverride ?? drill.coachingCue;

  let dosage = '';
  if (drill.timingUnit === 'reps' && reps) dosage = `${reps} reps`;
  else if (drill.timingUnit === 'seconds' && timeSec) dosage = `${timeSec}s hold`;
  else if (drill.timingUnit === 'breaths' && breaths) dosage = `${breaths} breaths`;
  if (sides === 2) dosage += ' / side';

  return (
    <View style={[styles.drillCard, done && { borderColor: '#22c55e30', backgroundColor: '#22c55e06' }]}>
      <TouchableOpacity
        style={styles.drillHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <TouchableOpacity onPress={onToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <View style={[styles.check, done && { backgroundColor: '#22c55e', borderColor: '#22c55e' }]}>
            {done && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.drillTitle, done && { color: colors.textMuted }]}>{drill.title}</Text>
          <Text style={styles.drillDosage}>{dosage}</Text>
        </View>

        {entry.optional && (
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>Optional</Text>
          </View>
        )}

        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.drillBody}>
          <Text style={styles.drillInstruction}>{drill.athleteInstruction}</Text>

          <View style={[styles.drillCue, { backgroundColor: accent + '10', borderColor: accent + '20' }]}>
            <Ionicons name="mic-outline" size={13} color={accent} />
            <Text style={[styles.drillCueText, { color: accent }]}>{cue}</Text>
          </View>

          {entry.transitionNote && (
            <Text style={styles.transitionNote}>→ {entry.transitionNote}</Text>
          )}
        </View>
      )}
    </View>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 10 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 14, color: colors.textSecondary },

  /* Hero */
  heroCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 10,
  },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heroIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  heroPurpose: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, lineHeight: 20 },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  whenCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    padding: 10, backgroundColor: colors.bg, borderRadius: radius.sm,
  },
  whenText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  /* Breathing */
  breathCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 12, backgroundColor: '#8b5cf608', borderWidth: 1, borderColor: '#8b5cf620',
    borderRadius: radius.md,
  },
  breathText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },

  /* Progress */
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  progressText: { fontSize: 12, fontWeight: '800', color: colors.textMuted },

  /* Drill card */
  drillCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, overflow: 'hidden',
  },
  drillHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14,
  },
  check: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5,
    borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center',
  },
  drillTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  drillDosage: { fontSize: 11, fontWeight: '600', color: colors.textMuted, marginTop: 1 },
  optionalBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  optionalText: { fontSize: 9, fontWeight: '700', color: colors.textMuted },

  drillBody: {
    paddingHorizontal: 14, paddingBottom: 14, gap: 8,
    borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10,
  },
  drillInstruction: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  drillCue: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 10, borderWidth: 1, borderRadius: radius.sm,
  },
  drillCueText: { flex: 1, fontSize: 12, fontWeight: '700', lineHeight: 16 },
  transitionNote: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },

  /* Coach */
  coachCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.md, marginTop: 4,
  },
  coachText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },
});

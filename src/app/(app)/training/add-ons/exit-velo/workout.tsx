/**
 * Exit Velocity Program — Workout View
 *
 * Full training day with tee swings + exercise blocks.
 * Tee work is displayed first (trained while fresh).
 * Athlete can mark workout complete at the bottom.
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { getWeek } from '@/data/exit-velo-program/program';
import { getPhaseForWeek } from '@/data/exit-velo-program/product';
import { loadProgress, completeDay, isDayComplete, type ProgramProgress } from '@/data/exit-velo-program/progress';

const ACCENT = '#E10600';

const CATEGORY_COLORS: Record<string, string> = {
  tee_work: '#E10600',
  plyometric: '#f59e0b',
  med_ball: '#ef4444',
  strength: '#3b82f6',
  olympic_lift: '#8b5cf6',
  sprint: '#22c55e',
  core: '#f59e0b',
  accessory: '#0891b2',
  mobility: '#a855f7',
};

export default function WorkoutScreen() {
  const { w, d } = useLocalSearchParams<{ w: string; d: string }>();
  const weekNum = Number(w) || 1;
  const dayNum = (Number(d) || 1) as 1 | 2 | 3;
  const week = getWeek(weekNum);
  const day = week?.days[(dayNum - 1) as 0 | 1 | 2];
  const phase = getPhaseForWeek(weekNum);
  const [progress, setProgress] = useState<ProgramProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProgress().then(setProgress);
    }, []),
  );

  if (!week || !day) return null;

  const done = progress ? isDayComplete(progress, weekNum, dayNum) : false;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>
            WEEK {weekNum} · DAY {dayNum}
          </Text>
          <Text style={styles.headerTitle}>{day.title}</Text>
        </View>
        {done && (
          <View style={styles.doneBadge}>
            <Ionicons name="checkmark-circle" size={14} color={ACCENT} />
            <Text style={styles.doneBadgeText}>Done</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Tee Swings (always first — trained while fresh) ────────────── */}
        <View style={styles.teeBlock}>
          <View style={styles.teeHeader}>
            <Ionicons name="baseball" size={18} color={ACCENT} />
            <Text style={[styles.blockLabel, { color: ACCENT }]}>TEE SWINGS — MAX INTENT</Text>
          </View>
          <Text style={styles.teeNote}>{day.tee.note}</Text>

          {/* Overload */}
          <View style={styles.teeRow}>
            <View style={[styles.batBadge, { backgroundColor: '#ef444420' }]}>
              <Text style={[styles.batBadgeText, { color: '#ef4444' }]}>OVERLOAD</Text>
            </View>
            <Text style={styles.teeRx}>
              {day.tee.overload.sets} × {day.tee.overload.reps} swings
            </Text>
            <Text style={styles.teeDetail}>10–20% heavier than game bat</Text>
          </View>

          {/* Game Bat */}
          <View style={styles.teeRow}>
            <View style={[styles.batBadge, { backgroundColor: '#3b82f620' }]}>
              <Text style={[styles.batBadgeText, { color: '#3b82f6' }]}>GAME BAT</Text>
            </View>
            <Text style={styles.teeRx}>
              {day.tee.gameBat.sets} × {day.tee.gameBat.reps} swings
            </Text>
            <Text style={styles.teeDetail}>Normal competition bat</Text>
          </View>

          {/* Underload */}
          <View style={styles.teeRow}>
            <View style={[styles.batBadge, { backgroundColor: '#22c55e20' }]}>
              <Text style={[styles.batBadgeText, { color: '#22c55e' }]}>UNDERLOAD</Text>
            </View>
            <Text style={styles.teeRx}>
              {day.tee.underload.sets} × {day.tee.underload.reps} swings
            </Text>
            <Text style={styles.teeDetail}>10–20% lighter than game bat</Text>
          </View>

          <View style={styles.teeTotalRow}>
            <Ionicons name="speedometer-outline" size={14} color={ACCENT} />
            <Text style={styles.teeTotalText}>{day.tee.totalSwings} total swings · All max intent</Text>
          </View>
        </View>

        {/* ── Exercise Blocks ────────────────────────────────────────────── */}
        {day.blocks.map((block, bi) => (
          <View key={bi} style={styles.exBlock}>
            <Text style={styles.blockLabel}>{block.label.toUpperCase()}</Text>
            {block.exercises.map((ex) => {
              const catColor = CATEGORY_COLORS[ex.category] ?? colors.textMuted;
              return (
                <View key={ex.id} style={styles.exCard}>
                  <View style={styles.exHeader}>
                    <View style={[styles.exDot, { backgroundColor: catColor }]} />
                    <Text style={styles.exName}>{ex.name}</Text>
                    <Text style={styles.exRx}>{ex.sets}×{ex.reps}</Text>
                  </View>
                  <Text style={styles.exCue}>{ex.coachingCue}</Text>
                  {ex.rest && (
                    <Text style={styles.exRest}>Rest: {ex.rest}</Text>
                  )}
                  {ex.note && (
                    <Text style={styles.exNote}>{ex.note}</Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {/* ── Complete Workout CTA ───────────────────────────────────────── */}
        {!done ? (
          <TouchableOpacity
            style={styles.completeCta}
            onPress={() => {
              Alert.alert('Complete Workout', `Mark Week ${weekNum} Day ${dayNum} as complete?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Complete',
                  onPress: async () => {
                    const updated = await completeDay(weekNum, dayNum);
                    setProgress(updated);
                  },
                },
              ]);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.completeCtaText}>Complete Workout</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBanner}>
            <Ionicons name="checkmark-circle" size={18} color={ACCENT} />
            <Text style={styles.completedText}>Workout completed</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  doneBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    backgroundColor: ACCENT + '15',
  },
  doneBadgeText: { fontSize: 10, fontWeight: '800', color: ACCENT },
  content: { padding: 16, paddingBottom: 60, gap: 14 },

  // ── Tee Block ──
  teeBlock: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  teeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  teeNote: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' },
  teeRow: {
    paddingVertical: 8, gap: 4,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  batBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  batBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  teeRx: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  teeDetail: { fontSize: 11, color: colors.textMuted },
  teeTotalRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border,
  },
  teeTotalText: { fontSize: 12, fontWeight: '700', color: ACCENT },

  // ── Exercise Block ──
  exBlock: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  blockLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  exCard: { paddingVertical: 8, gap: 4, borderTopWidth: 1, borderTopColor: colors.border },
  exHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exDot: { width: 8, height: 8, borderRadius: 4 },
  exName: { flex: 1, fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  exRx: {
    fontSize: 12, fontWeight: '900', color: colors.textSecondary,
    backgroundColor: colors.bg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  exCue: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },
  exRest: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  exNote: { fontSize: 11, color: '#f59e0b', fontStyle: 'italic' },

  // ── Complete ──
  completeCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, backgroundColor: ACCENT,
  },
  completeCtaText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  completedBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: radius.md,
    backgroundColor: ACCENT + '10', borderWidth: 1, borderColor: ACCENT + '25',
  },
  completedText: { fontSize: 14, fontWeight: '800', color: ACCENT },
});

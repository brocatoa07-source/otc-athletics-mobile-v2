/**
 * Exit Velocity Program — Week View
 *
 * Shows the 3 training days for a selected week.
 * Tap a day to open the full workout.
 */

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { getWeek } from '@/data/exit-velo-program/program';
import { getPhaseForWeek } from '@/data/exit-velo-program/product';
import { loadProgress, isDayComplete, type ProgramProgress } from '@/data/exit-velo-program/progress';

const ACCENT = '#E10600';

const DAY_ICONS: Record<string, string> = {
  lower_power_rotation: 'flame-outline',
  rotational_power: 'sync-outline',
  total_body_speed: 'flash-outline',
};

export default function WeekScreen() {
  const { w } = useLocalSearchParams<{ w: string }>();
  const weekNum = Number(w) || 1;
  const week = getWeek(weekNum);
  const phase = getPhaseForWeek(weekNum);
  const [progress, setProgress] = useState<ProgramProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProgress().then(setProgress);
    }, []),
  );

  if (!week) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>
            PHASE {phase.number} — {phase.name.toUpperCase()}
          </Text>
          <Text style={styles.headerTitle}>Week {weekNum}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Phase context */}
        <View style={styles.phaseBar}>
          <Text style={styles.phaseBarText}>{phase.emphasis}</Text>
          <View style={styles.phaseMetaRow}>
            <View style={styles.phaseMeta}>
              <Text style={styles.phaseMetaText}>Med Ball: {phase.medBallWeight}</Text>
            </View>
            {week.isTestWeek && (
              <View style={[styles.phaseMeta, { backgroundColor: ACCENT + '15', borderColor: ACCENT + '30' }]}>
                <Ionicons name="analytics-outline" size={10} color={ACCENT} />
                <Text style={[styles.phaseMetaText, { color: ACCENT }]}>Test Week</Text>
              </View>
            )}
          </View>
        </View>

        {/* Tee Prescription */}
        <View style={styles.teeCard}>
          <Text style={[styles.sectionLabel, { color: ACCENT }]}>TEE SWING PRESCRIPTION</Text>
          <Text style={styles.teeNote}>{week.days[0].tee.note}</Text>
          <View style={styles.teeGrid}>
            <View style={styles.teeItem}>
              <Text style={styles.teeItemLabel}>Overload</Text>
              <Text style={styles.teeItemValue}>
                {week.days[0].tee.overload.sets}×{week.days[0].tee.overload.reps}
              </Text>
            </View>
            <View style={styles.teeItem}>
              <Text style={styles.teeItemLabel}>Game Bat</Text>
              <Text style={styles.teeItemValue}>
                {week.days[0].tee.gameBat.sets}×{week.days[0].tee.gameBat.reps}
              </Text>
            </View>
            <View style={styles.teeItem}>
              <Text style={styles.teeItemLabel}>Underload</Text>
              <Text style={styles.teeItemValue}>
                {week.days[0].tee.underload.sets}×{week.days[0].tee.underload.reps}
              </Text>
            </View>
            <View style={styles.teeItem}>
              <Text style={styles.teeItemLabel}>Total</Text>
              <Text style={[styles.teeItemValue, { color: ACCENT }]}>
                {week.days[0].tee.totalSwings}
              </Text>
            </View>
          </View>
        </View>

        {/* Training Days */}
        <Text style={styles.sectionLabel}>TRAINING DAYS</Text>
        {week.days.map((day) => {
          const done = progress ? isDayComplete(progress, weekNum, day.dayNumber) : false;
          return (
            <TouchableOpacity
              key={day.dayNumber}
              style={[styles.dayCard, done && styles.dayCardDone]}
              onPress={() =>
                router.push(
                  `/(app)/training/add-ons/exit-velo/workout?w=${weekNum}&d=${day.dayNumber}` as any,
                )
              }
              activeOpacity={0.8}
            >
              <View style={[styles.dayIcon, done && { backgroundColor: ACCENT + '20' }]}>
                <Ionicons
                  name={(done ? 'checkmark-circle' : DAY_ICONS[day.dayType] ?? 'barbell-outline') as any}
                  size={22}
                  color={done ? ACCENT : colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dayLabel}>DAY {day.dayNumber}</Text>
                <Text style={styles.dayTitle}>{day.title}</Text>
                <Text style={styles.daySub}>{day.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        {/* Test Week CTA */}
        {week.isTestWeek && (
          <TouchableOpacity
            style={styles.testCta}
            onPress={() => router.push('/(app)/training/add-ons/exit-velo/testing' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="analytics" size={18} color="#fff" />
            <Text style={styles.testCtaText}>Log Exit Velocity Test</Text>
          </TouchableOpacity>
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
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  phaseBar: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, gap: 8,
  },
  phaseBarText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, fontStyle: 'italic' },
  phaseMetaRow: { flexDirection: 'row', gap: 8 },
  phaseMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  phaseMetaText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 4 },

  teeCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  teeNote: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' },
  teeGrid: { flexDirection: 'row', gap: 6 },
  teeItem: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 8, backgroundColor: colors.bg, borderRadius: radius.sm },
  teeItemLabel: { fontSize: 9, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.5 },
  teeItemValue: { fontSize: 15, fontWeight: '900', color: colors.textPrimary },

  dayCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16,
  },
  dayCardDone: { borderColor: ACCENT + '30' },
  dayIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  dayLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  dayTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  daySub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  testCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: radius.md, backgroundColor: ACCENT, marginTop: 4,
  },
  testCtaText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});

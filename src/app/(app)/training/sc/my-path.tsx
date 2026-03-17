import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { loadStrengthProfile, ARCHETYPE_META, POSITION_META, DEFICIENCY_META, type StrengthProfile } from '@/data/strength-profile';
import {
  loadGeneratedProgram,
  loadStrengthProgress,
  getCompletionCount,
  getWorkoutKey,
  type OtcsGeneratedProgram,
  type StrengthProgress,
} from '@/data/strength-program-engine';
import { OTCS_PHASE_META } from '@/data/otcs-types';

const ACCENT = '#1DB954';

export default function SCMyPathScreen() {
  const { hasFullLifting, isCoach } = useTier();
  const [profile, setProfile] = useState<StrengthProfile | null>(null);
  const [program, setProgram] = useState<OtcsGeneratedProgram | null>(null);
  const [progress, setProgress] = useState<StrengthProgress | null>(null);

  // Single/Walk tier guard — redirect to SC home (diagnostic-only gate)
  useEffect(() => {
    if (!hasFullLifting && !isCoach) {
      router.replace('/(app)/training/sc' as any);
    }
  }, [hasFullLifting, isCoach]);

  useEffect(() => {
    loadStrengthProfile().then(setProfile);
    loadGeneratedProgram().then(setProgram);
    loadStrengthProgress().then(setProgress);
  }, []);

  if (!profile || !program || !progress) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>MY PATH</Text>
            <Text style={styles.headerTitle}>Strength Program</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Ionicons name="map-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Program Generated</Text>
          <Text style={styles.emptySub}>
            Complete your strength profile setup to generate your personalized 6-month program.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push('/(app)/training/sc/diagnostics' as any)}
          >
            <Text style={styles.ctaBtnText}>Start Setup</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.bg} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const archMeta = ARCHETYPE_META[profile.archetype];
  const posMeta = POSITION_META[profile.position];
  const defMeta = DEFICIENCY_META[profile.deficiency];
  const completedTotal = getCompletionCount(progress);
  const totalWorkouts = program.months.reduce(
    (sum: number, m) => sum + m.weeks.reduce((ws: number, w) => ws + w.days.length, 0),
    0,
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MY PATH</Text>
          <Text style={styles.headerTitle}>Strength Program</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Profile Summary ─────────────────── */}
        <Text style={styles.sectionLabel}>YOUR PROFILE</Text>
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={[styles.profileDot, { backgroundColor: archMeta.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.profileName, { color: archMeta.color }]}>{archMeta.label}</Text>
              <Text style={styles.profileTagline}>{archMeta.tagline}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name={posMeta.icon as any} size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{posMeta.label}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name={defMeta.icon as any} size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{defMeta.label} Focus</Text>
            </View>
          </View>
        </View>

        {/* ── Progress ────────────────────────── */}
        <Text style={styles.sectionLabel}>PROGRESS</Text>
        <View style={styles.card}>
          <View style={styles.progressRow}>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>{completedTotal}</Text>
              <Text style={styles.progressLabel}>Completed</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>{totalWorkouts}</Text>
              <Text style={styles.progressLabel}>Total</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={[styles.progressValue, { color: ACCENT }]}>
                {totalWorkouts > 0 ? Math.round((completedTotal / totalWorkouts) * 100) : 0}%
              </Text>
              <Text style={styles.progressLabel}>Done</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${totalWorkouts > 0 ? (completedTotal / totalWorkouts) * 100 : 0}%` },
              ]}
            />
          </View>
          <Text style={styles.currentPos}>
            Currently: Month {progress.currentMonth} · Week {progress.currentWeek}
          </Text>
        </View>

        {/* ── Month Overview ──────────────────── */}
        <Text style={styles.sectionLabel}>6-MONTH PLAN</Text>
        {program.months.map((month) => {
          const phaseMeta = OTCS_PHASE_META[month.phase];
          const isCurrent = month.month === progress.currentMonth;
          const monthWorkouts = month.weeks.reduce((s: number, w) => s + w.days.length, 0);
          const monthCompleted = month.weeks.reduce((s: number, w) => {
            return s + w.days.filter((d) =>
              progress.completedWorkouts[getWorkoutKey(month.month, w.weekNumber, d.dayNumber)]
            ).length;
          }, 0);

          return (
            <TouchableOpacity
              key={month.month}
              style={[
                styles.monthCard,
                isCurrent && { borderColor: phaseMeta.color + '60' },
              ]}
              onPress={() => {
                router.push({
                  pathname: '/(app)/training/sc/workout' as any,
                  params: { month: month.month.toString(), week: '1' },
                });
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.monthBadge, { backgroundColor: phaseMeta.color + '20' }]}>
                <Text style={[styles.monthBadgeText, { color: phaseMeta.color }]}>
                  M{month.month}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.monthTitleRow}>
                  <Text style={styles.monthTitle}>{month.title}</Text>
                  {isCurrent && (
                    <View style={[styles.currentBadge, { backgroundColor: phaseMeta.color + '20' }]}>
                      <Text style={[styles.currentBadgeText, { color: phaseMeta.color }]}>Current</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.monthPhase, { color: phaseMeta.color }]}>
                  {month.phaseLabel}
                </Text>
                <Text style={styles.monthProgress}>
                  {monthCompleted}/{monthWorkouts} workouts
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        {/* ── Start Workout CTA ───────────────── */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.push('/(app)/training/sc/workout' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={20} color={colors.bg} />
          <Text style={styles.startBtnText}>Start Today's Workout</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.bg} />
        </TouchableOpacity>

        {/* ── Reset */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => router.push('/(app)/training/sc/position-select' as any)}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={14} color={colors.textMuted} />
          <Text style={styles.resetText}>Update Profile & Regenerate</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  emptySub: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, textAlign: 'center' },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: ACCENT, paddingHorizontal: 20, paddingVertical: 12, borderRadius: radius.md, marginTop: 8,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '800', color: colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  sectionLabel: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 8,
  },

  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 12,
  },

  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileDot: { width: 10, height: 10, borderRadius: 5 },
  profileName: { fontSize: 18, fontWeight: '900' },
  profileTagline: { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 17 },
  divider: { height: 1, backgroundColor: colors.border },
  metaRow: { flexDirection: 'row', gap: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },

  /* Progress */
  progressRow: { flexDirection: 'row', justifyContent: 'space-around' },
  progressStat: { alignItems: 'center' },
  progressValue: { fontSize: 24, fontWeight: '900', color: colors.textPrimary },
  progressLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5, marginTop: 2 },
  progressBar: {
    height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: ACCENT, borderRadius: 3 },
  currentPos: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textAlign: 'center' },

  /* Month cards */
  monthCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  monthBadge: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  monthBadgeText: { fontSize: 14, fontWeight: '900' },
  monthTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  monthTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  currentBadgeText: { fontSize: 10, fontWeight: '800' },
  monthPhase: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  monthProgress: { fontSize: 11, fontWeight: '600', color: colors.textMuted, marginTop: 1 },

  /* Start button */
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: ACCENT, paddingVertical: 14, borderRadius: radius.md, marginTop: 8,
  },
  startBtnText: { fontSize: 15, fontWeight: '800', color: colors.bg },

  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10,
  },
  resetText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
});

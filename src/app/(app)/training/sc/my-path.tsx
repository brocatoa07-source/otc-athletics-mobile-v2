import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useDiagnosticResult } from '@/hooks/useDiagnosticResult';
import { LIFTING_MOVER_TYPES } from '@/data/lifting-mover-type-data';
import {
  loadStrengthProfile,
  POSITION_META,
  DEFICIENCY_META,
  SEASON_PHASE_META,
  STRENGTH_PROFILE_DEFAULTS,
  type StrengthProfile,
} from '@/data/strength-profile';
import {
  loadValidatedProgram,
  loadStrengthProgress,
  regenerateFromProfile,
  getCompletionCount,
  getWorkoutKey,
  type OtcsGeneratedProgram,
  type StrengthProgress,
} from '@/data/strength-program-engine';
import { OTCS_PHASE_META } from '@/data/otcs-types';

const ACCENT = '#1DB954';

export default function SCMyPathScreen() {
  const { hasFullLifting, isCoach } = useTier();
  const { result: moverType } = useDiagnosticResult('sc', 'lifting-mover');
  const [profile, setProfile] = useState<StrengthProfile | null>(null);
  const [program, setProgram] = useState<OtcsGeneratedProgram | null>(null);
  const [progress, setProgress] = useState<StrengthProgress | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  // Single/Walk tier guard — redirect to SC home (diagnostic-only gate)
  useEffect(() => {
    if (!hasFullLifting && !isCoach) {
      router.replace('/(app)/training/sc' as any);
    }
  }, [hasFullLifting, isCoach]);

  useFocusEffect(
    useCallback(() => {
      loadStrengthProfile().then(setProfile);
      loadValidatedProgram().then(setProgram);
      loadStrengthProgress().then(setProgress);
    }, []),
  );

  async function handleRegenerate() {
    setRegenerating(true);
    const newProgram = await regenerateFromProfile();
    if (newProgram) {
      setProgram(newProgram);
      const prog = await loadStrengthProgress();
      setProgress(prog);
    }
    setRegenerating(false);
  }

  // Derive setup progress for display
  const diagDone = !!moverType;
  const moverLabel = moverType ? LIFTING_MOVER_TYPES[moverType]?.name ?? null : null;

  // No profile at all — show clear setup steps
  if (!profile) {
    const setupSteps = [
      { label: 'Athletic Profile Diagnostic', done: diagDone, detail: moverLabel },
      { label: 'Position', done: false, detail: null },
      { label: 'Movement Weakness', done: false, detail: null },
      { label: 'Season Phase', done: false, detail: null },
      { label: 'Training Days / Week', done: false, detail: null },
    ];

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
        <ScrollView contentContainerStyle={styles.setupContent}>
          <View style={styles.setupHero}>
            <Ionicons name="barbell" size={36} color={ACCENT} />
            <Text style={styles.emptyTitle}>Complete Setup to Get Your Plan</Text>
            <Text style={styles.emptySub}>
              Your personalized 6-month lifting program is built from 5 inputs. Complete the setup below to generate it.
            </Text>
          </View>

          {/* Setup progress checklist */}
          <View style={styles.setupCard}>
            <Text style={styles.setupCardLabel}>SETUP PROGRESS</Text>
            {setupSteps.map((step, i) => (
              <View key={i} style={styles.setupRow}>
                <Ionicons
                  name={step.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={step.done ? '#22c55e' : colors.textMuted}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.setupStepLabel, step.done && { color: colors.textPrimary }]}>
                    {step.label}
                  </Text>
                  {step.detail && (
                    <Text style={styles.setupStepDetail}>{step.detail}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* What goes into the program */}
          <View style={styles.setupCard}>
            <Text style={styles.setupCardLabel}>YOUR PROGRAM WILL BE BUILT FROM</Text>
            {[
              { icon: 'body-outline', text: 'Your athletic mover type (how you produce force)' },
              { icon: 'baseball-outline', text: 'Your baseball position (position-specific demands)' },
              { icon: 'fitness-outline', text: 'Your primary movement weakness' },
              { icon: 'calendar-outline', text: 'Your current season phase' },
              { icon: 'time-outline', text: 'How many days per week you train' },
            ].map((item, i) => (
              <View key={i} style={styles.setupInfoRow}>
                <Ionicons name={item.icon as any} size={14} color={ACCENT} />
                <Text style={styles.setupInfoText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => {
              if (!diagDone) {
                router.push('/(app)/training/sc/diagnostics' as any);
              } else {
                router.push('/(app)/training/sc/position-select' as any);
              }
            }}
          >
            <Text style={styles.ctaBtnText}>
              {diagDone ? 'Continue Setup' : 'Start Setup'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={colors.bg} />
          </TouchableOpacity>

          {diagDone && (
            <Text style={styles.setupHint}>
              Diagnostic complete. Next: select your position.
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Profile exists but program is stale/missing — show what changed and offer regen
  if (!program || !progress) {
    const daysLabel = `${profile.daysPerWeek ?? STRENGTH_PROFILE_DEFAULTS.daysPerWeek} days/week`;
    const seasonLabel = SEASON_PHASE_META[profile.seasonPhase ?? STRENGTH_PROFILE_DEFAULTS.seasonPhase]?.label ?? 'Offseason';
    const posLabel = POSITION_META[profile.position]?.label ?? profile.position;
    const defLabel = DEFICIENCY_META[profile.deficiency]?.label ?? profile.deficiency;

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
        <ScrollView contentContainerStyle={styles.setupContent}>
          <View style={styles.setupHero}>
            <Ionicons name="refresh-circle" size={36} color={ACCENT} />
            <Text style={styles.emptyTitle}>Program Needs Regeneration</Text>
            <Text style={styles.emptySub}>
              Your profile is complete, but the plan needs to be regenerated. This happens when setup info changes or an older plan version becomes outdated.
            </Text>
          </View>

          {/* Current profile summary */}
          <View style={styles.setupCard}>
            <Text style={styles.setupCardLabel}>YOUR CURRENT PROFILE</Text>
            {[
              { icon: 'body-outline', label: 'Mover Type', value: moverLabel ?? profile.archetype },
              { icon: 'baseball-outline', label: 'Position', value: posLabel },
              { icon: 'fitness-outline', label: 'Focus Area', value: defLabel },
              { icon: 'calendar-outline', label: 'Season', value: seasonLabel },
              { icon: 'time-outline', label: 'Schedule', value: daysLabel },
            ].map((item, i) => (
              <View key={i} style={styles.setupInfoRow}>
                <Ionicons name={item.icon as any} size={14} color={ACCENT} />
                <Text style={styles.setupInfoLabel}>{item.label}</Text>
                <Text style={styles.setupInfoValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.ctaBtn, regenerating && { opacity: 0.5 }]}
            onPress={handleRegenerate}
            disabled={regenerating}
          >
            <Text style={styles.ctaBtnText}>
              {regenerating ? 'Generating...' : 'Generate Program'}
            </Text>
            {!regenerating && <Ionicons name="flash" size={16} color={colors.bg} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/(app)/training/sc/position-select' as any)}
          >
            <Ionicons name="settings-outline" size={14} color={colors.textMuted} />
            <Text style={styles.secondaryBtnText}>Change Setup</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Use Supabase-backed mover type as canonical source; fall back to profile.archetype
  const canonicalMover = moverType ?? profile.archetype;
  const liftingData = LIFTING_MOVER_TYPES[canonicalMover];
  const posMeta = POSITION_META[profile.position];
  const defMeta = DEFICIENCY_META[profile.deficiency];
  const daysPerWeek = profile.daysPerWeek ?? STRENGTH_PROFILE_DEFAULTS.daysPerWeek;
  const seasonPhase = profile.seasonPhase ?? STRENGTH_PROFILE_DEFAULTS.seasonPhase;
  const seasonMeta = SEASON_PHASE_META[seasonPhase];
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
        {/* ── Lifting Profile ─────────────────── */}
        <Text style={styles.sectionLabel}>LIFTING PROFILE</Text>
        <View style={[styles.card, { borderColor: liftingData.color + '25' }]}>
          <View style={styles.profileRow}>
            <View style={[styles.profileDot, { backgroundColor: liftingData.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.profileName, { color: liftingData.color }]}>{liftingData.name}</Text>
              <Text style={styles.profileTagline}>{liftingData.description.split('.')[0]}.</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={{ gap: 4 }}>
            <Text style={styles.metaLabel}>Strength Tendency</Text>
            <Text style={styles.tendencyText}>{liftingData.primaryCue}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name={posMeta.icon as any} size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{posMeta.label}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name={defMeta.icon as any} size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{defMeta.label}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{daysPerWeek} day{daysPerWeek !== 1 ? 's' : ''}/week</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name={seasonMeta.icon as any} size={14} color={seasonMeta.color} />
              <Text style={[styles.metaText, { color: seasonMeta.color }]}>{seasonMeta.label}</Text>
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
  metaLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  tendencyText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, fontStyle: 'italic' },
  metaRow: { flexDirection: 'row', gap: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  seasonNote: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },

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

  /* Setup states */
  setupContent: { padding: 16, paddingBottom: 60, gap: 14 },
  setupHero: { alignItems: 'center', gap: 10, paddingVertical: 8 },
  setupCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  setupCardLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  setupRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 4,
  },
  setupStepLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  setupStepDetail: { fontSize: 11, fontWeight: '600', color: ACCENT, marginTop: 1 },
  setupInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  setupInfoText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  setupInfoLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, width: 90 },
  setupInfoValue: { flex: 1, fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  setupHint: { fontSize: 12, fontWeight: '700', color: ACCENT, textAlign: 'center' },
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10,
  },
  secondaryBtnText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
});

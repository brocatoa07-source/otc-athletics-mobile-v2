/**
 * Exit Velocity Program — Landing / Purchase / Overview Screen
 *
 * If NOT purchased: shows sales page with product details + purchase CTA.
 * If purchased: shows program overview with phase map, current week, and progress.
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { EV_PROGRAM_META, PHASES, getPhaseForWeek } from '@/data/exit-velo-program/product';
import { PROGRAM_WEEKS } from '@/data/exit-velo-program/program';
import {
  loadProgress, markPurchased, weekCompletionCount, getProgressSummary,
  type ProgramProgress,
} from '@/data/exit-velo-program/progress';

const ACCENT = '#E10600';

export default function ExitVeloHome() {
  const [progress, setProgress] = useState<ProgramProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProgress().then(setProgress);
    }, []),
  );

  if (!progress) return null;

  // ── Not Purchased — Sales Page ──────────────────────────────────────────

  if (!progress.purchased) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>ADD-ON PROGRAM</Text>
            <Text style={styles.headerTitle}>Exit Velocity Program</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="speedometer" size={40} color={ACCENT} />
            </View>
            <Text style={styles.heroTitle}>{EV_PROGRAM_META.name}</Text>
            <Text style={styles.heroPrice}>{EV_PROGRAM_META.price}</Text>
            <Text style={styles.heroTagline}>{EV_PROGRAM_META.tagline}</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionBody}>{EV_PROGRAM_META.description}</Text>
          </View>

          {/* Selling Points */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: ACCENT }]}>WHAT YOU GET</Text>
            {EV_PROGRAM_META.sellingPoints.map((point, i) => (
              <View key={i} style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color={ACCENT} />
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>

          {/* Program Structure */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: ACCENT }]}>12-WEEK STRUCTURE</Text>
            {PHASES.map((phase) => (
              <View key={phase.number} style={styles.phaseRow}>
                <View style={[styles.phaseNum, { backgroundColor: ACCENT + '15' }]}>
                  <Text style={[styles.phaseNumText, { color: ACCENT }]}>{phase.number}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.phaseName}>
                    Weeks {phase.weeks[0]}–{phase.weeks[1]}: {phase.name}
                  </Text>
                  <Text style={styles.phaseEmphasis}>{phase.emphasis}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* What's Included */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: ACCENT }]}>INCLUDED IN THE PROGRAM</Text>
            {[
              { icon: 'baseball-outline', text: 'Overload/underload tee swing progression (3x/week)' },
              { icon: 'flame-outline', text: 'Rotational med ball power work' },
              { icon: 'barbell-outline', text: 'Lower body & total body strength training' },
              { icon: 'flash-outline', text: 'Sprint work & plyometrics' },
              { icon: 'analytics-outline', text: 'Exit velocity testing every 4 weeks' },
              { icon: 'trophy-outline', text: 'Progress tracking & PR history' },
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <Ionicons name={item.icon as any} size={16} color={colors.textSecondary} />
                <Text style={styles.bulletText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Weeks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>36</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>3x</Text>
              <Text style={styles.statLabel}>Per Week</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>60</Text>
              <Text style={styles.statLabel}>Swings/Day</Text>
            </View>
          </View>

          {/* Purchase CTA */}
          <TouchableOpacity
            style={styles.purchaseCta}
            onPress={async () => {
              // TODO: Integrate Stripe payment flow
              Alert.alert(
                'Unlock Program',
                `Purchase the ${EV_PROGRAM_META.name} for ${EV_PROGRAM_META.price}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Unlock',
                    onPress: async () => {
                      const updated = await markPurchased();
                      setProgress(updated);
                    },
                  },
                ],
              );
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="lock-open-outline" size={20} color="#fff" />
            <Text style={styles.purchaseCtaText}>{EV_PROGRAM_META.ctaText} — {EV_PROGRAM_META.price}</Text>
          </TouchableOpacity>

          <Text style={styles.purchaseNote}>One-time purchase. Lifetime access.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Purchased — Program Overview ────────────────────────────────────────

  const currentPhase = getPhaseForWeek(progress.currentWeek);
  const summary = getProgressSummary(progress);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>EXIT VELOCITY PROGRAM</Text>
          <Text style={styles.headerTitle}>Week {progress.currentWeek} · Phase {currentPhase.number}</Text>
        </View>
        <TouchableOpacity
          style={styles.testBtn}
          onPress={() => router.push('/(app)/training/add-ons/exit-velo/testing' as any)}
        >
          <Ionicons name="analytics-outline" size={18} color={ACCENT} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Summary */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Ionicons name="trending-up" size={18} color={ACCENT} />
            <Text style={styles.progressTitle}>Your Progress</Text>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.pStatItem}>
              <Text style={styles.pStatValue}>{summary.completionPct}%</Text>
              <Text style={styles.pStatLabel}>Complete</Text>
            </View>
            <View style={styles.pStatItem}>
              <Text style={styles.pStatValue}>
                {summary.evPR ? `${summary.evPR} mph` : '—'}
              </Text>
              <Text style={styles.pStatLabel}>EV PR</Text>
            </View>
            <View style={styles.pStatItem}>
              <Text style={styles.pStatValue}>
                {summary.evGain !== null ? `+${summary.evGain.toFixed(1)}` : '—'}
              </Text>
              <Text style={styles.pStatLabel}>EV Gain</Text>
            </View>
          </View>
          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${summary.completionPct}%` }]} />
          </View>
          <Text style={styles.progressSub}>
            {summary.totalDaysCompleted} of {summary.totalDays} workouts completed
          </Text>
        </View>

        {/* Current Phase */}
        <View style={styles.phaseCard}>
          <Text style={[styles.sectionLabel, { color: ACCENT }]}>
            PHASE {currentPhase.number} — {currentPhase.name.toUpperCase()}
          </Text>
          <Text style={styles.phaseDesc}>{currentPhase.description}</Text>
          <View style={styles.phaseMeta}>
            <View style={styles.phaseMetaChip}>
              <Text style={styles.phaseMetaText}>Med Ball: {currentPhase.medBallWeight}</Text>
            </View>
            <View style={styles.phaseMetaChip}>
              <Text style={styles.phaseMetaText}>Weeks {currentPhase.weeks[0]}–{currentPhase.weeks[1]}</Text>
            </View>
          </View>
        </View>

        {/* Week Selector */}
        <Text style={styles.sectionLabel}>WEEKLY OVERVIEW</Text>
        {PROGRAM_WEEKS.map((week) => {
          const completed = weekCompletionCount(progress, week.weekNumber);
          const isCurrent = week.weekNumber === progress.currentWeek;
          const weekPhase = getPhaseForWeek(week.weekNumber);

          return (
            <TouchableOpacity
              key={week.weekNumber}
              style={[styles.weekRow, isCurrent && styles.weekRowCurrent]}
              onPress={() => router.push(`/(app)/training/add-ons/exit-velo/week?w=${week.weekNumber}` as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.weekNum, isCurrent && { backgroundColor: ACCENT + '20' }]}>
                <Text style={[styles.weekNumText, isCurrent && { color: ACCENT }]}>
                  {week.weekNumber}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.weekTitle}>
                  Week {week.weekNumber}
                  {week.isTestWeek ? ' · TEST WEEK' : ''}
                </Text>
                <Text style={styles.weekSub}>Phase {weekPhase.number}: {weekPhase.name}</Text>
              </View>
              <View style={styles.weekProgress}>
                {[1, 2, 3].map((d) => (
                  <View
                    key={d}
                    style={[
                      styles.weekDot,
                      progress.completedDays.includes(`W${week.weekNumber}D${d}`)
                        ? styles.weekDotDone
                        : styles.weekDotEmpty,
                    ]}
                  />
                ))}
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  testBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: ACCENT + '15', alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  // ── Sales Page ──
  hero: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  heroIcon: {
    width: 72, height: 72, borderRadius: 22, backgroundColor: ACCENT + '10',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  heroPrice: { fontSize: 28, fontWeight: '900', color: ACCENT },
  heroTagline: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  section: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  sectionBody: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  phaseRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  phaseNum: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  phaseNumText: { fontSize: 13, fontWeight: '900' },
  phaseName: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  phaseEmphasis: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: {
    flex: 1, alignItems: 'center', gap: 2,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingVertical: 14,
  },
  statNum: { fontSize: 18, fontWeight: '900', color: ACCENT },
  statLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },

  purchaseCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: radius.lg, backgroundColor: ACCENT,
  },
  purchaseCtaText: { fontSize: 16, fontWeight: '900', color: '#fff' },
  purchaseNote: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },

  // ── Program Overview ──
  progressCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  progressStats: { flexDirection: 'row', gap: 8 },
  pStatItem: { flex: 1, alignItems: 'center', gap: 2 },
  pStatValue: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  pStatLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  progressBar: {
    height: 6, borderRadius: 3, backgroundColor: colors.bg, overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: ACCENT },
  progressSub: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },

  phaseCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 8,
  },
  phaseDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  phaseMeta: { flexDirection: 'row', gap: 8 },
  phaseMetaChip: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  phaseMetaText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },

  weekRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  weekRowCurrent: { borderColor: ACCENT + '40' },
  weekNum: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  weekNumText: { fontSize: 12, fontWeight: '900', color: colors.textSecondary },
  weekTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  weekSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  weekProgress: { flexDirection: 'row', gap: 4 },
  weekDot: { width: 8, height: 8, borderRadius: 4 },
  weekDotDone: { backgroundColor: ACCENT },
  weekDotEmpty: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
});

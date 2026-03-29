/**
 * Speed Program — Landing / Level Selection / Purchase / Overview
 *
 * Not purchased → shows 3 level cards with purchase CTAs.
 * Purchased → routes to program overview for the purchased level.
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { SPEED_PRODUCTS, SPEED_PHASES, getSpeedPhaseForWeek } from '@/data/speed-program/product';
import { SPEED_PROGRAMS } from '@/data/speed-program/program';
import {
  loadSpeedProgress, markSpeedPurchased, speedWeekCompletionCount, getSpeedProgressSummary,
} from '@/data/speed-program/progress';
import type { SpeedProgress, SpeedLevel } from '@/data/speed-program/types';

const ACCENT = '#22c55e';
const LEVEL_COLORS: Record<SpeedLevel, string> = {
  beginner: '#3b82f6',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

export default function SpeedProgramHome() {
  const [progress, setProgress] = useState<SpeedProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSpeedProgress().then(setProgress);
    }, []),
  );

  if (!progress) return null;

  // ── Not Purchased — Level Selection ──────────────────────────────────────

  if (!progress.purchased) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>ADD-ON PROGRAM</Text>
            <Text style={styles.headerTitle}>Speed Development</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={[styles.heroIcon, { backgroundColor: ACCENT + '15' }]}>
              <Ionicons name="flash" size={40} color={ACCENT} />
            </View>
            <Text style={styles.heroTitle}>12-Week Speed Program</Text>
            <Text style={styles.heroTagline}>
              A real sprint program for baseball athletes. Not conditioning — speed.
            </Text>
          </View>

          {/* What's Included */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: ACCENT }]}>EVERY LEVEL INCLUDES</Text>
            {[
              'Acceleration training (10–20 yd sprints)',
              'Max velocity development (flying sprints, wickets)',
              'Change of direction + deceleration',
              'Baseball transfer speed (steals, curved sprints, game speed)',
              'Sprint plyometrics for speed',
              'Speed testing at Weeks 1, 6, and 12',
              'Progress tracking for all sprint times',
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={14} color={ACCENT} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Level Cards */}
          <Text style={styles.sectionLabel}>CHOOSE YOUR LEVEL</Text>
          {(['beginner', 'intermediate', 'advanced'] as SpeedLevel[]).map((level) => {
            const product = SPEED_PRODUCTS[level];
            const levelColor = LEVEL_COLORS[level];
            return (
              <View key={level} style={[styles.levelCard, { borderColor: levelColor + '30' }]}>
                <View style={styles.levelHeader}>
                  <View style={[styles.levelBadge, { backgroundColor: levelColor + '15' }]}>
                    <Text style={[styles.levelBadgeText, { color: levelColor }]}>
                      {level.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.levelPrice, { color: levelColor }]}>{product.price}</Text>
                </View>
                <Text style={styles.levelName}>{product.name}</Text>
                <Text style={styles.levelDesc}>{product.tagline}</Text>

                {/* Targets */}
                <View style={styles.targetRow}>
                  {product.targets.map((t) => (
                    <View key={t.metric} style={styles.targetChip}>
                      <Text style={styles.targetMetric}>{t.metric}</Text>
                      <Text style={[styles.targetValue, { color: levelColor }]}>
                        {t.low}–{t.high}s
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.levelCta, { backgroundColor: levelColor }]}
                  onPress={() => {
                    Alert.alert(
                      product.name,
                      `Unlock the ${level} speed program for ${product.price}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Unlock',
                          onPress: async () => {
                            const updated = await markSpeedPurchased(level);
                            setProgress(updated);
                          },
                        },
                      ],
                    );
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons name="lock-open-outline" size={16} color="#fff" />
                  <Text style={styles.levelCtaText}>{product.ctaText}</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <Text style={styles.purchaseNote}>One-time purchase. Lifetime access.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Purchased — Program Overview ─────────────────────────────────────────

  const level = progress.level;
  const levelColor = LEVEL_COLORS[level];
  const product = SPEED_PRODUCTS[level];
  const weeks = SPEED_PROGRAMS[level];
  const currentPhase = getSpeedPhaseForWeek(progress.currentWeek);
  const summary = getSpeedProgressSummary(progress);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: levelColor }]}>
            SPEED — {level.toUpperCase()}
          </Text>
          <Text style={styles.headerTitle}>Week {progress.currentWeek} · Phase {currentPhase.number}</Text>
        </View>
        <TouchableOpacity
          style={[styles.testBtn, { backgroundColor: levelColor + '15' }]}
          onPress={() => router.push('/(app)/training/add-ons/speed/testing' as any)}
        >
          <Ionicons name="stopwatch-outline" size={18} color={levelColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <View style={[styles.progressCard, { borderColor: levelColor + '30' }]}>
          <View style={styles.progressHeader}>
            <Ionicons name="trending-up" size={18} color={levelColor} />
            <Text style={styles.progressTitle}>Your Progress</Text>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.pStatItem}>
              <Text style={styles.pStatValue}>{summary.completionPct}%</Text>
              <Text style={styles.pStatLabel}>Complete</Text>
            </View>
            <View style={styles.pStatItem}>
              <Text style={styles.pStatValue}>
                {summary.sixtyPR !== null ? `${summary.sixtyPR}s` : '—'}
              </Text>
              <Text style={styles.pStatLabel}>60yd PR</Text>
            </View>
            <View style={styles.pStatItem}>
              <Text style={styles.pStatValue}>
                {summary.sixtyImprove !== null && summary.sixtyImprove > 0
                  ? `-${summary.sixtyImprove.toFixed(2)}s`
                  : '—'}
              </Text>
              <Text style={styles.pStatLabel}>60yd Gain</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${summary.completionPct}%`, backgroundColor: levelColor }]} />
          </View>
          <Text style={styles.progressSub}>
            {summary.totalSessionsCompleted} of {summary.totalSessions} sessions completed
          </Text>
        </View>

        {/* Phase Card */}
        <View style={styles.phaseCard}>
          <Text style={[styles.sectionLabel, { color: levelColor }]}>
            PHASE {currentPhase.number} — {currentPhase.name.toUpperCase()}
          </Text>
          <Text style={styles.phaseDesc}>{currentPhase.description}</Text>
        </View>

        {/* Week Selector */}
        <Text style={styles.sectionLabel}>WEEKLY OVERVIEW</Text>
        {weeks.map((week) => {
          const completed = speedWeekCompletionCount(progress, week.weekNumber);
          const isCurrent = week.weekNumber === progress.currentWeek;
          const weekPhase = getSpeedPhaseForWeek(week.weekNumber);

          return (
            <TouchableOpacity
              key={week.weekNumber}
              style={[styles.weekRow, isCurrent && { borderColor: levelColor + '40' }]}
              onPress={() => router.push(`/(app)/training/add-ons/speed/week?w=${week.weekNumber}` as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.weekNum, isCurrent && { backgroundColor: levelColor + '20' }]}>
                <Text style={[styles.weekNumText, isCurrent && { color: levelColor }]}>
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
                      progress.completedSessions.includes(`W${week.weekNumber}D${d}`)
                        ? [styles.weekDotDone, { backgroundColor: levelColor }]
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
    alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  // ── Sales ──
  hero: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  heroIcon: {
    width: 72, height: 72, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },
  heroTagline: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19, paddingHorizontal: 8 },

  section: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 8,
  },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  levelCard: {
    backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  levelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  levelBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  levelPrice: { fontSize: 20, fontWeight: '900' },
  levelName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  levelDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  targetRow: { flexDirection: 'row', gap: 6 },
  targetChip: {
    flex: 1, alignItems: 'center', gap: 2, paddingVertical: 6,
    backgroundColor: colors.bg, borderRadius: radius.sm,
  },
  targetMetric: { fontSize: 9, fontWeight: '800', color: colors.textMuted },
  targetValue: { fontSize: 12, fontWeight: '900' },
  levelCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: radius.md,
  },
  levelCtaText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  purchaseNote: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },

  // ── Overview ──
  progressCard: {
    backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  progressStats: { flexDirection: 'row', gap: 8 },
  pStatItem: { flex: 1, alignItems: 'center', gap: 2 },
  pStatValue: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  pStatLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: colors.bg, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  progressSub: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },

  phaseCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 8,
  },
  phaseDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  weekRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  weekNum: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  weekNumText: { fontSize: 12, fontWeight: '900', color: colors.textSecondary },
  weekTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  weekSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  weekProgress: { flexDirection: 'row', gap: 4 },
  weekDot: { width: 8, height: 8, borderRadius: 4 },
  weekDotDone: {},
  weekDotEmpty: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
});

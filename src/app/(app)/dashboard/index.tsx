import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTier } from '@/hooks/useTier';
import { useMyProgram } from '@/hooks/useMyProgram';
import { useAccountability } from '@/hooks/useAccountability';
import { useMetricsStatus } from '@/hooks/useMetricsStatus';
import { loadTodayCheckIn, scoreDayCheckIn, type OwnTheCostCheckInLog } from '@/data/own-the-cost-checkin';
import { TierBadge } from '@/components/common/TierBadge';
import { PerformanceTrendCard } from '@/components/dashboard/PerformanceTrendCard';
import { DailyStandardsCard } from '@/components/dashboard/DailyStandardsCard';
import { TodaysMissionHeader } from '@/components/dashboard/TodaysMissionHeader';
import { loadDailyWork, type UnifiedDailyWork } from '@/data/daily-work';
import { filterDailyWorkItems } from '@/lib/tier-content';
import { loadGames } from '@/data/at-bat-accountability';

/* ────────────────────────────────────────────────
 * HOME — COMMAND CENTER (awareness view)
 *
 * Section order:
 *   1. Header (identity + tier)
 *   2. Athlete Status (from OTC Check-In)
 *   3. Daily Standards (always visible)
 *   4. Performance Trend
 * ──────────────────────────────────────────────── */

/* ─── Athlete Status helpers ────────────────────── */

const MAX_OTC_SCORE = 18;

function getReadinessLabel(pct: number): { label: string; color: string } {
  if (pct >= 0.85) return { label: 'Elite', color: '#22c55e' };
  if (pct >= 0.70) return { label: 'Strong', color: '#84cc16' };
  if (pct >= 0.45) return { label: 'Mixed', color: '#f59e0b' };
  return { label: 'Needs Work', color: '#ef4444' };
}

const ENERGY_DISPLAY: Record<string, { label: string; color: string }> = {
  high: { label: 'High', color: '#22c55e' },
  okay: { label: 'Okay', color: '#f59e0b' },
  low:  { label: 'Low', color: '#ef4444' },
};

const FOCUS_DISPLAY: Record<string, { label: string; color: string }> = {
  locked_in:  { label: 'Locked In', color: '#22c55e' },
  in_and_out: { label: 'In & Out', color: '#f59e0b' },
  distracted: { label: 'Distracted', color: '#ef4444' },
};

const OWNERSHIP_DISPLAY: Record<string, { label: string; color: string }> = {
  owned_everything:          { label: 'Owned It', color: '#22c55e' },
  avoided_once_or_twice:     { label: 'Slipped', color: '#f59e0b' },
  avoided_more_than_should:  { label: 'Avoided', color: '#ef4444' },
};

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { isCoach, tier } = useTier();

  // Daily Work state
  const [dailyWork, setDailyWork] = useState<UnifiedDailyWork | null>(null);
  const [showAbCard, setShowAbCard] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState<OwnTheCostCheckInLog | null>(null);

  // Reload dashboard state on every focus (return from other screens)
  useFocusEffect(
    useCallback(() => {
      loadDailyWork().then((plan) => { if (plan) setDailyWork(plan); });
      loadTodayCheckIn().then((log) => { setTodayCheckIn(log); });
      // Show AB card if a game was logged today or yesterday
      loadGames().then((games) => {
        if (games.length === 0) return;
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const yest = new Date(now.getTime() - 86_400_000);
        const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
        setShowAbCard(games.some((g) => g.date === todayStr || g.date === yestStr));
      });
    }, []),
  );

  useMyProgram();
  const { loaded: accountabilityLoaded, otcCheckedInToday } = useAccountability();
  const {
    keyMetrics,
    daysSinceLastKeyMetric,
  } = useMetricsStatus();

  const displayName = user?.user_metadata?.full_name as string | undefined ?? 'Athlete';
  const firstName = displayName.split(' ')[0];
  const tierValue = isCoach ? 'COACH' : (tier ?? 'WALK');

  // Compute daily work completion for CTA hiding
  const dailyWorkAllDone = useMemo(() => {
    if (!dailyWork) return false;
    const filtered = filterDailyWorkItems(dailyWork.items, tier, isCoach);
    if (filtered.length === 0) return false;
    return filtered.every((i) => dailyWork.completion[i.id]);
  }, [dailyWork, tier, isCoach]);

  // Athlete Status derived data
  const athleteStatus = useMemo(() => {
    if (!todayCheckIn) return null;
    const score = scoreDayCheckIn(todayCheckIn);
    const pct = score / MAX_OTC_SCORE;
    const readiness = getReadinessLabel(pct);
    return {
      score,
      pct,
      readiness,
      energy: ENERGY_DISPLAY[todayCheckIn.energy] ?? ENERGY_DISPLAY.okay,
      focus: FOCUS_DISPLAY[todayCheckIn.focus] ?? FOCUS_DISPLAY.in_and_out,
      ownership: OWNERSHIP_DISPLAY[todayCheckIn.responsibilityAvoidance] ?? OWNERSHIP_DISPLAY.owned_everything,
    };
  }, [todayCheckIn]);

  async function handleLogout() {
    await supabase.auth.signOut();
    clearAuth();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()},</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TierBadge tier={tierValue} />
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => router.push('/(app)/profile' as any)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{firstName[0]?.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 0. Today's Mission ─────────────────── */}
        <TodaysMissionHeader tier={tier} isCoach={isCoach} />

        {/* ── 1. Athlete Status ──────────────────── */}
        {athleteStatus ? (
          <TouchableOpacity
            style={styles.statusCard}
            onPress={() => router.push('/(app)/training/own-the-cost-summary' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.statusHeader}>
              <View style={[styles.statusIconWrap, { backgroundColor: athleteStatus.readiness.color + '18' }]}>
                <Ionicons name="pulse-outline" size={18} color={athleteStatus.readiness.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusTitle}>Athlete Status</Text>
                <Text style={styles.statusSub}>Today's check-in</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: athleteStatus.readiness.color + '20' }]}>
                <Text style={[styles.statusBadgeText, { color: athleteStatus.readiness.color }]}>
                  {athleteStatus.readiness.label}
                </Text>
              </View>
            </View>

            {/* Readiness bar */}
            <View style={styles.readinessRow}>
              <Text style={styles.readinessLabel}>Readiness</Text>
              <View style={styles.readinessTrack}>
                <View style={[styles.readinessFill, { width: `${Math.round(athleteStatus.pct * 100)}%`, backgroundColor: athleteStatus.readiness.color }]} />
              </View>
              <Text style={[styles.readinessScore, { color: athleteStatus.readiness.color }]}>
                {athleteStatus.score}/{MAX_OTC_SCORE}
              </Text>
            </View>

            {/* Quick indicators */}
            <View style={styles.indicatorRow}>
              <View style={styles.indicator}>
                <Ionicons name="flash-outline" size={12} color={athleteStatus.energy.color} />
                <Text style={[styles.indicatorText, { color: athleteStatus.energy.color }]}>
                  {athleteStatus.energy.label}
                </Text>
              </View>
              <View style={styles.indicatorDot} />
              <View style={styles.indicator}>
                <Ionicons name="eye-outline" size={12} color={athleteStatus.focus.color} />
                <Text style={[styles.indicatorText, { color: athleteStatus.focus.color }]}>
                  {athleteStatus.focus.label}
                </Text>
              </View>
              <View style={styles.indicatorDot} />
              <View style={styles.indicator}>
                <Ionicons name="shield-checkmark-outline" size={12} color={athleteStatus.ownership.color} />
                <Text style={[styles.indicatorText, { color: athleteStatus.ownership.color }]}>
                  {athleteStatus.ownership.label}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : accountabilityLoaded && !otcCheckedInToday ? (
          <TouchableOpacity
            style={styles.statusCardEmpty}
            onPress={() => router.push('/(app)/training/own-the-cost-checkin' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.statusIconWrap, { backgroundColor: '#f59e0b18' }]}>
              <Ionicons name="pulse-outline" size={18} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>Athlete Status</Text>
              <Text style={styles.statusSub}>Complete your daily check-in to see your readiness</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={24} color="#f59e0b" />
          </TouchableOpacity>
        ) : null}

        {/* ── 2. Daily Standards (always visible) ── */}
        <DailyStandardsCard tier={tier} isCoach={isCoach} />

        {/* ── 3. Required Today (incomplete daily CTAs) ── */}

        {/* OTC Check-In — hidden after completion */}
        {accountabilityLoaded && !otcCheckedInToday && (
          <TouchableOpacity
            style={styles.otcCard}
            onPress={() => router.push('/(app)/training/own-the-cost-checkin' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.otcAccent} />
            <View style={styles.otcBody}>
              <Text style={styles.otcLabel}>OWN THE COST</Text>
              <View style={styles.otcRow}>
                <View style={styles.otcIconWrap}>
                  <Ionicons name="shield-checkmark" size={22} color="#f59e0b" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.otcTitle}>Daily Check-In</Text>
                  <Text style={styles.otcSub}>Hold yourself accountable</Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={28} color="#f59e0b" />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Daily Work — hidden when all items complete */}
        {dailyWork && !dailyWorkAllDone && (() => {
          const filtered = filterDailyWorkItems(dailyWork.items, tier, isCoach);
          const done = filtered.filter((i) => dailyWork.completion[i.id]).length;
          const total = filtered.length;
          return (
            <TouchableOpacity
              style={styles.dailyWorkCard}
              onPress={() => router.push('/(app)/training/mechanical/daily-work' as any)}
              activeOpacity={0.85}
            >
              <View style={styles.dailyWorkAccent} />
              <View style={styles.dailyWorkBody}>
                <Text style={styles.dailyWorkLabel}>TODAY'S WORK</Text>
                <View style={styles.dailyWorkRow}>
                  <View style={styles.dailyWorkIconWrap}>
                    <Ionicons name="flash" size={22} color="#E10600" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dailyWorkTitle}>Daily Work</Text>
                    <Text style={styles.dailyWorkSub}>
                      {done}/{total} complete
                    </Text>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={28} color="#E10600" />
                </View>
                {/* Mini progress bar */}
                <View style={styles.dailyWorkProgress}>
                  <View
                    style={[
                      styles.dailyWorkProgressFill,
                      { width: `${total > 0 ? (done / total) * 100 : 0}%` },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })()}

        {/* At-Bat Accountability — grouped under Today's Work */}
        {showAbCard && (
          <TouchableOpacity
            style={styles.otcCard}
            onPress={() => router.push('/(app)/training/mechanical/at-bat-home' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.otcAccent, { backgroundColor: '#E10600' }]} />
            <View style={styles.otcBody}>
              <Text style={[styles.otcLabel, { color: '#E10600' }]}>TODAY'S WORK</Text>
              <View style={styles.otcRow}>
                <View style={[styles.otcIconWrap, { backgroundColor: '#E1060018' }]}>
                  <Ionicons name="baseball-outline" size={22} color="#E10600" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.otcTitle}>At-Bat Accountability</Text>
                  <Text style={styles.otcSub}>Review your recent game</Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={28} color="#E10600" />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* ── 4. Performance Trend Card ──────────── */}
        <View style={{ marginTop: 12 }}>
          <PerformanceTrendCard
            keyMetrics={keyMetrics}
            daysSinceLastKeyMetric={daysSinceLastKeyMetric}
          />
        </View>

        {/* ── Coach CTA ─────────────────────────── */}
        {isCoach && (
          <TouchableOpacity
            style={styles.coachCta}
            onPress={() => router.push('/(app)/coach' as any)}
          >
            <Ionicons name="shield-checkmark" size={20} color={colors.icon} />
            <Text style={styles.coachCtaText}>Open Coach Hub</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* ── Dev Logout ─────────────────────────── */}
        {__DEV__ && (
          <TouchableOpacity style={styles.devLogout} onPress={handleLogout}>
            <Text style={styles.devLogoutText}>Dev Logout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: { fontSize: 14, color: colors.textMuted, fontWeight: '500' },
  name: { fontSize: 26, fontWeight: '900', color: colors.textPrimary, letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  avatarBtn: {},
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontWeight: '800', fontSize: 14 },

  /* ── Athlete Status Card ───────────────────── */
  statusCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  statusCardEmpty: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#f59e0b30',
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  statusSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '900' },

  readinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  readinessLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, width: 72 },
  readinessTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  readinessFill: { height: 6, borderRadius: 3 },
  readinessScore: { fontSize: 12, fontWeight: '800', width: 36, textAlign: 'right' },

  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  indicatorText: { fontSize: 11, fontWeight: '700' },
  indicatorDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textMuted,
  },

  /* ── OTC Check-In CTA ─────────────────────── */
  otcCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#f59e0b30',
    borderRadius: 14,
    flexDirection: 'row' as const,
    overflow: 'hidden' as const,
    marginBottom: 12,
  },
  otcAccent: { width: 4, backgroundColor: '#f59e0b' },
  otcBody: { flex: 1, padding: 14, gap: 8 },
  otcLabel: { fontSize: 10, fontWeight: '900' as const, letterSpacing: 1.5, color: '#f59e0b' },
  otcRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 },
  otcIconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#f59e0b18', alignItems: 'center' as const, justifyContent: 'center' as const },
  otcTitle: { fontSize: 15, fontWeight: '900' as const, color: colors.textPrimary },
  otcSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  /* ── Daily Work CTA ────────────────────────── */
  dailyWorkCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E1060030',
    borderRadius: 14,
    flexDirection: 'row' as const,
    overflow: 'hidden' as const,
    marginBottom: 12,
  },
  dailyWorkAccent: { width: 4, backgroundColor: '#E10600' },
  dailyWorkBody: { flex: 1, padding: 14, gap: 8 },
  dailyWorkLabel: { fontSize: 10, fontWeight: '900' as const, letterSpacing: 1.5, color: '#E10600' },
  dailyWorkRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 },
  dailyWorkIconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#E1060018', alignItems: 'center' as const, justifyContent: 'center' as const },
  dailyWorkTitle: { fontSize: 15, fontWeight: '900' as const, color: colors.textPrimary },
  dailyWorkSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  dailyWorkProgress: { height: 3, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' as const },
  dailyWorkProgressFill: { height: 3, backgroundColor: '#E10600', borderRadius: 2 },

  /* ── Other ──────────────────────────────────── */
  coachCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  coachCtaText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },

  devLogout: {
    marginTop: 24,
    backgroundColor: colors.error,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  devLogoutText: { color: colors.white, fontWeight: '800', fontSize: 13 },
});

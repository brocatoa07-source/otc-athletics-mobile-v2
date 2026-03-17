import { useEffect, useState } from 'react';
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
import { colors, accentGlow } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { useTier } from '@/hooks/useTier';
import { useMyProgram } from '@/hooks/useMyProgram';
import { useReadiness } from '@/hooks/useReadiness';
import { useAccountability } from '@/hooks/useAccountability';
import { useMetricsStatus } from '@/hooks/useMetricsStatus';
import { useAthleteScProfile } from '@/hooks/useAthleteScProfile';
import { useAssessment } from '@/hooks/useAssessment';
import { useRequiredTodayConfig } from '@/hooks/useRequiredTodayConfig';
import { getNextPriority } from '@/data/next-priority-engine';
import { TierBadge } from '@/components/common/TierBadge';
import { IdentityStandardBanner } from '@/components/dashboard/IdentityStandardBanner';
import { PerformanceTrendCard } from '@/components/dashboard/PerformanceTrendCard';
import { StandardEngineCard } from '@/components/dashboard/StandardEngineCard';
import { RequiredTodayPanel } from '@/components/dashboard/RequiredTodayPanel';
import { loadDailyWork, type UnifiedDailyWork } from '@/data/daily-work';
import { filterDailyWorkItems } from '@/lib/tier-content';
import { loadTodayCheckIn } from '@/data/own-the-cost-checkin';
import { loadGames } from '@/data/at-bat-accountability';

/* ────────────────────────────────────────────────
 * HOME — COMMAND CENTER (awareness view)
 *
 * Section order:
 *   1. Identity + Standard Banner
 *   2. Performance Trend
 *   3. Standard Engine (Accountability + Status)
 *   4. Required Today  ← athlete-customizable
 *   5. Next Priority   ← driven by Required Today config
 * ──────────────────────────────────────────────── */

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { isCoach, tier } = useTier();

  // Daily Work state
  const [dailyWork, setDailyWork] = useState<UnifiedDailyWork | null>(null);
  const [otcCheckedIn, setOtcCheckedIn] = useState<boolean | null>(null);
  const [showAbCard, setShowAbCard] = useState(false);
  useEffect(() => {
    loadDailyWork().then((plan) => { if (plan) setDailyWork(plan); });
    loadTodayCheckIn().then((log) => setOtcCheckedIn(!!log));
    // Show AB card if a game was logged today or yesterday
    loadGames().then((games) => {
      if (games.length === 0) return;
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const yest = new Date(now.getTime() - 86_400_000);
      const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
      setShowAbCard(games.some((g) => g.date === todayStr || g.date === yestStr));
    });
  }, []);

  const { todayPlan, hasProfile, completedToday } = useMyProgram();
  const { readiness } = useReadiness();
  const { result: accountability, skillWorkDoneToday, habitsDoneToday, addonsDoneToday } = useAccountability();
  const { profile: _scProfile } = useAthleteScProfile();
  const { assessment } = useAssessment();
  const { enabled } = useRequiredTodayConfig();
  const {
    developmentStatus,
    standardStatus,
    keyMetrics,
    daysSinceLastKeyMetric,
    isLoading: metricsLoading,
  } = useMetricsStatus();

  const displayName = user?.user_metadata?.full_name as string | undefined ?? 'Athlete';
  const firstName = displayName.split(' ')[0];
  const tierValue = isCoach ? 'COACH' : (tier ?? 'WALK');

  const TIER_LABELS: Record<string, string> = {
    WALK: 'Walk', SINGLE: 'Single', DOUBLE: 'Double',
    TRIPLE: 'Triple', HOME_RUN: 'Home Run', COACH: 'Coach',
  };
  const tierLabel = TIER_LABELS[tierValue] ?? tierValue;

  // Build completions map for Next Up
  const hasTrainingToday = todayPlan?.type === 'training';
  const completions = {
    readiness: !!readiness,
    training:  completedToday,
    skillWork: skillWorkDoneToday,
    mental:    (accountability?.checklist.courseSessionsDone ?? 0) > 0,
    journal:   (accountability?.checklist.journalEntries ?? 0) > 0,
    habits:    habitsDoneToday,
    addons:    addonsDoneToday,
  };

  const metricsRetestDue = daysSinceLastKeyMetric !== null && daysSinceLastKeyMetric >= 28;

  const nextPriority = getNextPriority({
    hasScProfile: hasProfile,
    hasAssessment: !!assessment,
    enabled,
    hasTrainingToday,
    completions,
    metricsRetestDue,
  });

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

        {/* ── Own The Cost Check-In ─────────────── */}
        {otcCheckedIn !== null && (
          <TouchableOpacity
            style={styles.otcCard}
            onPress={() => router.push(
              otcCheckedIn
                ? '/(app)/training/own-the-cost-summary' as any
                : '/(app)/training/own-the-cost-checkin' as any,
            )}
            activeOpacity={0.85}
          >
            <View style={styles.otcAccent} />
            <View style={styles.otcBody}>
              <Text style={styles.otcLabel}>OWN THE COST</Text>
              <View style={styles.otcRow}>
                <View style={styles.otcIconWrap}>
                  {otcCheckedIn ? (
                    <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                  ) : (
                    <Ionicons name="shield-checkmark" size={22} color="#f59e0b" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.otcTitle}>Daily Check-In</Text>
                  <Text style={styles.otcSub}>
                    {otcCheckedIn ? 'Completed — tap to review' : 'Hold yourself accountable'}
                  </Text>
                </View>
                <Ionicons
                  name="arrow-forward-circle"
                  size={28}
                  color={otcCheckedIn ? colors.success : '#f59e0b'}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* ── 0. Daily Work Card ──────────────────── */}
        {dailyWork && (() => {
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

        {/* ── At-Bat Accountability (conditional) ── */}
        {showAbCard && (
          <TouchableOpacity
            style={styles.otcCard}
            onPress={() => router.push('/(app)/training/mechanical/at-bat-home' as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.otcAccent, { backgroundColor: '#E10600' }]} />
            <View style={styles.otcBody}>
              <Text style={[styles.otcLabel, { color: '#E10600' }]}>POST-GAME</Text>
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

        {/* ── 1. Identity + Standard Banner ───────── */}
        <IdentityStandardBanner
          tierLabel={tierLabel}
          developmentStatus={developmentStatus}
          standardStatus={standardStatus}
          isLoading={metricsLoading}
        />

        {/* ── 2. Performance Trend Card ───────────── */}
        <PerformanceTrendCard
          keyMetrics={keyMetrics}
          daysSinceLastKeyMetric={daysSinceLastKeyMetric}
        />

        {/* ── 3. Standard Engine Card ─────────────── */}
        <StandardEngineCard
          accountability={accountability}
          developmentStatus={developmentStatus}
          standardStatus={standardStatus}
        />

        {/* ── 4. Required Today (self-contained) ──── */}
        <Text style={styles.sectionLabel}>REQUIRED TODAY</Text>
        <RequiredTodayPanel />

        {/* ── 5. Next Priority ────────────────────── */}
        <TouchableOpacity
          style={[styles.priorityCard, accentGlow(nextPriority.color, 'subtle')]}
          onPress={() => router.push(nextPriority.route as any)}
          activeOpacity={0.85}
        >
          <View style={styles.priorityAccent} />
          <View style={styles.priorityBody}>
            <Text style={styles.priorityLabel}>NEXT UP</Text>
            <View style={styles.priorityRow}>
              <View style={[styles.priorityIconWrap, { backgroundColor: nextPriority.color + '20' }]}>
                <Ionicons name={nextPriority.icon as any} size={22} color={nextPriority.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.priorityTitle}>{nextPriority.title}</Text>
                <Text style={styles.prioritySub}>{nextPriority.subtitle}</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color={nextPriority.color} />
            </View>
          </View>
        </TouchableOpacity>

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

  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginBottom: 8,
    marginTop: 4,
  },

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

  priorityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 12,
  },
  priorityAccent: { width: 4, backgroundColor: colors.textMuted + '40' },
  priorityBody: { flex: 1, padding: 14, gap: 8 },
  priorityLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textSecondary },
  priorityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  priorityIconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  priorityTitle: { fontSize: 15, fontWeight: '900', color: colors.textPrimary },
  prioritySub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

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

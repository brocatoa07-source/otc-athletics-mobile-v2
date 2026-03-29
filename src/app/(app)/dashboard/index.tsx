import { useCallback, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { useTier } from '@/hooks/useTier';
import { useMyProgram } from '@/hooks/useMyProgram';
import { useAccountability } from '@/hooks/useAccountability';
import { useMetricsStatus } from '@/hooks/useMetricsStatus';
import { TierBadge } from '@/components/common/TierBadge';
import { PerformanceTrendCard } from '@/components/dashboard/PerformanceTrendCard';
import { TodaysTrainingCard } from '@/components/dashboard/TodaysTrainingCard';
import { PRAlertBanner } from '@/components/dashboard/PRAlertBanner';
import { AnnouncementBanner } from '@/components/dashboard/AnnouncementBanner';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { PlaybookCard } from '@/components/dashboard/PlaybookCard';
import { ParentDashboard } from '@/components/dashboard/ParentDashboard';
import { ReadinessSummaryCard } from '@/components/dashboard/ReadinessSummaryCard';
import { ActiveFocusBanner } from '@/components/dashboard/ActiveFocusBanner';
import { loadTodayCheckIn, getStreakInfo, loadCheckIns, getLocalDateString } from '@/data/own-the-cost-checkin';
import {
  getTimeOfDayGreeting,
  selectDynamicMessage,
  getStreakLabel,
  type DashboardMessageContext,
} from '@/lib/dashboard/dashboardInsight';

/* ────────────────────────────────────────────────
 * HOME — COMMAND CENTER
 *
 * Flow:
 *   First open of the day → readiness check-in redirect
 *   After readiness → dashboard with:
 *     1. Dynamic greeting + status message
 *     2. Today's Training (check-off list + streak)
 *     3. OTC Streak card
 *     4. Performance Trends
 * ──────────────────────────────────────────────── */

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const dbUser = useAuthStore((s) => s.dbUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { isCoach, tier } = useTier();

  // Parent users get a dedicated view-only dashboard
  if (dbUser?.role === 'PARENT') return <ParentDashboard />;

  // Track which calendar day we've already redirected for.
  // This prevents re-redirecting on the same day even if hook state flickers.
  const redirectedDateRef = useRef<string | null>(null);

  useMyProgram();
  const { loaded: accountabilityLoaded, otcCheckedInToday, result: accountabilityResult } = useAccountability();
  const { keyMetrics, daysSinceLastKeyMetric } = useMetricsStatus();

  // ── Streak + dynamic message state ──
  const [streakDays, setStreakDays] = useState(0);
  const [missedYesterday, setMissedYesterday] = useState(false);
  const [returningAfterInactivity, setReturningAfterInactivity] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getStreakInfo().then((info) => setStreakDays(info.streak));

      // Check if yesterday was missed and if returning after inactivity
      loadCheckIns().then((logs) => {
        const today = getLocalDateString();
        const todayDate = new Date();
        const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
        const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;

        const hasToday = logs.some((l) => l.date === today);
        const hadYesterday = logs.some((l) => l.date === yesterdayStr);
        setMissedYesterday(!hadYesterday && !hasToday);

        // Returning after inactivity: last log > 3 days ago
        if (logs.length > 0) {
          const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
          const lastDate = sorted[0].date;
          const [y, m, d] = lastDate.split('-').map(Number);
          const lastLogDate = new Date(y, m - 1, d);
          const daysSince = Math.floor((todayDate.getTime() - lastLogDate.getTime()) / 86_400_000);
          setReturningAfterInactivity(daysSince > 3);
        }
      });
    }, []),
  );

  // ── Readiness gate: redirect to check-in ONCE per calendar day ──
  // Uses a date-stamped ref so the redirect only fires once per day,
  // regardless of how many times the dashboard re-focuses or hook state flickers.
  useFocusEffect(
    useCallback(() => {
      if (isCoach || !accountabilityLoaded) return;

      const today = getLocalDateString();

      // Already redirected today — skip
      if (redirectedDateRef.current === today) return;

      // Hook says already checked in — skip
      if (otcCheckedInToday) return;

      // Double-check AsyncStorage (hook may be stale on first focus)
      loadTodayCheckIn().then((log) => {
        if (!log && redirectedDateRef.current !== today) {
          redirectedDateRef.current = today;
          router.push('/(app)/training/own-the-cost-checkin' as any);
        }
      });
    }, [isCoach, accountabilityLoaded, otcCheckedInToday]),
  );

  const displayName = user?.user_metadata?.full_name as string | undefined ?? 'Athlete';
  const firstName = displayName.split(' ')[0];
  const tierValue = isCoach ? 'COACH' : (tier ?? 'WALK');

  // ── Build message context ──
  const weeklyTarget = accountabilityResult?.checklist.workoutsTarget ?? 4;
  const weeklyCompleted = accountabilityResult?.checklist.workoutsCompleted ?? 0;

  // TODO: Wire these from real Supabase data when available
  const hasNewPR = false;
  const prWindowOpen = daysSinceLastKeyMetric !== null && daysSinceLastKeyMetric >= 25;

  const messageCtx: DashboardMessageContext = useMemo(() => ({
    missedYesterday,
    workoutsCompletedThisWeek: weeklyCompleted,
    weeklyWorkoutsTarget: weeklyTarget,
    streakDays,
    hasNewPR,
    prWindowOpen,
    leaderboardDelta: undefined,     // TODO: wire from leaderboard data
    performanceTrend: undefined,     // TODO: wire from performance trend data
    returningAfterInactivity,
  }), [missedYesterday, weeklyCompleted, weeklyTarget, streakDays, hasNewPR, prWindowOpen, returningAfterInactivity]);

  const dynamicMessage = selectDynamicMessage(messageCtx);
  const streakLabel = getStreakLabel(streakDays);

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
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getTimeOfDayGreeting()}</Text>
            <Text style={styles.name}>{firstName}</Text>
            <Text style={styles.dynamicMsg}>{dynamicMessage}</Text>
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

        {/* ── Conditional banners (hidden when nothing to show) ── */}
        {!isCoach && <AnnouncementBanner />}
        {!isCoach && <PRAlertBanner keyMetrics={keyMetrics} />}

        {/* ── Readiness summary (shown after today's check-in is complete) ── */}
        {!isCoach && otcCheckedInToday && <ReadinessSummaryCard />}

        {/* ── Active Hitting Focus (shown when troubleshooting block is active) ── */}
        {!isCoach && <ActiveFocusBanner />}

        {/* ── 1. Today's Training (check-off list + streak) ── */}
        {!isCoach && <TodaysTrainingCard />}

        {/* ── 2. OTC Streak ─────────────────────── */}
        {!isCoach && <StreakCard streakDays={streakDays} streakLabel={streakLabel} />}

        {/* ── 3. Playbook ─────────────────────── */}
        {!isCoach && <PlaybookCard />}

        {/* ── 4. Performance Trends ───────────── */}
        <PerformanceTrendCard
          keyMetrics={keyMetrics}
          daysSinceLastKeyMetric={daysSinceLastKeyMetric}
        />

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
  dynamicMsg: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  avatarBtn: {},
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontWeight: '800', fontSize: 14 },

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

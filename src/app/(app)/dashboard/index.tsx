import { useCallback, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { useTier } from '@/hooks/useTier';
import { useAccountability } from '@/hooks/useAccountability';
import { TierBadge } from '@/components/common/TierBadge';
import { AnnouncementBanner } from '@/components/dashboard/AnnouncementBanner';
import { ParentDashboard } from '@/components/dashboard/ParentDashboard';
import { TrialBanner } from '@/features/billing/TrialBanner';
import { useAccess } from '@/features/billing/useAccess';
import { InlineLock } from '@/features/billing/AccessGate';
import { loadTodayCheckIn, getStreakInfo, loadCheckIns, getLocalDateString } from '@/data/own-the-cost-checkin';
import { isOnboardingComplete } from '@/features/onboarding/onboardingState';
import { getTimeOfDayGreeting } from '@/lib/dashboard/dashboardInsight';
import {
  getProgressionDecision,
  computeWorkoutStreak,
  type ProgressionSnapshot,
} from '@/features/strength/services/feedbackLoop';
import { getProgressionMessage } from '@/features/strength/config/progressionMessages';
import { evaluatePRWindow } from '@/features/strength/services/prWindow';
import {
  generateBehaviorNotifications,
  type BehaviorNotification,
} from '@/features/strength/services/behaviorMessages';

const ACCENT = '#1DB954';

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const dbUser = useAuthStore((s) => s.dbUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { isCoach, tier } = useTier();
  const access = useAccess();

  if (dbUser?.role === 'PARENT') return <ParentDashboard />;

  const redirectedDateRef = useRef<string | null>(null);
  const onboardingCheckedRef = useRef(false);
  const { loaded: accountabilityLoaded, otcCheckedInToday } = useAccountability();

  const [streakDays, setStreakDays] = useState(0);
  const [snapshot, setSnapshot] = useState<ProgressionSnapshot | null>(null);
  const [notifications, setNotifications] = useState<BehaviorNotification[]>([]);
  // missedYesterday is computed inside useFocusEffect and passed directly to notification generator

  // Onboarding redirect — once per session
  useFocusEffect(
    useCallback(() => {
      if (isCoach || onboardingCheckedRef.current) return;
      onboardingCheckedRef.current = true;
      isOnboardingComplete().then((done) => {
        if (!done) router.push('/(app)/onboarding' as any);
      });
    }, [isCoach]),
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [info, snap, stk] = await Promise.all([
          getStreakInfo(),
          getProgressionDecision().catch(() => null),
          computeWorkoutStreak().catch(() => 0),
        ]);
        if (!active) return;
        setStreakDays(info.streak);
        setSnapshot(snap);

        // Check missed yesterday
        const logs = await loadCheckIns();
        const today = getLocalDateString();
        const yd = new Date();
        yd.setDate(yd.getDate() - 1);
        const yesterdayStr = `${yd.getFullYear()}-${String(yd.getMonth() + 1).padStart(2, '0')}-${String(yd.getDate()).padStart(2, '0')}`;
        const hadYesterday = logs.some((l) => l.date === yesterdayStr);
        const hasToday = logs.some((l) => l.date === today);
        const missed = !hadYesterday && !hasToday;

        // Generate behavior notifications
        if (snap) {
          const notifs = generateBehaviorNotifications(snap, stk, missed);
          if (active) setNotifications(notifs);
        }
      })();
      return () => { active = false; };
    }, []),
  );

  // Readiness gate
  useFocusEffect(
    useCallback(() => {
      if (isCoach || !accountabilityLoaded) return;
      const today = getLocalDateString();
      if (redirectedDateRef.current === today) return;
      if (otcCheckedInToday) return;
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

  const isDeload = snapshot?.result.adjustments.some(a => a.note.toLowerCase().includes('deload')) ?? false;
  const coachMsg = snapshot ? getProgressionMessage(snapshot.result.decision, isDeload) : null;
  const prWindow = snapshot ? evaluatePRWindow(snapshot) : null;
  const compliancePct = snapshot ? Math.round(snapshot.compliance.rate * 100) : null;

  async function handleLogout() {
    await supabase.auth.signOut();
    clearAuth();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getTimeOfDayGreeting()}</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TierBadge tier={tierValue} />
            <TouchableOpacity onPress={() => router.push('/(app)/profile' as any)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{firstName[0]?.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trial Banner */}
        {!isCoach && <TrialBanner />}

        {/* Announcements */}
        {!isCoach && <AnnouncementBanner />}

        {/* Dynamic Coaching Message */}
        {coachMsg && (
          <View style={[styles.statusCard, { borderColor: coachMsg.color + '30' }]}>
            <View style={styles.statusRow}>
              <Ionicons name={coachMsg.icon as any} size={16} color={coachMsg.color} />
              <Text style={[styles.statusLabel, { color: coachMsg.color }]}>{coachMsg.title}</Text>
              {streakDays > 0 && (
                <View style={styles.pill}>
                  <Ionicons name="flame" size={10} color="#f97316" />
                  <Text style={styles.pillText}>{streakDays}</Text>
                </View>
              )}
              {snapshot && snapshot.readiness.entries > 0 && (
                <View style={styles.pill}>
                  <Ionicons name="heart" size={10} color="#8b5cf6" />
                  <Text style={styles.pillText}>{snapshot.readiness.avg.toFixed(0)}</Text>
                </View>
              )}
              {compliancePct !== null && (
                <View style={styles.pill}>
                  <Ionicons name="checkmark-done" size={10} color={ACCENT} />
                  <Text style={styles.pillText}>{compliancePct}%</Text>
                </View>
              )}
            </View>
            <Text style={styles.statusMessage}>{coachMsg.message}</Text>
          </View>
        )}

        {/* PR Window */}
        {prWindow?.isOpen && (
          <TouchableOpacity
            style={[styles.prBanner, { borderColor: '#f59e0b40' }]}
            onPress={() => router.push('/(app)/training/sc/exercises' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="trophy" size={18} color="#f59e0b" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.prTitle, { color: '#f59e0b' }]}>PR Window Open</Text>
              <Text style={styles.subText}>{prWindow.message}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Behavior Notifications */}
        {notifications.length > 0 && (
          <View style={styles.notifSection}>
            {notifications.slice(0, 2).map((n) => (
              <TouchableOpacity
                key={n.id}
                style={[styles.notifCard, {
                  borderColor: n.message.tone === 'warning' ? '#ef444430' :
                    n.message.tone === 'positive' ? '#22c55e30' : colors.border,
                }]}
                onPress={() => n.action && router.push(n.action.route as any)}
                activeOpacity={n.action ? 0.75 : 1}
              >
                <Ionicons name={n.message.icon as any} size={14}
                  color={n.message.tone === 'warning' ? '#ef4444' : n.message.tone === 'positive' ? '#22c55e' : '#f59e0b'} />
                <Text style={styles.notifText}>{n.message.text}</Text>
                {n.action && <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Primary CTAs */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={[styles.ctaPrimary, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/daily-work' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="flash" size={20} color="#fff" />
            <Text style={styles.ctaPrimaryText}>Daily Work</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ctaSecondaryRow}>
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={() => router.push('/(app)/weekly-review' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={16} color="#22c55e" />
            <Text style={styles.ctaSecondaryText}>Weekly Review</Text>
          </TouchableOpacity>
        </View>

        {/* 4 Pillars */}
        <Text style={styles.sectionLabel}>YOUR SYSTEM</Text>

        {/* Hitting */}
        <TouchableOpacity
          style={styles.pillarCard}
          onPress={() => router.push('/(app)/training/mechanical' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.pillarIcon, { backgroundColor: '#f9731615' }]}>
            <Ionicons name="baseball-outline" size={20} color="#f97316" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pillarTitle}>Hitting</Text>
            <Text style={styles.subText}>Drills, troubleshooting, approach</Text>
          </View>
          {access.isLocked('hittingVault.useFull') && <InlineLock permission="hittingVault.useFull" />}
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Strength */}
        <TouchableOpacity
          style={styles.pillarCard}
          onPress={() => router.push('/(app)/training/sc' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.pillarIcon, { backgroundColor: '#1DB95415' }]}>
            <Ionicons name="barbell-outline" size={20} color={ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pillarTitle}>Strength</Text>
            <Text style={styles.subText}>Program, lifts, speed, power</Text>
          </View>
          {access.isLocked('strengthVault.useFull') && <InlineLock permission="strengthVault.useFull" />}
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Mental */}
        <TouchableOpacity
          style={styles.pillarCard}
          onPress={() => router.push('/(app)/training/mental' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.pillarIcon, { backgroundColor: '#a855f715' }]}>
            <Ionicons name="bulb-outline" size={20} color="#a855f7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pillarTitle}>Mental</Text>
            <Text style={styles.subText}>Confidence, focus, routines</Text>
          </View>
          {access.isLocked('mentalVault.useFull') && <InlineLock permission="mentalVault.useFull" />}
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Accountability */}
        <TouchableOpacity
          style={styles.pillarCard}
          onPress={() => router.push('/(app)/training/own-the-cost-home' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.pillarIcon, { backgroundColor: '#6b728015' }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#6b7280" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pillarTitle}>Accountability</Text>
            <Text style={styles.subText}>Check-in, streak, standards</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Quick Links */}
        <Text style={styles.sectionLabel}>QUICK ACCESS</Text>

        <View style={styles.quickRow}>
          <QuickLink icon="book-outline" label="Playbook" color="#0891b2" route="/(app)/playbook" />
          <QuickLink icon="person-outline" label="Profile" color="#6b7280" route="/(app)/profile" />
        </View>

        {/* Coach CTA */}
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

        {/* Dev Logout */}
        {__DEV__ && (
          <TouchableOpacity style={styles.devLogout} onPress={handleLogout}>
            <Text style={styles.devLogoutText}>Dev Logout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickLink({ icon, label, color, route }: { icon: string; label: string; color: string; route: string }) {
  return (
    <TouchableOpacity
      style={styles.quickCard}
      onPress={() => router.push(route as any)}
      activeOpacity={0.75}
    >
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 10 },

  /* Header */
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  greeting: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  name: { fontSize: 24, fontWeight: '900', color: colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontWeight: '800', fontSize: 14 },

  /* Status */
  statusCard: {
    padding: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderRadius: radius.md, gap: 4,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  statusLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  statusMessage: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 6, paddingVertical: 2, backgroundColor: colors.bg, borderRadius: 8,
  },
  pillText: { fontSize: 10, fontWeight: '800', color: colors.textPrimary },

  /* PR */
  prBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.md,
  },
  prTitle: { fontSize: 13, fontWeight: '800' },
  subText: { fontSize: 10, color: colors.textMuted },

  /* Notifications */
  notifSection: { gap: 6 },
  notifCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.sm,
  },
  notifText: { flex: 1, fontSize: 11, color: colors.textSecondary, lineHeight: 15 },

  /* CTAs */
  ctaRow: { marginTop: 4 },
  ctaPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: radius.md,
  },
  ctaPrimaryText: { fontSize: 16, fontWeight: '900', color: '#fff' },
  ctaSecondaryRow: { flexDirection: 'row', gap: 8 },
  ctaSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  ctaSecondaryText: { fontSize: 11, fontWeight: '700', color: colors.textPrimary },

  /* Section */
  sectionLabel: {
    fontSize: 9, fontWeight: '900', letterSpacing: 1.5,
    color: colors.textMuted, marginTop: 8,
  },

  /* Pillars */
  pillarCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  pillarIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  pillarTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },

  /* Quick Access */
  quickRow: { flexDirection: 'row', gap: 8 },
  quickCard: {
    flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  quickLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },

  /* Coach */
  coachCta: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 14,
  },
  coachCtaText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },

  /* Dev */
  devLogout: {
    marginTop: 16, backgroundColor: colors.error,
    borderRadius: 8, paddingVertical: 10, alignItems: 'center',
  },
  devLogoutText: { color: colors.white, fontWeight: '800', fontSize: 13 },
});

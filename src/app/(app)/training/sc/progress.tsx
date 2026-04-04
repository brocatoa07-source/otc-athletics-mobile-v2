import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  getProgressionDecision,
  computeWorkoutStreak,
  type ProgressionSnapshot,
} from '@/features/strength/services/feedbackLoop';
import {
  getProgressionMessage,
  getContextualNote,
} from '@/features/strength/config/progressionMessages';
import {
  getDashboardMessage,
  type DashboardMessageInput,
} from '@/features/strength/services/dashboardMessages';
import {
  getProgramAdjustments,
  summarizeAdjustments,
  getAdjustmentMessage,
} from '@/features/strength/services/programAdjustments';

const ACCENT = '#1DB954';

const DECISION_META: Record<string, { label: string; color: string; icon: string; message: string }> = {
  progress: {
    label: 'PROGRESS',
    color: '#22c55e',
    icon: 'trending-up',
    message: 'You\'re ready to progress. Training stimulus will increase.',
  },
  hold: {
    label: 'HOLD',
    color: '#f59e0b',
    icon: 'pause-circle',
    message: 'Hold and recover. Maintain current prescription.',
  },
  regress: {
    label: 'REBUILD',
    color: '#ef4444',
    icon: 'trending-down',
    message: 'We need to rebuild consistency before pushing forward.',
  },
};

export default function ProgressDashboard() {
  const [snapshot, setSnapshot] = useState<ProgressionSnapshot | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [snap, stk] = await Promise.all([
          getProgressionDecision(),
          computeWorkoutStreak(),
        ]);
        if (active) {
          setSnapshot(snap);
          setStreak(stk);
          setLoading(false);
        }
      })();
      return () => { active = false; };
    }, []),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={ACCENT} size="large" />
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!snapshot) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Ionicons name="analytics-outline" size={40} color={colors.textMuted} />
          <Text style={styles.loadingText}>Complete some workouts to see your progress.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Back to Vault</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const decision = DECISION_META[snapshot.result.decision] ?? DECISION_META.hold;
  const compliancePct = Math.round(snapshot.compliance.rate * 100);

  // Coaching layer messages
  const isDeload = snapshot.result.adjustments.some(a => a.note.toLowerCase().includes('deload'));
  const coachMsg = getProgressionMessage(snapshot.result.decision, isDeload);
  const contextNote = getContextualNote({
    complianceRate: snapshot.compliance.rate,
    readinessAvg: snapshot.readiness.avg,
    painFlags: snapshot.painFlags,
    weeksInState: snapshot.weeksInState,
    streak,
  });

  // Dynamic dashboard message
  const dashInput: DashboardMessageInput = {
    streak,
    complianceRate: snapshot.compliance.rate,
    completedThisWeek: snapshot.compliance.completed,
    plannedThisWeek: snapshot.compliance.planned,
    readinessAvg: snapshot.readiness.avg,
    readinessToday: null, // Progress screen doesn't have today's readiness
    progressionDecision: snapshot.result.decision,
    isDeloadWeek: isDeload,
    painFlags: snapshot.painFlags,
    missedYesterday: false,
    outputTrend: snapshot.output.trend,
  };
  const dashMsg = getDashboardMessage(dashInput);

  // Program adjustments
  const adjustments = getProgramAdjustments({
    progressionDecision: snapshot.result.decision,
    archetype: 'hybrid', // TODO: read from stored profile
    biggestNeed: 'strength', // TODO: read from stored profile
    complianceRate: snapshot.compliance.rate,
    readinessAvg: snapshot.readiness.avg,
    outputTrend: snapshot.output.trend,
    painFlags: snapshot.painFlags,
    isDeloadWeek: isDeload,
    currentWeekType: 'volume',
  });
  const adjSummary = summarizeAdjustments(adjustments);
  const adjMessage = getAdjustmentMessage(adjustments);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>STRENGTH</Text>
          <Text style={styles.headerTitle}>Your Progress</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Dynamic Coaching Message */}
        <View style={[styles.coachCard, { borderColor: dashMsg.tone === 'positive' ? '#22c55e40' : dashMsg.tone === 'warning' ? '#ef444440' : colors.border }]}>
          <Ionicons name={dashMsg.icon as any} size={16} color={dashMsg.tone === 'positive' ? '#22c55e' : dashMsg.tone === 'warning' ? '#ef4444' : '#f59e0b'} />
          <Text style={styles.coachText}>{dashMsg.text}</Text>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, { borderColor: coachMsg.color + '40' }]}>
          <View style={[styles.statusIcon, { backgroundColor: coachMsg.color + '15' }]}>
            <Ionicons name={coachMsg.icon as any} size={24} color={coachMsg.color} />
          </View>
          <Text style={[styles.statusLabel, { color: coachMsg.color }]}>{coachMsg.title}</Text>
          <Text style={styles.statusMessage}>{coachMsg.message}</Text>
          {contextNote && (
            <Text style={styles.contextNote}>{contextNote}</Text>
          )}
        </View>

        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          {/* Streak */}
          <View style={styles.metricCard}>
            <Ionicons name="flame" size={18} color="#f97316" />
            <Text style={styles.metricValue}>{streak}</Text>
            <Text style={styles.metricLabel}>Day Streak</Text>
          </View>

          {/* Compliance */}
          <View style={styles.metricCard}>
            <Ionicons name="checkmark-done" size={18} color={ACCENT} />
            <Text style={styles.metricValue}>{compliancePct}%</Text>
            <Text style={styles.metricLabel}>Compliance</Text>
          </View>

          {/* Readiness */}
          <View style={styles.metricCard}>
            <Ionicons name="heart" size={18} color="#8b5cf6" />
            <Text style={styles.metricValue}>{snapshot.readiness.avg.toFixed(1)}</Text>
            <Text style={styles.metricLabel}>Readiness</Text>
          </View>
        </View>

        {/* Compliance Detail */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="bar-chart" size={14} color={ACCENT} />
            <Text style={styles.detailTitle}>Workout Compliance</Text>
          </View>
          <Text style={styles.detailBody}>
            {snapshot.compliance.completed} of {snapshot.compliance.planned} planned workouts completed in the last 2 weeks.
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${compliancePct}%`, backgroundColor: compliancePct >= 80 ? ACCENT : compliancePct >= 50 ? '#f59e0b' : '#ef4444' }]} />
          </View>
        </View>

        {/* Readiness Detail */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="pulse" size={14} color="#8b5cf6" />
            <Text style={styles.detailTitle}>Readiness (7-Day Avg)</Text>
          </View>
          <Text style={styles.detailBody}>
            {snapshot.readiness.entries > 0
              ? `Based on ${snapshot.readiness.entries} check-in${snapshot.readiness.entries > 1 ? 's' : ''} this week.`
              : 'No check-ins recorded this week. Default readiness of 7 used.'}
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(snapshot.readiness.avg / 10) * 100}%`, backgroundColor: snapshot.readiness.avg >= 6 ? '#22c55e' : snapshot.readiness.avg >= 4 ? '#f59e0b' : '#ef4444' }]} />
          </View>
        </View>

        {/* Output Trend */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="trending-up" size={14} color="#3b82f6" />
            <Text style={styles.detailTitle}>Output Trend</Text>
          </View>
          {snapshot.output.metric ? (
            <>
              <Text style={styles.detailBody}>
                Tracking: {snapshot.output.metric.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </Text>
              <View style={styles.trendRow}>
                <Text style={styles.trendLabel}>Previous</Text>
                <Text style={styles.trendValue}>{snapshot.output.previous}</Text>
                <Ionicons
                  name={snapshot.output.trend === 'improving' ? 'arrow-up' : snapshot.output.trend === 'declining' ? 'arrow-down' : 'remove'}
                  size={14}
                  color={snapshot.output.trend === 'improving' ? '#22c55e' : snapshot.output.trend === 'declining' ? '#ef4444' : '#f59e0b'}
                />
                <Text style={styles.trendLabel}>Latest</Text>
                <Text style={styles.trendValue}>{snapshot.output.latest}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.detailBody}>
              Log at least 2 testing sessions to see output trends.
            </Text>
          )}
        </View>

        {/* Session RPE */}
        {snapshot.sessionRPE !== null && (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Ionicons name="fitness" size={14} color="#f97316" />
              <Text style={styles.detailTitle}>Average Session RPE</Text>
            </View>
            <Text style={styles.detailBody}>
              {snapshot.sessionRPE.toFixed(1)} / 5 over last 2 weeks
              {snapshot.painFlags > 0 && ` — ${snapshot.painFlags} pain flag${snapshot.painFlags > 1 ? 's' : ''} reported`}
            </Text>
          </View>
        )}

        {/* Adjustments */}
        {snapshot.result.adjustments.length > 0 && (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Ionicons name="construct" size={14} color={decision.color} />
              <Text style={styles.detailTitle}>Program Adjustments</Text>
            </View>
            {snapshot.result.adjustments.map((adj, i) => (
              <View key={i} style={styles.adjRow}>
                <Ionicons
                  name={adj.direction === 'increase' ? 'arrow-up-circle' : adj.direction === 'decrease' ? 'arrow-down-circle' : 'remove-circle'}
                  size={14}
                  color={adj.direction === 'increase' ? '#22c55e' : adj.direction === 'decrease' ? '#ef4444' : '#f59e0b'}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.adjTarget}>{adj.target.replace(/_/g, ' ')}</Text>
                  <Text style={styles.adjNote}>{adj.note}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Program Adjustments This Week */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="options" size={14} color={ACCENT} />
            <Text style={styles.detailTitle}>Program Adjustments This Week</Text>
          </View>
          <Text style={styles.detailBody}>{adjMessage}</Text>
          <View style={styles.adjGrid}>
            {(['volume', 'intensity', 'plyos', 'sprints', 'lifts'] as const).map((key) => {
              const val = adjSummary[key];
              const arrow = val === 'up' ? 'arrow-up' : val === 'down' ? 'arrow-down' : 'remove';
              const clr = val === 'up' ? '#22c55e' : val === 'down' ? '#ef4444' : colors.textMuted;
              return (
                <View key={key} style={styles.adjGridItem}>
                  <Ionicons name={arrow as any} size={12} color={clr} />
                  <Text style={[styles.adjGridLabel, { color: clr }]}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </View>
              );
            })}
            {adjSummary.recovery === 'added' && (
              <View style={styles.adjGridItem}>
                <Ionicons name="add-circle" size={12} color="#8b5cf6" />
                <Text style={[styles.adjGridLabel, { color: '#8b5cf6' }]}>Recovery</Text>
              </View>
            )}
          </View>
          {adjustments.safetyOverride && (
            <View style={[styles.coachCard, { borderColor: '#ef444440', marginTop: 8 }]}>
              <Ionicons name="shield" size={14} color="#ef4444" />
              <Text style={[styles.coachText, { color: '#ef4444' }]}>{adjustments.safetyOverride}</Text>
            </View>
          )}
        </View>

        {/* Log Performance CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: '#3b82f6' }]}
          onPress={() => router.push('/(app)/training/sc/exercises' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={18} color="#fff" />
          <Text style={styles.ctaBtnText}>Log Performance Test</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  loadingText: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  backBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radius.md, backgroundColor: colors.surface },
  backBtnText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerBack: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 16, paddingBottom: 60, gap: 12 },

  /* Status */
  coachCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.md,
  },
  coachText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textPrimary, lineHeight: 18 },
  contextNote: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', marginTop: 4 },

  statusCard: {
    alignItems: 'center', padding: 20, gap: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
  },
  statusIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  statusLabel: { fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  statusMessage: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  statusReason: { fontSize: 11, color: colors.textMuted, textAlign: 'center', lineHeight: 16 },

  /* Metrics */
  metricsRow: { flexDirection: 'row', gap: 8 },
  metricCard: {
    flex: 1, alignItems: 'center', gap: 4, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  metricValue: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },
  metricLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5 },

  /* Detail Cards */
  detailCard: {
    padding: 14, gap: 6,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailTitle: { fontSize: 12, fontWeight: '800', color: colors.textPrimary },
  detailBody: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  /* Progress Bar */
  progressBarBg: {
    height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden', marginTop: 4,
  },
  progressBarFill: { height: 6, borderRadius: 3 },

  /* Trend */
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  trendLabel: { fontSize: 10, color: colors.textMuted },
  trendValue: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },

  /* Adjustments */
  adjRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingVertical: 4 },
  adjTarget: { fontSize: 11, fontWeight: '700', color: colors.textPrimary, textTransform: 'capitalize' },
  adjNote: { fontSize: 10, color: colors.textMuted, lineHeight: 14 },
  adjGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  adjGridItem: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: colors.bg, borderRadius: radius.sm,
  },
  adjGridLabel: { fontSize: 10, fontWeight: '700' },

  /* CTA */
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: radius.md,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});

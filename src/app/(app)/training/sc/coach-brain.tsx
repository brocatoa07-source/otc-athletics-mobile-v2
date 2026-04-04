import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useAccess } from '@/features/billing/useAccess';
import { AccessGate } from '@/features/billing/AccessGate';
import {
  getProgressionDecision,
  computeWorkoutStreak,
  type ProgressionSnapshot,
} from '@/features/strength/services/feedbackLoop';
import {
  getProgramAdjustments,
  summarizeAdjustments,
  type ProgramAdjustments,
  type DirectionSummary,
} from '@/features/strength/services/programAdjustments';

const ACCENT = '#1DB954';

export default function CoachBrainScreen() {
  const access = useAccess();
  const [snapshot, setSnapshot] = useState<ProgressionSnapshot | null>(null);
  const [streak, setStreak] = useState(0);
  const [adjustments, setAdjustments] = useState<ProgramAdjustments | null>(null);
  const [adjSummary, setAdjSummary] = useState<DirectionSummary | null>(null);
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
        if (!active) return;
        setSnapshot(snap);
        setStreak(stk);

        const isDeload = snap.result.adjustments.some(a => a.note.toLowerCase().includes('deload'));
        const adj = getProgramAdjustments({
          progressionDecision: snap.result.decision,
          archetype: 'hybrid',
          biggestNeed: 'strength',
          complianceRate: snap.compliance.rate,
          readinessAvg: snap.readiness.avg,
          outputTrend: snap.output.trend,
          painFlags: snap.painFlags,
          isDeloadWeek: isDeload,
          currentWeekType: 'volume',
        });
        setAdjustments(adj);
        setAdjSummary(summarizeAdjustments(adj));
        setLoading(false);
      })();
      return () => { active = false; };
    }, []),
  );

  const content = (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>PERFORMANCE ENGINE</Text>
          <Text style={styles.headerTitle}>Coach Brain</Text>
        </View>
      </View>

      {loading || !snapshot ? (
        <View style={styles.center}>
          <ActivityIndicator color={ACCENT} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>
            This is how the system is making decisions about your program.
          </Text>

          {/* Decision */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DECISION</Text>
            <Row label="Status" value={snapshot.result.decision.toUpperCase()} color={
              snapshot.result.decision === 'progress' ? '#22c55e' :
              snapshot.result.decision === 'regress' ? '#ef4444' : '#f59e0b'
            } />
            <Row label="Reason" value={snapshot.result.reason} />
          </View>

          {/* Signals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INPUT SIGNALS</Text>
            <Row label="Compliance" value={`${Math.round(snapshot.compliance.rate * 100)}%`}
              color={snapshot.compliance.rate >= 0.8 ? '#22c55e' : snapshot.compliance.rate >= 0.5 ? '#f59e0b' : '#ef4444'} />
            <Row label="Readiness Avg" value={`${snapshot.readiness.avg.toFixed(1)} / 10`}
              color={snapshot.readiness.avg >= 6 ? '#22c55e' : snapshot.readiness.avg >= 4 ? '#f59e0b' : '#ef4444'} />
            <Row label="Output Trend" value={snapshot.output.trend}
              color={snapshot.output.trend === 'improving' ? '#22c55e' : snapshot.output.trend === 'declining' ? '#ef4444' : '#f59e0b'} />
            <Row label="Pain Flags" value={`${snapshot.painFlags}`}
              color={snapshot.painFlags === 0 ? '#22c55e' : '#ef4444'} />
            <Row label="Streak" value={`${streak} days`} color="#f97316" />
            {snapshot.sessionRPE != null && (
              <Row label="Avg Session RPE" value={`${snapshot.sessionRPE.toFixed(1)} / 5`} />
            )}
          </View>

          {/* Adjustments */}
          {adjustments && adjSummary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROGRAM ADJUSTMENTS</Text>
              <AdjRow label="Volume" value={adjustments.volumeAdjustment} dir={adjSummary.volume} />
              <AdjRow label="Intensity" value={adjustments.intensityAdjustment} dir={adjSummary.intensity} />
              <AdjRow label="Plyos" value={adjustments.plyoAdjustment} dir={adjSummary.plyos} />
              <AdjRow label="Sprints" value={adjustments.sprintAdjustment} dir={adjSummary.sprints} />
              <AdjRow label="Lifts" value={adjustments.liftAdjustment} dir={adjSummary.lifts} />
              <Row label="Focus" value={adjustments.focusOutput} />
              <Row label="Add Recovery" value={adjustments.addRecovery ? 'Yes' : 'No'}
                color={adjustments.addRecovery ? '#8b5cf6' : colors.textMuted} />
              <Row label="Add Mobility" value={adjustments.addMobility ? 'Yes' : 'No'}
                color={adjustments.addMobility ? '#0891b2' : colors.textMuted} />
              {adjustments.safetyOverride && (
                <View style={styles.safetyRow}>
                  <Ionicons name="shield" size={12} color="#ef4444" />
                  <Text style={[styles.rowValue, { color: '#ef4444' }]}>{adjustments.safetyOverride}</Text>
                </View>
              )}
            </View>
          )}

          {/* Raw Adjustments from Engine */}
          {snapshot.result.adjustments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ENGINE ADJUSTMENTS</Text>
              {snapshot.result.adjustments.map((adj, i) => (
                <Row key={i} label={adj.target.replace(/_/g, ' ')} value={`${adj.direction} (${adj.magnitude})`}
                  color={adj.direction === 'increase' ? '#22c55e' : adj.direction === 'decrease' ? '#ef4444' : '#f59e0b'} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );

  // TRIPLE-only access
  return (
    <AccessGate permission="coachBrain">
      {content}
    </AccessGate>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, color ? { color } : undefined]}>{value}</Text>
    </View>
  );
}

function AdjRow({ label, value, dir }: { label: string; value: number; dir: string }) {
  const pct = `${value > 0 ? '+' : ''}${Math.round(value * 100)}%`;
  const color = dir === 'up' ? '#22c55e' : dir === 'down' ? '#ef4444' : colors.textMuted;
  const icon = dir === 'up' ? 'arrow-up' : dir === 'down' ? 'arrow-down' : 'remove';
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name={icon as any} size={10} color={color} />
        <Text style={[styles.rowValue, { color }]}>{pct}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: '#3b82f6' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 12 },
  intro: { fontSize: 12, color: colors.textMuted, lineHeight: 17, marginBottom: 4 },

  section: {
    padding: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, gap: 6,
  },
  sectionTitle: {
    fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginBottom: 2,
  },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 12, color: colors.textMuted },
  rowValue: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },

  safetyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    padding: 8, backgroundColor: '#ef444410', borderRadius: radius.sm, marginTop: 4,
  },
});

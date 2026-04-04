import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { AccessGate } from '@/features/billing/AccessGate';
import { loadStrengthProgress } from '@/data/strength-program-engine';
import { generateMonthlyReport, type MonthlyReport } from '@/features/strength/services/monthlyReport';

const ACCENT = '#1DB954';

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e', B: '#84cc16', C: '#f59e0b', D: '#f97316', F: '#ef4444',
};

export default function MonthlyReportScreen() {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const progress = await loadStrengthProgress();
        const month = progress?.currentMonth ?? 1;
        const r = await generateMonthlyReport(month);
        if (active) { setReport(r); setLoading(false); }
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
          <Text style={styles.headerSup}>STRENGTH</Text>
          <Text style={styles.headerTitle}>Monthly Report</Text>
        </View>
      </View>

      {loading || !report ? (
        <View style={styles.center}>
          <ActivityIndicator color={ACCENT} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Grade */}
          <View style={[styles.gradeCard, { borderColor: (GRADE_COLORS[report.grade] ?? '#f59e0b') + '40' }]}>
            <Text style={[styles.gradeText, { color: GRADE_COLORS[report.grade] }]}>{report.grade}</Text>
            <Text style={styles.gradeLabel}>Month {report.month} Grade</Text>
          </View>

          {/* Coach Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Coach Summary</Text>
            <Text style={styles.cardBody}>{report.coachSummary}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatBox label="Compliance" value={`${Math.round(report.compliance.rate * 100)}%`} color={ACCENT} />
            <StatBox label="Readiness" value={report.readinessAvg.toFixed(1)} color="#8b5cf6" />
            <StatBox label="Sessions" value={`${report.totalSessions}`} color="#3b82f6" />
            <StatBox label="Pain" value={`${report.painFlagCount}`}
              color={report.painFlagCount === 0 ? '#22c55e' : '#ef4444'} />
          </View>

          {/* Performance Metrics */}
          {report.metrics.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Performance Changes</Text>
              {report.metrics.map((m) => (
                <View key={m.key} style={styles.metricRow}>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                  <View style={styles.metricValues}>
                    {m.previous != null && (
                      <Text style={styles.metricPrev}>{m.previous} {m.unit}</Text>
                    )}
                    {m.delta != null && (
                      <>
                        <Ionicons
                          name={m.improved ? 'arrow-up' : 'arrow-down'}
                          size={10}
                          color={m.improved ? '#22c55e' : '#ef4444'}
                        />
                        <Text style={[styles.metricDelta, { color: m.improved ? '#22c55e' : '#ef4444' }]}>
                          {m.delta > 0 ? '+' : ''}{m.delta.toFixed(1)}
                        </Text>
                      </>
                    )}
                    {m.current != null && (
                      <Text style={styles.metricCurr}>{m.current} {m.unit}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Highlights */}
          {report.highlights.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Highlights</Text>
              {report.highlights.map((h, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle" size={12} color="#22c55e" />
                  <Text style={styles.bulletText}>{h}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Improvements */}
          {report.improvements.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Areas to Improve</Text>
              {report.improvements.map((imp, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Ionicons name="alert-circle" size={12} color="#f59e0b" />
                  <Text style={styles.bulletText}>{imp}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Focus Next Month */}
          <View style={[styles.card, { borderColor: ACCENT + '30' }]}>
            <Text style={[styles.cardTitle, { color: ACCENT }]}>Focus Next Month</Text>
            <Text style={styles.cardBody}>{report.focusNextMonth}</Text>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );

  return (
    <AccessGate permission="monthlyReport">
      {content}
    </AccessGate>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  gradeCard: {
    alignItems: 'center', padding: 20,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
  },
  gradeText: { fontSize: 48, fontWeight: '900' },
  gradeLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted },

  card: {
    padding: 14, gap: 6,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  cardTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  cardBody: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: {
    flex: 1, alignItems: 'center', gap: 2, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted },

  metricRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 4,
  },
  metricLabel: { fontSize: 12, color: colors.textMuted },
  metricValues: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricPrev: { fontSize: 10, color: colors.textMuted },
  metricDelta: { fontSize: 11, fontWeight: '700' },
  metricCurr: { fontSize: 12, fontWeight: '800', color: colors.textPrimary },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingVertical: 2 },
  bulletText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
});

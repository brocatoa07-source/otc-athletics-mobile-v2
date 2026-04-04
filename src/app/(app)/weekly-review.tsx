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
import { generateWeeklyReview, type WeeklyReview } from '@/features/strength/services/weeklyReview';
import { explainDecision, type DecisionExplanation } from '@/features/strength/services/decisionExplanation';
import { evaluatePRWindow } from '@/features/strength/services/prWindow';
import { generateMentalWeeklyReview, type MentalWeeklyReview } from '@/features/mental/mentalWeeklyReview';

const ACCENT = '#1DB954';
const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e', B: '#84cc16', C: '#f59e0b', D: '#f97316', F: '#ef4444',
};
const TREND_ICONS: Record<string, { icon: string; color: string }> = {
  improving: { icon: 'trending-up', color: '#22c55e' },
  flat: { icon: 'remove', color: '#f59e0b' },
  declining: { icon: 'trending-down', color: '#ef4444' },
  unknown: { icon: 'help-circle', color: colors.textMuted },
};

export default function WeeklyReviewScreen() {
  const [review, setReview] = useState<WeeklyReview | null>(null);
  const [explanation, setExplanation] = useState<DecisionExplanation | null>(null);
  const [mentalReview, setMentalReview] = useState<MentalWeeklyReview | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [r, mr] = await Promise.all([
          generateWeeklyReview(),
          generateMentalWeeklyReview(null).catch(() => null),
        ]);
        if (!active) return;
        setReview(r);
        setMentalReview(mr);

        const prWindow = evaluatePRWindow(r.snapshot);
        setExplanation(explainDecision(r.snapshot, prWindow));
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
          <Text style={styles.headerSup}>PERFORMANCE</Text>
          <Text style={styles.headerTitle}>Weekly Review</Text>
        </View>
      </View>

      {loading || !review ? (
        <View style={styles.center}>
          <ActivityIndicator color={ACCENT} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Grade */}
          <View style={[styles.gradeCard, { borderColor: (GRADE_COLORS[review.grade] ?? '#f59e0b') + '40' }]}>
            <Text style={[styles.gradeText, { color: GRADE_COLORS[review.grade] }]}>{review.grade}</Text>
            <Text style={styles.gradeLabel}>Weekly Grade</Text>
          </View>

          {/* Metrics Row */}
          <View style={styles.metricsRow}>
            <MetricBox label="Compliance" value={`${Math.round(review.snapshot.compliance.rate * 100)}%`}
              color={review.snapshot.compliance.rate >= 0.8 ? ACCENT : '#f59e0b'} />
            <MetricBox label="Readiness" value={review.snapshot.readiness.avg.toFixed(1)}
              color={review.snapshot.readiness.avg >= 6 ? '#8b5cf6' : '#f59e0b'} />
            <MetricBox label="Streak" value={`${review.streak}`} color="#f97316" />
          </View>

          {/* Output Trend */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Output Trend</Text>
              {(() => {
                const t = TREND_ICONS[review.snapshot.output.trend] ?? TREND_ICONS.unknown;
                return (
                  <View style={styles.trendBadge}>
                    <Ionicons name={t.icon as any} size={12} color={t.color} />
                    <Text style={[styles.trendText, { color: t.color }]}>
                      {review.snapshot.output.trend}
                    </Text>
                  </View>
                );
              })()}
            </View>
            {review.snapshot.output.metric && (
              <Text style={styles.cardBody}>
                Tracking {review.snapshot.output.metric.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                {review.snapshot.output.previous != null && ` ${review.snapshot.output.previous}`}
                {review.snapshot.output.latest != null && ` → ${review.snapshot.output.latest}`}
              </Text>
            )}
          </View>

          {/* Status Decision */}
          <View style={[styles.card, { borderColor: review.coachMessage.color + '30' }]}>
            <View style={styles.cardHeader}>
              <Ionicons name={review.coachMessage.icon as any} size={16} color={review.coachMessage.color} />
              <Text style={[styles.cardTitle, { color: review.coachMessage.color }]}>
                {review.coachMessage.title}
              </Text>
            </View>
            <Text style={styles.cardBody}>{review.coachMessage.message}</Text>
            {review.contextNote && (
              <Text style={styles.contextNote}>{review.contextNote}</Text>
            )}
          </View>

          {/* Why Your Plan Changed */}
          {explanation && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Why Your Plan Changed</Text>
              <Text style={[styles.cardBody, { fontWeight: '700' }]}>{explanation.headline}</Text>
              <Text style={styles.cardBody}>{explanation.body}</Text>

              {/* Signal drivers */}
              <View style={styles.driversRow}>
                {explanation.drivers.map((d) => (
                  <View key={d.signal} style={[styles.driverChip, {
                    borderColor: d.impact === 'positive' ? '#22c55e30' :
                      d.impact === 'negative' ? '#ef444430' : colors.border,
                  }]}>
                    <Ionicons
                      name={d.impact === 'positive' ? 'checkmark-circle' : d.impact === 'negative' ? 'alert-circle' : 'remove-circle'}
                      size={10}
                      color={d.impact === 'positive' ? '#22c55e' : d.impact === 'negative' ? '#ef4444' : '#f59e0b'}
                    />
                    <Text style={styles.driverLabel}>{d.signal}: {d.value}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.nextStepBox, { borderColor: ACCENT + '30' }]}>
                <Ionicons name="arrow-forward-circle" size={14} color={ACCENT} />
                <Text style={styles.nextStepText}>{explanation.nextStep}</Text>
              </View>
            </View>
          )}

          {/* Program Adjustments */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Program Adjustments</Text>
            <Text style={styles.cardBody}>{review.adjustmentMessage}</Text>
            <View style={styles.adjRow}>
              {(['volume', 'intensity', 'plyos', 'sprints', 'lifts'] as const).map((key) => {
                const val = review.programAdjustmentSummary[key];
                const color = val === 'up' ? '#22c55e' : val === 'down' ? '#ef4444' : colors.textMuted;
                const icon = val === 'up' ? 'arrow-up' : val === 'down' ? 'arrow-down' : 'remove';
                return (
                  <View key={key} style={styles.adjChip}>
                    <Ionicons name={icon as any} size={10} color={color} />
                    <Text style={[styles.adjLabel, { color }]}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  </View>
                );
              })}
              {review.programAdjustmentSummary.recovery === 'added' && (
                <View style={styles.adjChip}>
                  <Ionicons name="add-circle" size={10} color="#8b5cf6" />
                  <Text style={[styles.adjLabel, { color: '#8b5cf6' }]}>Recovery</Text>
                </View>
              )}
            </View>
          </View>

          {/* Highlights */}
          {review.highlights.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Highlights</Text>
              {review.highlights.map((h, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle" size={12} color="#22c55e" />
                  <Text style={styles.bulletText}>{h}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Improvements */}
          {review.improvements.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Areas to Improve</Text>
              {review.improvements.map((imp, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Ionicons name="alert-circle" size={12} color="#f59e0b" />
                  <Text style={styles.bulletText}>{imp}</Text>
                </View>
              ))}
            </View>
          )}

          {/* ═══ MENTAL REVIEW ═══ */}
          {mentalReview && (
            <>
              <View style={[styles.card, { borderColor: '#8b5cf630' }]}>
                <Text style={[styles.cardTitle, { color: '#8b5cf6' }]}>MENTAL WEEK</Text>
                <View style={styles.mentalStatsRow}>
                  <MentalStat label="Work Days" value={`${mentalReview.daysCompleted}/${mentalReview.daysTarget}`} />
                  <MentalStat label="Confidence" value={mentalReview.avgConfidence !== null ? `${mentalReview.avgConfidence}` : '—'} />
                  <MentalStat label="Focus" value={mentalReview.avgFocus !== null ? `${mentalReview.avgFocus}` : '—'} />
                  <MentalStat label="Emotional" value={mentalReview.avgEmotionalControl !== null ? `${mentalReview.avgEmotionalControl}` : '—'} />
                </View>
              </View>

              {mentalReview.biggestChallenge && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Biggest Challenge</Text>
                  <Text style={styles.cardBody}>{mentalReview.biggestChallenge}</Text>
                </View>
              )}

              {mentalReview.patternNote && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Pattern Detected</Text>
                  <Text style={styles.cardBody}>{mentalReview.patternNote}</Text>
                </View>
              )}

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Coach Summary</Text>
                <Text style={styles.cardBody}>{mentalReview.coachSummary}</Text>
              </View>

              <View style={styles.card}>
                <Text style={[styles.cardTitle, { color: '#8b5cf6' }]}>Focus Next Week</Text>
                <Text style={styles.cardBody}>{mentalReview.nextWeekFocus}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Reflect</Text>
                {mentalReview.reflections.map((q, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Ionicons name="chatbubble-outline" size={12} color="#8b5cf6" />
                    <Text style={[styles.bulletText, { fontStyle: 'italic' }]}>{q}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

        </ScrollView>
      )}
    </SafeAreaView>
  );

  return (
    <AccessGate permission="weeklyReview">
      {content}
    </AccessGate>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function MentalStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.mentalStatBox}>
      <Text style={styles.mentalStatValue}>{value}</Text>
      <Text style={styles.mentalStatLabel}>{label}</Text>
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

  gradeCard: {
    alignItems: 'center', padding: 20,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
  },
  gradeText: { fontSize: 48, fontWeight: '900' },
  gradeLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted },

  metricsRow: { flexDirection: 'row', gap: 8 },
  metricBox: {
    flex: 1, alignItems: 'center', gap: 2, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  metricValue: { fontSize: 20, fontWeight: '900' },
  metricLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted },

  card: {
    padding: 14, gap: 6,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  cardBody: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  contextNote: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },

  trendBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: colors.bg, borderRadius: radius.sm,
  },
  trendText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },

  driversRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  driverChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderRadius: radius.sm, backgroundColor: colors.bg,
  },
  driverLabel: { fontSize: 10, fontWeight: '700', color: colors.textPrimary },

  nextStepBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 10, borderWidth: 1, borderRadius: radius.sm,
    backgroundColor: colors.bg, marginTop: 6,
  },
  nextStepText: { flex: 1, fontSize: 11, color: colors.textSecondary, lineHeight: 16 },

  adjRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  adjChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3,
    backgroundColor: colors.bg, borderRadius: radius.sm,
  },
  adjLabel: { fontSize: 9, fontWeight: '700' },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingVertical: 2 },
  bulletText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  /* Mental review */
  mentalStatsRow: { flexDirection: 'row', gap: 6 },
  mentalStatBox: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 8, backgroundColor: colors.bg, borderRadius: radius.sm },
  mentalStatValue: { fontSize: 16, fontWeight: '900', color: '#8b5cf6' },
  mentalStatLabel: { fontSize: 8, fontWeight: '700', color: colors.textMuted },
});

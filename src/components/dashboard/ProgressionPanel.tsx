import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const GRADE_COLOR: Record<string, string> = {
  A: '#22c55e', B: '#84cc16', C: '#f59e0b', D: '#f97316', F: '#ef4444',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

interface Props {
  accountabilityScore: number | null;
  grade: string | null;
  daysSinceLastKeyMetric: number | null;
}

export function ProgressionPanel({ accountabilityScore, grade, daysSinceLastKeyMetric }: Props) {
  const hasRetest = daysSinceLastKeyMetric !== null;

  let lastRetestLabel = '—';
  let nextRetestLabel = '—';

  if (hasRetest) {
    const now = new Date();
    const lastDate = new Date(now);
    lastDate.setDate(now.getDate() - daysSinceLastKeyMetric!);
    lastRetestLabel = formatDate(lastDate.toISOString());
    nextRetestLabel = formatDate(addDays(lastDate.toISOString(), 28));
  }

  const gradeColor = grade ? (GRADE_COLOR[grade] ?? colors.textPrimary) : colors.textMuted;

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>PROGRESSION</Text>

      {!hasRetest ? (
        <TouchableOpacity
          style={styles.emptyState}
          onPress={() => router.push('/(app)/progress' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="analytics-outline" size={24} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No retest data yet</Text>
          <Text style={styles.emptySub}>Log key metrics to activate your progression tracker</Text>
          <View style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>Log Metrics →</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={[styles.statValue, { color: gradeColor }]}>
              {accountabilityScore ?? '—'}
            </Text>
            <Text style={[styles.statGrade, { color: gradeColor }]}>
              {grade ?? ''}
            </Text>
            <Text style={styles.statLabel}>Momentum</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statCell}>
            <Text style={styles.statValue}>{lastRetestLabel}</Text>
            <Text style={styles.statLabel}>Last Retest</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statCell}>
            <Text style={[
              styles.statValue,
              daysSinceLastKeyMetric! >= 14 && { color: '#f59e0b' },
            ]}>
              {nextRetestLabel}
            </Text>
            <Text style={styles.statLabel}>Next Retest</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  statGrade: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: -2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  emptyState: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
  },
  emptyBtn: {
    marginTop: 4,
  },
  emptyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3b82f6',
  },
});

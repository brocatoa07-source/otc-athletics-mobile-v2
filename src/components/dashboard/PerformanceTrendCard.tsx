import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { METRIC_CONFIG } from '@/types/progress';
import type { KeyMetric, MetricReading } from '@/types/progress';

const KEY_METRIC_DISPLAY: { key: KeyMetric; shortLabel: string }[] = [
  { key: 'exit_velocity_mph',   shortLabel: 'Exit Velo' },
  { key: 'sprint_10yd_seconds', shortLabel: '10-Yard'   },
  { key: 'throw_velocity_mph',  shortLabel: 'Throw Velo' },
  { key: 'rot_power_watts',     shortLabel: 'Rot. Power' },
  { key: 'strength_index',      shortLabel: 'Str. Index' },
];

interface Props {
  keyMetrics: Partial<Record<KeyMetric, MetricReading>>;
  daysSinceLastKeyMetric: number | null;
}

export function PerformanceTrendCard({ keyMetrics, daysSinceLastKeyMetric }: Props) {
  const hasAny = Object.keys(keyMetrics).length > 0;

  // 28-day retest window
  const retestDue = daysSinceLastKeyMetric !== null && daysSinceLastKeyMetric >= 21;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/(app)/training/metrics-log' as any)}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: '#3b82f615' }]}>
          <Ionicons name="speedometer-outline" size={18} color="#3b82f6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Performance Trend</Text>
          {daysSinceLastKeyMetric !== null ? (
            <Text style={[styles.sub, retestDue && { color: '#f59e0b' }]}>
              {retestDue
                ? `Retest due · ${daysSinceLastKeyMetric}d ago`
                : `Last tested ${daysSinceLastKeyMetric}d ago`}
            </Text>
          ) : (
            <Text style={styles.sub}>Log your first key metrics</Text>
          )}
        </View>
        <Ionicons name="add-circle-outline" size={20} color={colors.textMuted} />
      </View>

      {hasAny ? (
        <View style={styles.metricsRow}>
          {KEY_METRIC_DISPLAY.map(({ key, shortLabel }) => {
            const reading = keyMetrics[key];
            if (!reading) return null;
            const cfg = METRIC_CONFIG[key];
            const improved = reading.delta !== null && reading.delta > 0;
            const declined = reading.delta !== null && reading.delta < 0;
            return (
              <View key={key} style={styles.metricCell}>
                <Text style={styles.metricValue}>
                  {reading.value}{cfg.unit ? ` ${cfg.unit}` : ''}
                </Text>
                <View style={styles.metricLabelRow}>
                  <Text style={styles.metricLabel}>{shortLabel}</Text>
                  {reading.delta !== null && (
                    <Ionicons
                      name={improved ? 'arrow-up' : declined ? 'arrow-down' : 'remove'}
                      size={10}
                      color={improved ? '#22c55e' : declined ? '#ef4444' : colors.textMuted}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyRow}>
          <Text style={styles.emptyText}>No key metrics yet · Tap to log</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  sub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metricCell: {
    flex: 1,
    minWidth: '18%',
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'center',
  },
  emptyRow: {
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    paddingBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
});

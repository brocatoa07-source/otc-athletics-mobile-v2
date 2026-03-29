/**
 * PRAlertBanner — Conditional personal record banner.
 *
 * Source: useMetricsStatus() → keyMetrics with delta values.
 * A PR is detected when a metric's delta is positive (higher is better)
 * or negative (lower is better, for sprint times).
 *
 * Hidden entirely when no PR condition exists.
 */

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { KeyMetric, MetricReading } from '@/types/progress';

const METRIC_LABELS: Partial<Record<KeyMetric, { label: string; unit: string; lowerBetter?: boolean }>> = {
  exit_velocity_mph: { label: 'Exit Velo', unit: 'mph' },
  sprint_10yd_seconds: { label: '10-Yard Sprint', unit: 's', lowerBetter: true },
  throw_velocity_mph: { label: 'Throw Velo', unit: 'mph' },
  rot_power_watts: { label: 'Rotational Power', unit: 'W' },
  strength_index: { label: 'Strength Index', unit: '' },
};

interface Props {
  keyMetrics: Partial<Record<KeyMetric, MetricReading>>;
}

export function PRAlertBanner({ keyMetrics }: Props) {
  // Find any metric with a positive improvement delta
  let prMetric: { label: string; value: number; unit: string } | null = null;

  for (const [key, reading] of Object.entries(keyMetrics)) {
    if (!reading?.delta || reading.delta === 0) continue;
    const meta = METRIC_LABELS[key as KeyMetric];
    if (!meta) continue;

    const isPR = meta.lowerBetter ? reading.delta < 0 : reading.delta > 0;
    if (isPR) {
      prMetric = { label: meta.label, value: reading.value, unit: meta.unit };
      break; // Show only the first PR
    }
  }

  if (!prMetric) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="trophy" size={18} color="#f59e0b" />
      <View style={{ flex: 1 }}>
        <Text style={styles.prLabel}>NEW PR</Text>
        <Text style={styles.prText}>
          {prMetric.label}: {prMetric.value}{prMetric.unit ? ` ${prMetric.unit}` : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f59e0b10',
    borderWidth: 1,
    borderColor: '#f59e0b30',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 12,
  },
  prLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#f59e0b',
  },
  prText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

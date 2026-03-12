import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SparklineChart } from './SparklineChart';
import { METRIC_CONFIG, type MetricType, type ProgressEntry } from '@/types/progress';

interface MetricCardProps {
  metricType: MetricType;
  entries: ProgressEntry[];
}

export function MetricCard({ metricType, entries }: MetricCardProps) {
  const config = METRIC_CONFIG[metricType];
  const sorted = [...entries].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );
  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];
  const values = sorted.map((e) => e.value);

  const delta = previous ? latest?.value - previous.value : null;
  const isGood = config.higherIsBetter
    ? (delta ?? 0) >= 0
    : (delta ?? 0) <= 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={18} color={Colors.primary} />
        <Text style={styles.label} numberOfLines={1}>{config.label}</Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>
          {latest ? latest.value.toFixed(1) : '\u2014'}
        </Text>
        <Text style={styles.unit}>{config.unit}</Text>
      </View>

      {delta !== null && (
        <View style={styles.deltaRow}>
          <Ionicons
            name={isGood ? 'trending-up' : 'trending-down'}
            size={12}
            color={isGood ? Colors.success : Colors.error}
          />
          <Text style={[styles.delta, { color: isGood ? Colors.success : Colors.error }]}>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}
          </Text>
        </View>
      )}

      <SparklineChart
        values={values}
        width={100}
        height={28}
        higherIsBetter={config.higherIsBetter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 6,
    flex: 1,
    minWidth: 140,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, flex: 1 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  value: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary },
  unit: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  delta: { fontSize: 12, fontWeight: '700' },
});

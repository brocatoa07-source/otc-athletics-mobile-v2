import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  loadSnapshots,
  TREND_METRICS,
  STRENGTH_INPUTS,
  computeDelta,
  getStrengthBand,
  type PerformanceTrendSnapshot,
  type TrendMetricConfig,
} from '@/data/performance-trend';

const ACCENT = '#3b82f6';

export default function SnapshotDetail() {
  const { index: indexStr } = useLocalSearchParams<{ index: string }>();
  const idx = parseInt(indexStr ?? '0', 10);

  const [snapshot, setSnapshot] = useState<PerformanceTrendSnapshot | null>(null);
  const [previous, setPrevious] = useState<PerformanceTrendSnapshot | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSnapshots().then((all) => {
        setSnapshot(all[idx] ?? null);
        setPrevious(all[idx + 1] ?? null);
      });
    }, [idx]),
  );

  if (!snapshot) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Snapshot</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Snapshot not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const date = new Date(snapshot.testDate + 'T12:00:00');
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Test Snapshot</Text>
          <Text style={styles.headerSub}>{dateStr}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {snapshot.note ? (
          <View style={styles.noteCard}>
            <Ionicons name="document-text-outline" size={14} color={colors.textMuted} />
            <Text style={styles.noteText}>{snapshot.note}</Text>
          </View>
        ) : null}

        {/* Performance Metrics */}
        <Text style={styles.sectionLabel}>PERFORMANCE METRICS</Text>
        {TREND_METRICS.map((m) => {
          const val = getVal(snapshot, m.key);
          if (val === null) return null;
          const prevVal = previous ? getVal(previous, m.key) : null;
          const delta = computeDelta(val, prevVal, m.higherIsBetter);
          return (
            <MetricRow
              key={m.key}
              config={m}
              value={val}
              delta={delta}
              previousValue={prevVal}
            />
          );
        })}

        {/* Strength Inputs */}
        {(snapshot.trapBarDeadlift !== null || snapshot.frontSquat !== null || snapshot.splitSquat !== null) && (
          <>
            <Text style={styles.sectionLabel}>STRENGTH INPUTS</Text>
            {STRENGTH_INPUTS.map((m) => {
              const val = getVal(snapshot, m.key);
              if (val === null) return null;
              const prevVal = previous ? getVal(previous, m.key) : null;
              const delta = computeDelta(val, prevVal, m.higherIsBetter);
              return (
                <MetricRow
                  key={m.key}
                  config={m}
                  value={val}
                  delta={delta}
                  previousValue={prevVal}
                />
              );
            })}
          </>
        )}

        {/* Strength Index */}
        {snapshot.strengthIndex !== null && (
          <>
            <Text style={styles.sectionLabel}>STRENGTH INDEX</Text>
            <View style={styles.siCard}>
              <Text style={styles.siValue}>{snapshot.strengthIndex.toFixed(2)}</Text>
              <View style={[styles.siBand, { backgroundColor: getStrengthBand(snapshot.strengthIndex).color + '18' }]}>
                <Text style={[styles.siBandText, { color: getStrengthBand(snapshot.strengthIndex).color }]}>
                  {getStrengthBand(snapshot.strengthIndex).label}
                </Text>
              </View>
              {previous?.strengthIndex != null && (() => {
                const d = computeDelta(snapshot.strengthIndex, previous.strengthIndex, true);
                return d ? (
                  <Text style={[styles.siDelta, { color: d.improved ? '#22c55e' : '#ef4444' }]}>
                    {d.display} from previous
                  </Text>
                ) : null;
              })()}
              <Text style={styles.siDesc}>
                Lower-body strength relative to bodyweight using Trap Bar Deadlift, Front Squat, and RFE Split Squat.
              </Text>
            </View>
          </>
        )}

        {/* Empty metrics note */}
        {TREND_METRICS.every((m) => getVal(snapshot, m.key) === null) && snapshot.strengthIndex === null && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No metrics recorded in this snapshot.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Metric Row ─────────────────────────────────── */

function MetricRow({
  config, value, delta, previousValue,
}: {
  config: TrendMetricConfig;
  value: number;
  delta: { raw: number; display: string; improved: boolean } | null;
  previousValue: number | null;
}) {
  const fmtVal = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return (
    <View style={styles.metricRow}>
      <Ionicons name={config.icon} size={16} color={ACCENT} />
      <View style={{ flex: 1 }}>
        <Text style={styles.metricLabel}>{config.label}</Text>
        {previousValue !== null && (
          <Text style={styles.metricPrev}>
            Prev: {Number.isInteger(previousValue) ? previousValue : previousValue.toFixed(1)} {config.unit}
          </Text>
        )}
      </View>
      <View style={styles.metricRight}>
        <Text style={styles.metricValue}>{fmtVal} {config.unit}</Text>
        {delta && (
          <Text style={[styles.metricDelta, { color: delta.improved ? '#22c55e' : '#ef4444' }]}>
            {delta.display}
          </Text>
        )}
      </View>
    </View>
  );
}

function getVal(snap: PerformanceTrendSnapshot, key: string): number | null {
  return (snap as any)[key] ?? null;
}

/* ─── Styles ─────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  headerSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  content: { padding: 16, paddingBottom: 60, gap: 10 },

  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  noteText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, flex: 1 },

  sectionLabel: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
    color: colors.textMuted, marginTop: 10, marginBottom: -2,
  },

  metricRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  metricLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  metricPrev: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  metricRight: { alignItems: 'flex-end', gap: 2 },
  metricValue: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  metricDelta: { fontSize: 12, fontWeight: '800' },

  siCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 20, alignItems: 'center', gap: 8,
  },
  siValue: { fontSize: 32, fontWeight: '900', color: colors.textPrimary },
  siBand: { borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5 },
  siBandText: { fontSize: 13, fontWeight: '800' },
  siDelta: { fontSize: 13, fontWeight: '800' },
  siDesc: { fontSize: 11, color: colors.textMuted, textAlign: 'center', lineHeight: 16, marginTop: 4 },

  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 14, color: colors.textSecondary },
});

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  loadSnapshots,
  getRetestInfo,
  TREND_METRICS,
  computeDelta,
  getStrengthBand,
  type PerformanceTrendSnapshot,
} from '@/data/performance-trend';

const ACCENT = '#3b82f6';

export default function PerformanceTrendHome() {
  const [snapshots, setSnapshots] = useState<PerformanceTrendSnapshot[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSnapshots().then((data) => {
        setSnapshots(data);
        setLoaded(true);
      });
    }, []),
  );

  const latest = snapshots[0] ?? null;
  const previous = snapshots[1] ?? null;
  const retest = getRetestInfo(snapshots);

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Performance Trend</Text>
          <Text style={styles.headerSub}>4-Week Retest Snapshot System</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(app)/progress/entry' as any)}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Retest Guidance */}
        <View style={styles.retestCard}>
          <Ionicons name="calendar-outline" size={18} color={ACCENT} />
          <View style={{ flex: 1 }}>
            {retest.lastTestDate ? (
              <>
                <Text style={styles.retestTitle}>
                  Last tested {retest.daysSince}d ago
                  {retest.isDue ? ' · Retest due' : ''}
                </Text>
                <Text style={styles.retestSub}>
                  {retest.isDue
                    ? 'Log a new test to track your development.'
                    : `Next suggested retest: ${retest.suggestedNext}`}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.retestTitle}>No tests logged yet</Text>
                <Text style={styles.retestSub}>Log your first testing snapshot to start tracking.</Text>
              </>
            )}
          </View>
        </View>

        <Text style={styles.guidanceCopy}>
          Real progress is measured — not guessed. Retest every 4 weeks under the same conditions. Compare baseline to latest. That is your truth.
        </Text>

        {/* Latest Snapshot Summary */}
        {latest && (
          <>
            <Text style={styles.sectionLabel}>LATEST SNAPSHOT</Text>
            <TouchableOpacity
              style={styles.snapshotCard}
              onPress={() => router.push({ pathname: '/(app)/progress/snapshot', params: { index: '0' } } as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.snapshotDate}>{formatDate(latest.testDate)}</Text>
              <View style={styles.metricsGrid}>
                {TREND_METRICS.filter((m) => getVal(latest, m.key) !== null).map((m) => {
                  const val = getVal(latest, m.key)!;
                  const prevVal = previous ? getVal(previous, m.key) : null;
                  const delta = computeDelta(val, prevVal, m.higherIsBetter);
                  return (
                    <View key={m.key} style={styles.metricCell}>
                      <Text style={styles.metricValue}>{formatVal(val)} {m.unit}</Text>
                      <View style={styles.metricLabelRow}>
                        <Text style={styles.metricLabel}>{m.label}</Text>
                        {delta && (
                          <Text style={[styles.deltaText, { color: delta.improved ? '#22c55e' : '#ef4444' }]}>
                            {delta.display}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
                {/* Strength Index */}
                {latest.strengthIndex !== null && (
                  <View style={styles.metricCell}>
                    <Text style={styles.metricValue}>{latest.strengthIndex.toFixed(2)}</Text>
                    <View style={styles.metricLabelRow}>
                      <Text style={styles.metricLabel}>Str. Index</Text>
                      {previous?.strengthIndex != null && (() => {
                        const d = computeDelta(latest.strengthIndex, previous.strengthIndex, true);
                        return d ? (
                          <Text style={[styles.deltaText, { color: d.improved ? '#22c55e' : '#ef4444' }]}>
                            {d.display}
                          </Text>
                        ) : null;
                      })()}
                    </View>
                    <Text style={[styles.bandLabel, { color: getStrengthBand(latest.strengthIndex).color }]}>
                      {getStrengthBand(latest.strengthIndex).label}
                    </Text>
                  </View>
                )}
              </View>
              {latest.note ? (
                <Text style={styles.notePreview} numberOfLines={1}>Note: {latest.note}</Text>
              ) : null}
              <View style={styles.tapHint}>
                <Text style={styles.tapHintText}>Tap for full details</Text>
                <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/(app)/progress/entry' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.ctaBtnText}>Log New Test</Text>
        </TouchableOpacity>

        {/* History */}
        {snapshots.length > 1 && (
          <>
            <Text style={styles.sectionLabel}>HISTORY</Text>
            {snapshots.slice(1).map((snap, i) => (
              <TouchableOpacity
                key={snap.id}
                style={styles.historyRow}
                onPress={() => router.push({ pathname: '/(app)/progress/snapshot', params: { index: String(i + 1) } } as any)}
                activeOpacity={0.8}
              >
                <View style={styles.historyDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyDate}>{formatDate(snap.testDate)}</Text>
                  <Text style={styles.historySummary}>
                    {summarizeSnapshot(snap)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Empty state */}
        {snapshots.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="speedometer-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Track Your Development</Text>
            <Text style={styles.emptySub}>
              Log testing results every 4 weeks to see how you're improving across speed, power, strength, and more.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Helpers ────────────────────────────────────── */

function getVal(snap: PerformanceTrendSnapshot, key: string): number | null {
  return (snap as any)[key] ?? null;
}

function formatVal(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function summarizeSnapshot(snap: PerformanceTrendSnapshot): string {
  const parts: string[] = [];
  if (snap.exitVelo !== null) parts.push(`EV ${snap.exitVelo}`);
  if (snap.throwingVelo !== null) parts.push(`TV ${snap.throwingVelo}`);
  if (snap.batSpeed !== null) parts.push(`BS ${snap.batSpeed}`);
  if (snap.strengthIndex !== null) parts.push(`SI ${snap.strengthIndex.toFixed(2)}`);
  return parts.length > 0 ? parts.join(' · ') : 'Tap to view';
}

/* ─── Styles ─────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  headerSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  addBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  retestCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: ACCENT + '0A', borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.lg, padding: 14,
  },
  retestTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  retestSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  guidanceCopy: {
    fontSize: 12, color: colors.textMuted, lineHeight: 17, textAlign: 'center',
    paddingHorizontal: 12,
  },

  sectionLabel: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
    color: colors.textMuted, marginTop: 8, marginBottom: -4,
  },

  snapshotCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 10,
  },
  snapshotDate: { fontSize: 13, fontWeight: '800', color: ACCENT },
  metricsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  metricCell: { minWidth: '28%' as any, alignItems: 'center', gap: 2, paddingVertical: 4 },
  metricValue: { fontSize: 15, fontWeight: '900', color: colors.textPrimary },
  metricLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metricLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted },
  deltaText: { fontSize: 9, fontWeight: '800' },
  bandLabel: { fontSize: 9, fontWeight: '800', marginTop: 1 },
  notePreview: {
    fontSize: 11, color: colors.textMuted, fontStyle: 'italic',
    borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8,
  },
  tapHint: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  tapHintText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: ACCENT, borderRadius: radius.lg,
    paddingVertical: 14, marginTop: 4,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  historyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  historyDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.textMuted,
  },
  historyDate: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  historySummary: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },

  emptyState: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  emptySub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19, paddingHorizontal: 20 },
});

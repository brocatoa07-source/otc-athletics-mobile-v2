import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { computeMentalTrends, MENTAL_LANES, type MentalMetricTrend } from '@/features/mental/mentalProgress';
import { computeMentalFocus, type MentalFocusState } from '@/features/mental/mentalFocusEngine';
import { useMentalProfile } from '@/hooks/useMentalProfile';
import { loadLaneLevels, type LaneLevelState } from '@/features/mental/mentalProgression';

const ACCENT = '#a855f7';

const TREND_ICON: Record<string, { icon: string; color: string }> = {
  improving: { icon: 'trending-up', color: '#22c55e' },
  flat: { icon: 'remove', color: '#f59e0b' },
  declining: { icon: 'trending-down', color: '#ef4444' },
  unknown: { icon: 'help-circle', color: colors.textMuted },
};

export default function MentalProgressScreen() {
  const { profile } = useMentalProfile();
  const [trends, setTrends] = useState<MentalMetricTrend[]>([]);
  const [focus, setFocus] = useState<MentalFocusState | null>(null);
  const [laneLevels, setLaneLevels] = useState<LaneLevelState>({});
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [t, f, ll] = await Promise.all([
          computeMentalTrends(),
          computeMentalFocus(profile?.primary_archetype ?? null),
          loadLaneLevels(),
        ]);
        if (active) { setTrends(t); setFocus(f); setLaneLevels(ll); setLoading(false); }
      })();
      return () => { active = false; };
    }, [profile?.primary_archetype]),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}><ActivityIndicator color={ACCENT} size="large" /></View>
      </SafeAreaView>
    );
  }

  const improving = trends.filter(t => t.trend === 'improving');
  const declining = trends.filter(t => t.trend === 'declining');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL</Text>
          <Text style={styles.headerTitle}>Mental Progress</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Current Focus */}
        {focus && (
          <View style={[styles.focusCard, { borderColor: ACCENT + '30' }]}>
            <Ionicons name="bulb" size={16} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.focusTitle}>{focus.focusTitle}</Text>
              <Text style={styles.focusSub}>{focus.weekFocus}</Text>
              <Text style={styles.focusReason}>{focus.reason}</Text>
            </View>
          </View>
        )}

        {/* Summary */}
        {(improving.length > 0 || declining.length > 0) && (
          <View style={styles.summaryRow}>
            {improving.length > 0 && (
              <View style={[styles.summaryChip, { borderColor: '#22c55e30' }]}>
                <Ionicons name="trending-up" size={12} color="#22c55e" />
                <Text style={[styles.summaryText, { color: '#22c55e' }]}>
                  {improving.map(t => t.label).join(', ')}
                </Text>
              </View>
            )}
            {declining.length > 0 && (
              <View style={[styles.summaryChip, { borderColor: '#ef444430' }]}>
                <Ionicons name="trending-down" size={12} color="#ef4444" />
                <Text style={[styles.summaryText, { color: '#ef4444' }]}>
                  {declining.map(t => t.label).join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Check-In CTA */}
        <TouchableOpacity
          style={[styles.checkinCta, { borderColor: ACCENT + '30' }]}
          onPress={() => router.push('/(app)/training/mental/mental-checkin' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={16} color={ACCENT} />
          <Text style={[styles.checkinCtaText, { color: ACCENT }]}>Log Mental Check-In</Text>
        </TouchableOpacity>

        {/* Metric Cards */}
        <Text style={styles.sectionLabel}>MENTAL METRICS</Text>
        {trends.map((t) => {
          const tr = TREND_ICON[t.trend] ?? TREND_ICON.unknown;
          return (
            <View key={t.key} style={styles.metricCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.metricLabel}>{t.label}</Text>
                {t.latest !== null ? (
                  <Text style={styles.metricValue}>
                    {t.latest}{t.key.includes('Completion') || t.key.includes('Usage') ? '%' : '/10'}
                  </Text>
                ) : (
                  <Text style={[styles.metricValue, { color: colors.textMuted }]}>No data yet</Text>
                )}
              </View>
              <View style={styles.trendBadge}>
                <Ionicons name={tr.icon as any} size={14} color={tr.color} />
                <Text style={[styles.trendText, { color: tr.color }]}>{t.trend}</Text>
              </View>
              {t.delta !== null && (
                <Text style={[styles.deltaText, { color: t.delta > 0 ? '#22c55e' : t.delta < 0 ? '#ef4444' : colors.textMuted }]}>
                  {t.delta > 0 ? '+' : ''}{t.delta.toFixed(1)}
                </Text>
              )}
            </View>
          );
        })}

        {/* Lane Progress — tappable */}
        <Text style={styles.sectionLabel}>DEVELOPMENT LANES</Text>
        {MENTAL_LANES.map((lane) => {
          const isCurrent = focus?.currentLane === lane.key;
          const level = laneLevels[lane.key] ?? (isCurrent ? (focus?.currentLevel ?? 0) : 0);
          const currentLvl = lane.levels[Math.min(level, lane.levels.length - 1)];
          return (
            <TouchableOpacity
              key={lane.key}
              style={[styles.laneCard, isCurrent && { borderColor: ACCENT + '40' }]}
              onPress={() => router.push(`/(app)/training/mental/lane-detail?lane=${lane.key}` as any)}
              activeOpacity={0.75}
            >
              <View style={styles.laneHeader}>
                <Text style={[styles.laneTitle, isCurrent && { color: ACCENT }]}>{lane.title}</Text>
                {isCurrent && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </View>
              <Text style={styles.laneLevelText}>Level {level} — {currentLvl.title}</Text>
              <Text style={styles.laneDesc}>{currentLvl.description}</Text>
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </SafeAreaView>
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
  content: { padding: 16, paddingBottom: 60, gap: 10 },

  focusCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.md,
  },
  focusTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  focusSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  focusReason: { fontSize: 10, color: colors.textMuted, fontStyle: 'italic', marginTop: 4 },

  summaryRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  summaryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderRadius: radius.sm, backgroundColor: colors.bg,
  },
  summaryText: { fontSize: 10, fontWeight: '700' },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 8 },

  metricCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  metricLabel: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  metricValue: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  trendText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  deltaText: { fontSize: 11, fontWeight: '800', minWidth: 30, textAlign: 'right' },

  laneCard: {
    padding: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, gap: 3,
  },
  laneHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  laneTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  activeBadge: { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: ACCENT + '15', borderRadius: 4 },
  activeBadgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1, color: ACCENT },
  laneLevelText: { fontSize: 11, color: colors.textMuted },
  laneDesc: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
  checkinCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: 12, borderWidth: 1, borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  checkinCtaText: { fontSize: 13, fontWeight: '800' },
});

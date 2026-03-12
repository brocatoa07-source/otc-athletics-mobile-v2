import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { Colors } from '@/constants/colors';
import { MetricCard } from '@/components/progress/MetricCard';
import { EmptyState } from '@/components/common/EmptyState';
import { METRIC_CONFIG, type MetricType, type ProgressEntry } from '@/types/progress';

const ALL_METRICS = Object.keys(METRIC_CONFIG) as MetricType[];

export default function ProgressScreen() {
  const athlete = useAuthStore((s) => s.athlete);

  const { data, isLoading } = useQuery({
    queryKey: ['progress', athlete?.id],
    enabled: !!athlete?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('athlete_progress')
        .select('*')
        .eq('athlete_id', athlete!.id)
        .order('recorded_at', { ascending: false })
        .limit(100);
      return (data ?? []) as ProgressEntry[];
    },
  });

  const byMetric = ALL_METRICS.reduce<Record<MetricType, ProgressEntry[]>>((acc, m) => {
    acc[m] = (data ?? []).filter((e) => e.metric_type === m);
    return acc;
  }, {} as Record<MetricType, ProgressEntry[]>);

  const hasAnyData = Object.values(byMetric).some((arr) => arr.length > 0);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.sub}>Track what reinforces standards.</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(app)/progress/entry' as any)}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.center}><ActivityIndicator color={Colors.primary} /></View>
      )}

      {!isLoading && !hasAnyData && (
        <EmptyState
          icon="stats-chart"
          title="No metrics logged yet"
          subtitle="Start tracking to see your progress over time."
          actionLabel="Log First Entry"
          onAction={() => router.push('/(app)/progress/entry' as any)}
        />
      )}

      {!isLoading && hasAnyData && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {ALL_METRICS.filter((m) => byMetric[m].length > 0).map((metric) => (
            <View key={metric} style={styles.metricRow}>
              <MetricCard metricType={metric} entries={byMetric[metric]} />
            </View>
          ))}

          <Text style={styles.untracked}>ALSO TRACK</Text>
          <View style={styles.untrackedGrid}>
            {ALL_METRICS.filter((m) => byMetric[m].length === 0).map((metric) => (
              <TouchableOpacity
                key={metric}
                style={styles.untrackedCard}
                onPress={() => router.push({ pathname: '/(app)/progress/entry', params: { metric } } as any)}
              >
                <Ionicons
                  name={METRIC_CONFIG[metric].icon as keyof typeof Ionicons.glyphMap}
                  size={18}
                  color={Colors.textMuted}
                />
                <Text style={styles.untrackedLabel}>{METRIC_CONFIG[metric].label}</Text>
                <Text style={styles.untrackedPlus}>+</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  metricRow: {},
  untracked: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 12,
    marginBottom: 8,
  },
  untrackedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  untrackedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  untrackedLabel: { fontSize: 12, color: Colors.textMuted },
  untrackedPlus: { fontSize: 16, color: Colors.textMuted, marginLeft: 2 },
});

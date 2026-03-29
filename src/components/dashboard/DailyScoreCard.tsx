import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { DailyScoreBreakdown } from '@/data/engagement-engine';

const CATEGORIES: { key: keyof Omit<DailyScoreBreakdown, 'total'>; label: string; icon: string; color: string }[] = [
  { key: 'hitting', label: 'Hitting', icon: 'baseball-outline', color: '#E10600' },
  { key: 'strength', label: 'Strength', icon: 'barbell-outline', color: '#1DB954' },
  { key: 'mental', label: 'Mental', icon: 'brain-outline', color: '#A78BFA' },
  { key: 'recovery', label: 'Recovery', icon: 'heart-outline', color: '#3b82f6' },
];

function getScoreColor(score: number): string {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  if (score >= 25) return '#f97316';
  return '#ef4444';
}

export function DailyScoreCard({ breakdown }: { breakdown: DailyScoreBreakdown | null }) {
  const score = breakdown?.total ?? 0;
  const scoreColor = getScoreColor(score);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: scoreColor + '18' }]}>
          <Ionicons name="speedometer-outline" size={18} color={scoreColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>DAILY SCORE</Text>
        </View>
        <Text style={[styles.score, { color: scoreColor }]}>{score}</Text>
        <Text style={styles.scoreMax}>/100</Text>
      </View>

      {/* Progress ring simplified as bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${score}%`, backgroundColor: scoreColor }]} />
      </View>

      {/* Category breakdown */}
      <View style={styles.categories}>
        {CATEGORIES.map((cat) => {
          const val = breakdown?.[cat.key] ?? 0;
          const done = val > 0;
          return (
            <View key={cat.key} style={styles.catItem}>
              <View style={[styles.catDot, { backgroundColor: done ? cat.color : colors.border }]}>
                <Ionicons name={cat.icon as any} size={12} color={done ? '#fff' : colors.textMuted} />
              </View>
              <Text style={[styles.catLabel, done && { color: cat.color }]}>{cat.label}</Text>
              <Text style={[styles.catVal, done && { color: colors.textPrimary }]}>{val}/25</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 10,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
  score: {
    fontSize: 28,
    fontWeight: '900',
  },
  scoreMax: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  catDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  catVal: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
  },
});

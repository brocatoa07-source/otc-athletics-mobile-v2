import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { WeeklyChallengeProgress, ChallengeDefinition } from '@/data/engagement-engine';

interface Props {
  challenge: WeeklyChallengeProgress;
  definition: ChallengeDefinition;
}

export function WeeklyChallengeCard({ challenge, definition }: Props) {
  const req = definition.requirements;
  const accent = challenge.completed ? '#22c55e' : '#3b82f6';

  const bars = [
    { label: 'Hitting', current: challenge.hittingSessions, target: req.hittingSessions, color: '#E10600' },
    { label: 'Strength', current: challenge.strengthWorkouts, target: req.strengthWorkouts, color: '#1DB954' },
    { label: 'Mental', current: challenge.mentalSessions, target: req.mentalSessions, color: '#A78BFA' },
  ];

  return (
    <View style={[styles.card, { borderColor: accent + '30' }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: accent + '18' }]}>
          <Ionicons name={challenge.completed ? 'checkmark-circle' : 'flag-outline'} size={18} color={accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>WEEKLY CHALLENGE</Text>
          <Text style={styles.title}>{definition.name}</Text>
        </View>
        {challenge.completed && (
          <View style={styles.completeBadge}>
            <Text style={styles.completeBadgeText}>COMPLETE</Text>
          </View>
        )}
      </View>

      <Text style={styles.desc}>{definition.description}</Text>

      <View style={styles.bars}>
        {bars.map((bar) => {
          const pct = Math.min(100, (bar.current / bar.target) * 100);
          return (
            <View key={bar.label} style={styles.barRow}>
              <Text style={styles.barLabel}>{bar.label}</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${pct}%`, backgroundColor: bar.color }]} />
              </View>
              <Text style={[styles.barVal, { color: bar.current >= bar.target ? '#22c55e' : colors.textMuted }]}>
                {bar.current}/{bar.target}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.reward}>
        <Ionicons name="star-outline" size={11} color="#f59e0b" /> +{definition.xpReward} XP on completion
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
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
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 1,
  },
  completeBadge: {
    backgroundColor: '#22c55e20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  completeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#22c55e',
    letterSpacing: 1,
  },
  desc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  bars: { gap: 6 },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    width: 60,
  },
  track: {
    flex: 1,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: 5,
    borderRadius: 3,
  },
  barVal: {
    fontSize: 11,
    fontWeight: '800',
    width: 28,
    textAlign: 'right',
  },
  reward: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f59e0b',
  },
});

/**
 * StreakCard — Compact OTC training streak display.
 *
 * Shows current streak count with subtle flame indicator.
 * Matches existing dashboard card styling language.
 */

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#f59e0b';

interface StreakCardProps {
  streakDays: number;
  streakLabel: string;
}

export function StreakCard({ streakDays, streakLabel }: StreakCardProps) {
  const hasStreak = streakDays > 0;

  return (
    <View style={[styles.card, hasStreak && styles.cardActive]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, hasStreak && styles.iconWrapActive]}>
          <Ionicons
            name={hasStreak ? 'flame' : 'flame-outline'}
            size={20}
            color={hasStreak ? ACCENT : colors.textMuted}
          />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.label}>OTC Streak</Text>
          <Text style={styles.sublabel}>{streakLabel}</Text>
        </View>
        <View style={styles.countCol}>
          <Text style={[styles.countNum, hasStreak && { color: ACCENT }]}>
            {streakDays}
          </Text>
          <Text style={styles.countUnit}>
            {streakDays === 1 ? 'day' : 'days'}
          </Text>
        </View>
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
    marginTop: 10,
  },
  cardActive: {
    borderColor: ACCENT + '30',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: ACCENT + '15',
  },
  textCol: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sublabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 1,
  },
  countCol: {
    alignItems: 'center',
  },
  countNum: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  countUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

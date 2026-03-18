import { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useMyProgram } from '@/hooks/useMyProgram';
import { useAccountability } from '@/hooks/useAccountability';
import type { CanonicalTier } from '@/hooks/useTier';
import {
  getStandardKeysForTier,
  type RequiredTodayItemKey,
} from '@/hooks/useRequiredTodayConfig';
import { getStreakInfo } from '@/data/own-the-cost-checkin';

const ACCENT = '#f59e0b';

interface Props {
  tier: CanonicalTier;
  isCoach: boolean;
}

export function TodaysMissionHeader({ tier, isCoach }: Props) {
  const [streak, setStreak] = useState(0);

  const { completedToday } = useMyProgram();
  const {
    otcCheckedInToday, skillWorkDoneToday, mentalDoneToday, journalDoneToday,
  } = useAccountability();

  useFocusEffect(
    useCallback(() => {
      getStreakInfo().then((info) => setStreak(info.streak));
    }, []),
  );

  const effectiveTier = isCoach ? 'COACH' : tier;
  if (effectiveTier === 'WALK') return null;

  const tierKeys = getStandardKeysForTier(effectiveTier);

  const completions: Record<RequiredTodayItemKey, boolean> = {
    readiness: otcCheckedInToday,
    training:  completedToday,
    skillWork: skillWorkDoneToday,
    mental:    mentalDoneToday,
    journal:   journalDoneToday,
  };

  const doneCount = tierKeys.filter((k) => completions[k]).length;
  const totalCount = tierKeys.length;
  const allDone = doneCount === totalCount && totalCount > 0;
  const pct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>TODAY'S MISSION</Text>
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={12} color={ACCENT} />
            <Text style={styles.streakText}>{streak} Day{streak !== 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>

      <Text style={styles.headline}>
        {allDone ? 'MISSION COMPLETE' : `${doneCount} / ${totalCount} COMPLETE`}
      </Text>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${pct}%`,
              backgroundColor: allDone ? '#22c55e' : ACCENT,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    color: colors.textMuted,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ACCENT + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '800',
    color: ACCENT,
  },
  headline: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
});

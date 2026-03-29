/**
 * TodaysTrainingCard — Primary dashboard action section.
 *
 * Shows exactly 4 items:
 *   1. Readiness Check-In (done/not-done from useAccountability)
 *   2. Hitting Focus (routes to hitting vault daily work)
 *   3. Strength Workout (routes to strength workout)
 *   4. Mental Reset (routes to mental daily work)
 *
 * Readiness appears checked off when OTC check-in is already done today.
 */

import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, radius } from '@/theme';
import { useAccountability } from '@/hooks/useAccountability';
import { useMyProgram } from '@/hooks/useMyProgram';
import { getStreakInfo } from '@/data/own-the-cost-checkin';

interface TrainingItem {
  key: string;
  label: string;
  icon: string;
  color: string;
  route: string;
  done: boolean;
}

export function TodaysTrainingCard() {
  const { otcCheckedInToday, skillWorkDoneToday, mentalDoneToday } = useAccountability();
  const { completedToday: strengthDone } = useMyProgram();
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getStreakInfo().then((info) => setStreak(info.streak));
    }, []),
  );

  const items: TrainingItem[] = [
    {
      key: 'readiness',
      label: 'Readiness Check-In',
      icon: 'pulse-outline',
      color: '#f59e0b',
      route: '/(app)/training/own-the-cost-checkin',
      done: otcCheckedInToday,
    },
    {
      key: 'hitting',
      label: 'Hitting Focus',
      icon: 'baseball-outline',
      color: '#E10600',
      route: '/(app)/training/mechanical/daily-work',
      done: skillWorkDoneToday,
    },
    {
      key: 'strength',
      label: 'Strength Workout',
      icon: 'barbell-outline',
      color: '#1DB954',
      route: '/(app)/training/sc/workout',
      done: strengthDone,
    },
    {
      key: 'mental',
      label: 'Mental Reset',
      icon: 'brain-outline',
      color: '#A78BFA',
      route: '/(app)/training/mental/daily-work',
      done: mentalDoneToday,
    },
  ];

  const doneCount = items.filter((i) => i.done).length;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="flash" size={16} color="#E10600" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>TODAY'S TRAINING</Text>
        </View>
        <Text style={styles.counter}>{doneCount}/{items.length}</Text>
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={12} color="#f59e0b" />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        )}
      </View>

      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.row}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.check, item.done && { backgroundColor: '#22c55e', borderColor: '#22c55e' }]}>
            {item.done && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
          <Ionicons name={item.icon as any} size={16} color={item.done ? colors.textMuted : item.color} />
          <Text style={[styles.rowLabel, item.done && styles.rowLabelDone]}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E1060030',
    borderRadius: radius.lg,
    padding: 14,
    gap: 6,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E1060018',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#E10600',
  },
  counter: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f59e0b18',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#f59e0b',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rowLabelDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});

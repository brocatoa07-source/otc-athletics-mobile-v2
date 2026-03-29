/**
 * EngagementStrip — Compact row showing streak + level + XP.
 * Displayed on the dashboard between header and daily score.
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius } from '@/theme';
import type { StreakData, XPData } from '@/data/engagement-engine';

interface Props {
  streak: StreakData;
  xp: XPData;
}

export function EngagementStrip({ streak, xp }: Props) {
  const xpProgress = xp.xpForNextLevel > xp.xpForCurrentLevel
    ? ((xp.xpInLevel) / (xp.xpForNextLevel - xp.xpForCurrentLevel)) * 100
    : 100;

  return (
    <View style={styles.strip}>
      {/* Streak */}
      <View style={styles.cell}>
        <Ionicons name="flame" size={16} color={streak.currentStreak > 0 ? '#f59e0b' : colors.textMuted} />
        <Text style={[styles.cellValue, streak.currentStreak > 0 && { color: '#f59e0b' }]}>
          {streak.currentStreak}
        </Text>
        <Text style={styles.cellLabel}>streak</Text>
      </View>

      <View style={styles.divider} />

      {/* Level + XP */}
      <TouchableOpacity
        style={[styles.cell, { flex: 2 }]}
        onPress={() => router.push('/(app)/profile/athlete-identity' as any)}
        activeOpacity={0.7}
      >
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv{xp.level}</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.xpText}>{xp.totalXP} XP</Text>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${Math.min(100, xpProgress)}%` }]} />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Best streak */}
      <View style={styles.cell}>
        <Ionicons name="trophy-outline" size={14} color={colors.textMuted} />
        <Text style={styles.cellValue}>{streak.longestStreak}</Text>
        <Text style={styles.cellLabel}>best</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  cellValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  cellLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  levelBadge: {
    backgroundColor: '#f59e0b20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f59e0b40',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#f59e0b',
  },
  xpText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  xpTrack: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpFill: {
    height: 3,
    backgroundColor: '#f59e0b',
    borderRadius: 2,
  },
});

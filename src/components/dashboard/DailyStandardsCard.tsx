import { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useMyProgram } from '@/hooks/useMyProgram';
import { useAccountability } from '@/hooks/useAccountability';
import type { CanonicalTier } from '@/hooks/useTier';
import {
  getStandardKeysForTier,
  REQUIRED_TODAY_META,
  type RequiredTodayItemKey,
} from '@/hooks/useRequiredTodayConfig';
import { getStreakInfo } from '@/data/own-the-cost-checkin';

interface Props {
  tier: CanonicalTier | 'COACH';
  isCoach: boolean;
}

export function DailyStandardsCard({ tier, isCoach }: Props) {
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
  const isWalk = effectiveTier === 'WALK';
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

  /* ── Walk tier: locked preview ──────────────── */
  if (isWalk) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(app)/upgrade' as any)}
        activeOpacity={0.85}
      >
        <View style={styles.headerRow}>
          <View style={styles.iconWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Daily Standards</Text>
            <Text style={styles.sub}>Upgrade to unlock your daily checklist</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
        <View style={styles.lockedPreview}>
          {['OTC Check-In', 'Mental Session', 'Journal Entry'].map((label, i) => (
            <View key={label} style={[styles.lockedRow, i < 2 && styles.rowBorder]}>
              <View style={styles.lockedDot} />
              <Text style={styles.lockedLabel}>{label}</Text>
              <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  }

  /* ── Active tier: daily scoreboard ─────────── */
  return (
    <View style={styles.card}>
      {/* ── Header ──────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { backgroundColor: '#f59e0b15' }]}>
          <Ionicons name="trophy-outline" size={20} color="#f59e0b" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Daily Standards</Text>
          <Text style={styles.sub}>{doneCount}/{totalCount} complete today</Text>
        </View>
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={14} color="#f59e0b" />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        )}
      </View>

      {/* ── Daily Checklist ─────────────────── */}
      {tierKeys.map((key) => {
        const meta = REQUIRED_TODAY_META[key];
        const done = completions[key];
        return (
          <TouchableOpacity
            key={key}
            style={[styles.row, styles.rowBorder]}
            onPress={() => router.push(meta.route as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.checkIcon, done && styles.checkIconDone]}>
              <Ionicons
                name={meta.icon as any}
                size={18}
                color={done ? '#22c55e' : colors.textSecondary}
              />
            </View>
            <Text style={[styles.label, done && styles.labelDone]}>{meta.label}</Text>
            {done ? (
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            ) : (
              <View style={styles.emptyCircle} />
            )}
          </TouchableOpacity>
        );
      })}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 12,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  sub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f59e0b15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  streakText: { fontSize: 14, fontWeight: '900', color: '#f59e0b' },

  /* Checklist rows */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkIcon: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  checkIconDone: { backgroundColor: '#22c55e12' },
  label: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  labelDone: { color: colors.textSecondary },
  emptyCircle: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.border,
  },

  /* Locked preview (Walk) */
  lockedPreview: { opacity: 0.5 },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  lockedDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.textMuted,
  },
  lockedLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textMuted },
});

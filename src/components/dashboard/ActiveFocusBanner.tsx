/**
 * ActiveFocusBanner — Dashboard banner for the active troubleshooting block.
 *
 * Shows: topic name, day X/7, progress dots, check-in CTA, view topic link.
 * Uses the same source of truth as the topic page (troubleshooting-engine).
 * Hidden when no active block exists.
 */

import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, radius } from '@/theme';
import {
  loadActiveBlock, checkInToday, getTopicById, getCategoryById,
  getCurrentDayOfBlock, getDaysRemaining, isTodayCheckedIn, getTodaysDrillId,
  type ActiveBlock,
} from '@/data/troubleshooting-engine';
import { getDrillById } from '@/data/tagged-drills';

const ACCENT = '#E10600';

export function ActiveFocusBanner() {
  const [block, setBlock] = useState<ActiveBlock | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadActiveBlock().then(setBlock);
    }, []),
  );

  if (!block || !block.isActive) return null;

  const topic = getTopicById(block.topicId);
  const category = topic ? getCategoryById(topic.categoryId) : null;
  const currentDay = getCurrentDayOfBlock(block.startDate);
  const daysLeft = getDaysRemaining(block.endDate);
  const checkedIn = isTodayCheckedIn(block);
  const catColor = category?.color ?? ACCENT;

  async function handleCheckIn() {
    const updated = await checkInToday();
    if (updated) setBlock(updated);
  }

  return (
    <View style={[styles.card, { borderColor: catColor + '35' }]}>
      {/* Header row */}
      <View style={styles.topRow}>
        <Ionicons name="lock-closed" size={14} color={catColor} />
        <Text style={[styles.label, { color: catColor }]}>CURRENT FOCUS</Text>
        <View style={[styles.dayBadge, { backgroundColor: catColor + '15' }]}>
          <Text style={[styles.dayBadgeText, { color: catColor }]}>Day {Math.min(currentDay, 7)}/7</Text>
        </View>
      </View>

      {/* Topic name */}
      <Text style={styles.topicName}>{topic?.title ?? 'Hitting Focus'}</Text>

      {/* Today's assigned drill (if custom plan exists) */}
      {(() => {
        const drillId = getTodaysDrillId(block);
        const drill = drillId ? getDrillById(drillId) : null;
        if (!drill) return null;
        return (
          <Text style={styles.todayDrill}>Today: {drill.name}</Text>
        );
      })()}

      {/* Progress dots */}
      <View style={styles.dots}>
        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
          <View
            key={d}
            style={[
              styles.dot,
              d <= block.completedDaysCount ? [styles.dotDone, { backgroundColor: catColor }]
                : d === currentDay ? { backgroundColor: catColor + '40' }
                : styles.dotEmpty,
            ]}
          />
        ))}
      </View>

      {/* Meta */}
      <Text style={styles.meta}>
        {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining` : 'Final day'} · {block.completedDaysCount}/7 checked in
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        {!checkedIn ? (
          <TouchableOpacity style={[styles.checkInBtn, { backgroundColor: catColor }]} onPress={handleCheckIn} activeOpacity={0.85}>
            <Ionicons name="checkmark-circle" size={16} color="#fff" />
            <Text style={styles.checkInText}>Mark Today Complete</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.checkedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
            <Text style={styles.checkedText}>Today Complete</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/topic?id=${block.topicId}` as any)}
          activeOpacity={0.8}
        >
          <Text style={[styles.viewBtnText, { color: catColor }]}>View Topic</Text>
          <Ionicons name="chevron-forward" size={12} color={catColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
    marginTop: 10,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    flex: 1,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  topicName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  todayDrill: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  dotDone: {},
  dotEmpty: {
    backgroundColor: colors.border,
  },
  meta: {
    fontSize: 11,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  checkInBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  checkInText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  checkedBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  checkedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#22c55e',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

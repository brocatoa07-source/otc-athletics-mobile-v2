/**
 * ReadinessSummaryCard — Compact post-checkin summary.
 *
 * Shows after the athlete completes today's readiness check-in.
 * Displays score tier, key inputs, and feedback message.
 */

import { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { colors, radius } from '@/theme';
import {
  loadTodayCheckIn,
  scoreDayCheckIn,
  getFeedbackTier,
  getFeedbackMessage,
  getLocalDateString,
  type OwnTheCostCheckInLog,
  type FeedbackTier,
} from '@/data/own-the-cost-checkin';

const TIER_CONFIG: Record<FeedbackTier, { label: string; color: string; icon: string }> = {
  strong: { label: 'Strong Day', color: '#22c55e', icon: 'checkmark-circle' },
  mixed:  { label: 'Mixed Day',  color: '#f59e0b', icon: 'remove-circle' },
  weak:   { label: 'Tough Day',  color: '#ef4444', icon: 'alert-circle' },
};

export function ReadinessSummaryCard() {
  const [log, setLog] = useState<OwnTheCostCheckInLog | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadTodayCheckIn().then(setLog);
    }, []),
  );

  if (!log) return null;

  const score = scoreDayCheckIn(log);
  const tier = getFeedbackTier(log);
  const pct = Math.round((score / 18) * 100);
  const config = TIER_CONFIG[tier];
  const message = getFeedbackMessage(tier, log.date);

  return (
    <View style={[styles.card, { borderColor: config.color + '30' }]}>
      <View style={styles.header}>
        <Ionicons name={config.icon as any} size={18} color={config.color} />
        <Text style={styles.title}>Today's Check-In</Text>
        <View style={[styles.tierBadge, { backgroundColor: config.color + '15' }]}>
          <Text style={[styles.tierText, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>

      {/* Score bar */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreBar}>
          <View style={[styles.scoreFill, { width: `${pct}%`, backgroundColor: config.color }]} />
        </View>
        <Text style={[styles.scorePct, { color: config.color }]}>{pct}%</Text>
      </View>

      {/* Key inputs */}
      <View style={styles.inputRow}>
        <View style={styles.inputChip}>
          <Ionicons name="flash-outline" size={10} color={colors.textMuted} />
          <Text style={styles.inputText}>Energy: {log.energy}</Text>
        </View>
        <View style={styles.inputChip}>
          <Ionicons name="eye-outline" size={10} color={colors.textMuted} />
          <Text style={styles.inputText}>Focus: {log.focus.replace('_', ' ')}</Text>
        </View>
        <View style={styles.inputChip}>
          <Ionicons name="barbell-outline" size={10} color={colors.textMuted} />
          <Text style={styles.inputText}>Work: {log.workCompletion}</Text>
        </View>
      </View>

      {/* Feedback */}
      <Text style={[styles.feedback, { color: config.color }]}>{message}</Text>
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
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: 6,
    borderRadius: 3,
  },
  scorePct: {
    fontSize: 12,
    fontWeight: '900',
    width: 34,
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  inputChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: colors.bg,
  },
  inputText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  feedback: {
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 17,
  },
});

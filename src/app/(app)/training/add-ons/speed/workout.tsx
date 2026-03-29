/**
 * Speed Program — Workout View
 *
 * Full session with warm-up → mechanics → sprints → plyos.
 * Shows exact distances, reps, rest, and total yardage.
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { getSpeedWeek } from '@/data/speed-program/program';
import { getSpeedPhaseForWeek } from '@/data/speed-program/product';
import {
  loadSpeedProgress, completeSpeedSession, isSpeedSessionComplete,
} from '@/data/speed-program/progress';
import type { SpeedProgress, SpeedLevel } from '@/data/speed-program/types';

const LEVEL_COLORS: Record<SpeedLevel, string> = {
  beginner: '#3b82f6',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

const CAT_COLORS: Record<string, string> = {
  warm_up: '#a855f7',
  sprint_mechanic: '#8b5cf6',
  acceleration: '#ef4444',
  max_velocity: '#f59e0b',
  cod: '#3b82f6',
  baseball_transfer: '#22c55e',
  plyo: '#f59e0b',
  decel: '#0891b2',
  tempo: '#6b7280',
};

export default function SpeedWorkoutScreen() {
  const { w, d } = useLocalSearchParams<{ w: string; d: string }>();
  const weekNum = Number(w) || 1;
  const dayNum = (Number(d) || 1) as 1 | 2 | 3;
  const [progress, setProgress] = useState<SpeedProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSpeedProgress().then(setProgress);
    }, []),
  );

  if (!progress) return null;

  const level = progress.level;
  const week = getSpeedWeek(level, weekNum);
  const session = week?.sessions[(dayNum - 1) as 0 | 1 | 2];
  const phase = getSpeedPhaseForWeek(weekNum);
  const levelColor = LEVEL_COLORS[level];

  if (!week || !session) return null;

  const done = isSpeedSessionComplete(progress, weekNum, dayNum);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: levelColor }]}>
            WEEK {weekNum} · DAY {dayNum}
          </Text>
          <Text style={styles.headerTitle}>{session.title}</Text>
        </View>
        {done && (
          <View style={[styles.doneBadge, { backgroundColor: levelColor + '15' }]}>
            <Ionicons name="checkmark-circle" size={14} color={levelColor} />
            <Text style={[styles.doneBadgeText, { color: levelColor }]}>Done</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Session Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="speedometer-outline" size={12} color={levelColor} />
            <Text style={[styles.metaText, { color: levelColor }]}>{session.totalSprintYardage} yd total</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>Phase {phase.number}</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>{level}</Text>
          </View>
        </View>

        {/* Warm-Up Block */}
        <View style={[styles.block, { borderColor: '#a855f725' }]}>
          <Text style={[styles.blockLabel, { color: '#a855f7' }]}>{session.warmUp.label.toUpperCase()}</Text>
          {session.warmUp.drills.map((drill, i) => (
            <View key={`wu-${i}`} style={styles.drillRow}>
              <View style={[styles.drillDot, { backgroundColor: '#a855f7' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.drillName}>{drill.name}</Text>
                <Text style={styles.drillCue}>{drill.coachingCue}</Text>
              </View>
              <Text style={styles.drillRx}>{drill.sets}×{drill.reps}</Text>
            </View>
          ))}
        </View>

        {/* Training Blocks */}
        {session.blocks.map((block, bi) => (
          <View key={bi} style={styles.block}>
            <Text style={styles.blockLabel}>{block.label.toUpperCase()}</Text>
            {block.drills.map((drill, di) => {
              const catColor = CAT_COLORS[drill.exerciseId?.split('-')[0] ?? ''] ?? colors.textMuted;
              return (
                <View key={`${bi}-${di}`} style={styles.drillRow}>
                  <View style={[styles.drillDot, { backgroundColor: catColor }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.drillHeader}>
                      <Text style={styles.drillName}>{drill.name}</Text>
                      {drill.distance && (
                        <View style={styles.distBadge}>
                          <Text style={styles.distText}>{drill.distance}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.drillCue}>{drill.coachingCue}</Text>
                    {drill.note && <Text style={styles.drillNote}>{drill.note}</Text>}
                  </View>
                  <View style={styles.rxCol}>
                    <Text style={styles.drillRx}>{drill.sets}×{drill.reps}</Text>
                    {drill.rest !== '—' && <Text style={styles.drillRest}>Rest: {drill.rest}</Text>}
                    {drill.intensity && <Text style={[styles.drillIntensity, { color: levelColor }]}>{drill.intensity}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {/* Complete CTA */}
        {!done ? (
          <TouchableOpacity
            style={[styles.completeCta, { backgroundColor: levelColor }]}
            onPress={() => {
              Alert.alert('Complete Session', `Mark Week ${weekNum} Day ${dayNum} as complete?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Complete',
                  onPress: async () => {
                    const updated = await completeSpeedSession(weekNum, dayNum);
                    setProgress(updated);
                  },
                },
              ]);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.completeCtaText}>Complete Session</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.completedBanner, { backgroundColor: levelColor + '10', borderColor: levelColor + '25' }]}>
            <Ionicons name="checkmark-circle" size={18} color={levelColor} />
            <Text style={[styles.completedText, { color: levelColor }]}>Session completed</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  doneBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  doneBadgeText: { fontSize: 10, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },

  metaRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  metaText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, textTransform: 'capitalize' },

  block: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  blockLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },

  drillRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border,
  },
  drillDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  drillHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  drillName: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  distBadge: {
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  distText: { fontSize: 9, fontWeight: '700', color: colors.textMuted },
  drillCue: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, fontStyle: 'italic', marginTop: 2 },
  drillNote: { fontSize: 10, color: '#f59e0b', fontStyle: 'italic', marginTop: 2 },
  rxCol: { alignItems: 'flex-end', gap: 2, flexShrink: 0 },
  drillRx: { fontSize: 12, fontWeight: '900', color: colors.textPrimary },
  drillRest: { fontSize: 9, fontWeight: '700', color: colors.textMuted },
  drillIntensity: { fontSize: 9, fontWeight: '800' },

  completeCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg,
  },
  completeCtaText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  completedBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: radius.md, borderWidth: 1,
  },
  completedText: { fontSize: 14, fontWeight: '800' },
});

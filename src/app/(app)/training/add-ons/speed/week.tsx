/**
 * Speed Program — Week View
 *
 * Shows 3 training sessions for the selected week.
 */

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { getSpeedWeek } from '@/data/speed-program/program';
import { getSpeedPhaseForWeek } from '@/data/speed-program/product';
import { loadSpeedProgress, isSpeedSessionComplete } from '@/data/speed-program/progress';
import type { SpeedProgress, SpeedLevel } from '@/data/speed-program/types';

const SESSION_ICONS: Record<string, string> = {
  acceleration: 'rocket-outline',
  max_velocity: 'flash-outline',
  cod_baseball: 'baseball-outline',
  tempo: 'timer-outline',
};

const LEVEL_COLORS: Record<SpeedLevel, string> = {
  beginner: '#3b82f6',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

export default function SpeedWeekScreen() {
  const { w } = useLocalSearchParams<{ w: string }>();
  const weekNum = Number(w) || 1;
  const [progress, setProgress] = useState<SpeedProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSpeedProgress().then(setProgress);
    }, []),
  );

  if (!progress) return null;

  const level = progress.level;
  const week = getSpeedWeek(level, weekNum);
  const phase = getSpeedPhaseForWeek(weekNum);
  const levelColor = LEVEL_COLORS[level];

  if (!week) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: levelColor }]}>
            PHASE {phase.number} — {phase.name.toUpperCase()}
          </Text>
          <Text style={styles.headerTitle}>Week {weekNum}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Phase Context */}
        <View style={styles.phaseBar}>
          <Text style={styles.phaseBarText}>{phase.emphasis}</Text>
          {week.isTestWeek && (
            <View style={[styles.testBadge, { backgroundColor: levelColor + '15', borderColor: levelColor + '30' }]}>
              <Ionicons name="stopwatch-outline" size={10} color={levelColor} />
              <Text style={[styles.testBadgeText, { color: levelColor }]}>Test Week</Text>
            </View>
          )}
        </View>

        {/* Sessions */}
        <Text style={styles.sectionLabel}>TRAINING SESSIONS</Text>
        {week.sessions.map((session) => {
          const done = isSpeedSessionComplete(progress, weekNum, session.dayNumber);
          return (
            <TouchableOpacity
              key={session.dayNumber}
              style={[styles.dayCard, done && { borderColor: levelColor + '30' }]}
              onPress={() =>
                router.push(`/(app)/training/add-ons/speed/workout?w=${weekNum}&d=${session.dayNumber}` as any)
              }
              activeOpacity={0.8}
            >
              <View style={[styles.dayIcon, done && { backgroundColor: levelColor + '20' }]}>
                <Ionicons
                  name={(done ? 'checkmark-circle' : SESSION_ICONS[session.sessionType] ?? 'flash-outline') as any}
                  size={22}
                  color={done ? levelColor : colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dayLabel}>DAY {session.dayNumber}</Text>
                <Text style={styles.dayTitle}>{session.title}</Text>
                <Text style={styles.daySub}>{session.subtitle}</Text>
              </View>
              <View style={styles.yardageBadge}>
                <Text style={styles.yardageText}>{session.totalSprintYardage} yd</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        {/* Test Week CTA */}
        {week.isTestWeek && (
          <TouchableOpacity
            style={[styles.testCta, { backgroundColor: levelColor }]}
            onPress={() => router.push('/(app)/training/add-ons/speed/testing' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="stopwatch" size={18} color="#fff" />
            <Text style={styles.testCtaText}>Log Speed Test</Text>
          </TouchableOpacity>
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  phaseBar: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, gap: 8,
  },
  phaseBarText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, fontStyle: 'italic' },
  testBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1,
  },
  testBadgeText: { fontSize: 10, fontWeight: '800' },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 4 },

  dayCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16,
  },
  dayIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  dayLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  dayTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  daySub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  yardageBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  yardageText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary },

  testCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: radius.md, marginTop: 4,
  },
  testCtaText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});

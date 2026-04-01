/**
 * Posture & Direction — Dedicated Landing Page
 *
 * Covers: pulling off, standing up, losing posture, no oppo, spinning off.
 * Key teaching: posture and direction go together. North-south through the ball.
 */

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  getTopicsByCategory, loadActiveBlock, type ActiveBlock,
} from '@/data/troubleshooting-engine';
import {
  POSTURE_PHILOSOPHY, BALL_FLIGHT_FEEDBACK, POSTURE_DRILL_GROUPS,
} from '@/data/troubleshooting-content';

const ACCENT = '#0891b2'; // posture category color

export default function PostureLandingScreen() {
  const topics = getTopicsByCategory('posture');
  const [activeBlock, setActiveBlock] = useState<ActiveBlock | null>(null);

  useFocusEffect(useCallback(() => { loadActiveBlock().then(setActiveBlock); }, []));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: ACCENT }]}>TROUBLESHOOTING</Text>
          <Text style={styles.headerTitle}>Posture & Direction</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section Overview */}
        <View style={[styles.card, { borderColor: ACCENT + '25' }]}>
          <Ionicons name="body-outline" size={28} color={ACCENT} />
          <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary, textAlign: 'center' }]}>
            {POSTURE_PHILOSOPHY.core}
          </Text>
          <Text style={[styles.bodyText, { textAlign: 'center' }]}>
            {POSTURE_PHILOSOPHY.whatThisMeans}
          </Text>
        </View>

        {/* Progression */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>DRILL PROGRESSION</Text>
        {POSTURE_PHILOSOPHY.progression.map((step) => (
          <View key={step.label} style={[styles.pillarRow, { borderColor: step.color + '30' }]}>
            <View style={[styles.pillarDot, { backgroundColor: step.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.pillarLabel, { color: step.color }]}>{step.label}</Text>
              <Text style={styles.pillarDesc}>{step.description}</Text>
            </View>
          </View>
        ))}

        {/* Key Takeaway */}
        <View style={[styles.takeawayCard, { borderColor: ACCENT + '30' }]}>
          <Ionicons name="bulb" size={18} color={ACCENT} />
          <Text style={[styles.takeawayText, { color: ACCENT }]}>
            {POSTURE_PHILOSOPHY.keyTakeaway}
          </Text>
        </View>

        {/* Troubleshoot Topics */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>TROUBLESHOOT YOUR PROBLEM</Text>
        {topics.map((topic) => {
          const isActive = activeBlock?.isActive && activeBlock.topicId === topic.id;
          return (
            <TouchableOpacity
              key={topic.id}
              style={[styles.topicCard, isActive && { borderColor: ACCENT + '60' }]}
              onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/topic?id=${topic.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.topicCardHeader}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                {isActive && <Ionicons name="lock-closed" size={12} color={ACCENT} />}
                {!isActive && <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />}
              </View>
              <Text style={styles.topicDesc}>{topic.shortDescription}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Drill Groups */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>DRILL GROUPS</Text>
        {POSTURE_DRILL_GROUPS.map((group) => (
          <View key={group.name} style={[styles.groupCard, { borderColor: group.color + '25' }]}>
            <View style={[styles.groupBadge, { backgroundColor: group.color + '15' }]}>
              <Text style={[styles.groupBadgeText, { color: group.color }]}>{group.name}</Text>
            </View>
            <Text style={styles.groupDesc}>{group.description}</Text>
          </View>
        ))}

        {/* Ball Flight Feedback */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>WHAT THE BALL TELLS YOU</Text>
        <View style={styles.card}>
          <Text style={styles.bodyText}>
            The ball tells you what happened. Ball flight is feedback. Good hitters learn from result patterns instead of guessing every swing.
          </Text>
          {BALL_FLIGHT_FEEDBACK.map((signal) => {
            const qualityColors: Record<string, string> = { bad: '#ef4444', improving: '#f59e0b', good: '#22c55e', elite: '#8b5cf6' };
            const qColor = qualityColors[signal.quality] ?? colors.textMuted;
            return (
              <View key={signal.result} style={styles.bfRow}>
                <View style={[styles.bfDot, { backgroundColor: qColor }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bfResult, { color: qColor }]}>{signal.result}</Text>
                  <Text style={styles.bfMeaning}>{signal.meaning}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Cues / Feels / Challenges Placeholders */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>CUES / FEELS / CHALLENGES</Text>
        <View style={styles.card}>
          <Text style={[styles.placeholderLabel, { color: ACCENT }]}>CUES</Text>
          <Text style={styles.placeholderItem}>Cue 1</Text>
          <Text style={styles.placeholderItem}>Cue 2</Text>
          <Text style={styles.placeholderItem}>Cue 3</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.placeholderLabel, { color: ACCENT }]}>FEELS</Text>
          <Text style={styles.placeholderItem}>Feel 1</Text>
          <Text style={styles.placeholderItem}>Feel 2</Text>
          <Text style={styles.placeholderItem}>Feel 3</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.placeholderLabel, { color: ACCENT }]}>CHALLENGES</Text>
          <Text style={styles.placeholderItem}>Challenge 1</Text>
          <Text style={styles.placeholderItem}>Challenge 2</Text>
          <Text style={styles.placeholderItem}>Challenge 3</Text>
        </View>

        {/* Reminder */}
        <View style={styles.reminderCard}>
          <Ionicons name="lock-open" size={14} color={ACCENT} />
          <Text style={styles.reminderText}>
            Free to learn. Locked to train. Browse any topic — but you can only actively train one at a time.
          </Text>
        </View>
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
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  bodyText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginTop: 4 },

  pillarRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  pillarDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  pillarLabel: { fontSize: 13, fontWeight: '900' },
  pillarDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  takeawayCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg,
  },
  takeawayText: { flex: 1, fontSize: 14, fontWeight: '900', lineHeight: 20 },

  topicCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 4,
  },
  topicCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topicTitle: { fontSize: 15, fontWeight: '900', color: colors.textPrimary },
  topicDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  groupCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, gap: 6,
  },
  groupBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  groupBadgeText: { fontSize: 11, fontWeight: '900' },
  groupDesc: { fontSize: 12, color: colors.textSecondary },

  bfRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingVertical: 3 },
  bfDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  bfResult: { fontSize: 12, fontWeight: '800' },
  bfMeaning: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  placeholderLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  placeholderItem: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', paddingLeft: 8 },

  reminderCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 12, backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.md, marginTop: 4,
  },
  reminderText: { flex: 1, fontSize: 11, color: colors.textSecondary, lineHeight: 16, fontStyle: 'italic' },
});

/**
 * Contact Point & Barrel Control — Dedicated Landing Page
 *
 * Section overview, 4 troubleshooting topic cards, and philosophy block.
 * Each card routes to the existing topic detail page.
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

const ACCENT = '#3b82f6'; // contact category color

const SECTION_DESC = `Great hitters are not just mechanically sound \u2014 they control the baseball.
They control where they hit it, how they hit it, and when they hit it.
This section focuses on barrel control, contact point control, direction, adjustability, and launch quickness.`;

const PROGRESSION_STEPS = [
  { label: 'Tee', desc: 'Learn movement', color: '#3b82f6' },
  { label: 'Flips', desc: 'Practice movement', color: '#22c55e' },
  { label: 'Machine', desc: 'Transfer to game', color: '#ef4444' },
  { label: 'Competition', desc: 'Perform under pressure', color: '#8b5cf6' },
];

const PHILOSOPHY = [
  'Be on time',
  'Control the barrel',
  'Control the contact point',
  'Control direction',
  'Hit the ball hard',
];

export default function ContactLandingScreen() {
  const topics = getTopicsByCategory('contact');
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
          <Text style={styles.headerTitle}>Contact Point & Barrel Control</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section Description */}
        <View style={[styles.card, { borderColor: ACCENT + '25' }]}>
          <Ionicons name="baseball-outline" size={28} color={ACCENT} />
          <Text style={styles.descText}>{SECTION_DESC}</Text>
        </View>

        {/* Progression Steps */}
        <View style={styles.stepsRow}>
          {PROGRESSION_STEPS.map((step, i) => (
            <View key={step.label} style={styles.stepItem}>
              <View style={[styles.stepDot, { backgroundColor: step.color }]} />
              <Text style={[styles.stepLabel, { color: step.color }]}>{step.label}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
              {i < PROGRESSION_STEPS.length - 1 && <View style={styles.stepArrow}><Ionicons name="arrow-forward" size={10} color={colors.textMuted} /></View>}
            </View>
          ))}
        </View>

        {/* Topic Cards */}
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

        {/* Philosophy Block */}
        <View style={[styles.philosophyCard, { borderColor: ACCENT + '20' }]}>
          <Ionicons name="book-outline" size={18} color={ACCENT} />
          <Text style={styles.philosophyTitle}>Hitting is the ability to:</Text>
          {PHILOSOPHY.map((item) => (
            <View key={item} style={styles.philosophyRow}>
              <View style={[styles.philosophyDot, { backgroundColor: ACCENT }]} />
              <Text style={styles.philosophyText}>{item}</Text>
            </View>
          ))}
          <Text style={styles.philosophyBody}>
            Most hitters don't struggle because they don't know mechanics.{'\n'}
            Most hitters struggle because they can't control the barrel and the contact point.
          </Text>
          <Text style={[styles.philosophyBody, { fontWeight: '700', color: colors.textPrimary }]}>
            This section teaches hitters how to control the baseball.
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
    alignItems: 'center', gap: 10, padding: 18,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg,
  },
  descText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, textAlign: 'center' },

  stepsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  stepItem: { flex: 1, alignItems: 'center', gap: 2 },
  stepDot: { width: 8, height: 8, borderRadius: 4 },
  stepLabel: { fontSize: 11, fontWeight: '900' },
  stepDesc: { fontSize: 9, color: colors.textMuted, textAlign: 'center' },
  stepArrow: { position: 'absolute', right: -8, top: 0 },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginTop: 4 },

  topicCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 4,
  },
  topicCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topicTitle: { fontSize: 15, fontWeight: '900', color: colors.textPrimary },
  topicDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  philosophyCard: {
    backgroundColor: ACCENT + '08', borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 8, marginTop: 4,
  },
  philosophyTitle: { fontSize: 14, fontWeight: '900', color: colors.textPrimary },
  philosophyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  philosophyDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  philosophyText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  philosophyBody: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});

/**
 * Category Education Page — What this category means, why you struggle, signs.
 */

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  getCategoryById, getTopicsByCategory, loadActiveBlock,
  type ActiveBlock,
} from '@/data/troubleshooting-engine';
import { getCategoryEducation } from '@/data/troubleshooting-content';

const ACCENT = '#E10600';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = id ? getCategoryById(id) : undefined;
  const education = id ? getCategoryEducation(id) : undefined;
  const topics = id ? getTopicsByCategory(id) : [];

  const [activeBlock, setActiveBlock] = useState<ActiveBlock | null>(null);
  useFocusEffect(useCallback(() => { loadActiveBlock().then(setActiveBlock); }, []));

  if (!category) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: category.color }]}>TROUBLESHOOTING</Text>
          <Text style={styles.headerTitle}>{category.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* What This Category Includes */}
        {education && (
          <>
            <View style={[styles.card, { borderColor: category.color + '25' }]}>
              <Text style={[styles.sectionLabel, { color: category.color }]}>WHAT THIS INCLUDES</Text>
              <Text style={styles.bodyText}>{education.whatItIncludes}</Text>
            </View>

            <View style={styles.card}>
              <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>WHY YOU MAY STRUGGLE WITH THIS</Text>
              {education.whyYouStruggle.map((reason, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.bulletText}>{reason}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={[styles.sectionLabel, { color: '#ef4444' }]}>SIGNS THIS MIGHT BE YOUR ISSUE</Text>
              {education.signsThisIsYou.map((sign, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Ionicons name="alert-circle" size={12} color="#ef4444" />
                  <Text style={styles.bulletText}>{sign}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Topics */}
        <Text style={[styles.sectionLabel, { color: category.color, marginTop: 8 }]}>
          TOPICS IN THIS CATEGORY
        </Text>
        {topics.map((topic) => {
          const isActive = activeBlock?.isActive && activeBlock.topicId === topic.id;
          const isLocked = activeBlock?.isActive && activeBlock.topicId !== topic.id;
          return (
            <TouchableOpacity
              key={topic.id}
              style={[styles.topicRow, isActive && { borderColor: category.color + '40' }]}
              onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/topic?id=${topic.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDesc}>{topic.shortDescription}</Text>
              </View>
              {isActive && <Ionicons name="lock-closed" size={12} color={category.color} />}
              {isLocked && <Ionicons name="lock-closed-outline" size={12} color={colors.textMuted} />}
              {!isActive && !isLocked && <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />}
            </TouchableOpacity>
          );
        })}

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
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  bodyText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  topicRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  topicTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  topicDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  reminderCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 12, backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.md,
  },
  reminderText: { flex: 1, fontSize: 11, color: colors.textSecondary, lineHeight: 16, fontStyle: 'italic' },
});

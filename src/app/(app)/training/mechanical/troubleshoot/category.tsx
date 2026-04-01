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
import {
  getCategoryEducation,
  TIMING_PHILOSOPHY, TIMING_DRILL_GROUPS,
  CONTACT_PHILOSOPHY, CONTACT_DRILL_GROUPS,
  POSTURE_PHILOSOPHY, POSTURE_DRILL_GROUPS, BALL_FLIGHT_FEEDBACK,
  ADJUSTABILITY_PHILOSOPHY, ADJUSTABILITY_DRILL_GROUPS,
  APPROACH_PHILOSOPHY, APPROACH_DRILL_GROUPS,
  POWER_PHILOSOPHY, POWER_DRILL_GROUPS, POWER_DIAGNOSTIC_ROUTES,
} from '@/data/troubleshooting-content';

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

        {/* Timing Philosophy (timing category only) */}
        {id === 'timing' && (
          <>
            <View style={[styles.card, { borderColor: '#e11d48' + '25' }]}>
              <Text style={[styles.sectionLabel, { color: '#e11d48' }]}>OTC TIMING PHILOSOPHY</Text>
              <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary }]}>
                {TIMING_PHILOSOPHY.core}
              </Text>
              <Text style={[styles.bodyText, { marginTop: 4 }]}>
                {TIMING_PHILOSOPHY.mechanicalVsOutcome}
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { color: '#e11d48' }]}>THE 4 PILLARS OF TIMING</Text>
            {TIMING_PHILOSOPHY.pillars.map((pillar) => (
              <View key={pillar.label} style={[styles.pillarRow, { borderColor: pillar.color + '30' }]}>
                <View style={[styles.pillarDot, { backgroundColor: pillar.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarLabel, { color: pillar.color }]}>{pillar.label}</Text>
                  <Text style={styles.pillarDesc}>{pillar.description}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { color: '#e11d48' }]}>TIMING DRILL GROUPS</Text>
            {TIMING_DRILL_GROUPS.map((group) => (
              <View key={group.name} style={[styles.groupCard, { borderColor: group.color + '25' }]}>
                <View style={[styles.groupBadge, { backgroundColor: group.color + '15' }]}>
                  <Text style={[styles.groupBadgeText, { color: group.color }]}>{group.name}</Text>
                </View>
                <Text style={styles.groupDesc}>{group.description}</Text>
              </View>
            ))}
          </>
        )}

        {/* Contact Philosophy (contact category only) */}
        {id === 'contact' && (
          <>
            <View style={[styles.card, { borderColor: '#3b82f6' + '25' }]}>
              <Text style={[styles.sectionLabel, { color: '#3b82f6' }]}>OTC CONTACT PHILOSOPHY</Text>
              <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary }]}>
                {CONTACT_PHILOSOPHY.core}
              </Text>
              <Text style={[styles.bodyText, { marginTop: 4 }]}>
                {CONTACT_PHILOSOPHY.whatThisSectionTrains}
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { color: '#3b82f6' }]}>DRILL PROGRESSION</Text>
            {CONTACT_PHILOSOPHY.progression.map((step) => (
              <View key={step.label} style={[styles.pillarRow, { borderColor: step.color + '30' }]}>
                <View style={[styles.pillarDot, { backgroundColor: step.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarLabel, { color: step.color }]}>{step.label}</Text>
                  <Text style={styles.pillarDesc}>{step.description}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { color: '#3b82f6' }]}>CONTACT DRILL GROUPS</Text>
            {CONTACT_DRILL_GROUPS.map((group) => (
              <View key={group.name} style={[styles.groupCard, { borderColor: group.color + '25' }]}>
                <View style={[styles.groupBadge, { backgroundColor: group.color + '15' }]}>
                  <Text style={[styles.groupBadgeText, { color: group.color }]}>{group.name}</Text>
                </View>
                <Text style={styles.groupDesc}>{group.description}</Text>
              </View>
            ))}

            {/* Power / Output Section within Contact */}
            <View style={[styles.card, { borderColor: '#22c55e' + '25' }]}>
              <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>POWER & OUTPUT</Text>
              <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary }]}>
                {POWER_PHILOSOPHY.equation}
              </Text>
              <Text style={[styles.bodyText, { marginTop: 4 }]}>
                {POWER_PHILOSOPHY.keyTruth}
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>WHAT CAUSES LOW OUTPUT?</Text>
            {POWER_DIAGNOSTIC_ROUTES.map((route) => (
              <View key={route.category} style={[styles.pillarRow, { borderColor: route.color + '30' }]}>
                <View style={[styles.pillarDot, { backgroundColor: route.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarLabel, { color: route.color }]}>{route.category}</Text>
                  <Text style={styles.pillarDesc}>{route.description} → {route.route}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>POWER TRAINING BUCKETS</Text>
            {POWER_DRILL_GROUPS.map((group) => (
              <View key={group.name} style={[styles.groupCard, { borderColor: group.color + '25' }]}>
                <View style={[styles.groupBadge, { backgroundColor: group.color + '15' }]}>
                  <Text style={[styles.groupBadgeText, { color: group.color }]}>{group.name}</Text>
                </View>
                <Text style={styles.groupDesc}>{group.description}</Text>
              </View>
            ))}
          </>
        )}

        {/* Posture Philosophy (posture category only) */}
        {id === 'posture' && (
          <>
            <View style={[styles.card, { borderColor: '#0891b2' + '25' }]}>
              <Text style={[styles.sectionLabel, { color: '#0891b2' }]}>OTC POSTURE & DIRECTION PHILOSOPHY</Text>
              <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary }]}>
                {POSTURE_PHILOSOPHY.core}
              </Text>
              <Text style={[styles.bodyText, { marginTop: 4 }]}>
                {POSTURE_PHILOSOPHY.whatThisMeans}
              </Text>
            </View>

            {/* Key Takeaway */}
            <View style={[styles.pillarRow, { borderColor: '#0891b2' + '40', backgroundColor: '#0891b2' + '08' }]}>
              <Ionicons name="bulb" size={16} color="#0891b2" />
              <Text style={{ flex: 1, fontSize: 13, fontWeight: '900', color: '#0891b2', lineHeight: 19 }}>
                {POSTURE_PHILOSOPHY.keyTakeaway}
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { color: '#0891b2' }]}>DRILL PROGRESSION</Text>
            {POSTURE_PHILOSOPHY.progression.map((step) => (
              <View key={step.label} style={[styles.pillarRow, { borderColor: step.color + '30' }]}>
                <View style={[styles.pillarDot, { backgroundColor: step.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarLabel, { color: step.color }]}>{step.label}</Text>
                  <Text style={styles.pillarDesc}>{step.description}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { color: '#0891b2' }]}>DRILL GROUPS</Text>
            {POSTURE_DRILL_GROUPS.map((group) => (
              <View key={group.name} style={[styles.groupCard, { borderColor: group.color + '25' }]}>
                <View style={[styles.groupBadge, { backgroundColor: group.color + '15' }]}>
                  <Text style={[styles.groupBadgeText, { color: group.color }]}>{group.name}</Text>
                </View>
                <Text style={styles.groupDesc}>{group.description}</Text>
              </View>
            ))}

            {/* Ball Flight Feedback */}
            <Text style={[styles.sectionLabel, { color: '#0891b2' }]}>WHAT THE BALL TELLS YOU</Text>
            <View style={styles.card}>
              <Text style={styles.bodyText}>Ball flight is feedback. Good hitters learn from result patterns instead of guessing.</Text>
              {BALL_FLIGHT_FEEDBACK.map((signal) => {
                const qColors: Record<string, string> = { bad: '#ef4444', improving: '#f59e0b', good: '#22c55e', elite: '#8b5cf6' };
                const qc = qColors[signal.quality] ?? colors.textMuted;
                return (
                  <View key={signal.result} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: qc }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.bulletText, { fontWeight: '800', color: qc }]}>{signal.result}</Text>
                      <Text style={[styles.bulletText, { fontSize: 11, color: colors.textMuted }]}>{signal.meaning}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Adjustability Philosophy (adjustability category only) */}
        {id === 'adjustability' && (
          <>
            <View style={[styles.card, { borderColor: '#f59e0b' + '25' }]}>
              <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>OTC ADJUSTABILITY PHILOSOPHY</Text>
              <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary }]}>
                {ADJUSTABILITY_PHILOSOPHY.core}
              </Text>
            </View>

            {/* Key Truth */}
            <View style={[styles.pillarRow, { borderColor: '#f59e0b' + '40', backgroundColor: '#f59e0b' + '08' }]}>
              <Ionicons name="bulb" size={16} color="#f59e0b" />
              <Text style={{ flex: 1, fontSize: 13, fontWeight: '900', color: '#f59e0b', lineHeight: 19 }}>
                {ADJUSTABILITY_PHILOSOPHY.keyTruth}
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>TRAINING LOGIC</Text>
            {ADJUSTABILITY_PHILOSOPHY.trainingLogic.map((step) => (
              <View key={step.label} style={[styles.pillarRow, { borderColor: step.color + '30' }]}>
                <View style={[styles.pillarDot, { backgroundColor: step.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarLabel, { color: step.color }]}>{step.label}</Text>
                  <Text style={styles.pillarDesc}>{step.description}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>DRILL GROUPS</Text>
            {ADJUSTABILITY_DRILL_GROUPS.map((group) => (
              <View key={group.name} style={[styles.groupCard, { borderColor: group.color + '25' }]}>
                <View style={[styles.groupBadge, { backgroundColor: group.color + '15' }]}>
                  <Text style={[styles.groupBadgeText, { color: group.color }]}>{group.name}</Text>
                </View>
                <Text style={styles.groupDesc}>{group.description}</Text>
              </View>
            ))}
          </>
        )}

        {/* Approach Philosophy (approach category only) */}
        {id === 'approach' && (
          <>
            <View style={[styles.card, { borderColor: '#a855f7' + '25' }]}>
              <Text style={[styles.sectionLabel, { color: '#a855f7' }]}>OTC APPROACH PHILOSOPHY</Text>
              <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary }]}>
                {APPROACH_PHILOSOPHY.core}
              </Text>
              <Text style={[styles.bodyText, { marginTop: 4 }]}>
                {APPROACH_PHILOSOPHY.bpVsGames}
              </Text>
            </View>

            {/* Key Principles */}
            <Text style={[styles.sectionLabel, { color: '#a855f7' }]}>KEY PRINCIPLES</Text>
            {APPROACH_PHILOSOPHY.principles.slice(0, 5).map((p) => (
              <View key={p} style={[styles.pillarRow, { borderColor: '#a855f7' + '25' }]}>
                <View style={[styles.pillarDot, { backgroundColor: '#a855f7' }]} />
                <Text style={[styles.pillarLabel, { color: '#a855f7', fontSize: 12 }]}>{p}</Text>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { color: '#a855f7' }]}>DRILL GROUPS</Text>
            {APPROACH_DRILL_GROUPS.map((group) => (
              <View key={group.name} style={[styles.groupCard, { borderColor: group.color + '25' }]}>
                <View style={[styles.groupBadge, { backgroundColor: group.color + '15' }]}>
                  <Text style={[styles.groupBadgeText, { color: group.color }]}>{group.name}</Text>
                </View>
                <Text style={styles.groupDesc}>{group.description}</Text>
              </View>
            ))}
          </>
        )}

        {/* Power Philosophy (power category only) */}
        {id === 'power' && (
          <>
            <View style={[styles.card, { borderColor: '#22c55e' + '25' }]}>
              <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>OTC POWER PHILOSOPHY</Text>
              <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary }]}>
                {POWER_PHILOSOPHY.equation}
              </Text>
              <Text style={[styles.bodyText, { marginTop: 4 }]}>
                {POWER_PHILOSOPHY.keyTruth}
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>WHAT CAUSES LOW OUTPUT?</Text>
            {POWER_DIAGNOSTIC_ROUTES.map((route) => (
              <View key={route.category} style={[styles.pillarRow, { borderColor: route.color + '30' }]}>
                <View style={[styles.pillarDot, { backgroundColor: route.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarLabel, { color: route.color }]}>{route.category}</Text>
                  <Text style={styles.pillarDesc}>{route.description} → {route.route}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>TRAINING BUCKETS</Text>
            {POWER_DRILL_GROUPS.map((group) => (
              <View key={group.name} style={[styles.groupCard, { borderColor: group.color + '25' }]}>
                <View style={[styles.groupBadge, { backgroundColor: group.color + '15' }]}>
                  <Text style={[styles.groupBadgeText, { color: group.color }]}>{group.name}</Text>
                </View>
                <Text style={styles.groupDesc}>{group.description}</Text>
              </View>
            ))}
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

  pillarRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  pillarDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  pillarLabel: { fontSize: 13, fontWeight: '900' },
  pillarDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  groupCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, gap: 6,
  },
  groupBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  groupBadgeText: { fontSize: 11, fontWeight: '900' },
  groupDesc: { fontSize: 12, color: colors.textSecondary },

  reminderCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 12, backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.md,
  },
  reminderText: { flex: 1, fontSize: 11, color: colors.textSecondary, lineHeight: 16, fontStyle: 'italic' },
});

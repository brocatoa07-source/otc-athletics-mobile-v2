/**
 * Troubleshooting Vault Landing — Categories + Active Block Banner
 *
 * FREE TO LEARN. LOCKED TO TRAIN.
 */

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  TROUBLESHOOTING_CATEGORIES,
  getTopicsByCategory,
  loadActiveBlock,
  getTopicById,
  getCurrentDayOfBlock,
  getDaysRemaining,
  loadHistory,
  type ActiveBlock,
  type BlockHistoryEntry,
} from '@/data/troubleshooting-engine';

const ACCENT = '#E10600';

export default function TroubleshootLanding() {
  const [activeBlock, setActiveBlock] = useState<ActiveBlock | null>(null);
  const [history, setHistory] = useState<BlockHistoryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadActiveBlock().then(setActiveBlock);
      loadHistory().then(setHistory);
    }, []),
  );

  const activeTopic = activeBlock?.isActive ? getTopicById(activeBlock.topicId) : null;
  const currentDay = activeBlock?.isActive ? getCurrentDayOfBlock(activeBlock.startDate) : 0;
  const daysLeft = activeBlock?.isActive ? getDaysRemaining(activeBlock.endDate) : 0;
  const completedBlocks = history.filter((h) => h.blockStatus === 'completed').length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>Troubleshooting</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => router.push('/(app)/training/mechanical/troubleshoot/history' as any)}
          >
            <Ionicons name="time-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Concept */}
        <View style={styles.conceptCard}>
          <Ionicons name="lock-open" size={18} color={ACCENT} />
          <View style={{ flex: 1 }}>
            <Text style={styles.conceptTitle}>Free to Learn. Locked to Train.</Text>
            <Text style={styles.conceptDesc}>
              Browse everything. When you find your problem, lock in for 7 days and work it.
            </Text>
          </View>
        </View>

        {/* Active Block Banner */}
        {activeTopic && activeBlock?.isActive && (
          <TouchableOpacity
            style={styles.activeBanner}
            onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/topic?id=${activeBlock.topicId}` as any)}
            activeOpacity={0.85}
          >
            <View style={styles.activeBannerTop}>
              <Ionicons name="lock-closed" size={16} color={ACCENT} />
              <Text style={styles.activeBannerLabel}>ACTIVE FOCUS</Text>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>Day {Math.min(currentDay, 7)}/7</Text>
              </View>
            </View>
            <Text style={styles.activeBannerTitle}>{activeTopic.title}</Text>
            <View style={styles.activeBannerMeta}>
              <Text style={styles.activeBannerMetaText}>
                {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining` : 'Block complete!'}
              </Text>
              <Text style={styles.activeBannerMetaText}>
                {activeBlock.completedDaysCount} day{activeBlock.completedDaysCount !== 1 ? 's' : ''} checked in
              </Text>
            </View>
            {/* Progress dots */}
            <View style={styles.progressDots}>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <View
                  key={d}
                  style={[
                    styles.progressDot,
                    d <= activeBlock.completedDaysCount
                      ? styles.progressDotDone
                      : d === currentDay
                        ? styles.progressDotCurrent
                        : styles.progressDotEmpty,
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>
        )}

        {/* Block Complete Banner */}
        {activeBlock && !activeBlock.isActive && (
          <View style={styles.completeBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            <View style={{ flex: 1 }}>
              <Text style={styles.completeBannerTitle}>Block Complete</Text>
              <Text style={styles.completeBannerSub}>Choose a new topic or repeat the last one.</Text>
            </View>
          </View>
        )}

        {/* Stats row */}
        {history.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statNum}>{history.length}</Text>
              <Text style={styles.statLabel}>Blocks</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statNum}>{completedBlocks}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        )}

        {/* Categories + Topics */}
        {TROUBLESHOOTING_CATEGORIES.map((cat) => {
          const topics = getTopicsByCategory(cat.id);
          return (
            <View key={cat.id} style={styles.categorySection}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/category?id=${cat.id}` as any)}
                activeOpacity={0.8}
              >
                <Ionicons name={cat.icon as any} size={16} color={cat.color} />
                <Text style={[styles.categoryTitle, { color: cat.color }]}>{cat.title}</Text>
                <Text style={styles.categoryCount}>{topics.length}</Text>
                <Ionicons name="chevron-forward" size={12} color={cat.color} />
              </TouchableOpacity>
              <Text style={styles.categoryDesc}>{cat.description}</Text>

              {topics.map((topic) => {
                const isLocked = activeBlock?.isActive && activeBlock.topicId !== topic.id;
                const isActive = activeBlock?.isActive && activeBlock.topicId === topic.id;

                return (
                  <TouchableOpacity
                    key={topic.id}
                    style={[styles.topicRow, isActive && { borderColor: ACCENT + '40' }]}
                    onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/topic?id=${topic.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <Text style={styles.topicDesc}>{topic.shortDescription}</Text>
                    </View>
                    {isActive && (
                      <View style={styles.activeDot}>
                        <Ionicons name="lock-closed" size={10} color={ACCENT} />
                      </View>
                    )}
                    {isLocked && (
                      <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
                    )}
                    {!isActive && !isLocked && (
                      <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  historyBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  conceptCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.md,
  },
  conceptTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  conceptDesc: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginTop: 2 },

  // Active banner
  activeBanner: {
    backgroundColor: colors.surface, borderWidth: 2, borderColor: ACCENT + '40',
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  activeBannerTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activeBannerLabel: { flex: 1, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: ACCENT },
  dayBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: ACCENT + '15' },
  dayBadgeText: { fontSize: 10, fontWeight: '800', color: ACCENT },
  activeBannerTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  activeBannerMeta: { flexDirection: 'row', gap: 12 },
  activeBannerMetaText: { fontSize: 11, color: colors.textMuted },
  progressDots: { flexDirection: 'row', gap: 6, marginTop: 4 },
  progressDot: { width: 20, height: 6, borderRadius: 3 },
  progressDotDone: { backgroundColor: ACCENT },
  progressDotCurrent: { backgroundColor: ACCENT + '50' },
  progressDotEmpty: { backgroundColor: colors.border },

  // Complete banner
  completeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, backgroundColor: '#22c55e08', borderWidth: 1, borderColor: '#22c55e25',
    borderRadius: radius.md,
  },
  completeBannerTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  completeBannerSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: {
    flex: 1, alignItems: 'center', gap: 2, paddingVertical: 8,
    backgroundColor: colors.surface, borderRadius: radius.sm,
  },
  statNum: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  statLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },

  // Categories
  categorySection: { gap: 6, marginTop: 4 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryTitle: { flex: 1, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  categoryCount: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  categoryDesc: { fontSize: 11, color: colors.textMuted, lineHeight: 15, marginBottom: 2 },

  // Topics
  topicRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  topicTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  topicDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  activeDot: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: ACCENT + '15',
    alignItems: 'center', justifyContent: 'center',
  },
});

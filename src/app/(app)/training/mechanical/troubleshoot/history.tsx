/**
 * Troubleshooting History — Past blocks + smart suggestions
 */

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  loadHistory, loadTopicStats, getSmartSuggestions,
  getTopicById, getCategoryById,
  type BlockHistoryEntry, type TopicStats, type SmartSuggestion,
} from '@/data/troubleshooting-engine';

const ACCENT = '#E10600';

export default function TroubleshootHistoryScreen() {
  const [history, setHistory] = useState<BlockHistoryEntry[]>([]);
  const [stats, setStats] = useState<TopicStats[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory().then(setHistory);
      loadTopicStats().then(setStats);
      getSmartSuggestions().then(setSuggestions);
    }, []),
  );

  const completedCount = history.filter((h) => h.blockStatus === 'completed').length;
  const abandonedCount = history.filter((h) => h.blockStatus === 'abandoned').length;
  const expiredCount = history.filter((h) => h.blockStatus === 'expired').length;
  const totalCount = history.length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>TROUBLESHOOTING</Text>
          <Text style={styles.headerTitle}>History</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{totalCount}</Text>
              <Text style={styles.summaryLabel}>Blocks Started</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: '#22c55e' }]}>{completedCount}</Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{abandonedCount}</Text>
              <Text style={styles.summaryLabel}>Abandoned</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{expiredCount}</Text>
              <Text style={styles.summaryLabel}>Expired</Text>
            </View>
          </View>
        </View>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsCard}>
            <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>INSIGHTS</Text>
            {suggestions.map((s, i) => (
              <View key={i} style={styles.suggestionRow}>
                <Ionicons
                  name={s.type === 'repeat_warning' ? 'repeat' : s.type === 'quit_warning' ? 'alert-circle' : 'bookmark'}
                  size={14}
                  color="#f59e0b"
                />
                <Text style={styles.suggestionText}>{s.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Topic Stats */}
        {stats.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>TOPIC BREAKDOWN</Text>
            {stats.map((s) => {
              const topic = getTopicById(s.topicId);
              const cat = topic ? getCategoryById(topic.categoryId) : null;
              if (!topic) return null;
              return (
                <View key={s.topicId} style={styles.statRow}>
                  <View style={[styles.statDot, { backgroundColor: cat?.color ?? ACCENT }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statTitle}>{topic.title}</Text>
                    <Text style={styles.statMeta}>
                      Selected {s.timesSelected}x · Completed {s.timesCompleted}x
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* Block History */}
        <Text style={styles.sectionLabel}>BLOCK HISTORY</Text>
        {history.length === 0 && (
          <Text style={styles.emptyText}>No blocks started yet.</Text>
        )}
        {history.map((h) => {
          const topic = getTopicById(h.topicId);
          const cat = topic ? getCategoryById(topic.categoryId) : null;
          return (
            <View key={h.id} style={[styles.historyCard, h.blockStatus === 'completed' && { borderColor: '#22c55e30' }]}>
              <View style={styles.historyTop}>
                <View style={[styles.historyDot, { backgroundColor: h.blockStatus === 'completed' ? '#22c55e' : h.blockStatus === 'abandoned' ? '#ef4444' : colors.textMuted }]} />
                <Text style={styles.historyTitle}>{topic?.title ?? 'Unknown'}</Text>
                <Text style={[styles.historyStatus, { color: h.blockStatus === 'completed' ? '#22c55e' : h.blockStatus === 'abandoned' ? '#ef4444' : colors.textMuted }]}>
                  {h.blockStatus === 'completed' ? 'Completed' : h.blockStatus === 'abandoned' ? 'Abandoned' : 'Expired'}
                </Text>
              </View>
              <View style={styles.historyMeta}>
                <Text style={styles.historyMetaText}>{h.startDate} → {h.endDate}</Text>
                <Text style={styles.historyMetaText}>{h.completedDaysCount}/7 days</Text>
                {cat && <Text style={[styles.historyMetaText, { color: cat.color }]}>{cat.title}</Text>}
              </View>
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
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 4 },

  summaryCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryNum: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  summaryLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },

  suggestionsCard: {
    backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  suggestionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  suggestionText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },

  statRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  statDot: { width: 8, height: 8, borderRadius: 4 },
  statTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  statMeta: { fontSize: 10, color: colors.textMuted, marginTop: 1 },

  historyCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, gap: 4,
  },
  historyTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  historyDot: { width: 8, height: 8, borderRadius: 4 },
  historyTitle: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  historyStatus: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  historyMeta: { flexDirection: 'row', gap: 10, paddingLeft: 16 },
  historyMetaText: { fontSize: 10, color: colors.textMuted },

  emptyText: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic' },
});

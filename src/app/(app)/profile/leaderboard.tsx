/**
 * Leaderboard Screen — Rankings by streak, XP, and consistency.
 *
 * Uses Supabase `leaderboards` table when available,
 * falls back to showing the current athlete's own stats.
 */

import { useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { colors, radius } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { useEngagement } from '@/hooks/useEngagement';

type SortKey = 'streak' | 'xp' | 'consistency_score';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  streak: number;
  xp: number;
  consistency_score: number;
}

const TABS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'streak', label: 'Streak', icon: 'flame' },
  { key: 'xp', label: 'XP', icon: 'star' },
  { key: 'consistency_score', label: 'Consistency', icon: 'repeat' },
];

export default function LeaderboardScreen() {
  const user = useAuthStore((s) => s.user);
  const engagement = useEngagement();
  const [sortKey, setSortKey] = useState<SortKey>('streak');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadLeaderboard();
    }, []),
  );

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .select('user_id, full_name, streak, xp, consistency_score')
        .order(sortKey, { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        setEntries(data as LeaderboardEntry[]);
      } else {
        // Fallback: show current user only
        const displayName = (user?.user_metadata?.full_name as string | undefined) ?? 'You';
        setEntries([{
          user_id: user?.id ?? '',
          full_name: displayName,
          streak: engagement.streak.currentStreak,
          xp: engagement.xp.totalXP,
          consistency_score: engagement.skills.consistency,
        }]);
      }
    } catch {
      // Graceful fallback
      const displayName = (user?.user_metadata?.full_name as string | undefined) ?? 'You';
      setEntries([{
        user_id: user?.id ?? '',
        full_name: displayName,
        streak: engagement.streak.currentStreak,
        xp: engagement.xp.totalXP,
        consistency_score: engagement.skills.consistency,
      }]);
    }
    setLoading(false);
  }

  const sorted = [...entries].sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      {/* Sort Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => {
          const active = sortKey === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => {
                setSortKey(tab.key);
                loadLeaderboard();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name={tab.icon as any} size={14} color={active ? '#f59e0b' : colors.textMuted} />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sorted.map((entry, idx) => {
          const isMe = entry.user_id === user?.id;
          const rank = idx + 1;
          const val = entry[sortKey];
          const medal = rank === 1 ? '#f59e0b' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : null;

          return (
            <View key={entry.user_id} style={[styles.row, isMe && styles.rowMe]}>
              <View style={[styles.rankCircle, medal ? { backgroundColor: medal + '20', borderColor: medal + '50' } : {}]}>
                <Text style={[styles.rankText, medal ? { color: medal } : {}]}>
                  {rank}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, isMe && { color: '#f59e0b' }]}>
                  {entry.full_name}{isMe ? ' (You)' : ''}
                </Text>
              </View>
              <Text style={styles.value}>
                {val}{sortKey === 'streak' ? 'd' : sortKey === 'consistency_score' ? '%' : ''}
              </Text>
            </View>
          );
        })}

        {sorted.length === 0 && !loading && (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={32} color={colors.textMuted} />
            <Text style={styles.emptyText}>No leaderboard data yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: '#f59e0b15',
    borderColor: '#f59e0b40',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: '#f59e0b',
  },

  content: { padding: 16, gap: 6, paddingBottom: 40 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
  },
  rowMe: {
    borderColor: '#f59e0b40',
    backgroundColor: '#f59e0b08',
  },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.textSecondary,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  value: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },

  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

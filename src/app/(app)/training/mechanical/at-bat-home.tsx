import { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  type GameLog,
  loadGames,
  loadGameAtBats,
  computeOTCApproachScore,
  getRecentStats,
  isHit,
  RESULT_LABELS,
} from '@/data/at-bat-accountability';

const ACCENT = '#E10600';

export default function AtBatHome() {
  const [games, setGames] = useState<GameLog[]>([]);
  const [gameStats, setGameStats] = useState<Record<string, { abs: number; hits: number; score: number }>>({});
  const [recentStats, setRecentStats] = useState<{
    gamesLogged: number;
    avgApproachScore: number | null;
    chaseRate: number | null;
    onTimeRate: number | null;
    countWinRate: number | null;
  }>({ gamesLogged: 0, avgApproachScore: null, chaseRate: null, onTimeRate: null, countWinRate: null });

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [loadedGames, stats] = await Promise.all([loadGames(), getRecentStats()]);
        if (cancelled) return;
        setGames(loadedGames);
        setRecentStats(stats);

        // Load per-game stats for list display
        const statsMap: typeof gameStats = {};
        for (const game of loadedGames.slice(0, 20)) {
          const abs = await loadGameAtBats(game.id);
          statsMap[game.id] = {
            abs: abs.length,
            hits: abs.filter((ab) => isHit(ab.result)).length,
            score: computeOTCApproachScore(abs),
          };
        }
        if (!cancelled) setGameStats(statsMap);
      })();
      return () => { cancelled = true; };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING</Text>
          <Text style={styles.headerTitle}>At-Bat Accountability</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={styles.introCard}>
          <Ionicons name="analytics-outline" size={22} color={ACCENT} />
          <Text style={styles.introText}>
            Track your at-bats after games so you can measure approach, not just outcome.
          </Text>
        </View>

        {/* Log Game CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/(app)/training/mechanical/log-game' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.ctaBtnText}>Log Game</Text>
        </TouchableOpacity>

        {/* Quick Stats */}
        {recentStats.gamesLogged > 0 && (
          <View style={styles.statsRow}>
            <StatBox label="Games" value={String(recentStats.gamesLogged)} />
            <StatBox
              label="Avg Score"
              value={recentStats.avgApproachScore != null ? String(recentStats.avgApproachScore) : '—'}
              color={scoreColor(recentStats.avgApproachScore)}
            />
            <StatBox
              label="Chase %"
              value={recentStats.chaseRate != null ? `${recentStats.chaseRate}%` : '—'}
              color={recentStats.chaseRate != null && recentStats.chaseRate > 30 ? colors.error : undefined}
            />
            <StatBox
              label="On-Time %"
              value={recentStats.onTimeRate != null ? `${recentStats.onTimeRate}%` : '—'}
              color={recentStats.onTimeRate != null && recentStats.onTimeRate >= 60 ? colors.success : undefined}
            />
            <StatBox
              label="Count Win"
              value={recentStats.countWinRate != null ? `${recentStats.countWinRate}%` : '—'}
              color={recentStats.countWinRate != null && recentStats.countWinRate >= 50 ? colors.success : recentStats.countWinRate != null && recentStats.countWinRate < 30 ? colors.error : undefined}
            />
          </View>
        )}

        {/* Recent Games */}
        {games.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>RECENT GAMES</Text>
            {games.slice(0, 20).map((game) => {
              const gs = gameStats[game.id];
              return (
                <TouchableOpacity
                  key={game.id}
                  style={styles.gameRow}
                  onPress={() => router.push(`/(app)/training/mechanical/game-summary?gameId=${game.id}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.gameDate}>{formatDate(game.date)}</Text>
                    {game.opponent ? (
                      <Text style={styles.gameOpponent}>vs {game.opponent}</Text>
                    ) : null}
                  </View>
                  {gs && (
                    <View style={styles.gameStatsCol}>
                      <Text style={styles.gameStat}>
                        {gs.hits}-for-{gs.abs}
                      </Text>
                      <View style={[styles.scorePill, { backgroundColor: scoreColor(gs.score) + '20' }]}>
                        <Text style={[styles.scoreText, { color: scoreColor(gs.score) }]}>
                          {gs.score}
                        </Text>
                      </View>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Empty State */}
        {games.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="baseball-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No games logged yet</Text>
            <Text style={styles.emptyText}>
              After your next game, log your at-bats here to track your approach quality over time.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, color ? { color } : undefined]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function scoreColor(score: number | null | undefined): string {
  if (score == null) return colors.textMuted;
  if (score >= 80) return colors.success;
  if (score >= 65) return '#f59e0b';
  if (score >= 50) return colors.warning;
  return colors.error;
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
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

  content: { padding: 16, paddingBottom: 60, gap: 14 },

  introCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16,
  },
  introText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textSecondary, lineHeight: 20 },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 14,
  },
  ctaBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },

  statsRow: {
    flexDirection: 'row', gap: 8,
  },
  statBox: {
    flex: 1, alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 4,
  },
  statValue: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  statLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: colors.textMuted, marginTop: 2 },

  sectionTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 8 },

  gameRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  gameDate: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  gameOpponent: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  gameStatsCol: { alignItems: 'flex-end', gap: 4 },
  gameStat: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  scorePill: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full,
  },
  scoreText: { fontSize: 12, fontWeight: '900' },

  emptyState: {
    alignItems: 'center', paddingVertical: 48, gap: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  emptyText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 24 },
});

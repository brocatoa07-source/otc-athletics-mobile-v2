import { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  type GameLog,
  type AtBatLog,
  type GameReviewSummary,
  loadGames,
  loadGameAtBats,
  buildGameSummary,
  deleteGame,
  RESULT_LABELS,
  isHit,
} from '@/data/at-bat-accountability';

const ACCENT = '#E10600';

export default function GameSummaryScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const [game, setGame] = useState<GameLog | null>(null);
  const [atBats, setAtBats] = useState<AtBatLog[]>([]);
  const [summary, setSummary] = useState<GameReviewSummary | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [games, abs] = await Promise.all([loadGames(), loadGameAtBats(gameId)]);
        if (cancelled) return;
        const g = games.find((gm) => gm.id === gameId) ?? null;
        setGame(g);
        setAtBats(abs);
        if (g && abs.length > 0) {
          setSummary(buildGameSummary(g, abs));
        }
      })();
      return () => { cancelled = true; };
    }, [gameId]),
  );

  function handleDelete() {
    Alert.alert('Delete this game?', 'This will remove the game and all logged at-bats.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteGame(gameId);
          router.replace('/(app)/training/mechanical/at-bat-home' as any);
        },
      },
    ]);
  }

  if (!game) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Game Summary</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(app)/training/mechanical/at-bat-home' as any)} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>GAME REVIEW</Text>
          <Text style={styles.headerTitle}>
            {formatDate(game.date)}{game.opponent ? ` vs ${game.opponent}` : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {atBats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="baseball-outline" size={36} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No at-bats logged</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push(`/(app)/training/mechanical/edit-at-bat?gameId=${gameId}&orderIndex=0` as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={18} color="#fff" />
              <Text style={styles.addBtnText}>Add At-Bat</Text>
            </TouchableOpacity>
          </View>
        ) : summary ? (
          <>
            {/* ═══ OTC APPROACH SCORE ═══ */}
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>OTC APPROACH SCORE</Text>
              <Text style={[styles.scoreValue, { color: scoreColor(summary.otcApproachScore) }]}>
                {summary.otcApproachScore}
              </Text>
              <Text style={styles.scoreMax}>/ 100</Text>
              <ScoreBar score={summary.otcApproachScore} />
            </View>

            {/* ═══ COACHING TAKEAWAY ═══ */}
            <View style={styles.takeawayCard}>
              <Ionicons name="mic-outline" size={18} color="#f59e0b" />
              <Text style={styles.takeawayText}>{summary.coachingTakeaway}</Text>
            </View>

            {/* ═══ TRADITIONAL SUMMARY ═══ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>BOX SCORE</Text>
              <View style={styles.boxScoreRow}>
                <BoxStat label="AB" value={String(summary.totalABs)} />
                <BoxStat label="H" value={String(summary.hits)} />
                <BoxStat label="BB" value={String(summary.walks)} />
                <BoxStat label="K" value={String(summary.strikeouts)} />
                <BoxStat
                  label="AVG"
                  value={summary.battingAverage != null ? summary.battingAverage.toFixed(3).replace(/^0/, '') : '—'}
                />
              </View>

              {/* AB-by-AB results */}
              <View style={styles.abList}>
                {atBats.map((ab, i) => (
                  <TouchableOpacity
                    key={ab.id}
                    style={styles.abRow}
                    onPress={() => router.push(`/(app)/training/mechanical/edit-at-bat?gameId=${gameId}&atBatId=${ab.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.abNum}>AB {i + 1}</Text>
                    <Text style={[styles.abResult, isHit(ab.result) && { color: colors.success }]}>
                      {RESULT_LABELS[ab.result]}
                    </Text>
                    <View style={{ flex: 1 }} />
                    <Ionicons name="create-outline" size={14} color={colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ═══ PROCESS SUMMARY ═══ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROCESS BREAKDOWN</Text>
              <ProcessRow label="Timing" items={[
                { label: 'On Time', value: summary.processBreakdown.onTime, color: colors.success },
                { label: 'Early', value: summary.processBreakdown.early, color: colors.warning },
                { label: 'Late', value: summary.processBreakdown.late, color: colors.error },
              ]} total={summary.totalABs} />
              <ProcessRow label="Focus" items={[
                { label: 'Locked In', value: summary.processBreakdown.lockedIn, color: colors.success },
                { label: 'Neutral', value: summary.processBreakdown.neutral, color: colors.textMuted },
                { label: 'Frustrated', value: summary.processBreakdown.frustrated, color: colors.error },
              ]} total={summary.totalABs} />
              <ProcessRow label="Pitch Decision" items={[
                { label: 'My Pitch', value: summary.processBreakdown.myPitch, color: colors.success },
                { label: 'Took Pitch', value: summary.processBreakdown.takeMyPitch, color: colors.textMuted },
                { label: 'Chase', value: summary.processBreakdown.chase, color: colors.error },
              ]} total={summary.totalABs} />
              <ProcessRow label="Vision" items={[
                { label: 'Saw Well', value: summary.processBreakdown.sawBallWellYes, color: colors.success },
                { label: 'Didn\'t', value: summary.processBreakdown.sawBallWellNo, color: colors.error },
              ]} total={summary.totalABs} />
              <ProcessRow label="Plan" items={[
                { label: 'Stuck', value: summary.processBreakdown.stuckToPlanYes, color: colors.success },
                { label: 'Broke', value: summary.processBreakdown.stuckToPlanNo, color: colors.error },
              ]} total={summary.totalABs} />
              <ProcessRow label="Count" items={[
                { label: 'Ahead', value: summary.processBreakdown.advantage, color: colors.success },
                { label: 'Even', value: summary.processBreakdown.even, color: colors.textMuted },
                { label: 'Behind', value: summary.processBreakdown.disadvantage, color: colors.error },
              ]} total={summary.totalABs} />
              <ProcessRow label="Contact" items={[
                { label: 'Barreled', value: summary.processBreakdown.barreled, color: colors.success },
                { label: 'Solid', value: summary.processBreakdown.solid, color: '#3b82f6' },
                { label: 'Weak', value: summary.processBreakdown.weak, color: colors.warning },
                { label: 'None', value: summary.processBreakdown.noContact, color: colors.error },
              ]} total={summary.totalABs} />
            </View>

            {/* ═══ COUNT LEVERAGE ═══ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>COUNT LEVERAGE</Text>
              <View style={styles.boxScoreRow}>
                <BoxStat label="AHEAD" value={String(summary.countSummary.advantage)} />
                <BoxStat label="EVEN" value={String(summary.countSummary.even)} />
                <BoxStat label="BEHIND" value={String(summary.countSummary.disadvantage)} />
                <BoxStat
                  label="WIN RATE"
                  value={summary.countSummary.countWinRate != null
                    ? `${Math.round(summary.countSummary.countWinRate * 100)}%`
                    : '—'}
                />
              </View>
            </View>

            {/* ═══ CONTEXT & QUALITY ═══ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AB CONTEXT</Text>
              <ProcessRow label="Quality" items={[
                { label: 'Quality', value: summary.contextBreakdown.qualityAB, color: colors.success },
                { label: 'Productive', value: summary.contextBreakdown.productiveAB, color: '#3b82f6' },
                { label: 'Neutral', value: summary.contextBreakdown.neutralAB, color: colors.textMuted },
                { label: 'Poor', value: summary.contextBreakdown.poorAB, color: colors.error },
              ]} total={summary.totalABs} />
              <ProcessRow label="Team Impact" items={[
                { label: 'Helped', value: summary.contextBreakdown.helpedTeam, color: colors.success },
                { label: 'Neutral', value: summary.contextBreakdown.neutralTeam, color: colors.textMuted },
                { label: 'Hurt', value: summary.contextBreakdown.hurtTeam, color: colors.error },
              ]} total={summary.totalABs} />
              {(summary.contextBreakdown.battleAB > 0 ||
                summary.contextBreakdown.rbiExecution > 0 ||
                summary.contextBreakdown.twoStrikeProtect > 0 ||
                summary.contextBreakdown.missedOpportunity > 0) && (
                <View style={styles.contextTags}>
                  {summary.contextBreakdown.battleAB > 0 && (
                    <View style={styles.contextTag}>
                      <Text style={styles.contextTagText}>
                        {summary.contextBreakdown.battleAB} Battle AB{summary.contextBreakdown.battleAB > 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                  {summary.contextBreakdown.rbiExecution > 0 && (
                    <View style={styles.contextTag}>
                      <Text style={styles.contextTagText}>
                        {summary.contextBreakdown.rbiExecution} RBI Execution
                      </Text>
                    </View>
                  )}
                  {summary.contextBreakdown.twoStrikeProtect > 0 && (
                    <View style={styles.contextTag}>
                      <Text style={styles.contextTagText}>
                        {summary.contextBreakdown.twoStrikeProtect} 2-Strike Protect
                      </Text>
                    </View>
                  )}
                  {summary.contextBreakdown.missedOpportunity > 0 && (
                    <View style={[styles.contextTag, { borderColor: colors.error + '40', backgroundColor: colors.error + '08' }]}>
                      <Text style={[styles.contextTagText, { color: colors.error }]}>
                        {summary.contextBreakdown.missedOpportunity} Missed Opp
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Add another AB */}
            <TouchableOpacity
              style={styles.addMoreBtn}
              onPress={() => router.push(`/(app)/training/mechanical/edit-at-bat?gameId=${gameId}&orderIndex=${atBats.length}` as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={18} color={ACCENT} />
              <Text style={styles.addMoreText}>Add Another At-Bat</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Sub-components ─────────────────────────────── */

function BoxStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.boxStatItem}>
      <Text style={styles.boxStatValue}>{value}</Text>
      <Text style={styles.boxStatLabel}>{label}</Text>
    </View>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <View style={styles.scoreBarBg}>
      <View style={[styles.scoreBarFill, { width: `${score}%`, backgroundColor: scoreColor(score) }]} />
    </View>
  );
}

function ProcessRow({
  label,
  items,
  total,
}: {
  label: string;
  items: { label: string; value: number; color: string }[];
  total: number;
}) {
  return (
    <View style={styles.processRow}>
      <Text style={styles.processLabel}>{label}</Text>
      <View style={styles.processItems}>
        {items.map((item) => (
          <View key={item.label} style={styles.processItem}>
            <Text style={[styles.processValue, { color: item.color }]}>
              {item.value}
            </Text>
            <Text style={styles.processItemLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function scoreColor(score: number): string {
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  deleteBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.error + '15', alignItems: 'center', justifyContent: 'center',
  },

  content: { padding: 16, paddingBottom: 60, gap: 14 },

  /* Score card */
  scoreCard: {
    alignItems: 'center', gap: 4,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 24,
  },
  scoreLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted },
  scoreValue: { fontSize: 48, fontWeight: '900' },
  scoreMax: { fontSize: 14, fontWeight: '700', color: colors.textMuted, marginTop: -4 },
  scoreBarBg: {
    width: '100%', height: 6, borderRadius: 3,
    backgroundColor: colors.border, marginTop: 12,
  },
  scoreBarFill: { height: 6, borderRadius: 3 },

  /* Takeaway */
  takeawayCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.lg, padding: 16,
  },
  takeawayText: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary, lineHeight: 21 },

  /* Section */
  section: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 12,
  },
  sectionTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted },

  /* Box score */
  boxScoreRow: { flexDirection: 'row', gap: 4 },
  boxStatItem: { flex: 1, alignItems: 'center', gap: 2 },
  boxStatValue: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },
  boxStatLabel: { fontSize: 10, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.8 },

  /* AB list */
  abList: { gap: 6, marginTop: 4 },
  abRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.bg, borderRadius: radius.sm, padding: 10,
  },
  abNum: { fontSize: 12, fontWeight: '800', color: colors.textMuted, width: 40 },
  abResult: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },

  /* Process */
  processRow: { gap: 6 },
  processLabel: { fontSize: 12, fontWeight: '800', color: colors.textSecondary },
  processItems: { flexDirection: 'row', gap: 12 },
  processItem: { alignItems: 'center', gap: 2 },
  processValue: { fontSize: 18, fontWeight: '900' },
  processItemLabel: { fontSize: 9, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.5 },

  /* Context tags */
  contextTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  contextTag: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: radius.sm, borderWidth: 1,
    borderColor: ACCENT + '40', backgroundColor: ACCENT + '08',
  },
  contextTagText: { fontSize: 11, fontWeight: '800', color: ACCENT },

  /* Add more */
  addMoreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: ACCENT + '40', borderRadius: radius.md,
    paddingVertical: 12, backgroundColor: ACCENT + '08',
  },
  addMoreText: { fontSize: 14, fontWeight: '800', color: ACCENT },

  /* Empty */
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 20,
  },
  addBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});

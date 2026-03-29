/**
 * Hitting Vault — Problem-first development system.
 *
 * Structure:
 *   1. START HERE (philosophy)
 *   2. WHERE SHOULD I START? (simple guide — replaces diagnostics)
 *   3. TROUBLESHOOT MY SWING (main feature)
 *   4. MY CURRENT FOCUS (if in a 7-day block)
 *   5. DRILL LIBRARY (all drills browsable)
 *   6. APPROACH & MENTAL
 *   7. MY HISTORY (troubleshooting history)
 *
 * This is NOT a drill library. This is a development system.
 * Find Problem → Lock In → Work 7 Days → Track → Improve → Repeat
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import {
  TROUBLESHOOTING_CATEGORIES,
  loadActiveBlock, loadHistory,
  getTopicById, getCurrentDayOfBlock, getDaysRemaining, isTodayCheckedIn, checkInToday,
  type ActiveBlock,
} from '@/data/troubleshooting-engine';

const ACCENT = '#E10600';

const DAILY_CUES = [
  'Pick one problem. Work on it for 7 days.',
  'Real practice is working on what you\'re bad at.',
  'Do not jump from drill to drill.',
  'Compete in the box. Every pitch matters.',
  'If you get frustrated, you\'re working on the right thing.',
  'Serious players fix one thing at a time.',
  'Trust the process. Stack days.',
];

// ── Drill Library sections (secondary access) ──
const DRILL_SECTIONS = [
  { key: 'foundations', label: 'High Tee Foundation', icon: 'diamond-outline', color: '#E10600' },
  { key: 'timing', label: 'Timing', icon: 'timer-outline', color: '#e11d48' },
  { key: 'forward-move', label: 'Forward Move', icon: 'arrow-forward-outline', color: '#3b82f6' },
  { key: 'posture', label: 'Posture & Direction', icon: 'body-outline', color: '#0891b2' },
  { key: 'barrel-turn', label: 'Barrel Turn', icon: 'baseball-outline', color: '#ca8a04' },
  { key: 'connection', label: 'Connection', icon: 'link-outline', color: '#8b5cf6' },
  { key: 'extension', label: 'Extension', icon: 'resize-outline', color: '#16a34a' },
  { key: 'adjustability', label: 'Adjustability', icon: 'options-outline', color: '#f59e0b' },
  { key: 'machine-training', label: 'Machine Training', icon: 'cog-outline', color: '#0d9488' },
  { key: 'competition', label: 'Competition', icon: 'trophy-outline', color: '#dc2626' },
];

export default function HittingHome() {
  const { hasLimitedHitting } = useTier();
  const [activeBlock, setActiveBlock] = useState<ActiveBlock | null>(null);
  const [historyCount, setHistoryCount] = useState(0);

  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const todayCue = DAILY_CUES[dayIndex % DAILY_CUES.length];

  useFocusEffect(
    useCallback(() => {
      loadActiveBlock().then(setActiveBlock);
      loadHistory().then((h) => setHistoryCount(h.length));
    }, []),
  );

  const activeTopic = activeBlock?.isActive ? getTopicById(activeBlock.topicId) : null;
  const currentDay = activeBlock?.isActive ? getCurrentDayOfBlock(activeBlock.startDate) : 0;
  const daysLeft = activeBlock?.isActive ? getDaysRemaining(activeBlock.endDate) : 0;
  const checkedIn = activeBlock ? isTodayCheckedIn(activeBlock) : false;

  async function handleCheckIn() {
    const updated = await checkInToday();
    if (updated) setActiveBlock(updated);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>OTC ATHLETICS</Text>
          <Text style={styles.headerTitle}>Hitting Vault</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ═══════ 1. START HERE ═══════ */}
        <TouchableOpacity
          style={styles.startCard}
          onPress={() => router.push('/(app)/training/mechanical/start-here' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="book" size={18} color={ACCENT} />
          <View style={{ flex: 1 }}>
            <Text style={styles.startTitle}>Start Here</Text>
            <Text style={styles.startSub}>How this vault works. Read this first.</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══════ 2. WHERE SHOULD I START? ═══════ */}
        <TouchableOpacity
          style={[styles.guideCard, { borderColor: ACCENT + '30' }]}
          onPress={() => router.push('/(app)/training/mechanical/where-to-start' as any)}
          activeOpacity={0.85}
        >
          <View style={[styles.guideIcon, { backgroundColor: ACCENT + '15' }]}>
            <Ionicons name="compass" size={24} color={ACCENT} />
          </View>
          <Text style={styles.guideTitle}>Where Should I Start?</Text>
          <Text style={styles.guideSub}>Answer one question. Get your starting point.</Text>
        </TouchableOpacity>

        {/* ═══════ 3. MY CURRENT FOCUS (if active block) ═══════ */}
        {activeTopic && activeBlock?.isActive && (
          <View style={[styles.focusCard, { borderColor: ACCENT + '40' }]}>
            <View style={styles.focusTop}>
              <Ionicons name="lock-closed" size={14} color={ACCENT} />
              <Text style={[styles.focusLabel, { color: ACCENT }]}>MY CURRENT FOCUS</Text>
              <View style={[styles.dayBadge, { backgroundColor: ACCENT + '15' }]}>
                <Text style={[styles.dayBadgeText, { color: ACCENT }]}>Day {Math.min(currentDay, 7)}/7</Text>
              </View>
            </View>
            <Text style={styles.focusTitle}>{activeTopic.title}</Text>
            <View style={styles.dots}>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <View key={d} style={[
                  styles.dot,
                  d <= activeBlock.completedDaysCount ? { backgroundColor: ACCENT }
                    : d === currentDay ? { backgroundColor: ACCENT + '40' }
                    : styles.dotEmpty,
                ]} />
              ))}
            </View>
            <Text style={styles.focusMeta}>
              {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : 'Final day'} · {activeBlock.completedDaysCount}/7 checked in
            </Text>
            <View style={styles.focusActions}>
              {!checkedIn ? (
                <TouchableOpacity style={styles.checkInBtn} onPress={handleCheckIn} activeOpacity={0.85}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.checkInText}>Mark Today Complete</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.checkedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                  <Text style={styles.checkedText}>Today Complete</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.viewTopicBtn}
                onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/topic?id=${activeBlock.topicId}` as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.viewTopicText, { color: ACCENT }]}>View Topic</Text>
                <Ionicons name="chevron-forward" size={12} color={ACCENT} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ═══════ 4. TROUBLESHOOT MY SWING ═══════ */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>TROUBLESHOOT MY SWING</Text>
        {TROUBLESHOOTING_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/category?id=${cat.id}` as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
              <Ionicons name={cat.icon as any} size={18} color={cat.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
              <Text style={styles.categorySub}>{cat.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Browse all topics */}
        <TouchableOpacity
          style={styles.browseAllBtn}
          onPress={() => router.push('/(app)/training/mechanical/troubleshoot' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="list-outline" size={16} color={ACCENT} />
          <Text style={styles.browseAllText}>Browse All Topics</Text>
        </TouchableOpacity>

        {/* Today's cue */}
        <View style={styles.cueCard}>
          <Ionicons name="mic-outline" size={14} color={ACCENT} />
          <Text style={styles.cueText}>{todayCue}</Text>
        </View>

        {/* ═══════ 5. DRILL LIBRARY ═══════ */}
        <Text style={styles.sectionLabel}>DRILL LIBRARY</Text>
        <View style={styles.drillGrid}>
          {DRILL_SECTIONS.map((sec) => (
            <TouchableOpacity
              key={sec.key}
              style={styles.drillCard}
              onPress={() => router.push(`/(app)/training/mechanical/${sec.key}` as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.drillCardIcon, { backgroundColor: sec.color + '15' }]}>
                <Ionicons name={sec.icon as any} size={16} color={sec.color} />
              </View>
              <Text style={styles.drillCardLabel} numberOfLines={1}>{sec.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ═══════ 6. APPROACH ═══════ */}
        <Text style={styles.sectionLabel}>APPROACH & MENTAL</Text>
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={() => router.push('/(app)/training/mechanical/approach' as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.categoryIcon, { backgroundColor: '#a855f715' }]}>
            <Ionicons name="bulb" size={18} color="#a855f7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.categoryTitle}>Approach System</Text>
            <Text style={styles.categorySub}>Count plans, zone hunting, pitcher reading, 2-strike approach</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══════ 7. HISTORY ═══════ */}
        {historyCount > 0 && (
          <>
            <Text style={styles.sectionLabel}>MY HISTORY</Text>
            <TouchableOpacity
              style={styles.historyCard}
              onPress={() => router.push('/(app)/training/mechanical/troubleshoot/history' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="time" size={18} color={colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>Troubleshooting History</Text>
                <Text style={styles.historySub}>{historyCount} block{historyCount !== 1 ? 's' : ''} · Smart suggestions</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          </>
        )}

        {/* Walk tier upgrade */}
        {hasLimitedHitting && (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Preview Mode</Text>
              <Text style={styles.upgradeSub}>Upgrade to Single for full drill access.</Text>
            </View>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 10 },

  // Start Here
  startCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.md, padding: 12,
  },
  startTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  startSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  // Where Should I Start
  guideCard: {
    alignItems: 'center', gap: 8, padding: 20,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
  },
  guideIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  guideTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  guideSub: { fontSize: 12, color: colors.textSecondary },

  // Current Focus
  focusCard: {
    backgroundColor: colors.surface, borderWidth: 2, borderRadius: radius.lg, padding: 14, gap: 6,
  },
  focusTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  focusLabel: { flex: 1, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  dayBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  dayBadgeText: { fontSize: 10, fontWeight: '800' },
  focusTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { flex: 1, height: 6, borderRadius: 3 },
  dotEmpty: { backgroundColor: colors.border },
  focusMeta: { fontSize: 11, color: colors.textMuted },
  focusActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  checkInBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: radius.md, backgroundColor: ACCENT,
  },
  checkInText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  checkedBadge: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10,
  },
  checkedText: { fontSize: 13, fontWeight: '700', color: '#22c55e' },
  viewTopicBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 10, paddingHorizontal: 12 },
  viewTopicText: { fontSize: 12, fontWeight: '700' },

  // Section labels
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 8 },

  // Category cards
  categoryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  categoryIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  categoryTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  categorySub: { fontSize: 11, color: colors.textMuted, marginTop: 1, lineHeight: 15 },

  browseAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10,
  },
  browseAllText: { fontSize: 12, fontWeight: '700', color: ACCENT },

  // Cue
  cueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.md, padding: 12,
  },
  cueText: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary, fontStyle: 'italic' },

  // Drill library grid
  drillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  drillCard: {
    width: '31%' as any, alignItems: 'center', gap: 4, paddingVertical: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  drillCardIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  drillCardLabel: { fontSize: 9, fontWeight: '700', color: colors.textSecondary, textAlign: 'center' },

  // History
  historyCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  historyTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  historySub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  // Upgrade
  upgradeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.md, padding: 12,
  },
  upgradeTitle: { fontSize: 12, fontWeight: '800', color: colors.textPrimary },
  upgradeSub: { fontSize: 11, color: colors.textSecondary },
});

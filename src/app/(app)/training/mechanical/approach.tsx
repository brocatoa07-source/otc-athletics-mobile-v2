/**
 * Approach — Full hitter approach teaching section.
 *
 * This is not just a philosophy page. It teaches approach in detail
 * AND includes the approach drill cards from the vault sections.
 *
 * Structure: Teaching Content → Approach Drills → Practice Guidance
 */

import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, LayoutAnimation,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { HITTING_VAULT_SECTIONS } from '@/data/hitting-vault-sections';
import { useTier } from '@/hooks/useTier';

const ACCENT = '#a855f7';

// Pull approach drills from vault sections
const APPROACH_SECTION = HITTING_VAULT_SECTIONS.find((s) => s.key === 'approach');
const APPROACH_DRILLS = APPROACH_SECTION?.drills ?? [];

// ── Teaching Content ────────────────────────────────────────────────────────

const APPROACH_PRINCIPLES = [
  { title: 'What Is Approach?', body: 'Approach is your plan before the pitch. It\'s knowing what you\'re looking for, where you\'re looking for it, and what you\'ll do when you get it. Without a plan, you\'re just reacting.' },
  { title: 'Hunt Your Pitch', body: 'A zone hunt means picking one area of the zone to attack. If the pitch is in your zone — swing with intent. If it\'s not — take it. You don\'t have to swing at everything. You have to swing at your pitches and crush them.' },
  { title: 'Count Changes Everything', body: 'When you\'re ahead (1-0, 2-0, 2-1, 3-1), your zone is smaller. Hunt one pitch, one zone. Do damage. When you\'re behind (0-1, 0-2, 1-2), widen the zone. Compete. Put the ball in play. Don\'t give at-bats away.' },
  { title: '2-Strike Approach', body: 'With 2 strikes: widen your zone slightly, shorten your swing slightly, and battle. Your goal is no longer damage — it\'s competing. Put the ball in play hard. Make the pitcher earn the out.' },
  { title: 'Sit on a Pitch, Don\'t Guess', body: 'Sitting on a pitch is not guessing. Sitting means: I\'m ready for the fastball. If I get it, I\'m on time. If I don\'t, I adjust. Guessing means: I have no plan. Sitting means: I have a plan and I\'m ready to adjust.' },
];

const COUNT_GUIDE = [
  { count: '0-0', intent: 'Look to do damage. Hunt your pitch in your zone.', color: '#22c55e' },
  { count: '1-0 / 2-0 / 3-1', intent: 'Hitter\'s count. Zone is small. Damage pitch only.', color: '#22c55e' },
  { count: '0-1 / 1-1', intent: 'Even count. Still look to do damage, but be ready to compete.', color: '#f59e0b' },
  { count: '0-2 / 1-2', intent: 'Widen the zone. Compete. Put the ball in play. Battle.', color: '#ef4444' },
  { count: '2-1 / 2-2', intent: 'Be aggressive on strikes. Don\'t give at-bats away.', color: '#f59e0b' },
  { count: '3-2', intent: 'Full count. Be ready for anything. Compete.', color: '#ef4444' },
];

const APPROACH_TYPES = [
  { type: 'Contact Hitter', approach: 'Use the whole field. Let the ball travel. Hit line drives. Your approach is about coverage and consistency. Don\'t try to do too much — let the damage come from your ability to barrel the ball consistently.' },
  { type: 'Damage Hitter', approach: 'Hunt fastballs in your zone. Sit on one pitch, one area. When you get it, don\'t miss it. Your approach is about fewer swings, bigger results. Be patient, then violent.' },
];

// ── Advanced: Pitcher Shape ─────────────────────────────────────────────────

const PITCHER_SHAPES = [
  {
    shape: 'North-South',
    color: '#3b82f6',
    icon: 'swap-vertical-outline' as const,
    concept: 'These pitchers win with vertical separation. They change your eye level — fastball up, offspeed down.',
    pitchMix: '4-seam fastball, changeup, curveball, splitter',
    whatTheyDo: 'Change eye level. Fastball at the top of the zone, offspeed below. Get you to chase down or swing under the fastball.',
    hitterPlan: 'Look middle-up. See the ball up. Don\'t get pulled down too early. Make them prove they can land the low pitch for a strike.',
    cues: ['Middle-up', 'See it up', 'Don\'t chase down', 'Top-half timing'],
  },
  {
    shape: 'East-West',
    color: '#22c55e',
    icon: 'swap-horizontal-outline' as const,
    concept: 'These pitchers win with horizontal movement and edge control. They jam you in and stretch you away.',
    pitchMix: '2-seam / sinker, cutter, slider, changeup',
    whatTheyDo: 'Jam you inside. Expand you away. Create weak contact on the edges. Make you reach instead of turning clean.',
    hitterPlan: 'Think lane to lane. Be ready in or away. Hunt your side of the plate. Turn it or stay through it.',
    cues: ['Win a lane', 'In or away', 'Don\'t get stretched', 'Own your side'],
  },
  {
    shape: 'Mixed',
    color: '#f59e0b',
    icon: 'grid-outline' as const,
    concept: 'Some pitchers can beat you both vertically and horizontally. If you try to cover everything, you cover nothing.',
    pitchMix: 'Full arsenal — can work up/down and in/out',
    whatTheyDo: 'Force both up/down and in/out decisions. Make you cover too much zone. The more you expand, the weaker your contact.',
    hitterPlan: 'Shrink the plan. Default to your best fastball lane. Recognize shape early. Be simple — don\'t try to cover everything.',
    cues: ['Shrink the plan', 'Sit on your lane', 'Recognize shape early', 'Be simple'],
  },
];

const CLASSIFY_QUESTIONS = [
  'Does he beat hitters more up/down or in/out?',
  'What pitch does he trust most when ahead?',
  'What pitch is he trying to get me to chase?',
  'Where does his fastball really play best?',
  'What lane should I own?',
];

const TUNNEL_EXAMPLES = [
  { pair: '4-seam + curveball', type: 'North-south tunnel', color: '#3b82f6' },
  { pair: '4-seam + splitter/changeup', type: 'North-south tunnel', color: '#3b82f6' },
  { pair: '2-seam + slider', type: 'East-west tunnel', color: '#22c55e' },
  { pair: 'Cutter + changeup', type: 'Hybrid tunnel', color: '#f59e0b' },
];

export default function ApproachScreen() {
  const { hasLimitedHitting } = useTier();
  const [expandedDrill, setExpandedDrill] = useState<number | null>(null);

  function toggleDrill(i: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDrill(expandedDrill === i ? null : i);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>Approach</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Ionicons name="bulb" size={28} color={ACCENT} />
          <Text style={styles.heroTitle}>Hunt your pitch. Win the count.</Text>
          <Text style={styles.heroText}>
            Approach is the difference between a hitter who takes great BP and a hitter who competes in games. The best swing means nothing without a plan.
          </Text>
        </View>

        {/* ═══════ APPROACH PRINCIPLES ═══════ */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>APPROACH PRINCIPLES</Text>
        {APPROACH_PRINCIPLES.map((p) => (
          <View key={p.title} style={styles.teachCard}>
            <Text style={styles.teachTitle}>{p.title}</Text>
            <Text style={styles.teachBody}>{p.body}</Text>
          </View>
        ))}

        {/* ═══════ COUNT-BASED APPROACH ═══════ */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>COUNT-BASED APPROACH</Text>
        <View style={styles.countCard}>
          <Text style={styles.countIntro}>
            Your approach changes based on the count. Here's how to think:
          </Text>
          {COUNT_GUIDE.map((c) => (
            <View key={c.count} style={styles.countRow}>
              <View style={[styles.countBadge, { backgroundColor: c.color + '20' }]}>
                <Text style={[styles.countText, { color: c.color }]}>{c.count}</Text>
              </View>
              <Text style={styles.countIntent}>{c.intent}</Text>
            </View>
          ))}
        </View>

        {/* ═══════ CONTACT VS DAMAGE ═══════ */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>YOUR APPROACH TYPE</Text>
        {APPROACH_TYPES.map((t) => (
          <View key={t.type} style={styles.typeCard}>
            <Text style={styles.typeTitle}>{t.type}</Text>
            <Text style={styles.typeBody}>{t.approach}</Text>
          </View>
        ))}

        {/* ═══════ GAME PLANNING ═══════ */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>SIMPLE GAME PLAN</Text>
        <View style={styles.teachCard}>
          <Text style={styles.teachBody}>
            Before every at-bat, answer three questions:
          </Text>
          <View style={styles.planList}>
            <Text style={styles.planItem}>1. What pitch am I hunting?</Text>
            <Text style={styles.planItem}>2. Where in the zone am I looking?</Text>
            <Text style={styles.planItem}>3. What will I do if I don't get it?</Text>
          </View>
          <Text style={styles.teachBody}>
            That's your plan. Keep it simple. Execute it. If the pitcher takes away your plan, adjust — don't abandon it.
          </Text>
        </View>

        {/* ═══════ ADVANCED: READ THE PITCHER'S SHAPE ═══════ */}
        <Text style={[styles.sectionLabel, { color: '#ef4444' }]}>ADVANCED: READ THE PITCHER'S SHAPE</Text>

        {/* Pitch Shape Principle */}
        <View style={styles.teachCard}>
          <Text style={styles.teachTitle}>Pitch Shape Principle</Text>
          <Text style={styles.teachBody}>
            Don't just memorize pitch names. Understand how the pitcher is trying to beat you.
          </Text>
          <Text style={styles.teachBody}>
            Pitchers usually attack in one of three ways: change your eye level (north-south), move you side to side (east-west), or do both (mixed). The better you understand the pitcher's shape, the simpler your at-bat becomes.
          </Text>
          <View style={styles.shapeNote}>
            <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
            <Text style={styles.shapeNoteText}>
              This is a game-planning lens, not a rigid rule. North-south pitchers can still pitch in. East-west pitchers can still go up. The point is understanding what they do most — and planning around it.
            </Text>
          </View>
        </View>

        {/* 3 Shape Cards */}
        {PITCHER_SHAPES.map((s) => (
          <View key={s.shape} style={[styles.shapeCard, { borderColor: s.color + '30' }]}>
            <View style={styles.shapeHeader}>
              <View style={[styles.shapeIcon, { backgroundColor: s.color + '15' }]}>
                <Ionicons name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={[styles.shapeTitle, { color: s.color }]}>{s.shape}</Text>
            </View>
            <Text style={styles.teachBody}>{s.concept}</Text>
            <View style={styles.shapeRow}>
              <Text style={styles.shapeRowLabel}>COMMON PITCHES</Text>
              <Text style={styles.shapeRowValue}>{s.pitchMix}</Text>
            </View>
            <View style={styles.shapeRow}>
              <Text style={styles.shapeRowLabel}>WHAT THEY DO</Text>
              <Text style={styles.shapeRowValue}>{s.whatTheyDo}</Text>
            </View>
            <View style={[styles.shapePlanBox, { backgroundColor: s.color + '08' }]}>
              <Text style={[styles.shapeRowLabel, { color: s.color }]}>YOUR PLAN</Text>
              <Text style={styles.shapeRowValue}>{s.hitterPlan}</Text>
            </View>
            <View style={styles.shapeCueRow}>
              {s.cues.map((cue) => (
                <View key={cue} style={[styles.shapeCue, { backgroundColor: s.color + '12', borderColor: s.color + '25' }]}>
                  <Text style={[styles.shapeCueText, { color: s.color }]}>{cue}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* How to Classify a Pitcher */}
        <View style={styles.teachCard}>
          <Text style={styles.teachTitle}>How to Classify a Pitcher</Text>
          <Text style={styles.teachBody}>Ask yourself these questions in the first inning or during warm-ups:</Text>
          <View style={styles.planList}>
            {CLASSIFY_QUESTIONS.map((q, i) => (
              <Text key={i} style={styles.planItem}>{i + 1}. {q}</Text>
            ))}
          </View>
        </View>

        {/* Quick Pitcher Scan */}
        <View style={styles.scanCard}>
          <Text style={[styles.sectionLabel, { color: '#ef4444', marginTop: 0 }]}>QUICK PITCHER SCAN</Text>
          {PITCHER_SHAPES.map((s) => (
            <View key={s.shape} style={styles.scanRow}>
              <View style={[styles.scanDot, { backgroundColor: s.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.scanShape, { color: s.color }]}>{s.shape}</Text>
                <Text style={styles.scanSummary}>
                  {s.shape === 'North-South' && 'Middle-up. Top-half fastball ready. Don\'t chase below.'}
                  {s.shape === 'East-West' && 'Pick a lane. Ready in or away. Don\'t get stretched.'}
                  {s.shape === 'Mixed' && 'Simplify the plan. Sit on your best fastball lane. Adjust off shape.'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pitch Tunnels */}
        <View style={styles.teachCard}>
          <Text style={styles.teachTitle}>Pitch Tunnels Matter</Text>
          <Text style={styles.teachBody}>
            Pitchers are most dangerous when two pitches look the same early and separate late. That's a tunnel.
          </Text>
          <View style={{ gap: 6 }}>
            {TUNNEL_EXAMPLES.map((t) => (
              <View key={t.pair} style={styles.tunnelRow}>
                <View style={[styles.tunnelDot, { backgroundColor: t.color }]} />
                <Text style={styles.tunnelPair}>{t.pair}</Text>
                <Text style={[styles.tunnelType, { color: t.color }]}>{t.type}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.teachBody}>
            Don't just ask "what does he throw?" Also ask: which pitches look the same early? Which split late? What decision is he trying to force?
          </Text>
        </View>

        {/* Pre-AB Game Plan (Advanced) */}
        <View style={styles.teachCard}>
          <Text style={styles.teachTitle}>Pre-AB Game Plan</Text>
          <View style={styles.planList}>
            <Text style={styles.planItem}>1. What shape is this pitcher? (N-S / E-W / Mixed)</Text>
            <Text style={styles.planItem}>2. What fastball lane am I ready for? (middle-up / in / away)</Text>
            <Text style={styles.planItem}>3. What am I refusing to chase? (low offspeed / slider away / cutter in)</Text>
            <Text style={styles.planItem}>4. If I get my pitch, what is my intent? (line drive middle / oppo gap / turn on it)</Text>
          </View>
        </View>

        {/* Advanced Cues */}
        <View style={[styles.cueCard, { marginTop: 0 }]}>
          <Ionicons name="mic-outline" size={14} color="#ef4444" />
          <View style={styles.cueList}>
            {[
              'Read the shape',
              'Middle-up',
              'Win a lane',
              'Shrink the plan',
              'See it up',
              'Don\'t cover everything',
              'Recognize shape early',
              'Make him throw it where you want',
            ].map((cue) => (
              <Text key={cue} style={[styles.cueText, { color: '#ef4444' }]}>• {cue}</Text>
            ))}
          </View>
        </View>

        {/* ═══════ VELOCITY-BASED APPROACH ═══════ */}
        <TouchableOpacity
          style={[styles.teachCard, { borderColor: '#a855f725' }]}
          onPress={() => router.push('/(app)/training/mechanical/velocity-approach' as any)}
          activeOpacity={0.85}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="speedometer" size={20} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.teachTitle}>Change Your Field</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
                Learn how approach changes with velocity
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* ═══════ APPROACH DRILLS ═══════ */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>APPROACH DRILLS</Text>
        {APPROACH_DRILLS.map((drill, i) => {
          const isLocked = hasLimitedHitting && i >= (APPROACH_SECTION?.freeCount ?? 2);
          const isExpanded = expandedDrill === i;

          return (
            <TouchableOpacity
              key={drill.name}
              style={[styles.drillCard, isExpanded && styles.drillCardExpanded]}
              onPress={() => isLocked ? router.push('/(app)/upgrade' as any) : toggleDrill(i)}
              activeOpacity={0.8}
            >
              <View style={styles.drillHeader}>
                <View style={[styles.drillDot, { backgroundColor: ACCENT }]} />
                <Text style={styles.drillName}>{drill.name}</Text>
                {isLocked && <Ionicons name="lock-closed" size={14} color={colors.textMuted} />}
                {!isLocked && (
                  <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
                )}
              </View>
              {isExpanded && !isLocked && (
                <View style={styles.drillBody}>
                  <Text style={styles.drillFixes}>{drill.fixes}</Text>
                  <Text style={styles.drillHowTo}>{drill.howTo}</Text>
                  <View style={styles.drillFocusRow}>
                    <Ionicons name="mic-outline" size={12} color={ACCENT} />
                    <Text style={[styles.drillFocus, { color: ACCENT }]}>{drill.focus}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* ═══════ KEY CUES ═══════ */}
        <View style={styles.cueCard}>
          <Ionicons name="mic-outline" size={14} color={ACCENT} />
          <View style={styles.cueList}>
            {[
              'Hunt your pitch',
              'Win the count',
              'Don\'t miss your pitch',
              'Have a plan before you step in',
              'Damage on your pitch',
              'Shrink the zone when ahead',
              'Widen the zone with 2 strikes',
              'Sit ready, not rushed',
            ].map((cue) => (
              <Text key={cue} style={styles.cueText}>• {cue}</Text>
            ))}
          </View>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 10 },

  heroCard: {
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.lg, padding: 20, gap: 10, alignItems: 'center',
  },
  heroTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  heroText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 8 },

  teachCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  teachTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  teachBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  planList: { gap: 4, paddingLeft: 4 },
  planItem: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, lineHeight: 20 },

  countCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  countIntro: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  countRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  countBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, flexShrink: 0,
  },
  countText: { fontSize: 11, fontWeight: '900' },
  countIntent: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  typeCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 6,
  },
  typeTitle: { fontSize: 14, fontWeight: '800', color: ACCENT },
  typeBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  drillCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  drillCardExpanded: { borderColor: ACCENT + '30' },
  drillHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  drillDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  drillName: { flex: 1, fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  drillBody: { gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  drillFixes: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic' },
  drillHowTo: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  drillFocusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  drillFocus: { fontSize: 12, fontWeight: '700', fontStyle: 'italic' },

  cueCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.md, marginTop: 4,
  },
  cueList: { flex: 1, gap: 4 },
  cueText: { fontSize: 12, fontWeight: '700', color: ACCENT, lineHeight: 17 },

  // ── Advanced: Pitcher Shape ──
  shapeNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 10, backgroundColor: colors.bg, borderRadius: radius.sm, marginTop: 4,
  },
  shapeNoteText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  shapeCard: {
    backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  shapeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  shapeIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  shapeTitle: { fontSize: 16, fontWeight: '900' },
  shapeRow: { gap: 2 },
  shapeRowLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  shapeRowValue: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  shapePlanBox: { borderRadius: radius.sm, padding: 10, gap: 2 },
  shapeCueRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  shapeCue: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1,
  },
  shapeCueText: { fontSize: 10, fontWeight: '800' },

  // ── Quick Pitcher Scan ──
  scanCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 10,
  },
  scanRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  scanDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  scanShape: { fontSize: 13, fontWeight: '800' },
  scanSummary: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 1 },

  // ── Pitch Tunnels ──
  tunnelRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 4,
  },
  tunnelDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  tunnelPair: { flex: 1, fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  tunnelType: { fontSize: 10, fontWeight: '800' },
});

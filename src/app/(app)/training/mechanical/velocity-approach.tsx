/**
 * Change Your Field — Velocity-Based Approach
 *
 * Teaching module: how approach changes with pitch velocity.
 * Education-first, not a diagnostic or troubleshooting topic.
 */

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#a855f7';

const VELOCITY_RANGES = [
  {
    label: 'Average Velocity',
    speed: '88–92 mph',
    approach: 'Look Away → Backside',
    goal: 'Backside gap',
    color: '#3b82f6',
    why: [
      'You still have enough time to react to the inside pitch',
      'Looking away keeps you on the ball longer',
      'Helps you stay through the ball',
      'Helps prevent pulling off',
    ],
    goalDetail: 'Righty → Right-center gap. Lefty → Left-center gap. Let the ball travel and drive it the other way.',
  },
  {
    label: 'Above Average Velocity',
    speed: '93–95 mph',
    approach: 'Middle',
    goal: 'Hit ball back up the middle',
    color: '#f59e0b',
    why: [
      'Velocity is high enough that you can\'t fully cover in and away',
      'Middle approach lets you adjust to both sides',
      'You are trying to hit the ball back up the middle',
    ],
    goalDetail: 'Think middle of the field. Middle tunnel. Adjust in or away from there.',
  },
  {
    label: 'High Velocity / Power Arm',
    speed: '96+ mph',
    approach: 'Middle-In',
    goal: 'Pull side / Middle',
    color: '#ef4444',
    why: [
      'You cannot cover the outer half and turn on 96+',
      'You must pick a side',
      'You are hunting fastball',
      'You are looking in one tunnel',
    ],
    goalDetail: 'Look middle-in. React to spin in that tunnel. Be disciplined and stick to your zone.',
  },
];

const CUES = [
  'As velo goes up, your zone gets smaller.',
  'Pick a tunnel.',
  'You can\'t cover everything.',
  'Look in one area and do damage.',
  'Middle approach covers the most.',
  'Power arms = middle-in.',
];

export default function VelocityApproachScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>APPROACH</Text>
          <Text style={styles.headerTitle}>Change Your Field</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ═══════ CONCEPT ═══════ */}
        <View style={styles.heroCard}>
          <Ionicons name="speedometer" size={28} color={ACCENT} />
          <Text style={styles.heroTitle}>Velocity-Based Approach</Text>
          <Text style={styles.heroDesc}>
            As pitch velocity increases, you cannot cover the entire plate anymore. So your approach must change.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.bodyText}>The harder the pitcher throws:</Text>
          <View style={styles.bulletList}>
            {[
              'Your zone gets smaller',
              'Your reaction time gets shorter',
              'You must be more selective',
              'You must look in a specific area',
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: ACCENT }]} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary }]}>
            Good hitters don't try to cover the whole plate. They look for the ball in one area and do damage there.
          </Text>
        </View>

        {/* ═══════ VELOCITY TABLE ═══════ */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>VELOCITY → APPROACH</Text>
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Velocity</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Approach</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Goal</Text>
          </View>
          {VELOCITY_RANGES.map((v) => (
            <View key={v.speed} style={styles.tableRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tableCell, { color: v.color, fontWeight: '800' }]}>{v.speed}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tableCell}>{v.approach}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tableCell}>{v.goal}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ═══════ DETAILED BREAKDOWN ═══════ */}
        {VELOCITY_RANGES.map((v) => (
          <View key={v.speed} style={[styles.card, { borderColor: v.color + '25' }]}>
            <View style={styles.veloHeader}>
              <View style={[styles.veloBadge, { backgroundColor: v.color + '15' }]}>
                <Text style={[styles.veloBadgeText, { color: v.color }]}>{v.speed}</Text>
              </View>
              <Text style={[styles.veloLabel, { color: v.color }]}>{v.label}</Text>
            </View>
            <View style={styles.approachBadge}>
              <Text style={styles.approachBadgeLabel}>APPROACH</Text>
              <Text style={styles.approachBadgeValue}>{v.approach}</Text>
            </View>
            <Text style={[styles.sectionLabel, { color: v.color }]}>WHY</Text>
            {v.why.map((reason, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: v.color }]} />
                <Text style={styles.bulletText}>{reason}</Text>
              </View>
            ))}
            <View style={[styles.goalBox, { backgroundColor: v.color + '08' }]}>
              <Text style={[styles.sectionLabel, { color: v.color }]}>GOAL</Text>
              <Text style={styles.goalText}>{v.goalDetail}</Text>
            </View>

            {/* Video placeholder */}
            <View style={[styles.videoPlaceholder, { borderColor: v.color + '25' }]}>
              <Ionicons name="videocam-outline" size={20} color={colors.textMuted} />
              <Text style={styles.videoPlaceholderText}>
                {v.approach} approach example — coming soon
              </Text>
            </View>
          </View>
        ))}

        {/* ═══════ TUNNEL CONCEPT ═══════ */}
        <View style={[styles.card, { borderColor: ACCENT + '25' }]}>
          <Text style={[styles.sectionLabel, { color: ACCENT }]}>UNDERSTAND THE TUNNEL</Text>
          <Text style={styles.bodyText}>
            At higher velocities, you are not just looking for a location — you are looking for a tunnel.
          </Text>
          <Text style={styles.bodyText}>Example:</Text>
          <View style={styles.bulletList}>
            {[
              'Fastball middle-in',
              'Slider that starts middle-in then breaks',
              'Changeup that starts middle then fades',
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: ACCENT }]} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.bodyText, { fontWeight: '700', color: colors.textPrimary }]}>
            You pick a tunnel and react to the pitch from there. This allows you to hit both fastball and spin without trying to cover the entire plate.
          </Text>
        </View>

        {/* ═══════ HOW TO PRACTICE ═══════ */}
        <View style={styles.card}>
          <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>HOW TO TRAIN THIS</Text>

          <View style={styles.practiceBlock}>
            <Text style={styles.practiceEnv}>TEE WORK</Text>
            <Text style={styles.practiceText}>Set tee away → Hit opposite field line drives</Text>
            <Text style={styles.practiceText}>Set tee middle → Hit back up the middle</Text>
            <Text style={styles.practiceText}>Set tee inside → Pull side line drives</Text>
          </View>

          <View style={styles.practiceBlock}>
            <Text style={styles.practiceEnv}>FRONT TOSS / FLIPS</Text>
            <Text style={styles.practiceText}>Opposite field round</Text>
            <Text style={styles.practiceText}>Middle round</Text>
            <Text style={styles.practiceText}>Pull round</Text>
            <Text style={styles.practiceText}>Random location round</Text>
          </View>

          <View style={styles.practiceBlock}>
            <Text style={styles.practiceEnv}>MACHINE</Text>
            <Text style={styles.practiceText}>Away round</Text>
            <Text style={styles.practiceText}>Middle round</Text>
            <Text style={styles.practiceText}>Inside round</Text>
            <Text style={styles.practiceText}>High velocity middle-in approach</Text>
          </View>
        </View>

        {/* ═══════ CUES ═══════ */}
        <View style={[styles.cueCard, { borderColor: ACCENT + '20' }]}>
          <Ionicons name="mic-outline" size={14} color={ACCENT} />
          <View style={styles.cueList}>
            {CUES.map((cue) => (
              <Text key={cue} style={[styles.cueText, { color: ACCENT }]}>• {cue}</Text>
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
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  heroCard: {
    alignItems: 'center', gap: 8, padding: 20,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20', borderRadius: radius.lg,
  },
  heroTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  heroDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },

  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  bodyText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },

  bulletList: { gap: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  // Table
  tableCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tableHeaderText: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  tableRow: {
    flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tableCell: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  // Velocity detail cards
  veloHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  veloBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  veloBadgeText: { fontSize: 12, fontWeight: '900' },
  veloLabel: { fontSize: 14, fontWeight: '800' },
  approachBadge: {
    backgroundColor: colors.bg, borderRadius: radius.sm, padding: 10, gap: 2,
  },
  approachBadgeLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  approachBadgeValue: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  goalBox: { borderRadius: radius.sm, padding: 10, gap: 4 },
  goalText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, lineHeight: 19 },

  // Video placeholder
  videoPlaceholder: {
    alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 20, backgroundColor: colors.bg, borderWidth: 1,
    borderRadius: radius.md, borderStyle: 'dashed',
  },
  videoPlaceholderText: { fontSize: 11, color: colors.textMuted },

  // Practice
  practiceBlock: { gap: 3, paddingTop: 4, borderTopWidth: 1, borderTopColor: colors.border },
  practiceEnv: { fontSize: 10, fontWeight: '900', letterSpacing: 1, color: '#22c55e' },
  practiceText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, paddingLeft: 8 },

  // Cues
  cueCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: ACCENT + '08', borderWidth: 1, borderRadius: radius.md,
  },
  cueList: { flex: 1, gap: 4 },
  cueText: { fontSize: 12, fontWeight: '700', lineHeight: 17 },
});

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#E10600';

const PILLARS = [
  {
    number: '1',
    title: 'Movement Pattern',
    desc: 'Your mover diagnostic identifies how your body naturally produces power. Understanding your movement pattern is the foundation of efficient swing development.',
    icon: 'body-outline' as const,
    color: '#ef4444',
  },
  {
    number: '2',
    title: 'Mechanical Efficiency',
    desc: 'Mechanical adjustments remove leaks that prevent consistent contact. Drills and cues target specific deficiencies without changing who you are as a hitter.',
    icon: 'construct-outline' as const,
    color: '#3b82f6',
  },
  {
    number: '3',
    title: 'Competitive Execution',
    desc: 'Your ability to see pitches, make decisions, and compete. The best mechanics in the world mean nothing if you can\'t execute under pressure against live pitching.',
    icon: 'shield-checkmark-outline' as const,
    color: '#22c55e',
  },
];

const SWING_GOALS = [
  'Create consistent hard contact',
  'Adjust to different pitch locations',
  'Control ball flight',
  'Repeat your move under pressure',
];

export default function ApproachScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>OTC Hitting Philosophy</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ═══════ GOAL OF HITTING ═══════ */}
        <View style={styles.heroCard}>
          <Ionicons name="bulb" size={28} color="#f59e0b" />
          <Text style={styles.heroTitle}>The Goal of Hitting</Text>
          <Text style={styles.heroText}>
            The goal of hitting is to swing at your pitches and hit them hard.
          </Text>
        </View>

        <View style={styles.philosophyCard}>
          <Text style={styles.philosophyText}>
            Mechanics matter, but mechanics alone do not make a great hitter.
          </Text>
          <Text style={styles.philosophyText}>
            Great hitters combine three things:
          </Text>
          <View style={styles.threeThings}>
            <Text style={styles.threeItem}>1. Movement efficiency</Text>
            <Text style={styles.threeItem}>2. Ball flight control</Text>
            <Text style={styles.threeItem}>3. Competitive decision making</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>YOUR SWING SHOULD ALLOW YOU TO</Text>
        <View style={styles.goalsCard}>
          {SWING_GOALS.map((goal) => (
            <View key={goal} style={styles.goalRow}>
              <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              <Text style={styles.goalText}>{goal}</Text>
            </View>
          ))}
        </View>

        {/* ═══════ THREE PILLARS ═══════ */}
        <Text style={styles.sectionLabel}>THREE PILLARS OF THE OTC HITTING SYSTEM</Text>

        {PILLARS.map((pillar) => (
          <View key={pillar.number} style={styles.pillarCard}>
            <View style={[styles.pillarIcon, { backgroundColor: pillar.color + '18' }]}>
              <Text style={[styles.pillarNumber, { color: pillar.color }]}>{pillar.number}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.pillarTitleRow}>
                <Ionicons name={pillar.icon} size={16} color={pillar.color} />
                <Text style={[styles.pillarTitle, { color: pillar.color }]}>{pillar.title}</Text>
              </View>
              <Text style={styles.pillarDesc}>{pillar.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.pillarNote}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text style={styles.pillarNoteText}>
            All hitting development in OTC Athletics flows through these three pillars.
          </Text>
        </View>

        {/* ═══════ MECHANICS VS RESULTS ═══════ */}
        <Text style={styles.sectionLabel}>MECHANICS VS RESULTS</Text>
        <View style={styles.contrastCard}>
          <Text style={styles.contrastText}>
            Mechanics are tools used to remove deficiencies and improve consistency.
          </Text>
          <View style={styles.contrastDivider} />
          <Text style={styles.contrastText}>
            They are not the end goal.
          </Text>
          <View style={styles.contrastDivider} />
          <Text style={[styles.contrastText, { fontWeight: '800', color: colors.textPrimary }]}>
            The end goal is becoming a hitter who can compete against pitching and produce results consistently.
          </Text>
        </View>

        {/* ═══════ APPLICATION ═══════ */}
        <Text style={styles.sectionLabel}>APPLICATION TO DAILY TRAINING</Text>
        <View style={styles.applicationCard}>
          <View style={styles.appRow}>
            <View style={[styles.appDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.appText}>
              Know your movement pattern — train with it, not against it.
            </Text>
          </View>
          <View style={styles.appRow}>
            <View style={[styles.appDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.appText}>
              Use mechanical drills to fix specific deficiencies, not to rebuild your swing.
            </Text>
          </View>
          <View style={styles.appRow}>
            <View style={[styles.appDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.appText}>
              Compete every day. Cage work is not practice — it's preparation for at-bats.
            </Text>
          </View>
          <View style={styles.appRow}>
            <View style={[styles.appDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.appText}>
              Your diagnostics, daily work, and drill recommendations are all built around these principles.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/(app)/training/mechanical/mover-type-quiz' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="body-outline" size={18} color="#fff" />
          <Text style={styles.ctaBtnText}>Find Your Movement Pattern</Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
        </TouchableOpacity>
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
    backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.lg, padding: 24, gap: 12, alignItems: 'center',
  },
  heroTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  heroText: {
    fontSize: 16, fontWeight: '700', color: colors.textPrimary,
    textAlign: 'center', lineHeight: 24,
  },

  philosophyCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  philosophyText: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },
  threeThings: { gap: 4, paddingLeft: 4 },
  threeItem: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, lineHeight: 22 },

  sectionLabel: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 8,
  },

  goalsCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  goalText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary, lineHeight: 20 },

  pillarCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16,
  },
  pillarIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  pillarNumber: { fontSize: 18, fontWeight: '900' },
  pillarTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillarTitle: { fontSize: 15, fontWeight: '800' },
  pillarDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginTop: 4 },

  pillarNote: {
    flexDirection: 'row', gap: 8, padding: 14,
    backgroundColor: colors.surface, borderRadius: radius.lg,
  },
  pillarNoteText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  contrastCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 12,
  },
  contrastText: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },
  contrastDivider: { height: 1, backgroundColor: colors.border },

  applicationCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 12,
  },
  appRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  appDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  appText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: ACCENT, paddingVertical: 14, borderRadius: radius.md,
    marginTop: 4,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

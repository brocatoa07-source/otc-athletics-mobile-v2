/**
 * Strength Philosophy — "Why We Train This Way"
 *
 * Educational page explaining the OTC training system.
 * Text-based, clean sections, accessible to all Strength Vault users.
 */

import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#1DB954';

export default function StrengthPhilosophyScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>STRENGTH VAULT</Text>
          <Text style={styles.headerTitle}>Why We Train This Way</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Section 1: The Goal ──────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: ACCENT + '15' }]}>
              <Ionicons name="flag-outline" size={18} color={ACCENT} />
            </View>
            <Text style={[styles.sectionLabel, { color: ACCENT }]}>THE GOAL</Text>
          </View>
          <Text style={styles.body}>
            We are not training bodybuilders. We are not chasing aesthetics. We are not trying to make you sore.
          </Text>
          <Text style={styles.body}>
            We are building fast, powerful, durable athletes who can produce force, absorb force, and stay healthy across a full season.
          </Text>
          <Text style={styles.body}>
            Everything in this program exists because it transfers to the field. If it does not make you a better baseball player, it does not belong in the program.
          </Text>
        </View>

        {/* ── Section 2: The 4 Qualities ──────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#3b82f615' }]}>
              <Ionicons name="layers-outline" size={18} color="#3b82f6" />
            </View>
            <Text style={[styles.sectionLabel, { color: '#3b82f6' }]}>THE 4 QUALITIES WE TRAIN EVERY WEEK</Text>
          </View>

          <View style={styles.qualityCard}>
            <Text style={[styles.qualityTitle, { color: '#3b82f6' }]}>Strength</Text>
            <Text style={styles.qualityDesc}>Build the engine. Stronger muscles produce more force — which means harder hits, faster throws, and a more resilient body.</Text>
          </View>
          <View style={styles.qualityCard}>
            <Text style={[styles.qualityTitle, { color: '#ef4444' }]}>Power</Text>
            <Text style={styles.qualityDesc}>Apply force fast. Strength is useless if you cannot express it quickly. Power is what separates athletes from gym-strong lifters.</Text>
          </View>
          <View style={styles.qualityCard}>
            <Text style={[styles.qualityTitle, { color: '#f59e0b' }]}>Speed</Text>
            <Text style={styles.qualityDesc}>Move your body fast. Sprint mechanics, acceleration, and top-end speed are trained — not just hoped for.</Text>
          </View>
          <View style={styles.qualityCard}>
            <Text style={[styles.qualityTitle, { color: '#22c55e' }]}>Durability</Text>
            <Text style={styles.qualityDesc}>Stay healthy and stay on the field. Mobility, control, and recovery work keep the body functioning through the demands of a full season.</Text>
          </View>
        </View>

        {/* ── Section 3: Conjugate Method ─────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#8b5cf615' }]}>
              <Ionicons name="sync-outline" size={18} color="#8b5cf6" />
            </View>
            <Text style={[styles.sectionLabel, { color: '#8b5cf6' }]}>WHY WE TRAIN MULTIPLE QUALITIES</Text>
          </View>
          <Text style={styles.body}>
            We do not only train one thing at a time. We train strength, power, and speed every single week.
          </Text>
          <Text style={styles.body}>
            This is based on the conjugate method — the idea that developing multiple physical qualities simultaneously produces better athletes than training them in isolation.
          </Text>
          <Text style={styles.body}>
            Your body needs to learn how to use strength in real movements — not just in the gym. That is why the program includes both heavy lifts and explosive movements every week.
          </Text>
          <Text style={styles.emphasis}>
            The goal is not just to get stronger. The goal is to get stronger AND faster AND more powerful at the same time.
          </Text>
        </View>

        {/* ── Section 4: Strength + Power Alternation ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#f59e0b15' }]}>
              <Ionicons name="swap-horizontal-outline" size={18} color="#f59e0b" />
            </View>
            <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>HOW THE PROGRAM IS BUILT</Text>
          </View>
          <Text style={styles.body}>
            Some days are heavier and strength-focused. Some days are more explosive and power-focused. This alternation is intentional.
          </Text>
          <Text style={styles.body}>
            This is why your program includes all of these in the same week:
          </Text>
          <View style={styles.listWrap}>
            {[
              'Main lifts (squat, deadlift, press)',
              'Explosive lifts (cleans, snatches, jumps)',
              'Plyometrics (bounds, hops, depth jumps)',
              'Sprint work (acceleration, max velocity)',
              'Med ball throws (rotational power)',
              'Mobility work (joint access, recovery)',
            ].map((item) => (
              <View key={item} style={styles.listRow}>
                <View style={[styles.listDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.body}>
            Each piece supports the others. Heavy strength work builds the foundation. Explosive work teaches you to use it. Speed work applies it to real movement. Mobility keeps everything functioning.
          </Text>
        </View>

        {/* ── Section 5: Transfer to Baseball ─────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#E1060015' }]}>
              <Ionicons name="baseball-outline" size={18} color="#E10600" />
            </View>
            <Text style={[styles.sectionLabel, { color: '#E10600' }]}>TRANSFER TO BASEBALL</Text>
          </View>

          <View style={styles.transferCard}>
            <Text style={[styles.transferTitle, { color: '#3b82f6' }]}>Strength → Exit Velocity + Throwing Velocity</Text>
            <Text style={styles.transferDesc}>
              A stronger body produces more force through the kinetic chain. More force through the hips, trunk, and arms means harder contact and higher velo on the mound.
            </Text>
          </View>

          <View style={styles.transferCard}>
            <Text style={[styles.transferTitle, { color: '#ef4444' }]}>Power → Bat Speed + First Step</Text>
            <Text style={styles.transferDesc}>
              Power is force applied quickly. A more powerful athlete gets the barrel to the zone faster and explodes out of the box or off the mound.
            </Text>
          </View>

          <View style={styles.transferCard}>
            <Text style={[styles.transferTitle, { color: '#f59e0b' }]}>Speed → Base Running + Defense</Text>
            <Text style={styles.transferDesc}>
              Sprint mechanics and acceleration training directly improve stolen base success, range in the field, and gap-to-gap speed on defense.
            </Text>
          </View>

          <View style={styles.transferCard}>
            <Text style={[styles.transferTitle, { color: '#22c55e' }]}>Mobility → Durability + Movement Quality</Text>
            <Text style={styles.transferDesc}>
              An athlete who can access full hip rotation, T-spine extension, and shoulder range moves better, recovers faster, and stays on the field longer.
            </Text>
          </View>
        </View>

        {/* ── Closing ─────────────────────────────── */}
        <View style={styles.closingCard}>
          <Ionicons name="bulb-outline" size={18} color={ACCENT} />
          <Text style={styles.closingText}>
            Every rep in this program is designed to make you a better baseball player. Trust the system. Train with intent. The results show up on the field.
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 14 },

  section: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, flex: 1 },

  body: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },
  emphasis: {
    fontSize: 14, fontWeight: '700', color: colors.textPrimary,
    lineHeight: 21, fontStyle: 'italic', marginTop: 4,
  },

  qualityCard: {
    backgroundColor: colors.bg, borderRadius: radius.sm, padding: 12, gap: 4,
  },
  qualityTitle: { fontSize: 14, fontWeight: '900' },
  qualityDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  listWrap: { gap: 4 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  listDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  listText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  transferCard: {
    backgroundColor: colors.bg, borderRadius: radius.sm, padding: 12, gap: 4,
  },
  transferTitle: { fontSize: 13, fontWeight: '800' },
  transferDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  closingCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.md,
  },
  closingText: {
    flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary,
    lineHeight: 19, fontStyle: 'italic',
  },
});

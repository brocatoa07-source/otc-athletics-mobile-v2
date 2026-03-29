/**
 * 10-Second Reset — Full 8-step between-pitch reset system.
 *
 * Your complete reset protocol between every pitch.
 * Dedicated screen — no shared content with Emergency Reset.
 */

import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#8b5cf6';

const STEPS = [
  { step: '1', title: 'Step Out', detail: 'Step out of the box or off the rubber. Create physical separation from the last pitch.' },
  { step: '2', title: 'Breathe', detail: 'One deep breath — 4 seconds in through the nose, 6 seconds out through the mouth.' },
  { step: '3', title: 'Drop Shoulders', detail: 'Release tension. Let your jaw, hands, and shoulders go loose.' },
  { step: '4', title: 'Anchor Tap', detail: 'Tap your glove, waggle the bat, or touch the dirt. Trigger your compete mode.' },
  { step: '5', title: 'Power Phrase', detail: 'One short internal cue: "Attack." "See it." "Compete." "Next."' },
  { step: '6', title: 'Focal Point', detail: 'Lock your eyes on one thing — release point, bat knob, back of the plate.' },
  { step: '7', title: 'Nod', detail: 'Nod once with intent. Signal to yourself: "I\'m in. Let\'s go."' },
  { step: '8', title: 'Step In', detail: 'Step back in. You are reset. The last pitch is dead. This pitch is all that exists.' },
];

export default function TenSecondResetScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>COMPETE SYSTEM</Text>
          <Text style={styles.headerTitle}>10-Second Reset</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="refresh-circle" size={36} color={ACCENT} />
          </View>
          <Text style={styles.heroTitle}>Your 10-Second Reset</Text>
          <Text style={styles.heroDesc}>
            Use this between every pitch. After errors. After bad calls. Every time you need to come back to the present and compete.
          </Text>
        </View>

        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={14} color={ACCENT} />
          <Text style={styles.timeText}>Under 10 seconds · Becomes automatic with practice</Text>
        </View>

        {/* 8-Step System */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>FULL SYSTEM</Text>
        {STEPS.map((s) => (
          <View key={s.step} style={styles.stepCard}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNum}>{s.step}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDetail}>{s.detail}</Text>
            </View>
          </View>
        ))}

        {/* Coaching Note */}
        <View style={styles.coachNote}>
          <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
          <Text style={styles.coachNoteText}>
            Practice this in the cage, in BP, and in warmups — not just in games. By game time, your nervous system already knows the routine.
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 10 },
  hero: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  heroIcon: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: ACCENT + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  heroDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19, paddingHorizontal: 12 },
  timeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    backgroundColor: ACCENT + '10', borderWidth: 1, borderColor: ACCENT + '25',
  },
  timeText: { fontSize: 11, fontWeight: '700', color: ACCENT },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 8 },
  stepCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  stepBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: ACCENT + '18',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNum: { fontSize: 13, fontWeight: '900', color: ACCENT },
  stepTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  stepDetail: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 2 },
  coachNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.md, marginTop: 8,
  },
  coachNoteText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },
});

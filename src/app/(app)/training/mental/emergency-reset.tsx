/**
 * 3-Step Emergency Reset — Quick reset when time is short.
 *
 * After a bad pitch, a quick mound visit, or mid-at-bat.
 * Dedicated screen — no shared content with the full 10-Second Reset.
 */

import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#ef4444';

const STEPS = [
  { step: '1', title: 'Breathe', detail: 'One long exhale — blow the tension out.' },
  { step: '2', title: 'Cue Word', detail: 'Say your word: "Next." "Attack." "Compete."' },
  { step: '3', title: 'Step In', detail: 'Get back in. Compete right now.' },
];

export default function EmergencyResetScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>COMPETE SYSTEM</Text>
          <Text style={styles.headerTitle}>3-Step Emergency Reset</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="alert-circle" size={36} color={ACCENT} />
          </View>
          <Text style={styles.heroTitle}>Emergency Reset</Text>
          <Text style={styles.heroDesc}>
            When you don't have time for the full system — after a bad pitch, a quick mound visit, or mid-at-bat. Three steps. Get back in.
          </Text>
        </View>

        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={14} color={ACCENT} />
          <Text style={styles.timeText}>Under 3 seconds · Use when time is short</Text>
        </View>

        {/* 3-Step System */}
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>EMERGENCY RESET</Text>
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

        {/* When to use */}
        <View style={styles.whenCard}>
          <Text style={styles.whenTitle}>WHEN TO USE THIS</Text>
          <View style={styles.whenRow}>
            <View style={styles.whenDot} />
            <Text style={styles.whenText}>After a bad pitch or bad at-bat</Text>
          </View>
          <View style={styles.whenRow}>
            <View style={styles.whenDot} />
            <Text style={styles.whenText}>During a quick mound visit</Text>
          </View>
          <View style={styles.whenRow}>
            <View style={styles.whenDot} />
            <Text style={styles.whenText}>Mid-at-bat when you feel yourself drifting</Text>
          </View>
          <View style={styles.whenRow}>
            <View style={styles.whenDot} />
            <Text style={styles.whenText}>After an error in the field</Text>
          </View>
          <View style={styles.whenRow}>
            <View style={styles.whenDot} />
            <Text style={styles.whenText}>Any time you need to compete NOW</Text>
          </View>
        </View>

        {/* Coaching Note */}
        <View style={styles.coachNote}>
          <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
          <Text style={styles.coachNoteText}>
            The emergency reset works because it is simple. Don't overthink it — breathe, cue, compete. That's it.
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
    backgroundColor: colors.surface, borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.md, padding: 14,
  },
  stepBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: ACCENT + '20',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNum: { fontSize: 13, fontWeight: '900', color: ACCENT },
  stepTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  stepDetail: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 2 },
  whenCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14, gap: 8, marginTop: 8,
  },
  whenTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  whenRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  whenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT, marginTop: 5, flexShrink: 0 },
  whenText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  coachNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.md, marginTop: 8,
  },
  coachNoteText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },
});

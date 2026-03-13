import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#8b5cf6';

const RESET_STEPS = [
  { step: '01', text: 'Breathe Deep', detail: 'In through nose (4 sec), out through mouth (6 sec). "Slow breath, slow heart."' },
  { step: '02', text: 'Drop Your Shoulders', detail: 'Relax the tension. "Loose body, loose mind."' },
  { step: '03', text: 'Glove/Bat Anchor', detail: 'Tap your glove, waggle the bat, dig in. Trigger compete mode.' },
  { step: '04', text: 'Say Your Power Phrase', detail: '"Let\'s go." "Attack." "You\'ve got this."' },
  { step: '05', text: 'Lock In a Focal Point', detail: 'Bat knob, foul pole, back of the plate.' },
  { step: '06', text: 'Flip the Fear', detail: 'Say "I\'m excited." Reframe nerves into energy.' },
  { step: '07', text: 'Visualize Success (2 sec max)', detail: 'See a hard-hit ball. Trust muscle memory.' },
  { step: '08', text: 'Nod with Intent', detail: '"I\'m in. Let\'s compete."' },
  { step: '09', text: 'Focus on What You Control', detail: '"See it. Feel it. Do it."' },
  { step: '10', text: 'Smile or Laugh', detail: 'Lightens the moment. "I get to play this game."' },
];

export default function TenStepResetScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.label}>MENTAL TOOL</Text>
          <Text style={styles.title}>10-Step In-Game Reset</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="refresh-circle" size={36} color={ACCENT} />
          </View>
          <Text style={styles.heroTitle}>The In-Game Reset</Text>
          <Text style={styles.heroDesc}>
            Walk through all 10 in under 20 seconds. Use it between pitches, after errors,
            or any time you need to re-center. Over time, it becomes automatic.
          </Text>
        </View>

        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={16} color={ACCENT} />
          <Text style={styles.timerText}>Under 20 seconds · Becomes automatic with practice</Text>
        </View>

        {RESET_STEPS.map((step) => (
          <View key={step.step} style={styles.stepCard}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{step.step}</Text>
            </View>
            <View style={styles.stepBody}>
              <Text style={styles.stepTitle}>{step.text}</Text>
              <Text style={styles.stepDetail}>{step.detail}</Text>
            </View>
          </View>
        ))}

        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={18} color="#f59e0b" />
          <Text style={styles.tipText}>
            Elite athletes don't skip this because they "don't need it" — they do it because it's automatic.
            Practice this before you need it. Run through it in the cage, in BP, in warmups.
            By game time, your nervous system already knows the routine.
          </Text>
        </View>

        <View style={styles.quickRef}>
          <Text style={styles.quickRefTitle}>QUICK REFERENCE</Text>
          <Text style={styles.quickRefSub}>Breathe · Shoulders · Anchor · Phrase · Focus · Flip · Visualize · Nod · Control · Smile</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  label: { fontSize: 10, fontWeight: '800', color: ACCENT, letterSpacing: 1.5 },
  title: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, gap: 10, paddingBottom: 48 },

  hero: {
    alignItems: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 12,
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, marginBottom: 6,
  },
  heroIcon: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: `${ACCENT}15`, alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },
  heroDesc: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  timerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: `${ACCENT}10`, borderWidth: 1, borderColor: `${ACCENT}30`,
    borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 4,
  },
  timerText: { fontSize: 13, fontWeight: '600', color: ACCENT },

  stepCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 14,
  },
  stepNum: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: `${ACCENT}20`, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNumText: { fontSize: 12, fontWeight: '900', color: ACCENT },
  stepBody: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  stepDetail: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  tipCard: {
    flexDirection: 'row', gap: 12, padding: 14,
    backgroundColor: '#f59e0b10', borderWidth: 1, borderColor: '#f59e0b30',
    borderRadius: 12, marginTop: 4,
  },
  tipText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  quickRef: {
    backgroundColor: `${ACCENT}08`, borderWidth: 1, borderColor: `${ACCENT}25`,
    borderRadius: 12, padding: 14, gap: 6, alignItems: 'center',
  },
  quickRefTitle: { fontSize: 10, fontWeight: '900', color: ACCENT, letterSpacing: 1.5 },
  quickRefSub: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18, fontStyle: 'italic' },
});

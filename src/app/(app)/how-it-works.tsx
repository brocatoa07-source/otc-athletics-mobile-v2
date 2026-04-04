import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#1DB954';

const STEPS = [
  {
    icon: 'clipboard-outline',
    title: 'Assess',
    description: 'Take diagnostics to find your strengths and weak links.',
    route: '/(app)/training',
    color: '#3b82f6',
  },
  {
    icon: 'map-outline',
    title: 'Plan',
    description: 'Get a personalized development path based on your profile.',
    route: '/(app)/training/sc/my-path',
    color: '#8b5cf6',
  },
  {
    icon: 'flash-outline',
    title: 'Work',
    description: 'Follow your Daily Work — the app tells you what to do each day.',
    route: '/(app)/daily-work',
    color: '#22c55e',
  },
  {
    icon: 'analytics-outline',
    title: 'Track',
    description: 'Log workouts, check in on readiness, and record performance.',
    route: '/(app)/training/sc/progress',
    color: '#f59e0b',
  },
  {
    icon: 'bar-chart-outline',
    title: 'Review',
    description: 'See your progress dashboard — compliance, readiness, output trends.',
    route: '/(app)/training/sc/progress',
    color: '#ef4444',
  },
  {
    icon: 'settings-outline',
    title: 'Adjust',
    description: 'The system adjusts your program automatically based on your data.',
    color: '#0891b2',
  },
  {
    icon: 'repeat-outline',
    title: 'Repeat',
    description: 'Come back tomorrow. The app adapts. You improve.',
    route: '/(app)/daily-work',
    color: ACCENT,
  },
];

export default function HowItWorksScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>How This App Works</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          This is a player development operating system.{'\n'}
          It tells you what to do, tracks whether you do it, shows whether it is working, and adjusts the plan.
        </Text>

        {STEPS.map((step, idx) => (
          <TouchableOpacity
            key={step.title}
            style={styles.stepCard}
            onPress={() => step.route && router.push(step.route as any)}
            activeOpacity={step.route ? 0.75 : 1}
          >
            <View style={styles.stepLeft}>
              <View style={[styles.stepNum, { backgroundColor: step.color + '20' }]}>
                <Text style={[styles.stepNumText, { color: step.color }]}>{idx + 1}</Text>
              </View>
              {idx < STEPS.length - 1 && <View style={styles.stepLine} />}
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepTitleRow}>
                <Ionicons name={step.icon as any} size={16} color={step.color} />
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepDesc}>{step.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.loopCard}>
          <Text style={styles.loopTitle}>The Development Loop</Text>
          <Text style={styles.loopText}>
            Assess → Plan → Work → Track → Review → Adjust → Repeat
          </Text>
          <Text style={styles.loopSub}>
            Every day the app adapts to you. Show up. Do the work. Trust the process.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
          onPress={() => router.push('/(app)/daily-work' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={18} color="#fff" />
          <Text style={styles.ctaBtnText}>Start Today's Work</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 0 },

  intro: {
    fontSize: 13, color: colors.textSecondary, lineHeight: 20,
    textAlign: 'center', marginBottom: 20,
  },

  stepCard: { flexDirection: 'row', gap: 12, minHeight: 70 },
  stepLeft: { alignItems: 'center', width: 32 },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { fontSize: 12, fontWeight: '900' },
  stepLine: {
    width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4,
  },
  stepContent: { flex: 1, paddingBottom: 16 },
  stepTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  stepTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  stepDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  loopCard: {
    padding: 16, marginTop: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, alignItems: 'center', gap: 6,
  },
  loopTitle: { fontSize: 13, fontWeight: '900', color: colors.textPrimary },
  loopText: { fontSize: 11, fontWeight: '700', color: ACCENT, textAlign: 'center' },
  loopSub: { fontSize: 11, color: colors.textMuted, textAlign: 'center', lineHeight: 16 },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: radius.md, marginTop: 16,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});

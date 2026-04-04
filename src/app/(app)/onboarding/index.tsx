/**
 * Onboarding Flow — Multi-step athlete setup.
 *
 * Steps: Welcome → Goal → Pillar → Tiers → Trial → Complete
 */
import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useAccess } from '@/features/billing/useAccess';
import {
  GOALS, PILLARS,
  saveOnboardingState, completeOnboarding,
  type AthleteGoal, type PrimaryPillar,
} from '@/features/onboarding/onboardingState';
import { TIER_LABELS, TIER_PRICES, TIER_COLORS } from '@/features/billing/tierAccess';

const { width } = Dimensions.get('window');
const ACCENT = '#1DB954';

type Step = 'welcome' | 'goal' | 'pillar' | 'tiers' | 'trial' | 'complete';
const STEPS: Step[] = ['welcome', 'goal', 'pillar', 'tiers', 'trial', 'complete'];

export default function OnboardingScreen() {
  const { tier } = useTier();
  const access = useAccess();
  const [step, setStep] = useState<Step>('welcome');
  const [goal, setGoal] = useState<AthleteGoal | null>(null);
  const [pillar, setPillar] = useState<PrimaryPillar | null>(null);

  const stepIdx = STEPS.indexOf(step);

  function next() {
    const nextIdx = stepIdx + 1;
    if (nextIdx < STEPS.length) {
      // Skip trial step if not eligible
      if (STEPS[nextIdx] === 'trial' && !access.trialEligible) {
        setStep('complete');
      } else {
        setStep(STEPS[nextIdx]);
      }
    }
  }

  async function finish() {
    await saveOnboardingState({ goal, pillar, trialOffered: access.trialEligible });
    await completeOnboarding();
    router.replace('/(app)/dashboard' as any);
  }

  async function handleStartTrial() {
    const success = await access.startTrial();
    await saveOnboardingState({ trialAccepted: success });
    setStep('complete');
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {STEPS.map((s, i) => (
          <View key={s} style={[styles.dot, i <= stepIdx && styles.dotActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── WELCOME ────────────────────────────── */}
        {step === 'welcome' && (
          <View style={styles.stepContent}>
            <View style={[styles.heroIcon, { backgroundColor: ACCENT + '15' }]}>
              <Ionicons name="shield-checkmark" size={40} color={ACCENT} />
            </View>
            <Text style={styles.title}>Welcome to OTC Athletics</Text>
            <Text style={styles.subtitle}>
              This app builds complete athletes — not just swings or workouts.
            </Text>
            <Text style={styles.body}>
              We combine hitting, strength, and mental performance into one adaptive system that tells you what to do, tracks whether you do it, and adjusts your plan.
            </Text>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: ACCENT }]} onPress={next}>
              <Text style={styles.primaryBtnText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── GOAL ───────────────────────────────── */}
        {step === 'goal' && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>What's your #1 goal?</Text>
            <Text style={styles.subtitle}>Pick the one that matters most right now.</Text>
            {GOALS.map((g) => (
              <TouchableOpacity
                key={g.key}
                style={[styles.optionCard, goal === g.key && { borderColor: g.color, backgroundColor: g.color + '10' }]}
                onPress={() => setGoal(g.key)}
                activeOpacity={0.7}
              >
                <Ionicons name={g.icon as any} size={20} color={goal === g.key ? g.color : colors.textMuted} />
                <Text style={[styles.optionLabel, goal === g.key && { color: g.color }]}>{g.label}</Text>
                {goal === g.key && <Ionicons name="checkmark-circle" size={18} color={g.color} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: ACCENT }, !goal && { opacity: 0.4 }]}
              onPress={() => { if (goal) { saveOnboardingState({ goal }); next(); } }}
              disabled={!goal}
            >
              <Text style={styles.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── PILLAR ─────────────────────────────── */}
        {step === 'pillar' && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>Choose your primary focus</Text>
            <Text style={styles.subtitle}>You can train everything, but start with what matters most.</Text>
            {PILLARS.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[styles.pillarCard, pillar === p.key && { borderColor: p.color, backgroundColor: p.color + '10' }]}
                onPress={() => setPillar(p.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.pillarIcon, { backgroundColor: p.color + '15' }]}>
                  <Ionicons name={p.icon as any} size={22} color={pillar === p.key ? p.color : colors.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarLabel, pillar === p.key && { color: p.color }]}>{p.label}</Text>
                  <Text style={styles.pillarDesc}>{p.description}</Text>
                </View>
                {pillar === p.key && <Ionicons name="checkmark-circle" size={18} color={p.color} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: ACCENT }, !pillar && { opacity: 0.4 }]}
              onPress={() => { if (pillar) { saveOnboardingState({ pillar }); next(); } }}
              disabled={!pillar}
            >
              <Text style={styles.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── TIERS ──────────────────────────────── */}
        {step === 'tiers' && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>Choose your level</Text>
            <Text style={styles.subtitle}>Start free or unlock the full development system.</Text>
            {(['WALK', 'SINGLE', 'DOUBLE', 'TRIPLE'] as const).map((t) => (
              <View key={t} style={[styles.tierCard, { borderColor: TIER_COLORS[t] + '30' }]}>
                <View style={styles.tierHeader}>
                  <Text style={[styles.tierName, { color: TIER_COLORS[t] }]}>{TIER_LABELS[t]}</Text>
                  <Text style={styles.tierPrice}>{TIER_PRICES[t]}</Text>
                </View>
                <Text style={styles.tierDesc}>
                  {t === 'WALK' && 'Limited hitting drills. Dashboard. Logging.'}
                  {t === 'SINGLE' && 'Full hitting vault. Troubleshooting. Approach.'}
                  {t === 'DOUBLE' && 'Hitting + Mental. Daily Work. My Path. Weekly Review.'}
                  {t === 'TRIPLE' && 'Full system. Strength. Adaptive programming. Coach Brain.'}
                </Text>
                {t === 'DOUBLE' && (
                  <View style={styles.trialBadge}>
                    <Ionicons name="gift" size={10} color="#3b82f6" />
                    <Text style={styles.trialBadgeText}>7-day free trial</Text>
                  </View>
                )}
              </View>
            ))}
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: ACCENT }]} onPress={next}>
              <Text style={styles.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── TRIAL ──────────────────────────────── */}
        {step === 'trial' && access.trialEligible && (
          <View style={styles.stepContent}>
            <View style={[styles.heroIcon, { backgroundColor: '#3b82f615' }]}>
              <Ionicons name="gift" size={40} color="#3b82f6" />
            </View>
            <Text style={styles.title}>Start your free trial</Text>
            <Text style={styles.subtitle}>
              Get 7 days of Double access — hitting + mental performance training.
            </Text>
            <Text style={styles.body}>
              No commitment. No payment required. Just start training.
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: '#3b82f6' }]}
              onPress={handleStartTrial}
            >
              <Text style={styles.primaryBtnText}>Start Free Trial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={() => setStep('complete')}>
              <Text style={styles.skipText}>Continue with free version</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── COMPLETE ───────────────────────────── */}
        {step === 'complete' && (
          <View style={styles.stepContent}>
            <View style={[styles.heroIcon, { backgroundColor: '#22c55e15' }]}>
              <Ionicons name="checkmark-circle" size={40} color="#22c55e" />
            </View>
            <Text style={styles.title}>You're ready</Text>
            <Text style={styles.subtitle}>
              Your development system is set up. Here's what happens next:
            </Text>
            <View style={styles.nextSteps}>
              <NextStep num={1} text="Check in daily with the OTC readiness screen" />
              <NextStep num={2} text="Follow your Daily Work — the app tells you what to do" />
              <NextStep num={3} text="Track your progress and the system adapts to you" />
            </View>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: ACCENT }]}
              onPress={finish}
            >
              <Ionicons name="flash" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

function NextStep({ num, text }: { num: number; text: string }) {
  return (
    <View style={styles.nextStepRow}>
      <View style={styles.nextStepNum}>
        <Text style={styles.nextStepNumText}>{num}</Text>
      </View>
      <Text style={styles.nextStepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: ACCENT, width: 16 },
  content: { padding: 20, paddingBottom: 40 },

  stepContent: { gap: 16, alignItems: 'center' },
  heroIcon: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  title: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  body: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 19 },

  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, width: '100%', paddingVertical: 16, borderRadius: radius.md, marginTop: 8,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
  skipBtn: { paddingVertical: 12 },
  skipText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },

  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%',
    padding: 14, backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.md,
  },
  optionLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  pillarCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%',
    padding: 14, backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.md,
  },
  pillarIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pillarLabel: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  pillarDesc: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  tierCard: {
    width: '100%', padding: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderRadius: radius.md, gap: 4,
  },
  tierHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tierName: { fontSize: 15, fontWeight: '900' },
  tierPrice: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  tierDesc: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  trialBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: '#3b82f610', borderRadius: radius.sm, marginTop: 4,
  },
  trialBadgeText: { fontSize: 10, fontWeight: '700', color: '#3b82f6' },

  nextSteps: { width: '100%', gap: 12 },
  nextStepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nextStepNum: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: ACCENT + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  nextStepNumText: { fontSize: 12, fontWeight: '900', color: ACCENT },
  nextStepText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});

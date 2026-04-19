import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect, useCallback } from 'react';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';

const ACCENT = '#8b5cf6';

interface MeditationStep {
  instruction: string;
  duration: number;
}

interface Meditation {
  key: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  totalMin: number;
  when: string;
  steps: MeditationStep[];
}

const MEDITATIONS: Meditation[] = [
  {
    key: 'pregame-focus',
    title: 'Pre-Game Focus',
    subtitle: 'Lock in before competition. Clear the noise, sharpen your mind.',
    icon: 'baseball-outline',
    color: '#E10600',
    totalMin: 5,
    when: 'Before games or scrimmages',
    steps: [
      { instruction: 'Close your eyes. Take 3 deep breaths — in through the nose, out through the mouth. Let your shoulders drop.', duration: 20 },
      { instruction: 'Feel your feet on the ground. Feel the weight of your body. You are here. You are present.', duration: 15 },
      { instruction: 'Now visualize yourself walking to the plate. See the dirt, feel the bat, hear the crowd fade away.', duration: 20 },
      { instruction: 'See the pitcher. Watch the ball leave their hand. Track it all the way in. You see it perfectly.', duration: 20 },
      { instruction: 'Feel yourself swing — smooth, powerful, connected. Hear the crack of the bat. See the ball jump off the barrel.', duration: 20 },
      { instruction: 'Replay that feeling. The confidence. The calm. The control. This is your zone.', duration: 20 },
      { instruction: 'Now set your intention: "I will compete one pitch at a time. I trust my preparation."', duration: 15 },
      { instruction: 'Take 3 more deep breaths. When you open your eyes, you are locked in and ready.', duration: 20 },
      { instruction: 'Open your eyes. Nod. Say to yourself: "Let\'s go."', duration: 10 },
    ],
  },
  {
    key: 'anxiety-release',
    title: 'Calm the Nerves',
    subtitle: 'Release anxiety and tension. Get out of your head and into your body.',
    icon: 'leaf-outline',
    color: '#22c55e',
    totalMin: 4,
    when: 'When you feel anxious, tight, or overwhelmed',
    steps: [
      { instruction: 'Close your eyes. Inhale slowly for 4 seconds… hold for 4… exhale for 6. Repeat twice more.', duration: 30 },
      { instruction: 'Scan your body from head to toe. Where are you holding tension? Jaw? Shoulders? Hands? Notice it without judging.', duration: 20 },
      { instruction: 'With each exhale, release that tension. Let your jaw soften. Let your shoulders melt downward. Unclench your fists.', duration: 20 },
      { instruction: '5-4-3-2-1 grounding: Name 5 things you can see. 4 you can touch. 3 you can hear. 2 you can smell. 1 you can taste.', duration: 30 },
      { instruction: 'Say to yourself: "I am safe. I am calm. I am in control of how I respond."', duration: 15 },
      { instruction: 'Place one hand on your chest. Feel your heartbeat slowing. You are settling in.', duration: 20 },
      { instruction: 'Take 3 final slow breaths. Inhale calm, exhale tension. You are grounded.', duration: 20 },
      { instruction: 'When you\'re ready, open your eyes. You are clear, calm, and ready to compete.', duration: 15 },
    ],
  },
  {
    key: 'confidence-builder',
    title: 'Confidence Builder',
    subtitle: 'Rebuild self-belief through visualization and identity anchoring.',
    icon: 'shield-checkmark-outline',
    color: '#f59e0b',
    totalMin: 5,
    when: 'During slumps or before big moments',
    steps: [
      { instruction: 'Close your eyes. Take 3 slow breaths. Let go of the last game, the last at-bat, the last result.', duration: 20 },
      { instruction: 'Now go back to your best moment in baseball. The hit, the play, the game where you felt unstoppable. See it clearly.', duration: 25 },
      { instruction: 'Feel what you felt in that moment. The confidence. The freedom. The certainty that you belong.', duration: 20 },
      { instruction: 'That version of you is still here. He didn\'t leave. He\'s waiting for you to trust him again.', duration: 15 },
      { instruction: 'Now say: "I am the type of player who competes with confidence. I trust my work. I trust my hands."', duration: 20 },
      { instruction: 'Visualize your next game. See yourself locked in — calm eyes, loose body, aggressive approach.', duration: 25 },
      { instruction: 'See a hard-hit ball. Feel the barrel connect. That feeling is yours — it\'s not luck, it\'s preparation.', duration: 20 },
      { instruction: 'Say: "My confidence doesn\'t depend on results. It comes from my preparation and my identity."', duration: 15 },
      { instruction: 'Take 3 final breaths. Open your eyes. You are that player. Go prove it.', duration: 15 },
    ],
  },
  {
    key: 'post-game-reset',
    title: 'Post-Game Reset',
    subtitle: 'Process the game, release what happened, and reset for tomorrow.',
    icon: 'moon-outline',
    color: '#3b82f6',
    totalMin: 5,
    when: 'After games — especially tough ones',
    steps: [
      { instruction: 'Close your eyes. Take 5 slow, deep breaths. Let the game settle. Don\'t replay anything yet — just breathe.', duration: 30 },
      { instruction: 'Acknowledge how you\'re feeling right now. Frustrated? Proud? Flat? There\'s no wrong answer. Name it.', duration: 20 },
      { instruction: 'Now ask: "What did I do well today?" Find at least one thing — effort, attitude, a specific play. Hold onto it.', duration: 25 },
      { instruction: 'Now ask: "What\'s one thing I can improve?" Not 10 things. One clear takeaway. That\'s your focus for tomorrow.', duration: 25 },
      { instruction: 'Now let the rest of the game go. Every pitch, every result, every mistake — release it with your next exhale.', duration: 20 },
      { instruction: 'Say: "That game is done. I took what I needed from it. Tomorrow is a new opportunity."', duration: 15 },
      { instruction: 'Visualize yourself tomorrow — fresh, focused, competing with energy. See the best version of yourself showing up.', duration: 20 },
      { instruction: 'Take 3 final breaths. You did your job today. Now rest, recover, and come back sharper.', duration: 20 },
      { instruction: 'Open your eyes. You\'re clear. Tomorrow you compete again.', duration: 10 },
    ],
  },
  {
    key: 'breathwork',
    title: 'Box Breathing Reset',
    subtitle: 'The same technique used by Navy SEALs. 4 rounds to reset your nervous system.',
    icon: 'grid-outline',
    color: '#06b6d4',
    totalMin: 3,
    when: 'Anytime you need to calm down fast — between innings, in the dugout, before sleep',
    steps: [
      { instruction: 'Sit or stand comfortably. Close your eyes. Let your hands rest.', duration: 10 },
      { instruction: 'Round 1 — Inhale slowly for 4 seconds… Hold for 4… Exhale for 4… Hold for 4.', duration: 20 },
      { instruction: 'Round 2 — Inhale 4… Hold 4… Exhale 4… Hold 4. Feel your heart rate dropping.', duration: 20 },
      { instruction: 'Round 3 — Inhale 4… Hold 4… Exhale 4… Hold 4. Your body is settling.', duration: 20 },
      { instruction: 'Round 4 — Inhale 4… Hold 4… Exhale 4… Hold 4. You are calm and in control.', duration: 20 },
      { instruction: 'Take 2 normal breaths. Notice how different your body feels. That\'s your reset.', duration: 15 },
      { instruction: 'Say: "Slow breath, slow heart, clear mind." Open your eyes when ready.', duration: 10 },
    ],
  },
  {
    key: 'sleep',
    title: 'Pre-Sleep Wind Down',
    subtitle: 'Quiet your mind before bed. Better sleep means better performance.',
    icon: 'cloudy-night-outline',
    color: '#a855f7',
    totalMin: 6,
    when: 'In bed, lights off, before sleep',
    steps: [
      { instruction: 'Lie on your back. Close your eyes. Place one hand on your chest, one on your stomach.', duration: 15 },
      { instruction: 'Breathe in slowly for 4 seconds. Feel your stomach rise. Exhale for 7 seconds. Feel it fall.', duration: 25 },
      { instruction: 'Continue this rhythm. 4 in… 7 out. Let each exhale get slower and heavier.', duration: 30 },
      { instruction: 'Scan your body. Start at your feet. Relax your toes, your ankles, your calves. Let them sink into the bed.', duration: 25 },
      { instruction: 'Move up — relax your thighs, your hips, your lower back. Let gravity pull you down.', duration: 25 },
      { instruction: 'Relax your stomach, your chest, your shoulders. Let your arms go heavy.', duration: 20 },
      { instruction: 'Soften your jaw. Relax your eyes. Smooth your forehead. Your whole face is calm.', duration: 20 },
      { instruction: 'Now let your mind go quiet. If a thought comes, acknowledge it and let it pass like a cloud.', duration: 30 },
      { instruction: 'Say: "Today is done. I did enough. Tomorrow I compete again."', duration: 15 },
      { instruction: 'Continue breathing slowly. 4 in… 7 out. Let yourself drift off. You\'ve earned this rest.', duration: 30 },
    ],
  },
  {
    key: 'body-scan',
    title: 'Full Body Scan',
    subtitle: 'Release tension from head to toe. Find where stress hides and let it go.',
    icon: 'body-outline',
    color: '#14b8a6',
    totalMin: 8,
    when: 'After training, before sleep, or anytime you feel tight or disconnected from your body',
    steps: [
      { instruction: 'Find a comfortable position — sitting or lying down. Close your eyes. Take 3 slow, deep breaths to settle in.', duration: 25 },
      { instruction: 'Bring all your attention to the top of your head. Notice any tightness or pressure. Breathe into it. Let it soften.', duration: 20 },
      { instruction: 'Move to your forehead and eyes. Smooth your brow. Unclench behind your eyes. Let your eyelids feel heavy and relaxed.', duration: 20 },
      { instruction: 'Relax your jaw. Let your mouth fall slightly open. Release your tongue from the roof of your mouth. This is where athletes hold the most tension.', duration: 25 },
      { instruction: 'Drop your attention to your neck and throat. Roll your head gently if it helps. Let the muscles along the sides of your neck release.', duration: 20 },
      { instruction: 'Move to your shoulders. Drop them away from your ears. Feel the weight of your arms pulling them down. Let go of everything you\'ve been carrying.', duration: 25 },
      { instruction: 'Scan down your arms — biceps, forearms, wrists, hands. Open your palms. Spread your fingers wide, then release. Feel the energy drain out through your fingertips.', duration: 25 },
      { instruction: 'Bring attention to your chest. Feel your heartbeat. With each exhale, let your chest soften and open. You are safe here.', duration: 25 },
      { instruction: 'Move to your core — stomach, obliques, lower back. Athletes brace here constantly. Let your belly be soft. Release your lower back into the surface beneath you.', duration: 25 },
      { instruction: 'Scan your hips and glutes. These muscles work hard every day. Let them completely relax. Feel them heavy and loose.', duration: 25 },
      { instruction: 'Move down to your thighs — quads and hamstrings. Feel the length of the muscle. Breathe into any soreness or tightness. Let it melt.', duration: 25 },
      { instruction: 'Relax your knees, your shins, your calves. Let them sink. Notice any spots that feel tight and send your breath there.', duration: 25 },
      { instruction: 'Finally, your ankles and feet. Flex your toes, then release them. Feel the bottoms of your feet — the connection to the ground. Let them go completely still.', duration: 25 },
      { instruction: 'Now scan your whole body at once. From the top of your head to the tips of your toes — one long, slow wave of relaxation.', duration: 25 },
      { instruction: 'Notice how different your body feels now compared to when you started. This calm, connected feeling is always available to you.', duration: 20 },
      { instruction: 'Take 3 final deep breaths. Say to yourself: "My body is my tool. When I take care of it, it takes care of me."', duration: 20 },
      { instruction: 'When you\'re ready, gently wiggle your fingers and toes. Open your eyes slowly. You are reset.', duration: 15 },
    ],
  },
];

/* ────────────────────────────────────────────────
 * TIMER COMPONENT
 * ──────────────────────────────────────────────── */

function MeditationPlayer({ meditation, onClose }: { meditation: Meditation; onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(meditation.steps[0].duration);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = meditation.steps[stepIndex];
  const totalSteps = meditation.steps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  useEffect(() => {
    if (paused || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (stepIndex < totalSteps - 1) {
            const nextIdx = stepIndex + 1;
            setStepIndex(nextIdx);
            return meditation.steps[nextIdx].duration;
          } else {
            setFinished(true);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stepIndex, paused, finished]);

  const skipStep = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      setTimeLeft(meditation.steps[nextIdx].duration);
    } else {
      setFinished(true);
    }
  }, [stepIndex, totalSteps]);

  if (finished) {
    return (
      <View style={styles.playerWrap}>
        <View style={[styles.playerCard, { borderColor: meditation.color + '40' }]}>
          <Ionicons name="checkmark-circle" size={48} color={meditation.color} />
          <Text style={styles.playerFinishedTitle}>Session Complete</Text>
          <Text style={styles.playerFinishedSub}>
            You just invested {meditation.totalMin} minutes in your mental game. That compounds.
          </Text>
          <TouchableOpacity style={[styles.playerBtn, { backgroundColor: meditation.color }]} onPress={onClose}>
            <Text style={styles.playerBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.playerWrap}>
      <View style={[styles.playerCard, { borderColor: meditation.color + '40' }]}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` as any, backgroundColor: meditation.color }]} />
        </View>
        <Text style={[styles.playerStep, { color: meditation.color }]}>
          Step {stepIndex + 1} of {totalSteps}
        </Text>
        <Text style={styles.playerInstruction}>{currentStep.instruction}</Text>
        <Text style={[styles.playerTimer, { color: meditation.color }]}>{timeLeft}s</Text>
        <View style={styles.playerControls}>
          <TouchableOpacity style={styles.playerControlBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.playerMainBtn, { backgroundColor: meditation.color }]}
            onPress={() => setPaused(!paused)}
          >
            <Ionicons name={paused ? 'play' : 'pause'} size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playerControlBtn} onPress={skipStep}>
            <Ionicons name="play-forward" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ────────────────────────────────────────────────
 * MAIN SCREEN
 * ──────────────────────────────────────────────── */

export default function GuidedMeditations() {
  const { key: deepLinkKey } = useLocalSearchParams<{ key?: string }>();
  const [activeMeditation, setActiveMeditation] = useState<Meditation | null>(null);
  const [deepLinked, setDeepLinked] = useState(false);
  const { hasFullMental, isCoach } = useTier();
  const canAccess = hasFullMental || isCoach;

  // Auto-open a specific meditation when deep-linked
  useEffect(() => {
    if (deepLinked || !deepLinkKey) return;
    const match = MEDITATIONS.find(m => m.key === deepLinkKey);
    if (match) {
      setDeepLinked(true);
      setActiveMeditation(match);
    }
  }, [deepLinkKey, deepLinked]);

  if (activeMeditation) {
    return (
      <SafeAreaView style={styles.safe}>
        <MeditationPlayer meditation={activeMeditation} onClose={() => setActiveMeditation(null)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.label}>MENTAL VAULT</Text>
          <Text style={styles.title}>Guided Meditations</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Each session is built for athletes — short, focused, and designed around competition. Tap to begin.
        </Text>

        {MEDITATIONS.map((m, i) => {
          const locked = !canAccess && i >= 2;
          return (
            <TouchableOpacity
              key={m.key}
              style={[styles.card, locked && styles.cardLocked]}
              onPress={() => !locked && setActiveMeditation(m)}
              activeOpacity={locked ? 1 : 0.85}
            >
              <View style={[styles.cardIcon, { backgroundColor: m.color + '20' }]}>
                <Ionicons name={locked ? 'lock-closed-outline' : m.icon} size={24} color={locked ? colors.textMuted : m.color} />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, locked && styles.cardTitleLocked]}>{m.title}</Text>
                <Text style={styles.cardSub}>{m.subtitle}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.cardMetaItem}>
                    <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.cardMetaText}>{m.totalMin} min</Text>
                  </View>
                  <View style={styles.cardMetaItem}>
                    <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.cardMetaText}>{m.when}</Text>
                  </View>
                </View>
              </View>
              {!locked && (
                <TouchableOpacity
                  style={[styles.playBtn, { backgroundColor: m.color }]}
                  onPress={() => setActiveMeditation(m)}
                >
                  <Ionicons name="play" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}

        {!canAccess && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
            <Text style={styles.upgradeBannerText}>Upgrade to Double for all 7 meditations</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        <View style={styles.tip}>
          <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
          <Text style={styles.tipText}>
            Consistency beats length. A 3-minute daily session builds more mental strength than an occasional 30-minute one.
          </Text>
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
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4 },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: 14, padding: 16,
  },
  cardLocked: { opacity: 0.55 },
  cardIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  cardTitleLocked: { color: colors.textMuted },
  cardSub: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  cardMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  playBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14,
  },
  upgradeBannerText: { flex: 1, fontSize: 13, fontWeight: '700', color: ACCENT },

  tip: {
    flexDirection: 'row', gap: 10, padding: 14,
    backgroundColor: '#f59e0b10', borderWidth: 1, borderColor: '#f59e0b30',
    borderRadius: 12, marginTop: 4,
  },
  tipText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  playerWrap: { flex: 1, justifyContent: 'center', padding: 20 },
  playerCard: {
    backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: 20, padding: 28, alignItems: 'center', gap: 20,
  },
  progressBarBg: {
    width: '100%', height: 4, backgroundColor: colors.surfaceElevated,
    borderRadius: 2, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 2 },
  playerStep: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  playerInstruction: {
    fontSize: 18, fontWeight: '600', color: colors.textPrimary,
    textAlign: 'center', lineHeight: 26, minHeight: 80,
  },
  playerTimer: { fontSize: 36, fontWeight: '900' },
  playerControls: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 8 },
  playerControlBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  playerMainBtn: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  playerBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  playerBtn: { paddingVertical: 14, paddingHorizontal: 48, borderRadius: 12, marginTop: 8 },
  playerFinishedTitle: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },
  playerFinishedSub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});

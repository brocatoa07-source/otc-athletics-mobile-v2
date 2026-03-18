import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { colors, radius } from '@/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { getLiveUser } from '@/utils/getLiveUser';
import { submitDiagnostic } from '@/lib/gating/diagnosticService';
import {
  HITTING_IDENTITY_QUESTIONS,
  MOVEMENT_PROFILES,
  BAT_PATH_PROFILES,
  COMBINED_PROFILE_SUMMARIES,
  HITTING_IDENTITY_STORAGE_KEY,
  scoreHittingIdentity,
  type HittingIdentityDiagnosticResult,
} from '@/data/hitting-identity-data';

const ACCENT = '#E10600';
const TOTAL_QUESTIONS = HITTING_IDENTITY_QUESTIONS.length;

type Screen = 'intro' | 'quiz' | 'results';

export default function HittingIdentityQuizScreen() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<('a' | 'b')[]>([]);
  const [result, setResult] = useState<HittingIdentityDiagnosticResult | null>(null);
  const [mechAlreadyDone, setMechAlreadyDone] = useState(false);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    AsyncStorage.getItem('otc:mechanical-diagnostic').then((val) => {
      setMechAlreadyDone(val !== null);
    });
  }, []);

  const question = HITTING_IDENTITY_QUESTIONS[currentQ];
  const isMovementSection = currentQ < 6;
  const sectionLabel = isMovementSection ? 'MOVEMENT PATTERN' : 'BAT PATH';
  const sectionColor = isMovementSection ? '#a855f7' : '#22c55e';

  async function handleAnswer(letter: 'a' | 'b') {
    const next = [...answers, letter];
    setAnswers(next);

    if (next.length >= TOTAL_QUESTIONS) {
      const scored = scoreHittingIdentity(next);
      setResult(scored);
      setScreen('results');

      // Persist locally
      AsyncStorage.setItem(HITTING_IDENTITY_STORAGE_KEY, JSON.stringify(scored));

      // Submit to Supabase as the new diagnostic type
      const liveUser = await getLiveUser();
      const resolvedId = liveUser?.id ?? user?.id;
      if (resolvedId) {
        try {
          if (__DEV__) console.log('[hitting-identity] submitting diagnostic for user:', resolvedId);
          await submitDiagnostic(supabase, {
            userId: resolvedId,
            vaultType: 'hitting',
            diagnosticType: 'mover-type',
            resultPayload: {
              movementType: scored.movementType,
              batPathType: scored.batPathType,
              combinedProfile: scored.combinedProfile,
              movementScores: scored.movementScores,
              batPathScores: scored.batPathScores,
            },
          });
          if (__DEV__) console.log('[hitting-identity] submitDiagnostic OK');
        } catch (err: any) {
          console.error('[hitting-identity] submitDiagnostic FAILED:', err?.message ?? err);
          Alert.alert(
            'Save Error',
            'Your results are saved locally but could not sync to the server. Please check your connection and try again.',
          );
        }
        queryClient.invalidateQueries({ queryKey: ['gate-state', resolvedId] });
      } else {
        console.warn('[hitting-identity] no userId — skipping Supabase submit');
      }
    } else {
      setCurrentQ(currentQ + 1);
    }
  }

  function startQuiz() {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
    setScreen('quiz');
  }

  function retake() {
    AsyncStorage.removeItem(HITTING_IDENTITY_STORAGE_KEY);
    startQuiz();
  }

  const mv = result ? MOVEMENT_PROFILES[result.movementType] : null;
  const bp = result ? BAT_PATH_PROFILES[result.batPathType] : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (screen === 'quiz' ? retake() : router.back())}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>HITTING VAULT</Text>
          <Text style={styles.title}>Hitting Identity Diagnostic</Text>
        </View>
        {screen === 'quiz' && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>
              {currentQ + 1} / {TOTAL_QUESTIONS}
            </Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ═══════ INTRO ═══════ */}
        {screen === 'intro' && (
          <>
            <View style={styles.introCard}>
              <View style={[styles.introIconWrap, { backgroundColor: ACCENT + '15' }]}>
                <Ionicons name="baseball-outline" size={40} color={ACCENT} />
              </View>
              <Text style={styles.introTitle}>Find Your Hitting Identity</Text>
              <Text style={styles.introDesc}>
                12 questions · 2 sections{'\n'}Discover how you move and how your barrel works.
              </Text>
            </View>

            <Text style={styles.introPhilosophy}>
              Hunt your pitch. Find the barrel. Backspin the ball.
            </Text>

            <Text style={styles.sectionLabel}>2 AXES</Text>

            <View style={styles.typePreview}>
              <View style={[styles.typeDot, { backgroundColor: '#a855f7' }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.typeName, { color: '#a855f7' }]}>Movement Pattern</Text>
                <Text style={styles.typeTagline}>Springy or Grounded — how you organize force</Text>
              </View>
            </View>

            <View style={styles.typePreview}>
              <View style={[styles.typeDot, { backgroundColor: '#22c55e' }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.typeName, { color: '#22c55e' }]}>Bat Path / Action</Text>
                <Text style={styles.typeTagline}>Horizontal or Vertical — how your barrel works</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: ACCENT }]}
              onPress={startQuiz}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle" size={20} color="#fff" />
              <View style={{ flex: 1 }}>
                <Text style={styles.startBtnTitle}>Start Diagnostic</Text>
                <Text style={styles.startBtnSub}>12 questions — under 2 minutes</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>

            <View style={styles.noteCard}>
              <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
              <Text style={styles.noteText}>
                Pick what feels most true. There are no wrong answers — this identifies how you naturally hit, not what you should become.
              </Text>
            </View>
          </>
        )}

        {/* ═══════ QUIZ ═══════ */}
        {screen === 'quiz' && question && (
          <>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentQ / TOTAL_QUESTIONS) * 100}%`,
                    backgroundColor: sectionColor,
                  },
                ]}
              />
            </View>

            <View style={[styles.sectionBadge, { backgroundColor: sectionColor + '18' }]}>
              <Text style={[styles.sectionBadgeText, { color: sectionColor }]}>
                {sectionLabel}
              </Text>
            </View>

            <Text style={[styles.questionNum, { color: sectionColor }]}>
              QUESTION {currentQ + 1} OF {TOTAL_QUESTIONS}
            </Text>
            <Text style={styles.questionText}>{question.q}</Text>

            <View style={styles.optionsList}>
              {question.options.map((opt) => (
                <TouchableOpacity
                  key={opt.letter}
                  style={styles.optionBtn}
                  onPress={() => handleAnswer(opt.letter)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionLetter, { backgroundColor: sectionColor + '20' }]}>
                    <Text style={[styles.optionLetterText, { color: sectionColor }]}>
                      {opt.letter.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.optionText}>{opt.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ═══════ RESULTS ═══════ */}
        {screen === 'results' && result && mv && bp && (
          <>
            {/* 1. Header */}
            <Text style={styles.resultsEyebrow}>YOUR HITTING IDENTITY</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{result.summaryLabel}</Text>
              <Text style={styles.summaryDesc}>
                {COMBINED_PROFILE_SUMMARIES[result.combinedProfile]}
              </Text>
            </View>

            {/* 2. Movement Pattern section */}
            <Text style={[styles.sectionLabel, { color: mv.color }]}>MOVEMENT PATTERN</Text>
            <View style={[styles.resultSection, { borderColor: mv.color + '30' }]}>
              <View style={[styles.resultBadge, { backgroundColor: mv.color + '20' }]}>
                <Text style={[styles.resultBadgeText, { color: mv.color }]}>{mv.label}</Text>
              </View>
              <Text style={styles.resultDesc}>{mv.description}</Text>

              <Text style={[styles.subLabel, { color: mv.color }]}>WHAT YOU DO WELL</Text>
              {mv.strengths.map((s) => (
                <View key={s} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: mv.color }]} />
                  <Text style={styles.bulletText}>{s}</Text>
                </View>
              ))}

              <Text style={[styles.subLabel, { color: mv.color }]}>WHAT YOU MAY STRUGGLE WITH</Text>
              {mv.struggles.map((s) => (
                <View key={s} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: mv.color + '60' }]} />
                  <Text style={styles.bulletText}>{s}</Text>
                </View>
              ))}

              <Text style={[styles.subLabel, { color: mv.color }]}>WHAT TO WORK ON</Text>
              {mv.workOns.map((w) => (
                <View key={w} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={mv.color} />
                  <Text style={styles.bulletText}>{w}</Text>
                </View>
              ))}

              <Text style={[styles.subLabel, { color: mv.color }]}>MOVEMENT CUES</Text>
              {mv.cues.map((cue) => (
                <View key={cue} style={[styles.cueCard, { backgroundColor: mv.color + '10', borderColor: mv.color + '30' }]}>
                  <Ionicons name="mic-outline" size={14} color={mv.color} />
                  <Text style={styles.cueText}>{cue}</Text>
                </View>
              ))}

              <Text style={[styles.subLabel, { color: mv.color }]}>MLB MOVEMENT EXAMPLES</Text>
              <Text style={styles.mlbExampleNote}>How these hitters organize movement</Text>
              {mv.mlbExamples.map((name) => (
                <View key={name} style={styles.mlbRow}>
                  <View style={[styles.mlbDot, { backgroundColor: mv.color }]} />
                  <Text style={[styles.mlbName, { color: mv.color }]}>{name}</Text>
                </View>
              ))}
            </View>

            {/* 3. Bat Path / Action section */}
            <Text style={[styles.sectionLabel, { color: bp.color }]}>BAT PATH / ACTION</Text>
            <View style={[styles.resultSection, { borderColor: bp.color + '30' }]}>
              <View style={[styles.resultBadge, { backgroundColor: bp.color + '20' }]}>
                <Text style={[styles.resultBadgeText, { color: bp.color }]}>{bp.label}</Text>
              </View>
              <Text style={styles.resultDesc}>{bp.description}</Text>

              <Text style={[styles.subLabel, { color: bp.color }]}>WHAT YOU DO WELL</Text>
              {bp.strengths.map((s) => (
                <View key={s} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: bp.color }]} />
                  <Text style={styles.bulletText}>{s}</Text>
                </View>
              ))}

              <Text style={[styles.subLabel, { color: bp.color }]}>WHAT YOU MAY STRUGGLE WITH</Text>
              {bp.struggles.map((s) => (
                <View key={s} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: bp.color + '60' }]} />
                  <Text style={styles.bulletText}>{s}</Text>
                </View>
              ))}

              <Text style={[styles.subLabel, { color: bp.color }]}>WHAT TO WORK ON</Text>
              {bp.workOns.map((w) => (
                <View key={w} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={bp.color} />
                  <Text style={styles.bulletText}>{w}</Text>
                </View>
              ))}

              <Text style={[styles.subLabel, { color: bp.color }]}>BAT PATH CUES</Text>
              {bp.cues.map((cue) => (
                <View key={cue} style={[styles.cueCard, { backgroundColor: bp.color + '10', borderColor: bp.color + '30' }]}>
                  <Ionicons name="mic-outline" size={14} color={bp.color} />
                  <Text style={styles.cueText}>{cue}</Text>
                </View>
              ))}

              <Text style={[styles.subLabel, { color: bp.color }]}>MLB BAT PATH EXAMPLES</Text>
              <Text style={styles.mlbExampleNote}>How these hitters' barrels tend to work</Text>
              {bp.mlbExamples.map((name) => (
                <View key={name} style={styles.mlbRow}>
                  <View style={[styles.mlbDot, { backgroundColor: bp.color }]} />
                  <Text style={[styles.mlbName, { color: bp.color }]}>{name}</Text>
                </View>
              ))}
            </View>

            {/* 4. Combined profile teaching */}
            <View style={styles.teachingCard}>
              <Ionicons name="school-outline" size={18} color={colors.textMuted} />
              <Text style={styles.teachingText}>
                Your Hitting Identity has two parts:{'\n\n'}
                <Text style={{ fontWeight: '800' }}>Movement Pattern</Text> describes how you organize your body and create force.{'\n\n'}
                <Text style={{ fontWeight: '800' }}>Bat Path</Text> describes how your barrel tends to work to the ball.{'\n\n'}
                Neither is better or worse. Your goal is to organize your identity better, not force yourself into someone else's model.
              </Text>
            </View>

            {/* 5. Navigation CTAs */}
            {mechAlreadyDone ? (
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: '#22c55e' }]}
                onPress={() => router.back()}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.nextBtnText}>Back to Diagnostics Hub</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View style={styles.nextCard}>
                  <Ionicons name="arrow-forward-circle-outline" size={20} color="#22c55e" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nextTitle}>Next: Mechanical Diagnostic</Text>
                    <Text style={styles.nextSub}>
                      10 questions to identify what's breaking in your swing
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.nextBtn, { backgroundColor: '#22c55e' }]}
                  onPress={() => router.replace('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="play-circle" size={18} color="#fff" />
                  <Text style={styles.nextBtnText}>Take Mechanical Diagnostic</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backToVaultBtn}
                  onPress={() => router.back()}
                  activeOpacity={0.75}
                >
                  <Text style={styles.backToVaultText}>Back to Vault</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.retakeBtn, { borderColor: ACCENT }]}
              onPress={retake}
              activeOpacity={0.75}
            >
              <Ionicons name="refresh" size={15} color={ACCENT} />
              <Text style={[styles.retakeBtnText, { color: ACCENT }]}>Retake</Text>
            </TouchableOpacity>
          </>
        )}
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
  eyebrow: { fontSize: 10, fontWeight: '800', color: ACCENT, letterSpacing: 1.5 },
  title: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  progressBadge: {
    backgroundColor: ACCENT + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  progressBadgeText: { fontSize: 12, fontWeight: '800', color: ACCENT },
  content: { padding: 16, gap: 12, paddingBottom: 48 },

  introCard: {
    alignItems: 'center', gap: 12, padding: 24,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: ACCENT + '30', borderRadius: radius.lg,
  },
  introIconWrap: {
    width: 72, height: 72, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  introTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  introDesc: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 21 },
  introPhilosophy: {
    fontSize: 16, fontWeight: '900', color: ACCENT, textAlign: 'center',
    fontStyle: 'italic', lineHeight: 24,
  },

  sectionLabel: { fontSize: 10, fontWeight: '900', color: ACCENT, letterSpacing: 1.5, marginTop: 4 },
  typePreview: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  typeDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  typeName: { fontSize: 14, fontWeight: '800' },
  typeTagline: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg,
  },
  startBtnTitle: { fontSize: 15, fontWeight: '900', color: '#fff' },
  startBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  noteCard: {
    flexDirection: 'row', gap: 10, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.md,
  },
  noteText: { flex: 1, fontSize: 13, color: colors.textMuted, lineHeight: 19 },

  /* Quiz */
  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  sectionBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  sectionBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  questionNum: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 2 },
  questionText: { fontSize: 20, fontWeight: '900', color: colors.textPrimary, lineHeight: 28 },
  optionsList: { gap: 10, marginTop: 4 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.lg,
  },
  optionLetter: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  optionLetterText: { fontSize: 13, fontWeight: '900' },
  optionText: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary, lineHeight: 22 },

  /* Results */
  resultsEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 2, textAlign: 'center', color: ACCENT },
  summaryCard: {
    alignItems: 'center', gap: 10, padding: 20,
    backgroundColor: colors.surface, borderWidth: 2, borderColor: ACCENT + '30', borderRadius: radius.lg,
  },
  summaryLabel: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  summaryDesc: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  resultSection: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 10,
  },
  resultBadge: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  resultBadgeText: { fontSize: 16, fontWeight: '900' },
  resultDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  subLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginTop: 6 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  bulletText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  cueCard: {
    flexDirection: 'row', gap: 10, padding: 10, borderWidth: 1, borderRadius: radius.md,
    alignItems: 'center',
  },
  cueText: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary, lineHeight: 18 },

  mlbExampleNote: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },
  mlbRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mlbDot: { width: 7, height: 7, borderRadius: 4 },
  mlbName: { fontSize: 14, fontWeight: '800' },

  teachingCard: {
    flexDirection: 'row', gap: 12, padding: 16,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.lg, alignItems: 'flex-start',
  },
  teachingText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  nextCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, backgroundColor: '#22c55e10',
    borderWidth: 1, borderColor: '#22c55e30', borderRadius: radius.md, marginTop: 4,
  },
  nextTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  nextSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: radius.md,
  },
  nextBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  backToVaultBtn: { alignItems: 'center', paddingVertical: 12 },
  backToVaultText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  retakeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderWidth: 1.5, borderRadius: radius.md,
  },
  retakeBtnText: { fontSize: 13, fontWeight: '800' },
});

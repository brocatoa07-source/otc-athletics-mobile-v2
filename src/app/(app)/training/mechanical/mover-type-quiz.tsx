import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
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
  MOVER_TYPE_QUESTIONS,
  MOVER_TYPES,
  scoreMoverTypeQuiz,
  type MoverTypeData,
  type MoverDiagnosticResult,
  type OptionLetter,
} from '@/data/hitting-mover-type-data';
import { getMlbComparisons, type MlbComparison } from '@/data/mover-mlb-comparisons';

const STORAGE_KEY = 'otc:mover-type';
const ACCENT = '#E10600';

type Screen = 'intro' | 'quiz' | 'results';

const MOVER_LIST = Object.values(MOVER_TYPES);

export default function MoverTypeQuizScreen() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<OptionLetter[]>([]);
  const [result, setResult] = useState<MoverDiagnosticResult | null>(null);
  const [mechAlreadyDone, setMechAlreadyDone] = useState(false);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    AsyncStorage.getItem('otc:mechanical-diagnostic').then((val) => {
      setMechAlreadyDone(val !== null);
    });
  }, []);

  const primaryData: MoverTypeData | null = result ? MOVER_TYPES[result.primary] : null;
  const secondaryData: MoverTypeData | null = result ? MOVER_TYPES[result.secondary] : null;

  async function handleAnswer(letter: OptionLetter) {
    const next = [...answers, letter];
    setAnswers(next);

    if (next.length >= MOVER_TYPE_QUESTIONS.length) {
      const scored = scoreMoverTypeQuiz(next);
      setResult(scored);
      setScreen('results');

      // Persist full result (primary + secondary)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scored));

      const liveUser = await getLiveUser();
      const resolvedId = liveUser?.id ?? user?.id;
      if (resolvedId) {
        try {
          await submitDiagnostic(supabase, {
            userId: resolvedId,
            vaultType: 'hitting',
            diagnosticType: 'mover-type',
            resultPayload: { primary: scored.primary, secondary: scored.secondary },
          });
        } catch (err) {
          if (__DEV__) console.warn('[hitting-quiz] submitDiagnostic error:', err);
        }
        queryClient.invalidateQueries({ queryKey: ['gate-state', resolvedId] });
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
    AsyncStorage.removeItem(STORAGE_KEY);
    startQuiz();
  }

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
          <Text style={styles.title}>Hitter Mover Diagnostic</Text>
        </View>
        {screen === 'quiz' && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>
              {currentQ + 1} / {MOVER_TYPE_QUESTIONS.length}
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
              <Text style={styles.introTitle}>Find Your Movement Pattern</Text>
              <Text style={styles.introDesc}>
                15 questions · 6 choices each{'\n'}Identify how your body naturally creates power.
              </Text>
            </View>

            <Text style={styles.sectionLabel}>6 MOVER TYPES</Text>

            {MOVER_LIST.map((mt) => (
              <View key={mt.slug} style={styles.typePreview}>
                <View style={[styles.typeDot, { backgroundColor: mt.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.typeName, { color: mt.color }]}>{mt.name}</Text>
                  <Text style={styles.typeTagline}>{mt.tagline}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: ACCENT }]}
              onPress={startQuiz}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle" size={20} color="#fff" />
              <View style={{ flex: 1 }}>
                <Text style={styles.startBtnTitle}>Start Diagnostic</Text>
                <Text style={styles.startBtnSub}>15 questions — under 3 minutes</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>

            <View style={styles.noteCard}>
              <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
              <Text style={styles.noteText}>
                Pick what feels most true. There are no wrong answers — just honest ones.
              </Text>
            </View>
          </>
        )}

        {/* ═══════ QUIZ ═══════ */}
        {screen === 'quiz' && (
          <>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentQ / MOVER_TYPE_QUESTIONS.length) * 100}%`,
                    backgroundColor: ACCENT,
                  },
                ]}
              />
            </View>

            <Text style={[styles.questionNum, { color: ACCENT }]}>
              QUESTION {currentQ + 1} OF {MOVER_TYPE_QUESTIONS.length}
            </Text>
            <Text style={styles.questionText}>
              {MOVER_TYPE_QUESTIONS[currentQ].q}
            </Text>

            <View style={styles.optionsList}>
              {MOVER_TYPE_QUESTIONS[currentQ].options.map((opt) => (
                <TouchableOpacity
                  key={opt.letter}
                  style={styles.optionBtn}
                  onPress={() => handleAnswer(opt.letter)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionLetter, { backgroundColor: ACCENT + '20' }]}>
                    <Text style={[styles.optionLetterText, { color: ACCENT }]}>
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
        {screen === 'results' && primaryData && secondaryData && (
          <>
            <Text style={[styles.resultsEyebrow, { color: primaryData.color }]}>
              YOUR MOVER TYPE
            </Text>

            {/* Primary result */}
            <View style={[styles.resultCard, { borderColor: primaryData.color + '40' }]}>
              <View style={[styles.resultBadge, { backgroundColor: primaryData.color + '20' }]}>
                <Text style={[styles.resultBadgeText, { color: primaryData.color }]}>
                  {primaryData.name}
                </Text>
              </View>
              <Text style={styles.resultDesc}>{primaryData.description}</Text>
            </View>

            {/* Secondary result */}
            <View style={[styles.secondaryCard, { borderColor: secondaryData.color + '30' }]}>
              <Text style={styles.secondaryLabel}>SECONDARY MOVER</Text>
              <View style={styles.secondaryRow}>
                <View style={[styles.secondaryDot, { backgroundColor: secondaryData.color }]} />
                <Text style={[styles.secondaryName, { color: secondaryData.color }]}>
                  {secondaryData.name}
                </Text>
              </View>
            </View>

            {/* Coaching cues */}
            <Text style={styles.sectionLabel}>PRIMARY COACHING CUES</Text>
            {primaryData.primaryCues.map((cue) => (
              <View key={cue} style={[styles.cueCard, { backgroundColor: primaryData.color + '10', borderColor: primaryData.color + '30' }]}>
                <Ionicons name="mic-outline" size={16} color={primaryData.color} />
                <Text style={styles.cueText}>{cue}</Text>
              </View>
            ))}

            {/* MLB comparisons */}
            <Text style={styles.sectionLabel}>MLB MOVERS LIKE YOU</Text>
            {getMlbComparisons(primaryData.slug).map((comp: MlbComparison) => (
              <View key={comp.name} style={[styles.mlbCard, { borderColor: primaryData.color + '25' }]}>
                <View style={styles.mlbCardHeader}>
                  <View style={[styles.mlbDot, { backgroundColor: primaryData.color }]} />
                  <Text style={[styles.mlbName, { color: primaryData.color }]}>{comp.name}</Text>
                </View>
                <Text style={styles.mlbStudyNote}>{comp.studyNote}</Text>
              </View>
            ))}
            <View style={styles.mlbCaption}>
              <Ionicons name="eye-outline" size={13} color={colors.textMuted} />
              <Text style={styles.mlbCaptionText}>
                Study how these hitters move. Notice rhythm, timing, and how their body works through the swing.
              </Text>
            </View>

            {/* Navigation */}
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
              style={[styles.retakeBtn, { borderColor: primaryData.color }]}
              onPress={retake}
              activeOpacity={0.75}
            >
              <Ionicons name="refresh" size={15} color={primaryData.color} />
              <Text style={[styles.retakeBtnText, { color: primaryData.color }]}>Retake</Text>
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

  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  questionNum: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 6 },
  questionText: { fontSize: 20, fontWeight: '900', color: colors.textPrimary, lineHeight: 28 },
  optionsList: { gap: 8, marginTop: 4 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.lg,
  },
  optionLetter: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  optionLetterText: { fontSize: 13, fontWeight: '900' },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary, lineHeight: 21 },

  resultsEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 2, textAlign: 'center' },
  resultCard: {
    alignItems: 'center', gap: 12, padding: 24,
    backgroundColor: colors.surface, borderWidth: 2, borderRadius: radius.lg,
  },
  resultBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  resultBadgeText: { fontSize: 18, fontWeight: '900' },
  resultDesc: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  secondaryCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.md,
    padding: 14, gap: 6,
  },
  secondaryLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  secondaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  secondaryDot: { width: 8, height: 8, borderRadius: 4 },
  secondaryName: { fontSize: 15, fontWeight: '800' },

  cueCard: {
    flexDirection: 'row', gap: 12, padding: 14, borderWidth: 1, borderRadius: radius.md,
    alignItems: 'center',
  },
  cueText: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary, lineHeight: 20 },

  mlbCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.md,
    padding: 12, gap: 6,
  },
  mlbCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mlbDot: { width: 8, height: 8, borderRadius: 4 },
  mlbName: { fontSize: 15, fontWeight: '800' },
  mlbStudyNote: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, paddingLeft: 16 },
  mlbCaption: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  mlbCaptionText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 17 },
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

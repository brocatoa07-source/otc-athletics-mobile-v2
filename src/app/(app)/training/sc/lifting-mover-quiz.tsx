import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { colors, radius } from '@/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { getLiveUser } from '@/utils/getLiveUser';
import { submitDiagnostic } from '@/lib/gating/diagnosticService';
import {
  LIFTING_MOVER_QUESTIONS,
  LIFTING_MOVER_TYPES,
  scoreLiftingMoverQuiz,
  type LiftingMoverTypeData,
} from '@/data/lifting-mover-type-data';

const STORAGE_KEY = 'otc:lifting-mover-type';
const ACCENT = '#1DB954';

type Screen = 'intro' | 'quiz' | 'results';

const MOVER_LIST = Object.values(LIFTING_MOVER_TYPES);

export default function LiftingMoverQuizScreen() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<('a' | 'b' | 'c' | 'd')[]>([]);
  const [result, setResult] = useState<LiftingMoverTypeData | null>(null);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  async function handleAnswer(letter: 'a' | 'b' | 'c' | 'd') {
    const next = [...answers, letter];
    setAnswers(next);

    if (next.length >= LIFTING_MOVER_QUESTIONS.length) {
      const slug = scoreLiftingMoverQuiz(next);

      // Submit to Supabase FIRST — do not show results until backend confirms
      const liveUser = await getLiveUser();
      const resolvedId = liveUser?.id ?? user?.id;
      if (!resolvedId) {
        Alert.alert('Session Error', 'Could not identify your account. Please sign in again.');
        return;
      }

      try {
        await submitDiagnostic(supabase, {
          userId: resolvedId,
          vaultType: 'sc',
          diagnosticType: 'lifting-mover',
          resultPayload: { moverType: slug },
        });

        // Supabase succeeded — now safe to cache locally and show results
        AsyncStorage.setItem(STORAGE_KEY, slug);
        queryClient.invalidateQueries({ queryKey: ['gate-state', resolvedId] });
        setResult(LIFTING_MOVER_TYPES[slug]);
        setScreen('results');
      } catch (err: any) {
        console.error('[sc-quiz] submitDiagnostic FAILED:', err?.message ?? err);
        Alert.alert(
          'Save Error',
          'Your results could not be saved. Please check your connection and try again.',
        );
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>STRENGTH & CONDITIONING</Text>
          <Text style={styles.title}>Find Your Mover Type</Text>
        </View>
        {screen === 'quiz' && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>
              {currentQ + 1} / {LIFTING_MOVER_QUESTIONS.length}
            </Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── INTRO ─────────────────────────────────────── */}
        {screen === 'intro' && (
          <>
            <View style={styles.introCard}>
              <View style={[styles.introIconWrap, { backgroundColor: ACCENT + '15' }]}>
                <Ionicons name="barbell-outline" size={40} color={ACCENT} />
              </View>
              <Text style={styles.introTitle}>How Do You Express Strength?</Text>
              <Text style={styles.introDesc}>
                20 questions · 4 choices each{'\n'}Discover how you naturally generate strength and power in the weight room.
              </Text>
            </View>

            <Text style={styles.sectionLabel}>3 MOVER TYPES</Text>

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
                <Text style={styles.startBtnTitle}>Start Assessment</Text>
                <Text style={styles.startBtnSub}>20 questions — under 4 minutes</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>

            <View style={styles.noteCard}>
              <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
              <Text style={styles.noteText}>
                Answer based on how you naturally train — not how you think you should.
              </Text>
            </View>
          </>
        )}

        {/* ── QUIZ ──────────────────────────────────────── */}
        {screen === 'quiz' && (
          <>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentQ / LIFTING_MOVER_QUESTIONS.length) * 100}%`,
                    backgroundColor: ACCENT,
                  },
                ]}
              />
            </View>

            <Text style={[styles.questionNum, { color: ACCENT }]}>
              QUESTION {currentQ + 1} OF {LIFTING_MOVER_QUESTIONS.length}
            </Text>
            <Text style={styles.questionText}>
              {LIFTING_MOVER_QUESTIONS[currentQ].q}
            </Text>

            <View style={styles.optionsList}>
              {LIFTING_MOVER_QUESTIONS[currentQ].options.map((opt) => (
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

        {/* ── RESULTS ───────────────────────────────────── */}
        {screen === 'results' && result && (
          <>
            <Text style={[styles.resultsEyebrow, { color: result.color }]}>
              YOUR LIFTING MOVER TYPE
            </Text>

            <View style={[styles.resultCard, { borderColor: result.color + '40' }]}>
              <View style={[styles.resultBadge, { backgroundColor: result.color + '20' }]}>
                <Text style={[styles.resultBadgeText, { color: result.color }]}>
                  {result.name}
                </Text>
              </View>
              <Text style={styles.resultDesc}>{result.description}</Text>
            </View>

            <View style={[styles.cueCard, { backgroundColor: result.color + '10', borderColor: result.color + '30' }]}>
              <Ionicons name="mic-outline" size={16} color={result.color} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.cueLabel, { color: result.color }]}>PRIMARY CUE</Text>
                <Text style={styles.cueText}>{result.primaryCue}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>TRAINING FOCUS</Text>
            <View style={styles.focusList}>
              {result.trainingFocus.map((item) => (
                <View key={item} style={[styles.focusItem, { borderColor: result.color + '30' }]}>
                  <View style={[styles.focusDot, { backgroundColor: result.color }]} />
                  <Text style={styles.focusText}>{item}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: ACCENT }]}
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.doneBtnText}>View My Lifting Path</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.retakeBtn, { borderColor: result.color }]}
              onPress={retake}
              activeOpacity={0.75}
            >
              <Ionicons name="refresh" size={15} color={result.color} />
              <Text style={[styles.retakeBtnText, { color: result.color }]}>Retake</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  eyebrow: {
    fontSize: 10, fontWeight: '800', color: ACCENT, letterSpacing: 1.5,
  },
  title: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  progressBadge: {
    backgroundColor: ACCENT + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  progressBadgeText: { fontSize: 12, fontWeight: '800', color: ACCENT },
  content: { padding: 16, gap: 12, paddingBottom: 48 },

  // Intro
  introCard: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: ACCENT + '30',
    borderRadius: radius.lg,
  },
  introIconWrap: {
    width: 72, height: 72, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  introTitle: {
    fontSize: 20, fontWeight: '900', color: colors.textPrimary, textAlign: 'center',
  },
  introDesc: {
    fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 21,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: '900', color: ACCENT, letterSpacing: 1.5, marginTop: 4,
  },
  typePreview: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  typeDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  typeName: { fontSize: 14, fontWeight: '800' },
  typeTagline: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: radius.lg,
  },
  startBtnTitle: { fontSize: 15, fontWeight: '900', color: '#fff' },
  startBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  noteCard: {
    flexDirection: 'row', gap: 10, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.md,
  },
  noteText: { flex: 1, fontSize: 13, color: colors.textMuted, lineHeight: 19 },

  // Quiz
  progressBar: {
    height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  questionNum: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 6,
  },
  questionText: {
    fontSize: 20, fontWeight: '900', color: colors.textPrimary, lineHeight: 28,
  },
  optionsList: { gap: 8, marginTop: 4 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
  },
  optionLetter: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  optionLetterText: { fontSize: 13, fontWeight: '900' },
  optionText: {
    flex: 1, fontSize: 15, fontWeight: '600',
    color: colors.textPrimary, lineHeight: 21,
  },

  // Results
  resultsEyebrow: {
    fontSize: 11, fontWeight: '900', letterSpacing: 2, textAlign: 'center',
  },
  resultCard: {
    alignItems: 'center', gap: 12, padding: 24,
    backgroundColor: colors.surface, borderWidth: 2, borderRadius: radius.lg,
  },
  resultBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  resultBadgeText: { fontSize: 18, fontWeight: '900' },
  resultDesc: {
    fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22,
  },
  cueCard: {
    flexDirection: 'row', gap: 12, padding: 14,
    borderWidth: 1, borderRadius: radius.md,
  },
  cueLabel: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginBottom: 3,
  },
  cueText: {
    fontSize: 14, fontWeight: '700', color: colors.textPrimary, lineHeight: 20,
  },

  // Training focus list
  focusList: { gap: 8 },
  focusItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderRadius: radius.md,
  },
  focusDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  focusText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  // Actions
  doneBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: radius.md, marginTop: 4,
  },
  doneBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  retakeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderWidth: 1.5, borderRadius: radius.md,
  },
  retakeBtnText: { fontSize: 13, fontWeight: '800' },
});

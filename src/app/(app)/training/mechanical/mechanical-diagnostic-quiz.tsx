import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { getLiveUser } from '@/utils/getLiveUser';
import { submitDiagnostic } from '@/lib/gating/diagnosticService';
import { colors, radius } from '@/theme';
import {
  MECHANICAL_QUESTIONS,
  MECHANICAL_ISSUES,
  scoreMechanicalDiagnostic,
  type MechanicalIssue,
  type MechanicalDiagnosticResult,
} from '@/data/hitting-mechanical-diagnostic-data';

const STORAGE_KEY = 'otc:mechanical-diagnostic';
const ACCENT = '#E10600';

type Screen = 'intro' | 'quiz' | 'results';

const ISSUE_LIST = Object.values(MECHANICAL_ISSUES);

export default function MechanicalDiagnosticScreen() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<('a' | 'b' | 'c' | 'd')[]>([]);
  const [result, setResult] = useState<MechanicalDiagnosticResult | null>(null);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  async function handleAnswer(letter: 'a' | 'b' | 'c' | 'd') {
    const next = [...answers, letter];
    setAnswers(next);

    if (next.length >= MECHANICAL_QUESTIONS.length) {
      const res = scoreMechanicalDiagnostic(next);

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
          vaultType: 'hitting',
          diagnosticType: 'mechanical',
          resultPayload: { primary: res.primary, secondary: res.secondary },
        });

        // Supabase succeeded — now safe to cache locally and show results
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(res));
        queryClient.invalidateQueries({ queryKey: ['gate-state', resolvedId] });
        setResult(res);
        setScreen('results');
      } catch (err: any) {
        console.error('[mechanical-quiz] submitDiagnostic FAILED:', err?.message ?? err);
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

  const primaryIssue = result ? MECHANICAL_ISSUES[result.primary] : null;
  const secondaryIssue = result ? MECHANICAL_ISSUES[result.secondary] : null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (screen === 'quiz' ? retake() : router.back())}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>HITTING VAULT</Text>
          <Text style={styles.title}>Mechanical Diagnostic</Text>
        </View>
        {screen === 'quiz' && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>
              {currentQ + 1} / {MECHANICAL_QUESTIONS.length}
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
                <Ionicons name="analytics-outline" size={40} color={ACCENT} />
              </View>
              <Text style={styles.introTitle}>Find What's Breaking</Text>
              <Text style={styles.introDesc}>
                10 questions · 4 choices each{'\n'}Identify your primary and secondary swing issues. Drill assignments follow.
              </Text>
            </View>

            <Text style={styles.sectionLabel}>6 ISSUE AREAS</Text>

            {ISSUE_LIST.map((issue) => (
              <View key={issue.slug} style={styles.issuePreview}>
                <View style={[styles.issueDot, { backgroundColor: issue.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.issueName, { color: issue.color }]}>{issue.label}</Text>
                  <Text style={styles.issueDesc} numberOfLines={1}>{issue.description}</Text>
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
                <Text style={styles.startBtnSub}>10 questions — under 3 minutes</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>

            <View style={styles.noteCard}>
              <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
              <Text style={styles.noteText}>
                Answer based on what you actually experience, not what you think you should.
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
                    width: `${(currentQ / MECHANICAL_QUESTIONS.length) * 100}%`,
                    backgroundColor: ACCENT,
                  },
                ]}
              />
            </View>

            <Text style={[styles.questionNum, { color: ACCENT }]}>
              QUESTION {currentQ + 1} OF {MECHANICAL_QUESTIONS.length}
            </Text>
            <Text style={styles.questionText}>
              {MECHANICAL_QUESTIONS[currentQ].q}
            </Text>

            <View style={styles.optionsList}>
              {MECHANICAL_QUESTIONS[currentQ].options.map((opt) => (
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
        {screen === 'results' && result && primaryIssue && secondaryIssue && (
          <>
            <Text style={styles.resultsEyebrow}>YOUR SWING DIAGNOSTIC</Text>

            {/* Primary Issue */}
            <View style={[styles.issueCard, { borderColor: primaryIssue.color + '50' }]}>
              <View style={styles.issueCardHeader}>
                <View style={[styles.issueBadge, { backgroundColor: primaryIssue.color + '20' }]}>
                  <Text style={[styles.issueBadgeLabel, { color: primaryIssue.color }]}>
                    PRIMARY ISSUE
                  </Text>
                  <Text style={[styles.issueBadgeName, { color: primaryIssue.color }]}>
                    {primaryIssue.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.issueCardDesc}>{primaryIssue.description}</Text>

              <View style={[styles.cuePill, { backgroundColor: primaryIssue.color + '12', borderColor: primaryIssue.color + '30' }]}>
                <Ionicons name="mic-outline" size={13} color={primaryIssue.color} />
                <Text style={[styles.cuePillText, { color: primaryIssue.color }]}>
                  {primaryIssue.cue}
                </Text>
              </View>

              <Text style={[styles.drillsLabel, { color: primaryIssue.color }]}>DRILL STACK</Text>
              <View style={styles.drillsList}>
                {primaryIssue.drills.map((drill, i) => (
                  <View key={i} style={styles.drillRow}>
                    <View style={[styles.drillDot, { backgroundColor: primaryIssue.color }]} />
                    <Text style={styles.drillText}>{drill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Secondary Issue */}
            <View style={[styles.issueCard, styles.secondaryCard, { borderColor: secondaryIssue.color + '40' }]}>
              <View style={styles.issueCardHeader}>
                <View style={[styles.issueBadge, { backgroundColor: secondaryIssue.color + '15' }]}>
                  <Text style={[styles.issueBadgeLabel, { color: secondaryIssue.color }]}>
                    SECONDARY ISSUE
                  </Text>
                  <Text style={[styles.issueBadgeName, { color: secondaryIssue.color }]}>
                    {secondaryIssue.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.issueCardDesc}>{secondaryIssue.description}</Text>

              <View style={[styles.cuePill, { backgroundColor: secondaryIssue.color + '10', borderColor: secondaryIssue.color + '25' }]}>
                <Ionicons name="mic-outline" size={13} color={secondaryIssue.color} />
                <Text style={[styles.cuePillText, { color: secondaryIssue.color }]}>
                  {secondaryIssue.cue}
                </Text>
              </View>

              <Text style={[styles.drillsLabel, { color: secondaryIssue.color }]}>DRILL STACK</Text>
              <View style={styles.drillsList}>
                {secondaryIssue.drills.map((drill, i) => (
                  <View key={i} style={styles.drillRow}>
                    <View style={[styles.drillDot, { backgroundColor: secondaryIssue.color }]} />
                    <Text style={styles.drillText}>{drill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.enterBtn, { backgroundColor: ACCENT }]}
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-forward-circle" size={18} color="#fff" />
              <Text style={styles.enterBtnText}>Back to Hitting Vault</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.retakeBtn, { borderColor: colors.border }]}
              onPress={retake}
              activeOpacity={0.75}
            >
              <Ionicons name="refresh" size={14} color={colors.textMuted} />
              <Text style={styles.retakeBtnText}>Retake Diagnostic</Text>
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

  // Intro
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
  introDesc: {
    fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 21,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: '900', color: ACCENT, letterSpacing: 1.5, marginTop: 4,
  },
  issuePreview: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.md,
  },
  issueDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  issueName: { fontSize: 13, fontWeight: '800' },
  issueDesc: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg,
  },
  startBtnTitle: { fontSize: 15, fontWeight: '900', color: '#fff' },
  startBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  noteCard: {
    flexDirection: 'row', gap: 10, padding: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  noteText: { flex: 1, fontSize: 13, color: colors.textMuted, lineHeight: 19 },

  // Quiz
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

  // Results
  resultsEyebrow: {
    fontSize: 11, fontWeight: '900', letterSpacing: 2, color: colors.textMuted,
    textAlign: 'center',
  },
  issueCard: {
    backgroundColor: colors.surface, borderWidth: 2,
    borderRadius: radius.lg, padding: 16, gap: 12,
  },
  secondaryCard: { opacity: 0.92 },
  issueCardHeader: { alignItems: 'flex-start' },
  issueBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full, gap: 2 },
  issueBadgeLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  issueBadgeName: { fontSize: 18, fontWeight: '900' },
  issueCardDesc: {
    fontSize: 13, color: colors.textSecondary, lineHeight: 20,
  },
  cuePill: {
    flexDirection: 'row', gap: 8, padding: 10,
    borderWidth: 1, borderRadius: radius.md, alignItems: 'flex-start',
  },
  cuePillText: { flex: 1, fontSize: 13, fontWeight: '700', lineHeight: 19 },
  drillsLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  drillsList: { gap: 6 },
  drillRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 10, backgroundColor: colors.surfaceElevated,
    borderRadius: radius.sm,
  },
  drillDot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  drillText: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  enterBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: radius.md, marginTop: 4,
  },
  enterBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  retakeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderWidth: 1, borderRadius: radius.md,
  },
  retakeBtnText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
});

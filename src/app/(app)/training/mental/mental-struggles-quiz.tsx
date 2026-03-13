import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import {
  MENTAL_STRUGGLE_QUESTIONS,
  MENTAL_STRUGGLES,
  scoreMentalStruggles,
  type MentalDiagnosticResult,
} from '@/data/mental-struggles-data';

type Screen = 'intro' | 'quiz' | 'result';

const ACCENT = '#8b5cf6';

export default function MentalStrugglesQuizScreen() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<('a' | 'b' | 'c' | 'd')[]>([]);
  const [result, setResult] = useState<MentalDiagnosticResult | null>(null);

  const handleAnswer = (letter: 'a' | 'b' | 'c' | 'd') => {
    const newAnswers = [...answers, letter];
    setAnswers(newAnswers);

    if (currentQ < MENTAL_STRUGGLE_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ((q) => q + 1), 300);
    } else {
      const scored = scoreMentalStruggles(newAnswers);
      setResult(scored);
      AsyncStorage.setItem('otc:mental-struggles', JSON.stringify(scored));
      setTimeout(() => setScreen('result'), 300);
    }
  };

  const handleRetake = () => {
    setScreen('intro');
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  // ── Intro ──────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>MENTAL DIAGNOSTIC</Text>
            <Text style={styles.headerTitle}>Mental Struggles Assessment</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.introCard}>
            <View style={[styles.introIcon, { backgroundColor: ACCENT + '18' }]}>
              <Ionicons name="fitness-outline" size={32} color={ACCENT} />
            </View>
            <Text style={styles.introTitle}>Identify Your Mental Challenges</Text>
            <Text style={styles.introDesc}>
              Answer 10 questions honestly. We'll identify your primary and secondary
              mental struggles so we can build your personalized training plan.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: ACCENT }]}
            onPress={() => setScreen('quiz')}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={styles.startBtnText}>Start Assessment</Text>
          </TouchableOpacity>

          <Text style={styles.infoNote}>
            Takes about 3 minutes. Be honest — there are no wrong answers.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Quiz ──────────────────────────────────────────
  if (screen === 'quiz') {
    const question = MENTAL_STRUGGLE_QUESTIONS[currentQ];
    const progress = (currentQ + 1) / MENTAL_STRUGGLE_QUESTIONS.length;

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: ACCENT }]} />
            </View>
          </View>
          <Text style={styles.qCount}>{currentQ + 1}/{MENTAL_STRUGGLE_QUESTIONS.length}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.quizContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionText}>{question.q}</Text>

          {question.options.map((opt) => (
            <TouchableOpacity
              key={opt.letter}
              style={styles.optionBtn}
              onPress={() => handleAnswer(opt.letter)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionCircle, { borderColor: ACCENT }]}>
                <Text style={[styles.optionLetter, { color: ACCENT }]}>{opt.letter.toUpperCase()}</Text>
              </View>
              <Text style={styles.optionText}>{opt.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Result ────────────────────────────────────────
  if (!result) return null;

  const primaryData = MENTAL_STRUGGLES[result.primary];
  const secondaryData = MENTAL_STRUGGLES[result.secondary];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>YOUR RESULTS</Text>
          <Text style={styles.headerTitle}>Mental Assessment</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Primary Issue */}
        <Text style={styles.sectionLabel}>PRIMARY STRUGGLE</Text>
        <View style={[styles.issueCard, { borderColor: primaryData.color + '30' }]}>
          <View style={[styles.issueBadge, { backgroundColor: primaryData.color }]}>
            <Text style={styles.issueBadgeText}>{primaryData.label}</Text>
          </View>
          <Text style={styles.issueDesc}>{primaryData.description}</Text>
          <View style={[styles.cueBadge, { backgroundColor: primaryData.color + '10' }]}>
            <Ionicons name="bulb-outline" size={14} color={primaryData.color} />
            <Text style={[styles.cueText, { color: primaryData.color }]}>{primaryData.cue}</Text>
          </View>
        </View>

        {/* Secondary Issue */}
        <Text style={styles.sectionLabel}>SECONDARY STRUGGLE</Text>
        <View style={[styles.issueCard, { borderColor: secondaryData.color + '30' }]}>
          <View style={[styles.issueBadge, { backgroundColor: secondaryData.color }]}>
            <Text style={styles.issueBadgeText}>{secondaryData.label}</Text>
          </View>
          <Text style={styles.issueDesc}>{secondaryData.description}</Text>
          <View style={[styles.cueBadge, { backgroundColor: secondaryData.color + '10' }]}>
            <Ionicons name="bulb-outline" size={14} color={secondaryData.color} />
            <Text style={[styles.cueText, { color: secondaryData.color }]}>{secondaryData.cue}</Text>
          </View>
        </View>

        {/* Focus Areas */}
        <Text style={styles.sectionLabel}>YOUR FOCUS AREAS</Text>
        <View style={styles.areasRow}>
          {[...new Set([...primaryData.areas, ...secondaryData.areas])].map((area) => (
            <View key={area} style={styles.areaChip}>
              <Text style={styles.areaChipText}>{area}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: ACCENT }]}
          onPress={() => router.replace('/(app)/training/mental' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>Go to Mental Vault</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={handleRetake}
          activeOpacity={0.7}
        >
          <Text style={styles.retakeBtnText}>Retake Assessment</Text>
        </TouchableOpacity>
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

  content: { padding: 16, paddingBottom: 60, gap: 12 },
  quizContent: { padding: 16, paddingBottom: 60, gap: 14 },

  introCard: {
    alignItems: 'center', gap: 12, padding: 24,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg,
  },
  introIcon: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  introTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  introDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, textAlign: 'center' },

  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg,
  },
  startBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
  infoNote: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },

  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  qCount: { fontSize: 12, fontWeight: '800', color: colors.textMuted },

  questionText: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, lineHeight: 26, marginBottom: 4 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16,
  },
  optionCircle: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  optionLetter: { fontSize: 14, fontWeight: '900' },
  optionText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 4 },
  issueCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 10,
  },
  issueBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  issueBadgeText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  issueDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  cueBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: radius.md, padding: 10,
  },
  cueText: { flex: 1, fontSize: 13, fontWeight: '700', fontStyle: 'italic' },

  areasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: {
    backgroundColor: ACCENT + '15', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 6,
  },
  areaChipText: { fontSize: 12, fontWeight: '800', color: ACCENT },

  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, marginTop: 8,
  },
  nextBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  retakeBtn: { alignItems: 'center', paddingVertical: 12 },
  retakeBtnText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
});

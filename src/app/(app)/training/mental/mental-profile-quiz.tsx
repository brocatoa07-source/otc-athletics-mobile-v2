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
  MENTAL_PROFILE_QUESTIONS,
  MENTAL_PROFILES,
  scoreMentalProfileQuiz,
  type MentalProfileData,
} from '@/data/mental-profile-data';

type Screen = 'intro' | 'quiz' | 'result';

const ACCENT = '#8b5cf6';

export default function MentalProfileQuizScreen() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<('a' | 'b' | 'c' | 'd')[]>([]);
  const [result, setResult] = useState<MentalProfileData | null>(null);

  const handleAnswer = (letter: 'a' | 'b' | 'c' | 'd') => {
    const newAnswers = [...answers, letter];
    setAnswers(newAnswers);

    if (currentQ < MENTAL_PROFILE_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ((q) => q + 1), 300);
    } else {
      const slug = scoreMentalProfileQuiz(newAnswers);
      const profileData = MENTAL_PROFILES[slug];
      setResult(profileData);
      AsyncStorage.setItem('otc:mental-profile', JSON.stringify({ slug }));
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
            <Text style={styles.headerSup}>MENTAL PROFILE</Text>
            <Text style={styles.headerTitle}>Mental Profile Quiz</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.introCard}>
            <View style={[styles.introIcon, { backgroundColor: ACCENT + '18' }]}>
              <Ionicons name="bulb-outline" size={32} color={ACCENT} />
            </View>
            <Text style={styles.introTitle}>Discover Your Mental Profile</Text>
            <Text style={styles.introDesc}>
              Answer 8 questions to find out how you naturally compete under pressure.
              Your profile helps personalize your mental training plan.
            </Text>
          </View>

          <View style={styles.profilePreview}>
            <Text style={styles.previewLabel}>POSSIBLE PROFILES</Text>
            {Object.values(MENTAL_PROFILES).map((p) => (
              <View key={p.slug} style={styles.previewRow}>
                <View style={[styles.previewDot, { backgroundColor: p.color }]} />
                <Text style={styles.previewName}>{p.name}</Text>
                <Text style={styles.previewTag}>{p.tagline}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: ACCENT }]}
            onPress={() => setScreen('quiz')}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={styles.startBtnText}>Start Quiz</Text>
          </TouchableOpacity>

          <Text style={styles.infoNote}>
            Takes about 2 minutes. You can retake anytime.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Quiz ──────────────────────────────────────────
  if (screen === 'quiz') {
    const question = MENTAL_PROFILE_QUESTIONS[currentQ];
    const progress = (currentQ + 1) / MENTAL_PROFILE_QUESTIONS.length;

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
          <Text style={styles.qCount}>{currentQ + 1}/{MENTAL_PROFILE_QUESTIONS.length}</Text>
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>YOUR RESULT</Text>
          <Text style={styles.headerTitle}>Mental Profile</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.resultEyebrow, { color: result.color }]}>
          YOU ARE
        </Text>

        <View style={[styles.resultCard, { borderColor: result.color + '30' }]}>
          <View style={[styles.resultBadge, { backgroundColor: result.color }]}>
            <Text style={styles.resultBadgeText}>{result.name}</Text>
          </View>
          <Text style={styles.resultTagline}>{result.tagline}</Text>
          <Text style={styles.resultDesc}>{result.description}</Text>
        </View>

        {/* Cue Card */}
        <View style={[styles.cueCard, { backgroundColor: result.color + '10', borderColor: result.color + '25' }]}>
          <Ionicons name="bulb-outline" size={18} color={result.color} />
          <Text style={[styles.cueText, { color: result.color }]}>
            {result.primaryCue}
          </Text>
        </View>

        {/* Strengths */}
        <View style={styles.traitCard}>
          <Text style={styles.traitLabel}>STRENGTHS</Text>
          {result.strengths.map((s) => (
            <View key={s} style={styles.traitRow}>
              <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              <Text style={styles.traitText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Watch For */}
        <View style={[styles.traitCard, { borderColor: '#f59e0b30' }]}>
          <Text style={styles.traitLabel}>WATCH FOR</Text>
          <View style={styles.traitRow}>
            <Ionicons name="alert-circle" size={16} color="#f59e0b" />
            <Text style={styles.traitText}>{result.watchFor}</Text>
          </View>
        </View>

        {/* Next Steps */}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: ACCENT }]}
          onPress={() => router.replace('/(app)/training/mental/mental-struggles-quiz' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>Take Mental Struggles Assessment</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={handleRetake}
          activeOpacity={0.7}
        >
          <Text style={styles.retakeBtnText}>Retake Quiz</Text>
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

  profilePreview: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  previewLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewDot: { width: 8, height: 8, borderRadius: 4 },
  previewName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  previewTag: { fontSize: 12, color: colors.textMuted, flex: 1, textAlign: 'right' },

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

  resultEyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginTop: 8 },
  resultCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 20, alignItems: 'center', gap: 10,
  },
  resultBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  resultBadgeText: { fontSize: 18, fontWeight: '900', color: '#fff' },
  resultTagline: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  resultDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, textAlign: 'center' },

  cueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: radius.md, padding: 14,
  },
  cueText: { flex: 1, fontSize: 14, fontWeight: '700', fontStyle: 'italic' },

  traitCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 8,
  },
  traitLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  traitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  traitText: { flex: 1, fontSize: 13, color: colors.textPrimary },

  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, marginTop: 4,
  },
  nextBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  retakeBtn: { alignItems: 'center', paddingVertical: 12 },
  retakeBtnText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
});

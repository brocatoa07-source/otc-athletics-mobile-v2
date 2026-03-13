import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getLiveUser } from '@/utils/getLiveUser';
import { submitDiagnostic } from '@/lib/gating/diagnosticService';
import { colors, accents, radius } from '@/theme';
import {
  QUESTIONS_BY_TYPE,
  DIAGNOSTIC_META,
  LIKERT_LABELS,
} from '@/data/mental-diagnostics-data';
import type { DiagnosticType } from '@/data/mental-diagnostics-data';
import { scoreByType } from '@/utils/mentalDiagnosticScoring';

const ACCENT = accents.mental;

const LIKERT_OPTIONS = [1, 2, 3, 4, 5] as const;

export default function DiagnosticQuizScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const diagType = type as DiagnosticType;
  const questions = QUESTIONS_BY_TYPE[diagType] ?? [];
  const meta = DIAGNOSTIC_META[diagType];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[currentIdx];
  const totalQ = questions.length;
  const progressPct = ((currentIdx + 1) / totalQ) * 100;

  const submitQuiz = useCallback(
    async (finalAnswers: Record<string, number>) => {
      const liveUser = await getLiveUser();
      if (!liveUser) {
        Alert.alert('Session Expired', 'Please sign in again to continue.');
        return;
      }
      const resolvedId = liveUser.id;
      setSubmitting(true);

      try {
        // 1. Score answers
        const orderedValues = questions.map((q) => finalAnswers[q.id] ?? 3);
        const result = scoreByType(diagType, orderedValues);

        // 2. Record diagnostic submission (single source of truth for gating)
        //    Store full scored result so profile generation can read it back
        await submitDiagnostic(supabase, {
          userId: resolvedId,
          vaultType: 'mental',
          diagnosticType: diagType,
          resultPayload: {
            answersCount: Object.keys(finalAnswers).length,
            answers: orderedValues,
            scored: result as unknown as Record<string, unknown>,
          },
        });

        queryClient.invalidateQueries({ queryKey: ['gate-state', resolvedId] });

        router.replace({
          pathname: '/(app)/training/mental/diagnostics/results' as any,
          params: { type: diagType, result: JSON.stringify(result) },
        });
      } catch (err: any) {
        Alert.alert('Error', err?.message || 'Could not save your responses. Please try again.');
        setSubmitting(false);
      }
    },
    [diagType, questions, queryClient]
  );

  const handleSelect = useCallback(
    (value: number) => {
      if (submitting) return;
      setPendingValue(value);

      if (advanceTimer.current) clearTimeout(advanceTimer.current);

      advanceTimer.current = setTimeout(() => {
        const newAnswers = { ...answers, [question.id]: value };

        if (currentIdx < totalQ - 1) {
          setAnswers(newAnswers);
          setCurrentIdx((i) => i + 1);
          setPendingValue(newAnswers[questions[currentIdx + 1]?.id] ?? null);
        } else {
          submitQuiz(newAnswers);
        }
      }, 380);
    },
    [submitting, answers, question, currentIdx, totalQ, questions, submitQuiz]
  );

  const handleBack = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (currentIdx > 0) {
      const prevQ = questions[currentIdx - 1];
      setCurrentIdx((i) => i - 1);
      setPendingValue(answers[prevQ.id] ?? null);
    } else {
      Alert.alert(
        'Exit Diagnostic?',
        'Your progress for this diagnostic will be lost.',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: () => router.replace('/(app)/training/mental/diagnostics/entry' as any),
          },
        ]
      );
    }
  }, [currentIdx, questions, answers]);

  if (!question) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} disabled={submitting}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.diagLabel, { color: ACCENT }]}>{meta?.label}</Text>
          <Text style={styles.questionCounter}>
            Question {currentIdx + 1} of {totalQ}
          </Text>
        </View>
        {submitting && <ActivityIndicator size="small" color={ACCENT} />}
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` as any, backgroundColor: ACCENT }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.questionWrap}>
          <Text style={styles.questionText}>{question.prompt}</Text>
        </View>

        <View style={styles.optionsWrap}>
          {LIKERT_OPTIONS.map((val) => {
            const isSelected = pendingValue === val;
            const wasPrev = !pendingValue && answers[question.id] === val;
            const highlighted = isSelected || wasPrev;
            return (
              <TouchableOpacity
                key={val}
                style={[
                  styles.option,
                  highlighted && {
                    backgroundColor: ACCENT + '18',
                    borderColor: ACCENT + '70',
                  },
                ]}
                onPress={() => handleSelect(val)}
                activeOpacity={0.75}
                disabled={submitting}
              >
                <View
                  style={[
                    styles.optionBullet,
                    highlighted && { backgroundColor: ACCENT, borderColor: ACCENT },
                  ]}
                >
                  {highlighted && (
                    <Ionicons name="checkmark" size={11} color={colors.black} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    highlighted && { color: ACCENT, fontWeight: '800' },
                  ]}
                >
                  {LIKERT_LABELS[val]}
                </Text>
                <Text style={[styles.optionValue, highlighted && { color: ACCENT }]}>
                  {val}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.scaleHint}>1 = Never  ·  5 = Always</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  diagLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  questionCounter: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginTop: 1 },

  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    minWidth: 8,
  },

  content: { padding: 24, gap: 24, paddingBottom: 60 },

  questionWrap: {
    paddingTop: 12,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
  },

  optionsWrap: { gap: 10 },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },

  scaleHint: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

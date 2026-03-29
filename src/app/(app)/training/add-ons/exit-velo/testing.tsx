/**
 * Exit Velocity Program — Testing Protocol & Results
 *
 * Test every 4 weeks: Weeks 1, 4, 8, 12.
 * Log EV for game bat, overload, and underload rounds.
 * View progress comparison across test sessions.
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { TEST_SESSIONS } from '@/data/exit-velo-program/product';
import {
  loadProgress, saveTestResult, getProgressSummary,
  type ProgramProgress, type EVTestResult,
} from '@/data/exit-velo-program/progress';

const ACCENT = '#E10600';

const BAT_LABELS: Record<string, { label: string; color: string }> = {
  game: { label: 'Game Bat', color: '#3b82f6' },
  overload: { label: 'Overload', color: '#ef4444' },
  underload: { label: 'Underload', color: '#22c55e' },
};

export default function TestingScreen() {
  const [progress, setProgress] = useState<ProgramProgress | null>(null);
  const [inputMode, setInputMode] = useState<{
    weekNumber: number;
    batType: 'game' | 'overload' | 'underload';
  } | null>(null);
  const [velocities, setVelocities] = useState<string[]>(['', '', '', '', '']);

  useFocusEffect(
    useCallback(() => {
      loadProgress().then(setProgress);
    }, []),
  );

  if (!progress) return null;

  const summary = getProgressSummary(progress);

  function handleSave() {
    if (!inputMode) return;
    const nums = velocities.map((v) => Number(v)).filter((n) => n > 0);
    if (nums.length === 0) {
      Alert.alert('Enter at least one velocity reading');
      return;
    }
    const result: EVTestResult = {
      id: `${inputMode.weekNumber}-${inputMode.batType}-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      weekNumber: inputMode.weekNumber,
      batType: inputMode.batType,
      velocities: nums,
      maxEV: Math.max(...nums),
      avgEV: Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10,
      hardHitCount: nums.filter((v) => v >= 85).length,
    };
    saveTestResult(result).then((updated) => {
      setProgress(updated);
      setInputMode(null);
      setVelocities(['', '', '', '', '']);
    });
  }

  // ── Input Mode ──────────────────────────────────────────────────────────

  if (inputMode) {
    const batInfo = BAT_LABELS[inputMode.batType];
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { setInputMode(null); setVelocities(['', '', '', '', '']); }} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>WEEK {inputMode.weekNumber} TEST</Text>
            <Text style={styles.headerTitle}>{batInfo.label} — 5 Swings</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.inputInstructions}>
            Enter the exit velocity (mph) for each swing. Take 5 max-intent swings off the tee.
          </Text>

          {velocities.map((v, i) => (
            <View key={i} style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: batInfo.color }]}>Swing {i + 1}</Text>
              <TextInput
                style={styles.inputField}
                value={v}
                onChangeText={(text) => {
                  const next = [...velocities];
                  next[i] = text;
                  setVelocities(next);
                }}
                placeholder="mph"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                returnKeyType={i < 4 ? 'next' : 'done'}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.saveCta} onPress={handleSave} activeOpacity={0.85}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.saveCtaText}>Save Results</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Results View ────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>EXIT VELOCITY PROGRAM</Text>
          <Text style={styles.headerTitle}>Testing & Progress</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Summary */}
        <View style={styles.summaryCard}>
          <Text style={[styles.sectionLabel, { color: ACCENT }]}>YOUR NUMBERS</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {summary.evPR !== null ? `${summary.evPR}` : '—'}
              </Text>
              <Text style={styles.summaryLabel}>Max EV (mph)</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {summary.bestGameAvg !== null ? `${summary.bestGameAvg}` : '—'}
              </Text>
              <Text style={styles.summaryLabel}>Best Avg EV</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, summary.evGain !== null && summary.evGain > 0 ? { color: '#22c55e' } : {}]}>
                {summary.evGain !== null ? `+${summary.evGain.toFixed(1)}` : '—'}
              </Text>
              <Text style={styles.summaryLabel}>EV Gain</Text>
            </View>
          </View>
        </View>

        {/* Testing Protocol */}
        <View style={styles.protocolCard}>
          <Text style={[styles.sectionLabel, { color: ACCENT }]}>TESTING PROTOCOL</Text>
          <Text style={styles.protocolBody}>
            Test every 4 weeks. Take 5 max-intent swings off the tee with each bat. Track average EV, max EV, and hard-hit percentage.
          </Text>
          <View style={styles.protocolMeta}>
            <Text style={styles.protocolMetaText}>5 swings × 3 bat types = 15 test swings</Text>
          </View>
        </View>

        {/* Test Sessions */}
        <Text style={styles.sectionLabel}>TEST SESSIONS</Text>
        {TEST_SESSIONS.map((session) => {
          const results = progress.testResults.filter((r) => r.weekNumber === session.weekNumber);
          const hasResults = results.length > 0;

          return (
            <View key={session.weekNumber} style={[styles.testCard, hasResults && styles.testCardDone]}>
              <View style={styles.testHeader}>
                <View style={[styles.testWeekBadge, hasResults && { backgroundColor: ACCENT + '15' }]}>
                  <Text style={[styles.testWeekText, hasResults && { color: ACCENT }]}>
                    W{session.weekNumber}
                  </Text>
                </View>
                <Text style={styles.testTitle}>
                  Week {session.weekNumber} Test{hasResults ? ' ✓' : ''}
                </Text>
              </View>

              {/* Show results if logged */}
              {results.map((r) => {
                const info = BAT_LABELS[r.batType];
                return (
                  <View key={r.id} style={styles.resultRow}>
                    <View style={[styles.resultDot, { backgroundColor: info.color }]} />
                    <Text style={styles.resultLabel}>{info.label}</Text>
                    <Text style={styles.resultAvg}>{r.avgEV} avg</Text>
                    <Text style={styles.resultMax}>{r.maxEV} max</Text>
                  </View>
                );
              })}

              {/* Log buttons for each bat type */}
              <View style={styles.logRow}>
                {(['game', 'overload', 'underload'] as const).map((bt) => {
                  const exists = results.some((r) => r.batType === bt);
                  const info = BAT_LABELS[bt];
                  return (
                    <TouchableOpacity
                      key={bt}
                      style={[styles.logBtn, exists && { backgroundColor: info.color + '15', borderColor: info.color + '30' }]}
                      onPress={() => setInputMode({ weekNumber: session.weekNumber, batType: bt })}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.logBtnText, exists && { color: info.color }]}>
                        {exists ? '✓ ' : ''}{info.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 12 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 4 },

  // ── Summary ──
  summaryCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  summaryGrid: { flexDirection: 'row', gap: 8 },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryValue: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  summaryLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },

  // ── Protocol ──
  protocolCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  protocolBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  protocolMeta: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    backgroundColor: colors.bg, alignSelf: 'flex-start',
  },
  protocolMetaText: { fontSize: 10, fontWeight: '700', color: colors.textMuted },

  // ── Test Cards ──
  testCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  testCardDone: { borderColor: ACCENT + '25' },
  testHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  testWeekBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  testWeekText: { fontSize: 11, fontWeight: '900', color: colors.textSecondary },
  testTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },

  resultRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 4, borderTopWidth: 1, borderTopColor: colors.border,
  },
  resultDot: { width: 6, height: 6, borderRadius: 3 },
  resultLabel: { flex: 1, fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  resultAvg: { fontSize: 12, fontWeight: '800', color: colors.textPrimary },
  resultMax: { fontSize: 12, fontWeight: '800', color: ACCENT },

  logRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  logBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: radius.sm,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  logBtnText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary },

  // ── Input Mode ──
  inputInstructions: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  inputLabel: { fontSize: 13, fontWeight: '800', width: 70 },
  inputField: {
    flex: 1, fontSize: 18, fontWeight: '900', color: colors.textPrimary,
    textAlign: 'right', padding: 0,
  },
  saveCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, backgroundColor: ACCENT, marginTop: 8,
  },
  saveCtaText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

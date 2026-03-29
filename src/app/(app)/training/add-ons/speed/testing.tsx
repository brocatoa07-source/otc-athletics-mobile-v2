/**
 * Speed Program — Testing & Progress
 *
 * Test at Weeks 1, 6, 12.
 * Log: 10yd, 30yd, 60yd times + broad jump + optional vertical.
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { SPEED_TEST_WEEKS, TESTING_INSTRUCTIONS, SPEED_PRODUCTS } from '@/data/speed-program/product';
import {
  loadSpeedProgress, saveSpeedTestResult, getSpeedProgressSummary,
} from '@/data/speed-program/progress';
import type { SpeedProgress, SpeedTestResult, SpeedLevel } from '@/data/speed-program/types';

const LEVEL_COLORS: Record<SpeedLevel, string> = {
  beginner: '#3b82f6',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

export default function SpeedTestingScreen() {
  const [progress, setProgress] = useState<SpeedProgress | null>(null);
  const [inputWeek, setInputWeek] = useState<number | null>(null);
  const [tenYd, setTenYd] = useState('');
  const [thirtyYd, setThirtyYd] = useState('');
  const [sixtyYd, setSixtyYd] = useState('');
  const [broadJump, setBroadJump] = useState('');
  const [vertJump, setVertJump] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadSpeedProgress().then(setProgress);
    }, []),
  );

  if (!progress) return null;

  const levelColor = LEVEL_COLORS[progress.level];
  const summary = getSpeedProgressSummary(progress);
  const product = SPEED_PRODUCTS[progress.level];

  function handleSave() {
    if (!inputWeek) return;
    const result: SpeedTestResult = {
      id: `speed-test-w${inputWeek}-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      weekNumber: inputWeek,
      tenYard: tenYd ? Number(tenYd) : undefined,
      thirtyYard: thirtyYd ? Number(thirtyYd) : undefined,
      sixtyYard: sixtyYd ? Number(sixtyYd) : undefined,
      broadJump: broadJump ? Number(broadJump) : undefined,
      verticalJump: vertJump ? Number(vertJump) : undefined,
    };
    if (!result.tenYard && !result.thirtyYard && !result.sixtyYard) {
      Alert.alert('Enter at least one sprint time');
      return;
    }
    saveSpeedTestResult(result).then((updated) => {
      setProgress(updated);
      setInputWeek(null);
      setTenYd(''); setThirtyYd(''); setSixtyYd(''); setBroadJump(''); setVertJump('');
    });
  }

  // ── Input Mode ──────────────────────────────────────────────────────────

  if (inputWeek !== null) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { setInputWeek(null); }} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerSup, { color: levelColor }]}>SPEED TEST</Text>
            <Text style={styles.headerTitle}>Week {inputWeek} Results</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.inputInstructions}>
            Enter your best times. Take 2–3 attempts per test.
          </Text>

          {[
            { label: '10-Yard Sprint', value: tenYd, setter: setTenYd, unit: 'sec', color: '#ef4444' },
            { label: '30-Yard Sprint', value: thirtyYd, setter: setThirtyYd, unit: 'sec', color: '#f59e0b' },
            { label: '60-Yard Sprint', value: sixtyYd, setter: setSixtyYd, unit: 'sec', color: '#22c55e' },
            { label: 'Broad Jump', value: broadJump, setter: setBroadJump, unit: 'inches', color: '#3b82f6' },
            { label: 'Vertical Jump (opt)', value: vertJump, setter: setVertJump, unit: 'inches', color: '#8b5cf6' },
          ].map((field) => (
            <View key={field.label} style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: field.color }]}>{field.label}</Text>
              <TextInput
                style={styles.inputField}
                value={field.value}
                onChangeText={field.setter}
                placeholder={field.unit}
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>
          ))}

          <TouchableOpacity style={[styles.saveCta, { backgroundColor: levelColor }]} onPress={handleSave} activeOpacity={0.85}>
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
          <Text style={[styles.headerSup, { color: levelColor }]}>SPEED PROGRAM</Text>
          <Text style={styles.headerTitle}>Testing & Progress</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* PR Summary */}
        <View style={[styles.summaryCard, { borderColor: levelColor + '25' }]}>
          <Text style={[styles.sectionLabel, { color: levelColor }]}>YOUR BEST TIMES</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {summary.tenPR !== null ? `${summary.tenPR}s` : '—'}
              </Text>
              <Text style={styles.summaryLabel}>10yd PR</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {summary.thirtyPR !== null ? `${summary.thirtyPR}s` : '—'}
              </Text>
              <Text style={styles.summaryLabel}>30yd PR</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {summary.sixtyPR !== null ? `${summary.sixtyPR}s` : '—'}
              </Text>
              <Text style={styles.summaryLabel}>60yd PR</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {summary.broadJumpPR !== null ? `${summary.broadJumpPR}"` : '—'}
              </Text>
              <Text style={styles.summaryLabel}>Broad Jump</Text>
            </View>
          </View>

          {/* Improvement row */}
          {(summary.tenImprove !== null || summary.sixtyImprove !== null) && (
            <View style={styles.improvRow}>
              {summary.tenImprove !== null && summary.tenImprove > 0 && (
                <View style={styles.improvChip}>
                  <Text style={[styles.improvText, { color: '#22c55e' }]}>10yd: -{summary.tenImprove.toFixed(2)}s</Text>
                </View>
              )}
              {summary.thirtyImprove !== null && summary.thirtyImprove > 0 && (
                <View style={styles.improvChip}>
                  <Text style={[styles.improvText, { color: '#22c55e' }]}>30yd: -{summary.thirtyImprove.toFixed(2)}s</Text>
                </View>
              )}
              {summary.sixtyImprove !== null && summary.sixtyImprove > 0 && (
                <View style={styles.improvChip}>
                  <Text style={[styles.improvText, { color: '#22c55e' }]}>60yd: -{summary.sixtyImprove.toFixed(2)}s</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Expected targets */}
        <View style={styles.targetCard}>
          <Text style={[styles.sectionLabel, { color: levelColor }]}>
            REALISTIC TARGETS ({progress.level.toUpperCase()})
          </Text>
          {product.targets.map((t) => (
            <View key={t.metric} style={styles.targetRow}>
              <Text style={styles.targetMetric}>{t.metric}</Text>
              <Text style={[styles.targetValue, { color: levelColor }]}>
                {t.low}–{t.high} {t.unit} improvement
              </Text>
            </View>
          ))}
          <Text style={styles.targetNote}>These are realistic targets, not guarantees.</Text>
        </View>

        {/* Testing Protocol */}
        <View style={styles.protocolCard}>
          <Text style={[styles.sectionLabel, { color: levelColor }]}>TESTING PROTOCOL</Text>
          {TESTING_INSTRUCTIONS.map((instruction, i) => (
            <View key={i} style={styles.instructionRow}>
              <Text style={styles.instructionNum}>{i + 1}</Text>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        {/* Test Sessions */}
        <Text style={styles.sectionLabel}>TEST SESSIONS</Text>
        {SPEED_TEST_WEEKS.map((weekNum) => {
          const result = progress.testResults.find((r) => r.weekNumber === weekNum);
          return (
            <View key={weekNum} style={[styles.testCard, result && { borderColor: levelColor + '25' }]}>
              <View style={styles.testHeader}>
                <View style={[styles.testWeekBadge, result && { backgroundColor: levelColor + '15' }]}>
                  <Text style={[styles.testWeekText, result && { color: levelColor }]}>W{weekNum}</Text>
                </View>
                <Text style={styles.testTitle}>
                  Week {weekNum} Test{result ? ' ✓' : ''}
                </Text>
              </View>

              {result && (
                <View style={styles.resultGrid}>
                  {result.tenYard && (
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>10yd</Text>
                      <Text style={styles.resultValue}>{result.tenYard}s</Text>
                    </View>
                  )}
                  {result.thirtyYard && (
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>30yd</Text>
                      <Text style={styles.resultValue}>{result.thirtyYard}s</Text>
                    </View>
                  )}
                  {result.sixtyYard && (
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>60yd</Text>
                      <Text style={styles.resultValue}>{result.sixtyYard}s</Text>
                    </View>
                  )}
                  {result.broadJump && (
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>Broad</Text>
                      <Text style={styles.resultValue}>{result.broadJump}"</Text>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={[styles.logBtn, result && { backgroundColor: levelColor + '10', borderColor: levelColor + '25' }]}
                onPress={() => setInputWeek(weekNum)}
                activeOpacity={0.8}
              >
                <Text style={[styles.logBtnText, result && { color: levelColor }]}>
                  {result ? 'Update Results' : 'Log Test Results'}
                </Text>
              </TouchableOpacity>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 12 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 4 },

  // ── Summary ──
  summaryCard: {
    backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  summaryGrid: { flexDirection: 'row', gap: 6 },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryValue: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  summaryLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted },
  improvRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  improvChip: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: '#22c55e10', borderWidth: 1, borderColor: '#22c55e25',
  },
  improvText: { fontSize: 10, fontWeight: '800' },

  // ── Targets ──
  targetCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  targetMetric: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  targetValue: { fontSize: 12, fontWeight: '800' },
  targetNote: { fontSize: 10, color: colors.textMuted, fontStyle: 'italic' },

  // ── Protocol ──
  protocolCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 6,
  },
  instructionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  instructionNum: { fontSize: 11, fontWeight: '900', color: colors.textMuted, width: 16 },
  instructionText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  // ── Test Cards ──
  testCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  testHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  testWeekBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  testWeekText: { fontSize: 11, fontWeight: '900', color: colors.textSecondary },
  testTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  resultGrid: { flexDirection: 'row', gap: 6 },
  resultItem: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 6, backgroundColor: colors.bg, borderRadius: radius.sm },
  resultLabel: { fontSize: 9, fontWeight: '800', color: colors.textMuted },
  resultValue: { fontSize: 14, fontWeight: '900', color: colors.textPrimary },
  logBtn: {
    alignItems: 'center', paddingVertical: 10, borderRadius: radius.sm,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  logBtnText: { fontSize: 12, fontWeight: '800', color: colors.textSecondary },

  // ── Input ──
  inputInstructions: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  inputLabel: { fontSize: 12, fontWeight: '800', width: 130 },
  inputField: {
    flex: 1, fontSize: 18, fontWeight: '900', color: colors.textPrimary,
    textAlign: 'right', padding: 0,
  },
  saveCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, marginTop: 8,
  },
  saveCtaText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

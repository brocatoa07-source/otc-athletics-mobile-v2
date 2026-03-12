import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, accents, radius } from '@/theme';
import {
  ARCHETYPE_INFO,
  DIAGNOSTIC_META,
  DIAGNOSTIC_ORDER,
} from '@/data/mental-diagnostics-data';
import type { DiagnosticType, ArchetypeKey } from '@/data/mental-diagnostics-data';
import type { ArchetypeResult, IdentityResult, HabitsResult } from '@/utils/mentalDiagnosticScoring';

const ACCENT = accents.mental;

function ScoreBar({
  label,
  value,
  max = 5,
  accent = ACCENT,
}: {
  label: string;
  value: number;
  max?: number;
  accent?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <View style={barStyles.row}>
      <Text style={barStyles.label}>{label}</Text>
      <View style={barStyles.track}>
        <View style={[barStyles.fill, { width: `${pct}%` as any, backgroundColor: accent }]} />
      </View>
      <Text style={barStyles.value}>{value.toFixed(1)}</Text>
    </View>
  );
}

const barStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 12, color: colors.textSecondary, width: 120, fontWeight: '600' },
  track: {
    flex: 1, height: 6, backgroundColor: colors.border,
    borderRadius: 3, overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
  value: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, width: 28, textAlign: 'right' },
});

function ArchetypeResultsView({ result }: { result: ArchetypeResult }) {
  const info = ARCHETYPE_INFO[result.primary];
  const sorted = (Object.entries(result.scores) as [ArchetypeKey, number][]).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <View style={styles.sectionWrap}>
      <View style={[styles.heroCard, { borderColor: ACCENT + '40', shadowColor: ACCENT }]}>
        <Text style={[styles.heroEyebrow, { color: ACCENT }]}>YOUR PRIMARY ARCHETYPE</Text>
        <Text style={styles.heroTitle}>{info.name}</Text>
        <Text style={styles.heroTagline}>{info.tagline}</Text>
      </View>

      <Text style={styles.summaryText}>{info.summary}</Text>

      <View style={styles.twoCol}>
        <View style={[styles.miniCard, { borderColor: '#22c55e40' }]}>
          <Ionicons name="trending-up-outline" size={16} color="#22c55e" />
          <Text style={styles.miniCardLabel}>Strength</Text>
          <Text style={styles.miniCardText}>{info.strength}</Text>
        </View>
        <View style={[styles.miniCard, { borderColor: '#f59e0b40' }]}>
          <Ionicons name="alert-circle-outline" size={16} color="#f59e0b" />
          <Text style={styles.miniCardLabel}>Watch for</Text>
          <Text style={styles.miniCardText}>{info.challenge}</Text>
        </View>
      </View>

      {result.secondary && (
        <View style={styles.secondaryWrap}>
          <Text style={styles.secondaryLabel}>Secondary archetype: </Text>
          <Text style={[styles.secondaryName, { color: ACCENT }]}>
            {ARCHETYPE_INFO[result.secondary].name}
          </Text>
        </View>
      )}

      <Text style={styles.subHeading}>All Archetype Scores</Text>
      {sorted.map(([key, score]) => (
        <ScoreBar key={key} label={ARCHETYPE_INFO[key].name} value={score} max={25} accent={ACCENT} />
      ))}
    </View>
  );
}

const ISS_COLOR: Record<string, string> = {
  'Elite Competitor Identity':  '#f59e0b',
  'Stable Competitor Identity': '#22c55e',
  'Developing Identity':        '#3b82f6',
  'Fragile Identity':           '#8b5cf6',
};

function IdentityResultsView({ result }: { result: IdentityResult }) {
  const color = ISS_COLOR[result.profile] ?? ACCENT;
  return (
    <View style={styles.sectionWrap}>
      <View style={[styles.heroCard, { borderColor: color + '40', shadowColor: color }]}>
        <Text style={[styles.heroEyebrow, { color }]}>YOUR IDENTITY PROFILE</Text>
        <Text style={styles.heroTitle}>{result.profile}</Text>
        <Text style={[styles.issScore, { color }]}>ISS: {result.ISS.toFixed(2)}</Text>
      </View>

      <Text style={styles.summaryText}>
        Your Identity Stability Score (ISS) reflects how grounded you are as a competitor
        across different performance situations.
      </Text>

      <Text style={styles.subHeading}>Subscores</Text>
      <ScoreBar label="Identity Stability" value={result.ISS} accent={color} />
      <ScoreBar label="Outcome Attachment" value={result.outcomeAttachment} accent="#f97316" />
      <ScoreBar label="Approval Load" value={result.approvalLoad} accent="#8b5cf6" />

      <View style={styles.interpretRow}>
        <Text style={styles.interpretText}>
          <Text style={{ fontWeight: '800', color: '#f97316' }}>Outcome Attachment</Text>
          {' '}— how much your self-image shifts with results. Lower is better for identity stability.
        </Text>
      </View>
      <View style={styles.interpretRow}>
        <Text style={styles.interpretText}>
          <Text style={{ fontWeight: '800', color: '#8b5cf6' }}>Approval Load</Text>
          {' '}— how much you rely on external praise to feel confident. Lower = more internally driven.
        </Text>
      </View>
    </View>
  );
}

const HAB_COLOR: Record<string, string> = {
  'Elite System':       '#f59e0b',
  'Structured System':  '#22c55e',
  'Inconsistent System':'#3b82f6',
  'Reactive System':    '#8b5cf6',
};

const SUBSCORE_LABELS: Record<string, string> = {
  daily_foundation: 'Daily Foundation',
  pregame:          'Pre-Game Routine',
  ingame_reset:     'In-Game Reset',
  postgame:         'Post-Game Process',
  consistency:      'Season Consistency',
};

function HabitsResultsView({ result }: { result: HabitsResult }) {
  const color = HAB_COLOR[result.profile] ?? ACCENT;
  return (
    <View style={styles.sectionWrap}>
      <View style={[styles.heroCard, { borderColor: color + '40', shadowColor: color }]}>
        <Text style={[styles.heroEyebrow, { color }]}>YOUR HABIT SYSTEM</Text>
        <Text style={styles.heroTitle}>{result.profile}</Text>
        <Text style={[styles.issScore, { color }]}>HSS: {result.HSS.toFixed(2)}</Text>
      </View>

      <Text style={styles.summaryText}>
        Your Habit System Score (HSS) measures the quality and consistency of your mental
        routine across all phases of the game.
      </Text>

      <Text style={styles.subHeading}>Subscores</Text>
      {Object.entries(result.subscores).map(([key, val]) => (
        <ScoreBar key={key} label={SUBSCORE_LABELS[key] ?? key} value={val} accent={color} />
      ))}
    </View>
  );
}

export default function DiagnosticResultsScreen() {
  const { type, result: resultJson } = useLocalSearchParams<{
    type: string;
    result: string;
  }>();

  const diagType = type as DiagnosticType;
  const meta = DIAGNOSTIC_META[diagType];

  let result: ArchetypeResult | IdentityResult | HabitsResult | null = null;
  try {
    result = JSON.parse(resultJson ?? 'null');
  } catch {
    result = null;
  }

  const currentIdx = DIAGNOSTIC_ORDER.indexOf(diagType);
  const nextType: DiagnosticType | null =
    currentIdx >= 0 && currentIdx < DIAGNOSTIC_ORDER.length - 1
      ? DIAGNOSTIC_ORDER[currentIdx + 1]
      : null;

  const handleContinue = () => {
    router.replace('/(app)/training/mental/diagnostics/entry' as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerEyebrow, { color: ACCENT }]}>DIAGNOSTIC COMPLETE</Text>
          <Text style={styles.headerTitle}>{meta?.label}</Text>
        </View>
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark-circle" size={28} color="#22c55e" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {result && diagType === 'archetype' && (
          <ArchetypeResultsView result={result as ArchetypeResult} />
        )}
        {result && diagType === 'identity' && (
          <IdentityResultsView result={result as IdentityResult} />
        )}
        {result && diagType === 'habits' && (
          <HabitsResultsView result={result as HabitsResult} />
        )}

        <TouchableOpacity
          style={[styles.continueBtn, { borderColor: ACCENT + '50', shadowColor: ACCENT }]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-forward" size={18} color={ACCENT} />
          <Text style={[styles.continueBtnText, { color: ACCENT }]}>
            {nextType
              ? `Continue to ${DIAGNOSTIC_META[nextType].label}`
              : 'Return to Entry — Generate Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  checkBadge: { padding: 4 },

  content: { padding: 20, gap: 16, paddingBottom: 60 },

  sectionWrap: { gap: 12 },

  heroCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, padding: 20, gap: 4,
    shadowOpacity: 0.2, shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 }, elevation: 4,
  },
  heroEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, marginTop: 4 },
  heroTagline: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  issScore: { fontSize: 18, fontWeight: '900', marginTop: 6 },

  summaryText: {
    fontSize: 13, color: colors.textSecondary, lineHeight: 20,
    borderLeftWidth: 2, borderLeftColor: accents.mental + '50', paddingLeft: 12,
  },

  subHeading: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.4,
    color: colors.textMuted, marginTop: 4,
  },

  twoCol: { flexDirection: 'row', gap: 10 },
  miniCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, padding: 12, gap: 4,
  },
  miniCardLabel: { fontSize: 9, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.8, marginTop: 2 },
  miniCardText: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  secondaryWrap: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
    backgroundColor: colors.surface, borderRadius: radius.sm,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  secondaryLabel: { fontSize: 13, color: colors.textSecondary },
  secondaryName: { fontSize: 13, fontWeight: '800' },

  interpretRow: {
    backgroundColor: colors.surface, borderRadius: radius.sm, padding: 10,
  },
  interpretText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: radius.lg,
    borderWidth: 1, backgroundColor: accents.mental + '10',
    shadowOpacity: 0.2, shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }, elevation: 3, marginTop: 8,
  },
  continueBtnText: { fontSize: 15, fontWeight: '900' },
});

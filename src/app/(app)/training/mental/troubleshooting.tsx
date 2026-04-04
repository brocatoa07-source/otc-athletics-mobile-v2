/**
 * Mental Troubleshooting — "Something wrong? Find the fix."
 *
 * Lists 10 common mental problems as tappable cards.
 * Tapping opens an inline detail view with full troubleshooting content.
 */

import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { MENTAL_PROBLEMS, type MentalProblem } from '@/features/mental/mentalTroubleshooting';

const ACCENT = '#8b5cf6';

export default function MentalTroubleshootingScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL</Text>
          <Text style={styles.headerTitle}>Troubleshoot My Mind</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Something wrong? Tap the problem that matches how you feel.
        </Text>

        {MENTAL_PROBLEMS.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            expanded={expandedId === problem.id}
            onToggle={() => setExpandedId(expandedId === problem.id ? null : problem.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProblemCard({
  problem, expanded, onToggle,
}: {
  problem: MentalProblem;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={[styles.card, expanded && { borderColor: problem.color + '40' }]}>
      {/* Header — always visible */}
      <TouchableOpacity style={styles.cardHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={[styles.cardIcon, { backgroundColor: problem.color + '15' }]}>
          <Ionicons name={problem.icon as any} size={18} color={problem.color} />
        </View>
        <Text style={styles.cardTitle}>{problem.title}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {/* Detail — shown when expanded */}
      {expanded && (
        <View style={styles.detail}>
          {/* What's Happening */}
          <Section label="WHAT'S HAPPENING" color={problem.color}>
            <Text style={styles.bodyText}>{problem.whatsHappening}</Text>
          </Section>

          {/* Why It Happens */}
          <Section label="WHY IT HAPPENS" color="#f59e0b">
            <Text style={styles.bodyText}>{problem.whyItHappens}</Text>
          </Section>

          {/* What To Do */}
          <Section label="WHAT TO DO" color="#22c55e">
            {problem.whatToDo.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <Text style={styles.stepNum}>{i + 1}</Text>
                <Text style={styles.bodyText}>{step}</Text>
              </View>
            ))}
          </Section>

          {/* Tools */}
          <Section label="TOOLS" color="#3b82f6">
            <View style={styles.toolsRow}>
              {problem.tools.map((tool) => (
                <View key={tool} style={[styles.toolChip, { borderColor: '#3b82f630' }]}>
                  <Text style={styles.toolChipText}>{tool}</Text>
                </View>
              ))}
            </View>
          </Section>

          {/* Reset Routine */}
          <Section label="RESET ROUTINE" color="#ef4444">
            <View style={[styles.resetBox, { backgroundColor: '#ef444408' }]}>
              <Ionicons name="refresh" size={14} color="#ef4444" />
              <Text style={styles.bodyText}>{problem.resetRoutine}</Text>
            </View>
          </Section>

          {/* Journal Prompts */}
          <Section label="JOURNAL PROMPTS" color={ACCENT}>
            {problem.journalPrompts.map((prompt, i) => (
              <View key={i} style={styles.promptRow}>
                <Ionicons name="book-outline" size={12} color={ACCENT} />
                <Text style={[styles.bodyText, { fontStyle: 'italic' }]}>{prompt}</Text>
              </View>
            ))}
          </Section>

          {/* Challenge */}
          <Section label="CHALLENGE" color="#f59e0b">
            <View style={[styles.challengeBox, { backgroundColor: '#f59e0b08' }]}>
              <Ionicons name="trophy" size={14} color="#f59e0b" />
              <Text style={styles.bodyText}>{problem.challenge}</Text>
            </View>
          </Section>
        </View>
      )}
    </View>
  );
}

function Section({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 10 },
  intro: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginBottom: 4 },

  /* Card */
  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14,
  },
  cardIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  /* Detail */
  detail: { paddingHorizontal: 14, paddingBottom: 14, gap: 12 },
  section: { gap: 4 },
  sectionLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  bodyText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  stepRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  stepNum: { fontSize: 12, fontWeight: '800', color: '#22c55e', width: 16 },

  toolsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  toolChip: {
    paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1,
    borderRadius: radius.sm, backgroundColor: colors.bg,
  },
  toolChipText: { fontSize: 10, fontWeight: '700', color: '#3b82f6' },

  resetBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 10, borderRadius: radius.sm,
  },

  promptRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },

  challengeBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 10, borderRadius: radius.sm,
  },
});

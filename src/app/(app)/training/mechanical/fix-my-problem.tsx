/**
 * Fix My Problem — Quick problem-to-solution shortcut layer.
 *
 * Athlete selects a problem → gets sections, drills, cues, and practice advice.
 */

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { HITTING_PROBLEMS, type HittingProblem } from '@/data/hitting-fix-problems';
import { HITTING_VAULT_SECTIONS } from '@/data/hitting-vault-sections';

const ACCENT = '#E10600';

export default function FixMyProblemScreen() {
  const [selected, setSelected] = useState<HittingProblem | null>(null);

  if (selected) {
    const sections = selected.sectionKeys
      .map((k) => HITTING_VAULT_SECTIONS.find((s) => s.key === k))
      .filter(Boolean);

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelected(null)} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>FIX MY PROBLEM</Text>
            <Text style={styles.headerTitle}>{selected.label}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Description */}
          <View style={[styles.card, { borderColor: selected.color + '30' }]}>
            <Text style={styles.cardDesc}>{selected.description}</Text>
          </View>

          {/* Likely Cause */}
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: selected.color }]}>LIKELY CAUSE</Text>
            <Text style={styles.cardBody}>{selected.likelyCause}</Text>
          </View>

          {/* Cues */}
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: selected.color }]}>CUES TO REMEMBER</Text>
            {selected.cues.map((cue, i) => (
              <View key={i} style={styles.cueRow}>
                <Ionicons name="mic-outline" size={14} color={selected.color} />
                <Text style={[styles.cueText, { color: selected.color }]}>{cue}</Text>
              </View>
            ))}
          </View>

          {/* Recommended Drills */}
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: selected.color }]}>DRILL STACK</Text>
            {selected.drills.map((drill, i) => (
              <View key={i} style={styles.drillRow}>
                <View style={[styles.drillDot, { backgroundColor: selected.color }]} />
                <Text style={styles.drillText}>{drill}</Text>
              </View>
            ))}
          </View>

          {/* Go To Sections */}
          <Text style={styles.sectionLabel}>GO TO SECTION</Text>
          {sections.map((section) => section && (
            <TouchableOpacity
              key={section.key}
              style={styles.sectionRow}
              onPress={() => router.push(`/(app)/training/mechanical/${section.key}` as any)}
              activeOpacity={0.8}
            >
              <Ionicons name={section.icon} size={20} color={section.color} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionName}>{section.label}</Text>
                <Text style={styles.sectionDesc} numberOfLines={1}>{section.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          ))}

          {/* Practice Note */}
          <View style={[styles.practiceNote, { borderColor: selected.color + '25' }]}>
            <Ionicons name="bulb-outline" size={16} color={selected.color} />
            <Text style={styles.practiceNoteText}>{selected.practiceNote}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Problem Picker ──────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>Fix My Problem</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          What's your biggest problem right now? Pick one and we'll show you exactly what to work on.
        </Text>

        {HITTING_PROBLEMS.map((problem) => (
          <TouchableOpacity
            key={problem.key}
            style={[styles.problemCard, { borderColor: problem.color + '25' }]}
            onPress={() => setSelected(problem)}
            activeOpacity={0.8}
          >
            <View style={[styles.problemIcon, { backgroundColor: problem.color + '15' }]}>
              <Ionicons name={problem.icon as any} size={20} color={problem.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.problemLabel}>{problem.label}</Text>
              <Text style={styles.problemDesc} numberOfLines={1}>{problem.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
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
  content: { padding: 16, paddingBottom: 60, gap: 10 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4 },

  problemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 14,
  },
  problemIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  problemLabel: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  problemDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  // ── Detail View ──
  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  cardDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },
  cardBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 4 },
  cueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cueText: { fontSize: 13, fontWeight: '700', fontStyle: 'italic' },
  drillRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: colors.border,
  },
  drillDot: { width: 7, height: 7, borderRadius: 4 },
  drillText: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  sectionName: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  sectionDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  practiceNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.md, marginTop: 4,
  },
  practiceNoteText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },
});

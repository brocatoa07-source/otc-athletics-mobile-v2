/**
 * Mental Home — Execution-first landing screen.
 *
 * Architecture:
 *   1. EXECUTION: Today's Mental Focus + Quick Compete + Today's Cue
 *   2. DEVELOPMENT: Build Your Game (courses, toolbox, journals, etc.)
 *
 * The top half emphasizes what to do TODAY.
 * The bottom half provides access to deeper training.
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useGating } from '@/hooks/useGating';
import { useMentalProfile } from '@/hooks/useMentalProfile';
import { ARCHETYPE_INFO, type ArchetypeKey } from '@/data/mental-diagnostics-data';
import { ExpandableProfileCard } from '@/components/training/ExpandableProfileCard';
import { ARCHETYPE_PATHS } from '@/data/mental-archetype-paths';
import { MENTAL_VAULT_SECTIONS } from '@/data/mental-vault-sections';

const ACCENT = '#8b5cf6';

// ── Today's Cue rotation (one per day) ──────────────────────────────────────

const DAILY_CUES = [
  'Trust the work. Compete clean.',
  'Next pitch mentality. Always.',
  'Control what you can. Release everything else.',
  'Be here now. This pitch is all that exists.',
  'Compete — don\'t perform.',
  'Slow breath, slow heart, clear mind.',
  'Attack the moment. Don\'t avoid it.',
];

// ── Build Your Game items ───────────────────────────────────────────────────

interface BuildItem {
  key: string;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

const BUILD_ITEMS: BuildItem[] = [
  { key: 'program', label: 'Mental Training Program', sub: '6 core courses · Shadow → Mastery', icon: 'school-outline', color: '#8b5cf6', route: '/(app)/training/mental/courses-list' },
  { key: 'toolbox', label: 'Toolbox', sub: '45 tools across 9 categories', icon: 'build-outline', color: '#f59e0b', route: '/(app)/training/mental/toolbox' },
  { key: 'journals', label: 'Journals', sub: 'Skill journals + daily reflection', icon: 'book-outline', color: '#3b82f6', route: '/(app)/training/mental/journals' },
  { key: 'meditations', label: 'Meditations', sub: '7 guided sessions · 3–8 min', icon: 'leaf-outline', color: '#a855f7', route: '/(app)/training/mental/meditations' },
  { key: 'troubleshoot', label: 'Troubleshooting', sub: 'Problem → action → protocol', icon: 'hammer-outline', color: '#ef4444', route: '/(app)/training/mental/troubleshooting' },
  { key: 'identity', label: 'Identity Builder', sub: 'Statement, habits, tracker', icon: 'construct-outline', color: '#22c55e', route: '/(app)/training/mental/identity-builder' },
];

// ── Resolve weekly focus tools from archetype ───────────────────────────────

interface FocusTool {
  name: string;
  sectionKey: string;
  sectionColor: string;
}

function resolveFocusTools(archetypeKey: string): FocusTool[] {
  const path = ARCHETYPE_PATHS[archetypeKey];
  if (!path) return [];

  // Map archetype focus skills to vault section tools
  const results: FocusTool[] = [];
  for (const section of MENTAL_VAULT_SECTIONS) {
    if (path.focusSkills.some((f) => section.label.toLowerCase().includes(f.toLowerCase()))) {
      if (section.tools[0]) {
        results.push({
          name: section.tools[0].name,
          sectionKey: section.key,
          sectionColor: section.color,
        });
      }
    }
    if (results.length >= 3) break;
  }

  // If not enough, add first tool from the first section not yet covered
  if (results.length < 2) {
    for (const section of MENTAL_VAULT_SECTIONS) {
      if (!results.some((r) => r.sectionKey === section.key) && section.tools[0]) {
        results.push({
          name: section.tools[0].name,
          sectionKey: section.key,
          sectionColor: section.color,
        });
        if (results.length >= 2) break;
      }
    }
  }

  return results.slice(0, 3);
}

// ── Component ───────────────────────────────────────────────────────────────

export default function MentalHome() {
  const { isWalk, hasLimitedMental } = useTier();
  const { gate } = useGating();
  const { profile: dbProfile } = useMentalProfile();

  const mentalDiagDone = gate.mental.archetypeDone && gate.mental.identityDone && gate.mental.habitsDone;
  const archKey = dbProfile?.primary_archetype as ArchetypeKey | undefined;
  const archInfo = archKey ? ARCHETYPE_INFO[archKey] : null;
  const focusTools = archKey ? resolveFocusTools(archKey) : [];
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const todayCue = DAILY_CUES[dayIndex % DAILY_CUES.length];

  // Walk tier — fully locked
  if (isWalk) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>MENTAL</Text>
            <Text style={styles.headerTitle}>Mental System</Text>
          </View>
        </View>
        <View style={styles.lockedState}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textMuted} />
          <Text style={styles.lockedTitle}>Mental System Locked</Text>
          <Text style={styles.lockedDesc}>
            Upgrade to unlock personalized mental training, tools, courses, and daily routines.
          </Text>
          <TouchableOpacity
            style={[styles.ctaFull, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaFullText}>Upgrade to Double</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL</Text>
          <Text style={styles.headerTitle}>Mental System</Text>
        </View>
        <TouchableOpacity
          style={styles.diagBtn}
          onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
        >
          <Ionicons name="clipboard-outline" size={18} color={ACCENT} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preview mode banner */}
        {hasLimitedMental && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Preview Mode</Text>
              <Text style={styles.upgradeSub}>Starter tools unlocked. Upgrade for full access.</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ═══════ EXECUTION LAYER ═══════ */}

        {/* A. Today's Mental Focus */}
        {mentalDiagDone && archInfo ? (
          <View style={[styles.focusCard, { borderColor: ACCENT + '30' }]}>
            <View style={styles.focusHeader}>
              <View style={[styles.focusIconWrap, { backgroundColor: ACCENT + '15' }]}>
                <Ionicons name="flash" size={18} color={ACCENT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.focusLabel}>TODAY'S MENTAL FOCUS</Text>
                <Text style={styles.focusArchetype}>{archInfo.name}</Text>
              </View>
            </View>

            {/* Assigned tools */}
            {focusTools.map((tool) => (
              <TouchableOpacity
                key={tool.sectionKey}
                style={styles.toolRow}
                onPress={() => router.push(`/(app)/training/mental/${tool.sectionKey}` as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.toolDot, { backgroundColor: tool.sectionColor }]} />
                <Text style={styles.toolName}>{tool.name}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            ))}

            {/* CTA */}
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
              onPress={() => router.push('/(app)/training/mental/daily-work' as any)}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle" size={18} color="#fff" />
              <Text style={styles.ctaBtnText}>Start Routine</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.focusCard, { borderColor: ACCENT + '30' }]}
            onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.focusHeader}>
              <View style={[styles.focusIconWrap, { backgroundColor: ACCENT + '15' }]}>
                <Ionicons name="clipboard-outline" size={18} color={ACCENT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.focusLabel}>MENTAL DIAGNOSTIC</Text>
                <Text style={styles.focusArchetype}>Complete Your Assessment</Text>
                <Text style={styles.focusSub}>3 diagnostics · Personalized mental plan</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={24} color={ACCENT} />
            </View>
          </TouchableOpacity>
        )}

        {/* Expandable Profile Card */}
        {archInfo && (
          <ExpandableProfileCard
            accent={ACCENT}
            title={archInfo.name}
            subtitle={archInfo.tagline}
            collapsedStrengths={archInfo.strengths.slice(0, 3)}
            collapsedWatchOuts={archInfo.watchOuts.slice(0, 2)}
            expandedSections={[
              { label: 'UNDER PRESSURE', items: archInfo.pressureResponse, color: '#f59e0b' },
              { label: 'MENTAL STRENGTHS', items: archInfo.strengths, color: ACCENT },
              { label: 'WATCH-OUTS', items: archInfo.watchOuts, color: '#f59e0b' },
              { label: 'GAME DAY CUES', items: archInfo.cues, color: ACCENT },
              { label: 'DEVELOPMENT FOCUS', items: archInfo.developmentFocus, color: ACCENT },
            ]}
          />
        )}

        {/* B. Quick Compete */}
        <Text style={styles.sectionLabel}>QUICK COMPETE</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(app)/training/mental/ten-second-reset' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-circle-outline" size={22} color={ACCENT} />
            <Text style={styles.quickTitle}>10-Second{'\n'}Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(app)/training/mental/emergency-reset' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="alert-circle-outline" size={22} color="#ef4444" />
            <Text style={styles.quickTitle}>3-Step{'\n'}Emergency</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(app)/training/mental/post-game' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color="#22c55e" />
            <Text style={styles.quickTitle}>Post-Game{'\n'}Flush</Text>
          </TouchableOpacity>
        </View>

        {/* C. Today's Cue */}
        <View style={styles.cueCard}>
          <Ionicons name="mic-outline" size={14} color={ACCENT} />
          <Text style={styles.cueText}>{todayCue}</Text>
        </View>

        {/* ═══════ BUILD YOUR GAME (Development + Support) ═══════ */}
        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>BUILD YOUR GAME</Text>

        <View style={styles.buildGrid}>
          {BUILD_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.buildCard}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.buildIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.buildLabel}>{item.label}</Text>
              <Text style={styles.buildSub} numberOfLines={1}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  diagBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: ACCENT + '15', alignItems: 'center', justifyContent: 'center',
  },

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.md, padding: 12,
  },
  upgradeTitle: { fontSize: 12, fontWeight: '800', color: colors.textPrimary },
  upgradeSub: { fontSize: 11, color: colors.textSecondary },

  /* ── Execution: Today's Focus ────────── */
  focusCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 10,
  },
  focusHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  focusIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  focusLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  focusArchetype: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  focusSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },

  toolRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border,
  },
  toolDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  toolName: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textSecondary },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: radius.md,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },

  /* ── Quick Compete ──────────────────── */
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 4 },

  quickRow: { flexDirection: 'row', gap: 8 },
  quickCard: {
    flex: 1, alignItems: 'center', gap: 6,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  quickTitle: { fontSize: 11, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', lineHeight: 15 },

  /* ── Today's Cue ────────────────────── */
  cueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.md, padding: 12,
  },
  cueText: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary, fontStyle: 'italic' },

  /* ── Build Your Game ────────────────── */
  buildGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  buildCard: {
    width: '47%' as any,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 6,
  },
  buildIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  buildLabel: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  buildSub: { fontSize: 10, color: colors.textSecondary, lineHeight: 14 },

  /* ── Locked state ──────────────────── */
  lockedState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  lockedTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  lockedDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  ctaFull: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: radius.lg, marginTop: 4,
  },
  ctaFullText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

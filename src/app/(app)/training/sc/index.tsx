/**
 * Strength Home — Execution-first landing screen.
 *
 * Architecture (mirrors Mental Home / Hitting Home):
 *   1. EXECUTION: Today's Strength Focus + Quick Compete + Today's Cue
 *   2. BUILD YOUR GAME: Exercise library, mobility, power, conditioning, etc.
 */

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useGating } from '@/hooks/useGating';
import { useDiagnosticResult } from '@/hooks/useDiagnosticResult';
import { generateDiagnosticResult } from '@/lib/gating/generateDiagnosticResult';
import { logDiagnosticEvent } from '@/lib/gating/diagnosticEvents';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { useStrengthProfile } from '@/hooks/useStrengthProfile';
import { LIFTING_MOVER_TYPES } from '@/data/lifting-mover-type-data';
import { DAILY_WORK_RECIPES } from '@/features/strength/config/dailyWorkMapping';
import { MY_PATH_LANES } from '@/features/strength/config/myPathMapping';
import { ExpandableProfileCard } from '@/components/training/ExpandableProfileCard';
import { generateAthleteProfileSummary } from '@/features/strength/config/athleteProfileLanguage';
import type { DailyWorkFocus, MyPathStartPoint, StrengthArchetype, StrengthNeed } from '@/features/strength/types/strengthProfile';

const ACCENT = '#1DB954';

// ── Daily cue rotation ──────────────────────────────────────────────────────

const DAILY_CUES = [
  'Own the ground. Build force from the floor up.',
  'Quality over volume. Every rep counts.',
  'Train your weakness. Protect your strength.',
  'Move with intent. Nothing casual.',
  'Recovery is part of the plan.',
  'Control the load. Don\'t let it control you.',
  'Strength serves the game. Train for performance.',
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
  { key: 'exercises', label: 'Exercise Library', sub: 'Strength, accessory & core', icon: 'barbell-outline', color: '#3b82f6', route: '/(app)/training/sc/exercises?category=exercises' },
  { key: 'mobility', label: 'Mobility Bank', sub: 'Mobility, movement prep & recovery flows', icon: 'body-outline', color: '#0891b2', route: '/(app)/training/sc/mobility' },
  { key: 'power', label: 'Power Drills', sub: 'Plyometrics & explosive work', icon: 'flash-outline', color: '#f59e0b', route: '/(app)/training/sc/exercises?category=power' },
  { key: 'conditioning', label: 'Conditioning', sub: 'Sprint work & game conditioning', icon: 'heart-outline', color: '#ef4444', route: '/(app)/training/sc/exercises?category=conditioning' },
  { key: 'fuel', label: 'Fuel The Engine', sub: 'Performance nutrition', icon: 'flame-outline', color: '#10b981', route: '/(app)/training/sc/fuel' },
  { key: 'my-path', label: 'My Path', sub: '6-month personalized program', icon: 'map-outline', color: '#8b5cf6', route: '/(app)/training/sc/my-path' },
  { key: 'philosophy', label: 'Why We Train This Way', sub: 'Training philosophy & system', icon: 'bulb-outline', color: '#f59e0b', route: '/(app)/training/sc/philosophy' },
  { key: 'coach-brain', label: 'Coach Brain', sub: 'How the system makes decisions', icon: 'hardware-chip-outline', color: '#3b82f6', route: '/(app)/training/sc/coach-brain' },
  { key: 'monthly', label: 'Monthly Report', sub: 'Progress report card', icon: 'document-text-outline', color: '#22c55e', route: '/(app)/training/sc/monthly-report' },
];

// ── Resolve focus items from strength profile ───────────────────────────────

interface FocusItem {
  name: string;
  color: string;
  route: string;
}

const FOCUS_COLORS = [ACCENT, '#3b82f6', '#f59e0b'];

function resolveFocusFromProfile(priorities: string[]): FocusItem[] {
  return priorities.slice(0, 3).map((p, i) => ({
    name: p,
    color: FOCUS_COLORS[i] ?? ACCENT,
    route: '/(app)/training/sc/workout',
  }));
}

function resolveFocusFromMover(moverType: string): FocusItem[] {
  const mt = LIFTING_MOVER_TYPES[moverType as keyof typeof LIFTING_MOVER_TYPES];
  if (!mt) return [];
  return mt.trainingEmphasis.slice(0, 3).map((name, i) => ({
    name,
    color: FOCUS_COLORS[i] ?? ACCENT,
    route: '/(app)/training/sc/workout',
  }));
}

// ── Component ───────────────────────────────────────────────────────────────

export default function StrengthHome() {
  const { isWalk, hasLimitedLifting, hasFullLifting } = useTier();
  const { gate } = useGating();
  const { result: moverType } = useDiagnosticResult('sc', 'lifting-mover');
  const { profile: strengthProfile } = useStrengthProfile();

  const moverDone = gate.sc.moverDone;
  const user = useAuthStore((s) => s.user);
  const backfillRan = useRef(false);

  // Backfill: if user has lifting-mover submission but no strength_profiles row,
  // trigger profile generation (uses legacy bridge for old payloads)
  useEffect(() => {
    if (moverDone && !strengthProfile && user?.id && !backfillRan.current) {
      backfillRan.current = true;
      logDiagnosticEvent({ event: 'profile_backfill_started', vault: 'sc', userId: user.id.slice(0, 8) });
      generateDiagnosticResult({ supabase, userId: user.id, vaultType: 'sc' })
        .then((r) => {
          if (r.success) logDiagnosticEvent({ event: 'profile_backfill_succeeded', vault: 'sc' });
          else logDiagnosticEvent({ event: 'profile_backfill_failed', vault: 'sc', error: r.error });
        });
    }
  }, [moverDone, strengthProfile, user?.id]);

  // Prefer strength_profiles for display; fall back to raw mover type
  const moverData = moverType ? LIFTING_MOVER_TYPES[moverType] : null;
  const dailyWorkRecipe = strengthProfile?.daily_work_focus
    ? DAILY_WORK_RECIPES[strengthProfile.daily_work_focus as DailyWorkFocus]
    : null;
  const myPathLane = strengthProfile?.my_path_start_point
    ? MY_PATH_LANES[strengthProfile.my_path_start_point as MyPathStartPoint]
    : null;

  // Generate athlete-facing summary from profile (no internal labels in UI)
  const profileSummary = (strengthProfile?.primary_archetype && strengthProfile?.secondary_need && strengthProfile?.daily_work_focus && strengthProfile?.my_path_start_point)
    ? generateAthleteProfileSummary(
        strengthProfile.primary_archetype as StrengthArchetype,
        strengthProfile.secondary_need as StrengthNeed,
        strengthProfile.daily_work_focus as DailyWorkFocus,
        strengthProfile.my_path_start_point as MyPathStartPoint,
      )
    : null;

  // Focus items from profile priorities (preferred) or mover emphasis (fallback)
  const focusItems = strengthProfile?.top_training_priorities
    ? resolveFocusFromProfile(strengthProfile.top_training_priorities as string[])
    : moverType
      ? resolveFocusFromMover(moverType)
      : [];

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
            <Text style={styles.headerSup}>STRENGTH</Text>
            <Text style={styles.headerTitle}>Strength System</Text>
          </View>
        </View>
        <View style={styles.lockedState}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textMuted} />
          <Text style={styles.lockedTitle}>Strength System Locked</Text>
          <Text style={styles.lockedDesc}>
            Upgrade to unlock personalized strength programming, exercise library, and daily training.
          </Text>
          <TouchableOpacity
            style={[styles.ctaFull, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaFullText}>Upgrade to Triple</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Limited tier — preview with upgrade CTA
  if (hasLimitedLifting && !hasFullLifting) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>STRENGTH</Text>
            <Text style={styles.headerTitle}>Strength System</Text>
          </View>
        </View>
        <View style={styles.lockedState}>
          <Ionicons name="clipboard-outline" size={48} color={ACCENT} />
          <Text style={styles.lockedTitle}>
            {moverDone ? 'Assessment Complete' : 'Strength Assessment'}
          </Text>
          <Text style={styles.lockedDesc}>
            {moverDone
              ? 'Your strength diagnostic is complete. Upgrade to Triple for full access to personalized programs and daily training.'
              : 'Take the Athletic Profile Assessment to discover your mover type. Upgrade to Triple for full access.'}
          </Text>
          {!moverDone && (
            <TouchableOpacity
              style={[styles.ctaFull, { backgroundColor: ACCENT }]}
              onPress={() => router.push('/(app)/training/sc/diagnostics' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaFullText}>Start Assessment</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.ctaFull, { backgroundColor: colors.surface, borderWidth: 1, borderColor: ACCENT + '40' }]}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Text style={[styles.ctaFullText, { color: ACCENT }]}>Upgrade to Triple</Text>
            <Ionicons name="arrow-forward" size={16} color={ACCENT} />
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
          <Text style={styles.headerSup}>STRENGTH</Text>
          <Text style={styles.headerTitle}>Strength System</Text>
        </View>
        <TouchableOpacity
          style={styles.diagBtn}
          onPress={() => router.push('/(app)/training/sc/diagnostics' as any)}
        >
          <Ionicons name="clipboard-outline" size={18} color={ACCENT} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ═══════ EXECUTION LAYER ═══════ */}

        {/* A. Today's Strength Focus */}
        {moverDone && moverData ? (
          <View style={[styles.focusCard, { borderColor: (profileSummary?.accentColor ?? ACCENT) + '30' }]}>
            {/* Profile Identity */}
            <View style={styles.focusHeader}>
              <View style={[styles.focusIconWrap, { backgroundColor: (profileSummary?.accentColor ?? ACCENT) + '15' }]}>
                <Ionicons name="flash" size={18} color={profileSummary?.accentColor ?? ACCENT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.focusLabel}>YOUR STRENGTH PROFILE</Text>
                <Text style={styles.focusArchetype}>
                  {profileSummary ? profileSummary.whoYouAre.split('.')[0] : moverData.name}
                </Text>
              </View>
            </View>

            {/* Biggest Need */}
            {profileSummary && (
              <View style={[styles.summaryBlock, { borderColor: '#f59e0b30' }]}>
                <Ionicons name="flag" size={13} color="#f59e0b" />
                <Text style={styles.summaryText}>{profileSummary.biggestNeed}</Text>
              </View>
            )}

            {/* Program Emphasis */}
            {profileSummary && (
              <View style={styles.summaryBlock}>
                <Ionicons name="trending-up" size={13} color="#22c55e" />
                <Text style={styles.summaryText}>{profileSummary.programEmphasis}</Text>
              </View>
            )}

            {/* Program Reduces */}
            {profileSummary && (
              <View style={styles.summaryBlock}>
                <Ionicons name="trending-down" size={13} color="#ef4444" />
                <Text style={styles.summaryText}>{profileSummary.programReduces}</Text>
              </View>
            )}

            {/* Daily Work */}
            {profileSummary ? (
              <View style={styles.recipeWrap}>
                <Text style={[styles.recipeLabel, { color: ACCENT }]}>DAILY WORK</Text>
                <Text style={styles.toolName}>{profileSummary.dailyWork.title}</Text>
                <Text style={styles.focusSub}>{profileSummary.dailyWork.description}</Text>
              </View>
            ) : dailyWorkRecipe ? (
              <View style={styles.recipeWrap}>
                <Text style={[styles.recipeLabel, { color: ACCENT }]}>DAILY WORK</Text>
                {dailyWorkRecipe.buckets.slice(0, 4).map((bucket: string) => (
                  <View key={bucket} style={styles.toolRow}>
                    <View style={[styles.toolDot, { backgroundColor: ACCENT }]} />
                    <Text style={styles.toolName}>{bucket.replace(/_/g, ' ')}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {/* My Path */}
            {profileSummary ? (
              <TouchableOpacity
                style={[styles.pathRow, { borderColor: '#8b5cf630' }]}
                onPress={() => router.push('/(app)/training/sc/my-path' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="map-outline" size={14} color="#8b5cf6" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pathTitle, { color: '#8b5cf6' }]}>{profileSummary.myPath.title}</Text>
                  <Text style={styles.pathStep}>{profileSummary.myPath.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            ) : myPathLane ? (
              <TouchableOpacity
                style={[styles.pathRow, { borderColor: '#8b5cf630' }]}
                onPress={() => router.push('/(app)/training/sc/my-path' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="map-outline" size={14} color="#8b5cf6" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pathTitle, { color: '#8b5cf6' }]}>{myPathLane.title}</Text>
                  <Text style={styles.pathStep}>{myPathLane.steps[0]}</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}

            {/* Stop Overdoing */}
            {profileSummary && profileSummary.stopOverdoing.length > 0 && (
              <View style={[styles.summaryBlock, { borderColor: '#ef444430' }]}>
                <Ionicons name="warning" size={13} color="#ef4444" />
                <Text style={[styles.summaryText, { color: '#ef4444' }]}>
                  Stop overdoing: {profileSummary.stopOverdoing[0]}
                </Text>
              </View>
            )}

            {/* CTA */}
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
              onPress={() => router.push('/(app)/training/sc/workout' as any)}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle" size={18} color="#fff" />
              <Text style={styles.ctaBtnText}>Start Today's Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.focusCard, { borderColor: ACCENT + '30' }]}
            onPress={() => router.push('/(app)/training/sc/diagnostics' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.focusHeader}>
              <View style={[styles.focusIconWrap, { backgroundColor: ACCENT + '15' }]}>
                <Ionicons name="clipboard-outline" size={18} color={ACCENT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.focusLabel}>STRENGTH DIAGNOSTIC</Text>
                <Text style={styles.focusArchetype}>Complete Your Assessment</Text>
                <Text style={styles.focusSub}>Athletic Profile Assessment · Personalized program</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={24} color={ACCENT} />
            </View>
          </TouchableOpacity>
        )}

        {/* B. Quick Compete */}
        {/* Expandable Profile Card */}
        {moverData && (
          <ExpandableProfileCard
            accent={ACCENT}
            title={moverData.name}
            subtitle={moverData.shortLabel}
            collapsedStrengths={moverData.strengths.slice(0, 3)}
            collapsedWatchOuts={moverData.watchOuts.slice(0, 2)}
            expandedSections={[
              { label: 'STRENGTHS', items: moverData.strengths, color: ACCENT },
              { label: 'WATCH-OUTS', items: moverData.watchOuts, color: '#f59e0b' },
              { label: 'KEY CUES', items: moverData.cues, color: ACCENT },
              { label: 'TRAINING EMPHASIS', items: moverData.trainingEmphasis, color: ACCENT },
            ]}
          />
        )}

        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(app)/training/sc/mobility/category?cat=movement_prep' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-outline" size={22} color={ACCENT} />
            <Text style={styles.quickTitle}>Movement{'\n'}Prep</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(app)/training/sc/mobility/category?cat=yoga_flow' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="leaf-outline" size={22} color="#8b5cf6" />
            <Text style={styles.quickTitle}>Recovery{'\n'}Flows</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(app)/training/sc/mobility/category?cat=mobility' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="body-outline" size={22} color="#0891b2" />
            <Text style={styles.quickTitle}>Mobility{'\n'}Flows</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Dashboard Link */}
        {moverDone && (
          <TouchableOpacity
            style={[styles.progressLink, { borderColor: '#3b82f630' }]}
            onPress={() => router.push('/(app)/training/sc/progress' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="analytics" size={16} color="#3b82f6" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.progressLinkTitle, { color: '#3b82f6' }]}>Your Progress</Text>
              <Text style={styles.focusSub}>Compliance, readiness, trends & status</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* C. Today's Cue */}
        <View style={styles.cueCard}>
          <Ionicons name="mic-outline" size={14} color={ACCENT} />
          <Text style={styles.cueText}>{todayCue}</Text>
        </View>

        {/* ═══════ BUILD YOUR GAME ═══════ */}
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

  /* ── Daily Work recipe ──────────────── */
  recipeWrap: { gap: 4, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.border },
  summaryBlock: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 10, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, backgroundColor: colors.bg,
  },
  summaryText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  progressLink: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.md,
  },
  progressLinkTitle: { fontSize: 13, fontWeight: '800' },
  recipeLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },

  /* ── My Path lane ───────────────────── */
  pathRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 10, backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.md,
  },
  pathTitle: { fontSize: 12, fontWeight: '900' },
  pathStep: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

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

/**
 * Mobility Home — Execution-first landing screen.
 *
 * Architecture (mirrors Mental / Hitting / Strength):
 *   1. EXECUTION: Today's Flow Focus + Quick Actions + Today's Cue
 *   2. BUILD YOUR GAME: Mobility, Movement Prep, Yoga categories
 */

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useDiagnosticResult } from '@/hooks/useDiagnosticResult';
import { LIFTING_MOVER_TYPES } from '@/data/lifting-mover-type-data';
import { FLOWS, getFlowsByCategory, filterFlows } from '@/data/mobility-vault/flows';
import { MOBILITY_VAULT_CATEGORIES } from '@/data/mobility-vault/categories';
import { getAllDrills } from '@/data/mobility-vault/library';
import type { Flow } from '@/data/mobility-vault/types';

const ACCENT = '#0891b2';

// ── Daily cue rotation ──────────────────────────────────────────────────────

const DAILY_CUES = [
  'Move well before you move fast.',
  'Access the position. Own the position.',
  'Prep the body. Protect the body.',
  'Breathing is the first movement.',
  'Recovery is training. Treat it that way.',
  'Control what you can. Move with intent.',
  'Quality positions create quality performance.',
];

// ── Build Your Game items ───────────────────────────────────────────────────

interface BuildItem {
  key: string;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: string;
}

const BUILD_ITEMS: BuildItem[] = [
  { key: 'mobility', label: 'Mobility Flows', sub: 'Joint access & range of motion', icon: 'body-outline', color: '#3b82f6', category: 'mobility' },
  { key: 'movement_prep', label: 'Movement Prep', sub: 'Activation, control & CNS prep', icon: 'flash-outline', color: '#22c55e', category: 'movement_prep' },
  { key: 'yoga_flow', label: 'Yoga & Recovery', sub: 'Recovery, restoration & breathing', icon: 'leaf-outline', color: '#8b5cf6', category: 'yoga_flow' },
];

// ── Resolve today's recommended flows ───────────────────────────────────────

function getTodaysFlows(moverType: string | null): Flow[] {
  if (!moverType) return FLOWS.filter((f) => f.active && f.featured).slice(0, 3);

  const archFlows = filterFlows({ archetype: moverType });
  // Pick one from each category
  const mobility = archFlows.find((f) => f.category === 'mobility');
  const prep = archFlows.find((f) => f.category === 'movement_prep');
  const yoga = archFlows.find((f) => f.category === 'yoga_flow');
  return [mobility, prep, yoga].filter(Boolean) as Flow[];
}

// ── Component ───────────────────────────────────────────────────────────────

export default function MobilityHome() {
  const { result: moverType } = useDiagnosticResult('sc', 'lifting-mover');

  const moverData = moverType ? LIFTING_MOVER_TYPES[moverType] : null;
  const todaysFlows = getTodaysFlows(moverType);
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const todayCue = DAILY_CUES[dayIndex % DAILY_CUES.length];

  const mobCount = getFlowsByCategory('mobility').length;
  const prepCount = getFlowsByCategory('movement_prep').length;
  const yogaCount = getFlowsByCategory('yoga_flow').length;
  const drillCount = getAllDrills().length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MOBILITY</Text>
          <Text style={styles.headerTitle}>Movement System</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ═══════ EXECUTION LAYER ═══════ */}

        {/* A. Today's Flow Focus */}
        <View style={[styles.focusCard, { borderColor: ACCENT + '30' }]}>
          <View style={styles.focusHeader}>
            <View style={[styles.focusIconWrap, { backgroundColor: ACCENT + '15' }]}>
              <Ionicons name="flash" size={18} color={ACCENT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.focusLabel}>TODAY'S MOVEMENT FOCUS</Text>
              <Text style={styles.focusArchetype}>
                {moverData ? moverData.name : 'Recommended Flows'}
              </Text>
            </View>
          </View>

          {todaysFlows.map((flow) => {
            const catMeta = MOBILITY_VAULT_CATEGORIES.find((c) => c.slug === flow.category);
            return (
              <TouchableOpacity
                key={flow.id}
                style={styles.toolRow}
                onPress={() => router.push(`/(app)/training/sc/mobility/${flow.slug}` as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.toolDot, { backgroundColor: catMeta?.color ?? ACCENT }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.toolName}>{flow.shortTitle}</Text>
                  <Text style={styles.toolSub}>{flow.durationMinutes} min · {flow.category === 'mobility' ? 'Mobility' : flow.category === 'movement_prep' ? 'Prep' : 'Recovery'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
            onPress={() => {
              if (todaysFlows[0]) router.push(`/(app)/training/sc/mobility/${todaysFlows[0].slug}` as any);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="play-circle" size={18} color="#fff" />
            <Text style={styles.ctaBtnText}>Start Flow</Text>
          </TouchableOpacity>
        </View>

        {/* B. Quick Actions */}
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(app)/training/sc/mobility/category?cat=mobility' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="body-outline" size={22} color="#3b82f6" />
            <Text style={styles.quickTitle}>Pre-Training{'\n'}Mobility</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(app)/training/sc/mobility/category?cat=yoga_flow' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="leaf-outline" size={22} color="#8b5cf6" />
            <Text style={styles.quickTitle}>Recovery{'\n'}Flow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(app)/training/sc/mobility/category?cat=movement_prep' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-outline" size={22} color="#22c55e" />
            <Text style={styles.quickTitle}>Movement{'\n'}Prep</Text>
          </TouchableOpacity>
        </View>

        {/* C. Today's Cue */}
        <View style={styles.cueCard}>
          <Ionicons name="mic-outline" size={14} color={ACCENT} />
          <Text style={styles.cueText}>{todayCue}</Text>
        </View>

        {/* ═══════ BUILD YOUR GAME ═══════ */}
        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>BUILD YOUR GAME</Text>

        <View style={styles.buildGrid}>
          {BUILD_ITEMS.map((item) => {
            const count = item.category === 'mobility' ? mobCount : item.category === 'movement_prep' ? prepCount : yogaCount;
            return (
              <TouchableOpacity
                key={item.key}
                style={styles.buildCard}
                onPress={() => router.push(`/(app)/training/sc/mobility/category?cat=${item.category}` as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.buildIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.buildLabel}>{item.label}</Text>
                <Text style={styles.buildSub}>{count} flow{count !== 1 ? 's' : ''} · {item.sub}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Mobility Library — master movement database */}
          <TouchableOpacity
            style={styles.buildCard}
            onPress={() => router.push('/(app)/training/sc/mobility/library' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.buildIcon, { backgroundColor: ACCENT + '15' }]}>
              <Ionicons name="library-outline" size={20} color={ACCENT} />
            </View>
            <Text style={styles.buildLabel}>Movement Library</Text>
            <Text style={styles.buildSub}>{drillCount} movements · Search & filter</Text>
          </TouchableOpacity>
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

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  focusCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 10,
  },
  focusHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  focusIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  focusLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  focusArchetype: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },

  toolRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border,
  },
  toolDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  toolName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  toolSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: radius.md,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 4 },

  quickRow: { flexDirection: 'row', gap: 8 },
  quickCard: {
    flex: 1, alignItems: 'center', gap: 6,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  quickTitle: { fontSize: 11, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', lineHeight: 15 },

  cueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.md, padding: 12,
  },
  cueText: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary, fontStyle: 'italic' },

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
});

/**
 * ProfileFocusCard — "YOUR FOCUS" dashboard section.
 *
 * Shows the athlete's improvement priorities derived from real profile data.
 * Each focus item maps to a canonical skill key tied to existing vault content.
 *
 * Sources:
 *   Hitting: mechanical diagnostic primary → mapped to vault section key
 *   Mental:  archetype → first 2 ARCHETYPE_FOCUS items
 *   Physical: strength profile deficiency
 */

import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, radius } from '@/theme';
import { useDiagnosticResult } from '@/hooks/useDiagnosticResult';
import { useMentalProfile } from '@/hooks/useMentalProfile';
import { loadStrengthProfile, DEFICIENCY_META, type StrengthProfile } from '@/data/strength-profile';

// ── Canonical Hitting Skill Keys ────────────────────────────────────────────
// These match the exact vault section keys in hitting-vault-sections.ts

type HittingSkillKey = 'foundations' | 'timing' | 'forward-move' | 'posture' | 'direction' | 'barrel-turn' | 'connection' | 'extension';

const HITTING_SKILL_META: Record<HittingSkillKey, { label: string; icon: string }> = {
  foundations:  { label: 'Foundations',   icon: 'construct-outline' },
  timing:       { label: 'Timing',       icon: 'timer-outline' },
  'forward-move': { label: 'Forward Move', icon: 'arrow-forward-outline' },
  posture:      { label: 'Posture',      icon: 'body-outline' },
  direction:    { label: 'Direction',    icon: 'compass-outline' },
  'barrel-turn':  { label: 'Barrel Turn',  icon: 'baseball-outline' },
  connection:   { label: 'Connection',   icon: 'link-outline' },
  extension:    { label: 'Extension',    icon: 'resize-outline' },
};

// Maps mechanical diagnostic primary issue → vault section key
const MECH_ISSUE_TO_SKILL: Record<string, HittingSkillKey> = {
  timing:         'timing',
  weight_shift:   'forward-move',
  early_rotation: 'connection',
  disconnection:  'barrel-turn',
  swing_plane:    'posture',
  barrel_path:    'barrel-turn',
};

// ── Canonical Mental Skill Keys (first 6 course keys) ───────────────────────

type MentalSkillKey = 'awareness' | 'confidence' | 'focus' | 'emotional-control' | 'resilience' | 'accountability';

const MENTAL_SKILL_META: Record<MentalSkillKey, { label: string; icon: string }> = {
  awareness:          { label: 'Awareness',        icon: 'eye-outline' },
  confidence:         { label: 'Confidence',       icon: 'shield-checkmark-outline' },
  focus:              { label: 'Focus',            icon: 'scan-outline' },
  'emotional-control':  { label: 'Emotional Control', icon: 'heart-outline' },
  resilience:         { label: 'Resilience',       icon: 'trending-up-outline' },
  accountability:     { label: 'Accountability',   icon: 'checkbox-outline' },
};

// Maps archetype → top 2 mental skill keys to focus on
const ARCHETYPE_TO_MENTAL_SKILLS: Record<string, MentalSkillKey[]> = {
  reactor:     ['emotional-control', 'resilience'],
  overthinker: ['focus', 'awareness'],
  avoider:     ['confidence', 'accountability'],
  performer:   ['awareness', 'accountability'],
  doubter:     ['confidence', 'resilience'],
  driver:      ['awareness', 'emotional-control'],
};

// ── Component ───────────────────────────────────────────────────────────────

interface FocusItem {
  key: string;
  label: string;
  icon: string;
  color: string;
  route?: string;
}

export function ProfileFocusCard() {
  // ── Hitting ──
  const { result: mechResult } = useDiagnosticResult('hitting', 'mechanical');

  // ── Mental ──
  const { profile: mentalProfile } = useMentalProfile();

  // ── Strength ──
  const [strengthProfile, setStrengthProfile] = useState<StrengthProfile | null>(null);
  useFocusEffect(useCallback(() => {
    loadStrengthProfile().then(setStrengthProfile);
  }, []));

  // ── Derive hitting focus ──
  const hittingItems: FocusItem[] = [];
  if (mechResult) {
    const primaryKey = MECH_ISSUE_TO_SKILL[mechResult.primary];
    if (primaryKey) {
      const meta = HITTING_SKILL_META[primaryKey];
      hittingItems.push({
        key: primaryKey,
        label: meta.label,
        icon: meta.icon,
        color: '#E10600',
        route: `/(app)/training/mechanical/${primaryKey}`,
      });
    }
    if (mechResult.secondary && mechResult.secondary !== mechResult.primary) {
      const secondaryKey = MECH_ISSUE_TO_SKILL[mechResult.secondary];
      if (secondaryKey && secondaryKey !== hittingItems[0]?.key) {
        const meta = HITTING_SKILL_META[secondaryKey];
        hittingItems.push({
          key: secondaryKey,
          label: meta.label,
          icon: meta.icon,
          color: '#E10600',
          route: `/(app)/training/mechanical/${secondaryKey}`,
        });
      }
    }
  }

  // ── Derive mental focus ──
  const mentalItems: FocusItem[] = [];
  if (mentalProfile?.primary_archetype) {
    const skills = ARCHETYPE_TO_MENTAL_SKILLS[mentalProfile.primary_archetype];
    if (skills) {
      for (const skillKey of skills.slice(0, 2)) {
        const meta = MENTAL_SKILL_META[skillKey];
        mentalItems.push({
          key: skillKey,
          label: meta.label,
          icon: meta.icon,
          color: '#A78BFA',
          route: `/(app)/training/mental/${skillKey}`,
        });
      }
    }
  }

  // ── Derive physical focus ──
  const physicalItems: FocusItem[] = [];
  if (strengthProfile?.deficiency) {
    const meta = DEFICIENCY_META[strengthProfile.deficiency];
    if (meta) {
      physicalItems.push({
        key: strengthProfile.deficiency,
        label: meta.label,
        icon: meta.icon,
        color: '#1DB954',
      });
    }
  }

  const hasAnyData = hittingItems.length > 0 || mentalItems.length > 0 || physicalItems.length > 0;

  if (!hasAnyData) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(app)/training' as any)}
        activeOpacity={0.85}
      >
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="analytics-outline" size={16} color="#3b82f6" />
          </View>
          <Text style={styles.headerLabel}>YOUR FOCUS</Text>
        </View>
        <Text style={styles.emptyText}>
          Complete your vault diagnostics to see your personalized improvement priorities.
        </Text>
        <View style={styles.ctaRow}>
          <Ionicons name="arrow-forward-circle-outline" size={16} color="#3b82f6" />
          <Text style={styles.ctaText}>Go to Lab</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="analytics-outline" size={16} color="#3b82f6" />
        </View>
        <Text style={styles.headerLabel}>YOUR FOCUS</Text>
      </View>

      {hittingItems.length > 0 && (
        <FocusSection label="HITTING" accent="#E10600" items={hittingItems} />
      )}
      {mentalItems.length > 0 && (
        <FocusSection label="MENTAL" accent="#A78BFA" items={mentalItems} />
      )}
      {physicalItems.length > 0 && (
        <FocusSection label="PHYSICAL" accent="#1DB954" items={physicalItems} />
      )}
    </View>
  );
}

function FocusSection({ label, accent, items }: { label: string; accent: string; items: FocusItem[] }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: accent }]}>{label}</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.focusRow}
          onPress={() => { if (item.route) router.push(item.route as any); }}
          activeOpacity={item.route ? 0.7 : 1}
          disabled={!item.route}
        >
          <Ionicons name={item.icon as any} size={13} color={item.color} style={{ width: 18 }} />
          <Text style={styles.focusText} numberOfLines={1}>{item.label}</Text>
          {item.route && <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 10,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#3b82f618',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
  },
  section: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 3,
  },
  focusText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});

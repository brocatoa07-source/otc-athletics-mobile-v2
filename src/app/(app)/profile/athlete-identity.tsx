/**
 * Athlete Identity — Clean blueprint screen.
 *
 * Shows the athlete's core identity across three vaults:
 *   Hitting Identity → from diagnostic result (Supabase-backed)
 *   Mental Identity  → from mental_profiles table (Supabase-backed)
 *   Strength Identity → from strength profile (AsyncStorage)
 *
 * Each section shows:
 *   - Profile name + short description
 *   - Current emphasis (from diagnostic focus mapping)
 *   - CTA to open the vault
 *
 * No XP, levels, badges, streaks, or skill progress bars.
 */

import { useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { useDiagnosticResult } from '@/hooks/useDiagnosticResult';
import { useMentalProfile } from '@/hooks/useMentalProfile';
import { ARCHETYPE_INFO } from '@/data/mental-diagnostics-data';
import {
  loadStrengthProfile,
  DEFICIENCY_META,
  type StrengthProfile,
} from '@/data/strength-profile';
import { LIFTING_MOVER_TYPES } from '@/data/lifting-mover-type-data';

// ── Focus mapping ────────────────────────────────────────────────────────────

const MENTAL_SKILL_LABELS: Record<string, string> = {
  awareness: 'Awareness', confidence: 'Confidence', focus: 'Focus',
  'emotional-control': 'Emotional Control', resilience: 'Resilience', accountability: 'Accountability',
};

const ARCHETYPE_TO_MENTAL: Record<string, string[]> = {
  reactor: ['emotional-control', 'resilience'], overthinker: ['focus', 'awareness'],
  avoider: ['confidence', 'accountability'], performer: ['awareness', 'accountability'],
  doubter: ['confidence', 'resilience'], driver: ['awareness', 'emotional-control'],
};

export default function AthleteIdentityScreen() {
  const user = useAuthStore((s) => s.user);
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? 'Athlete';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  // ── Mental (Supabase-backed) ──
  const { profile: mentalProfile } = useMentalProfile();

  // ── Strength (AsyncStorage) ──
  const [strengthProfile, setStrengthProfile] = useState<StrengthProfile | null>(null);
  const { result: liftingMover } = useDiagnosticResult('sc', 'lifting-mover');
  useFocusEffect(useCallback(() => {
    loadStrengthProfile().then(setStrengthProfile);
  }, []));

  // ── Derive display data ──

  // Mental
  const archKey = mentalProfile?.primary_archetype as keyof typeof ARCHETYPE_INFO | undefined;
  const mentalInfo = archKey ? ARCHETYPE_INFO[archKey] : null;
  const mentalEmphasisKeys = archKey ? ARCHETYPE_TO_MENTAL[archKey] : null;
  const mentalEmphasis = mentalEmphasisKeys
    ? mentalEmphasisKeys.map((k) => MENTAL_SKILL_LABELS[k]).filter(Boolean).join(' + ')
    : null;

  // Strength — use the rich LIFTING_MOVER_TYPES data as primary source
  const liftingData = liftingMover ? LIFTING_MOVER_TYPES[liftingMover] : null;
  const strengthName = liftingData?.name ?? null;
  // Use first sentence of description for "what it means" (matches hitting summary length)
  const strengthDesc = liftingData?.description.split('.')[0]
    ? liftingData.description.split('.')[0] + '.'
    : null;
  const strengthTendency = liftingData?.primaryCue ?? null;
  const strengthEmphasis = strengthProfile?.deficiency
    ? DEFICIENCY_META[strengthProfile.deficiency]?.label
    : (liftingData?.trainingFocus[0] ?? null);

  const hasAnyProfile = !!mentalInfo || !!strengthName;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Athlete Identity</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Name header */}
        <View style={styles.nameRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
        </View>

        {!hasAnyProfile && (
          <View style={styles.emptyCard}>
            <Ionicons name="clipboard-outline" size={28} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No profiles yet</Text>
            <Text style={styles.emptyDesc}>Complete your vault diagnostics to build your athlete blueprint.</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(app)/training' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyBtnText}>Go to Lab</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Mental Identity ──────────────────── */}
        {mentalInfo && (
          <IdentitySection
            vaultLabel="MENTAL IDENTITY"
            accent="#A78BFA"
            icon="brain-outline"
            profileName={mentalInfo.name}
            description={mentalInfo.tagline}
            emphasis={mentalEmphasis}
            ctaLabel="Open Mental Vault"
            onCta={() => router.push('/(app)/training/mental' as any)}
          />
        )}

        {/* ── Strength Identity ────────────────── */}
        {strengthName && (
          <IdentitySection
            vaultLabel="STRENGTH IDENTITY"
            accent="#1DB954"
            icon="barbell-outline"
            profileName={strengthName}
            description={strengthDesc}
            tendency={strengthTendency}
            emphasis={strengthEmphasis}
            ctaLabel="Open Strength Vault"
            onCta={() => router.push('/(app)/training/sc' as any)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Reusable Section ────────────────────────────────────────────────────────

function IdentitySection({
  vaultLabel,
  accent,
  icon,
  profileName,
  description,
  tendency,
  emphasis,
  ctaLabel,
  onCta,
}: {
  vaultLabel: string;
  accent: string;
  icon: string;
  profileName: string;
  description: string | null;
  tendency?: string | null;
  emphasis: string | null;
  ctaLabel: string;
  onCta: () => void;
}) {
  return (
    <View style={[styles.section, { borderColor: accent + '25' }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: accent + '15' }]}>
          <Ionicons name={icon as any} size={18} color={accent} />
        </View>
        <Text style={[styles.sectionLabel, { color: accent }]}>{vaultLabel}</Text>
      </View>

      <Text style={styles.profileName}>{profileName}</Text>
      {description && <Text style={styles.profileDesc}>{description}</Text>}

      {tendency && (
        <View style={styles.tendencyRow}>
          <Text style={styles.tendencyLabel}>Strength Tendency:</Text>
          <Text style={styles.tendencyValue}>{tendency}</Text>
        </View>
      )}

      {emphasis && (
        <View style={styles.emphasisRow}>
          <Text style={styles.emphasisLabel}>Current Emphasis:</Text>
          <Text style={[styles.emphasisValue, { color: accent }]}>{emphasis}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.ctaBtn, { borderColor: accent + '40' }]}
        onPress={onCta}
        activeOpacity={0.85}
      >
        <Text style={[styles.ctaBtnText, { color: accent }]}>{ctaLabel}</Text>
        <Ionicons name="chevron-forward" size={14} color={accent} />
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  content: { padding: 20, gap: 14, paddingBottom: 60 },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontWeight: '900', fontSize: 16 },
  name: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  emptyCard: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  emptyDesc: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  emptyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: '#3b82f6',
    marginTop: 4,
  },
  emptyBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 16,
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  profileDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  tendencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tendencyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tendencyValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  emphasisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emphasisLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  emphasisValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  ctaBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});

import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useGating } from '@/hooks/useGating';
import {
  LIFTING_MOVER_TYPES,
  type LiftingMoverType,
} from '@/data/lifting-mover-type-data';
import { loadStrengthProfile, ARCHETYPE_META, type StrengthProfile } from '@/data/strength-profile';
import { loadValidatedProgram, loadStrengthProgress, regenerateFromProfile, type GeneratedProgram, type StrengthProgress, getCompletionCount } from '@/data/strength-program-engine';

const ACCENT = '#1DB954';

interface ExploreItem {
  key: string;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

const EXPLORE_ITEMS: ExploreItem[] = [
  { key: 'exercises', label: 'Exercise Library', sub: 'Strength, accessory & core exercises', icon: 'barbell-outline', color: '#3b82f6', route: '/(app)/training/sc/exercises?category=exercises' },
  { key: 'mobility', label: 'Mobility Bank', sub: 'Warm-up, recovery & mobility drills', icon: 'body-outline', color: '#22c55e', route: '/(app)/training/sc/exercises?category=mobility' },
  { key: 'power', label: 'Power Drills', sub: 'Plyometrics & explosive movements', icon: 'flash-outline', color: '#f59e0b', route: '/(app)/training/sc/exercises?category=power' },
  { key: 'conditioning', label: 'Conditioning', sub: 'Sprint work & conditioning drills', icon: 'heart-outline', color: '#ef4444', route: '/(app)/training/sc/exercises?category=conditioning' },
  { key: 'fuel', label: 'Fuel The Engine', sub: 'Performance nutrition', icon: 'flame-outline', color: '#10b981', route: '/(app)/training/sc/fuel' },
];

export default function SCVaultIndex() {
  const { isWalk, hasLimitedLifting, hasFullLifting } = useTier();
  const { gate } = useGating();
  const [moverType, setMoverType] = useState<LiftingMoverType | null>(null);
  const [profile, setProfile] = useState<StrengthProfile | null>(null);
  const [program, setProgram] = useState<GeneratedProgram | null>(null);
  const [progress, setProgress] = useState<StrengthProgress | null>(null);
  const [exploreExpanded, setExploreExpanded] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const moverDone = gate.sc.moverDone;

  useEffect(() => {
    AsyncStorage.getItem('otc:lifting-mover-type').then((val) => {
      if (val) setMoverType(val as LiftingMoverType);
    });
    loadStrengthProfile().then(setProfile);
    loadValidatedProgram().then(setProgram);
    loadStrengthProgress().then(setProgress);
  }, []);

  const profileComplete = moverDone && !!profile;
  const programReady = profileComplete && !!program;
  const needsRegeneration = profileComplete && !program;

  async function handleRegenerate() {
    setRegenerating(true);
    const newProgram = await regenerateFromProfile();
    if (newProgram) {
      setProgram(newProgram);
      const prog = await loadStrengthProgress();
      setProgress(prog);
    }
    setRegenerating(false);
  }

  // Walk tier — fully locked
  if (isWalk) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>STRENGTH VAULT</Text>
            <Text style={styles.headerTitle}>OTC Strength System</Text>
          </View>
        </View>
        <View style={styles.lockedState}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textMuted} />
          <Text style={styles.lockedTitle}>Strength Vault Locked</Text>
          <Text style={styles.lockedDesc}>
            Upgrade to unlock the full Strength System with personalized programs, exercise library, and daily training.
          </Text>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>Upgrade to Single</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Single tier — diagnostic-only access
  if (hasLimitedLifting && !hasFullLifting) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>STRENGTH VAULT</Text>
            <Text style={styles.headerTitle}>OTC Strength System</Text>
          </View>
        </View>
        <View style={styles.lockedState}>
          <Ionicons name="clipboard-outline" size={48} color={ACCENT} />
          <Text style={styles.lockedTitle}>
            {moverDone ? 'Assessment Complete' : 'Strength Assessment'}
          </Text>
          <Text style={styles.lockedDesc}>
            {moverDone
              ? 'Your Strength diagnostic is complete. Upgrade to Double to unlock the full Strength Vault with personalized programs, exercise library, and daily training.'
              : 'Take the Athletic Profile Assessment to discover your mover type. Upgrade to Double to unlock the full Strength Vault.'}
          </Text>
          {!moverDone && (
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
              onPress={() => router.push('/(app)/training/sc/diagnostics' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaBtnText}>Start Assessment</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: ACCENT + '40' }]}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Text style={[styles.ctaBtnText, { color: ACCENT }]}>Upgrade to Double</Text>
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
          <Text style={styles.headerSup}>STRENGTH VAULT</Text>
          <Text style={styles.headerTitle}>OTC Strength System</Text>
        </View>
        <TouchableOpacity
          style={styles.diagBtn}
          onPress={() => router.push('/(app)/training/sc/diagnostics' as any)}
        >
          <Ionicons name="clipboard-outline" size={18} color={ACCENT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Mover Type Profile Card */}
        {moverType && (
          <TouchableOpacity
            style={[styles.profileBanner, { borderColor: LIFTING_MOVER_TYPES[moverType].color + '40' }]}
            onPress={() => router.push('/(app)/training/sc/lifting-mover-quiz' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.profileDot, { backgroundColor: LIFTING_MOVER_TYPES[moverType].color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileLabel}>YOUR MOVER TYPE</Text>
              <Text style={[styles.profileType, { color: LIFTING_MOVER_TYPES[moverType].color }]}>
                {LIFTING_MOVER_TYPES[moverType].name}
              </Text>
              {profile && (
                <Text style={styles.profileSub}>
                  {ARCHETYPE_META[profile.archetype].label} · {profile.position.charAt(0).toUpperCase() + profile.position.slice(1)}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Setup CTA if profile not complete */}
        {moverDone && !profile && (
          <TouchableOpacity
            style={styles.setupCard}
            onPress={() => router.push('/(app)/training/sc/position-select' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.setupIcon, { backgroundColor: ACCENT + '18' }]}>
              <Ionicons name="settings-outline" size={24} color={ACCENT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.setupTitle}>Complete Your Profile</Text>
              <Text style={styles.setupSub}>Select your position and movement focus to generate your program.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Regenerate CTA if profile exists but program is stale/missing */}
        {needsRegeneration && (
          <TouchableOpacity
            style={styles.setupCard}
            onPress={handleRegenerate}
            activeOpacity={0.8}
            disabled={regenerating}
          >
            <View style={[styles.setupIcon, { backgroundColor: ACCENT + '18' }]}>
              <Ionicons name="refresh-outline" size={24} color={ACCENT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.setupTitle}>
                {regenerating ? 'Generating...' : 'Generate Your Program'}
              </Text>
              <Text style={styles.setupSub}>
                Your profile is ready. Tap to generate your personalized 6-month program.
              </Text>
            </View>
            {!regenerating && <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
          </TouchableOpacity>
        )}

        {/* Not assessed yet */}
        {!moverDone && (
          <TouchableOpacity
            style={styles.setupCard}
            onPress={() => router.push('/(app)/training/sc/diagnostics' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.setupIcon, { backgroundColor: ACCENT + '18' }]}>
              <Ionicons name="clipboard-outline" size={24} color={ACCENT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.setupTitle}>Start Your Assessment</Text>
              <Text style={styles.setupSub}>Take the Athletic Profile Assessment to unlock your personalized lifting path.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Preview mode banner */}
        {hasLimitedLifting && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={18} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Preview Mode</Text>
              <Text style={styles.upgradeSub}>
                Basic exercises unlocked. Upgrade to Double for personalized programs.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* ═══════ BLOCK 1: MY PATH ═══════ */}
        <TouchableOpacity
          style={styles.primaryCard}
          onPress={() => {
            if (programReady) {
              router.push('/(app)/training/sc/my-path' as any);
            } else if (needsRegeneration) {
              handleRegenerate();
            } else if (moverDone && !profile) {
              router.push('/(app)/training/sc/position-select' as any);
            } else {
              router.push('/(app)/training/sc/diagnostics' as any);
            }
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.primaryIcon, { backgroundColor: '#3b82f618' }]}>
            <Ionicons name="map-outline" size={24} color="#3b82f6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.primaryLabel}>My Path</Text>
            <Text style={styles.primarySub}>
              {programReady
                ? `Month ${progress?.currentMonth ?? 1} · Week ${progress?.currentWeek ?? 1}`
                : 'Complete setup to unlock'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══════ BLOCK 2: TODAY'S WORK ═══════ */}
        <TouchableOpacity
          style={[styles.primaryCard, { backgroundColor: ACCENT + '06', borderColor: ACCENT + '25' }]}
          onPress={() => {
            if (programReady) {
              router.push('/(app)/training/sc/workout' as any);
            } else {
              router.push('/(app)/training/sc/diagnostics' as any);
            }
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.primaryIcon, { backgroundColor: ACCENT + '18' }]}>
            <Ionicons name="flash" size={24} color={ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.primaryLabel}>Today's Workout</Text>
            <Text style={styles.primarySub}>
              {programReady
                ? `${progress ? getCompletionCount(progress) : 0} workouts completed`
                : 'Complete setup to unlock'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══════ BLOCK 3: EXPLORE MORE ═══════ */}
        <TouchableOpacity
          style={styles.exploreHeader}
          onPress={() => setExploreExpanded(!exploreExpanded)}
          activeOpacity={0.7}
        >
          <Ionicons name="compass-outline" size={20} color={ACCENT} />
          <Text style={styles.exploreHeaderText}>Explore More</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.exploreCount}>{EXPLORE_ITEMS.length} areas</Text>
          <Ionicons
            name={exploreExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {exploreExpanded && (
          <View style={styles.exploreGrid}>
            {EXPLORE_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.exploreCard}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.exploreIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.exploreLabel}>{item.label}</Text>
                <Text style={styles.exploreSub} numberOfLines={1}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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

  content: { padding: 16, paddingBottom: 60, gap: 12 },

  profileBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg, padding: 14,
  },
  profileDot: { width: 10, height: 10, borderRadius: 5 },
  profileLabel: { fontSize: 9, fontWeight: '900', color: colors.textMuted, letterSpacing: 1 },
  profileType: { fontSize: 16, fontWeight: '900' },
  profileSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  setupCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.lg, padding: 16,
  },
  setupIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  setupTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  setupSub: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 2 },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14,
  },
  upgradeTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  upgradeSub: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginTop: 2 },

  /* ── Primary blocks ─── */
  primaryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 18,
  },
  primaryIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryLabel: { fontSize: 17, fontWeight: '900', color: colors.textPrimary },
  primarySub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },

  /* ── Explore More ──────────────────────────── */
  exploreHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 4, marginTop: 4,
  },
  exploreHeaderText: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  exploreCount: { fontSize: 11, fontWeight: '700', color: colors.textMuted },

  exploreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  exploreCard: {
    width: '48%' as any,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  exploreIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  exploreLabel: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  exploreSub: { fontSize: 11, color: colors.textSecondary, lineHeight: 15 },

  /* ── Locked state ──────────────────────────── */
  lockedState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  lockedTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  lockedDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: radius.lg, marginTop: 4,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

import { useEffect, useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useGating } from '@/hooks/useGating';
import { useMentalProfile } from '@/hooks/useMentalProfile';
import { MENTAL_PROFILES, type MentalProfileData } from '@/data/mental-profile-data';
import { MentalProfileCard } from '@/components/training/MentalProfileCard';
import { MENTAL_VAULT_SECTIONS } from '@/data/mental-vault-sections';

/* ─── Flatten tools for search ───────────────────── */
interface SearchableTool {
  name: string;
  fixes: string;
  focus: string;
  sectionKey: string;
  sectionLabel: string;
  sectionColor: string;
}

const ALL_TOOLS: SearchableTool[] = MENTAL_VAULT_SECTIONS.flatMap((s) =>
  s.tools.map((t) => ({
    name: t.name,
    fixes: t.fixes,
    focus: t.focus,
    sectionKey: s.key,
    sectionLabel: s.label,
    sectionColor: s.color,
  })),
);

const ACCENT = '#8b5cf6';

interface ExploreItem {
  key: string;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

const EXPLORE_ITEMS: ExploreItem[] = [
  { key: 'courses', label: 'Courses', sub: '11 mental skills · Shadow → Mastery', icon: 'school-outline', color: '#8b5cf6', route: '/(app)/training/mental/courses-list' },
  { key: 'toolbox', label: 'Toolbox', sub: '5 categories · 70+ tools', icon: 'build-outline', color: '#f59e0b', route: '/(app)/training/mental/toolbox' },
  { key: 'journals', label: 'Journals', sub: '5 standard + 11 skill journals', icon: 'book-outline', color: '#3b82f6', route: '/(app)/training/mental/journals' },
  { key: 'meditations', label: 'Meditations', sub: '7 guided sessions · 3–8 min', icon: 'leaf-outline', color: '#a855f7', route: '/(app)/training/mental/meditations' },
  { key: 'reset', label: '10-Step Reset', sub: 'In-game re-center routine', icon: 'refresh-circle-outline', color: ACCENT, route: '/(app)/training/mental/ten-step-reset' },
  { key: 'dugout', label: 'Dugout Card', sub: 'Your game-time cue card', icon: 'document-text-outline', color: '#E10600', route: '/(app)/training/mental/dugout-card' },
  { key: 'identity', label: 'Identity Builder', sub: 'Statement, habits, tracker', icon: 'construct-outline', color: '#22c55e', route: '/(app)/training/mental/identity-builder' },
  { key: 'troubleshoot', label: 'Troubleshooting', sub: 'Fix common mental issues', icon: 'hammer-outline', color: '#ef4444', route: '/(app)/training/mental/troubleshooting' },
];

export default function MentalVaultIndex() {
  const { isWalk, hasLimitedMental } = useTier();
  const { gate } = useGating();
  const { profile: dbProfile, completedTypes } = useMentalProfile();
  const [profileResult, setProfileResult] = useState<MentalProfileData | null>(null);
  const [exploreExpanded, setExploreExpanded] = useState(false);
  const [search, setSearch] = useState('');

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return ALL_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.fixes.toLowerCase().includes(q) ||
        t.focus.toLowerCase().includes(q),
    );
  }, [search]);

  const mentalDiagDone = gate.mental.archetypeDone && gate.mental.identityDone && gate.mental.habitsDone;

  useEffect(() => {
    AsyncStorage.getItem('otc:mental-profile').then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val);
          const slug = parsed.slug ?? parsed;
          const found = Object.values(MENTAL_PROFILES).find((m) => m.slug === slug);
          if (found) setProfileResult(found);
        } catch {}
      }
    });
  }, []);

  // Walk tier — fully locked
  if (isWalk) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>MENTAL VAULT</Text>
            <Text style={styles.headerTitle}>The OTC Mental System</Text>
          </View>
        </View>
        <View style={styles.lockedState}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textMuted} />
          <Text style={styles.lockedTitle}>Mental Vault Locked</Text>
          <Text style={styles.lockedDesc}>
            Upgrade to unlock the full Mental Vault with personalized tools, courses, and daily mental work.
          </Text>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>Upgrade to Double</Text>
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
          <Text style={styles.headerSup}>MENTAL VAULT</Text>
          <Text style={styles.headerTitle}>The OTC Mental System</Text>
        </View>
        <TouchableOpacity
          style={styles.diagBtn}
          onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
        >
          <Ionicons name="clipboard-outline" size={18} color={ACCENT} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search mental tools..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      {search.trim().length > 0 ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {searchResults.length === 0 ? (
            <View style={styles.searchEmpty}>
              <Ionicons name="search-outline" size={40} color={colors.textMuted} />
              <Text style={styles.searchEmptyTitle}>No results found</Text>
              <Text style={styles.searchEmptySub}>No tools match "{search}"</Text>
            </View>
          ) : (
            <>
              <Text style={styles.searchCount}>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</Text>
              {searchResults.map((t) => (
                <TouchableOpacity
                  key={`${t.sectionKey}-${t.name}`}
                  style={styles.searchResultCard}
                  onPress={() => router.push(`/(app)/training/mental/${t.sectionKey}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.searchResultDot, { backgroundColor: t.sectionColor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.searchResultName}>{t.name}</Text>
                    <Text style={styles.searchResultFixes} numberOfLines={1}>{t.fixes}</Text>
                  </View>
                  <View style={[styles.searchResultTag, { backgroundColor: t.sectionColor + '15' }]}>
                    <Text style={[styles.searchResultTagText, { color: t.sectionColor }]}>{t.sectionLabel}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      ) : (

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card (DB-backed) */}
        {dbProfile && (
          <MentalProfileCard profile={dbProfile} completedTypes={completedTypes} />
        )}

        {/* Lightweight fallback profile */}
        {!dbProfile && profileResult && (
          <TouchableOpacity
            style={[styles.profileBanner, { borderColor: profileResult.color + '40' }]}
            onPress={() => router.push('/(app)/training/mental/mental-profile-quiz' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.profileDot, { backgroundColor: profileResult.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileLabel}>Your Mental Profile</Text>
              <Text style={[styles.profileType, { color: profileResult.color }]}>
                {profileResult.name}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Preview mode banner */}
        {hasLimitedMental && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={18} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Preview Mode</Text>
              <Text style={styles.upgradeSub}>
                Starter tools unlocked. Upgrade to Double for full access.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* ═══════ BLOCK 1: MY PATH ═══════ */}
        <TouchableOpacity
          style={styles.primaryCard}
          onPress={() => router.push('/(app)/training/mental/my-path' as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.primaryIcon, { backgroundColor: '#3b82f618' }]}>
            <Ionicons name="map-outline" size={24} color="#3b82f6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.primaryLabel}>My Path</Text>
            <Text style={styles.primarySub}>
              {mentalDiagDone
                ? 'Your personalized mental plan'
                : 'Complete diagnostics to unlock'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══════ BLOCK 2: TODAY'S WORK ═══════ */}
        <TouchableOpacity
          style={[styles.primaryCard, { backgroundColor: ACCENT + '06', borderColor: ACCENT + '25' }]}
          onPress={() => router.push('/(app)/training/mental/daily-work' as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.primaryIcon, { backgroundColor: ACCENT + '18' }]}>
            <Ionicons name="flash" size={24} color={ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.primaryLabel}>Today's Work</Text>
            <Text style={styles.primarySub}>
              {mentalDiagDone
                ? 'Your daily mental training tasks'
                : 'Complete diagnostics to unlock'}
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
      )}
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
  profileLabel: { fontSize: 10, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.8 },
  profileType: { fontSize: 16, fontWeight: '900' },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14,
  },
  upgradeTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  upgradeSub: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginTop: 2 },

  /* ── Primary blocks (My Path, Today's Work) ─── */
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

  exploreGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
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

  /* ── Search ──────────────────────────────────── */
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0 },
  searchEmpty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  searchEmptyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  searchEmptySub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  searchCount: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  searchResultCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  searchResultDot: { width: 8, height: 8, borderRadius: 4 },
  searchResultName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  searchResultFixes: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  searchResultTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  searchResultTagText: { fontSize: 10, fontWeight: '800' },
});

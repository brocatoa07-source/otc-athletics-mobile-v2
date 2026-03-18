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
import { MECHANICAL_ISSUES, type MechanicalDiagnosticResult } from '@/data/hitting-mechanical-diagnostic-data';
import {
  MOVEMENT_PROFILES,
  BAT_PATH_PROFILES,
  COMBINED_PROFILE_LABELS,
  COMBINED_PROFILE_SUMMARIES,
  HITTING_IDENTITY_STORAGE_KEY,
  type HittingIdentityDiagnosticResult,
} from '@/data/hitting-identity-data';
import { HITTING_VAULT_SECTIONS } from '@/data/hitting-vault-sections';
import { WEEKLY_CHALLENGES } from '@/data/daily-work';

/* ─── Flatten drills for search ──────────────────── */
interface SearchableDrill {
  name: string;
  fixes: string;
  focus: string;
  sectionKey: string;
  sectionLabel: string;
  sectionColor: string;
}

const ALL_DRILLS: SearchableDrill[] = HITTING_VAULT_SECTIONS.flatMap((s) =>
  s.drills.map((d) => ({
    name: d.name,
    fixes: d.fixes,
    focus: d.focus,
    sectionKey: s.key,
    sectionLabel: s.label,
    sectionColor: s.color,
  })),
);

const ACCENT = '#E10600';

interface ExploreItem {
  key: string;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

const EXPLORE_ITEMS: ExploreItem[] = [
  { key: 'foundations', label: 'Foundations', sub: 'Non-negotiable swing basics', icon: 'construct-outline', color: '#E10600', route: '/(app)/training/mechanical/foundations' },
  { key: 'timing', label: 'Timing', sub: 'Rhythm and sequencing', icon: 'timer-outline', color: '#f59e0b', route: '/(app)/training/mechanical/timing' },
  { key: 'forward-move', label: 'Forward Move', sub: 'Weight shift and stride', icon: 'arrow-forward-outline', color: '#3b82f6', route: '/(app)/training/mechanical/forward-move' },
  { key: 'posture', label: 'Posture', sub: 'Stay in your body', icon: 'body-outline', color: '#0891b2', route: '/(app)/training/mechanical/posture' },
  { key: 'direction', label: 'Direction', sub: 'Control where the ball goes', icon: 'compass-outline', color: '#22c55e', route: '/(app)/training/mechanical/direction' },
  { key: 'barrel-turn', label: 'Barrel Turn', sub: 'Hand path and bat speed', icon: 'sync-outline', color: '#a855f7', route: '/(app)/training/mechanical/barrel-turn' },
  { key: 'connection', label: 'Connection', sub: 'Arms, hands, and barrel', icon: 'link-outline', color: '#06b6d4', route: '/(app)/training/mechanical/connection' },
  { key: 'extension', label: 'Extension', sub: 'Contact zone and follow-through', icon: 'expand-outline', color: '#ec4899', route: '/(app)/training/mechanical/extension' },
  { key: 'troubleshoot', label: 'Troubleshooting', sub: 'Fix common mechanical issues', icon: 'hammer-outline', color: '#ef4444', route: '/(app)/training/mechanical/troubleshooting' },
  { key: 'library', label: 'Hitting Library', sub: 'Full drill catalog with search', icon: 'library-outline', color: '#E10600', route: '/(app)/training/mechanical/hitting-library' },
  { key: 'approach', label: 'Approach', sub: 'OTC Hitting Philosophy', icon: 'bulb-outline', color: '#f59e0b', route: '/(app)/training/mechanical/approach' },
  { key: 'video', label: 'Video Breakdown', sub: 'Swing analysis tools (coming soon)', icon: 'videocam-outline', color: '#64748b', route: '' },
];

export default function HittingVaultIndex() {
  const { hasLimitedHitting } = useTier();
  const { gate, isLoading } = useGating();
  const [identityResult, setIdentityResult] = useState<HittingIdentityDiagnosticResult | null>(null);
  const [mechResult, setMechResult] = useState<MechanicalDiagnosticResult | null>(null);
  const [exploreExpanded, setExploreExpanded] = useState(false);
  const [search, setSearch] = useState('');

  // Gate: redirect to diagnostics if hitting vault is locked
  useEffect(() => {
    if (!isLoading && !gate.hittingUnlocked) {
      router.replace('/(app)/training/mechanical/diagnostics' as any);
    }
  }, [isLoading, gate.hittingUnlocked]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return ALL_DRILLS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.fixes.toLowerCase().includes(q) ||
        d.focus.toLowerCase().includes(q),
    );
  }, [search]);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(HITTING_IDENTITY_STORAGE_KEY),
      AsyncStorage.getItem('otc:mechanical-diagnostic'),
    ]).then(([identityVal, mechVal]) => {
      if (identityVal) {
        try { setIdentityResult(JSON.parse(identityVal)); } catch {}
      }
      if (mechVal) {
        try { setMechResult(JSON.parse(mechVal)); } catch {}
      }
    });
  }, []);

  const hasDiagnostic = gate.hitting.mechanicalDone;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>The OTC Hitting System</Text>
        </View>
        <TouchableOpacity
          style={styles.diagBtn}
          onPress={() => router.push('/(app)/training/mechanical/diagnostics' as any)}
        >
          <Ionicons name="clipboard-outline" size={18} color={ACCENT} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hitting drills..."
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
              <Text style={styles.searchEmptySub}>No drills match "{search}"</Text>
            </View>
          ) : (
            <>
              <Text style={styles.searchCount}>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</Text>
              {searchResults.map((d) => (
                <TouchableOpacity
                  key={`${d.sectionKey}-${d.name}`}
                  style={styles.searchResultCard}
                  onPress={() => router.push(`/(app)/training/mechanical/${d.sectionKey}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.searchResultDot, { backgroundColor: d.sectionColor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.searchResultName}>{d.name}</Text>
                    <Text style={styles.searchResultFixes} numberOfLines={1}>{d.fixes}</Text>
                  </View>
                  <View style={[styles.searchResultTag, { backgroundColor: d.sectionColor + '15' }]}>
                    <Text style={[styles.searchResultTagText, { color: d.sectionColor }]}>{d.sectionLabel}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      ) : (

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Walk Tier Banner */}
        {hasLimitedHitting && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={18} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Free Preview Mode</Text>
              <Text style={styles.upgradeSub}>
                Starter drills unlocked in each section. Upgrade to Single for full access.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* ═══════ SWING PROFILE ═══════ */}
        <View style={styles.profileCard}>
          <Text style={styles.profileCardTitle}>SWING PROFILE</Text>

          {/* Hitting Identity — Movement Pattern + Bat Path */}
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => router.push('/(app)/training/mechanical/mover-type-quiz' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.profileIcon, { backgroundColor: (identityResult ? MOVEMENT_PROFILES[identityResult.movementType].color : '#f59e0b') + '18' }]}>
              <Ionicons
                name={identityResult ? 'body-outline' : 'help-circle-outline'}
                size={18}
                color={identityResult ? MOVEMENT_PROFILES[identityResult.movementType].color : '#f59e0b'}
              />
            </View>
            <View style={{ flex: 1 }}>
              {identityResult ? (
                <View style={styles.moverResults}>
                  <Text style={styles.profileRowLabel}>Hitting Identity</Text>
                  <Text style={[styles.profileRowValue, { color: MOVEMENT_PROFILES[identityResult.movementType].color }]}>
                    {COMBINED_PROFILE_LABELS[identityResult.combinedProfile]}
                  </Text>
                  <Text style={styles.moverSecondary}>
                    {MOVEMENT_PROFILES[identityResult.movementType].label} · {BAT_PATH_PROFILES[identityResult.batPathType].label}
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.profileRowLabel}>Hitting Identity</Text>
                  <Text style={styles.profileRowValue}>Take Hitting Identity Diagnostic</Text>
                </>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Identity details — movement + bat path axes */}
          {identityResult && (
            <View style={styles.moverDetail}>
              <Text style={styles.moverDesc}>
                {COMBINED_PROFILE_SUMMARIES[identityResult.combinedProfile]}
              </Text>

              {/* Movement Pattern */}
              <Text style={[styles.detailLabel, { color: MOVEMENT_PROFILES[identityResult.movementType].color }]}>
                MOVEMENT PATTERN · {MOVEMENT_PROFILES[identityResult.movementType].label.toUpperCase()}
              </Text>
              <View style={styles.mlbRow}>
                {identityResult.movementExamples.map((comp: string) => (
                  <Text key={comp} style={[styles.mlbName, { color: MOVEMENT_PROFILES[identityResult.movementType].color }]}>{comp}</Text>
                ))}
              </View>

              {/* Bat Path */}
              <Text style={[styles.detailLabel, { color: BAT_PATH_PROFILES[identityResult.batPathType].color }]}>
                BAT PATH · {BAT_PATH_PROFILES[identityResult.batPathType].label.toUpperCase()}
              </Text>
              <View style={styles.mlbRow}>
                {identityResult.batPathExamples.map((comp: string) => (
                  <Text key={comp} style={[styles.mlbName, { color: BAT_PATH_PROFILES[identityResult.batPathType].color }]}>{comp}</Text>
                ))}
              </View>

              {/* Cues */}
              <Text style={styles.detailLabel}>KEY CUES</Text>
              {identityResult.movementCues.slice(0, 2).map((cue: string) => (
                <View key={cue} style={styles.cueRow}>
                  <Ionicons name="mic-outline" size={12} color={MOVEMENT_PROFILES[identityResult.movementType].color} />
                  <Text style={styles.cueText}>{cue}</Text>
                </View>
              ))}
              {identityResult.batPathCues.slice(0, 2).map((cue: string) => (
                <View key={cue} style={styles.cueRow}>
                  <Ionicons name="mic-outline" size={12} color={BAT_PATH_PROFILES[identityResult.batPathType].color} />
                  <Text style={styles.cueText}>{cue}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Mechanical Profile */}
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => router.push('/(app)/training/mechanical/diagnostics' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.profileIcon, { backgroundColor: ACCENT + '18' }]}>
              <Ionicons
                name={mechResult ? 'analytics-outline' : 'help-circle-outline'}
                size={18}
                color={ACCENT}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileRowLabel}>Mechanical Profile</Text>
              {mechResult ? (
                <View style={styles.mechResults}>
                  <Text style={[styles.profileRowValue, { color: ACCENT }]}>
                    {MECHANICAL_ISSUES[mechResult.primary]?.label ?? mechResult.primary}
                  </Text>
                  <Text style={styles.mechSecondary}>
                    Secondary: {MECHANICAL_ISSUES[mechResult.secondary]?.label ?? mechResult.secondary}
                  </Text>
                </View>
              ) : (
                <Text style={styles.profileRowValue}>Take Swing Diagnostic</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ═══════ APPROACH CONNECTOR ═══════ */}
        <View style={styles.approachConnector}>
          <Text style={styles.approachConnectorText}>
            Your hitting identity explains HOW your body naturally moves and attacks the ball.{'\n\n'}Your approach determines HOW you compete in the box.
          </Text>
          <TouchableOpacity
            style={styles.approachBtn}
            onPress={() => router.push('/(app)/training/mechanical/approach' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
            <Text style={styles.approachBtnText}>View Hitting Philosophy</Text>
            <Ionicons name="chevron-forward" size={14} color="#f59e0b" />
          </TouchableOpacity>
        </View>

        {/* ═══════ MY PATH ═══════ */}
        <TouchableOpacity
          style={styles.primaryCard}
          onPress={() => router.push('/(app)/training/mechanical/my-path' as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.primaryIcon, { backgroundColor: '#3b82f618' }]}>
            <Ionicons name="map-outline" size={24} color="#3b82f6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.primaryLabel}>My Path</Text>
            <Text style={styles.primarySub}>
              {hasDiagnostic
                ? 'Your personalized development plan'
                : 'Complete diagnostics to unlock'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══════ TODAY'S WORK ═══════ */}
        <TouchableOpacity
          style={[styles.primaryCard, { backgroundColor: ACCENT + '06', borderColor: ACCENT + '25' }]}
          onPress={() => router.push('/(app)/training/mechanical/daily-work' as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.primaryIcon, { backgroundColor: ACCENT + '18' }]}>
            <Ionicons name="flash" size={24} color={ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.primaryLabel}>Today&apos;s Work</Text>
            <Text style={styles.primarySub}>
              {hasDiagnostic
                ? 'Today\'s personalized drills'
                : 'Complete Swing Diagnostic to unlock'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══════ WEEKLY CHALLENGE ═══════ */}
        {(() => {
          const weekIndex = Math.floor(Date.now() / (7 * 86_400_000));
          const challenge = WEEKLY_CHALLENGES[weekIndex % WEEKLY_CHALLENGES.length];
          return (
            <View style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <View style={[styles.challengeIcon, { backgroundColor: '#FBBF2418' }]}>
                  <Ionicons name="trophy-outline" size={20} color="#FBBF24" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.challengeSup}>WEEKLY CHALLENGE</Text>
                  <Text style={styles.challengeName}>{challenge.name}</Text>
                </View>
              </View>
              <Text style={styles.challengeGoal}>{challenge.goal}</Text>
              <View style={styles.challengeMeta}>
                <View style={styles.challengeMetaItem}>
                  <Ionicons name="videocam-outline" size={12} color="#FBBF24" />
                  <Text style={styles.challengeMetaText}>Video required</Text>
                </View>
                <View style={styles.challengeMetaItem}>
                  <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                  <Text style={styles.challengeMetaText}>{challenge.submissionDeadline}</Text>
                </View>
              </View>
            </View>
          );
        })()}

        {/* ═══════ APPROACH CARD ═══════ */}
        <View style={styles.approachCard}>
          <View style={styles.approachCardHeader}>
            <Ionicons name="bulb-outline" size={18} color="#f59e0b" />
            <Text style={styles.approachCardTitle}>OTC Hitting Philosophy</Text>
          </View>
          <Text style={styles.approachCardText}>
            Hunt your pitch. Find the barrel. The goal is to become a true hitter who competes and produces.
          </Text>
        </View>

        {/* ═══════ EXPLORE MORE ═══════ */}
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
            {EXPLORE_ITEMS.map((item) => {
              const isPlaceholder = !item.route;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.exploreCard, isPlaceholder && { opacity: 0.5 }]}
                  onPress={() => {
                    if (!isPlaceholder) router.push(item.route as any);
                  }}
                  activeOpacity={isPlaceholder ? 1 : 0.8}
                >
                  <View style={[styles.exploreIcon, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.exploreLabel}>{item.label}</Text>
                  <Text style={styles.exploreSub} numberOfLines={1}>{item.sub}</Text>
                </TouchableOpacity>
              );
            })}
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

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14,
  },
  upgradeTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  upgradeSub: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginTop: 2 },

  /* ── Swing Profile ────────────────────────── */
  profileCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 12,
  },
  profileCardTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted },
  profileRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingTop: 4,
  },
  profileIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  profileRowLabel: { fontSize: 10, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.8 },
  profileRowValue: { fontSize: 15, fontWeight: '900', color: colors.textSecondary },

  moverResults: { gap: 1 },
  moverSecondary: { fontSize: 11, color: colors.textMuted },

  moverDetail: {
    backgroundColor: colors.bg, borderRadius: radius.md,
    padding: 14, gap: 8, marginTop: 4,
  },
  moverDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  detailLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 4 },
  mlbRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mlbName: { fontSize: 13, fontWeight: '700' },
  cueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cueText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },

  mechResults: { gap: 1 },
  mechSecondary: { fontSize: 11, color: colors.textMuted },

  /* ── Approach Connector ────────────────────── */
  approachConnector: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 12,
  },
  approachConnectorText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  approachBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 10, borderRadius: radius.sm,
    backgroundColor: '#f59e0b15',
  },
  approachBtnText: { fontSize: 13, fontWeight: '800', color: '#f59e0b' },

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

  /* ── Approach Card ─────────────────────────── */
  approachCard: {
    backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.lg, padding: 16, gap: 8,
  },
  approachCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  approachCardTitle: { fontSize: 14, fontWeight: '900', color: '#f59e0b' },
  approachCardText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

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

  /* ── Weekly Challenge ──────────────────────── */
  challengeCard: {
    backgroundColor: '#FBBF2408', borderWidth: 1, borderColor: '#FBBF2425',
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  challengeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  challengeIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  challengeSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: '#FBBF24' },
  challengeName: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  challengeGoal: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  challengeMeta: { flexDirection: 'row', gap: 16 },
  challengeMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  challengeMetaText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
});

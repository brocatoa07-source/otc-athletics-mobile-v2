import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useAuth } from '@/hooks/useAuth';
import { useGating } from '@/hooks/useGating';
import {
  MECHANICAL_ISSUES,
  type MechanicalIssue,
  type MechanicalDiagnosticResult,
} from '@/data/hitting-mechanical-diagnostic-data';
import {
  MOVEMENT_PROFILES,
  BAT_PATH_PROFILES,
  COMBINED_PROFILE_LABELS,
  COMBINED_PROFILE_SUMMARIES,
  HITTING_IDENTITY_STORAGE_KEY,
  type HittingIdentityDiagnosticResult,
} from '@/data/hitting-identity-data';
import {
  ISSUE_TO_QUICKFIX,
  QUICKFIX_TO_FOCUS,
} from '@/data/daily-work';
import {
  HITTING_VAULT_SECTIONS,
  type DrillCard,
} from '@/data/hitting-vault-sections';
import {
  getRecommendedDrills as getEngineRecommendation,
  flattenRecommendation,
  type FlatDrill,
} from '@/lib/recommendation/drillRecommendationEngine';

const ACCENT = '#E10600';

/* ─── Issue → user-facing Quick Fix label ─────────── */

const ISSUE_DISPLAY: Record<MechanicalIssue, string> = {
  timing: 'Late',
  weight_shift: 'Lunging',
  early_rotation: 'Stuck',
  swing_plane: 'Losing Posture',
  disconnection: 'Casting',
  barrel_path: 'Barrel Path',
};

/* ─── Focus label → vault section key ─────────────── */

const FOCUS_TO_SECTION_KEY: Record<string, string> = {
  Timing: 'timing',
  'Forward Move': 'forward-move',
  Connection: 'connection',
  Posture: 'posture',
  Direction: 'direction',
  'Barrel Turn': 'barrel-turn',
  Extension: 'extension',
};

/* ─── Helpers ─────────────────────────────────────── */

function findDrillInVault(drillName: string): { drill: DrillCard; sectionKey: string } | null {
  for (const section of HITTING_VAULT_SECTIONS) {
    const found = section.drills.find((d) => d.name === drillName);
    if (found) return { drill: found, sectionKey: section.key };
  }
  return null;
}

function getRecommendedDrills(
  primary: MechanicalIssue,
  secondary: MechanicalIssue,
  age: number | null = null,
): FlatDrill[] {
  const rec = getEngineRecommendation({
    primaryIssue: primary,
    secondaryIssue: secondary,
    moverType: null,
    age,
    recentDrills: [],
  });
  return flattenRecommendation(rec);
}

function getFocusAreas(primary: MechanicalIssue, secondary: MechanicalIssue): string[] {
  const primaryKey = ISSUE_TO_QUICKFIX[primary];
  const secondaryKey = ISSUE_TO_QUICKFIX[secondary];
  const areas = new Set<string>();
  for (const a of QUICKFIX_TO_FOCUS[primaryKey] ?? []) areas.add(a);
  for (const a of QUICKFIX_TO_FOCUS[secondaryKey] ?? []) areas.add(a);
  return Array.from(areas);
}

/* ─── Screen ──────────────────────────────────────── */

export default function MyPathScreen() {
  const { athlete } = useAuth();
  const { gate } = useGating();

  const [identityResult, setIdentityResult] = useState<HittingIdentityDiagnosticResult | null>(null);
  const [diagnostic, setDiagnostic] = useState<MechanicalDiagnosticResult | null>(null);

  useEffect(() => {
    // Load hitting identity (new v2 key)
    AsyncStorage.getItem(HITTING_IDENTITY_STORAGE_KEY).then((val) => {
      if (!val) return;
      try { setIdentityResult(JSON.parse(val)); } catch {}
    });

    // Load mechanical diagnostic
    AsyncStorage.getItem('otc:mechanical-diagnostic').then((val) => {
      if (!val) return;
      try { setDiagnostic(JSON.parse(val)); } catch {}
    });
  }, []);

  const hasIdentity = gate.hitting.moverDone && identityResult;
  const hasMechanical = gate.hitting.mechanicalDone && diagnostic;

  // ── No diagnostics — show CTA ──────────────────────
  if (!hasIdentity && !hasMechanical) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>MY PATH</Text>
            <Text style={styles.headerTitle}>Your Development Plan</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Ionicons name="map-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Complete Your Diagnostics</Text>
          <Text style={styles.emptySub}>
            Take the Swing Identity quiz and Mechanical Diagnostic to unlock your personalized development path.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push('/(app)/training/mechanical/diagnostics' as any)}
          >
            <Text style={styles.ctaBtnText}>Go to Diagnostics</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.bg} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Derived data
  const focusAreas = hasMechanical ? getFocusAreas(diagnostic.primary, diagnostic.secondary) : [];
  // New identity system doesn't map to old MoverType slugs — pass null until drill metadata is migrated
  const recommended = hasMechanical
    ? getRecommendedDrills(diagnostic.primary, diagnostic.secondary, athlete?.age ?? null)
    : [];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MY PATH</Text>
          <Text style={styles.headerTitle}>Your Development Plan</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Hitting Identity ───────────────────── */}
        {hasIdentity && (
          <>
            <Text style={styles.sectionLabel}>HITTING IDENTITY</Text>
            <View style={[styles.card, { borderColor: MOVEMENT_PROFILES[identityResult.movementType].color + '30' }]}>
              <View style={styles.moverHeader}>
                <View style={[styles.moverDot, { backgroundColor: MOVEMENT_PROFILES[identityResult.movementType].color }]} />
                <Text style={[styles.moverName, { color: MOVEMENT_PROFILES[identityResult.movementType].color }]}>
                  {COMBINED_PROFILE_LABELS[identityResult.combinedProfile]}
                </Text>
              </View>
              <Text style={styles.moverTagline}>
                {COMBINED_PROFILE_SUMMARIES[identityResult.combinedProfile]}
              </Text>

              {/* Movement Pattern */}
              <View style={styles.moverDetail}>
                <Text style={[styles.detailLabel, { color: MOVEMENT_PROFILES[identityResult.movementType].color }]}>
                  MOVEMENT · {MOVEMENT_PROFILES[identityResult.movementType].label.toUpperCase()}
                </Text>
                {identityResult.movementExamples.map((comp: string) => (
                  <Text key={comp} style={styles.detailItem}>{comp}</Text>
                ))}
              </View>

              {/* Bat Path */}
              <View style={styles.moverDetail}>
                <Text style={[styles.detailLabel, { color: BAT_PATH_PROFILES[identityResult.batPathType].color }]}>
                  BAT PATH · {BAT_PATH_PROFILES[identityResult.batPathType].label.toUpperCase()}
                </Text>
                {identityResult.batPathExamples.map((comp: string) => (
                  <Text key={comp} style={styles.detailItem}>{comp}</Text>
                ))}
              </View>

              <View style={[styles.cueBadge, { borderColor: MOVEMENT_PROFILES[identityResult.movementType].color + '40' }]}>
                <Text style={[styles.cueLabel, { color: MOVEMENT_PROFILES[identityResult.movementType].color }]}>KEY CUES</Text>
                {identityResult.movementCues.slice(0, 2).map((cue: string) => (
                  <Text key={cue} style={styles.cueText}>"{cue}"</Text>
                ))}
                {identityResult.batPathCues.slice(0, 2).map((cue: string) => (
                  <Text key={cue} style={styles.cueText}>"{cue}"</Text>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.linkBtn, { backgroundColor: MOVEMENT_PROFILES[identityResult.movementType].color + '15' }]}
                onPress={() => router.push('/(app)/training/mechanical/mover-type-quiz' as any)}
              >
                <Text style={[styles.linkBtnText, { color: MOVEMENT_PROFILES[identityResult.movementType].color }]}>
                  View Identity Details
                </Text>
                <Ionicons name="chevron-forward" size={14} color={MOVEMENT_PROFILES[identityResult.movementType].color} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── 2. Current Focus ─────────────────────── */}
        {hasMechanical && (
          <>
            <Text style={styles.sectionLabel}>YOUR CURRENT FOCUS</Text>
            <View style={styles.card}>
              {/* Primary */}
              <View style={styles.issueRow}>
                <View style={[styles.issueDot, { backgroundColor: MECHANICAL_ISSUES[diagnostic.primary].color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.issueRank}>Primary Issue</Text>
                  <Text style={styles.issueTitle}>
                    {ISSUE_DISPLAY[diagnostic.primary]}
                  </Text>
                  <Text style={styles.issueDesc}>
                    {MECHANICAL_ISSUES[diagnostic.primary].description}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Secondary */}
              <View style={styles.issueRow}>
                <View style={[styles.issueDot, { backgroundColor: MECHANICAL_ISSUES[diagnostic.secondary].color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.issueRank}>Secondary Issue</Text>
                  <Text style={styles.issueTitle}>
                    {ISSUE_DISPLAY[diagnostic.secondary]}
                  </Text>
                  <Text style={styles.issueDesc}>
                    {MECHANICAL_ISSUES[diagnostic.secondary].description}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* ── 3. Focus Areas ──────────────────────── */}
        {focusAreas.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>FOCUS AREAS</Text>
            <View style={styles.card}>
              <View style={styles.focusGrid}>
                {focusAreas.map((area) => {
                  const sectionKey = FOCUS_TO_SECTION_KEY[area];
                  const section = sectionKey
                    ? HITTING_VAULT_SECTIONS.find((s) => s.key === sectionKey)
                    : null;

                  return (
                    <TouchableOpacity
                      key={area}
                      style={[
                        styles.focusChip,
                        { borderColor: (section?.color ?? ACCENT) + '40' },
                      ]}
                      onPress={() => {
                        if (sectionKey) {
                          router.push(`/(app)/training/mechanical/${sectionKey}` as any);
                        }
                      }}
                      activeOpacity={sectionKey ? 0.7 : 1}
                    >
                      {section && (
                        <Ionicons name={section.icon} size={14} color={section.color} />
                      )}
                      <Text style={[styles.focusChipText, { color: section?.color ?? ACCENT }]}>
                        {area}
                      </Text>
                      {sectionKey && (
                        <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {/* ── 4. Recommended Drills ───────────────── */}
        {recommended.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>RECOMMENDED DRILLS</Text>

            {recommended.some((d) => d.role === 'reset') && (
              <View style={[styles.youthNote, { marginBottom: 8 }]}>
                <Ionicons name="star-outline" size={12} color="#22c55e" />
                <Text style={styles.youthNoteText}>
                  Because of your age group, your plan includes a Foundations drill.
                </Text>
              </View>
            )}

            {recommended.map((entry) => {
              const vaultMatch = findDrillInVault(entry.name);
              const tagColor = entry.role === 'reset' ? '#22c55e'
                : entry.role === 'primary' ? ACCENT
                : '#3b82f6';
              const tagLabel = entry.role === 'reset' ? 'Foundation'
                : entry.role === 'primary' ? 'Primary Fix'
                : 'Secondary Fix';
              const iconName = entry.role === 'reset' ? 'construct-outline' as const : 'baseball-outline' as const;
              const typeLabel = entry.role === 'reset' ? 'FOUNDATION' : 'HITTING';

              return (
                <TouchableOpacity
                  key={entry.name}
                  style={[styles.drillCard, entry.role === 'reset' && { borderColor: '#22c55e30' }]}
                  onPress={() => {
                    if (vaultMatch) {
                      router.push(`/(app)/training/mechanical/${vaultMatch.sectionKey}` as any);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.drillIcon, { backgroundColor: tagColor + '18' }]}>
                    <Ionicons name={iconName} size={18} color={tagColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.drillMeta}>
                      <Text style={[styles.drillTypeLabel, { color: tagColor }]}>{typeLabel}</Text>
                      <View style={[styles.drillTag, { backgroundColor: tagColor + '18' }]}>
                        <Text style={[styles.drillTagText, { color: tagColor }]}>{tagLabel}</Text>
                      </View>
                    </View>
                    <Text style={styles.drillName}>{entry.name}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* ── 5. How To Train ─────────────────────── */}
        <Text style={styles.sectionLabel}>HOW TO TRAIN</Text>
        <View style={styles.card}>
          <View style={styles.guideRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.guideText}>Use these drills during your cage work.</Text>
          </View>
          <View style={styles.guideRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.guideText}>Focus on the cues listed in each drill card.</Text>
          </View>
          <View style={styles.guideRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.guideText}>
              Track what works in your Playbook so you can build your personal hitting system.
            </Text>
          </View>
        </View>

        {/* ── 6. Start Today's Work ───────────────── */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.push('/(app)/training/mechanical/daily-work' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={20} color={colors.bg} />
          <Text style={styles.startBtnText}>Start Today's Work</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.bg} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Styles ──────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  emptySub: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, textAlign: 'center' },

  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ACCENT,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: 8,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '800', color: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginTop: 8,
  },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
  },

  /* Mover identity */
  moverHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  moverDot: { width: 10, height: 10, borderRadius: 5 },
  moverName: { fontSize: 20, fontWeight: '900' },
  moverTagline: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  moverDetail: { gap: 4, marginTop: 4 },
  detailLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  detailItem: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },

  cueBadge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 10,
    backgroundColor: colors.bg,
    gap: 4,
  },
  cueLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  cueText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, fontStyle: 'italic' },

  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  linkBtnText: { fontSize: 13, fontWeight: '700' },

  /* Issues */
  issueRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  issueDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  issueRank: { fontSize: 10, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  issueTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary, marginTop: 2 },
  issueDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border },

  /* Focus areas */
  focusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  focusChipText: { fontSize: 13, fontWeight: '700' },

  /* Recommended drills */
  drillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
  },
  drillIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drillMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  drillTypeLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8, color: '#22c55e' },
  drillName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 1 },
  drillTag: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  drillTagText: { fontSize: 9, fontWeight: '800' },

  youthNote: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  youthNoteText: { fontSize: 11, fontWeight: '600', color: '#22c55e', flex: 1 },

  /* How to train */
  guideRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  guideText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  /* Start button */
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: radius.md,
    marginTop: 8,
  },
  startBtnText: { fontSize: 15, fontWeight: '800', color: colors.bg },
});

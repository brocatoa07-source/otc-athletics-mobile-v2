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
  MOVER_TYPES,
  type MoverType,
  type MoverTypeData,
} from '@/data/hitting-mover-type-data';
import {
  ISSUE_TO_QUICKFIX,
  QUICK_FIXES,
  QUICKFIX_TO_FOCUS,
  pickDrill,
} from '@/data/daily-work';
import {
  HITTING_VAULT_SECTIONS,
  type DrillCard,
} from '@/data/hitting-vault-sections';

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

/* ─── Foundations drill pool (age ≤ 14) ───────────── */

const FOUNDATIONS_DRILLS = [
  'Hold Finish',
  'Slow Motion Swing',
  'Arráez Drill',
  'Top Hand Bregman Drill',
  'Bottom Hand Drill',
];

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
  moverType: MoverType | null = null,
): string[] {
  const primaryKey = ISSUE_TO_QUICKFIX[primary];
  const secondaryKey = ISSUE_TO_QUICKFIX[secondary];
  const primaryPool = QUICK_FIXES[primaryKey]?.drills ?? [];
  const secondaryPool = QUICK_FIXES[secondaryKey]?.drills ?? [];

  const dayIndex = Math.floor(Date.now() / 86_400_000);

  if (primaryKey === secondaryKey) {
    // Same pool — pick best via affinity, then rotate remaining
    const pick1 = pickDrill(primaryPool, dayIndex, moverType);
    const remaining = primaryPool.filter((d) => d !== pick1);
    const pick2 = pickDrill(remaining, dayIndex + 1, moverType);
    const rest = remaining.filter((d) => d !== pick2);
    const pick3 = rest.length > 0
      ? rest[dayIndex % rest.length]
      : primaryPool[(dayIndex + 2) % primaryPool.length];
    return [pick1, pick2, pick3];
  }

  // 1 from primary (mover-biased), 2 from secondary (mover-biased)
  const pick1 = pickDrill(primaryPool, dayIndex, moverType);
  const pick2 = pickDrill(secondaryPool, dayIndex, moverType);
  const secondaryRemaining = secondaryPool.filter((d) => d !== pick2);
  const pick3 = secondaryRemaining.length > 0
    ? pickDrill(secondaryRemaining, dayIndex + 1, moverType)
    : secondaryPool[(dayIndex + 1) % secondaryPool.length];

  return [pick1, pick2, pick3];
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

  const [moverData, setMoverData] = useState<MoverTypeData | null>(null);
  const [diagnostic, setDiagnostic] = useState<MechanicalDiagnosticResult | null>(null);

  useEffect(() => {
    // Load mover type
    AsyncStorage.getItem('otc:mover-type').then((val) => {
      if (!val) return;
      try {
        const parsed = JSON.parse(val);
        const slug: MoverType = parsed.slug ?? parsed;
        const found = MOVER_TYPES[slug];
        if (found) setMoverData(found);
      } catch {}
    });

    // Load mechanical diagnostic
    AsyncStorage.getItem('otc:mechanical-diagnostic').then((val) => {
      if (!val) return;
      try {
        setDiagnostic(JSON.parse(val));
      } catch {}
    });
  }, []);

  const hasMover = gate.hitting.moverDone && moverData;
  const hasMechanical = gate.hitting.mechanicalDone && diagnostic;
  const isYouth = athlete?.age != null && athlete.age <= 14;

  // ── No diagnostics — show CTA ──────────────────────
  if (!hasMover && !hasMechanical) {
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
  const moverSlug: MoverType | null = moverData?.slug ?? null;
  const recommended = hasMechanical ? getRecommendedDrills(diagnostic.primary, diagnostic.secondary, moverSlug) : [];
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const foundationDrill = isYouth ? FOUNDATIONS_DRILLS[dayIndex % FOUNDATIONS_DRILLS.length] : null;

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
        {/* ── 1. Swing Identity ────────────────────── */}
        {hasMover && (
          <>
            <Text style={styles.sectionLabel}>SWING IDENTITY</Text>
            <View style={[styles.card, { borderColor: moverData.color + '30' }]}>
              <View style={styles.moverHeader}>
                <View style={[styles.moverDot, { backgroundColor: moverData.color }]} />
                <Text style={[styles.moverName, { color: moverData.color }]}>
                  {moverData.name}
                </Text>
              </View>
              <Text style={styles.moverTagline}>{moverData.tagline}</Text>

              <View style={styles.moverDetail}>
                <Text style={styles.detailLabel}>MLB COMPARISONS</Text>
                {moverData.mlbComps.map((comp) => (
                  <Text key={comp} style={styles.detailItem}>{comp}</Text>
                ))}
              </View>

              <View style={[styles.cueBadge, { borderColor: moverData.color + '40' }]}>
                <Text style={[styles.cueLabel, { color: moverData.color }]}>PRIMARY CUE</Text>
                <Text style={styles.cueText}>"{moverData.primaryCue}"</Text>
              </View>

              <TouchableOpacity
                style={[styles.linkBtn, { backgroundColor: moverData.color + '15' }]}
                onPress={() => router.push('/(app)/training/mechanical/mover-type-quiz' as any)}
              >
                <Text style={[styles.linkBtnText, { color: moverData.color }]}>
                  View Identity Details
                </Text>
                <Ionicons name="chevron-forward" size={14} color={moverData.color} />
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
        {(recommended.length > 0 || foundationDrill) && (
          <>
            <Text style={styles.sectionLabel}>RECOMMENDED DRILLS</Text>

            {isYouth && foundationDrill && (
              <View style={[styles.youthNote, { marginBottom: 8 }]}>
                <Ionicons name="star-outline" size={12} color="#22c55e" />
                <Text style={styles.youthNoteText}>
                  Because of your age group, your plan includes a Foundations drill.
                </Text>
              </View>
            )}

            {/* Foundation drill (youth only) */}
            {foundationDrill && (() => {
              const vaultMatch = findDrillInVault(foundationDrill);
              return (
                <TouchableOpacity
                  key="foundation"
                  style={[styles.drillCard, { borderColor: '#22c55e30' }]}
                  onPress={() => {
                    if (vaultMatch) {
                      router.push(`/(app)/training/mechanical/${vaultMatch.sectionKey}` as any);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.drillIcon, { backgroundColor: '#22c55e18' }]}>
                    <Ionicons name="construct-outline" size={18} color="#22c55e" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.drillTypeLabel}>FOUNDATION</Text>
                    <Text style={styles.drillName}>{foundationDrill}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })()}

            {/* Recommended hitting drills */}
            {recommended.map((drillName, idx) => {
              const vaultMatch = findDrillInVault(drillName);
              const isPrimary = idx === 0;
              const tagColor = isPrimary ? ACCENT : '#3b82f6';
              const tagLabel = isPrimary ? 'Primary Fix' : 'Secondary Fix';

              return (
                <TouchableOpacity
                  key={drillName}
                  style={styles.drillCard}
                  onPress={() => {
                    if (vaultMatch) {
                      router.push(`/(app)/training/mechanical/${vaultMatch.sectionKey}` as any);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.drillIcon, { backgroundColor: tagColor + '18' }]}>
                    <Ionicons name="baseball-outline" size={18} color={tagColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.drillMeta}>
                      <Text style={[styles.drillTypeLabel, { color: tagColor }]}>HITTING</Text>
                      <View style={[styles.drillTag, { backgroundColor: tagColor + '18' }]}>
                        <Text style={[styles.drillTagText, { color: tagColor }]}>{tagLabel}</Text>
                      </View>
                    </View>
                    <Text style={styles.drillName}>{drillName}</Text>
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

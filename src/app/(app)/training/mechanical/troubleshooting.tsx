import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useGating } from '@/hooks/useGating';
import { useTier } from '@/hooks/useTier';
import { hasTroubleshootingPreviewOnly, WALK_TROUBLESHOOTING_DRILL_LIMIT, getUpgradeTargetLabel } from '@/lib/tier-content';
import {
  MECHANICAL_ISSUES,
  type MechanicalIssue,
  type MechanicalDiagnosticResult,
} from '@/data/hitting-mechanical-diagnostic-data';
import type { MoverType } from '@/data/hitting-mover-type-data';
import {
  ISSUE_TO_QUICKFIX,
  QUICK_FIXES,
  pickDrill,
} from '@/data/daily-work';
import {
  HITTING_VAULT_SECTIONS,
  type DrillCard,
} from '@/data/hitting-vault-sections';

const ACCENT = '#f97316'; // matches troubleshooting section color

/* ─── Issue → user-facing Quick Fix label ─────────── */

const ISSUE_DISPLAY: Record<MechanicalIssue, string> = {
  timing: 'Late',
  weight_shift: 'Lunging',
  early_rotation: 'Stuck',
  swing_plane: 'Losing Posture',
  disconnection: 'Casting',
  barrel_path: 'Barrel Path',
};

/* ─── Why descriptions (short athlete-friendly) ───── */

const ISSUE_WHY: Record<MechanicalIssue, string> = {
  timing:
    'Your timing is off because your load and stride aren\'t syncing with pitch speed. The fix is getting your front foot down earlier and letting the ball travel deeper.',
  weight_shift:
    'Your weight is drifting forward instead of staying back and driving through. This kills your balance and your ability to adjust mid-swing.',
  early_rotation:
    'Your hips are firing before your weight shift is complete. The barrel drags through the zone and you lose both power and direction.',
  disconnection:
    'Your arms are working independently from your body rotation. The swing becomes all arms — you lose the chain of force from the ground up.',
  swing_plane:
    'Your barrel isn\'t matching the pitch plane. You\'re either too steep or too flat, which leads to pop-ups, weak grounders, and inconsistent contact.',
  barrel_path:
    'Your barrel is cutting across the ball or taking a long path to the zone. You foul off pitches you should crush and miss barrels consistently.',
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
  'Launch Position': 'forward-move',
  'Posture & Direction': 'posture',
};

/* ─── Helpers ─────────────────────────────────────── */

function findDrillInVault(drillName: string): { drill: DrillCard; sectionKey: string } | null {
  for (const section of HITTING_VAULT_SECTIONS) {
    const found = section.drills.find((d) => d.name === drillName);
    if (found) return { drill: found, sectionKey: section.key };
  }
  return null;
}

/**
 * Build 5 recommended drills: 2 from primary, 2 from secondary, 1 bonus.
 * Uses mover-type bias via pickDrill when available.
 */
function getTroubleshootingDrills(
  primary: MechanicalIssue,
  secondary: MechanicalIssue,
  moverType: MoverType | null,
): { name: string; source: 'primary' | 'secondary' | 'bonus' }[] {
  const primaryKey = ISSUE_TO_QUICKFIX[primary];
  const secondaryKey = ISSUE_TO_QUICKFIX[secondary];
  const primaryPool = QUICK_FIXES[primaryKey]?.drills ?? [];
  const secondaryPool = QUICK_FIXES[secondaryKey]?.drills ?? [];

  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const picked = new Set<string>();
  const results: { name: string; source: 'primary' | 'secondary' | 'bonus' }[] = [];

  // 2 from primary
  const p1 = pickDrill(primaryPool, dayIndex, moverType);
  picked.add(p1);
  results.push({ name: p1, source: 'primary' });

  const primaryRemaining = primaryPool.filter((d) => !picked.has(d));
  const p2 = primaryRemaining.length > 0
    ? pickDrill(primaryRemaining, dayIndex + 1, moverType)
    : primaryPool[(dayIndex + 1) % primaryPool.length];
  picked.add(p2);
  results.push({ name: p2, source: 'primary' });

  // 2 from secondary (avoid duplicates if same pool)
  const s1Pool = secondaryPool.filter((d) => !picked.has(d));
  const s1 = s1Pool.length > 0
    ? pickDrill(s1Pool, dayIndex, moverType)
    : secondaryPool[dayIndex % secondaryPool.length];
  picked.add(s1);
  results.push({ name: s1, source: 'secondary' });

  const s2Pool = secondaryPool.filter((d) => !picked.has(d));
  const s2 = s2Pool.length > 0
    ? pickDrill(s2Pool, dayIndex + 1, moverType)
    : secondaryPool[(dayIndex + 1) % secondaryPool.length];
  picked.add(s2);
  results.push({ name: s2, source: 'secondary' });

  // 1 bonus — pick from whichever pool has remaining options
  const bonusPool = [...primaryPool, ...secondaryPool].filter((d) => !picked.has(d));
  if (bonusPool.length > 0) {
    const bonus = pickDrill(bonusPool, dayIndex + 2, moverType);
    results.push({ name: bonus, source: 'bonus' });
  }

  return results;
}

/* ─── Screen ──────────────────────────────────────── */

export default function TroubleshootingScreen() {
  const { gate } = useGating();
  const { tier, isCoach } = useTier();
  const isPreviewOnly = hasTroubleshootingPreviewOnly(tier, isCoach);
  const upgradeTarget = getUpgradeTargetLabel(tier);
  const [diagnostic, setDiagnostic] = useState<MechanicalDiagnosticResult | null>(null);
  const [moverType, setMoverType] = useState<MoverType | null>(null);
  const [expandedDrill, setExpandedDrill] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('otc:mechanical-diagnostic').then((val) => {
      if (!val) return;
      try { setDiagnostic(JSON.parse(val)); } catch {}
    });

    AsyncStorage.getItem('otc:mover-type').then((val) => {
      if (!val) return;
      try {
        const parsed = JSON.parse(val);
        setMoverType((parsed.slug ?? parsed) as MoverType);
      } catch {}
    });
  }, []);

  const hasDiagnostic = gate.hitting.mechanicalDone && diagnostic;

  // ── No diagnostic — CTA ────────────────────────────
  if (!hasDiagnostic) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>HITTING VAULT</Text>
            <Text style={styles.headerTitle}>Troubleshooting</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Ionicons name="build-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Complete Your Swing Diagnostic</Text>
          <Text style={styles.emptySub}>
            Troubleshooting is personalized from your diagnostic results. Take the 10-question assessment to unlock your fix plan.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any)}
          >
            <Text style={styles.ctaBtnText}>Take Swing Diagnostic</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.bg} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Diagnostic complete — full screen ──────────────
  const primaryData = MECHANICAL_ISSUES[diagnostic.primary];
  const secondaryData = MECHANICAL_ISSUES[diagnostic.secondary];
  const allDrills = getTroubleshootingDrills(diagnostic.primary, diagnostic.secondary, moverType);
  const drills = isPreviewOnly ? allDrills.slice(0, WALK_TROUBLESHOOTING_DRILL_LIMIT) : allDrills;


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>Troubleshooting</Text>
        </View>
        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={() => router.push('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any)}
        >
          <Ionicons name="refresh-outline" size={16} color={ACCENT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Primary Issue ────────────────────────── */}
        <Text style={styles.sectionLabel}>PRIMARY ISSUE</Text>
        <View style={[styles.issueCard, { borderColor: primaryData.color + '30' }]}>
          <View style={styles.issueHeader}>
            <View style={[styles.issueDot, { backgroundColor: primaryData.color }]} />
            <Text style={[styles.issueTitle, { color: primaryData.color }]}>
              {ISSUE_DISPLAY[diagnostic.primary]}
            </Text>
          </View>
          <Text style={styles.issueDesc}>{primaryData.description}</Text>
          <View style={[styles.cueBadge, { borderColor: primaryData.color + '40' }]}>
            <Text style={[styles.cueLabel, { color: primaryData.color }]}>CUE</Text>
            <Text style={styles.cueText}>"{primaryData.cue}"</Text>
          </View>
          <View style={styles.areaRow}>
            {primaryData.areas.map((area) => (
              <TouchableOpacity
                key={area}
                style={[styles.areaChip, { borderColor: primaryData.color + '40' }]}
                onPress={() => {
                  const key = FOCUS_TO_SECTION_KEY[area];
                  if (key) router.push(`/(app)/training/mechanical/${key}` as any);
                }}
              >
                <Text style={[styles.areaChipText, { color: primaryData.color }]}>{area}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Secondary Issue ──────────────────────── */}
        <Text style={styles.sectionLabel}>SECONDARY ISSUE</Text>
        <View style={[styles.issueCard, { borderColor: secondaryData.color + '30' }]}>
          <View style={styles.issueHeader}>
            <View style={[styles.issueDot, { backgroundColor: secondaryData.color }]} />
            <Text style={[styles.issueTitle, { color: secondaryData.color }]}>
              {ISSUE_DISPLAY[diagnostic.secondary]}
            </Text>
          </View>
          <Text style={styles.issueDesc}>{secondaryData.description}</Text>
          <View style={[styles.cueBadge, { borderColor: secondaryData.color + '40' }]}>
            <Text style={[styles.cueLabel, { color: secondaryData.color }]}>CUE</Text>
            <Text style={styles.cueText}>"{secondaryData.cue}"</Text>
          </View>
          <View style={styles.areaRow}>
            {secondaryData.areas.map((area) => (
              <TouchableOpacity
                key={area}
                style={[styles.areaChip, { borderColor: secondaryData.color + '40' }]}
                onPress={() => {
                  const key = FOCUS_TO_SECTION_KEY[area];
                  if (key) router.push(`/(app)/training/mechanical/${key}` as any);
                }}
              >
                <Text style={[styles.areaChipText, { color: secondaryData.color }]}>{area}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Why This Happens ─────────────────────── */}
        <Text style={styles.sectionLabel}>WHY THIS HAPPENS</Text>
        <View style={styles.whyCard}>
          <View style={styles.whyRow}>
            <View style={[styles.whyDot, { backgroundColor: primaryData.color }]} />
            <Text style={styles.whyText}>{ISSUE_WHY[diagnostic.primary]}</Text>
          </View>
          {diagnostic.primary !== diagnostic.secondary && (
            <>
              <View style={styles.whyDivider} />
              <View style={styles.whyRow}>
                <View style={[styles.whyDot, { backgroundColor: secondaryData.color }]} />
                <Text style={styles.whyText}>{ISSUE_WHY[diagnostic.secondary]}</Text>
              </View>
            </>
          )}
        </View>

        {/* ── Recommended Fixes ────────────────────── */}
        <Text style={styles.sectionLabel}>RECOMMENDED FIXES</Text>

        {drills.map(({ name, source }) => {
          const vaultMatch = findDrillInVault(name);
          const drillCard = vaultMatch?.drill ?? null;
          const isExpanded = expandedDrill === name;
          const sourceColor = source === 'primary' ? primaryData.color
            : source === 'secondary' ? secondaryData.color
            : ACCENT;
          const sourceLabel = source === 'primary' ? 'Primary Fix'
            : source === 'secondary' ? 'Secondary Fix'
            : 'Bonus';

          return (
            <TouchableOpacity
              key={name}
              style={[styles.drillCard, isExpanded && styles.drillCardExpanded]}
              onPress={() => setExpandedDrill(isExpanded ? null : name)}
              activeOpacity={0.8}
            >
              {/* Drill header */}
              <View style={styles.drillHeader}>
                <View style={[styles.drillIcon, { backgroundColor: sourceColor + '18' }]}>
                  <Ionicons name="baseball-outline" size={16} color={sourceColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.drillMeta}>
                    <View style={[styles.drillTag, { backgroundColor: sourceColor + '18' }]}>
                      <Text style={[styles.drillTagText, { color: sourceColor }]}>{sourceLabel}</Text>
                    </View>
                  </View>
                  <Text style={styles.drillName}>{name}</Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.textMuted}
                />
              </View>

              {/* Expanded drill detail */}
              {isExpanded && drillCard && (
                <View style={styles.drillBody}>
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: sourceColor }]}>FIXES</Text>
                    <Text style={styles.fieldText}>{drillCard.fixes}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: sourceColor }]}>HOW TO DO IT</Text>
                    <Text style={styles.fieldText}>{drillCard.howTo}</Text>
                  </View>
                  <View style={[styles.focusBadge, { borderColor: sourceColor + '40' }]}>
                    <Text style={[styles.focusLabel, { color: sourceColor }]}>FOCUS</Text>
                    <Text style={styles.focusText}>{drillCard.focus}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.goToSection}
                    onPress={() => {
                      if (vaultMatch) {
                        router.push(`/(app)/training/mechanical/${vaultMatch.sectionKey}` as any);
                      }
                    }}
                  >
                    <Ionicons name="open-outline" size={14} color={ACCENT} />
                    <Text style={styles.goToSectionText}>Open in Vault</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* No vault match — show link hint */}
              {isExpanded && !drillCard && (
                <View style={styles.drillBody}>
                  <Text style={styles.fieldText}>
                    This drill is part of your diagnostic fix plan. Full drill card coming soon.
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* ── Walk preview upgrade banner ────────── */}
        {isPreviewOnly && upgradeTarget && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={18} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeBannerTitle}>
                Unlock All Recommended Fixes
              </Text>
              <Text style={styles.upgradeBannerSub}>
                Upgrade to {upgradeTarget} for full troubleshooting with {allDrills.length} personalized drill recommendations.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* ── Start Training CTA ──────────────────── */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.push('/(app)/training/mechanical/daily-work' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={20} color={colors.bg} />
          <Text style={styles.startBtnText}>Start Today's Work</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.bg} />
        </TouchableOpacity>

        {/* Retake row */}
        <TouchableOpacity
          style={styles.retakeRow}
          onPress={() => router.push('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any)}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.textMuted} />
          <Text style={styles.retakeText}>Retake Swing Diagnostic to update recommendations</Text>
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
  retakeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ACCENT + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginTop: 8,
  },

  /* Issue cards */
  issueCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
  },
  issueHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  issueDot: { width: 10, height: 10, borderRadius: 5 },
  issueTitle: { fontSize: 18, fontWeight: '900' },
  issueDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  cueBadge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 10,
    backgroundColor: colors.bg,
    gap: 4,
  },
  cueLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  cueText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, fontStyle: 'italic' },

  areaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  areaChipText: { fontSize: 12, fontWeight: '700' },

  /* Why card */
  whyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
  },
  whyRow: { flexDirection: 'row', gap: 10 },
  whyDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  whyText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  whyDivider: { height: 1, backgroundColor: colors.border },

  /* Drill cards */
  drillCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
  },
  drillCardExpanded: { borderColor: colors.borderStrong },
  drillHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  drillIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drillMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  drillTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  drillTagText: { fontSize: 9, fontWeight: '800' },
  drillName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 2 },

  drillBody: {
    gap: 12,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fieldRow: { gap: 4 },
  fieldLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  fieldText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  focusBadge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 10,
    backgroundColor: colors.bg,
    gap: 4,
  },
  focusLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  focusText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  goToSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  goToSectionText: { fontSize: 12, fontWeight: '700', color: ACCENT },

  /* Upgrade banner */
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: ACCENT + '08',
    borderWidth: 1,
    borderColor: ACCENT + '30',
    borderRadius: radius.lg,
    padding: 14,
  },
  upgradeBannerTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  upgradeBannerSub: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginTop: 2 },

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

  retakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  retakeText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
});

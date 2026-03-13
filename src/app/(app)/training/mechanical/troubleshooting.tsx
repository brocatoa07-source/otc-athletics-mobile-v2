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
  type MechanicalDiagnosticResult,
} from '@/data/hitting-mechanical-diagnostic-data';
import type { MoverType } from '@/data/hitting-mover-type-data';
import {
  HITTING_VAULT_SECTIONS,
  type DrillCard,
} from '@/data/hitting-vault-sections';
import {
  getTroubleshootingIssuesForDiagnostic,
  type TroubleshootingIssueData,
} from '@/data/troubleshooting-issues';
import {
  getRecommendedDrills as getEngineRecommendation,
  flattenRecommendation,
} from '@/lib/recommendation/drillRecommendationEngine';

const ACCENT = '#f97316'; // matches troubleshooting section color

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
 * Build recommended drills via the recommendation engine,
 * then tag each drill with the matching troubleshooting issue
 * label and color for display.
 */
function getTroubleshootingDrills(
  issues: TroubleshootingIssueData[],
  diagnostic: MechanicalDiagnosticResult,
  moverType: MoverType | null,
): { name: string; issueLabel: string; issueColor: string }[] {
  const rec = getEngineRecommendation({
    primaryIssue: diagnostic.primary,
    secondaryIssue: diagnostic.secondary,
    moverType,
    age: null,
    recentDrills: [],
  });
  const flat = flattenRecommendation(rec);

  // Find the first matching troubleshooting issue for coloring
  const primaryIssue = issues.find((i) => i.diagnosticIssue === diagnostic.primary);
  const secondaryIssue = issues.find((i) => i.diagnosticIssue === diagnostic.secondary);
  const fallback = issues[0];

  return flat.map((entry) => {
    const issue = entry.role === 'primary'
      ? (primaryIssue ?? fallback)
      : entry.role === 'secondary'
        ? (secondaryIssue ?? fallback)
        : fallback;
    return {
      name: entry.name,
      issueLabel: entry.role === 'reset' ? 'Foundation' : issue.label,
      issueColor: entry.role === 'reset' ? '#22c55e' : issue.color,
    };
  });
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
        setMoverType((parsed.primary ?? parsed.slug ?? parsed) as MoverType);
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
  const { primary: primaryIssues, secondary: secondaryIssues } =
    getTroubleshootingIssuesForDiagnostic(diagnostic.primary, diagnostic.secondary);
  const allIssues = [...primaryIssues, ...secondaryIssues];
  const allDrills = getTroubleshootingDrills(allIssues, diagnostic, moverType);
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
        {/* ── Issues from diagnostic ─────────────────── */}
        {allIssues.map((issue, idx) => {
          const isPrimary = idx < primaryIssues.length;
          return (
            <View key={issue.slug}>
              <Text style={styles.sectionLabel}>
                {isPrimary ? 'PRIMARY ISSUE' : 'SECONDARY ISSUE'}
              </Text>
              <View style={[styles.issueCard, { borderColor: issue.color + '30' }]}>
                {/* Header */}
                <View style={styles.issueHeader}>
                  <View style={[styles.issueDot, { backgroundColor: issue.color }]} />
                  <Text style={[styles.issueTitle, { color: issue.color }]}>
                    {issue.label}
                  </Text>
                </View>

                {/* Description */}
                <Text style={styles.issueDesc}>{issue.description}</Text>

                {/* Symptoms */}
                <View style={styles.symptomList}>
                  <Text style={[styles.symptomLabel, { color: issue.color }]}>SYMPTOMS</Text>
                  {issue.symptoms.map((s) => (
                    <View key={s} style={styles.symptomRow}>
                      <View style={[styles.symptomBullet, { backgroundColor: issue.color }]} />
                      <Text style={styles.symptomText}>{s}</Text>
                    </View>
                  ))}
                </View>

                {/* Why */}
                <View style={[styles.whyInline, { borderColor: issue.color + '30' }]}>
                  <Text style={[styles.whyInlineLabel, { color: issue.color }]}>WHY THIS HAPPENS</Text>
                  <Text style={styles.whyInlineText}>{issue.why}</Text>
                </View>

                {/* What It Leads To */}
                <View style={[styles.leadsToBox, { borderColor: issue.color + '30' }]}>
                  <Text style={[styles.leadsToLabel, { color: issue.color }]}>WHAT IT LEADS TO</Text>
                  <Text style={styles.leadsToText}>{issue.whatItLeadsTo}</Text>
                </View>

                {/* Cue */}
                <View style={[styles.cueBadge, { borderColor: issue.color + '40' }]}>
                  <Text style={[styles.cueLabel, { color: issue.color }]}>CUE</Text>
                  <Text style={styles.cueText}>"{issue.cue}"</Text>
                </View>

                {/* Area chips */}
                <View style={styles.areaRow}>
                  {issue.areas.map((area: string) => (
                    <TouchableOpacity
                      key={area}
                      style={[styles.areaChip, { borderColor: issue.color + '40' }]}
                      onPress={() => {
                        const sKey = FOCUS_TO_SECTION_KEY[area];
                        if (sKey) router.push(`/(app)/training/mechanical/${sKey}` as any);
                      }}
                    >
                      <Text style={[styles.areaChipText, { color: issue.color }]}>{area}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          );
        })}

        {/* ── Recommended Fixes ────────────────────── */}
        <Text style={styles.sectionLabel}>RECOMMENDED FIXES</Text>

        {drills.map(({ name, issueLabel, issueColor }) => {
          const vaultMatch = findDrillInVault(name);
          const drillCard = vaultMatch?.drill ?? null;
          const isExpanded = expandedDrill === name;

          return (
            <TouchableOpacity
              key={name}
              style={[styles.drillCard, isExpanded && styles.drillCardExpanded]}
              onPress={() => setExpandedDrill(isExpanded ? null : name)}
              activeOpacity={0.8}
            >
              {/* Drill header */}
              <View style={styles.drillHeader}>
                <View style={[styles.drillIcon, { backgroundColor: issueColor + '18' }]}>
                  <Ionicons name="baseball-outline" size={16} color={issueColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.drillMeta}>
                    <View style={[styles.drillTag, { backgroundColor: issueColor + '18' }]}>
                      <Text style={[styles.drillTagText, { color: issueColor }]}>{issueLabel}</Text>
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
                    <Text style={[styles.fieldLabel, { color: issueColor }]}>FIXES</Text>
                    <Text style={styles.fieldText}>{drillCard.fixes}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: issueColor }]}>HOW TO DO IT</Text>
                    <Text style={styles.fieldText}>{drillCard.howTo}</Text>
                  </View>
                  <View style={[styles.focusBadge, { borderColor: issueColor + '40' }]}>
                    <Text style={[styles.focusLabel, { color: issueColor }]}>FOCUS</Text>
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

  /* Symptoms */
  symptomList: { gap: 6 },
  symptomLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginBottom: 2 },
  symptomRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  symptomBullet: { width: 5, height: 5, borderRadius: 3, marginTop: 6 },
  symptomText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  /* Why inline */
  whyInline: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 10,
    backgroundColor: colors.bg,
    gap: 4,
  },
  whyInlineLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  whyInlineText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  /* Leads to */
  leadsToBox: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 10,
    backgroundColor: colors.bg,
    gap: 4,
  },
  leadsToLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  leadsToText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

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

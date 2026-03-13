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
import { getUpgradeTargetLabel, WALK_TROUBLESHOOTING_DRILL_LIMIT } from '@/lib/tier-content';
import { MENTAL_PROFILES, type MentalProfileData } from '@/data/mental-profile-data';
import { type MentalDiagnosticResult } from '@/data/mental-struggles-data';
import {
  getMentalTroubleshootingIssuesForDiagnostic,
  type MentalTroubleshootingIssueData,
} from '@/data/mental-troubleshooting-issues';
import {
  getRecommendedMentalTools,
  flattenMentalRecommendation,
} from '@/lib/recommendation/mentalRecommendationEngine';
import { MENTAL_VAULT_SECTIONS } from '@/data/mental-vault-sections';

const ACCENT = '#8b5cf6';

function getTroubleshootingTools(
  allIssues: MentalTroubleshootingIssueData[],
  diagnostic: MentalDiagnosticResult,
  mentalProfile: MentalProfileData | null,
): { name: string; tag: string; tagColor: string }[] {
  const rec = getRecommendedMentalTools({
    primaryStruggle: diagnostic.primary,
    secondaryStruggle: diagnostic.secondary,
    mentalProfile: mentalProfile?.slug ?? null,
    recentTools: [],
  });
  const flat = flattenMentalRecommendation(rec);
  return flat.map((f) => {
    const issue = allIssues.find((i) => i.diagnosticStruggle === diagnostic.primary);
    return {
      name: f.name,
      tag: f.role === 'primary' ? (issue?.label ?? 'Primary') : f.role === 'secondary' ? 'Support' : 'Reflection',
      tagColor: f.role === 'primary' ? (issue?.color ?? ACCENT) : f.role === 'secondary' ? '#3b82f6' : '#22c55e',
    };
  });
}

export default function MentalTroubleshootingScreen() {
  const { tier, hasLimitedMental } = useTier();
  const [profile, setProfile] = useState<MentalProfileData | null>(null);
  const [diagnostic, setDiagnostic] = useState<MentalDiagnosticResult | null>(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('otc:mental-profile'),
      AsyncStorage.getItem('otc:mental-struggles'),
    ]).then(([pVal, dVal]) => {
      if (pVal) {
        try {
          const p = JSON.parse(pVal);
          const slug = p.slug ?? p;
          const found = Object.values(MENTAL_PROFILES).find((m) => m.slug === slug);
          if (found) setProfile(found);
        } catch {}
      }
      if (dVal) {
        try { setDiagnostic(JSON.parse(dVal)); } catch {}
      }
    });
  }, []);

  // ── Empty state ───────────────────────────────────
  if (!diagnostic) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>MENTAL</Text>
            <Text style={styles.headerTitle}>Troubleshooting</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="build-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Take Your Mental Assessment</Text>
          <Text style={styles.emptyDesc}>
            Complete the Mental Struggles Assessment to unlock personalized troubleshooting.
          </Text>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/training/mental/mental-struggles-quiz' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>Take Assessment</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { primary: primaryIssues, secondary: secondaryIssues } =
    getMentalTroubleshootingIssuesForDiagnostic(diagnostic.primary, diagnostic.secondary);
  const allIssues = [...primaryIssues, ...secondaryIssues];

  const allTools = getTroubleshootingTools(allIssues, diagnostic, profile);
  const isPreviewOnly = hasLimitedMental;
  const tools = isPreviewOnly ? allTools.slice(0, WALK_TROUBLESHOOTING_DRILL_LIMIT) : allTools;
  const upgradeTarget = getUpgradeTargetLabel(tier);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL</Text>
          <Text style={styles.headerTitle}>Troubleshooting</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Issue Cards */}
        {allIssues.map((issue) => (
          <View key={issue.slug} style={[styles.issueCard, { borderColor: issue.color + '30' }]}>
            <View style={styles.issueHeader}>
              <View style={[styles.issueDot, { backgroundColor: issue.color }]} />
              <Text style={styles.issueLabel}>{issue.label}</Text>
            </View>

            <Text style={styles.issueDesc}>{issue.description}</Text>

            {/* Symptoms */}
            <View style={styles.symptomList}>
              <Text style={styles.symptomLabel}>SYMPTOMS</Text>
              {issue.symptoms.map((s) => (
                <View key={s} style={styles.symptomRow}>
                  <Text style={styles.symptomBullet}>-</Text>
                  <Text style={styles.symptomText}>{s}</Text>
                </View>
              ))}
            </View>

            {/* Why */}
            <View style={styles.whyInline}>
              <Text style={styles.whyInlineLabel}>WHY THIS HAPPENS</Text>
              <Text style={styles.whyInlineText}>{issue.why}</Text>
            </View>

            {/* What it leads to */}
            <View style={[styles.leadsToBox, { backgroundColor: issue.color + '08' }]}>
              <Text style={[styles.leadsToLabel, { color: issue.color }]}>WHAT IT LEADS TO</Text>
              <Text style={styles.leadsToText}>{issue.whatItLeadsTo}</Text>
            </View>

            {/* Cue */}
            <View style={[styles.cueBadge, { backgroundColor: issue.color + '10' }]}>
              <Ionicons name="bulb-outline" size={14} color={issue.color} />
              <Text style={[styles.cueText, { color: issue.color }]}>{issue.cue}</Text>
            </View>

            {/* Areas */}
            <View style={styles.areasRow}>
              {issue.areas.map((area) => {
                const section = MENTAL_VAULT_SECTIONS.find((s) => s.label === area);
                return (
                  <TouchableOpacity
                    key={area}
                    style={[styles.areaChip, { backgroundColor: (section?.color ?? issue.color) + '15' }]}
                    onPress={() => {
                      if (section) router.push(`/(app)/training/mental/${section.key}` as any);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.areaChipText, { color: section?.color ?? issue.color }]}>
                      {area}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Recommended Fixes */}
        <Text style={styles.fixesHeader}>RECOMMENDED TOOLS</Text>
        {tools.map((tool, idx) => (
          <View key={`${tool.name}-${idx}`} style={styles.toolRow}>
            <View style={[styles.toolDot, { backgroundColor: tool.tagColor }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.toolName}>{tool.name}</Text>
              <Text style={[styles.toolTag, { color: tool.tagColor }]}>{tool.tag}</Text>
            </View>
          </View>
        ))}

        {/* Upgrade banner */}
        {isPreviewOnly && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={18} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Unlock All Recommended Tools</Text>
              <Text style={styles.upgradeSub}>
                Upgrade to {upgradeTarget} for full troubleshooting with {allTools.length} personalized tool recommendations.
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Retake */}
        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={() => router.push('/(app)/training/mental/mental-struggles-quiz' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.retakeBtnText}>Retake Assessment</Text>
        </TouchableOpacity>
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

  content: { padding: 16, paddingBottom: 60, gap: 12 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  emptyDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },

  issueCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg, padding: 16, gap: 10,
  },
  issueHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  issueDot: { width: 10, height: 10, borderRadius: 5 },
  issueLabel: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  issueDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  symptomList: { gap: 4 },
  symptomLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  symptomRow: { flexDirection: 'row', gap: 6, paddingLeft: 4 },
  symptomBullet: { fontSize: 13, color: colors.textMuted },
  symptomText: { flex: 1, fontSize: 13, color: colors.textSecondary },

  whyInline: { gap: 4 },
  whyInlineLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textMuted },
  whyInlineText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  leadsToBox: { borderRadius: radius.md, padding: 12, gap: 4 },
  leadsToLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  leadsToText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  cueBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: radius.md, padding: 10,
  },
  cueText: { flex: 1, fontSize: 13, fontWeight: '700', fontStyle: 'italic' },

  areasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  areaChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  areaChipText: { fontSize: 11, fontWeight: '800' },

  fixesHeader: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 8 },
  toolRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  toolDot: { width: 8, height: 8, borderRadius: 4 },
  toolName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  toolTag: { fontSize: 11, fontWeight: '700', marginTop: 2 },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14,
  },
  upgradeTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  upgradeSub: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginTop: 2 },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  retakeBtn: { alignItems: 'center', paddingVertical: 12 },
  retakeBtnText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
});

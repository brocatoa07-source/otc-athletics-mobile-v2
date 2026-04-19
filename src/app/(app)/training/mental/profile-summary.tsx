/**
 * Mental Profile Summary — unified coach interpretation of all 3 diagnostics.
 *
 * Shows: headline, coach read, strengths, watch-outs, development priorities,
 * recommended tools/journal/meditation/course week, and next actions.
 *
 * Handles partial completion (1 or 2 diagnostics done) with a fallback state.
 */

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useMentalProfile } from '@/hooks/useMentalProfile';
import { synthesizeProfile, type ProfileSummary } from '@/features/mental/mentalProfileSummary';
import { ARCHETYPE_INFO, type ArchetypeKey } from '@/data/mental-diagnostics-data';

const ACCENT = '#8b5cf6';

export default function ProfileSummaryScreen() {
  const { profile, isLoading, allDiagnosticsComplete, completedTypes } = useMentalProfile();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={ACCENT} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Fallback: not all diagnostics complete ──
  if (!allDiagnosticsComplete || !profile) {
    const done = completedTypes.size;
    return (
      <SafeAreaView style={styles.safe}>
        <Header />
        <View style={styles.center}>
          <Ionicons name="clipboard-outline" size={48} color={ACCENT} />
          <Text style={styles.fallbackTitle}>Profile Incomplete</Text>
          <Text style={styles.fallbackDesc}>
            You've completed {done} of 3 diagnostics. Finish all 3 to generate your full Mental Profile Summary.
          </Text>

          {/* Show partial results if archetype is done */}
          {completedTypes.has('archetype') && profile?.primary_archetype && (
            <View style={styles.partialCard}>
              <Text style={styles.partialLabel}>ARCHETYPE</Text>
              <Text style={styles.partialValue}>
                {ARCHETYPE_INFO[profile.primary_archetype as ArchetypeKey]?.name ?? profile.primary_archetype}
              </Text>
            </View>
          )}
          {completedTypes.has('identity') && profile?.identity_profile && (
            <View style={styles.partialCard}>
              <Text style={styles.partialLabel}>IDENTITY</Text>
              <Text style={styles.partialValue}>{profile.identity_profile}</Text>
            </View>
          )}
          {completedTypes.has('habits') && profile?.habit_profile && (
            <View style={styles.partialCard}>
              <Text style={styles.partialLabel}>HABITS</Text>
              <Text style={styles.partialValue}>{profile.habit_profile}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
          >
            <Text style={styles.ctaBtnText}>Continue Diagnostics</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Full summary ──
  const summary = synthesizeProfile(profile);

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ═══ Headline Card ═══ */}
        <View style={[styles.heroCard, { borderColor: ACCENT + '40' }]}>
          <Text style={[styles.heroLabel, { color: ACCENT }]}>YOUR MENTAL PROFILE</Text>
          <Text style={styles.heroHeadline}>{summary.headline}</Text>
          {summary.scores.archetype.secondary && (
            <Text style={styles.heroSecondary}>
              Secondary: {summary.scores.archetype.secondary}
            </Text>
          )}
        </View>

        {/* ═══ Coach Read ═══ */}
        <View style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <Ionicons name="megaphone-outline" size={16} color={ACCENT} />
            <Text style={[styles.coachLabel, { color: ACCENT }]}>COACH READ</Text>
          </View>
          <Text style={styles.coachText}>{summary.coachRead}</Text>
        </View>

        {/* ═══ Scores Overview ═══ */}
        <Text style={styles.sectionLabel}>DIAGNOSTIC SCORES</Text>
        <View style={styles.scoresRow}>
          <ScoreChip
            label="Archetype"
            value={summary.scores.archetype.primary}
            color="#8b5cf6"
          />
          <ScoreChip
            label="Identity"
            value={`ISS ${summary.scores.identity.iss.toFixed(1)}`}
            sub={summary.scores.identity.profile.replace(' Identity', '').replace(' Competitor', '')}
            color={issColor(summary.scores.identity.iss)}
          />
          <ScoreChip
            label="Habits"
            value={`HSS ${summary.scores.habits.hss.toFixed(1)}`}
            sub={summary.scores.habits.profile.replace(' System', '')}
            color={hssColor(summary.scores.habits.hss)}
          />
        </View>

        {/* ═══ Strengths ═══ */}
        <Text style={styles.sectionLabel}>YOUR STRENGTHS</Text>
        {summary.strengths.map((s, i) => (
          <BulletRow key={i} icon="trending-up-outline" color="#22c55e" text={s} />
        ))}

        {/* ═══ Watch-Outs ═══ */}
        <Text style={styles.sectionLabel}>WATCH-OUTS</Text>
        {summary.watchOuts.map((w, i) => (
          <BulletRow key={i} icon="alert-circle-outline" color="#f59e0b" text={w} />
        ))}

        {/* ═══ Development Priorities ═══ */}
        <Text style={styles.sectionLabel}>DEVELOPMENT PRIORITIES</Text>
        {summary.priorities.map((p, i) => (
          <View key={i} style={styles.priorityCard}>
            <View style={styles.priorityHeader}>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColor(p.source) + '18' }]}>
                <Text style={[styles.priorityNum, { color: priorityColor(p.source) }]}>{i + 1}</Text>
              </View>
              <Text style={styles.priorityLabel}>{p.label}</Text>
              <View style={[styles.sourceTag, { backgroundColor: priorityColor(p.source) + '15' }]}>
                <Text style={[styles.sourceText, { color: priorityColor(p.source) }]}>{p.source}</Text>
              </View>
            </View>
            <Text style={styles.priorityWhy}>{p.why}</Text>
          </View>
        ))}

        {/* ═══ Recommended Tools ═══ */}
        <Text style={styles.sectionLabel}>RECOMMENDED FOR YOU</Text>

        {/* Toolbox categories */}
        <TouchableOpacity
          style={styles.recCard}
          onPress={() => router.push('/(app)/training/mental/toolbox' as any)}
          activeOpacity={0.75}
        >
          <Ionicons name="build-outline" size={16} color={ACCENT} />
          <View style={{ flex: 1 }}>
            <Text style={styles.recLabel}>Toolbox Categories</Text>
            <Text style={styles.recValue}>{summary.toolboxCategories.join(', ')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Journal — deep-links to the specific journal */}
        <TouchableOpacity
          style={styles.recCard}
          onPress={() => router.push(`/(app)/training/mental/journals?type=${summary.recommendedJournal.key}` as any)}
          activeOpacity={0.75}
        >
          <Ionicons name="journal-outline" size={16} color="#3b82f6" />
          <View style={{ flex: 1 }}>
            <Text style={styles.recLabel}>{summary.recommendedJournal.name}</Text>
            <Text style={styles.recValue}>{summary.recommendedJournal.reason}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Meditation — deep-links to the specific meditation */}
        <TouchableOpacity
          style={styles.recCard}
          onPress={() => router.push(`/(app)/training/mental/meditations?key=${summary.recommendedMeditation.key}` as any)}
          activeOpacity={0.75}
        >
          <Ionicons name="headset-outline" size={16} color="#a855f7" />
          <View style={{ flex: 1 }}>
            <Text style={styles.recLabel}>{summary.recommendedMeditation.name}</Text>
            <Text style={styles.recValue}>{summary.recommendedMeditation.reason}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Course — deep-links to the specific course week */}
        <TouchableOpacity
          style={styles.recCard}
          onPress={() => router.push(`/(app)/training/mental/course?id=${summary.courseRecommendation.weekId}` as any)}
          activeOpacity={0.75}
        >
          <Ionicons name="school-outline" size={16} color="#f97316" />
          <View style={{ flex: 1 }}>
            <Text style={styles.recLabel}>Start with Week {summary.courseRecommendation.weekNum}: {summary.courseRecommendation.skillName}</Text>
            <Text style={styles.recValue}>{summary.courseRecommendation.reason}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══ Next Actions ═══ */}
        <Text style={styles.sectionLabel}>NEXT ACTIONS</Text>
        {summary.nextActions.map((a, i) => (
          <TouchableOpacity
            key={i}
            style={styles.actionRow}
            onPress={() => a.route && router.push(a.route as any)}
            activeOpacity={0.75}
          >
            <Ionicons name={a.icon as any} size={18} color={ACCENT} />
            <Text style={styles.actionText}>{a.action}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* ═══ View Individual Results ═══ */}
        <TouchableOpacity
          style={styles.diagLink}
          onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
          activeOpacity={0.7}
        >
          <Ionicons name="clipboard-outline" size={14} color={colors.textMuted} />
          <Text style={styles.diagLinkText}>View Individual Diagnostic Results</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Header() {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={[styles.headerSup, { color: ACCENT }]}>MENTAL VAULT</Text>
        <Text style={styles.headerTitle}>My Mental Profile</Text>
      </View>
    </View>
  );
}

function BulletRow({ icon, color, text }: { icon: string; color: string; text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Ionicons name={icon as any} size={14} color={color} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function ScoreChip({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <View style={[styles.scoreChip, { borderColor: color + '30' }]}>
      <Text style={[styles.scoreChipLabel, { color }]}>{label.toUpperCase()}</Text>
      <Text style={styles.scoreChipValue}>{value}</Text>
      {sub && <Text style={[styles.scoreChipSub, { color }]}>{sub}</Text>}
    </View>
  );
}

function issColor(iss: number): string {
  if (iss >= 4.3) return '#f59e0b';
  if (iss >= 3.7) return '#22c55e';
  if (iss >= 3.0) return '#3b82f6';
  return '#8b5cf6';
}

function hssColor(hss: number): string {
  if (hss >= 4.3) return '#f59e0b';
  if (hss >= 3.7) return '#22c55e';
  if (hss >= 3.0) return '#3b82f6';
  return '#8b5cf6';
}

function priorityColor(source: string): string {
  switch (source) {
    case 'archetype': return '#8b5cf6';
    case 'identity': return '#3b82f6';
    case 'habits': return '#22c55e';
    default: return colors.textMuted;
  }
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 16, paddingBottom: 60, gap: 12 },

  /* Hero */
  heroCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 20, gap: 6,
  },
  heroLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  heroHeadline: { fontSize: 20, fontWeight: '900', color: colors.textPrimary, lineHeight: 26 },
  heroSecondary: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  /* Coach Read */
  coachCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 8,
  },
  coachHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coachLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  coachText: { fontSize: 14, color: colors.textSecondary, lineHeight: 21, fontStyle: 'italic' },

  /* Scores */
  scoresRow: { flexDirection: 'row', gap: 8 },
  scoreChip: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.md, padding: 10, alignItems: 'center', gap: 2,
  },
  scoreChipLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  scoreChipValue: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  scoreChipSub: { fontSize: 10, fontWeight: '700' },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 8 },

  /* Bullets */
  bulletRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  bulletText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  /* Priorities */
  priorityCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 6,
  },
  priorityHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priorityBadge: {
    width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  priorityNum: { fontSize: 12, fontWeight: '900' },
  priorityLabel: { flex: 1, fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  sourceTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  sourceText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  priorityWhy: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginLeft: 32 },

  /* Recommendations */
  recCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  recLabel: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  recValue: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginTop: 2 },

  /* Next Actions */
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  actionText: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  /* Diag link */
  diagLink: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    justifyContent: 'center', paddingVertical: 12,
  },
  diagLinkText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },

  /* Fallback */
  fallbackTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  fallbackDesc: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 19 },
  partialCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, width: '100%', gap: 2,
  },
  partialLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: ACCENT },
  partialValue: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  ctaBtn: {
    paddingVertical: 14, paddingHorizontal: 28, borderRadius: radius.md, marginTop: 8,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

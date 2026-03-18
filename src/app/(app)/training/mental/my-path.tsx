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
import { useMentalProfile } from '@/hooks/useMentalProfile';
import { MENTAL_PROFILES, type MentalProfileData } from '@/data/mental-profile-data';
import { MENTAL_STRUGGLES, type MentalDiagnosticResult } from '@/data/mental-struggles-data';
import {
  QUICKFIX_TO_MENTAL_FOCUS,
  STRUGGLE_TO_QUICKFIX,
} from '@/data/mental-tool-catalog';
import {
  getRecommendedMentalTools,
  flattenMentalRecommendation,
  type FlatMentalTool,
} from '@/lib/recommendation/mentalRecommendationEngine';
import { MENTAL_VAULT_SECTIONS } from '@/data/mental-vault-sections';
import { ARCHETYPE_PATHS } from '@/data/mental-archetype-paths';
import { ARCHETYPE_INFO } from '@/data/mental-diagnostics-data';
import type { ArchetypeKey } from '@/data/mental-diagnostics-data';

const ACCENT = '#8b5cf6';

/* ── ISS / HSS Score Bands ─────────────────────────── */
interface ScoreBand { min: number; label: string; color: string; meaning: string }

const ISS_BANDS: ScoreBand[] = [
  { min: 4.5, label: 'Elite', color: '#22c55e', meaning: 'Rock-solid identity — you know who you are and play from that place consistently.' },
  { min: 3.8, label: 'Stable', color: '#3b82f6', meaning: 'Strong foundation with occasional self-doubt under pressure.' },
  { min: 3.0, label: 'Developing', color: '#f59e0b', meaning: 'Identity shifts based on performance — good days feel great, bad days feel lost.' },
  { min: 2.0, label: 'Fragile', color: '#ef4444', meaning: 'Self-worth is tied to results. Mistakes shake your confidence deeply.' },
  { min: 0, label: 'Reactive', color: '#dc2626', meaning: 'No consistent sense of self as a player. Emotions and others define you.' },
];

const HSS_BANDS: ScoreBand[] = [
  { min: 4.5, label: 'Elite System', color: '#22c55e', meaning: 'Locked-in daily habits that drive consistent performance.' },
  { min: 3.8, label: 'Structured', color: '#3b82f6', meaning: 'Good routines in place — some gaps on off-days or travel.' },
  { min: 3.0, label: 'Inconsistent', color: '#f59e0b', meaning: 'Habits exist but aren\'t automatic. Effort required to stay on track.' },
  { min: 2.0, label: 'Reactive', color: '#ef4444', meaning: 'Little structure — you train when you feel like it.' },
  { min: 0, label: 'Chaos', color: '#dc2626', meaning: 'No system. Performance is unpredictable because preparation is random.' },
];

function getBand(score: number, bands: ScoreBand[]): ScoreBand {
  for (const band of bands) {
    if (score >= band.min) return band;
  }
  return bands[bands.length - 1];
}

export default function MentalMyPathScreen() {
  const { gate, isLoading: gateLoading } = useGating();
  const { profile: dbProfile } = useMentalProfile();
  const [localProfile, setLocalProfile] = useState<MentalProfileData | null>(null);
  const [diagnostic, setDiagnostic] = useState<MentalDiagnosticResult | null>(null);
  const [recommended, setRecommended] = useState<FlatMentalTool[]>([]);
  const [scoringOpen, setScoringOpen] = useState(false);
  const [localLoaded, setLocalLoaded] = useState(false);

  const mentalDiagDone = gate.mental.archetypeDone && gate.mental.identityDone && gate.mental.habitsDone;

  // Load local quiz data (fallback)
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('otc:mental-profile'),
      AsyncStorage.getItem('otc:mental-struggles'),
    ]).then(([profileVal, diagVal]) => {
      if (profileVal) {
        try {
          const parsed = JSON.parse(profileVal);
          const slug = parsed.slug ?? parsed;
          const found = Object.values(MENTAL_PROFILES).find((m) => m.slug === slug);
          if (found) setLocalProfile(found);
        } catch {}
      }
      if (diagVal) {
        try {
          const parsed: MentalDiagnosticResult = JSON.parse(diagVal);
          setDiagnostic(parsed);
        } catch {}
      }
      setLocalLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!diagnostic || !localProfile) return;
    const rec = getRecommendedMentalTools({
      primaryStruggle: diagnostic.primary,
      secondaryStruggle: diagnostic.secondary,
      mentalProfile: localProfile.slug,
      recentTools: [],
    });
    setRecommended(flattenMentalRecommendation(rec));
  }, [diagnostic, localProfile]);

  // Archetype path from DB profile
  const archetypePath = dbProfile?.primary_archetype
    ? ARCHETYPE_PATHS[dbProfile.primary_archetype]
    : null;
  const archetypeInfo = dbProfile?.primary_archetype
    ? ARCHETYPE_INFO[dbProfile.primary_archetype as ArchetypeKey]
    : null;

  // ── Wait for gate + local data before deciding state ──
  if (gateLoading || !localLoaded) return null;

  // ── Empty state ───────────────────────────────────
  if (!mentalDiagDone && !localProfile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>MENTAL</Text>
            <Text style={styles.headerTitle}>My Path</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="map-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Complete Your Mental Assessments</Text>
          <Text style={styles.emptyDesc}>
            Complete the Vault Diagnostics to generate your personalized mental path.
          </Text>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>Start Diagnostics</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL</Text>
          <Text style={styles.headerTitle}>My Path</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── DB Archetype Profile (primary) ────────── */}
        {archetypePath && archetypeInfo && (
          <View style={[styles.archetypeCard, { borderColor: archetypePath.color + '40' }]}>
            <Text style={[styles.archetypeEyebrow, { color: archetypePath.color }]}>YOUR ARCHETYPE</Text>
            <Text style={[styles.archetypeName, { color: archetypePath.color }]}>{archetypePath.label}</Text>
            <Text style={styles.archetypeTagline}>{archetypePath.tagline}</Text>
            {dbProfile?.secondary_archetype && ARCHETYPE_INFO[dbProfile.secondary_archetype as ArchetypeKey] && (
              <Text style={styles.secondaryText}>
                Secondary: {ARCHETYPE_INFO[dbProfile.secondary_archetype as ArchetypeKey].name}
              </Text>
            )}
          </View>
        )}

        {/* ── DB Profile Scores with Band Interpretation ── */}
        {dbProfile && (() => {
          const issBand = dbProfile.iss != null ? getBand(dbProfile.iss, ISS_BANDS) : null;
          const hssBand = dbProfile.hss != null ? getBand(dbProfile.hss, HSS_BANDS) : null;
          return (
            <>
              <View style={styles.scoresRow}>
                <View style={[styles.scoreBox, { borderColor: (issBand?.color ?? '#3b82f6') + '30' }]}>
                  <Text style={styles.scoreLabel}>ISS</Text>
                  <Text style={[styles.scoreValue, { color: issBand?.color ?? '#3b82f6' }]}>
                    {dbProfile.iss?.toFixed(1)}
                  </Text>
                  {issBand && (
                    <View style={[styles.bandBadge, { backgroundColor: issBand.color + '15' }]}>
                      <Text style={[styles.bandBadgeText, { color: issBand.color }]}>{issBand.label}</Text>
                    </View>
                  )}
                  <Text style={styles.scoreProfile}>{dbProfile.identity_profile}</Text>
                </View>
                <View style={[styles.scoreBox, { borderColor: (hssBand?.color ?? '#22c55e') + '30' }]}>
                  <Text style={styles.scoreLabel}>HSS</Text>
                  <Text style={[styles.scoreValue, { color: hssBand?.color ?? '#22c55e' }]}>
                    {dbProfile.hss?.toFixed(1)}
                  </Text>
                  {hssBand && (
                    <View style={[styles.bandBadge, { backgroundColor: hssBand.color + '15' }]}>
                      <Text style={[styles.bandBadgeText, { color: hssBand.color }]}>{hssBand.label}</Text>
                    </View>
                  )}
                  <Text style={styles.scoreProfile}>{dbProfile.habit_profile}</Text>
                </View>
              </View>

              {/* Band meaning */}
              {(issBand || hssBand) && (
                <View style={styles.bandMeaningCard}>
                  {issBand && (
                    <Text style={styles.bandMeaningText}>
                      <Text style={{ fontWeight: '800', color: issBand.color }}>ISS — {issBand.label}: </Text>
                      {issBand.meaning}
                    </Text>
                  )}
                  {hssBand && (
                    <Text style={styles.bandMeaningText}>
                      <Text style={{ fontWeight: '800', color: hssBand.color }}>HSS — {hssBand.label}: </Text>
                      {hssBand.meaning}
                    </Text>
                  )}
                </View>
              )}

              {/* Collapsible scoring guide */}
              <TouchableOpacity
                style={styles.scoringToggle}
                onPress={() => setScoringOpen(!scoringOpen)}
                activeOpacity={0.7}
              >
                <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                <Text style={styles.scoringToggleText}>How scoring works</Text>
                <View style={{ flex: 1 }} />
                <Ionicons name={scoringOpen ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
              </TouchableOpacity>
              {scoringOpen && (
                <View style={styles.scoringGuide}>
                  <Text style={styles.scoringGuideTitle}>Identity Strength Score (ISS)</Text>
                  {ISS_BANDS.map((b) => (
                    <View key={b.label} style={styles.scoringRow}>
                      <View style={[styles.scoringDot, { backgroundColor: b.color }]} />
                      <Text style={styles.scoringRange}>{b.min === 0 ? '<2.0' : `${b.min}+`}</Text>
                      <Text style={[styles.scoringBandLabel, { color: b.color }]}>{b.label}</Text>
                    </View>
                  ))}
                  <Text style={[styles.scoringGuideTitle, { marginTop: 10 }]}>Habit Structure Score (HSS)</Text>
                  {HSS_BANDS.map((b) => (
                    <View key={b.label} style={styles.scoringRow}>
                      <View style={[styles.scoringDot, { backgroundColor: b.color }]} />
                      <Text style={styles.scoringRange}>{b.min === 0 ? '<2.0' : `${b.min}+`}</Text>
                      <Text style={[styles.scoringBandLabel, { color: b.color }]}>{b.label}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          );
        })()}

        {/* ── Recommended Course ───────────────────── */}
        {archetypePath && (
          <>
            <Text style={styles.sectionLabel}>RECOMMENDED COURSE</Text>
            <TouchableOpacity
              style={[styles.courseCard, { borderColor: archetypePath.color + '30' }]}
              onPress={() => router.push(archetypePath.recommendedCourse.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.courseIcon, { backgroundColor: archetypePath.color + '18' }]}>
                <Ionicons name="school-outline" size={22} color={archetypePath.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.courseName, { color: archetypePath.color }]}>
                  {archetypePath.recommendedCourse.label}
                </Text>
                <Text style={styles.courseSub}>Start your personalized course</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={archetypePath.color} />
            </TouchableOpacity>
          </>
        )}

        {/* ── Focus Skills ─────────────────────────── */}
        {archetypePath && (
          <>
            <Text style={styles.sectionLabel}>FOCUS SKILLS</Text>
            <View style={styles.areasRow}>
              {archetypePath.focusSkills.map((skill) => (
                <View key={skill} style={[styles.areaChip, { backgroundColor: archetypePath.color + '15' }]}>
                  <Text style={[styles.areaChipText, { color: archetypePath.color }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Top Tools ────────────────────────────── */}
        {archetypePath && (
          <>
            <Text style={styles.sectionLabel}>TOP TOOLS FOR YOU</Text>
            {archetypePath.topTools.map((tool) => (
              <View key={tool} style={styles.toolRow}>
                <View style={[styles.toolDot, { backgroundColor: archetypePath.color }]} />
                <Text style={styles.toolName}>{tool}</Text>
              </View>
            ))}
          </>
        )}

        {/* ── Recommended Journal ──────────────────── */}
        {archetypePath && (
          <>
            <Text style={styles.sectionLabel}>RECOMMENDED JOURNAL</Text>
            <TouchableOpacity
              style={styles.journalCard}
              onPress={() => router.push('/(app)/training/mental/journals' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="book-outline" size={20} color="#3b82f6" />
              <Text style={styles.journalName}>{archetypePath.journalType.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </>
        )}

        {/* ── DB Focus Areas ───────────────────────── */}
        {dbProfile?.primary_focus && dbProfile.primary_focus.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>PERSONALIZED FOCUS AREAS</Text>
            {dbProfile.primary_focus.map((f: string) => (
              <View key={f} style={styles.focusItem}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.focusItemText}>{f}</Text>
              </View>
            ))}
          </>
        )}

        {/* ── Legacy struggle-based recommendations (fallback) ── */}
        {!archetypePath && diagnostic && localProfile && (
          <>
            <View style={[styles.profileCard, { borderColor: localProfile.color + '30' }]}>
              <View style={[styles.profileDot, { backgroundColor: localProfile.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.profileLabel}>Your Mental Profile</Text>
                <Text style={[styles.profileName, { color: localProfile.color }]}>{localProfile.name}</Text>
                <Text style={styles.profileTagline}>{localProfile.tagline}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>CURRENT FOCUS</Text>
            <View style={styles.focusRow}>
              <View style={[styles.focusCard, { borderColor: MENTAL_STRUGGLES[diagnostic.primary].color + '30' }]}>
                <Text style={styles.focusType}>Primary</Text>
                <Text style={[styles.focusName, { color: MENTAL_STRUGGLES[diagnostic.primary].color }]}>
                  {MENTAL_STRUGGLES[diagnostic.primary].label}
                </Text>
              </View>
              <View style={[styles.focusCard, { borderColor: MENTAL_STRUGGLES[diagnostic.secondary].color + '30' }]}>
                <Text style={styles.focusType}>Secondary</Text>
                <Text style={[styles.focusName, { color: MENTAL_STRUGGLES[diagnostic.secondary].color }]}>
                  {MENTAL_STRUGGLES[diagnostic.secondary].label}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>FOCUS AREAS</Text>
            <View style={styles.areasRow}>
              {[
                ...(QUICKFIX_TO_MENTAL_FOCUS[STRUGGLE_TO_QUICKFIX[diagnostic.primary]] ?? []),
                ...(QUICKFIX_TO_MENTAL_FOCUS[STRUGGLE_TO_QUICKFIX[diagnostic.secondary]] ?? []),
              ].filter((v, i, a) => a.indexOf(v) === i).map((area) => {
                const section = MENTAL_VAULT_SECTIONS.find((s) => s.label === area);
                return (
                  <TouchableOpacity
                    key={area}
                    style={[styles.areaChip, { backgroundColor: (section?.color ?? ACCENT) + '15' }]}
                    onPress={() => { if (section) router.push(`/(app)/training/mental/${section.key}` as any); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.areaChipText, { color: section?.color ?? ACCENT }]}>{area}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>RECOMMENDED TOOLS</Text>
            {recommended.map((entry, idx) => {
              const roleColor = entry.role === 'primary' ? '#ef4444' : entry.role === 'secondary' ? '#3b82f6' : '#22c55e';
              const roleLabel = entry.role === 'primary' ? 'Primary Tool' : entry.role === 'secondary' ? 'Support Tool' : 'Reflection';
              return (
                <View key={`${entry.name}-${idx}`} style={styles.toolRow}>
                  <View style={[styles.toolDot, { backgroundColor: roleColor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toolName}>{entry.name}</Text>
                    <Text style={[styles.toolTag, { color: roleColor }]}>{roleLabel}</Text>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* ── How to Train ─────────────────────────── */}
        <View style={styles.howToCard}>
          <Text style={styles.howToTitle}>How to Train</Text>
          {[
            'Complete your daily mental work every day',
            'Practice your primary tools before games',
            'Use your reflection prompt after every game',
            'Review your progress weekly',
          ].map((item) => (
            <View key={item} style={styles.howToRow}>
              <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              <Text style={styles.howToText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
          onPress={() => router.push('/(app)/training/mental/daily-work' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="flash" size={18} color="#fff" />
          <Text style={styles.ctaBtnText}>Start Today's Mental Work</Text>
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

  archetypeCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 4,
  },
  archetypeEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  archetypeName: { fontSize: 22, fontWeight: '900' },
  archetypeTagline: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  secondaryText: { fontSize: 12, color: colors.textMuted, marginTop: 4 },

  scoresRow: { flexDirection: 'row', gap: 10 },
  scoreBox: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 14, gap: 2, alignItems: 'center',
  },
  scoreLabel: { fontSize: 10, fontWeight: '900', color: colors.textMuted, letterSpacing: 1 },
  scoreValue: { fontSize: 24, fontWeight: '900' },
  scoreProfile: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },

  bandBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 2 },
  bandBadgeText: { fontSize: 11, fontWeight: '900' },
  bandMeaningCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 6,
  },
  bandMeaningText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  scoringToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 2,
  },
  scoringToggleText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  scoringGuide: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 6,
  },
  scoringGuideTitle: { fontSize: 12, fontWeight: '900', color: colors.textPrimary },
  scoringRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoringDot: { width: 8, height: 8, borderRadius: 4 },
  scoringRange: { fontSize: 11, fontWeight: '700', color: colors.textMuted, width: 32 },
  scoringBandLabel: { fontSize: 12, fontWeight: '800' },

  courseCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 14,
  },
  courseIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  courseName: { fontSize: 15, fontWeight: '900' },
  courseSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 6 },

  areasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  areaChipText: { fontSize: 13, fontWeight: '800' },

  toolRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  toolDot: { width: 8, height: 8, borderRadius: 4 },
  toolName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  toolTag: { fontSize: 11, fontWeight: '700', marginTop: 2 },

  journalCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  journalName: { flex: 1, fontSize: 14, fontWeight: '800', color: colors.textPrimary },

  focusItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  focusItemText: { flex: 1, fontSize: 13, color: colors.textSecondary },

  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg, padding: 16,
  },
  profileDot: { width: 12, height: 12, borderRadius: 6 },
  profileLabel: { fontSize: 10, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.8 },
  profileName: { fontSize: 18, fontWeight: '900' },
  profileTagline: { fontSize: 12, color: colors.textSecondary },

  focusRow: { flexDirection: 'row', gap: 10 },
  focusCard: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 14, gap: 2,
  },
  focusType: { fontSize: 10, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.5 },
  focusName: { fontSize: 15, fontWeight: '900' },

  howToCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 8, marginTop: 4,
  },
  howToTitle: { fontSize: 14, fontWeight: '900', color: colors.textPrimary },
  howToRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  howToText: { flex: 1, fontSize: 13, color: colors.textSecondary },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, marginTop: 4,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

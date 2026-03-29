/**
 * MentalProfileCard — Coaching-style scouting report for the mental vault.
 *
 * Architecture matches Strength and Hitting profile cards:
 *   1. Identity (archetype + tagline)
 *   2. Core Pattern (summary)
 *   3. Pressure Response
 *   4. Strengths
 *   5. Watch-Outs
 *   6. Game Day Cues
 *   7. Development Focus
 *   8. Scores (ISS / HSS)
 *   9. Retake CTA
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { MentalProfile } from '@/types/database';
import { ARCHETYPE_INFO, type ArchetypeKey } from '@/data/mental-diagnostics-data';
import type { DiagnosticType } from '@/data/mental-diagnostics-data';

const ACCENT = '#8b5cf6';

/* ─── Score bar ───────────────────────────────────────────────────────── */

function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <View style={bar.track}>
      <View style={[bar.fill, { width: `${pct}%` as any }]} />
    </View>
  );
}

const bar = StyleSheet.create({
  track: { height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', flex: 1 },
  fill: { height: 5, backgroundColor: ACCENT, borderRadius: 3 },
});

/* ─── Main component ──────────────────────────────────────────────────── */

interface Props {
  profile: MentalProfile;
  completedTypes: Set<DiagnosticType>;
}

export function MentalProfileCard({ profile, completedTypes }: Props) {
  const archKey = profile.primary_archetype as ArchetypeKey;
  const arch = ARCHETYPE_INFO[archKey];
  const secondaryName = profile.secondary_archetype
    ? ARCHETYPE_INFO[profile.secondary_archetype as ArchetypeKey]?.name
    : null;

  if (!arch) return null;

  return (
    <View style={styles.card}>
      {/* ── Header ────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles" size={16} color={ACCENT} />
        </View>
        <Text style={styles.eyebrow}>MENTAL PROFILE</Text>
      </View>

      {/* ── Identity ──────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.archetypeName}>{arch.name}</Text>
        <Text style={styles.archetypeTagline}>"{arch.tagline}"</Text>
        {secondaryName && (
          <Text style={styles.secondary}>Secondary: {secondaryName}</Text>
        )}
      </View>

      <View style={styles.divider} />

      {/* ── Core Mental Pattern ───────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>CORE MENTAL PATTERN</Text>
        <Text style={styles.summaryText}>{arch.summary}</Text>
      </View>

      <View style={styles.divider} />

      {/* ── Pressure Response ─────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>UNDER PRESSURE YOU MAY</Text>
        {arch.pressureResponse.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: '#f59e0b60' }]} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* ── Strengths ─────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>MENTAL STRENGTHS</Text>
        {arch.strengths.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: ACCENT }]} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* ── Watch-Outs ────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>WATCH-OUTS</Text>
        {arch.watchOuts.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: '#f59e0b60' }]} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* ── Game Day Cues ─────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>GAME DAY CUES</Text>
        {arch.cues.map((cue) => (
          <View key={cue} style={styles.cueCard}>
            <Ionicons name="mic-outline" size={13} color={ACCENT} />
            <Text style={styles.cueText}>{cue}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* ── Development Focus ─────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: ACCENT }]}>DEVELOPMENT FOCUS</Text>
        <View style={styles.emphasisWrap}>
          {arch.developmentFocus.map((item) => (
            <View key={item} style={styles.emphasisTag}>
              <Text style={styles.emphasisTagText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* ── Scores ────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>IDENTITY · {profile.identity_profile}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Identity Strength</Text>
          <Text style={[styles.scoreValue, { color: ACCENT }]}>{profile.iss}</Text>
        </View>
        <ScoreBar value={profile.iss ?? 0} />
        <View style={styles.subScoreRow}>
          <Text style={styles.subScoreText}>
            Approval Load: <Text style={styles.subScoreNum}>{profile.approval_load}</Text>
          </Text>
          <Text style={styles.subScoreSep}>·</Text>
          <Text style={styles.subScoreText}>
            Outcome Attachment: <Text style={styles.subScoreNum}>{profile.outcome_attachment}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>HABITS · {profile.habit_profile}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Habit Strength</Text>
          <Text style={[styles.scoreValue, { color: ACCENT }]}>{profile.hss}</Text>
        </View>
        <ScoreBar value={profile.hss ?? 0} />
      </View>

      <View style={styles.divider} />

      {/* ── Retake ────────────────────────── */}
      <View style={styles.retakeSection}>
        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
          activeOpacity={0.75}
        >
          <Ionicons name="refresh-outline" size={14} color={ACCENT} />
          <Text style={styles.retakeBtnText}>Retake Diagnostics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: ACCENT + '25',
    borderRadius: radius.lg,
    flexDirection: 'column',
  },

  headerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
  },
  iconWrap: {
    width: 26, height: 26, borderRadius: 7,
    backgroundColor: ACCENT + '18', alignItems: 'center', justifyContent: 'center',
  },
  eyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },

  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },

  section: { paddingHorizontal: 16, paddingVertical: 12, gap: 6 },
  sectionLabel: {
    fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginBottom: 2,
  },

  archetypeName: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  archetypeTagline: { fontSize: 12, fontStyle: 'italic', color: colors.textSecondary, lineHeight: 18 },
  secondary: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  summaryText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  cueCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 10, borderWidth: 1, borderRadius: radius.md,
    backgroundColor: ACCENT + '08', borderColor: ACCENT + '20',
  },
  cueText: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary, lineHeight: 17 },

  emphasisWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  emphasisTag: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    borderWidth: 1, backgroundColor: ACCENT + '10', borderColor: ACCENT + '25',
  },
  emphasisTagText: { fontSize: 11, fontWeight: '700', color: ACCENT },

  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scoreLabel: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  scoreValue: { fontSize: 22, fontWeight: '900' },
  subScoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  subScoreText: { fontSize: 11, color: colors.textMuted },
  subScoreNum: { fontWeight: '800', color: colors.textSecondary },
  subScoreSep: { color: colors.border },

  retakeSection: { paddingHorizontal: 16, paddingVertical: 12 },
  retakeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1,
    borderColor: ACCENT + '40',
  },
  retakeBtnText: { fontSize: 13, fontWeight: '800', color: ACCENT },
});

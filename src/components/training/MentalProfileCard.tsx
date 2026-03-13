import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { MentalProfile } from '@/types/database';
import type { DiagnosticType } from '@/data/mental-diagnostics-data';

const ACCENT = '#8b5cf6';

/* ─── Archetype display names ─────────────────────────────────────────── */

const ARCHETYPE_META: Record<string, { name: string; tagline: string }> = {
  reactor:     { name: 'The Reactor',     tagline: 'Emotion → Reaction → Regret' },
  overthinker: { name: 'The Overthinker', tagline: 'Analysis → Paralysis → Tension' },
  avoider:     { name: 'The Avoider',     tagline: 'Avoid Discomfort → Play Small' },
  performer:   { name: 'The Performer',   tagline: 'Plays for Approval' },
  doubter:     { name: 'The Doubter',     tagline: 'I hope I do well' },
  driver:      { name: 'The Driver',      tagline: 'Push → Grind → Override → Burnout' },
};

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
  track: {
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    flex: 1,
  },
  fill: {
    height: 5,
    backgroundColor: ACCENT,
    borderRadius: 3,
  },
});

/* ─── Retake button ───────────────────────────────────────────────────── */

function RetakeBtn({ label, done }: { label: string; done: boolean }) {
  return (
    <TouchableOpacity
      style={[btnStyles.base, done && btnStyles.done]}
      onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
      activeOpacity={0.75}
    >
      {done && <Ionicons name="checkmark-circle" size={13} color={ACCENT} />}
      <Text style={[btnStyles.label, done && btnStyles.labelDone]}>{label}</Text>
    </TouchableOpacity>
  );
}

const btnStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  done: {
    borderColor: ACCENT + '40',
    backgroundColor: ACCENT + '0F',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  labelDone: {
    color: ACCENT,
  },
});

/* ─── Main component ──────────────────────────────────────────────────── */

interface Props {
  profile: MentalProfile;
  completedTypes: Set<DiagnosticType>;
}

export function MentalProfileCard({ profile, completedTypes }: Props) {
  const arch = ARCHETYPE_META[profile.primary_archetype];
  const secondaryArch = profile.secondary_archetype
    ? ARCHETYPE_META[profile.secondary_archetype]
    : null;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles" size={16} color={ACCENT} />
        </View>
        <Text style={styles.eyebrow}>MENTAL PROFILE</Text>
      </View>

      {/* Archetype */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ARCHETYPE</Text>
        <Text style={styles.archetypeName}>{arch?.name ?? profile.primary_archetype}</Text>
        {arch?.tagline && (
          <Text style={styles.archetypeTagline}>"{arch.tagline}"</Text>
        )}
        {secondaryArch && (
          <Text style={styles.secondary}>
            Secondary: {secondaryArch.name}
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      {/* Identity */}
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

      <View style={styles.divider} />

      {/* Habits */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>HABITS · {profile.habit_profile}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Habit Strength</Text>
          <Text style={[styles.scoreValue, { color: ACCENT }]}>{profile.hss}</Text>
        </View>
        <ScoreBar value={profile.hss ?? 0} />
      </View>

      <View style={styles.divider} />

      {/* Retake row */}
      <View style={styles.retakeSection}>
        <Text style={styles.retakeLabel}>RETAKE DIAGNOSTICS</Text>
        <View style={styles.retakeRow}>
          <RetakeBtn label="Archetype" done={completedTypes.has('archetype')} />
          <RetakeBtn label="Identity"  done={completedTypes.has('identity')} />
          <RetakeBtn label="Habits"    done={completedTypes.has('habits')} />
        </View>
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
    overflow: 'hidden',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: ACCENT + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: ACCENT,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },

  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: colors.textMuted,
    marginBottom: 2,
  },

  archetypeName: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  archetypeTagline: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  secondary: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '900',
  },

  subScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  subScoreText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  subScoreNum: {
    fontWeight: '800',
    color: colors.textSecondary,
  },
  subScoreSep: {
    color: colors.border,
  },

  retakeSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  retakeLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: colors.textMuted,
  },
  retakeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});

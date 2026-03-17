import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { DevelopmentStatus } from '@/types/progress';

const PHASE_FOCUS: Record<string, string> = {
  'Off-Season Development': 'Base Building + Recovery',
  'Pre-Season Prep':        'Speed + Contact + Game Readiness',
  'In-Season Maintenance':  'Performance + Recovery',
  'Training':               'Athletic Development',
};

function getPhaseFocus(phase: string): string {
  return PHASE_FOCUS[phase] ?? 'Athletic Development';
}

const DAYS_28 = 28;

interface Props {
  phaseName: string | null;
  weekNumber: number | null;
  developmentStatus: DevelopmentStatus;
  daysSinceLastKeyMetric: number | null;
  hasProfile: boolean;
}

export function PhaseControlPanel({
  phaseName,
  weekNumber,
  developmentStatus,
  daysSinceLastKeyMetric,
  hasProfile,
}: Props) {
  const verified = developmentStatus === 'verified';

  const weekInBlock = weekNumber !== null ? ((weekNumber - 1) % 4) + 1 : null;

  let retestText: string | null = null;
  let retestUrgency: 'ok' | 'warning' | 'overdue' = 'ok';
  if (daysSinceLastKeyMetric !== null) {
    const remaining = DAYS_28 - daysSinceLastKeyMetric;
    if (remaining <= 0) {
      retestText = 'Retest overdue';
      retestUrgency = 'overdue';
    } else if (remaining <= 14) {
      retestText = `Retest in ${remaining}d`;
      retestUrgency = 'warning';
    } else {
      retestText = `Retest in ${remaining}d`;
      retestUrgency = 'ok';
    }
  }

  const retestPillColor =
    retestUrgency === 'overdue' ? '#ef4444'
    : retestUrgency === 'warning' ? '#f59e0b'
    : '#22c55e';

  if (!hasProfile) {
    return (
      <View style={styles.card}>
        <Text style={styles.eyebrow}>PHASE CONTROL</Text>
        <Text style={styles.noProfileTitle}>No Program Active</Text>
        <Text style={styles.noProfileSub}>
          Set up your S&C profile to activate your development phase.
        </Text>
        <TouchableOpacity
          style={styles.setupBtn}
          onPress={() => router.push('/(app)/training/sc/diagnostics' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.setupBtnText}>Set Up Profile</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.black} />
        </TouchableOpacity>
      </View>
    );
  }

  const displayPhase = phaseName ?? 'Training';
  const phaseFocus = getPhaseFocus(displayPhase);

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>PHASE CONTROL</Text>
      <Text style={styles.phaseName}>{displayPhase}</Text>
      <Text style={styles.phaseFocus}>{phaseFocus}</Text>

      <View style={styles.pillRow}>
        {weekInBlock !== null && (
          <View style={styles.pill}>
            <Text style={styles.pillText}>Week {weekInBlock} / 4</Text>
          </View>
        )}
        {retestText && (
          <View style={[styles.pill, { borderColor: retestPillColor + '50', backgroundColor: retestPillColor + '12' }]}>
            <View style={[styles.pillDot, { backgroundColor: retestPillColor }]} />
            <Text style={[styles.pillText, { color: retestPillColor }]}>{retestText}</Text>
          </View>
        )}
        {!retestText && (
          <View style={[styles.pill, { borderColor: '#6b728050', backgroundColor: '#6b728012' }]}>
            <Text style={[styles.pillText, { color: colors.textMuted }]}>No baseline</Text>
          </View>
        )}
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: verified ? '#22c55e' : colors.textMuted }]} />
        <Text style={[styles.statusText, { color: verified ? '#22c55e' : colors.textMuted }]}>
          {verified ? 'Metrics Verified' : 'No recent test'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 20,
    gap: 6,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 4,
  },
  phaseName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  phaseFocus: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.surfaceElevated,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  noProfileTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  noProfileSub: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  setupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  setupBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.black,
  },
});

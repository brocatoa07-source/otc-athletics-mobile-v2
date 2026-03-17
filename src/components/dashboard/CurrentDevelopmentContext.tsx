import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useMyProgram } from '@/hooks/useMyProgram';
import { useMetricsStatus } from '@/hooks/useMetricsStatus';
import { useAccountability } from '@/hooks/useAccountability';

const PHASE_FOCUS: Record<string, string> = {
  'Off-Season Development': 'Base Building + Recovery',
  'Pre-Season Prep':        'Speed + Contact + Game Readiness',
  'In-Season Maintenance':  'Performance + Recovery',
  'Training':               'Athletic Development',
};

function getPhaseFocus(phase: string): string {
  return PHASE_FOCUS[phase] ?? 'Athletic Development';
}

const DAYS_84 = 84;

export function CurrentDevelopmentContext() {
  const { weekPlan } = useMyProgram();
  const { developmentStatus, daysSinceLastKeyMetric } = useMetricsStatus();
  const { result: accountability } = useAccountability();

  const phase = weekPlan?.phase ?? null;
  const phaseFocus = phase ? getPhaseFocus(phase) : null;
  const progressPct = accountability?.score ?? null;
  const verified = developmentStatus === 'verified';

  let retestText: string | null = null;
  let retestUrgent = false;
  if (daysSinceLastKeyMetric !== null) {
    const remaining = DAYS_84 - daysSinceLastKeyMetric;
    retestUrgent = remaining <= 14;
    retestText = remaining <= 0 ? 'Retest overdue' : `Retest in ${remaining}d`;
  }

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => router.push('/(app)/progress' as any)}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          {phase ? (
            <Text style={styles.phaseText} numberOfLines={1}>
              {phase}{phaseFocus ? ` · ${phaseFocus}` : ''}
            </Text>
          ) : (
            <Text style={styles.noPhaseText}>No active program</Text>
          )}
        </View>
        <View style={styles.statusChip}>
          <View style={[styles.statusDot, { backgroundColor: verified ? '#22c55e' : '#f59e0b' }]} />
          <Text style={[styles.statusLabel, { color: verified ? '#22c55e' : '#f59e0b' }]}>
            {verified ? 'Verified' : 'Unverified'}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.progressWrap}>
          <Text style={styles.progressLabel}>
            Progress {progressPct !== null ? `${progressPct}%` : '—'}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[
              styles.progressFill,
              { width: `${progressPct ?? 0}%` },
            ]} />
          </View>
        </View>

        {retestText ? (
          <Text style={[styles.retestText, retestUrgent && { color: '#f59e0b' }]}>
            {retestText}
          </Text>
        ) : (
          <Text style={styles.retestText}>No retest data</Text>
        )}

        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    gap: 8,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phaseText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  noPhaseText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: colors.surfaceElevated,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressWrap: {
    flex: 1,
    gap: 4,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#22c55e',
  },
  retestText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    flexShrink: 0,
  },
});

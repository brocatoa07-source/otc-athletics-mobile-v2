import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { DevelopmentStatus, StandardStatus } from '@/types/progress';

interface Props {
  tierLabel: string;
  developmentStatus: DevelopmentStatus;
  standardStatus: StandardStatus | null;
  isLoading?: boolean;
}

const STATUS_CONFIG: Record<StandardStatus, { label: string; color: string }> = {
  below: { label: 'Below Standard', color: '#ef4444' },
  on:    { label: 'On Standard',    color: '#f59e0b' },
  above: { label: 'Above Standard', color: '#22c55e' },
};

export function IdentityStandardBanner({ tierLabel, developmentStatus, standardStatus, isLoading }: Props) {
  const verified = developmentStatus === 'verified';

  return (
    <View style={styles.card}>
      {/* Tier chip */}
      <View style={styles.tierChip}>
        <Ionicons name="shield-checkmark-outline" size={12} color={colors.textMuted} />
        <Text style={styles.tierText}>{tierLabel}</Text>
      </View>

      <View style={styles.divider} />

      {/* Status */}
      {isLoading ? (
        <View style={styles.statusRow}>
          <Text style={styles.statusMuted}>Checking status...</Text>
        </View>
      ) : verified && standardStatus ? (
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: STATUS_CONFIG[standardStatus].color }]} />
          <Text style={[styles.statusLabel, { color: STATUS_CONFIG[standardStatus].color }]}>
            {STATUS_CONFIG[standardStatus].label}
          </Text>
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.statusRow}
          onPress={() => router.push('/(app)/training/metrics-log' as any)}
          activeOpacity={0.75}
        >
          <Ionicons name="alert-circle-outline" size={14} color="#f59e0b" />
          <Text style={styles.unverifiedLabel}>Development Unverified</Text>
          <Text style={styles.unverifiedCta}>Log metrics →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  tierChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: colors.border,
  },
  statusRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  verifiedPill: {
    marginLeft: 4,
    backgroundColor: '#22c55e18',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#22c55e',
    letterSpacing: 0.8,
  },
  unverifiedLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f59e0b',
    flex: 1,
  },
  unverifiedCta: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  statusMuted: {
    fontSize: 12,
    color: colors.textMuted,
  },
});

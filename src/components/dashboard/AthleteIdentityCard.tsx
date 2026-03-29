/**
 * AthleteIdentityCard — Compact dashboard card showing the athlete's core profiles.
 *
 * Sources:
 *   Hitting: useDiagnosticResult('hitting', 'mover-type') → combinedProfile label
 *   Mental:  useMentalProfile() → primary_archetype from mental_profiles
 *   Strength: useDiagnosticResult('sc', 'lifting-mover') → LIFTING_MOVER_TYPES lookup
 *
 * Hidden entirely if no profile data exists.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius } from '@/theme';
import { useDiagnosticResult } from '@/hooks/useDiagnosticResult';
import { useMentalProfile } from '@/hooks/useMentalProfile';
import { COMBINED_PROFILE_LABELS } from '@/data/hitting-identity-data';
import { ARCHETYPE_INFO } from '@/data/mental-diagnostics-data';
import { LIFTING_MOVER_TYPES } from '@/data/lifting-mover-type-data';

export function AthleteIdentityCard() {
  const { result: identityResult } = useDiagnosticResult('hitting', 'mover-type');
  const { profile: mentalProfile } = useMentalProfile();
  const { result: liftingMover } = useDiagnosticResult('sc', 'lifting-mover');

  const hittingLabel = identityResult
    ? COMBINED_PROFILE_LABELS[identityResult.combinedProfile]
    : null;

  const mentalLabel = mentalProfile?.primary_archetype
    ? ARCHETYPE_INFO[mentalProfile.primary_archetype as keyof typeof ARCHETYPE_INFO]?.name
    : null;

  const strengthLabel = liftingMover
    ? LIFTING_MOVER_TYPES[liftingMover]?.name
    : null;

  // Hide entirely if no profile data
  if (!hittingLabel && !mentalLabel && !strengthLabel) return null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/(app)/profile/athlete-identity' as any)}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <Ionicons name="person-outline" size={14} color={colors.textMuted} />
        <Text style={styles.headerLabel}>YOUR IDENTITY</Text>
        <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
      </View>

      <View style={styles.profiles}>
        {hittingLabel && (
          <View style={styles.profileRow}>
            <View style={[styles.dot, { backgroundColor: '#E10600' }]} />
            <Text style={styles.profileText} numberOfLines={1}>{hittingLabel}</Text>
          </View>
        )}
        {mentalLabel && (
          <View style={styles.profileRow}>
            <View style={[styles.dot, { backgroundColor: '#A78BFA' }]} />
            <Text style={styles.profileText} numberOfLines={1}>{mentalLabel}</Text>
          </View>
        )}
        {strengthLabel && (
          <View style={styles.profileRow}>
            <View style={[styles.dot, { backgroundColor: '#1DB954' }]} />
            <Text style={styles.profileText} numberOfLines={1}>{strengthLabel}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 12,
    gap: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLabel: {
    flex: 1,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.textMuted,
  },
  profiles: { gap: 4 },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  profileText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});

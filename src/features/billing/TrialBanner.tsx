/**
 * TrialBanner — Dashboard banner for trial states.
 *
 * Shows different content based on:
 *   - Trial eligible (WALK/SINGLE, never used trial) → "Start free trial"
 *   - Trial active → "X days remaining"
 *   - Trial expired → "Trial ended, choose a plan"
 *   - Not eligible (DOUBLE+) → null
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius } from '@/theme';
import { useAccess } from './useAccess';

export function TrialBanner() {
  const access = useAccess();

  if (!access.loaded) return null;

  // Trial eligible — show start CTA
  if (access.trialEligible) {
    return (
      <TouchableOpacity
        style={[styles.banner, { borderColor: '#3b82f640' }]}
        onPress={() => access.startTrial()}
        activeOpacity={0.8}
      >
        <View style={[styles.iconWrap, { backgroundColor: '#3b82f615' }]}>
          <Ionicons name="gift" size={18} color="#3b82f6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>7-Day Free Trial</Text>
          <Text style={styles.subtitle}>
            Unlock Mental + Hitting development for free. No commitment.
          </Text>
        </View>
        <View style={[styles.cta, { backgroundColor: '#3b82f6' }]}>
          <Text style={styles.ctaText}>Start</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Trial active — show days remaining
  if (access.trialActive) {
    return (
      <View style={[styles.banner, { borderColor: '#22c55e40' }]}>
        <View style={[styles.iconWrap, { backgroundColor: '#22c55e15' }]}>
          <Ionicons name="time" size={18} color="#22c55e" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Free Trial Active</Text>
          <Text style={styles.subtitle}>
            {access.trialDaysRemaining} day{access.trialDaysRemaining !== 1 ? 's' : ''} remaining. Enjoying it? Keep your access.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: '#22c55e' }]}
          onPress={() => router.push('/(app)/upgrade' as any)}
        >
          <Text style={styles.ctaText}>Plans</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Trial expired — show choose plan
  if (access.trialExpired) {
    return (
      <TouchableOpacity
        style={[styles.banner, { borderColor: '#f59e0b40' }]}
        onPress={() => router.push('/(app)/upgrade' as any)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconWrap, { backgroundColor: '#f59e0b15' }]}>
          <Ionicons name="alert-circle" size={18} color="#f59e0b" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Trial Ended</Text>
          <Text style={styles.subtitle}>
            Your free trial has ended. Choose a plan to continue your development.
          </Text>
        </View>
        <View style={[styles.cta, { backgroundColor: '#f59e0b' }]}>
          <Text style={styles.ctaText}>Plans</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Not eligible — don't show
  return null;
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
    marginTop: 2,
  },
  cta: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  ctaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});

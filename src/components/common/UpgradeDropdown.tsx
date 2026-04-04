import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTier } from '@/hooks/useTier';
import type { AthleteTier } from '@/types/database';

const TIER_LABELS: Record<AthleteTier, string> = {
  WALK: 'WALK',
  SINGLE: 'SINGLE',
  DOUBLE: 'DOUBLE',
  TRIPLE: 'TRIPLE',
  HOME_RUN: 'HOME RUN',
  GRAND_SLAM: 'GRAND SLAM',
};

const TIER_COLORS: Record<AthleteTier, string> = {
  WALK: Colors.textMuted,
  SINGLE: '#22c55e',
  DOUBLE: Colors.primary,
  TRIPLE: Colors.warning,
  HOME_RUN: '#a855f7',
  GRAND_SLAM: '#e11d48',
};

export function UpgradeDropdown() {
  const { isCoach, isHomeRun, isWalk, tier } = useTier();

  // Don't render for coaches or top-tier users
  if (isCoach || isHomeRun) return null;

  const accentColor = TIER_COLORS[tier];

  return (
    <View>
      <TouchableOpacity
        style={[styles.trigger, { borderColor: accentColor }]}
        onPress={() => router.push('/(app)/upgrade')}
        activeOpacity={0.7}
      >
        <Ionicons name="flash" size={16} color={accentColor} />
        <Text style={styles.triggerLabel}>
          {isWalk ? 'Upgrade Plan' : `Current: ${TIER_LABELS[tier]}`}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  triggerLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

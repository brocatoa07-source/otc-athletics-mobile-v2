import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import type { AthleteTier } from '@/types/database';

interface TierBadgeProps {
  tier: AthleteTier | 'COACH';
}

const TIER_LABELS: Record<AthleteTier | 'COACH', string> = {
  WALK: 'WALK',
  SINGLE: 'SINGLE',
  DOUBLE: 'DOUBLE',
  TRIPLE: 'TRIPLE',
  HOME_RUN: 'HOME RUN',
  COACH: 'COACH',
};

const TIER_COLORS: Record<AthleteTier | 'COACH', string> = {
  WALK: Colors.textMuted,
  SINGLE: '#22c55e',
  DOUBLE: Colors.primary,
  TRIPLE: Colors.warning,
  HOME_RUN: '#a855f7',
  COACH: Colors.info,
};

export function TierBadge({ tier }: TierBadgeProps) {
  return (
    <View style={[styles.badge, { borderColor: TIER_COLORS[tier] }]}>
      <Text style={[styles.label, { color: TIER_COLORS[tier] }]}>
        {TIER_LABELS[tier]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});

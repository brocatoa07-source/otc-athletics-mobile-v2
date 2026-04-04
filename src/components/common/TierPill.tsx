import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import type { AthleteTier } from '@/types/database';

type PaidTier = Exclude<AthleteTier, 'WALK'>;

interface TierPillProps {
  requiredTier: PaidTier;
  variant?: 'light' | 'dark';
}

const PILL_CONFIG: Record<PaidTier, { label: string; color: string }> = {
  SINGLE: { label: 'SINGLE', color: '#22c55e' },
  DOUBLE: { label: 'DOUBLE', color: Colors.primary },
  TRIPLE: { label: 'TRIPLE', color: Colors.warning },
  HOME_RUN: { label: 'HOME RUN', color: '#a855f7' },
  GRAND_SLAM: { label: 'GRAND SLAM', color: '#e11d48' },
};

export function TierPill({ requiredTier, variant = 'light' }: TierPillProps) {
  const { label, color } = PILL_CONFIG[requiredTier];
  const isDark = variant === 'dark';

  return (
    <View
      style={[
        styles.pill,
        isDark
          ? { backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.4)' }
          : { backgroundColor: color + '15', borderColor: color + '30' },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: isDark ? '#fff' : color },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    flexShrink: 0,
  },
  label: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});

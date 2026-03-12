import { View, StyleSheet } from 'react-native';
import { accents, type AccentKey } from '@/theme';

interface Props {
  accent?: AccentKey;
  color?: string;
}

export function SectionAccentBar({ accent, color }: Props) {
  const barColor = color ?? (accent ? accents[accent] : accents.neutral);

  return <View style={[styles.bar, { backgroundColor: barColor + '99' }]} />;
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 2,
  },
});

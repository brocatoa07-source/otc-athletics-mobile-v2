/**
 * ContentPlaceholder — Shows a styled placeholder when video/content is not yet available.
 */

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

interface ContentPlaceholderProps {
  message?: string;
  icon?: string;
  height?: number;
}

export function ContentPlaceholder({
  message = 'Content coming soon.',
  icon = 'videocam-outline',
  height = 180,
}: ContentPlaceholderProps) {
  return (
    <View style={[styles.container, { height }]}>
      <Ionicons name={icon as any} size={32} color={colors.textMuted} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
});

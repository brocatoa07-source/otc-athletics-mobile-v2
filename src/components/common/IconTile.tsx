import { useRef } from 'react';
import { Animated, Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, accents, accentGlow, radius, type AccentKey } from '@/theme';

interface IconTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  accent?: AccentKey | string;
  onPress: () => void;
  disabled?: boolean;
  badge?: string;
}

function resolveAccentColor(accent?: AccentKey | string): string {
  if (!accent) return accents.neutral;
  if (accent in accents) return accents[accent as AccentKey];
  return accent; // raw hex fallback
}

export function IconTile({ icon, title, subtitle, accent, onPress, disabled, badge }: IconTileProps) {
  const glowColor = resolveAccentColor(accent);
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 1.02, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <Pressable
        style={({ pressed }) => [
          styles.tile,
          accentGlow(glowColor, pressed ? 'medium' : 'subtle'),
          disabled && styles.tileDisabled,
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
      >
        <View style={styles.iconWrap}>
          <Ionicons
            name={icon}
            size={26}
            color={disabled ? colors.textMuted : colors.icon}
          />
        </View>
        {badge && (
          <View style={[styles.badge, { backgroundColor: glowColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Text style={[styles.title, disabled && styles.titleDisabled]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 8,
    minHeight: 130,
  },
  tileDisabled: {
    opacity: 0.4,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  titleDisabled: {
    color: colors.textMuted,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
});

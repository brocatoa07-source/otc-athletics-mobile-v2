/**
 * AccessGate — Wrapper component that locks content based on tier access.
 *
 * Uses the central access system. Shows locked overlay with
 * tier-appropriate upgrade messaging and CTA.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius } from '@/theme';
import { useAccess, type PermissionKey } from './useAccess';
import { TIER_COLORS } from './tierAccess';

interface AccessGateProps {
  children: React.ReactNode;
  /** The permission key to check */
  permission: PermissionKey;
  /** Optional: override the lock message */
  message?: string;
  /** If true, hide entirely instead of showing locked preview */
  hideWhenLocked?: boolean;
}

export function AccessGate({
  children,
  permission,
  message,
  hideWhenLocked = false,
}: AccessGateProps) {
  const access = useAccess();

  // Unlocked — render children normally
  if (access.hasAccess(permission)) {
    return <>{children}</>;
  }

  // Hidden — render nothing
  if (hideWhenLocked && !access.isVisible(permission)) {
    return null;
  }

  const copy = access.upgradeCopy(permission);
  const targetColor = TIER_COLORS[copy.targetTier];

  const handleCTA = () => {
    if (copy.ctaAction === 'trial' && access.trialEligible) {
      // Start trial directly
      access.startTrial().then((success) => {
        if (!success) {
          router.push('/(app)/upgrade' as any);
        }
      });
    } else {
      router.push('/(app)/upgrade' as any);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.blurred} pointerEvents="none">
        {children}
      </View>
      <View style={styles.overlay}>
        <Ionicons name="lock-closed" size={28} color={targetColor} />
        <Text style={styles.headline}>{message ?? copy.headline}</Text>
        <Text style={styles.body}>{copy.body}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: targetColor }]}
          onPress={handleCTA}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{copy.ctaLabel}</Text>
        </TouchableOpacity>

        {/* Trial banner for eligible users */}
        {access.trialEligible && copy.ctaAction !== 'trial' && (
          <TouchableOpacity
            onPress={() => access.startTrial()}
            activeOpacity={0.7}
          >
            <Text style={styles.trialLink}>Or start your 7-day free trial</Text>
          </TouchableOpacity>
        )}

        {/* Active trial indicator */}
        {access.trialActive && (
          <View style={styles.trialBadge}>
            <Ionicons name="time" size={12} color="#3b82f6" />
            <Text style={styles.trialText}>
              {access.trialDaysRemaining} day{access.trialDaysRemaining !== 1 ? 's' : ''} left in trial
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Inline lock indicator — smaller, for use inside lists/cards.
 */
export function InlineLock({ permission }: { permission: PermissionKey }) {
  const access = useAccess();

  if (access.hasAccess(permission)) return null;

  const required = access.lockReason(permission);
  return (
    <View style={styles.inlineLock}>
      <Ionicons name="lock-closed" size={10} color={colors.textMuted} />
      <Text style={styles.inlineLockText}>{required}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  blurred: {
    opacity: 0.12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  body: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  button: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  trialLink: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#3b82f615',
    borderRadius: radius.sm,
  },
  trialText: {
    color: '#3b82f6',
    fontSize: 10,
    fontWeight: '700',
  },
  inlineLock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  inlineLockText: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
  },
});

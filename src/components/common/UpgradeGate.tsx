import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme';

interface UpgradeGateProps {
  children: React.ReactNode;
  locked: boolean;
  requiredTier?: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'HOME_RUN';
  message?: string;
}

export function UpgradeGate({
  children,
  locked,
  requiredTier = 'SINGLE',
  message,
}: UpgradeGateProps) {
  if (!locked) return <>{children}</>;

  const tierLabel = requiredTier.replace('_', ' ');

  return (
    <View style={styles.wrapper}>
      <View style={styles.blurred} pointerEvents="none">
        {children}
      </View>
      <View style={styles.overlay}>
        <Ionicons name="lock-closed" size={28} color={colors.textSecondary} />
        <Text style={styles.lockText}>{message ?? `Requires ${tierLabel} tier`}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(app)/upgrade')}
        >
          <Text style={styles.buttonText}>View Plans</Text>
        </TouchableOpacity>
      </View>
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
    opacity: 0.15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
  },
  lockText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  buttonText: {
    color: colors.black,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

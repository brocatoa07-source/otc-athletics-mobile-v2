import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { useTier } from '@/hooks/useTier';

/**
 * Post-checkout landing screen.
 *
 * Stripe redirects here via `otclab://upgrade-success` after a successful payment.
 * The screen:
 *   1. Immediately re-fetches the athlete profile (the webhook + sync trigger
 *      will have updated athletes.tier by now, or within seconds)
 *   2. Polls up to 3 times if the tier hasn't changed yet (webhook latency)
 *   3. Shows a confirmation with the new tier, then lets the user continue
 */
export default function UpgradeSuccessScreen() {
  const refreshAthleteProfile = useAuthStore((s) => s.refreshAthleteProfile);
  const { tier } = useTier();
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 4;
    const intervalMs = 2000;

    async function pollProfile() {
      while (attempts < maxAttempts && !cancelled) {
        await refreshAthleteProfile();
        attempts++;
        // After each refresh, the component will re-render with the new tier.
        // We stop polling after maxAttempts regardless — the realtime listener
        // in useSubscription will catch any later update.
        if (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, intervalMs));
        }
      }
      if (!cancelled) setRefreshing(false);
    }

    pollProfile();
    return () => { cancelled = true; };
  }, [refreshAthleteProfile]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {refreshing ? (
          <>
            <ActivityIndicator size="large" color={Colors.success} />
            <Text style={styles.loadingText}>Confirming your membership...</Text>
          </>
        ) : (
          <>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark-sharp" size={40} color="#000" />
            </View>
            <Text style={styles.headline}>Membership Updated</Text>
            <Text style={styles.subline}>
              You're now on <Text style={styles.tierText}>{tier.replace('_', ' ')}</Text>.
              {'\n'}Your new content is unlocked.
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => router.replace('/(app)/upgrade' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>View Membership</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.replace('/(app)/dashboard' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subline: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  tierText: {
    fontWeight: '800',
    color: Colors.success,
  },
  btn: {
    backgroundColor: Colors.success,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  btnText: { fontWeight: '800', fontSize: 15, color: '#000' },
  secondaryBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.textMuted,
  },
});

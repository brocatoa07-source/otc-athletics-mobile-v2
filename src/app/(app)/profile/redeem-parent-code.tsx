/**
 * Redeem Parent Code — Parent enters an athlete's invite code to link.
 */

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { colors, radius } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { useParentInvite } from '@/hooks/useParentInvite';

const ACCENT = '#8b5cf6';

export default function RedeemParentCodeScreen() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  const { loading, redeemCode } = useParentInvite();
  const queryClient = useQueryClient();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleRedeem() {
    if (!userId || !code.trim()) return;
    setError(null);

    const result = await redeemCode(userId, code);
    if (result.ok) {
      // Refresh auth BEFORE navigating — await so new links are in state
      if (__DEV__) console.log('[redeem] success, refreshing profile...');
      await useAuthStore.getState().fetchProfile(userId);

      // Switch active athlete to the newly linked one
      const newIds = useAuthStore.getState().parentLinkedAthleteIds;
      if (__DEV__) console.log('[redeem] new linked ids:', newIds);
      if (result.linkedAthleteId && newIds.includes(result.linkedAthleteId)) {
        useAuthStore.getState().setParentActiveAthlete(result.linkedAthleteId);
        if (__DEV__) console.log('[redeem] switched active to:', result.linkedAthleteId);
      } else if (newIds.length > 0) {
        // Fallback: select the last added (newest)
        useAuthStore.getState().setParentActiveAthlete(newIds[newIds.length - 1]);
      }

      // Invalidate all parent dashboard queries so they refetch with new athlete
      queryClient.invalidateQueries({ queryKey: ['parent-athlete-data'] });
      queryClient.invalidateQueries({ queryKey: ['parent-athlete-profiles'] });

      Alert.alert('Linked!', 'You are now connected to your athlete\'s progress dashboard.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      setError(result.error ?? 'Something went wrong.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>PARENT</Text>
          <Text style={styles.headerTitle}>Connect to Athlete</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <Ionicons name="link" size={36} color={ACCENT} />
            <Text style={styles.heroTitle}>Enter Invite Code</Text>
            <Text style={styles.heroDesc}>
              Enter the 6-character code your athlete shared with you to connect to their progress dashboard.
            </Text>
          </View>

          <View style={styles.inputCard}>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={(t) => { setCode(t.toUpperCase()); setError(null); }}
              placeholder="XXXXXX"
              placeholderTextColor={colors.textMuted}
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
              textAlign="center"
            />
          </View>

          {error && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.redeemBtn, (!code.trim() || loading) && { opacity: 0.5 }]}
            onPress={handleRedeem}
            disabled={!code.trim() || loading}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.redeemBtnText}>
              {loading ? 'Connecting...' : 'Connect to Athlete'}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>
              After connecting, you'll be able to view your athlete's training progress, profile cards, and coach announcements. You cannot edit their data.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 20, gap: 16 },

  heroCard: {
    alignItems: 'center', gap: 10, paddingVertical: 20,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.lg, padding: 20,
  },
  heroTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  heroDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },

  inputCard: {
    backgroundColor: colors.surface, borderWidth: 2, borderColor: ACCENT + '40',
    borderRadius: radius.lg, padding: 16,
  },
  codeInput: {
    fontSize: 32, fontWeight: '900', color: colors.textPrimary,
    letterSpacing: 8, padding: 0, textAlign: 'center',
  },

  errorRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 4,
  },
  errorText: { fontSize: 13, color: colors.error, fontWeight: '600' },

  redeemBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, backgroundColor: ACCENT,
  },
  redeemBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },

  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14,
    backgroundColor: colors.surface, borderRadius: radius.md,
  },
  infoText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 17 },
});

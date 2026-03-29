/**
 * Invite Parent — Athlete generates a code for parent linking.
 */

import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { colors, radius } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { useParentInvite } from '@/hooks/useParentInvite';

const ACCENT = '#8b5cf6';

export default function InviteParentScreen() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  const { loading, generateCode, getActiveCode } = useParentInvite();

  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getActiveCode(userId).then((invite) => {
      if (invite && !invite.redeemed) setCode(invite.code);
    });
  }, [userId, getActiveCode]);

  async function handleGenerate() {
    if (!userId) return;
    const newCode = await generateCode(userId);
    if (newCode) {
      setCode(newCode);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  async function handleCopy() {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    setCopied(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (!code) return;
    await Share.share({
      message: `Join OTC Athletics as my parent. Use this code to connect to my progress dashboard: ${code}`,
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>PROFILE</Text>
          <Text style={styles.headerTitle}>Parent Access</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Ionicons name="people" size={36} color={ACCENT} />
          <Text style={styles.heroTitle}>Invite Your Parent</Text>
          <Text style={styles.heroDesc}>
            Generate a code and share it with your parent. They can use it to create a parent account linked to your progress dashboard.
          </Text>
        </View>

        {code ? (
          <>
            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>YOUR PARENT INVITE CODE</Text>
              <Text style={styles.codeValue}>{code}</Text>
              <Text style={styles.codeSub}>Share this code with your parent</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleCopy} activeOpacity={0.8}>
                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color={ACCENT} />
                <Text style={styles.actionBtnText}>{copied ? 'Copied!' : 'Copy Code'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.8}>
                <Ionicons name="share-outline" size={18} color={ACCENT} />
                <Text style={styles.actionBtnText}>Share</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.regenBtn, loading && { opacity: 0.5 }]}
              onPress={handleGenerate}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={14} color={colors.textMuted} />
              <Text style={styles.regenText}>Generate New Code</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.generateBtn, loading && { opacity: 0.5 }]}
            onPress={handleGenerate}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Ionicons name="key-outline" size={18} color="#fff" />
            <Text style={styles.generateBtnText}>
              {loading ? 'Generating...' : 'Generate Invite Code'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.infoText}>Your parent will be able to see your training progress, profile cards, and announcements.</Text>
            <Text style={styles.infoText}>They cannot edit your data, submit diagnostics, or log workouts.</Text>
          </View>
        </View>
      </View>
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

  codeCard: {
    alignItems: 'center', gap: 6, padding: 24,
    backgroundColor: colors.surface, borderWidth: 2, borderColor: ACCENT + '40',
    borderRadius: radius.lg,
  },
  codeLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted },
  codeValue: { fontSize: 36, fontWeight: '900', color: ACCENT, letterSpacing: 6 },
  codeSub: { fontSize: 12, color: colors.textMuted },

  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: radius.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: ACCENT + '30',
  },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: ACCENT },

  regenBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10,
  },
  regenText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },

  generateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, backgroundColor: ACCENT,
  },
  generateBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },

  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14,
    backgroundColor: colors.surface, borderRadius: radius.md,
  },
  infoText: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
});

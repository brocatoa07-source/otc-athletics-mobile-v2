import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { useCoachCode, type CoachLookup, type ActiveConnection } from '@/hooks/useCoachCode';

export default function ConnectCoachScreen() {
  const user = useAuthStore((s) => s.user);
  const { loading, lookupCode, submitRequest, checkConnection, disconnectCoach } = useCoachCode();

  const [code, setCode] = useState('');
  const [coach, setCoach] = useState<CoachLookup | null>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [activeConn, setActiveConn] = useState<ActiveConnection | null>(null);
  const [checking, setChecking] = useState(true);

  // Check for existing active connection on mount
  useEffect(() => {
    if (!user?.id) return;
    checkConnection(user.id).then((conn) => {
      setActiveConn(conn);
      setChecking(false);
    });
  }, [user?.id, checkConnection]);

  const hasCoach = !!activeConn;

  const handleLookup = async () => {
    if (code.length < 6) {
      setError('Enter a 6-character code');
      return;
    }
    setError('');
    setCoach(null);
    const result = await lookupCode(code);
    if (!result) {
      setError('No coach found with that code');
    } else {
      setCoach(result);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSendRequest = async () => {
    if (!user?.id || !coach) return;
    const result = await submitRequest(user.id, coach.userId);
    if (result.ok) {
      setSent(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setError(result.error ?? 'Failed to send request');
    }
  };

  const handleDisconnect = () => {
    Alert.alert('Disconnect Coach', 'Remove your coach connection? You can reconnect later.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disconnect',
        style: 'destructive',
        onPress: async () => {
          if (!user?.id) return;
          const ok = await disconnectCoach(user.id);
          if (ok) {
            setActiveConn(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      },
    ]);
  };

  if (checking) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerLabel}>PROFILE</Text>
            <Text style={styles.headerTitle}>Connect to Coach</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: Colors.textMuted }}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerLabel}>PROFILE</Text>
          <Text style={styles.headerTitle}>Connect to Coach</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Currently Connected */}
        {hasCoach && (
          <View style={styles.connectedCard}>
            <View style={styles.connectedIcon}>
              <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
            </View>
            <Text style={styles.connectedTitle}>Connected to {activeConn.coachName}</Text>
            <Text style={styles.connectedDesc}>
              You're currently linked to a coach. They can see your quiz results and assign programs.
            </Text>
            <TouchableOpacity style={styles.disconnectBtn} onPress={handleDisconnect}>
              <Ionicons name="close-circle-outline" size={16} color="#ef4444" />
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Enter Code */}
        {!hasCoach && !sent && (
          <>
            <View style={styles.infoCard}>
              <Ionicons name="key-outline" size={28} color="#8b5cf6" />
              <Text style={styles.infoTitle}>Enter Coach Code</Text>
              <Text style={styles.infoDesc}>
                Ask your coach for their 6-character connect code. This sends them a request to link your account.
              </Text>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.codeInput}
                value={code}
                onChangeText={(t) => setCode(t.toUpperCase().slice(0, 6))}
                placeholder="XXXXXX"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="characters"
                maxLength={6}
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.lookupBtn, loading && { opacity: 0.6 }]}
                onPress={handleLookup}
                disabled={loading}
              >
                <Text style={styles.lookupBtnText}>Look Up</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Coach Preview */}
            {coach && (
              <View style={styles.coachPreview}>
                <View style={styles.coachAvatar}>
                  <Text style={styles.coachInitial}>{coach.fullName.charAt(0)}</Text>
                </View>
                <Text style={styles.coachName}>{coach.fullName}</Text>
                {coach.specialization && (
                  <Text style={styles.coachSpec}>{coach.specialization}</Text>
                )}
                {coach.bio && (
                  <Text style={styles.coachBio}>{coach.bio}</Text>
                )}

                <TouchableOpacity
                  style={[styles.sendBtn, loading && { opacity: 0.6 }]}
                  onPress={handleSendRequest}
                  disabled={loading}
                >
                  <Ionicons name="paper-plane-outline" size={16} color="#fff" />
                  <Text style={styles.sendBtnText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Request Sent */}
        {sent && (
          <View style={styles.sentCard}>
            <View style={styles.sentIcon}>
              <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
            </View>
            <Text style={styles.sentTitle}>Request Sent!</Text>
            <Text style={styles.sentDesc}>
              Your coach will see your request and can approve it. Once approved, they'll be able to
              view your progress and assign programs.
            </Text>
            <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: 2 },
  headerLabel: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  content: { padding: 16, gap: 16, paddingBottom: 48 },

  /* Connected state */
  connectedCard: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: '#22c55e40',
    borderRadius: 16,
  },
  connectedIcon: { marginBottom: 4 },
  connectedTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  connectedDesc: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  disconnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ef444440',
    borderRadius: 10,
    marginTop: 4,
  },
  disconnectText: { fontSize: 13, fontWeight: '700', color: '#ef4444' },

  /* Enter code */
  infoCard: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: '#8b5cf630',
    borderRadius: 16,
  },
  infoTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  infoDesc: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 19 },

  inputRow: { flexDirection: 'row', gap: 10 },
  codeInput: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 6,
  },
  lookupBtn: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookupBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: { fontSize: 13, color: '#ef4444', fontWeight: '600' },

  /* Coach preview */
  coachPreview: {
    alignItems: 'center',
    gap: 8,
    padding: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },
  coachAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8b5cf620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachInitial: { fontSize: 22, fontWeight: '900', color: '#8b5cf6' },
  coachName: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  coachSpec: { fontSize: 13, fontWeight: '700', color: '#8b5cf6' },
  coachBio: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 8,
  },
  sendBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },

  /* Request sent */
  sentCard: {
    alignItems: 'center',
    gap: 12,
    padding: 32,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: '#22c55e40',
    borderRadius: 16,
  },
  sentIcon: { marginBottom: 4 },
  sentTitle: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  sentDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21 },
  doneBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    marginTop: 8,
  },
  doneBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});

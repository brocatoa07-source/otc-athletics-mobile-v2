import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { useCoachCode, type PendingRequest } from '@/hooks/useCoachCode';
import { useCoachDashboard } from '@/hooks/useCoachDashboard';
import { ActionCenter } from '@/components/coach/ActionCenter';
import { TodayFeed } from '@/components/coach/TodayFeed';
import { AthletePriorityList } from '@/components/coach/AthletePriorityList';
import { CoachTools } from '@/components/coach/CoachTools';
import { ConnectCodeCard } from '@/components/coach/ConnectCodeCard';

export default function CoachDashboardScreen() {
  const user  = useAuthStore((s) => s.user);
  const coach = useAuthStore((s) => s.coach);
  const userId = user?.id;

  const { loading: codeLoading, generateCode, fetchRequests, approveRequest, denyRequest } =
    useCoachCode();
  const { data: dashboard, refetch } = useCoachDashboard(userId);

  const [connectCode, setConnectCode] = useState(coach?.connect_code ?? null);
  const [copied, setCopied]           = useState(false);
  const [requests, setRequests]       = useState<PendingRequest[]>([]);

  const loadRequests = useCallback(async () => {
    if (!userId) return;
    const reqs = await fetchRequests(userId);
    setRequests(reqs);
  }, [userId, fetchRequests]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  // ── Handlers ──
  const handleRefresh = () => {
    refetch();
    loadRequests();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleGenerateCode = async () => {
    if (!userId) return;
    const code = await generateCode(userId);
    if (code) {
      setConnectCode(code);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCopyCode = async () => {
    if (!connectCode) return;
    await Clipboard.setStringAsync(connectCode);
    setCopied(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = async (req: PendingRequest) => {
    if (!userId) return;
    const ok = await approveRequest(req.id);
    if (ok) {
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      refetch();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDeny = (req: PendingRequest) => {
    Alert.alert('Deny Request', `Deny ${req.athlete_name ?? 'this athlete'}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Deny',
        style: 'destructive',
        onPress: async () => {
          const ok = await denyRequest(req.id);
          if (ok) setRequests((prev) => prev.filter((r) => r.id !== req.id));
        },
      },
    ]);
  };

  // ── Derived ──
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? 'Coach';
  const firstName   = displayName.split(' ')[0];
  const timeOfDay   = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  })();

  const stats              = dashboard?.stats       ?? { toReview: 0, videosPending: 0, programsToUpdate: 0, unreadMessages: 0 };
  const prioritizedAthletes = dashboard?.prioritizedAthletes ?? [];
  const activityFeed       = dashboard?.activityFeed ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Good {timeOfDay},</Text>
          <Text style={styles.headerTitle}>{firstName}</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
          <Ionicons name="refresh-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(app)/profile')} style={styles.refreshBtn}>
          <Ionicons name="person-circle-outline" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1 — ACTION CENTER */}
        <ActionCenter stats={stats} />

        {/* ── Pending Connection Requests ── */}
        {requests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-add-outline" size={16} color="#f59e0b" />
              <Text style={styles.sectionTitle}>PENDING REQUESTS</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            </View>
            {requests.map((req) => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestAvatar}>
                  <Text style={styles.requestInitial}>{(req.athlete_name ?? '?').charAt(0)}</Text>
                </View>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>{req.athlete_name ?? 'Unknown'}</Text>
                  <Text style={styles.requestDate}>
                    {new Date(req.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(req)}>
                  <Ionicons name="checkmark" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.denyBtn} onPress={() => handleDeny(req)}>
                  <Ionicons name="close" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* 2 — TODAY'S FEED */}
        <TodayFeed items={activityFeed} />

        {/* 3 — ATHLETE PRIORITY LIST */}
        <AthletePriorityList athletes={prioritizedAthletes} />

        {/* 4 — COACH TOOLS */}
        <CoachTools />

        {/* 5 — CONNECT CODE */}
        <ConnectCodeCard
          connectCode={connectCode}
          copied={copied}
          loading={codeLoading}
          onCopy={handleCopyCode}
          onGenerate={handleGenerateCode}
        />
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
  greeting:    { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 0.5 },
  refreshBtn:  { padding: 6 },

  content: { padding: 16, gap: 20, paddingBottom: 56 },

  /* Pending requests */
  section:       { gap: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  sectionTitle:  { flex: 1, fontSize: 11, fontWeight: '800', color: '#f59e0b', letterSpacing: 1.5 },
  badge: {
    backgroundColor: '#f59e0b',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },

  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  requestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f59e0b20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestInitial: { fontSize: 16, fontWeight: '900', color: '#f59e0b' },
  requestInfo:    { flex: 1 },
  requestName:    { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  requestDate:    { fontSize: 11, color: Colors.textMuted },
  approveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  denyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef444420',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Coach Dashboard — Light control center.
 *
 * Sections:
 *   1. Inbox — recent conversations + unread count
 *   2. Announcements — create + recent previews with engagement
 *   3. Leaderboards / Activity — streak leaders, engagement pulse
 *   4. Athlete Snapshot — lightweight roster
 *   5. Opportunities — engaged athletes, recent messagers
 *   6. Connect Code — athlete connection
 */

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { useCoachCode, type PendingRequest } from '@/hooks/useCoachCode';
import { useCoachDashboard } from '@/hooks/useCoachDashboard';
import { useConversations } from '@/hooks/useConversations';
import { ConnectCodeCard } from '@/components/coach/ConnectCodeCard';
import { supabase } from '@/lib/supabase';

export default function CoachDashboardScreen() {
  const user  = useAuthStore((s) => s.user);
  const coach = useAuthStore((s) => s.coach);
  const userId = user?.id;

  const { loading: codeLoading, generateCode, fetchRequests, approveRequest, denyRequest } =
    useCoachCode();
  const { data: dashboard, refetch } = useCoachDashboard(userId);
  const { conversations } = useConversations();

  const [connectCode, setConnectCode] = useState(coach?.connect_code ?? null);
  const [copied, setCopied] = useState(false);
  const [requests, setRequests] = useState<PendingRequest[]>([]);

  // Recent announcements with engagement
  const { data: recentAnnouncements } = useQuery({
    queryKey: ['coach-recent-announcements'],
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await supabase
        .from('community_posts')
        .select('id, content, created_at, likes_count, community_reactions(reaction_type)')
        .eq('section', 'announcements')
        .order('created_at', { ascending: false })
        .limit(3);
      return (data ?? []).map((p: any) => ({
        id: p.id,
        content: p.content,
        createdAt: p.created_at,
        reactions: (p.community_reactions ?? []).length,
      }));
    },
  });

  const loadRequests = useCallback(async () => {
    if (!userId) return;
    const reqs = await fetchRequests(userId);
    setRequests(reqs);
  }, [userId, fetchRequests]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

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

  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? 'Coach';
  const firstName = displayName.split(' ')[0];
  const timeOfDay = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  })();

  const stats = dashboard?.stats ?? { toReview: 0, videosPending: 0, programsToUpdate: 0, unreadMessages: 0 };
  const prioritizedAthletes = dashboard?.prioritizedAthletes ?? [];
  const recentConvos = conversations.slice(0, 3);

  // Opportunities: recently active + high engagement athletes
  const engagedAthletes = prioritizedAthletes
    .filter((a: any) => a.daysSinceLastSession <= 3)
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Good {timeOfDay},</Text>
          <Text style={styles.headerTitle}>{firstName}</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.iconBtn}>
          <Ionicons name="refresh-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(app)/profile')} style={styles.iconBtn}>
          <Ionicons name="person-circle-outline" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ═══════ 1. INBOX ═══════ */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeaderRow}
            onPress={() => router.push('/(app)/messages' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubbles" size={18} color="#f59e0b" />
            <Text style={styles.cardTitle}>Inbox</Text>
            {stats.unreadMessages > 0 && (
              <View style={[styles.badge, { backgroundColor: '#f59e0b' }]}>
                <Text style={styles.badgeText}>{stats.unreadMessages}</Text>
              </View>
            )}
            <View style={{ flex: 1 }} />
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>

          {recentConvos.length === 0 ? (
            <Text style={styles.emptyLine}>No active conversations.</Text>
          ) : (
            recentConvos.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.convoRow}
                onPress={() => router.push(`/(app)/messages/${c.id}` as any)}
                activeOpacity={0.8}
              >
                <View style={styles.convoAvatar}>
                  <Text style={styles.convoInitial}>
                    {(c.other_user?.full_name ?? '?').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.convoName} numberOfLines={1}>
                  {c.other_user?.full_name ?? 'Athlete'}
                </Text>
                <Ionicons name="chevron-forward" size={12} color={Colors.textMuted} />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ═══════ 2. ANNOUNCEMENTS ═══════ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="megaphone" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Announcements</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => router.push('/(app)/community/announcements' as any)}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Create CTA */}
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/(app)/community/announcements' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle" size={16} color={Colors.primary} />
            <Text style={styles.createBtnText}>Create Announcement</Text>
          </TouchableOpacity>

          {/* Recent previews */}
          {(recentAnnouncements ?? []).map((a: any) => (
            <View key={a.id} style={styles.announcementRow}>
              <Text style={styles.announcementText} numberOfLines={2}>{a.content}</Text>
              <View style={styles.announcementMeta}>
                <Ionicons name="heart" size={10} color={Colors.textMuted} />
                <Text style={styles.announcementReactions}>{a.reactions}</Text>
                <Text style={styles.announcementDate}>
                  {timeAgo(a.createdAt)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ═══════ 3. LEADERBOARDS / ACTIVITY ═══════ */}
        <TouchableOpacity
          style={[styles.navCard, { borderColor: '#22c55e30' }]}
          onPress={() => router.push('/(app)/community/leaderboards' as any)}
          activeOpacity={0.85}
        >
          <View style={[styles.navIcon, { backgroundColor: '#22c55e15' }]}>
            <Ionicons name="trophy" size={20} color="#22c55e" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.navTitle}>Leaderboards & Activity</Text>
            <Text style={styles.navSub}>Streak leaders, rankings, engagement</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* ═══════ PENDING REQUESTS ═══════ */}
        {requests.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="person-add-outline" size={16} color="#f59e0b" />
              <Text style={styles.cardTitle}>Pending Requests</Text>
              <View style={[styles.badge, { backgroundColor: '#f59e0b' }]}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            </View>
            {requests.map((req) => (
              <View key={req.id} style={styles.requestRow}>
                <View style={styles.requestAvatar}>
                  <Text style={styles.requestInitial}>{(req.athlete_name ?? '?').charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.requestName}>{req.athlete_name ?? 'Unknown'}</Text>
                  <Text style={styles.requestDate}>{new Date(req.created_at).toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(req)}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.denyBtn} onPress={() => handleDeny(req)}>
                  <Ionicons name="close" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* ═══════ 4. ATHLETE SNAPSHOT ═══════ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="people" size={16} color="#8b5cf6" />
            <Text style={styles.cardTitle}>Athletes</Text>
            <Text style={styles.countText}>{prioritizedAthletes.length}</Text>
          </View>

          {prioritizedAthletes.length === 0 ? (
            <Text style={styles.emptyLine}>No athletes connected yet. Share your code below.</Text>
          ) : (
            prioritizedAthletes.slice(0, 8).map((a: any) => (
              <TouchableOpacity
                key={a.userId}
                style={styles.athleteRow}
                onPress={() => router.push(`/(app)/coach/athlete/${a.userId}` as any)}
                activeOpacity={0.8}
              >
                <View style={styles.athleteAvatar}>
                  <Text style={styles.athleteInitial}>{a.initial}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.athleteName}>{a.name}</Text>
                  <Text style={styles.athleteMeta}>
                    {a.daysSinceLastSession === 0 ? 'Active today' :
                     a.daysSinceLastSession <= 7 ? `${a.daysSinceLastSession}d ago` :
                     'Inactive'}
                  </Text>
                </View>
                {a.daysSinceLastSession <= 3 && (
                  <View style={styles.activeDot} />
                )}
                <Ionicons name="chevron-forward" size={12} color={Colors.textMuted} />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ═══════ 5. OPPORTUNITIES ═══════ */}
        {engagedAthletes.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="sparkles" size={16} color="#f59e0b" />
              <Text style={styles.cardTitle}>Engaged This Week</Text>
            </View>
            <Text style={styles.opportunityDesc}>
              These athletes have been active in the last 3 days. Good time to check in.
            </Text>
            {engagedAthletes.map((a: any) => (
              <TouchableOpacity
                key={a.userId}
                style={styles.opportunityRow}
                onPress={() => router.push(`/(app)/coach/athlete/${a.userId}` as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="flame" size={14} color="#f59e0b" />
                <Text style={styles.opportunityName}>{a.name}</Text>
                <Text style={styles.opportunityMeta}>
                  {a.daysSinceLastSession === 0 ? 'Today' : `${a.daysSinceLastSession}d ago`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ═══════ CONNECT CODE ═══════ */}
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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  greeting: { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 0.5 },
  iconBtn: { padding: 6 },
  content: { padding: 16, gap: 12, paddingBottom: 56 },

  // Cards
  card: {
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14, padding: 14, gap: 8,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  viewAll: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  countText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, marginLeft: 'auto' },
  emptyLine: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },

  badge: {
    minWidth: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
  },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },

  // Inbox conversations
  convoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  convoAvatar: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#f59e0b15',
    alignItems: 'center', justifyContent: 'center',
  },
  convoInitial: { fontSize: 11, fontWeight: '800', color: '#f59e0b' },
  convoName: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.textPrimary },

  // Announcements
  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 8,
    backgroundColor: Colors.primary + '12', borderWidth: 1, borderColor: Colors.primary + '25',
  },
  createBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  announcementRow: {
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: Colors.border, gap: 4,
  },
  announcementText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  announcementMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  announcementReactions: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  announcementDate: { fontSize: 10, color: Colors.textMuted, marginLeft: 8 },

  // Nav card (leaderboards)
  navCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.bgCard, borderWidth: 1, borderRadius: 14, padding: 14,
  },
  navIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  navSub: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },

  // Requests
  requestRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  requestAvatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#f59e0b15',
    alignItems: 'center', justifyContent: 'center',
  },
  requestInitial: { fontSize: 13, fontWeight: '800', color: '#f59e0b' },
  requestName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  requestDate: { fontSize: 10, color: Colors.textMuted },
  approveBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#22c55e',
    alignItems: 'center', justifyContent: 'center',
  },
  denyBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#ef444420',
    alignItems: 'center', justifyContent: 'center',
  },

  // Athletes
  athleteRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  athleteAvatar: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#8b5cf612',
    alignItems: 'center', justifyContent: 'center',
  },
  athleteInitial: { fontSize: 11, fontWeight: '800', color: '#8b5cf6' },
  athleteName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  athleteMeta: { fontSize: 10, color: Colors.textMuted },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },

  // Opportunities
  opportunityDesc: { fontSize: 11, color: Colors.textMuted, lineHeight: 16 },
  opportunityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 5, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  opportunityName: { flex: 1, fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  opportunityMeta: { fontSize: 10, fontWeight: '600', color: '#f59e0b' },
});

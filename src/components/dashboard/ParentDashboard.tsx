/**
 * ParentDashboard — View-only athlete accountability portal.
 *
 * Sections:
 *   1. Athlete Overview (name, tier)
 *   2. Profile Cards (Hitting, Mental, Strength)
 *   3. Training Status (diagnostic completions)
 *   4. Coach Updates (announcements)
 *
 * All queries use try/catch so missing tables don't crash the dashboard.
 * Parents CANNOT edit, log, submit diagnostics, or impersonate.
 */

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { colors, radius } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { clearUserLocalState } from '@/lib/user-storage';
import { hydrateHittingIdentity, hydrateLiftingMover } from '@/lib/gating/hydrateResults';
import { COMBINED_PROFILE_COACHING, COMBINED_PROFILE_LABELS, MOVEMENT_PROFILES } from '@/data/hitting-identity-data';
import { LIFTING_MOVER_TYPES } from '@/data/lifting-mover-type-data';
import { ARCHETYPE_INFO, type ArchetypeKey } from '@/data/mental-diagnostics-data';

const ACCENT = '#8b5cf6';

// ── Data fetching (resilient — tables may not exist) ────────────────────────

interface LinkedAthleteProfile {
  userId: string;
  name: string;
  tier: string;
}

function useLinkedAthleteProfiles(ids: string[]) {
  return useQuery({
    queryKey: ['parent-athlete-profiles', ids.join(',')],
    enabled: ids.length > 0,
    staleTime: 120_000,
    queryFn: async () => {
      if (ids.length === 0) return [];
      const results: LinkedAthleteProfile[] = [];

      for (const id of ids) {
        let name = 'Athlete';
        let tier = 'WALK';

        // Try athletes table first (may be blocked by RLS)
        try {
          const { data: athleteRow } = await supabase
            .from('athletes')
            .select('user_id, tier, users:user_id(full_name)')
            .eq('user_id', id)
            .maybeSingle();

          if (athleteRow) {
            name = (athleteRow.users as any)?.full_name ?? name;
            tier = athleteRow.tier ?? tier;
            if (__DEV__) console.log('[ParentDashboard:profiles] athletes table OK for', id, '→', name, tier);
          } else {
            if (__DEV__) console.log('[ParentDashboard:profiles] athletes table returned null for', id, '— trying users table');
          }
        } catch (e) {
          if (__DEV__) console.log('[ParentDashboard:profiles] athletes table blocked for', id, '— trying users table');
        }

        // Fallback: read name from users table (usually more permissive RLS)
        if (name === 'Athlete') {
          try {
            const { data: userRow } = await supabase
              .from('users')
              .select('full_name')
              .eq('id', id)
              .maybeSingle();
            if (userRow?.full_name) name = userRow.full_name;
          } catch {}
        }

        // Fallback: read tier from athlete_parent_links join or default
        // If athletes table was blocked, try a direct query with the link proof
        if (tier === 'WALK') {
          try {
            const { data: tierRow } = await supabase
              .from('athletes')
              .select('tier')
              .eq('user_id', id)
              .maybeSingle();
            if (tierRow?.tier) {
              tier = tierRow.tier;
              if (__DEV__) console.log('[ParentDashboard:profiles] tier retry OK for', id, '→', tier);
            }
          } catch {}
        }

        if (__DEV__) console.log('[ParentDashboard:profiles] final for', id, '→', name, tier);
        results.push({ userId: id, name, tier });
      }

      return results;
    },
  });
}

function useAthleteData(athleteUserId: string | null) {
  return useQuery({
    queryKey: ['parent-athlete-data', athleteUserId],
    enabled: !!athleteUserId,
    staleTime: 60_000,
    queryFn: async () => {
      if (__DEV__) console.log('[ParentDashboard:data] fetching for athlete user_id:', athleteUserId);

      // Diagnostic completions (keyed by user_id — has parent RLS)
      let diagnostics: any[] = [];
      try {
        const { data, error } = await supabase
          .from('diagnostic_submissions')
          .select('vault_type, diagnostic_type, result_payload, submitted_at')
          .eq('user_id', athleteUserId!)
          .order('submitted_at', { ascending: false })
          .limit(20);
        if (__DEV__) console.log('[ParentDashboard:data] diagnostics →', data?.length ?? 0, 'rows', error?.message ?? 'OK');
        diagnostics = data ?? [];
      } catch (e) {
        if (__DEV__) console.warn('[ParentDashboard:data] diagnostics error:', e);
      }

      // Look up the athlete row PK (athletes.id) — needed for progress + sessions
      let athleteRowId: string | null = null;
      try {
        const { data: athleteRow } = await supabase
          .from('athletes')
          .select('id')
          .eq('user_id', athleteUserId!)
          .maybeSingle();
        athleteRowId = athleteRow?.id ?? null;
        if (__DEV__) console.log('[ParentDashboard:data] athlete row id →', athleteRowId ?? 'not found');
      } catch {}

      // Athlete progress metrics (keyed by athletes.id, not user_id)
      let progressMetrics: any[] = [];
      if (athleteRowId) {
        try {
          const { data, error } = await supabase
            .from('athlete_progress')
            .select('metric_type, value, recorded_at')
            .eq('athlete_id', athleteRowId)
            .order('recorded_at', { ascending: false })
            .limit(20);
          if (__DEV__) console.log('[ParentDashboard:data] progress →', data?.length ?? 0, 'rows', error?.message ?? 'OK');
          progressMetrics = data ?? [];
        } catch (e) {
          if (__DEV__) console.log('[ParentDashboard:data] progress table not available');
        }
      }

      // Training sessions (keyed by athletes.id, not user_id)
      let trainingSessions: any[] = [];
      if (athleteRowId) {
        try {
          const { data, error } = await supabase
            .from('training_sessions')
            .select('id, created_at, status')
            .eq('athlete_id', athleteRowId)
            .order('created_at', { ascending: false })
            .limit(10);
          if (__DEV__) console.log('[ParentDashboard:data] sessions →', data?.length ?? 0, 'rows', error?.message ?? 'OK');
          trainingSessions = data ?? [];
        } catch (e) {
          if (__DEV__) console.log('[ParentDashboard:data] training_sessions not available');
        }
      }

      // Announcements from community_posts
      let announcementCount = 0;
      try {
        const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
        const { count } = await supabase
          .from('community_posts')
          .select('*', { count: 'exact', head: true })
          .eq('section', 'announcements')
          .gte('created_at', weekAgo);
        announcementCount = count ?? 0;
      } catch {}

      return { diagnostics, progressMetrics, trainingSessions, announcementCount };
    },
  });
}

// ── Component ───────────────────────────────────────────────────────────────

export function ParentDashboard() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const linkedIds = useAuthStore((s) => s.parentLinkedAthleteIds);
  const activeId = useAuthStore((s) => s.parentLinkedAthleteId);
  const setActive = useAuthStore((s) => s.setParentActiveAthlete);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          await clearUserLocalState();
          await supabase.auth.signOut();
          clearAuth();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? 'Parent';
  const firstName = displayName.split(' ')[0];
  const timeOfDay = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  })();

  const { data: profiles, isLoading: profilesLoading } = useLinkedAthleteProfiles(linkedIds);
  const { data: athleteData, isLoading: dataLoading } = useAthleteData(activeId);

  if (__DEV__) {
    console.log('[ParentDashboard] activeId:', activeId, 'linkedIds:', linkedIds.length,
      'diagnostics:', athleteData?.diagnostics?.length ?? 'n/a',
      'profilesLoaded:', !!profiles, 'dataLoaded:', !!athleteData);
  }

  const activeProfile = profiles?.find((p) => p.userId === activeId);
  const hasMultiple = linkedIds.length > 1;

  // Derived data
  const diagnostics = athleteData?.diagnostics ?? [];
  const progressMetrics = athleteData?.progressMetrics ?? [];
  const trainingSessions = athleteData?.trainingSessions ?? [];
  const announcementCount = athleteData?.announcementCount ?? 0;

  // Best metrics by type (most recent value for each metric)
  const bestMetrics: Record<string, { value: number; date: string }> = {};
  for (const m of progressMetrics) {
    if (!bestMetrics[m.metric_type] || m.value > bestMetrics[m.metric_type].value) {
      bestMetrics[m.metric_type] = { value: m.value, date: m.recorded_at };
    }
  }

  const recentSessionCount = trainingSessions.length;
  const completedSessionCount = trainingSessions.filter((s: any) => s.status === 'completed').length;

  const hittingDone = diagnostics.some((d: any) => d.vault_type === 'hitting');
  const mentalDone = diagnostics.some((d: any) => d.vault_type === 'mental');
  const liftingDone = diagnostics.some((d: any) => d.vault_type === 'sc');

  // ── Hydrate profile cards from diagnostic result_payloads ──

  // Hitting
  const hittingDiag = diagnostics.find((d: any) => d.diagnostic_type === 'mover-type' && d.vault_type === 'hitting');
  const hittingProfile = hittingDiag?.result_payload ? hydrateHittingIdentity(hittingDiag.result_payload) : null;
  const hittingCoaching = hittingProfile ? COMBINED_PROFILE_COACHING[hittingProfile.combinedProfile] : null;
  const hittingMv = hittingProfile ? MOVEMENT_PROFILES[hittingProfile.movementType] : null;

  // Mental — ArchetypeResult has { scores, primary, secondary }, field is "primary" not "archetype"
  const mentalDiag = diagnostics.find((d: any) => d.diagnostic_type === 'archetype' && d.vault_type === 'mental');
  const mentalScored = (mentalDiag?.result_payload as any)?.scored;
  const mentalArchetypeKey = (mentalScored?.primary ?? mentalScored?.archetype) as ArchetypeKey | undefined;
  const mentalArchetype = mentalArchetypeKey && ARCHETYPE_INFO[mentalArchetypeKey] ? ARCHETYPE_INFO[mentalArchetypeKey] : null;

  if (__DEV__ && mentalDiag) {
    console.log('[ParentDashboard:mental] scored keys:', mentalScored ? Object.keys(mentalScored) : 'null',
      'resolved:', mentalArchetypeKey, '→', mentalArchetype?.name ?? 'NOT FOUND');
  }

  // Strength
  const liftingDiag = diagnostics.find((d: any) => d.diagnostic_type === 'lifting-mover' && d.vault_type === 'sc');
  const liftingMoverSlug = liftingDiag?.result_payload ? hydrateLiftingMover(liftingDiag.result_payload) : null;
  const liftingMoverData = liftingMoverSlug ? LIFTING_MOVER_TYPES[liftingMoverSlug] : null;

  // ── NO LINKED ATHLETES ──────────────────────────────────────────────────

  if (linkedIds.length === 0 && isHydrated) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>Good {timeOfDay},</Text>
              <Text style={styles.name}>{firstName}</Text>
            </View>
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
              <Ionicons name="log-out-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Athlete Linked</Text>
          <Text style={styles.emptyDesc}>
            Enter the invite code your athlete shared with you to connect to their progress dashboard.
          </Text>
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => router.push('/(app)/profile/redeem-parent-code' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="link" size={16} color="#fff" />
            <Text style={styles.linkBtnText}>Enter Invite Code</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── DASHBOARD ───────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Good {timeOfDay},</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(app)/profile' as any)} style={styles.profileBtn}>
            <Ionicons name="person-circle-outline" size={28} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* View-only badge */}
        <View style={styles.viewBadge}>
          <Ionicons name="eye-outline" size={14} color={ACCENT} />
          <Text style={styles.viewBadgeText}>Parent View — Read Only</Text>
        </View>

        {/* Multi-athlete switcher */}
        {hasMultiple && profiles && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.switcherScroll}>
            {profiles.map((p) => (
              <TouchableOpacity
                key={p.userId}
                style={[styles.switcherChip, p.userId === activeId && styles.switcherChipActive]}
                onPress={() => setActive(p.userId)}
              >
                <Text style={[styles.switcherText, p.userId === activeId && styles.switcherTextActive]}>
                  {p.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Loading indicator during athlete switch */}
        {(profilesLoading || dataLoading) && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={ACCENT} />
            <Text style={styles.loadingText}>Loading athlete data...</Text>
          </View>
        )}

        {/* ═══════ 1. ATHLETE OVERVIEW ═══════ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {(activeProfile?.name ?? '?').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.athleteName}>{activeProfile?.name ?? 'Athlete'}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Text style={styles.metaText}>{activeProfile?.tier ?? 'WALK'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ═══════ 2. PROFILE CARDS ═══════ */}

        {/* Hitting Profile */}
        {hittingProfile && hittingCoaching && hittingMv && (
          <View style={[styles.card, { borderColor: '#E1060025' }]}>
            <Text style={[styles.sectionLabel, { color: '#E10600' }]}>HITTING PROFILE</Text>
            <Text style={styles.profileTitle}>
              {COMBINED_PROFILE_LABELS[hittingProfile.combinedProfile] ?? 'Hitter Profile'}
            </Text>
            <Text style={styles.profileSub}>
              {hittingMv.label} · {hittingProfile.batPathType === 'horizontal' ? 'Flat Path' : 'Vertical Path'}
            </Text>
            <View style={styles.profileSection}>
              <Text style={[styles.profileSectionLabel, { color: '#22c55e' }]}>STRENGTHS</Text>
              {(hittingCoaching.strengths ?? []).slice(0, 3).map((s: string, i: number) => (
                <Text key={i} style={styles.profileItem}>• {s}</Text>
              ))}
            </View>
            <View style={styles.profileSection}>
              <Text style={[styles.profileSectionLabel, { color: '#f59e0b' }]}>WATCH-OUTS</Text>
              {(hittingCoaching.watchOuts ?? []).slice(0, 2).map((s: string, i: number) => (
                <Text key={i} style={styles.profileItem}>• {s}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Mental Profile */}
        {mentalArchetype && (
          <View style={[styles.card, { borderColor: '#8b5cf625' }]}>
            <Text style={[styles.sectionLabel, { color: '#8b5cf6' }]}>MENTAL PROFILE</Text>
            <Text style={styles.profileTitle}>{mentalArchetype.name}</Text>
            <Text style={styles.profileSub}>{mentalArchetype.tagline}</Text>
            <View style={styles.profileSection}>
              <Text style={[styles.profileSectionLabel, { color: '#22c55e' }]}>STRENGTHS</Text>
              {mentalArchetype.strengths.slice(0, 3).map((s, i) => (
                <Text key={i} style={styles.profileItem}>• {s}</Text>
              ))}
            </View>
            <View style={styles.profileSection}>
              <Text style={[styles.profileSectionLabel, { color: '#f59e0b' }]}>WATCH-OUTS</Text>
              {mentalArchetype.watchOuts.slice(0, 2).map((s, i) => (
                <Text key={i} style={styles.profileItem}>• {s}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Strength Profile */}
        {liftingMoverData && (
          <View style={[styles.card, { borderColor: '#22c55e25' }]}>
            <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>STRENGTH PROFILE</Text>
            <Text style={styles.profileTitle}>{liftingMoverData.name}</Text>
            <Text style={styles.profileSub}>{liftingMoverData.shortLabel}</Text>
            <View style={styles.profileSection}>
              <Text style={[styles.profileSectionLabel, { color: '#22c55e' }]}>STRENGTHS</Text>
              {liftingMoverData.strengths.slice(0, 3).map((s, i) => (
                <Text key={i} style={styles.profileItem}>• {s}</Text>
              ))}
            </View>
            <View style={styles.profileSection}>
              <Text style={[styles.profileSectionLabel, { color: '#f59e0b' }]}>WATCH-OUTS</Text>
              {liftingMoverData.watchOuts.slice(0, 2).map((s, i) => (
                <Text key={i} style={styles.profileItem}>• {s}</Text>
              ))}
            </View>
          </View>
        )}

        {/* No profiles yet */}
        {!hittingProfile && !mentalArchetype && !liftingMoverData && diagnostics.length === 0 && (
          <View style={styles.card}>
            <Text style={styles.emptyRow}>Your athlete hasn't completed any assessments yet.</Text>
          </View>
        )}

        {/* ═══════ 3. TRAINING STATUS ═══════ */}
        <View style={styles.card}>
          <Text style={[styles.sectionLabel, { color: ACCENT }]}>TRAINING STATUS</Text>
          {[
            { label: 'Hitting Assessment', done: hittingDone, color: '#E10600' },
            { label: 'Mental Assessment', done: mentalDone, color: '#8b5cf6' },
            { label: 'Lifting Assessment', done: liftingDone, color: '#22c55e' },
          ].map((item) => (
            <View key={item.label} style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: item.done ? item.color : colors.textMuted }]} />
              <Text style={styles.statusText}>{item.label}</Text>
              <Text style={[styles.statusValue, { color: item.done ? item.color : colors.textMuted }]}>
                {item.done ? 'Complete' : 'Not started'}
              </Text>
            </View>
          ))}
        </View>

        {/* ═══════ 4. RECENT COMPLETIONS ═══════ */}
        {diagnostics.length > 0 && (
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: '#3b82f6' }]}>RECENT COMPLETIONS</Text>
            {diagnostics.slice(0, 5).map((d: any, i: number) => (
              <View key={i} style={styles.completionRow}>
                <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                <Text style={styles.completionText}>
                  {d.vault_type === 'hitting' ? 'Hitting' : d.vault_type === 'mental' ? 'Mental' : 'Lifting'} — {d.diagnostic_type.replace(/-/g, ' ')}
                </Text>
                <Text style={styles.completionDate}>
                  {new Date(d.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ═══════ 5. PROGRESS & METRICS ═══════ */}
        {Object.keys(bestMetrics).length > 0 && (
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>PROGRESS & METRICS</Text>
            {Object.entries(bestMetrics).map(([type, data]) => {
              const label = type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
              const unit = type.includes('seconds') ? 's' : type.includes('mph') ? ' mph' : type.includes('inches') ? '"' : '';
              return (
                <View key={type} style={styles.metricRow}>
                  <Text style={styles.metricLabel}>{label}</Text>
                  <Text style={styles.metricValue}>{data.value}{unit}</Text>
                  <Text style={styles.metricDate}>
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ═══════ 6. TRAINING ACTIVITY ═══════ */}
        {recentSessionCount > 0 && (
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: '#22c55e' }]}>TRAINING ACTIVITY</Text>
            <View style={styles.trainingStats}>
              <View style={styles.trainingStat}>
                <Text style={styles.trainingStatNum}>{completedSessionCount}</Text>
                <Text style={styles.trainingStatLabel}>Completed</Text>
              </View>
              <View style={styles.trainingStat}>
                <Text style={styles.trainingStatNum}>{recentSessionCount}</Text>
                <Text style={styles.trainingStatLabel}>Recent</Text>
              </View>
            </View>
          </View>
        )}

        {/* ═══════ 7. ANNOUNCEMENTS ═══════ */}
        <TouchableOpacity
          style={[styles.card, { borderColor: ACCENT + '30' }]}
          onPress={() => router.push('/(app)/community/announcements' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.announcementRow}>
            <Ionicons name="megaphone" size={18} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.announcementTitle}>Coach Announcements</Text>
              <Text style={styles.announcementSub}>
                {announcementCount > 0 ? `${announcementCount} recent update${announcementCount !== 1 ? 's' : ''}` : 'View announcements'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Info note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
          <Text style={styles.infoNoteText}>
            This is a view-only parent account. You can see your athlete's activity and progress but cannot edit their training data.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40, gap: 12 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  headerWrap: { padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  greeting: { fontSize: 14, color: colors.textMuted, fontWeight: '500' },
  name: { fontSize: 26, fontWeight: '900', color: colors.textPrimary, letterSpacing: 0.5 },
  profileBtn: { padding: 4, marginTop: 4 },
  signOutBtn: { padding: 6, marginTop: 4 },

  viewBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    backgroundColor: ACCENT + '12', borderWidth: 1, borderColor: ACCENT + '25',
  },
  viewBadgeText: { fontSize: 11, fontWeight: '700', color: ACCENT },

  switcherScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  switcherChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginRight: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  switcherChipActive: { backgroundColor: ACCENT + '20', borderColor: ACCENT + '40' },
  switcherText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  switcherTextActive: { color: ACCENT },

  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: ACCENT + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '900', color: ACCENT },
  athleteName: { fontSize: 17, fontWeight: '900', color: colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  metaText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },

  // Profile cards
  profileTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  profileSub: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  profileSection: { gap: 3, marginTop: 4 },
  profileSectionLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  profileItem: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  // Status rows
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  statusValue: { fontSize: 11, fontWeight: '700' },

  // Completions
  completionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  completionText: { flex: 1, fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  completionDate: { fontSize: 10, color: colors.textMuted },

  // Announcements
  announcementRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  announcementTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  announcementSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  // Info
  infoNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12,
    backgroundColor: colors.surface, borderRadius: radius.md,
  },
  infoNoteText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  // Empty states
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  emptyDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  emptyRow: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  loadingText: { fontSize: 12, color: colors.textMuted },
  linkBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: radius.lg,
    backgroundColor: ACCENT, marginTop: 8,
  },
  linkBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },

  // Metrics
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  metricLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textPrimary, textTransform: 'capitalize' },
  metricValue: { fontSize: 14, fontWeight: '900', color: colors.textPrimary },
  metricDate: { fontSize: 10, color: colors.textMuted, width: 50, textAlign: 'right' },

  // Training activity
  trainingStats: { flexDirection: 'row', gap: 12 },
  trainingStat: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 8, backgroundColor: colors.bg, borderRadius: radius.sm },
  trainingStatNum: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  trainingStatLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
});

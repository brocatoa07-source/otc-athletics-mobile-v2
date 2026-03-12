import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';

interface RosterAthlete {
  userId: string;
  athleteId: string; // athletes.id (table PK)
  fullName: string;
  avatarUrl?: string;
  tier: string;
  position?: string;
  age?: number;
  sport?: string;
  moverType?: string;
  mentalArchetype?: string;
  programName?: string;
  workoutCount: number;
  journalCount: number;
}

const MOVER_COLORS: Record<string, string> = {
  static: '#3b82f6',
  spring: '#22c55e',
  hybrid: '#f59e0b',
};

const ARCHETYPE_COLORS: Record<string, string> = {
  reactor: '#ef4444',
  overthinker: '#3b82f6',
  avoider: '#8b5cf6',
  performer: '#f59e0b',
  doubter: '#06b6d4',
  driver: '#22c55e',
};

export default function RosterScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const [athletes, setAthletes] = useState<RosterAthlete[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoster = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Get connected athlete user_ids via RPC
    const { data: connected } = await supabase
      .rpc('get_coach_athlete_ids', { coach_user_id: userId });

    if (!connected || connected.length === 0) {
      setAthletes([]);
      setLoading(false);
      return;
    }

    const athleteUserIds = connected.map((r: any) => r.athlete_user_id as string);

    // Fetch user info FIRST (always readable, primary data source)
    const { data: users } = await supabase
      .from('users')
      .select('id, full_name, avatar_url')
      .in('id', athleteUserIds);

    if (!users || users.length === 0) {
      setAthletes([]);
      setLoading(false);
      return;
    }

    // Try to fetch athlete rows (may return empty due to RLS)
    const { data: profiles } = await supabase
      .from('athletes')
      .select('*')
      .in('user_id', athleteUserIds);

    const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));

    // Fetch assigned programs (only if we have athlete table PKs)
    const athleteIds = (profiles ?? []).map((p) => p.id);
    const assignMap = new Map<string, string>();
    const workoutMap = new Map<string, number>();

    if (athleteIds.length > 0) {
      const { data: assignments } = await supabase
        .from('program_assignments')
        .select('athlete_id, program_id, programs(title)')
        .in('athlete_id', athleteIds)
        .eq('active', true);

      if (assignments) {
        for (const a of assignments) {
          const title = (a as any).programs?.title;
          if (title) assignMap.set(a.athlete_id, title);
        }
      }

      // Fetch training session counts
      const { data: sessionCounts } = await supabase
        .from('training_sessions')
        .select('athlete_id')
        .in('athlete_id', athleteIds);

      if (sessionCounts) {
        for (const s of sessionCounts) {
          workoutMap.set(s.athlete_id, (workoutMap.get(s.athlete_id) ?? 0) + 1);
        }
      }
    }

    // Fetch athlete log counts (journals)
    const { data: logCounts } = await supabase
      .from('athlete_logs')
      .select('user_id')
      .in('user_id', athleteUserIds);

    const journalMap = new Map<string, number>();
    if (logCounts) {
      for (const l of logCounts) {
        journalMap.set(l.user_id, (journalMap.get(l.user_id) ?? 0) + 1);
      }
    }

    // Build roster from users (primary), enrich with athlete profiles if available
    const roster: RosterAthlete[] = users.map((u) => {
      const p = profileMap.get(u.id);
      return {
        userId: u.id,
        athleteId: p?.id ?? u.id,
        fullName: u.full_name ?? 'Unknown',
        avatarUrl: u.avatar_url ?? undefined,
        tier: p?.tier ?? 'free',
        position: p?.position ?? undefined,
        age: p?.age ?? undefined,
        sport: p?.sport ?? undefined,
        moverType: p?.mover_type ?? undefined,
        mentalArchetype: p?.mental_archetype ?? undefined,
        programName: p ? assignMap.get(p.id) ?? undefined : undefined,
        workoutCount: p ? workoutMap.get(p.id) ?? 0 : 0,
        journalCount: journalMap.get(u.id) ?? 0,
      };
    });

    setAthletes(roster);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadRoster();
  }, [loadRoster]);

  const capitalize = (s?: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>COACH</Text>
          <Text style={styles.headerTitle}>My Athletes</Text>
        </View>
        <Text style={styles.countBadge}>{athletes.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        {!loading && athletes.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="people-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Athletes Yet</Text>
            <Text style={styles.emptyDesc}>
              Share your connect code with athletes so they can send you a request.
            </Text>
          </View>
        )}

        {athletes.map((a) => (
          <TouchableOpacity
            key={a.userId}
            style={styles.athleteCard}
            onPress={() => router.push({ pathname: '/(app)/coach/athlete-detail' as any, params: { userId: a.userId } })}
            activeOpacity={0.7}
          >
            <View style={styles.cardTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{a.fullName.charAt(0)}</Text>
              </View>
              <View style={styles.nameCol}>
                <Text style={styles.athleteName}>{a.fullName}</Text>
                <View style={styles.metaRow}>
                  {a.position && <Text style={styles.metaText}>{a.position}</Text>}
                  {a.age && <Text style={styles.metaText}>Age {a.age}</Text>}
                  <Text style={styles.tierBadgeText}>{a.tier.replace('_', ' ')}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </View>

            <View style={styles.badgeRow}>
              {a.moverType && (
                <View style={[styles.quizBadge, { backgroundColor: (MOVER_COLORS[a.moverType] ?? '#888') + '15' }]}>
                  <View style={[styles.quizDot, { backgroundColor: MOVER_COLORS[a.moverType] ?? '#888' }]} />
                  <Text style={[styles.quizBadgeText, { color: MOVER_COLORS[a.moverType] ?? '#888' }]}>
                    {capitalize(a.moverType)}
                  </Text>
                </View>
              )}
              {a.mentalArchetype && (
                <View style={[styles.quizBadge, { backgroundColor: (ARCHETYPE_COLORS[a.mentalArchetype] ?? '#888') + '15' }]}>
                  <View style={[styles.quizDot, { backgroundColor: ARCHETYPE_COLORS[a.mentalArchetype] ?? '#888' }]} />
                  <Text style={[styles.quizBadgeText, { color: ARCHETYPE_COLORS[a.mentalArchetype] ?? '#888' }]}>
                    {capitalize(a.mentalArchetype)}
                  </Text>
                </View>
              )}
              {!a.moverType && !a.mentalArchetype && (
                <Text style={styles.noQuizText}>No quiz results yet</Text>
              )}
            </View>

            <View style={styles.statsRow}>
              {a.programName && (
                <View style={styles.statChip}>
                  <Ionicons name="barbell-outline" size={12} color="#22c55e" />
                  <Text style={styles.statChipText}>{a.programName}</Text>
                </View>
              )}
              <View style={styles.statChip}>
                <Ionicons name="fitness-outline" size={12} color="#3b82f6" />
                <Text style={styles.statChipText}>{a.workoutCount} workouts</Text>
              </View>
              <View style={styles.statChip}>
                <Ionicons name="journal-outline" size={12} color="#8b5cf6" />
                <Text style={styles.statChipText}>{a.journalCount} journals</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  countBadge: { fontSize: 14, fontWeight: '800', color: Colors.textMuted },
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  loaderWrap: { paddingVertical: 60, alignItems: 'center' },
  emptyCard: {
    alignItems: 'center',
    gap: 10,
    padding: 32,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  athleteCard: {
    padding: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    gap: 10,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3b82f620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 17, fontWeight: '900', color: '#3b82f6' },
  nameCol: { flex: 1 },
  athleteName: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  metaText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  tierBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.primary },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  quizDot: { width: 6, height: 6, borderRadius: 3 },
  quizBadgeText: { fontSize: 11, fontWeight: '800' },
  noQuizText: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic' },
  statsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Colors.bg,
    borderRadius: 6,
  },
  statChipText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
});

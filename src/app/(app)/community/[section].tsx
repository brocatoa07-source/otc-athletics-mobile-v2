import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useTier } from '@/hooks/useTier';
import { Colors } from '@/constants/colors';
import { PostCard } from '@/components/community/PostCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SECTION_CONFIG, type CommunitySection, type CommunityPost } from '@/types/community';
import { AGE_GROUPS, getAgeGroupForAge, getBenchmark, type AgeGroup } from '@/data/benchmarks';
import type { MetricType } from '@/types/progress';

const PAGE_SIZE = 20;

const SECTION_COLORS: Record<string, string> = {
  announcements: Colors.primary,
  leaderboards: '#f59e0b',
  challenges: '#22c55e',
  live_archive: '#8b5cf6',
};

// ─── LEADERBOARD SECTION ───────────────────────────────────────────────
const LEADERBOARD_CATEGORIES = [
  { key: 'exit_velo', metric: 'exit_velocity_mph', label: 'Exit Velo', unit: 'mph', icon: 'flash', color: Colors.primary, ascending: false },
  { key: '60yd', metric: 'sprint_60yd_seconds', label: '60-Yard', unit: 'sec', icon: 'timer', color: '#22c55e', ascending: true },
  { key: 'pulldown', metric: 'throw_velocity_mph', label: 'Pulldown', unit: 'mph', icon: 'arrow-forward-circle', color: '#8b5cf6', ascending: false },
  { key: '10yd', metric: 'sprint_10yd_seconds', label: '10-Yard', unit: 'sec', icon: 'stopwatch', color: '#f59e0b', ascending: true },
] as const;

async function fetchLeaderboard(metricType: string, ascending: boolean, ageGroup?: AgeGroup | null) {
  const { data } = await supabase
    .from('athlete_progress')
    .select('athlete_id, value, athlete:athletes(user_id, age, users:user_id(full_name))')
    .eq('metric_type', metricType)
    .order('value', { ascending })
    .limit(200);

  let filtered = data ?? [];

  if (ageGroup) {
    filtered = filtered.filter((row: any) => {
      const age = (row.athlete as any)?.age;
      return age != null && age >= ageGroup.minAge && age <= ageGroup.maxAge;
    });
  }

  const seen = new Set<string>();
  return filtered.filter((row: any) => {
    if (seen.has(row.athlete_id)) return false;
    seen.add(row.athlete_id);
    return true;
  }).slice(0, 10);
}

function LeaderboardSection() {
  const { athlete } = useAuth();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitCategory, setSubmitCategory] = useState(0);
  const [submitValue, setSubmitValue] = useState('');
  const [submitNotes, setSubmitNotes] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);

  useEffect(() => {
    const ag = getAgeGroupForAge(athlete?.age ?? undefined);
    if (ag) setSelectedAgeGroup(ag.key);
  }, [athlete?.age]);

  const activeAgeGroup = selectedAgeGroup
    ? AGE_GROUPS.find(g => g.key === selectedAgeGroup) ?? null
    : null;

  const exitVelo = useQuery({
    queryKey: ['leaderboard', 'exit_velocity_mph', selectedAgeGroup],
    queryFn: () => fetchLeaderboard('exit_velocity_mph', false, activeAgeGroup),
  });
  const sprint60 = useQuery({
    queryKey: ['leaderboard', 'sprint_60yd_seconds', selectedAgeGroup],
    queryFn: () => fetchLeaderboard('sprint_60yd_seconds', true, activeAgeGroup),
  });
  const pulldown = useQuery({
    queryKey: ['leaderboard', 'throw_velocity_mph', selectedAgeGroup],
    queryFn: () => fetchLeaderboard('throw_velocity_mph', false, activeAgeGroup),
  });
  const sprint10 = useQuery({
    queryKey: ['leaderboard', 'sprint_10yd_seconds', selectedAgeGroup],
    queryFn: () => fetchLeaderboard('sprint_10yd_seconds', true, activeAgeGroup),
  });
  const boards = [exitVelo, sprint60, pulldown, sprint10];

  const submitMutation = useMutation({
    mutationFn: async () => {
      const numVal = parseFloat(submitValue);
      if (isNaN(numVal)) throw new Error('Enter a valid number');
      if (!athlete) throw new Error('Your athlete profile is not set up yet. Complete onboarding before submitting to the leaderboard.');
      const cat = LEADERBOARD_CATEGORIES[submitCategory];
      const { error } = await supabase.from('athlete_progress').insert({
        athlete_id: athlete.id,
        metric_type: cat.metric,
        value: numVal,
        notes: submitNotes.trim() || null,
        recorded_at: new Date().toISOString(),
      });
      if (error) {
        if (error.code === '42P01' || error.message?.includes('not exist') || error.message?.includes('Not Found')) {
          throw new Error('Progress tracking table not set up. Ask your coach to run the latest database migration.');
        }
        throw new Error(error.message || 'Failed to submit. Please try again.');
      }
    },
    onSuccess: () => {
      const cat = LEADERBOARD_CATEGORIES[submitCategory];
      qc.invalidateQueries({ queryKey: ['leaderboard', cat.metric] });
      qc.invalidateQueries({ queryKey: ['progress'] });

      const ageGroup = getAgeGroupForAge(athlete?.age ?? undefined);
      const numVal = parseFloat(submitValue);
      let benchmarkMsg = '';

      if (ageGroup) {
        const benchmark = getBenchmark(cat.metric as MetricType, ageGroup.key);
        if (benchmark) {
          const isHigherBetter = !cat.ascending;
          const isElite = isHigherBetter ? numVal >= benchmark.elite : numVal <= benchmark.elite;
          const isGood = isHigherBetter ? numVal >= benchmark.good : numVal <= benchmark.good;
          const isAvg = isHigherBetter ? numVal >= benchmark.average : numVal <= benchmark.average;

          if (isElite) benchmarkMsg = `\n\nElite level for ${ageGroup.label}! Keep pushing.`;
          else if (isGood) benchmarkMsg = `\n\nAbove average for ${ageGroup.label}. Good work.`;
          else if (isAvg) benchmarkMsg = `\n\nAverage for ${ageGroup.label}. Keep grinding.`;
          else benchmarkMsg = `\n\nBelow average for ${ageGroup.label}. Room to grow — lock in.`;

          benchmarkMsg += `\n(Avg: ${benchmark.average}, Good: ${benchmark.good}, Elite: ${benchmark.elite} ${cat.unit})`;
        }
      } else {
        benchmarkMsg = '\n\nSet your age in your profile to see how you compare to your age group.';
      }

      setSubmitValue('');
      setSubmitNotes('');
      setSubmitOpen(false);
      Alert.alert('Submitted!', `Your number has been posted to the leaderboard.${benchmarkMsg}`);
    },
    onError: (err: Error) => Alert.alert('Error', err.message),
  });

  const activeCat = LEADERBOARD_CATEGORIES[activeTab];
  const activeBoard = boards[activeTab];
  const rows = activeBoard.data ?? [];

  return (
    <>
      <ScrollView contentContainerStyle={lbStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={lbStyles.intro}>Rankings update in real time as athletes log their data.</Text>

        <Text style={lbStyles.ageLabel}>AGE GROUP</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={lbStyles.tabScroll}>
          <TouchableOpacity
            style={[lbStyles.ageTab, !selectedAgeGroup && lbStyles.ageTabActive]}
            onPress={() => setSelectedAgeGroup(null)}
          >
            <Text style={[lbStyles.ageTabText, !selectedAgeGroup && lbStyles.ageTabTextActive]}>All</Text>
          </TouchableOpacity>
          {AGE_GROUPS.map((ag) => (
            <TouchableOpacity
              key={ag.key}
              style={[lbStyles.ageTab, selectedAgeGroup === ag.key && lbStyles.ageTabActive]}
              onPress={() => setSelectedAgeGroup(ag.key)}
            >
              <Text style={[lbStyles.ageTabText, selectedAgeGroup === ag.key && lbStyles.ageTabTextActive]}>
                {ag.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={lbStyles.tabScroll}>
          {LEADERBOARD_CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={cat.key}
              style={[lbStyles.tab, activeTab === i && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
              onPress={() => setActiveTab(i)}
            >
              <Ionicons name={cat.icon as any} size={14} color={activeTab === i ? cat.color : Colors.textMuted} />
              <Text style={[lbStyles.tabText, activeTab === i && { color: cat.color }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[lbStyles.board, { borderColor: activeCat.color + '40' }]}>
          <View style={[lbStyles.boardHeader, { borderBottomColor: activeCat.color + '30' }]}>
            <Ionicons name={activeCat.icon as any} size={20} color={activeCat.color} />
            <Text style={[lbStyles.boardTitle, { color: activeCat.color }]}>{activeCat.label}</Text>
            <Text style={lbStyles.boardUnit}>{activeCat.unit}</Text>
          </View>
          {selectedAgeGroup && (() => {
            const benchmark = getBenchmark(activeCat.metric as MetricType, selectedAgeGroup);
            if (!benchmark) return null;
            const ageLabel = AGE_GROUPS.find(g => g.key === selectedAgeGroup)?.label;
            return (
              <View style={lbStyles.benchmarkBar}>
                <Text style={lbStyles.benchmarkTitle}>{ageLabel} BENCHMARKS</Text>
                <View style={lbStyles.benchmarkRow}>
                  <View style={lbStyles.benchmarkItem}>
                    <Text style={lbStyles.benchmarkLabel}>AVG</Text>
                    <Text style={[lbStyles.benchmarkValue, { color: Colors.textSecondary }]}>
                      {benchmark.average}{activeCat.unit === 'sec' ? 's' : ''}
                    </Text>
                  </View>
                  <View style={lbStyles.benchmarkItem}>
                    <Text style={lbStyles.benchmarkLabel}>GOOD</Text>
                    <Text style={[lbStyles.benchmarkValue, { color: '#22c55e' }]}>
                      {benchmark.good}{activeCat.unit === 'sec' ? 's' : ''}
                    </Text>
                  </View>
                  <View style={lbStyles.benchmarkItem}>
                    <Text style={lbStyles.benchmarkLabel}>ELITE</Text>
                    <Text style={[lbStyles.benchmarkValue, { color: '#f59e0b' }]}>
                      {benchmark.elite}{activeCat.unit === 'sec' ? 's' : ''}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })()}
          {activeBoard.isLoading ? (
            <ActivityIndicator color={activeCat.color} style={{ padding: 24 }} />
          ) : rows.length === 0 ? (
            <Text style={lbStyles.empty}>No entries yet. Be the first — tap + to submit.</Text>
          ) : (
            rows.map((row: any, i: number) => {
              const name = (row.athlete as any)?.users?.full_name ?? 'Athlete';
              const isMe = row.athlete_id === athlete?.id;
              return (
                <View key={`${row.athlete_id}-${i}`} style={[lbStyles.row, isMe && lbStyles.rowMe]}>
                  <View style={[lbStyles.rank, i < 3 && { backgroundColor: activeCat.color + '20' }]}>
                    <Text style={[lbStyles.rankNum, i < 3 && { color: activeCat.color }]}>
                      {i === 0 ? '\u{1F947}' : i === 1 ? '\u{1F948}' : i === 2 ? '\u{1F949}' : `#${i + 1}`}
                    </Text>
                  </View>
                  <Text style={[lbStyles.name, isMe && { color: activeCat.color }]}>
                    {name}{isMe ? ' (You)' : ''}
                  </Text>
                  <Text style={[lbStyles.value, { color: activeCat.color }]}>
                    {row.value} {activeCat.unit}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[lbStyles.fab, { backgroundColor: activeCat.color }, !athlete && { opacity: 0.4 }]}
        onPress={() => {
          if (!athlete) {
            Alert.alert('Profile Required', 'Complete your athlete profile before submitting to the leaderboard.');
            return;
          }
          setSubmitCategory(activeTab);
          setSubmitOpen(true);
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={submitOpen} transparent animationType="fade">
        <Pressable style={lbStyles.overlay} onPress={() => setSubmitOpen(false)}>
          <Pressable style={lbStyles.modal} onPress={() => {}}>
            <Text style={lbStyles.modalTitle}>Submit Your Number</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={lbStyles.pillScroll}>
              {LEADERBOARD_CATEGORIES.map((cat, i) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[lbStyles.pill, submitCategory === i && { backgroundColor: cat.color, borderColor: cat.color }]}
                  onPress={() => setSubmitCategory(i)}
                >
                  <Text style={[lbStyles.pillText, submitCategory === i && { color: '#fff' }]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={lbStyles.inputRow}>
              <TextInput
                style={lbStyles.valueInput}
                value={submitValue}
                onChangeText={setSubmitValue}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor={Colors.textMuted}
              />
              <Text style={lbStyles.inputUnit}>{LEADERBOARD_CATEGORIES[submitCategory].unit}</Text>
            </View>

            <TextInput
              style={lbStyles.notesInput}
              value={submitNotes}
              onChangeText={setSubmitNotes}
              placeholder="Notes (optional)"
              placeholderTextColor={Colors.textMuted}
              multiline
            />

            <View style={lbStyles.modalActions}>
              <TouchableOpacity style={lbStyles.cancelBtn} onPress={() => setSubmitOpen(false)}>
                <Text style={lbStyles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[lbStyles.submitBtn, { backgroundColor: LEADERBOARD_CATEGORIES[submitCategory].color }, (!submitValue || submitMutation.isPending || !athlete) && { opacity: 0.5 }]}
                onPress={() => submitMutation.mutate()}
                disabled={!submitValue || submitMutation.isPending || !athlete}
              >
                {submitMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={lbStyles.submitBtnText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const lbStyles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 100 },
  intro: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  tabScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    marginRight: 8,
  },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  ageLabel: { fontSize: 9, fontWeight: '900', color: '#f59e0b', letterSpacing: 1.2 },
  ageTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    marginRight: 6,
  },
  ageTabActive: { backgroundColor: '#f59e0b20', borderColor: '#f59e0b' },
  ageTabText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  ageTabTextActive: { color: '#f59e0b' },
  benchmarkBar: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '50',
    backgroundColor: '#f59e0b08',
  },
  benchmarkTitle: { fontSize: 9, fontWeight: '900', color: '#f59e0b', letterSpacing: 1.2, marginBottom: 6 },
  benchmarkRow: { flexDirection: 'row' as const, justifyContent: 'space-around' as const },
  benchmarkItem: { alignItems: 'center' as const, gap: 2 },
  benchmarkLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },
  benchmarkValue: { fontSize: 14, fontWeight: '900' },
  board: { backgroundColor: Colors.bgCard, borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  boardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderBottomWidth: 1 },
  boardTitle: { fontSize: 16, fontWeight: '900', flex: 1 },
  boardUnit: { fontSize: 12, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: Colors.border + '50' },
  rowMe: { backgroundColor: Colors.bgElevated },
  rank: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rankNum: { fontSize: 13, fontWeight: '800', color: Colors.textMuted },
  name: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  value: { fontSize: 15, fontWeight: '900' },
  empty: { padding: 20, fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 20, gap: 14, borderWidth: 1, borderColor: Colors.border },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  pillScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgElevated,
    marginRight: 8,
  },
  pillText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  valueInput: {
    flex: 1,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  inputUnit: { fontSize: 16, color: Colors.textMuted, fontWeight: '600' },
  notesInput: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  cancelBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 14 },
  submitBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});

// ─── CHALLENGES SECTION ────────────────────────────────────────────────
function ChallengesSection() {
  const { user } = useAuth();

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data } = await supabase
        .from('challenges')
        .select('*, challenge_participants(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const { error } = await supabase.from('challenge_participants').insert({
        challenge_id: challengeId,
        user_id: user!.id,
      });
      if (error && !error.message.includes('duplicate')) throw error;
    },
    onSuccess: () => Alert.alert("You're In!", "Challenge joined. Go get it."),
    onError: (err: Error) => Alert.alert('Error', err.message),
  });

  const isJoined = (challenge: any) =>
    challenge.challenge_participants?.some((p: any) => p.user_id === user?.id);

  if (isLoading) return <ActivityIndicator color="#22c55e" style={{ marginTop: 40 }} />;

  return (
    <ScrollView contentContainerStyle={chStyles.content} showsVerticalScrollIndicator={false}>
      {challenges.length === 0 ? (
        <EmptyState icon="flash" title="No active challenges" subtitle="Check back soon — new challenges drop regularly." />
      ) : (
        challenges.map((c: any) => (
          <View key={c.id} style={chStyles.card}>
            <View style={chStyles.cardTop}>
              <View style={chStyles.durationBadge}>
                <Text style={chStyles.durationText}>{c.duration_days}D</Text>
              </View>
              <View style={chStyles.cardMeta}>
                <Text style={chStyles.cardTitle}>{c.title}</Text>
                <Text style={chStyles.cardParticipants}>
                  {c.challenge_participants?.length ?? 0} athletes in
                </Text>
              </View>
            </View>
            <Text style={chStyles.cardDesc}>{c.description}</Text>
            {c.ends_at && (
              <View style={chStyles.deadline}>
                <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                <Text style={chStyles.deadlineText}>
                  Ends {new Date(c.ends_at).toLocaleDateString()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[chStyles.joinBtn, isJoined(c) && chStyles.joinBtnJoined]}
              onPress={() => !isJoined(c) && joinMutation.mutate(c.id)}
            >
              <Ionicons name={isJoined(c) ? 'checkmark-circle' : 'flash'} size={16} color={isJoined(c) ? '#22c55e' : '#fff'} />
              <Text style={[chStyles.joinBtnText, isJoined(c) && chStyles.joinBtnTextJoined]}>
                {isJoined(c) ? 'Joined' : 'Join Challenge'}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const chStyles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  card: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 16, gap: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  durationBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: '#22c55e20', borderWidth: 1, borderColor: '#22c55e40', alignItems: 'center' },
  durationText: { fontSize: 16, fontWeight: '900', color: '#22c55e' },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  cardParticipants: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  cardDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  deadline: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  deadlineText: { fontSize: 12, color: Colors.textMuted },
  joinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 10, backgroundColor: '#22c55e' },
  joinBtnJoined: { backgroundColor: '#22c55e15', borderWidth: 1, borderColor: '#22c55e40' },
  joinBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  joinBtnTextJoined: { color: '#22c55e' },
});

// ─── GENERIC FEED (Announcements + Live Archive) ───────────────────────
function GenericFeed({ sectionKey, config, canPost, color }: {
  sectionKey: CommunitySection;
  config: typeof SECTION_CONFIG[CommunitySection];
  canPost: boolean;
  color: string;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [composeVisible, setComposeVisible] = useState(false);
  const [composeText, setComposeText] = useState('');

  const { data, isLoading, isError, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['community-posts', sectionKey],
    enabled: !!sectionKey,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      let query = supabase
        .from('community_posts')
        .select('*, poster:users!poster_user_id(id, full_name, avatar_url, role), community_reactions(*)')
        .eq('section', sectionKey)
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);
      if (pageParam) query = query.lt('created_at', pageParam);
      const { data: rows } = await query;
      return (rows ?? []) as CommunityPost[];
    },
    getNextPageParam: (lastPage) =>
      lastPage.length === PAGE_SIZE ? lastPage[lastPage.length - 1].created_at : undefined,
  });

  useEffect(() => {
    const ch = supabase
      .channel(`community-${sectionKey}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts', filter: `section=eq.${sectionKey}` },
        () => qc.invalidateQueries({ queryKey: ['community-posts', sectionKey] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [sectionKey]);

  const postMutation = useMutation({
    mutationFn: async () => {
      if (!composeText.trim() || !user) return;
      const { error } = await supabase.from('community_posts').insert({
        poster_user_id: user.id,
        section: sectionKey,
        content: composeText.trim(),
        likes_count: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setComposeText('');
      setComposeVisible(false);
      qc.invalidateQueries({ queryKey: ['community-posts', sectionKey] });
    },
    onError: (err: Error) => Alert.alert('Error', err.message),
  });

  const posts = data?.pages.flat() ?? [];

  return (
    <>
      {isLoading && <ActivityIndicator color={color} style={{ marginTop: 40 }} />}
      {!isLoading && isError && (
        <EmptyState
          icon={sectionKey === 'announcements' ? 'megaphone' : 'videocam'}
          title="Coming Soon"
          subtitle={sectionKey === 'announcements'
            ? 'Coach updates and important program announcements will appear here.'
            : 'Recorded live sessions, clinics, and Q&As will appear here.'}
        />
      )}
      {!isLoading && !isError && posts.length === 0 && (
        <EmptyState
          icon={sectionKey === 'announcements' ? 'megaphone' : 'videocam'}
          title="Coming Soon"
          subtitle={sectionKey === 'announcements'
            ? 'Coach updates and important program announcements will appear here.'
            : 'Recorded live sessions, clinics, and Q&As will appear here.'}
          actionLabel={canPost ? 'Write Post' : undefined}
          onAction={canPost ? () => setComposeVisible(true) : undefined}
        />
      )}
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PostCard post={item} section={sectionKey} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.2}
        contentContainerStyle={styles.list}
      />
      {canPost && posts.length > 0 && (
        <TouchableOpacity style={[styles.fab, { backgroundColor: color }]} onPress={() => setComposeVisible(true)}>
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      )}
      <Modal visible={composeVisible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView style={[styles.modal, { backgroundColor: Colors.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setComposeVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Post</Text>
            <TouchableOpacity onPress={() => postMutation.mutate()} disabled={!composeText.trim() || postMutation.isPending}>
              {postMutation.isPending
                ? <ActivityIndicator color={color} size="small" />
                : <Text style={[styles.postText, { color }, !composeText.trim() && styles.postTextDisabled]}>Post</Text>
              }
            </TouchableOpacity>
          </View>
          <Text style={[styles.sectionLabel, { color }]}>{config?.label}</Text>
          <TextInput
            style={styles.composeInput}
            multiline
            value={composeText}
            onChangeText={setComposeText}
            placeholder="Write something..."
            placeholderTextColor={Colors.textMuted}
            autoFocus
          />
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

// ─── ROOT COMPONENT ─────────────────────────────────────────────────────
export default function SectionFeed() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const sectionKey = section as CommunitySection;
  const config = SECTION_CONFIG[sectionKey];
  const { athlete } = useAuth();
  const { isWalk, isCoach } = useTier();

  const color = SECTION_COLORS[sectionKey] ?? Colors.primary;

  const canPost = (() => {
    if (isWalk) return false;
    if (isCoach) return true;
    const role = athlete?.tier === 'TRIPLE' || athlete?.tier === 'HOME_RUN' ? 'TIER_2' : 'TIER_1';
    return config?.canPost.includes(role) ?? false;
  })();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.label, { color }]}>{sectionKey.toUpperCase().replace('_', ' ')}</Text>
          <Text style={styles.title}>{config?.label ?? section}</Text>
        </View>
      </View>

      {sectionKey === 'leaderboards' && <LeaderboardSection />}
      {sectionKey === 'challenges' && <ChallengesSection />}
      {(sectionKey === 'announcements' || sectionKey === 'live_archive') && (
        <GenericFeed sectionKey={sectionKey} config={config} canPost={canPost} color={color} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  back: { paddingTop: 2 },
  headerText: { flex: 1 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 2 },
  title: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  list: { padding: 16, gap: 10 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  modal: { flex: 1, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cancelText: { fontSize: 16, color: Colors.textSecondary },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  postText: { fontSize: 16, fontWeight: '700' },
  postTextDisabled: { opacity: 0.4 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  composeInput: { flex: 1, color: Colors.textPrimary, fontSize: 16, lineHeight: 24, textAlignVertical: 'top' },
});

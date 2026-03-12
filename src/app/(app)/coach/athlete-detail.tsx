import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, TextInput, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { useConversations } from '@/hooks/useConversations';
import type { Program } from '@/types/database';

// ── Types ──────────────────────────────────────────────────────────

interface AthleteData {
  userId: string;
  athleteId: string;
  fullName: string;
  tier: string;
  sport?: string;
  position?: string;
  age?: number;
  moverType?: string;
  mentalArchetype?: string;
  scExperience?: string;
  scEquipment?: string;
  scTimeline?: string;
  programName?: string;
  programId?: string;
  hittingProgramName?: string;
  hittingProgramId?: string;
  hittingAssignmentId?: string;
  hittingStartDate?: string;
  recentWorkouts: { name: string; status: string; date: string }[];
  recentJournals: { text: string; date: string }[];
}

interface CoachNote {
  id: string;
  text: string;
  createdAt: string;
}

type AthleteTab = 'overview' | 'program' | 'notes';

const TABS: { key: AthleteTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'overview', label: 'Overview', icon: 'grid-outline' },
  { key: 'program', label: 'Program', icon: 'barbell-outline' },
  { key: 'notes', label: 'Notes', icon: 'document-text-outline' },
];

// ── Constants ──────────────────────────────────────────────────────

const MOVER_META: Record<string, { label: string; color: string }> = {
  static: { label: 'Static Mover', color: '#3b82f6' },
  spring: { label: 'Spring Mover', color: '#22c55e' },
  hybrid: { label: 'Hybrid Mover', color: '#f59e0b' },
};

const ARCHETYPE_META: Record<string, { label: string; color: string }> = {
  reactor: { label: 'The Reactor', color: '#ef4444' },
  overthinker: { label: 'The Overthinker', color: '#3b82f6' },
  avoider: { label: 'The Avoider', color: '#8b5cf6' },
  performer: { label: 'The Performer', color: '#f59e0b' },
  doubter: { label: 'The Doubter', color: '#06b6d4' },
  driver: { label: 'The Driver', color: '#22c55e' },
};

// ── Component ──────────────────────────────────────────────────────

export default function AthleteDetailScreen() {
  const params = useLocalSearchParams<{ userId: string }>();
  const athleteUserId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const coach = useAuthStore((s) => s.coach);
  const { findOrCreateDM } = useConversations();

  const [data, setData] = useState<AthleteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AthleteTab>('overview');

  // Notes state
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [sessionFocus, setSessionFocus] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleMessage = async () => {
    try {
      const conversationId = await findOrCreateDM.mutateAsync({
        targetUserId: athleteUserId,
        targetRole: 'athlete',
        myRole: 'coach',
      });
      router.navigate(`/(app)/messages/${conversationId}` as any);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Could not open conversation.');
    }
  };

  // Hitting program assignment state
  const [hittingModalVisible, setHittingModalVisible] = useState(false);
  const [hittingPrograms, setHittingPrograms] = useState<Program[]>([]);
  const [hittingProgLoading, setHittingProgLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // ── Data Loading ──

  const loadAthlete = useCallback(async () => {
    if (!athleteUserId) return;
    setLoading(true);

    // Fetch user FIRST (always readable, primary data source)
    const { data: user } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', athleteUserId)
      .maybeSingle();

    if (!user) {
      if (__DEV__) console.warn('[athlete-detail] No user row for id:', athleteUserId);
      setLoading(false);
      return;
    }

    // Try to fetch athlete profile (may return null due to RLS)
    const { data: athlete } = await supabase
      .from('athletes')
      .select('*')
      .eq('user_id', athleteUserId)
      .maybeSingle();

    const athleteTableId = athlete?.id ?? null;

    // Fetch program assignments & workouts only if we have the athlete table PK
    let assignment: any = null;
    let hittingAssignment: any = null;
    let workouts: any[] = [];

    if (athleteTableId) {
      const { data: a } = await supabase
        .from('program_assignments')
        .select('program_id, programs(title)')
        .eq('athlete_id', athleteTableId)
        .in('program_type', ['lifting', 'general'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      assignment = a;

      const { data: ha } = await supabase
        .from('program_assignments')
        .select('id, program_id, start_date, programs(title)')
        .eq('athlete_id', athleteTableId)
        .eq('program_type', 'hitting')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      hittingAssignment = ha;

      const { data: w } = await supabase
        .from('training_sessions')
        .select('id, week_index, day_index, status, created_at, notes')
        .eq('athlete_id', athleteTableId)
        .order('created_at', { ascending: false })
        .limit(5);
      workouts = w ?? [];
    }

    const { data: journals } = await supabase
      .from('athlete_logs')
      .select('payload, created_at')
      .eq('user_id', athleteUserId)
      .order('created_at', { ascending: false })
      .limit(3);

    setData({
      userId: athleteUserId,
      athleteId: athleteTableId ?? athleteUserId,
      fullName: user.full_name ?? 'Unknown',
      tier: athlete?.tier ?? 'free',
      sport: athlete?.sport ?? undefined,
      position: athlete?.position ?? undefined,
      age: athlete?.age ?? undefined,
      moverType: athlete?.mover_type ?? undefined,
      mentalArchetype: athlete?.mental_archetype ?? undefined,
      scExperience: athlete?.sc_experience ?? undefined,
      scEquipment: athlete?.sc_equipment ?? undefined,
      scTimeline: athlete?.sc_timeline ?? undefined,
      programName: assignment?.programs?.title ?? undefined,
      programId: assignment?.program_id ?? undefined,
      hittingProgramName: hittingAssignment?.programs?.title ?? undefined,
      hittingProgramId: hittingAssignment?.program_id ?? undefined,
      hittingAssignmentId: hittingAssignment?.id ?? undefined,
      hittingStartDate: hittingAssignment?.start_date ?? undefined,
      recentWorkouts: workouts.map((w: any) => ({
        name: `Week ${w.week_index} · Day ${w.day_index}`,
        status: w.status,
        date: w.created_at,
      })),
      recentJournals: (journals ?? []).map((j: any) => ({
        text: j.payload?.text ?? j.payload?.entry ?? '',
        date: j.created_at,
      })),
    });
    setLoading(false);
  }, [athleteUserId]);

  // Load notes from AsyncStorage
  useEffect(() => {
    if (activeTab !== 'notes' || !athleteUserId) return;
    (async () => {
      const raw = await AsyncStorage.getItem(`coach-notes-${athleteUserId}`);
      if (raw) {
        try { setNotes(JSON.parse(raw)); } catch { /* ignore */ }
      }
      const focus = await AsyncStorage.getItem(`coach-focus-${athleteUserId}`);
      if (focus) setSessionFocus(focus);
    })();
  }, [activeTab, athleteUserId]);

  useEffect(() => {
    loadAthlete();
  }, [loadAthlete]);

  // ── Note Handlers ──

  const saveNote = async () => {
    if (!newNote.trim() || !athleteUserId) return;
    const note: CoachNote = {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [note, ...notes];
    setNotes(updated);
    setNewNote('');
    await AsyncStorage.setItem(`coach-notes-${athleteUserId}`, JSON.stringify(updated));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const saveFocus = async (text: string) => {
    setSessionFocus(text);
    if (athleteUserId) {
      await AsyncStorage.setItem(`coach-focus-${athleteUserId}`, text);
    }
  };

  // ── Hitting Program Handlers ──

  const openHittingModal = useCallback(async () => {
    setHittingModalVisible(true);
    if (!coach?.user_id) return;
    setHittingProgLoading(true);
    const { data } = await supabase
      .from('programs')
      .select('id, title, description, duration_weeks, program_type, owner_user_id, created_at, updated_at')
      .eq('owner_user_id', coach.user_id)
      .eq('program_type', 'hitting')
      .order('created_at', { ascending: false });
    setHittingPrograms((data as Program[]) ?? []);
    setHittingProgLoading(false);
  }, [coach?.user_id]);

  const handleAssignHitting = useCallback(async (programId: string, programTitle: string) => {
    if (!data?.athleteId || assigning) return;
    setAssigning(true);
    try {
      // Deactivate existing active hitting assignment
      await supabase
        .from('program_assignments')
        .update({ active: false })
        .eq('athlete_id', data.athleteId)
        .eq('program_type', 'hitting')
        .eq('active', true);

      const { error } = await supabase.from('program_assignments').insert({
        athlete_id: data.athleteId,
        program_id: programId,
        program_type: 'hitting',
        current_week: 1,
        current_day: 1,
        active: true,
        start_date: new Date().toISOString().split('T')[0],
        assigned_by: coach?.id ?? null,
      });

      if (error) throw error;

      setHittingModalVisible(false);
      setData((prev) => prev ? {
        ...prev,
        hittingProgramName: programTitle,
        hittingProgramId: programId,
        hittingStartDate: new Date().toISOString().split('T')[0],
      } : prev);
      Alert.alert('Assigned', `${programTitle} assigned successfully.`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setAssigning(false);
    }
  }, [data?.athleteId, coach?.id, assigning]);

  // ── Remove Athlete ──

  const handleRemoveAthlete = () => {
    Alert.alert(
      'Remove Athlete',
      `Remove ${data?.fullName} from your roster? They can reconnect later.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (!data?.userId) return;
            const { error } = await supabase.rpc('disconnect_coach', {
              athlete_user_id: data.userId,
            });
            if (error) {
              Alert.alert('Error', error.message);
              return;
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          },
        },
      ],
    );
  };

  // ── Derived ──

  const mover = data?.moverType ? MOVER_META[data.moverType] : null;
  const archetype = data?.mentalArchetype ? ARCHETYPE_META[data.mentalArchetype] : null;

  // ── Loading / Error States ──

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Athlete not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render ──

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>ATHLETE</Text>
          <Text style={styles.headerTitle}>{data.fullName}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={handleMessage}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => router.push({ pathname: '/(app)/coach/assign-program' as any, params: { athleteId: athleteUserId } })}
          >
            <Ionicons name="barbell-outline" size={18} color="#22c55e" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Card (always visible) */}
      <View style={styles.profileBar}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{data.fullName.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.profileMeta}>
            {data.sport && <Text style={styles.profileMetaText}>{data.sport}</Text>}
            {data.position && <Text style={styles.profileMetaText}>{data.position}</Text>}
            {data.age && <Text style={styles.profileMetaText}>Age {data.age}</Text>}
          </View>
          <Text style={styles.tierText}>{data.tier.replace('_', ' ')}</Text>
        </View>
      </View>

      {/* Tab Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={14}
              color={activeTab === tab.key ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            {/* Weekly Activity Dots */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>LAST 7 DAYS</Text>
              <View style={styles.dotsRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <View key={i} style={styles.dotCol}>
                    <View style={[styles.dot, i < 3 && styles.dotActive]} />
                    <Text style={styles.dotLabel}>{day}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Quiz Results */}
            {mover && (
              <View style={[styles.quizCard, { borderColor: mover.color + '40' }]}>
                <View style={[styles.quizIcon, { backgroundColor: mover.color + '15' }]}>
                  <Ionicons name="body-outline" size={20} color={mover.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quizLabel}>MOVER TYPE</Text>
                  <Text style={[styles.quizValue, { color: mover.color }]}>{mover.label}</Text>
                </View>
              </View>
            )}

            {archetype && (
              <View style={[styles.quizCard, { borderColor: archetype.color + '40' }]}>
                <View style={[styles.quizIcon, { backgroundColor: archetype.color + '15' }]}>
                  <Ionicons name="bulb-outline" size={20} color={archetype.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quizLabel}>MENTAL ARCHETYPE</Text>
                  <Text style={[styles.quizValue, { color: archetype.color }]}>{archetype.label}</Text>
                </View>
              </View>
            )}

            {/* Recent Workouts */}
            {data.recentWorkouts.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>RECENT WORKOUTS</Text>
                {data.recentWorkouts.map((w, i) => (
                  <View key={i} style={styles.listRow}>
                    <Ionicons name="fitness-outline" size={16} color="#3b82f6" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listTitle}>{w.name}</Text>
                      <Text style={styles.listMeta}>{w.status} · {new Date(w.date).toLocaleDateString()}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Recent Journals */}
            {data.recentJournals.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>RECENT JOURNALS</Text>
                {data.recentJournals.map((j, i) => (
                  <View key={i} style={styles.journalItem}>
                    <Text style={styles.journalText} numberOfLines={3}>{j.text}</Text>
                    <Text style={styles.journalDate}>{new Date(j.date).toLocaleDateString()}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionCard} onPress={handleMessage}>
                <Ionicons name="chatbubble-outline" size={20} color="#3b82f6" />
                <Text style={styles.actionLabel}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push({ pathname: '/(app)/coach/assign-program' as any, params: { athleteId: athleteUserId } })}>
                <Ionicons name="barbell-outline" size={20} color="#22c55e" />
                <Text style={styles.actionLabel}>Assign</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionCard, styles.removeCard]} onPress={handleRemoveAthlete}>
                <Ionicons name="person-remove-outline" size={20} color="#ef4444" />
                <Text style={[styles.actionLabel, { color: '#ef4444' }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── PROGRAM TAB ── */}
        {activeTab === 'program' && (
          <>
            {/* S&C Program */}
            {data.programName ? (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>S&C PROGRAM</Text>
                <View style={styles.programRow}>
                  <Ionicons name="barbell-outline" size={20} color="#22c55e" />
                  <Text style={styles.programName}>{data.programName}</Text>
                </View>
                <View style={styles.programActions}>
                  <TouchableOpacity
                    style={styles.programActionBtn}
                    onPress={() => router.push({ pathname: '/(app)/coach/assign-program' as any, params: { athleteId: athleteUserId } })}
                  >
                    <Text style={styles.programActionText}>Reassign</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="barbell-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No S&C program assigned</Text>
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() => router.push({ pathname: '/(app)/coach/assign-program' as any, params: { athleteId: athleteUserId } })}
                >
                  <Ionicons name="add-circle-outline" size={18} color="#fff" />
                  <Text style={styles.ctaBtnText}>Assign S&C Program</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Hitting Program */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>HITTING PROGRAM</Text>
              {data.hittingProgramName ? (
                <>
                  <View style={styles.programRow}>
                    <Ionicons name="baseball-outline" size={20} color={Colors.primary} />
                    <Text style={styles.programName}>{data.hittingProgramName}</Text>
                  </View>
                  {data.hittingStartDate && (
                    <Text style={styles.hittingMeta}>
                      Started {new Date(data.hittingStartDate).toLocaleDateString()}
                    </Text>
                  )}
                  <View style={styles.programActions}>
                    <TouchableOpacity
                      style={[styles.programActionBtn, { backgroundColor: Colors.primary + '15' }]}
                      onPress={openHittingModal}
                    >
                      <Text style={[styles.programActionText, { color: Colors.primary }]}>Reassign</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity style={styles.ctaBtn} onPress={openHittingModal}>
                  <Ionicons name="baseball-outline" size={18} color="#fff" />
                  <Text style={styles.ctaBtnText}>Assign Hitting Program</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* S&C Profile */}
            {data.scExperience && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>S&C PROFILE</Text>
                <View style={styles.scRow}>
                  <Text style={styles.scLabel}>Experience</Text>
                  <Text style={styles.scValue}>{data.scExperience}</Text>
                </View>
                {data.scEquipment && (
                  <View style={styles.scRow}>
                    <Text style={styles.scLabel}>Equipment</Text>
                    <Text style={styles.scValue}>{data.scEquipment}</Text>
                  </View>
                )}
                {data.scTimeline && (
                  <View style={styles.scRow}>
                    <Text style={styles.scLabel}>Timeline</Text>
                    <Text style={styles.scValue}>{data.scTimeline}</Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {/* ── NOTES TAB ── */}
        {activeTab === 'notes' && (
          <>
            {/* Session Focus */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>NEXT SESSION FOCUS</Text>
              <TextInput
                style={styles.focusInput}
                value={sessionFocus}
                onChangeText={saveFocus}
                placeholder="What should this athlete focus on next?"
                placeholderTextColor={Colors.textMuted}
                multiline
              />
            </View>

            {/* Add Note */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>ADD NOTE</Text>
              <TextInput
                style={styles.noteInput}
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Write a coaching note..."
                placeholderTextColor={Colors.textMuted}
                multiline
              />
              <TouchableOpacity
                style={[styles.ctaBtn, !newNote.trim() && { opacity: 0.5 }]}
                onPress={saveNote}
                disabled={!newNote.trim()}
              >
                <Text style={styles.ctaBtnText}>Save Note</Text>
              </TouchableOpacity>
            </View>

            {/* Notes List */}
            {notes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No notes yet</Text>
                <Text style={styles.emptyDesc}>Your coaching notes for this athlete will appear here.</Text>
              </View>
            ) : (
              notes.map((n) => (
                <View key={n.id} style={styles.noteCard}>
                  <Text style={styles.noteText}>{n.text}</Text>
                  <Text style={styles.noteDate}>{new Date(n.createdAt).toLocaleDateString()}</Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Hitting Program Assignment Modal */}
      <Modal
        visible={hittingModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setHittingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Hitting Program</Text>
              <TouchableOpacity onPress={() => setHittingModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {hittingProgLoading ? (
              <View style={styles.modalLoader}>
                <ActivityIndicator color={Colors.primary} />
              </View>
            ) : hittingPrograms.length === 0 ? (
              <View style={styles.modalEmpty}>
                <Ionicons name="baseball-outline" size={36} color={Colors.textMuted} />
                <Text style={styles.modalEmptyText}>No hitting programs found.</Text>
                <Text style={styles.modalEmptySubText}>
                  Create a hitting program in the Coach section first.
                </Text>
              </View>
            ) : (
              <FlatList
                data={hittingPrograms}
                keyExtractor={(p) => p.id}
                contentContainerStyle={styles.modalList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalProgramRow}
                    onPress={() => handleAssignHitting(item.id, item.title)}
                    disabled={assigning}
                    activeOpacity={0.75}
                  >
                    <View style={styles.modalProgramIcon}>
                      <Ionicons name="baseball-outline" size={18} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalProgramTitle}>{item.title}</Text>
                      {item.duration_weeks && (
                        <Text style={styles.modalProgramMeta}>{item.duration_weeks} weeks</Text>
                      )}
                      {item.description && (
                        <Text style={styles.modalProgramDesc} numberOfLines={2}>{item.description}</Text>
                      )}
                    </View>
                    {assigning ? (
                      <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: 2 },
  headerLabel: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Profile bar */
  profileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#3b82f6' },
  profileMeta: { flexDirection: 'row', gap: 10 },
  profileMetaText: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  tierText: { fontSize: 11, fontWeight: '800', color: Colors.primary, marginTop: 2 },

  /* Tab bar */
  tabRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary + '12',
    borderColor: Colors.primary + '40',
  },
  tabText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  tabTextActive: { color: Colors.primary },

  /* Content */
  content: { padding: 16, gap: 12, paddingBottom: 48 },

  /* Shared card */
  card: {
    padding: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    gap: 10,
  },
  cardLabel: { fontSize: 10, fontWeight: '900', color: Colors.textMuted, letterSpacing: 1.5 },

  /* Empty state */
  emptyState: { alignItems: 'center', gap: 8, paddingVertical: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

  /* CTA button */
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  /* Activity dots */
  dotsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  dotCol: { alignItems: 'center', gap: 6 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.border },
  dotActive: { backgroundColor: '#22c55e' },
  dotLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },

  /* Quiz cards */
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderRadius: 12,
  },
  quizIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quizLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1.5 },
  quizValue: { fontSize: 16, fontWeight: '900', marginTop: 2 },

  /* List rows (workouts) */
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  listTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  listMeta: { fontSize: 11, color: Colors.textMuted },

  /* Journals */
  journalItem: { gap: 4 },
  journalText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  journalDate: { fontSize: 10, color: Colors.textMuted },

  /* Actions row */
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionCard: { flex: 1, alignItems: 'center', gap: 6, padding: 14, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: 12 },
  removeCard: { borderColor: '#ef444430' },
  actionLabel: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary },

  /* Video cards */
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  videoThumb: {
    width: 56,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: { flex: 1 },
  videoNotes: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  videoDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  reviewBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  reviewedBadge: { backgroundColor: '#22c55e20' },
  needsReviewBadge: { backgroundColor: '#ef444420' },
  reviewBadgeText: { fontSize: 9, fontWeight: '800' },
  reviewedText: { color: '#22c55e' },
  needsReviewText: { color: '#ef4444' },

  /* Program */
  programRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  programName: { flex: 1, fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  programActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  programActionBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#3b82f615', borderRadius: 8 },
  programActionText: { fontSize: 12, fontWeight: '700', color: '#3b82f6' },

  /* S&C Profile */
  scRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  scValue: { fontSize: 12, fontWeight: '800', color: Colors.textPrimary, textTransform: 'capitalize' },

  /* Notes */
  focusInput: {
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
  noteInput: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noteCard: {
    padding: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    gap: 6,
  },
  noteText: { fontSize: 13, color: Colors.textPrimary, lineHeight: 19 },
  noteDate: { fontSize: 10, color: Colors.textMuted },

  /* Hitting program meta */
  hittingMeta: { fontSize: 12, color: Colors.textMuted, marginTop: -4 },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: 17, fontWeight: '900', color: Colors.textPrimary },
  modalLoader: { alignItems: 'center', padding: 40 },
  modalEmpty: { alignItems: 'center', padding: 40, gap: 10 },
  modalEmptyText: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  modalEmptySubText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  modalList: { paddingHorizontal: 16, paddingTop: 10, gap: 8 },
  modalProgramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  modalProgramIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  modalProgramTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  modalProgramMeta: { fontSize: 11, color: Colors.primary, fontWeight: '700', marginTop: 1 },
  modalProgramDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginTop: 2 },
});

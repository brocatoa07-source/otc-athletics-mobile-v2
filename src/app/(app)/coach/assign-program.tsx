import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import type { ProgramType } from '@/types/database';

const TYPE_BADGES: Record<ProgramType, { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  hitting: { label: 'Hitting', color: '#22c55e', icon: 'baseball-outline' },
  lifting: { label: 'Lifting', color: '#3b82f6', icon: 'barbell-outline' },
  general: { label: 'General', color: '#8b5cf6', icon: 'clipboard-outline' },
};

interface ProgramOption {
  id: string;
  title: string;
  exerciseCount: number;
  program_type: ProgramType;
}

interface AthleteOption {
  athleteId: string; // athletes.id (table PK)
  userId: string;
  fullName: string;
  currentProgramId?: string;
}

export default function AssignProgramScreen() {
  const { programId: paramProgramId, athleteId: paramAthleteId } = useLocalSearchParams<{
    programId?: string;
    athleteId?: string;
  }>();

  const coachUserId = useAuthStore((s) => s.user?.id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [athletes, setAthletes] = useState<AthleteOption[]>([]);

  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(paramProgramId ?? null);
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<Set<string>>(
    paramAthleteId ? new Set([paramAthleteId]) : new Set(),
  );

  const loadData = useCallback(async () => {
    if (!coachUserId) return;
    setLoading(true);

    // Load programs
    const { data: progs } = await supabase
      .from('programs')
      .select('id, title, program_type, workouts(workout_items(id))')
      .eq('owner_user_id', coachUserId)
      .order('created_at', { ascending: false });

    setPrograms(
      (progs ?? []).map((p: any) => ({
        id: p.id,
        title: p.title,
        exerciseCount: (p.workouts ?? []).reduce(
          (sum: number, w: any) => sum + (w.workout_items ?? []).length, 0,
        ),
        program_type: (p.program_type as ProgramType) ?? 'general',
      })),
    );

    // Load athletes via RPC
    const { data: connected } = await supabase
      .rpc('get_coach_athlete_ids', { coach_user_id: coachUserId });

    if (connected && connected.length > 0) {
      const athleteUserIds = connected.map((r: any) => r.athlete_user_id as string);

      const { data: profiles } = await supabase
        .from('athletes')
        .select('id, user_id')
        .in('user_id', athleteUserIds);

      if (profiles && profiles.length > 0) {
        const userIds = profiles.map((p) => p.user_id);
        const { data: users } = await supabase
          .from('users')
          .select('id, full_name')
          .in('id', userIds);

        const userMap = new Map(users?.map((u) => [u.id, u.full_name]) ?? []);

        const athleteIds = profiles.map((p) => p.id);
        const { data: assignments } = await supabase
          .from('program_assignments')
          .select('athlete_id, program_id')
          .in('athlete_id', athleteIds)
          .eq('active', true);

        const assignMap = new Map(assignments?.map((a) => [a.athlete_id, a.program_id]) ?? []);

        setAthletes(
          profiles.map((p) => ({
            athleteId: p.id,
            userId: p.user_id,
            fullName: userMap.get(p.user_id) ?? 'Unknown',
            currentProgramId: assignMap.get(p.id) ?? undefined,
          })),
        );
      }
    }

    setLoading(false);
  }, [coachUserId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleAthlete = (uId: string) => {
    setSelectedAthleteIds((prev) => {
      const next = new Set(prev);
      if (next.has(uId)) next.delete(uId);
      else next.add(uId);
      return next;
    });
  };

  const handleAssign = async () => {
    if (!selectedProgramId || selectedAthleteIds.size === 0) {
      Alert.alert('Select Required', 'Pick a program and at least one athlete.');
      return;
    }

    setSaving(true);
    try {
      const targetAthletes = athletes.filter((a) => selectedAthleteIds.has(a.userId));
      const selectedProg = programs.find((p) => p.id === selectedProgramId);
      const selectedType = selectedProg?.program_type ?? 'general';
      const sameTypeProgIds = programs.filter((p) => p.program_type === selectedType).map((p) => p.id);

      for (const athlete of targetAthletes) {
        if (sameTypeProgIds.length > 0) {
          const { data: existing } = await supabase
            .from('program_assignments')
            .select('id, program_id')
            .eq('athlete_id', athlete.athleteId)
            .eq('active', true)
            .in('program_id', sameTypeProgIds);

          if (existing && existing.length > 0) {
            await supabase
              .from('program_assignments')
              .update({ active: false, completed_at: new Date().toISOString() })
              .in('id', existing.map((e) => e.id));
          }
        }

        await supabase.from('program_assignments').insert({
          program_id: selectedProgramId,
          athlete_id: athlete.athleteId,
          program_type: selectedType,
          current_week: 1,
          current_day: 1,
          active: true,
        });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Assigned!', `Program assigned to ${targetAthletes.length} athlete(s).`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to assign program.');
    } finally {
      setSaving(false);
    }
  };

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerLabel}>COACH</Text>
          <Text style={styles.headerTitle}>Assign Program</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepLabel}>1. SELECT PROGRAM</Text>
          {programs.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No programs created yet. Create one first.</Text>
            </View>
          ) : (
            programs.map((prog) => {
              const isSelected = selectedProgramId === prog.id;
              const badge = TYPE_BADGES[prog.program_type];
              return (
                <TouchableOpacity
                  key={prog.id}
                  style={[styles.optionCard, isSelected && styles.optionSelected]}
                  onPress={() => setSelectedProgramId(isSelected ? null : prog.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={isSelected ? '#22c55e' : Colors.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <View style={styles.optionTitleRow}>
                      <Text style={[styles.optionTitle, isSelected && { color: '#22c55e' }]}>
                        {prog.title}
                      </Text>
                      <View style={[styles.typeBadge, { backgroundColor: badge.color + '18' }]}>
                        <Ionicons name={badge.icon} size={10} color={badge.color} />
                        <Text style={[styles.typeBadgeText, { color: badge.color }]}>{badge.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.optionMeta}>{prog.exerciseCount} exercises</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          <Text style={[styles.stepLabel, { marginTop: 8 }]}>2. SELECT ATHLETES</Text>
          {athletes.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No athletes connected yet.</Text>
            </View>
          ) : (
            athletes.map((athlete) => {
              const isSelected = selectedAthleteIds.has(athlete.userId);
              const currentProg = athlete.currentProgramId
                ? programs.find((p) => p.id === athlete.currentProgramId)
                : null;

              return (
                <TouchableOpacity
                  key={athlete.userId}
                  style={[styles.optionCard, isSelected && styles.optionSelected]}
                  onPress={() => toggleAthlete(athlete.userId)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={isSelected ? '#22c55e' : Colors.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionTitle, isSelected && { color: '#22c55e' }]}>
                      {athlete.fullName}
                    </Text>
                    {currentProg && (
                      <Text style={styles.optionMeta}>
                        Current: {currentProg.title}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {selectedProgramId && selectedAthleteIds.size > 0 && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>
                Assign "{selectedProgram?.title}" to {selectedAthleteIds.size} athlete
                {selectedAthleteIds.size > 1 ? 's' : ''}
              </Text>
              <TouchableOpacity
                style={[styles.assignBtn, saving && { opacity: 0.6 }]}
                onPress={handleAssign}
                disabled={saving}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.assignBtnText}>{saving ? 'Assigning...' : 'Assign Program'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
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
  content: { padding: 16, gap: 10, paddingBottom: 48 },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stepLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  emptyCard: {
    padding: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  emptyText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  optionSelected: { borderColor: '#22c55e40', backgroundColor: '#22c55e08' },
  optionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: { fontSize: 9, fontWeight: '800' },
  optionMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  summaryCard: {
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: '#22c55e40',
    borderRadius: 14,
    marginTop: 8,
  },
  summaryText: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  assignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  assignBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

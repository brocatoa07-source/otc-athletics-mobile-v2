import { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import {
  loadGeneratedProgram,
  loadStrengthProgress,
  saveStrengthProgress,
  getNextWorkout,
  getWorkoutKey,
  type OtcsGeneratedProgram,
  type OtcsGeneratedDay,
  type StrengthProgress,
} from '@/data/strength-program-engine';
import { OTCS_PHASE_META, OTCS_ALL_BLOCKS, type OtcsBlockKey } from '@/data/otcs-types';

const ACCENT = '#1DB954';

/** Block color/icon lookup from metadata */
function getBlockMeta(key: OtcsBlockKey) {
  return OTCS_ALL_BLOCKS.find((b) => b.key === key) ?? { color: colors.textMuted, icon: 'barbell-outline', label: key };
}

export default function WorkoutScreen() {
  const { hasFullLifting, isCoach } = useTier();
  const params = useLocalSearchParams<{ month?: string; week?: string; day?: string }>();
  const [program, setProgram] = useState<OtcsGeneratedProgram | null>(null);

  // Single/Walk tier guard
  useEffect(() => {
    if (!hasFullLifting && !isCoach) {
      router.replace('/(app)/training/sc' as any);
    }
  }, [hasFullLifting, isCoach]);
  const [progress, setProgress] = useState<StrengthProgress | null>(null);
  const [workout, setWorkout] = useState<OtcsGeneratedDay | null>(null);
  const [monthNum, setMonthNum] = useState(1);
  const [weekNum, setWeekNum] = useState(1);
  const [dayNum, setDayNum] = useState(1);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [workoutComplete, setWorkoutComplete] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [prog, prog2] = await Promise.all([loadGeneratedProgram(), loadStrengthProgress()]);
        if (cancelled || !prog || !prog2) return;
        setProgram(prog);
        setProgress(prog2);

        if (params.month && params.week && params.day) {
          const m = parseInt(params.month, 10);
          const w = parseInt(params.week, 10);
          const d = parseInt(params.day, 10);
          setMonthNum(m);
          setWeekNum(w);
          setDayNum(d);
          const monthData = prog.months[m - 1];
          const weekData = monthData?.weeks[w - 1];
          const wo = weekData?.days.find((x) => x.dayNumber === d) ?? weekData?.days[0] ?? null;
          setWorkout(wo);
          const key = getWorkoutKey(m, w, d);
          setWorkoutComplete(!!prog2.completedWorkouts[key]);
        } else {
          const next = getNextWorkout(prog, prog2);
          if (next) {
            setMonthNum(next.month);
            setWeekNum(next.week);
            setDayNum(next.day);
            setWorkout(next.workout);
            setWorkoutComplete(false);
          }
        }
      })();
      return () => { cancelled = true; };
    }, [params.month, params.week, params.day]),
  );

  function toggleExercise(id: string) {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function markWorkoutDone() {
    if (!progress || !program) return;

    const key = getWorkoutKey(monthNum, weekNum, dayNum);
    const updated: StrengthProgress = {
      ...progress,
      completedWorkouts: { ...progress.completedWorkouts, [key]: true },
    };

    const monthData = program.months[monthNum - 1];
    const weekData = monthData?.weeks[weekNum - 1];
    const allDaysInWeek = weekData?.days.length ?? 0;
    const daysCompletedInWeek = weekData?.days.filter(
      (d) => updated.completedWorkouts[getWorkoutKey(monthNum, weekNum, d.dayNumber)]
    ).length ?? 0;

    if (daysCompletedInWeek >= allDaysInWeek) {
      if (weekNum < 4) {
        updated.currentWeek = weekNum + 1;
      } else if (monthNum < 6) {
        updated.currentMonth = monthNum + 1;
        updated.currentWeek = 1;
      }
    }

    await saveStrengthProgress(updated);
    setProgress(updated);
    setWorkoutComplete(true);
  }

  if (!program || !workout) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>WORKOUT</Text>
            <Text style={styles.headerTitle}>Loading...</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Ionicons name="barbell-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Workout Available</Text>
          <Text style={styles.emptySub}>Complete your strength profile to generate workouts.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const monthData = program.months[monthNum - 1];
  const weekData = monthData?.weeks[weekNum - 1];
  const phaseMeta = monthData ? OTCS_PHASE_META[monthData.phase] : OTCS_PHASE_META.foundation;
  const totalExercises = workout.blocks.reduce((sum, b) => sum + b.exercises.length, 0);
  const completedCount = completedExercises.size;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: phaseMeta.color }]}>
            MONTH {monthNum} · WEEK {weekNum}
          </Text>
          <Text style={styles.headerTitle}>{workout.label}</Text>
        </View>
        {!workoutComplete && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>
              {completedCount}/{totalExercises}
            </Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Phase + week info */}
        <View style={styles.infoRow}>
          <View style={[styles.phasePill, { backgroundColor: phaseMeta.color + '15' }]}>
            <Text style={[styles.phasePillText, { color: phaseMeta.color }]}>
              {phaseMeta.label} Phase
            </Text>
          </View>
          {weekData && (
            <View style={[styles.phasePill, { backgroundColor: workout.accent + '15' }]}>
              <Text style={[styles.phasePillText, { color: workout.accent }]}>
                {weekData.weekLabel}
              </Text>
            </View>
          )}
          <View style={[styles.phasePill, { backgroundColor: workout.accent + '15' }]}>
            <Text style={[styles.phasePillText, { color: workout.accent }]}>
              {workout.type === 'sprint' ? 'Sprint Day' : 'Lift Day'}
            </Text>
          </View>
        </View>

        {/* Completed banner */}
        {workoutComplete && (
          <View style={styles.completedBanner}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.completedTitle}>Workout Complete</Text>
              <Text style={styles.completedSub}>Great work. Recovery starts now.</Text>
            </View>
          </View>
        )}

        {/* Exercise blocks */}
        {workout.blocks.map((block) => {
          const meta = getBlockMeta(block.key);
          return (
            <View key={block.key} style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name={(meta as any).icon ?? 'barbell-outline'}
                  size={14}
                  color={(meta as any).color ?? colors.textMuted}
                />
                <Text style={[styles.sectionLabel, { color: (meta as any).color ?? colors.textMuted }]}>
                  {block.label.toUpperCase()}
                </Text>
              </View>

              {block.exercises.map((ex, exIdx) => {
                const exId = `${block.key}-${exIdx}`;
                const isDone = completedExercises.has(exId);
                return (
                  <TouchableOpacity
                    key={exId}
                    style={[styles.exerciseCard, isDone && styles.exerciseCardDone]}
                    onPress={() => toggleExercise(exId)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      isDone && { backgroundColor: ACCENT, borderColor: ACCENT },
                    ]}>
                      {isDone && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.exerciseName, isDone && styles.exerciseNameDone]}>
                        {ex.name}
                      </Text>
                      <Text style={styles.exerciseSets}>{ex.sets}</Text>
                      <Text style={styles.exerciseCue}>{ex.cue}</Text>
                      {ex.modNote && (
                        <Text style={styles.modNote}>{ex.modNote}</Text>
                      )}
                    </View>
                    {ex.isModified && (
                      <View style={[styles.modifiedBadge, {
                        backgroundColor: ex.modifiedBy === 'position' ? '#3b82f6' + '15' : '#f59e0b' + '15',
                      }]}>
                        <Ionicons
                          name={ex.modifiedBy === 'position' ? 'location' : 'fitness'}
                          size={10}
                          color={ex.modifiedBy === 'position' ? '#3b82f6' : '#f59e0b'}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}

        {/* Finish button */}
        {!workoutComplete && (
          <TouchableOpacity
            style={[styles.finishBtn, completedCount < totalExercises && { opacity: 0.5 }]}
            onPress={markWorkoutDone}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.finishBtnText}>Complete Workout</Text>
          </TouchableOpacity>
        )}

        {workoutComplete && (
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.doneBtnText}>Back to Vault</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  emptySub: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, textAlign: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  progressBadge: {
    backgroundColor: ACCENT + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  progressBadgeText: { fontSize: 12, fontWeight: '800', color: ACCENT },

  content: { padding: 16, paddingBottom: 60, gap: 12 },

  infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  phasePill: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  phasePillText: { fontSize: 11, fontWeight: '800' },

  completedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.success + '10', borderWidth: 1, borderColor: colors.success + '30',
    borderRadius: radius.md, padding: 14,
  },
  checkCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center',
  },
  completedTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  completedSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  sectionBlock: { gap: 8 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4,
  },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },

  exerciseCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  exerciseCardDone: { opacity: 0.6 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  exerciseName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  exerciseNameDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  exerciseSets: { fontSize: 13, fontWeight: '700', color: ACCENT, marginTop: 2 },
  exerciseCue: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic', marginTop: 2 },
  modNote: { fontSize: 11, color: '#f59e0b', marginTop: 3 },
  modifiedBadge: {
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },

  finishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: ACCENT, paddingVertical: 16, borderRadius: radius.md, marginTop: 8,
  },
  finishBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },

  doneBtn: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
  },
  doneBtnText: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
});

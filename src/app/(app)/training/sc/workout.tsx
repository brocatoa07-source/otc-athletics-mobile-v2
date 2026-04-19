import { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import {
  loadValidatedProgram,
  loadStrengthProgress,
  saveStrengthProgress,
  getNextWorkout,
  getWorkoutKey,
  type OtcsGeneratedProgram,
  type OtcsGeneratedDay,
  type StrengthProgress,
} from '@/data/strength-program-engine';
import { OTCS_PHASE_META, OTCS_ALL_BLOCKS, type OtcsBlockKey } from '@/data/otcs-types';
import { saveSessionLog } from '@/features/strength/services/feedbackLoop';
import {
  saveExerciseLog, getLastExerciseLog, getTodayExerciseLog,
  parseSetsReps, formatLastWeight,
  type SetLog,
} from '@/features/strength/services/exerciseLog';

const ACCENT = '#1DB954';

const RPE_OPTIONS = [
  { value: 1, label: 'Easy', desc: 'Could do much more', color: '#22c55e' },
  { value: 2, label: 'Moderate', desc: 'Comfortable effort', color: '#84cc16' },
  { value: 3, label: 'Hard', desc: 'Challenging but doable', color: '#f59e0b' },
  { value: 4, label: 'Very Hard', desc: 'Near limit', color: '#f97316' },
  { value: 5, label: 'Maximal', desc: 'Nothing left', color: '#ef4444' },
];

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
  const [showRPE, setShowRPE] = useState(false);
  const [selectedRPE, setSelectedRPE] = useState<number | null>(null);
  const [hasPain, setHasPain] = useState<boolean | null>(null);
  /** Which exercise is expanded for weight logging */
  const [loggingExId, setLoggingExId] = useState<string | null>(null);
  /** Weight inputs keyed by exId → set index → weight string */
  const [weightInputs, setWeightInputs] = useState<Record<string, Record<number, string>>>({});
  /** Notes per exercise */
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  /** Previous weight display keyed by exercise name */
  const [lastWeights, setLastWeights] = useState<Record<string, string>>({});
  /** Saved indicator keyed by exId */
  const [savedExercises, setSavedExercises] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [prog, prog2] = await Promise.all([loadValidatedProgram(), loadStrengthProgress()]);
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
            setWorkoutComplete(!!next.alreadyDone);
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

  function handleFinishPress() {
    // Show RPE + pain screen before saving
    setShowRPE(true);
  }

  async function submitWorkoutWithFeedback() {
    if (!progress || !program || selectedRPE === null || hasPain === null) return;

    const today = new Date().toISOString().slice(0, 10);
    const key = getWorkoutKey(monthNum, weekNum, dayNum);
    const updated: StrengthProgress = {
      ...progress,
      completedWorkouts: { ...progress.completedWorkouts, [key]: true },
      lastCompletedDate: today,
    };

    // Check if all days in this week are done — advance week/month for TOMORROW's session
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

    // Mark today's session complete for Daily Standards tracking
    const now = new Date().toISOString();
    try {
      const raw = await AsyncStorage.getItem('otc:workout-completions');
      const map = raw ? JSON.parse(raw) : {};
      map[today] = now;
      await AsyncStorage.setItem('otc:workout-completions', JSON.stringify(map));
    } catch {}

    // Save session log for feedback loop (RPE + pain + compliance tracking)
    await saveSessionLog({
      date: today,
      workoutKey: key,
      rpe: selectedRPE,
      pain: hasPain,
      completedAt: now,
    });

    setProgress(updated);
    setShowRPE(false);
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
            <Text style={styles.headerTitle}>No Workout</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Ionicons name="barbell-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Workout Available</Text>
          <Text style={styles.emptySub}>
            Your program may need to be generated or updated. Head to My Path to get started.
          </Text>
          <TouchableOpacity
            style={[styles.emptyBtn]}
            onPress={() => router.replace('/(app)/training/sc/my-path' as any)}
          >
            <Text style={styles.emptyBtnText}>Go to My Path</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
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
                const isLogging = loggingExId === exId;
                const isSaved = savedExercises.has(exId);
                const lastW = lastWeights[ex.name];
                const parsed = parseSetsReps(ex.sets);

                return (
                  <View key={exId}>
                    <TouchableOpacity
                      style={[styles.exerciseCard, isDone && styles.exerciseCardDone]}
                      onPress={() => {
                        toggleExercise(exId);
                        setLoggingExId(isLogging ? null : exId);
                        // Load previous weight on expand
                        if (!isLogging && !lastWeights[ex.name]) {
                          getLastExerciseLog(ex.name).then(prev => {
                            if (prev) setLastWeights(p => ({ ...p, [ex.name]: formatLastWeight(prev) }));
                          });
                          // Load today's saved data if exists
                          getTodayExerciseLog(ex.name).then(today => {
                            if (today) {
                              const wMap: Record<number, string> = {};
                              today.sets.forEach(s => { wMap[s.set] = String(s.weight); });
                              setWeightInputs(p => ({ ...p, [exId]: wMap }));
                              if (today.notes) setNoteInputs(p => ({ ...p, [exId]: today.notes }));
                              setSavedExercises(p => new Set(p).add(exId));
                            }
                          });
                        }
                      }}
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
                        {lastW && <Text style={styles.lastWeight}>{lastW}</Text>}
                        <Text style={styles.exerciseCue}>{ex.cue}</Text>
                      </View>
                      {isSaved && <Ionicons name="checkmark-circle" size={16} color="#22c55e" />}
                      <Ionicons name={isLogging ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
                    </TouchableOpacity>

                    {/* Weight Logging Panel */}
                    {isLogging && (
                      <View style={styles.logPanel}>
                        {Array.from({ length: parsed.sets }, (_, i) => i + 1).map(setNum => (
                          <View key={setNum} style={styles.setRow}>
                            <Text style={styles.setLabel}>Set {setNum}</Text>
                            <TextInput
                              style={styles.weightInput}
                              placeholder="lbs"
                              placeholderTextColor={colors.textMuted}
                              keyboardType="numeric"
                              value={weightInputs[exId]?.[setNum] ?? ''}
                              onChangeText={(val) => {
                                setWeightInputs(prev => ({
                                  ...prev,
                                  [exId]: { ...(prev[exId] ?? {}), [setNum]: val },
                                }));
                              }}
                            />
                            <Text style={styles.repsLabel}>× {parsed.reps}</Text>
                          </View>
                        ))}
                        <TextInput
                          style={styles.notesInput}
                          placeholder="Notes (optional)"
                          placeholderTextColor={colors.textMuted}
                          value={noteInputs[exId] ?? ''}
                          onChangeText={(val) => setNoteInputs(prev => ({ ...prev, [exId]: val }))}
                        />
                        <TouchableOpacity
                          style={styles.saveLogBtn}
                          onPress={async () => {
                            const sets: SetLog[] = Array.from({ length: parsed.sets }, (_, i) => ({
                              set: i + 1,
                              weight: parseFloat(weightInputs[exId]?.[i + 1] ?? '0') || 0,
                              reps: parsed.reps,
                            })).filter(s => s.weight > 0);
                            if (sets.length === 0) return;
                            await saveExerciseLog({
                              exerciseName: ex.name,
                              date: new Date().toISOString().slice(0, 10),
                              sets,
                              notes: noteInputs[exId] ?? '',
                            });
                            setSavedExercises(prev => new Set(prev).add(exId));
                          }}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="save-outline" size={14} color="#fff" />
                          <Text style={styles.saveLogBtnText}>
                            {isSaved ? 'Update Log' : 'Save Log'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Finish button */}
        {/* RPE + Pain Post-Workout Flow */}
        {showRPE && !workoutComplete && (
          <View style={styles.rpeCard}>
            <Text style={styles.rpeTitle}>How hard was that session?</Text>
            <View style={styles.rpeRow}>
              {RPE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.rpeChip,
                    { borderColor: opt.color + '40' },
                    selectedRPE === opt.value && { backgroundColor: opt.color + '20', borderColor: opt.color },
                  ]}
                  onPress={() => setSelectedRPE(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.rpeChipNum, { color: opt.color }]}>{opt.value}</Text>
                  <Text style={styles.rpeChipLabel}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.rpeTitle, { marginTop: 16 }]}>Any pain during the session?</Text>
            <View style={styles.painRow}>
              <TouchableOpacity
                style={[styles.painBtn, hasPain === false && { backgroundColor: '#22c55e20', borderColor: '#22c55e' }]}
                onPress={() => setHasPain(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle" size={18} color={hasPain === false ? '#22c55e' : colors.textMuted} />
                <Text style={[styles.painBtnText, hasPain === false && { color: '#22c55e' }]}>No Pain</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.painBtn, hasPain === true && { backgroundColor: '#ef444420', borderColor: '#ef4444' }]}
                onPress={() => setHasPain(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="alert-circle" size={18} color={hasPain === true ? '#ef4444' : colors.textMuted} />
                <Text style={[styles.painBtnText, hasPain === true && { color: '#ef4444' }]}>Yes</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.finishBtn, (selectedRPE === null || hasPain === null) && { opacity: 0.4 }]}
              onPress={submitWorkoutWithFeedback}
              disabled={selectedRPE === null || hasPain === null}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.finishBtnText}>Submit & Complete</Text>
            </TouchableOpacity>
          </View>
        )}

        {!workoutComplete && !showRPE && (
          <TouchableOpacity
            style={[styles.finishBtn, completedCount < totalExercises && { opacity: 0.5 }]}
            onPress={handleFinishPress}
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
  emptyBtn: {
    flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const,
    gap: 8, backgroundColor: '#1DB954', paddingVertical: 14, paddingHorizontal: 24, borderRadius: radius.md, marginTop: 4,
  },
  emptyBtnText: { fontSize: 15, fontWeight: '800' as const, color: '#fff' },

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

  /* ── RPE + Pain Post-Workout ────────── */
  rpeCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 8,
  },
  rpeTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  rpeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  rpeChip: {
    flex: 1, minWidth: 56, alignItems: 'center', paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    backgroundColor: colors.bg,
  },
  rpeChipNum: { fontSize: 18, fontWeight: '900' },
  rpeChipLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted, marginTop: 2 },
  painRow: { flexDirection: 'row', gap: 10 },
  painBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, backgroundColor: colors.bg,
  },
  painBtnText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },

  /* ── Weight Logging ────────── */
  lastWeight: { fontSize: 10, fontWeight: '700', color: '#22c55e', marginTop: 1 },
  logPanel: {
    marginLeft: 36, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: colors.border,
    gap: 8, paddingVertical: 8, marginBottom: 4,
  },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  setLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, width: 40 },
  weightInput: {
    flex: 1, height: 36, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    backgroundColor: colors.bg, paddingHorizontal: 10, fontSize: 14, fontWeight: '700',
    color: colors.textPrimary,
  },
  repsLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted, width: 36 },
  notesInput: {
    height: 36, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    backgroundColor: colors.bg, paddingHorizontal: 10, fontSize: 12,
    color: colors.textPrimary,
  },
  saveLogBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 8, borderRadius: radius.sm, backgroundColor: '#22c55e',
  },
  saveLogBtnText: { fontSize: 12, fontWeight: '800', color: '#fff' },
});

import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert,
  Modal, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { LIFTING_SECTIONS, SECTION_EXERCISES, type SectionMeta } from '@/data/lifting-sections';
import type { LiftingSection } from '@/types/database';

const ACCENT = '#3b82f6';

/* ── Types ── */
interface LiftExercise {
  tempId: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
  rest: string;
  notes: string;
}

interface DaySectionData {
  exercises: LiftExercise[];
  collapsed: boolean;
}

type DayData = Record<LiftingSection, DaySectionData>;

let tempIdCounter = 0;
function nextTempId() { return `lift-${++tempIdCounter}`; }

function emptySection(): DaySectionData {
  return { exercises: [], collapsed: false };
}

function emptyDay(): DayData {
  return {
    mobility: emptySection(),
    strength: emptySection(),
    explosive: emptySection(),
    conditioning: emptySection(),
    cooldown: emptySection(),
  };
}

export default function LiftingProgramScreen() {
  const { programId } = useLocalSearchParams<{ programId?: string }>();
  const userId = useAuthStore((s) => s.user?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('');
  const [totalDays, setTotalDays] = useState(4);
  const [activeDay, setActiveDay] = useState(1);
  const [days, setDays] = useState<Record<number, DayData>>({ 1: emptyDay(), 2: emptyDay(), 3: emptyDay(), 4: emptyDay() });
  const [saving, setSaving] = useState(false);

  // Pool modal
  const [poolOpen, setPoolOpen] = useState(false);
  const [poolSection, setPoolSection] = useState<LiftingSection>('strength');
  const [poolSearch, setPoolSearch] = useState('');

  // Ensure days object matches totalDays
  useEffect(() => {
    setDays((prev) => {
      const next = { ...prev };
      for (let d = 1; d <= totalDays; d++) {
        if (!next[d]) next[d] = emptyDay();
      }
      // remove excess
      for (const k of Object.keys(next)) {
        if (Number(k) > totalDays) delete next[Number(k)];
      }
      return next;
    });
    if (activeDay > totalDays) setActiveDay(totalDays);
  }, [totalDays]);

  // Load existing program for editing
  useEffect(() => {
    if (!programId) return;
    (async () => {
      const { data: prog } = await supabase
        .from('programs')
        .select('*, workouts(*, workout_items(*, workout_sets(*)))')
        .eq('id', programId)
        .single();

      if (prog) {
        setTitle(prog.title ?? '');
        setDescription(prog.description ?? '');
        setDurationWeeks(prog.duration_weeks?.toString() ?? '');
        const numDays = prog.total_days ?? 4;
        setTotalDays(numDays);

        const newDays: Record<number, DayData> = {};
        for (let d = 1; d <= numDays; d++) newDays[d] = emptyDay();

        // Map workouts (sorted by order_index) to days
        const workouts = ((prog.workouts ?? []) as any[]).sort((a: any, b: any) => a.order_index - b.order_index);
        for (let wi = 0; wi < workouts.length; wi++) {
          const wo = workouts[wi];
          const dayNum = wo.order_index ?? (wi + 1);
          if (!newDays[dayNum]) newDays[dayNum] = emptyDay();

          const items = ((wo.workout_items ?? []) as any[]).sort((a: any, b: any) => a.order_index - b.order_index);
          for (const item of items) {
            const section = (item.category as LiftingSection) ?? 'strength';
            const firstSet = ((item.workout_sets ?? []) as any[])[0];
            if (!newDays[dayNum][section]) newDays[dayNum][section] = emptySection();
            newDays[dayNum][section].exercises.push({
              tempId: nextTempId(),
              name: item.exercise_name_raw,
              sets: firstSet?.reps ? '3' : '3', // default sets
              reps: firstSet?.reps?.toString() ?? '8',
              weight: firstSet?.load?.toString() ?? '',
              rest: firstSet?.rest_sec?.toString() ?? '',
              notes: item.notes ?? '',
            });
          }
        }
        setDays(newDays);
      }
    })();
  }, [programId]);

  const handleSave = async () => {
    if (!userId || !title.trim()) {
      Alert.alert('Missing Info', 'Program title is required.');
      return;
    }

    setSaving(true);
    try {
      let id = programId;

      if (programId) {
        await supabase
          .from('programs')
          .update({
            title: title.trim(),
            description: description.trim() || null,
            duration_weeks: durationWeeks ? parseInt(durationWeeks) : null,
            total_days: totalDays,
            program_type: 'lifting',
          })
          .eq('id', programId);
        // Delete old workouts (cascade deletes items/sets)
        await supabase.from('workouts').delete().eq('program_id', programId);
      } else {
        const { data: newProg } = await supabase
          .from('programs')
          .insert({
            owner_user_id: userId,
            title: title.trim(),
            description: description.trim() || null,
            duration_weeks: durationWeeks ? parseInt(durationWeeks) : null,
            total_days: totalDays,
            program_type: 'lifting',
          })
          .select('id')
          .single();
        if (!newProg) throw new Error('Failed to create program');
        id = newProg.id;
      }

      // Insert workouts and exercises for each day
      for (let d = 1; d <= totalDays; d++) {
        const dayData = days[d];
        if (!dayData) continue;

        // Check if this day has any exercises
        const hasExercises = LIFTING_SECTIONS.some((sec) => dayData[sec.key].exercises.length > 0);
        if (!hasExercises) continue;

        const { data: workout } = await supabase
          .from('workouts')
          .insert({
            program_id: id,
            week_number: 1,
            day_label: `Day ${d}`,
            day_type: 'strength',
            order_index: d,
          })
          .select('id')
          .single();

        if (!workout) continue;

        let orderIdx = 1;
        for (const sec of LIFTING_SECTIONS) {
          const sectionData = dayData[sec.key];
          for (const ex of sectionData.exercises) {
            if (!ex.name.trim()) continue;

            const { data: item } = await supabase
              .from('workout_items')
              .insert({
                workout_id: workout.id,
                exercise_name_raw: ex.name.trim(),
                category: sec.key,
                order_index: orderIdx++,
                notes: ex.notes || null,
                superset_group: null,
              })
              .select('id')
              .single();

            if (item) {
              await supabase.from('workout_sets').insert({
                workout_item_id: item.id,
                set_number: 1,
                reps: ex.reps || '8',
                load: ex.weight || null,
                tempo: null,
                rest_sec: ex.rest ? parseInt(ex.rest) : null,
              });
            }
          }
        }
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save program.');
    } finally {
      setSaving(false);
    }
  };

  const openPool = (section: LiftingSection) => {
    setPoolSection(section);
    setPoolSearch('');
    setPoolOpen(true);
  };

  const addFromPool = (name: string) => {
    setDays((prev) => {
      const dayData = { ...prev[activeDay] };
      const sectionData = { ...dayData[poolSection] };
      sectionData.exercises = [
        ...sectionData.exercises,
        { tempId: nextTempId(), name, sets: '3', reps: '8', weight: '', rest: '', notes: '' },
      ];
      dayData[poolSection] = sectionData;
      return { ...prev, [activeDay]: dayData };
    });
    setPoolOpen(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addCustomExercise = (section: LiftingSection) => {
    setDays((prev) => {
      const dayData = { ...prev[activeDay] };
      const sectionData = { ...dayData[section] };
      sectionData.exercises = [
        ...sectionData.exercises,
        { tempId: nextTempId(), name: '', sets: '3', reps: '8', weight: '', rest: '', notes: '' },
      ];
      dayData[section] = sectionData;
      return { ...prev, [activeDay]: dayData };
    });
  };

  const toggleSection = (section: LiftingSection) => {
    setDays((prev) => {
      const dayData = { ...prev[activeDay] };
      const sectionData = { ...dayData[section] };
      sectionData.collapsed = !sectionData.collapsed;
      dayData[section] = sectionData;
      return { ...prev, [activeDay]: dayData };
    });
  };

  const updateExercise = (section: LiftingSection, tempId: string, field: keyof LiftExercise, value: string) => {
    setDays((prev) => {
      const dayData = { ...prev[activeDay] };
      const sectionData = { ...dayData[section] };
      sectionData.exercises = sectionData.exercises.map((e) =>
        e.tempId === tempId ? { ...e, [field]: value } : e,
      );
      dayData[section] = sectionData;
      return { ...prev, [activeDay]: dayData };
    });
  };

  const removeExercise = (section: LiftingSection, tempId: string) => {
    setDays((prev) => {
      const dayData = { ...prev[activeDay] };
      const sectionData = { ...dayData[section] };
      sectionData.exercises = sectionData.exercises.filter((e) => e.tempId !== tempId);
      dayData[section] = sectionData;
      return { ...prev, [activeDay]: dayData };
    });
  };

  const moveExercise = (section: LiftingSection, tempId: string, dir: -1 | 1) => {
    setDays((prev) => {
      const dayData = { ...prev[activeDay] };
      const sectionData = { ...dayData[section] };
      const idx = sectionData.exercises.findIndex((e) => e.tempId === tempId);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= sectionData.exercises.length) return prev;
      const copy = [...sectionData.exercises];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      sectionData.exercises = copy;
      dayData[section] = sectionData;
      return { ...prev, [activeDay]: dayData };
    });
  };

  const currentDay = days[activeDay] ?? emptyDay();

  const filteredPool = useMemo(() => {
    const pool = SECTION_EXERCISES[poolSection] ?? [];
    if (!poolSearch) return pool;
    const q = poolSearch.toLowerCase();
    return pool.filter((name) => name.toLowerCase().includes(q));
  }, [poolSection, poolSearch]);

  // Total exercise count across all days
  const totalExercises = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= totalDays; d++) {
      const dayData = days[d];
      if (!dayData) continue;
      for (const sec of LIFTING_SECTIONS) {
        count += dayData[sec.key].exercises.length;
      }
    }
    return count;
  }, [days, totalDays]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>LIFTING PROGRAM</Text>
          <Text style={styles.headerTitle}>{programId ? 'Edit Program' : 'New Program'}</Text>
        </View>
        <Text style={styles.exerciseCount}>{totalExercises} exercises</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Program Info */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PROGRAM TITLE *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Off-Season Strength Phase 1"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DESCRIPTION</Text>
            <TextInput
              style={[styles.textInput, { minHeight: 60 }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Optional description..."
              placeholderTextColor={Colors.textMuted}
              multiline
            />
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>WEEKS</Text>
              <TextInput
                style={styles.textInput}
                value={durationWeeks}
                onChangeText={(t) => setDurationWeeks(t.replace(/[^0-9]/g, ''))}
                placeholder="8"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>DAYS PER WEEK</Text>
              <View style={styles.dayPicker}>
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dayPickerBtn, d === totalDays && styles.dayPickerBtnActive]}
                    onPress={() => setTotalDays(d)}
                  >
                    <Text style={[styles.dayPickerText, d === totalDays && styles.dayPickerTextActive]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Day Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabScroll}>
            <View style={styles.dayTabRow}>
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
                const isActive = d === activeDay;
                const dayExCount = LIFTING_SECTIONS.reduce(
                  (sum, sec) => sum + (days[d]?.[sec.key]?.exercises.length ?? 0), 0,
                );
                return (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dayTab, isActive && styles.dayTabActive]}
                    onPress={() => setActiveDay(d)}
                  >
                    <Text style={[styles.dayTabText, isActive && styles.dayTabTextActive]}>
                      Day {d}
                    </Text>
                    {dayExCount > 0 && (
                      <Text style={[styles.dayTabCount, isActive && styles.dayTabCountActive]}>
                        {dayExCount}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Sections for Active Day */}
          {LIFTING_SECTIONS.map((sec) => (
            <SectionBlock
              key={sec.key}
              meta={sec}
              data={currentDay[sec.key]}
              onToggle={() => toggleSection(sec.key)}
              onAddPool={() => openPool(sec.key)}
              onAddCustom={() => addCustomExercise(sec.key)}
              onUpdate={(tempId, field, value) => updateExercise(sec.key, tempId, field, value)}
              onRemove={(tempId) => removeExercise(sec.key, tempId)}
              onMove={(tempId, dir) => moveExercise(sec.key, tempId, dir)}
            />
          ))}

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Lifting Program'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Exercise Pool Modal */}
      <Modal visible={poolOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {LIFTING_SECTIONS.find((s) => s.key === poolSection)?.label ?? 'Exercise'} Pool
              </Text>
              <TouchableOpacity onPress={() => setPoolOpen(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalSearch}
              value={poolSearch}
              onChangeText={setPoolSearch}
              placeholder="Search exercises..."
              placeholderTextColor={Colors.textMuted}
            />

            {/* Section filter pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {LIFTING_SECTIONS.map((sec) => {
                const isActive = poolSection === sec.key;
                return (
                  <TouchableOpacity
                    key={sec.key}
                    style={[styles.filterChip, isActive && { backgroundColor: sec.color, borderColor: sec.color }]}
                    onPress={() => setPoolSection(sec.key)}
                  >
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                      {sec.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <FlatList
              data={filteredPool}
              keyExtractor={(item, i) => `${item}-${i}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.poolItem}
                  onPress={() => addFromPool(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.poolItemName}>{item}</Text>
                  <Ionicons name="add-circle" size={24} color={ACCENT} />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text style={styles.poolEmpty}>No exercises match your search.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ── Section Block Component ── */
function SectionBlock({
  meta,
  data,
  onToggle,
  onAddPool,
  onAddCustom,
  onUpdate,
  onRemove,
  onMove,
}: {
  meta: SectionMeta;
  data: DaySectionData;
  onToggle: () => void;
  onAddPool: () => void;
  onAddCustom: () => void;
  onUpdate: (tempId: string, field: keyof LiftExercise, value: string) => void;
  onRemove: (tempId: string) => void;
  onMove: (tempId: string, dir: -1 | 1) => void;
}) {
  const exCount = data.exercises.length;
  const showWeight = meta.key === 'strength' || meta.key === 'explosive';
  const showRest = meta.key === 'strength' || meta.key === 'conditioning';

  return (
    <View style={[styles.sectionBlock, { borderLeftColor: meta.color }]}>
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={[styles.sectionIcon, { backgroundColor: meta.color + '18' }]}>
          <Ionicons name={meta.icon} size={18} color={meta.color} />
        </View>
        <Text style={[styles.sectionTitle, { color: meta.color }]}>{meta.label}</Text>
        {exCount > 0 && (
          <View style={[styles.sectionBadge, { backgroundColor: meta.color + '18' }]}>
            <Text style={[styles.sectionBadgeText, { color: meta.color }]}>{exCount}</Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
        <Ionicons
          name={data.collapsed ? 'chevron-down' : 'chevron-up'}
          size={18}
          color={Colors.textMuted}
        />
      </TouchableOpacity>

      {!data.collapsed && (
        <View style={styles.sectionBody}>
          {data.exercises.map((ex, idx) => (
            <View key={ex.tempId} style={styles.sectionExCard}>
              <View style={styles.sectionExTop}>
                <Text style={[styles.sectionExNum, { color: meta.color }]}>{idx + 1}</Text>
                <TextInput
                  style={styles.sectionExNameInput}
                  value={ex.name}
                  onChangeText={(t) => onUpdate(ex.tempId, 'name', t)}
                  placeholder="Exercise name"
                  placeholderTextColor={Colors.textMuted}
                />
                <TouchableOpacity onPress={() => onMove(ex.tempId, -1)} style={styles.moveBtn}>
                  <Ionicons name="arrow-up" size={12} color={Colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onMove(ex.tempId, 1)} style={styles.moveBtn}>
                  <Ionicons name="arrow-down" size={12} color={Colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onRemove(ex.tempId)} style={styles.moveBtn}>
                  <Ionicons name="close" size={14} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.sectionExFields}>
                <View style={styles.miniField}>
                  <Text style={styles.miniFieldLabel}>Sets</Text>
                  <TextInput
                    style={styles.miniFieldInput}
                    value={ex.sets}
                    onChangeText={(t) => onUpdate(ex.tempId, 'sets', t)}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.miniField}>
                  <Text style={styles.miniFieldLabel}>Reps</Text>
                  <TextInput
                    style={styles.miniFieldInput}
                    value={ex.reps}
                    onChangeText={(t) => onUpdate(ex.tempId, 'reps', t)}
                    keyboardType="number-pad"
                  />
                </View>
                {showWeight && (
                  <View style={styles.miniField}>
                    <Text style={styles.miniFieldLabel}>Weight</Text>
                    <TextInput
                      style={styles.miniFieldInput}
                      value={ex.weight}
                      onChangeText={(t) => onUpdate(ex.tempId, 'weight', t)}
                      placeholder="lbs"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="number-pad"
                    />
                  </View>
                )}
                {showRest && (
                  <View style={styles.miniField}>
                    <Text style={styles.miniFieldLabel}>Rest</Text>
                    <TextInput
                      style={styles.miniFieldInput}
                      value={ex.rest}
                      onChangeText={(t) => onUpdate(ex.tempId, 'rest', t)}
                      placeholder="60s"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                )}
              </View>

              <TextInput
                style={styles.sectionExNotes}
                value={ex.notes}
                onChangeText={(t) => onUpdate(ex.tempId, 'notes', t)}
                placeholder="Notes (optional)"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          ))}

          <View style={styles.sectionAddRow}>
            <TouchableOpacity style={[styles.sectionAddBtn, { borderColor: meta.color + '40' }]} onPress={onAddPool}>
              <Ionicons name="search-outline" size={14} color={meta.color} />
              <Text style={[styles.sectionAddText, { color: meta.color }]}>From Pool</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sectionAddBtn, { borderColor: meta.color + '40' }]} onPress={onAddCustom}>
              <Ionicons name="add" size={14} color={meta.color} />
              <Text style={[styles.sectionAddText, { color: meta.color }]}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
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
  headerLabel: { fontSize: 10, fontWeight: '800', color: ACCENT, letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  exerciseCount: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  content: { padding: 16, gap: 12, paddingBottom: 48 },

  fieldGroup: { gap: 4 },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1.5 },
  textInput: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  metaRow: { flexDirection: 'row', gap: 12 },

  dayPicker: { flexDirection: 'row', gap: 4 },
  dayPickerBtn: {
    width: 32,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayPickerBtnActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  dayPickerText: { fontSize: 13, fontWeight: '800', color: Colors.textSecondary },
  dayPickerTextActive: { color: '#fff' },

  dayTabScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  dayTabRow: { flexDirection: 'row', gap: 6, paddingVertical: 4 },
  dayTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dayTabActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  dayTabText: { fontSize: 14, fontWeight: '800', color: Colors.textSecondary },
  dayTabTextActive: { color: '#fff' },
  dayTabCount: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  dayTabCountActive: { color: 'rgba(255,255,255,0.8)' },

  sectionBlock: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderRadius: 14,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 14, fontWeight: '900' },
  sectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionBadgeText: { fontSize: 11, fontWeight: '800' },
  sectionBody: { padding: 10, paddingTop: 0, gap: 8 },

  sectionExCard: {
    backgroundColor: Colors.bg,
    borderRadius: 10,
    padding: 8,
    gap: 6,
  },
  sectionExTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionExNum: { fontSize: 12, fontWeight: '900', width: 18, textAlign: 'center' },
  sectionExNameInput: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  moveBtn: { padding: 4 },
  sectionExFields: { flexDirection: 'row', gap: 6, paddingLeft: 18 },
  miniField: { flex: 1, gap: 2 },
  miniFieldLabel: { fontSize: 8, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.8 },
  miniFieldInput: {
    backgroundColor: Colors.bgCard,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  sectionExNotes: {
    backgroundColor: Colors.bgCard,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 18,
  },

  sectionAddRow: { flexDirection: 'row', gap: 8, paddingLeft: 18 },
  sectionAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  sectionAddText: { fontSize: 11, fontWeight: '700' },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ACCENT,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  saveBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  modalSearch: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  filterRow: { marginBottom: 10, maxHeight: 36 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginRight: 6,
  },
  filterChipText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  filterChipTextActive: { color: '#fff' },

  poolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  poolItemName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  poolEmpty: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
    fontStyle: 'italic',
  },
});

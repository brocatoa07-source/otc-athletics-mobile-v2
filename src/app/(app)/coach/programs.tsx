import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert,
  Modal, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { SESSION_BLOCKS, type BlockKey } from '@/data/session-blocks';
import type { ProgramType } from '@/types/database';

/* ── Exercise Pool (flattened from session-blocks.ts pools) ── */
interface PoolExercise {
  name: string;
  sets: string;
  block: string;
  cue: string;
}

const BLOCK_LABELS: Record<BlockKey, string> = {
  'soft-tissue': 'Soft Tissue',
  'movement-prep': 'Movement Prep',
  'cns-primer': 'CNS Primer',
  'primary-lift': 'Primary Lift',
  'secondary-lift': 'Secondary Lift',
  'accessory': 'Accessory',
  'conditioning': 'Conditioning',
  'cool-down': 'Cool Down',
};

const TYPE_BADGES: Record<ProgramType, { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  hitting: { label: 'Hitting', color: '#22c55e', icon: 'baseball-outline' },
  lifting: { label: 'Lifting', color: '#3b82f6', icon: 'barbell-outline' },
  general: { label: 'General', color: '#8b5cf6', icon: 'clipboard-outline' },
};

const TEMPLATE_PREFIX = '[TEMPLATE] ';

type FilterType = 'all' | ProgramType;

interface ProgramExercise {
  tempId: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  day?: number;
  notes?: string;
}

interface ProgramData {
  id?: string;
  title: string;
  description: string;
  durationWeeks: string;
  exercises: ProgramExercise[];
}

interface SavedProgram {
  id: string;
  title: string;
  description?: string;
  duration_weeks?: number;
  program_type: ProgramType;
  exerciseCount: number;
  assignedCount: number;
  exercises: { id: string; name: string; sets: number; reps: number; weight?: number; day?: number; notes?: string; order: number }[];
}

let tempIdCounter = 0;
function nextTempId() { return `tmp-${++tempIdCounter}`; }

export default function ProgramsScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const [programs, setPrograms] = useState<SavedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');

  /* ── Editor state ── */
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<ProgramData>({
    title: '',
    description: '',
    durationWeeks: '',
    exercises: [],
  });
  const [saving, setSaving] = useState(false);

  /* ── Pool modal ── */
  const [poolOpen, setPoolOpen] = useState(false);
  const [poolBlock, setPoolBlock] = useState<BlockKey>('primary-lift');
  const [poolSearch, setPoolSearch] = useState('');

  /* ── Load programs ── */
  const loadPrograms = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data: progs } = await supabase
        .from('programs')
        .select('id, title, description, duration_weeks, program_type, workouts(id, order_index, week_number, workout_items(id, exercise_name_raw, order_index, notes, category, workout_sets(id, reps, load)))')
        .eq('owner_user_id', userId)
        .order('created_at', { ascending: false });

      // Load assignment counts
      const progIds = (progs ?? []).map((p: any) => p.id);
      let assignmentCounts: Record<string, number> = {};
      if (progIds.length > 0) {
        const { data: assignments } = await supabase
          .from('program_assignments')
          .select('program_id')
          .in('program_id', progIds)
          .eq('active', true);

        if (assignments) {
          for (const a of assignments) {
            assignmentCounts[a.program_id] = (assignmentCounts[a.program_id] || 0) + 1;
          }
        }
      }

      const mapped: SavedProgram[] = (progs ?? []).map((p: any) => {
        const workouts = (p.workouts ?? []) as any[];
        // Flatten all workout_items across all workouts
        const allItems: any[] = [];
        for (const wo of workouts) {
          const items = (wo.workout_items ?? []) as any[];
          for (const item of items) {
            allItems.push({ ...item, _dayNum: wo.week_number ?? (wo.order_index ?? 1) });
          }
        }

        const exercises = allItems
          .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
          .map((item) => {
            const sets = (item.workout_sets ?? []) as any[];
            const firstSet = sets[0];
            return {
              id: item.id,
              name: item.exercise_name_raw ?? '',
              sets: sets.length || 1,
              reps: firstSet?.reps ? parseInt(firstSet.reps, 10) || 0 : 0,
              weight: firstSet?.load ? parseInt(firstSet.load, 10) || undefined : undefined,
              day: item._dayNum,
              notes: item.notes ?? undefined,
              order: item.order_index ?? 0,
            };
          });

        return {
          id: p.id,
          title: p.title ?? '',
          description: p.description ?? undefined,
          duration_weeks: p.duration_weeks ?? undefined,
          program_type: (p.program_type as ProgramType) ?? 'general',
          exerciseCount: allItems.length,
          assignedCount: assignmentCounts[p.id] || 0,
          exercises,
        };
      });

      setPrograms(mapped);
    } catch {
      Alert.alert('Error', 'Failed to load programs.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadPrograms(); }, [loadPrograms]);

  /* ── Filtered programs ── */
  const filteredPrograms = useMemo(() => {
    if (filterType === 'all') return programs;
    return programs.filter((p) => p.program_type === filterType);
  }, [programs, filterType]);

  const templates = useMemo(
    () => filteredPrograms.filter((p) => p.title.startsWith(TEMPLATE_PREFIX)),
    [filteredPrograms],
  );
  const regularPrograms = useMemo(
    () => filteredPrograms.filter((p) => !p.title.startsWith(TEMPLATE_PREFIX)),
    [filteredPrograms],
  );

  /* ── Pool exercises for current block ── */
  const poolExercises = useMemo(() => {
    const block = SESSION_BLOCKS.find((b) => b.key === poolBlock);
    if (!block) return [];
    // We don't have direct access to the pool arrays from session-blocks.ts
    // since they aren't exported. We'll use the block labels as a fallback.
    // The pool modal is used for searching/adding exercises by name.
    return [] as PoolExercise[];
  }, [poolBlock]);

  const filteredPool = useMemo(() => {
    if (!poolSearch) return poolExercises;
    const q = poolSearch.toLowerCase();
    return poolExercises.filter((e) => e.name.toLowerCase().includes(q));
  }, [poolExercises, poolSearch]);

  /* ── Editor helpers ── */
  const startNew = () => {
    setEditData({ title: '', description: '', durationWeeks: '', exercises: [] });
    setEditing(true);
  };

  const startEdit = (prog: SavedProgram) => {
    setEditData({
      id: prog.id,
      title: prog.title,
      description: prog.description ?? '',
      durationWeeks: prog.duration_weeks?.toString() ?? '',
      exercises: prog.exercises.map((e) => ({
        tempId: nextTempId(),
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
        day: e.day,
        notes: e.notes,
      })),
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const addExercise = (name = '', block = '') => {
    setEditData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { tempId: nextTempId(), name, sets: 3, reps: 8, day: 1, notes: block ? `[${BLOCK_LABELS[block as BlockKey] ?? block}]` : undefined },
      ],
    }));
  };

  const updateExercise = (tempId: string, field: keyof ProgramExercise, value: any) => {
    setEditData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((e) =>
        e.tempId === tempId ? { ...e, [field]: value } : e,
      ),
    }));
  };

  const removeExercise = (tempId: string) => {
    setEditData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((e) => e.tempId !== tempId),
    }));
  };

  const moveExercise = (tempId: string, dir: -1 | 1) => {
    setEditData((prev) => {
      const idx = prev.exercises.findIndex((e) => e.tempId === tempId);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.exercises.length) return prev;
      const copy = [...prev.exercises];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return { ...prev, exercises: copy };
    });
  };

  /* ── Save program (v2 schema) ── */
  const handleSave = async () => {
    if (!userId || !editData.title.trim()) {
      Alert.alert('Missing Info', 'Program title is required.');
      return;
    }

    setSaving(true);
    try {
      let programId = editData.id;

      if (programId) {
        // Update existing program
        await supabase
          .from('programs')
          .update({
            title: editData.title.trim(),
            description: editData.description.trim() || null,
            duration_weeks: editData.durationWeeks ? parseInt(editData.durationWeeks) : null,
            program_type: 'general' as ProgramType,
          })
          .eq('id', programId);

        // Delete old workouts (cascade handles items/sets)
        await supabase.from('workouts').delete().eq('program_id', programId);
      } else {
        // Create new program
        const { data: newProg } = await supabase
          .from('programs')
          .insert({
            owner_user_id: userId,
            title: editData.title.trim(),
            description: editData.description.trim() || null,
            duration_weeks: editData.durationWeeks ? parseInt(editData.durationWeeks) : null,
            program_type: 'general' as ProgramType,
          })
          .select('id')
          .single();
        if (!newProg) throw new Error('Failed to create program');
        programId = newProg.id;
      }

      // Group exercises by day
      const dayGroups: Record<number, ProgramExercise[]> = {};
      for (const ex of editData.exercises) {
        const day = ex.day ?? 1;
        if (!dayGroups[day]) dayGroups[day] = [];
        dayGroups[day].push(ex);
      }

      // Insert workouts and exercises for each day group
      const dayKeys = Object.keys(dayGroups).map(Number).sort((a, b) => a - b);
      for (let i = 0; i < dayKeys.length; i++) {
        const dayNum = dayKeys[i];
        const dayExercises = dayGroups[dayNum];

        const { data: workout } = await supabase
          .from('workouts')
          .insert({
            program_id: programId,
            week_number: 1,
            day_label: `Day ${dayNum}`,
            day_type: 'strength' as const,
            order_index: i + 1,
          })
          .select('id')
          .single();

        if (!workout) continue;

        for (let j = 0; j < dayExercises.length; j++) {
          const ex = dayExercises[j];
          if (!ex.name.trim()) continue;

          const { data: item } = await supabase
            .from('workout_items')
            .insert({
              workout_id: workout.id,
              exercise_name_raw: ex.name.trim(),
              category: 'general',
              order_index: j + 1,
              notes: ex.notes || null,
              superset_group: null,
            })
            .select('id')
            .single();

          if (item) {
            // Insert N workout_set rows where N = exercise.sets
            const setRows = Array.from({ length: ex.sets }, (_, s) => ({
              workout_item_id: item.id,
              set_number: s + 1,
              reps: String(ex.reps),
              load: ex.weight ? String(ex.weight) : null,
              tempo: null,
              rest_sec: null,
            }));
            await supabase.from('workout_sets').insert(setRows);
          }
        }
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEditing(false);
      loadPrograms();
    } catch {
      Alert.alert('Error', 'Failed to save program.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete program (v2 schema) ── */
  const handleDelete = (prog: SavedProgram) => {
    Alert.alert(
      'Delete Program',
      `Are you sure you want to delete "${prog.title}"? This will also remove all assignments.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete program_assignments for this program
              await supabase.from('program_assignments').delete().eq('program_id', prog.id);
              // Delete workouts (cascade handles items/sets)
              await supabase.from('workouts').delete().eq('program_id', prog.id);
              // Delete from programs table
              await supabase.from('programs').delete().eq('id', prog.id);

              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              loadPrograms();
            } catch {
              Alert.alert('Error', 'Failed to delete program.');
            }
          },
        },
      ],
    );
  };

  /* ── Save as template (v2 schema) ── */
  const handleSaveAsTemplate = async (prog: SavedProgram) => {
    if (!userId) return;
    try {
      const templateTitle = prog.title.startsWith(TEMPLATE_PREFIX)
        ? prog.title
        : `${TEMPLATE_PREFIX}${prog.title}`;

      // Create a new program as a template
      const { data: newProg } = await supabase
        .from('programs')
        .insert({
          owner_user_id: userId,
          title: templateTitle,
          description: prog.description || null,
          duration_weeks: prog.duration_weeks || null,
          program_type: prog.program_type,
        })
        .select('id')
        .single();

      if (!newProg) throw new Error('Failed to create template');

      // Re-create exercises under the new template program
      const dayGroups: Record<number, typeof prog.exercises> = {};
      for (const ex of prog.exercises) {
        const day = ex.day ?? 1;
        if (!dayGroups[day]) dayGroups[day] = [];
        dayGroups[day].push(ex);
      }

      const dayKeys = Object.keys(dayGroups).map(Number).sort((a, b) => a - b);
      for (let i = 0; i < dayKeys.length; i++) {
        const dayNum = dayKeys[i];
        const dayExercises = dayGroups[dayNum];

        const { data: workout } = await supabase
          .from('workouts')
          .insert({
            program_id: newProg.id,
            week_number: 1,
            day_label: `Day ${dayNum}`,
            day_type: 'strength' as const,
            order_index: i + 1,
          })
          .select('id')
          .single();

        if (!workout) continue;

        for (let j = 0; j < dayExercises.length; j++) {
          const ex = dayExercises[j];

          const { data: item } = await supabase
            .from('workout_items')
            .insert({
              workout_id: workout.id,
              exercise_name_raw: ex.name.trim(),
              category: 'general',
              order_index: j + 1,
              notes: ex.notes || null,
              superset_group: null,
            })
            .select('id')
            .single();

          if (item) {
            const setRows = Array.from({ length: ex.sets }, (_, s) => ({
              workout_item_id: item.id,
              set_number: s + 1,
              reps: String(ex.reps),
              load: ex.weight ? String(ex.weight) : null,
              tempo: null,
              rest_sec: null,
            }));
            await supabase.from('workout_sets').insert(setRows);
          }
        }
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Template Saved', 'Program saved as a template.');
      loadPrograms();
    } catch {
      Alert.alert('Error', 'Failed to save template.');
    }
  };

  /* ── Duplicate from template ── */
  const handleUseTemplate = (template: SavedProgram) => {
    const cleanTitle = template.title.replace(TEMPLATE_PREFIX, '');
    setEditData({
      title: cleanTitle,
      description: template.description ?? '',
      durationWeeks: template.duration_weeks?.toString() ?? '',
      exercises: template.exercises.map((e) => ({
        tempId: nextTempId(),
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
        day: e.day,
        notes: e.notes,
      })),
    });
    setEditing(true);
  };

  /* ── Navigate to assign ── */
  const handleAssign = (prog: SavedProgram) => {
    router.push({ pathname: '/(app)/coach/assign-program', params: { programId: prog.id } });
  };

  /* ── Pool modal ── */
  const openPool = (block: BlockKey) => {
    setPoolBlock(block);
    setPoolSearch('');
    setPoolOpen(true);
  };

  const addFromPool = (name: string, block: string) => {
    addExercise(name, block);
    setPoolOpen(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  /* ── RENDER ── */
  if (editing) {
    return (
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={cancelEdit} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerLabel}>PROGRAM EDITOR</Text>
            <Text style={styles.headerTitle}>{editData.id ? 'Edit Program' : 'New Program'}</Text>
          </View>
          <Text style={styles.exerciseCount}>{editData.exercises.length} exercises</Text>
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
                value={editData.title}
                onChangeText={(t) => setEditData((prev) => ({ ...prev, title: t }))}
                placeholder="e.g. Off-Season Strength Phase 1"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DESCRIPTION</Text>
              <TextInput
                style={[styles.textInput, { minHeight: 60 }]}
                value={editData.description}
                onChangeText={(t) => setEditData((prev) => ({ ...prev, description: t }))}
                placeholder="Optional description..."
                placeholderTextColor={Colors.textMuted}
                multiline
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DURATION (WEEKS)</Text>
              <TextInput
                style={styles.textInput}
                value={editData.durationWeeks}
                onChangeText={(t) => setEditData((prev) => ({ ...prev, durationWeeks: t.replace(/[^0-9]/g, '') }))}
                placeholder="e.g. 8"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
              />
            </View>

            {/* Block Quick-Add Buttons */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ADD FROM BLOCK</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {SESSION_BLOCKS.map((block) => (
                    <TouchableOpacity
                      key={block.key}
                      style={[styles.blockChip, { borderColor: block.color + '60' }]}
                      onPress={() => openPool(block.key)}
                    >
                      <Ionicons name={block.icon as any} size={12} color={block.color} />
                      <Text style={[styles.blockChipText, { color: block.color }]}>{block.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Exercises */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EXERCISES ({editData.exercises.length})</Text>
              {editData.exercises.map((ex, idx) => (
                <View key={ex.tempId} style={styles.exerciseCard}>
                  <View style={styles.exerciseTop}>
                    <Text style={styles.exerciseNum}>{idx + 1}</Text>
                    <TextInput
                      style={styles.exerciseNameInput}
                      value={ex.name}
                      onChangeText={(t) => updateExercise(ex.tempId, 'name', t)}
                      placeholder="Exercise name"
                      placeholderTextColor={Colors.textMuted}
                    />
                    <TouchableOpacity onPress={() => moveExercise(ex.tempId, -1)} style={styles.moveBtn}>
                      <Ionicons name="arrow-up" size={14} color={Colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => moveExercise(ex.tempId, 1)} style={styles.moveBtn}>
                      <Ionicons name="arrow-down" size={14} color={Colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeExercise(ex.tempId)} style={styles.moveBtn}>
                      <Ionicons name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.exerciseFields}>
                    <View style={styles.miniField}>
                      <Text style={styles.miniFieldLabel}>Sets</Text>
                      <TextInput
                        style={styles.miniFieldInput}
                        value={String(ex.sets)}
                        onChangeText={(t) => updateExercise(ex.tempId, 'sets', parseInt(t) || 0)}
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={styles.miniField}>
                      <Text style={styles.miniFieldLabel}>Reps</Text>
                      <TextInput
                        style={styles.miniFieldInput}
                        value={String(ex.reps)}
                        onChangeText={(t) => updateExercise(ex.tempId, 'reps', parseInt(t) || 0)}
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={styles.miniField}>
                      <Text style={styles.miniFieldLabel}>Weight</Text>
                      <TextInput
                        style={styles.miniFieldInput}
                        value={ex.weight ? String(ex.weight) : ''}
                        onChangeText={(t) => updateExercise(ex.tempId, 'weight', t ? parseInt(t) || undefined : undefined)}
                        placeholder="lbs"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={styles.miniField}>
                      <Text style={styles.miniFieldLabel}>Day</Text>
                      <TextInput
                        style={styles.miniFieldInput}
                        value={ex.day ? String(ex.day) : ''}
                        onChangeText={(t) => updateExercise(ex.tempId, 'day', t ? parseInt(t) || 1 : 1)}
                        placeholder="1"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>

                  <TextInput
                    style={styles.exerciseNotes}
                    value={ex.notes ?? ''}
                    onChangeText={(t) => updateExercise(ex.tempId, 'notes', t || undefined)}
                    placeholder="Notes (optional)"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              ))}

              <TouchableOpacity
                style={styles.addExerciseBtn}
                onPress={() => addExercise()}
              >
                <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
                <Text style={styles.addExerciseBtnText}>Add Custom Exercise</Text>
              </TouchableOpacity>
            </View>

            {/* Save */}
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Program'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Exercise Pool Modal */}
        <Modal visible={poolOpen} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {BLOCK_LABELS[poolBlock] ?? 'Exercise'} Pool
                </Text>
                <TouchableOpacity onPress={() => setPoolOpen(false)}>
                  <Ionicons name="close" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.modalSearch}
                value={poolSearch}
                onChangeText={setPoolSearch}
                placeholder="Search or type exercise name..."
                placeholderTextColor={Colors.textMuted}
              />

              {/* Block filter pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {SESSION_BLOCKS.map((block) => {
                  const isActive = poolBlock === block.key;
                  return (
                    <TouchableOpacity
                      key={block.key}
                      style={[styles.filterChip, isActive && { backgroundColor: block.color, borderColor: block.color }]}
                      onPress={() => setPoolBlock(block.key)}
                    >
                      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                        {block.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <FlatList
                data={filteredPool}
                keyExtractor={(item, i) => `${item.name}-${i}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.poolItem}
                    onPress={() => addFromPool(item.name, item.block)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.poolItemName}>{item.name}</Text>
                      <Text style={styles.poolItemSub}>{item.sets} — {item.cue}</Text>
                    </View>
                    <Ionicons name="add-circle" size={24} color={Colors.primary} />
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                  <View style={{ paddingVertical: 24, gap: 12, alignItems: 'center' }}>
                    <Text style={styles.poolEmpty}>No pool exercises available for this block.</Text>
                    {poolSearch.trim().length > 0 && (
                      <TouchableOpacity
                        style={styles.addCustomFromPoolBtn}
                        onPress={() => addFromPool(poolSearch.trim(), poolBlock)}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
                        <Text style={styles.addCustomFromPoolText}>Add "{poolSearch.trim()}" as custom</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                }
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  /* ── Program List View ── */
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>COACH</Text>
          <Text style={styles.headerTitle}>Programs</Text>
        </View>
        <TouchableOpacity onPress={startNew} style={styles.newBtn}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.newBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Type Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {(['all', 'hitting', 'lifting', 'general'] as FilterType[]).map((type) => {
          const isActive = filterType === type;
          const label = type === 'all' ? 'All' : TYPE_BADGES[type as ProgramType].label;
          const color = type === 'all' ? Colors.primary : TYPE_BADGES[type as ProgramType].color;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.filterChip, isActive && { backgroundColor: color, borderColor: color }]}
              onPress={() => setFilterType(type)}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Templates */}
          {templates.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>TEMPLATES</Text>
              {templates.map((prog) => (
                <ProgramCard
                  key={prog.id}
                  program={prog}
                  onEdit={() => startEdit(prog)}
                  onDelete={() => handleDelete(prog)}
                  onAssign={() => handleAssign(prog)}
                  onUseTemplate={() => handleUseTemplate(prog)}
                  isTemplate
                />
              ))}
            </>
          )}

          {/* Regular Programs */}
          <Text style={styles.sectionLabel}>
            {templates.length > 0 ? 'PROGRAMS' : 'YOUR PROGRAMS'}
          </Text>
          {regularPrograms.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="clipboard-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Programs Yet</Text>
              <Text style={styles.emptyText}>Create your first program to get started.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={startNew}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.emptyBtnText}>Create Program</Text>
              </TouchableOpacity>
            </View>
          ) : (
            regularPrograms.map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onEdit={() => startEdit(prog)}
                onDelete={() => handleDelete(prog)}
                onAssign={() => handleAssign(prog)}
                onSaveAsTemplate={() => handleSaveAsTemplate(prog)}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ── Program Card Component ── */
function ProgramCard({
  program,
  onEdit,
  onDelete,
  onAssign,
  onSaveAsTemplate,
  onUseTemplate,
  isTemplate,
}: {
  program: SavedProgram;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onSaveAsTemplate?: () => void;
  onUseTemplate?: () => void;
  isTemplate?: boolean;
}) {
  const badge = TYPE_BADGES[program.program_type] ?? TYPE_BADGES.general;
  const displayTitle = isTemplate
    ? program.title.replace(TEMPLATE_PREFIX, '')
    : program.title;

  return (
    <View style={styles.programCard}>
      <View style={styles.programCardTop}>
        <View style={{ flex: 1 }}>
          <View style={styles.programTitleRow}>
            {isTemplate && (
              <View style={styles.templateBadge}>
                <Ionicons name="copy-outline" size={10} color="#f59e0b" />
                <Text style={styles.templateBadgeText}>TEMPLATE</Text>
              </View>
            )}
            <View style={[styles.typeBadge, { backgroundColor: badge.color + '18' }]}>
              <Ionicons name={badge.icon} size={10} color={badge.color} />
              <Text style={[styles.typeBadgeText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          </View>
          <Text style={styles.programTitle}>{displayTitle}</Text>
          {program.description ? (
            <Text style={styles.programDesc} numberOfLines={2}>{program.description}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.programMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="barbell-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{program.exerciseCount} exercises</Text>
        </View>
        {program.duration_weeks && (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{program.duration_weeks} weeks</Text>
          </View>
        )}
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{program.assignedCount} assigned</Text>
        </View>
      </View>

      <View style={styles.programActions}>
        {isTemplate && onUseTemplate ? (
          <TouchableOpacity style={styles.actionBtn} onPress={onUseTemplate}>
            <Ionicons name="copy-outline" size={16} color={Colors.primary} />
            <Text style={[styles.actionBtnText, { color: Colors.primary }]}>Use</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionBtn} onPress={onAssign}>
            <Ionicons name="person-add-outline" size={16} color="#22c55e" />
            <Text style={[styles.actionBtnText, { color: '#22c55e' }]}>Assign</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Ionicons name="create-outline" size={16} color={Colors.primary} />
          <Text style={[styles.actionBtnText, { color: Colors.primary }]}>Edit</Text>
        </TouchableOpacity>
        {!isTemplate && onSaveAsTemplate && (
          <TouchableOpacity style={styles.actionBtn} onPress={onSaveAsTemplate}>
            <Ionicons name="bookmark-outline" size={16} color="#f59e0b" />
            <Text style={[styles.actionBtnText, { color: '#f59e0b' }]}>Template</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
          <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
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
  headerLabel: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  exerciseCount: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  newBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  /* Filter */
  filterRow: { paddingHorizontal: 16, paddingVertical: 10, maxHeight: 52 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginRight: 8,
  },
  filterChipText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  filterChipTextActive: { color: '#fff' },

  /* Section */
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 4,
  },

  /* Program Card */
  programCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  programCardTop: {
    flexDirection: 'row',
    padding: 14,
    gap: 10,
  },
  programTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  programTitle: { fontSize: 16, fontWeight: '900', color: Colors.textPrimary },
  programDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: { fontSize: 9, fontWeight: '800' },
  templateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#f59e0b18',
  },
  templateBadgeText: { fontSize: 9, fontWeight: '800', color: '#f59e0b' },
  programMeta: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontWeight: '600', color: Colors.textMuted },
  programActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  actionBtnText: { fontSize: 11, fontWeight: '700' },

  /* Empty */
  emptyCard: {
    alignItems: 'center',
    gap: 8,
    padding: 32,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },
  emptyTitle: { fontSize: 16, fontWeight: '900', color: Colors.textPrimary },
  emptyText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 8,
  },
  emptyBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  /* Editor */
  fieldGroup: { gap: 6 },
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

  blockChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  blockChipText: { fontSize: 10, fontWeight: '700' },

  exerciseCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },
  exerciseTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  exerciseNum: { fontSize: 12, fontWeight: '900', color: Colors.primary, width: 18, textAlign: 'center' },
  exerciseNameInput: {
    flex: 1,
    backgroundColor: Colors.bg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  moveBtn: { padding: 4 },
  exerciseFields: { flexDirection: 'row', gap: 6, paddingLeft: 18 },
  miniField: { flex: 1, gap: 2 },
  miniFieldLabel: { fontSize: 8, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.8 },
  miniFieldInput: {
    backgroundColor: Colors.bg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  exerciseNotes: {
    backgroundColor: Colors.bg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 18,
  },

  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 10,
  },
  addExerciseBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  saveBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },

  /* Modal */
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
  poolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  poolItemName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  poolItemSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  poolEmpty: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addCustomFromPoolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addCustomFromPoolText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});

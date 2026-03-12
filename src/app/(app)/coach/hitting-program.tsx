import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert,
  Modal, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { DRILLS, AREAS, type Drill } from '@/data/hitting-drills';

const ACCENT = '#22c55e';

interface ProgramDrill {
  tempId: string;
  name: string;
  reps: string;
  cue?: string;
}

let tempIdCounter = 0;
function nextTempId() { return `hit-${++tempIdCounter}`; }

export default function HittingProgramScreen() {
  const { programId } = useLocalSearchParams<{ programId?: string }>();
  const userId = useAuthStore((s) => s.user?.id);

  const [title, setTitle] = useState('');
  const [focusNotes, setFocusNotes] = useState('');
  const [drills, setDrills] = useState<ProgramDrill[]>([]);
  const [saving, setSaving] = useState(false);

  // Pool modal
  const [poolOpen, setPoolOpen] = useState(false);
  const [poolSearch, setPoolSearch] = useState('');
  const [poolArea, setPoolArea] = useState('all');

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
        setFocusNotes(prog.focus_notes ?? '');
        // Flatten the hierarchy into drills
        const items: ProgramDrill[] = [];
        const workouts = ((prog.workouts ?? []) as any[]).sort((a: any, b: any) => a.order_index - b.order_index);
        for (const wo of workouts) {
          const woItems = ((wo.workout_items ?? []) as any[]).sort((a: any, b: any) => a.order_index - b.order_index);
          for (const item of woItems) {
            const firstSet = ((item.workout_sets ?? []) as any[])[0];
            items.push({
              tempId: nextTempId(),
              name: item.exercise_name_raw,
              reps: firstSet?.reps?.toString() ?? '10',
              cue: item.notes ?? undefined,
            });
          }
        }
        setDrills(items);
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
            focus_notes: focusNotes.trim() || null,
            program_type: 'hitting',
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
            focus_notes: focusNotes.trim() || null,
            program_type: 'hitting',
          })
          .select('id')
          .single();
        if (!newProg) throw new Error('Failed to create program');
        id = newProg.id;
      }

      if (drills.length > 0 && id) {
        // Create a single workout for hitting
        const { data: workout } = await supabase
          .from('workouts')
          .insert({
            program_id: id,
            week_number: 1,
            day_label: 'Hitting',
            day_type: 'strength',
            order_index: 1,
          })
          .select('id')
          .single();

        if (workout) {
          // Insert workout items
          const itemRows = drills.map((d, i) => ({
            workout_id: workout.id,
            exercise_name_raw: d.name,
            category: 'hitting',
            order_index: i + 1,
            notes: d.cue || null,
            superset_group: null,
          }));

          const { data: insertedItems } = await supabase
            .from('workout_items')
            .insert(itemRows)
            .select('id');

          if (insertedItems) {
            // Insert workout sets
            const setRows = insertedItems.map((item, i) => ({
              workout_item_id: item.id,
              set_number: 1,
              reps: drills[i].reps || '10',
              load: null,
              tempo: null,
              rest_sec: null,
            }));
            await supabase.from('workout_sets').insert(setRows);
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

  const addFromPool = (drill: Drill) => {
    setDrills((prev) => [
      ...prev,
      { tempId: nextTempId(), name: drill.name, reps: '10', cue: drill.cue },
    ]);
    setPoolOpen(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addCustom = () => {
    setDrills((prev) => [
      ...prev,
      { tempId: nextTempId(), name: '', reps: '10' },
    ]);
  };

  const updateDrill = (tempId: string, field: keyof ProgramDrill, value: string) => {
    setDrills((prev) =>
      prev.map((d) => (d.tempId === tempId ? { ...d, [field]: value } : d)),
    );
  };

  const removeDrill = (tempId: string) => {
    setDrills((prev) => prev.filter((d) => d.tempId !== tempId));
  };

  const moveDrill = (tempId: string, dir: -1 | 1) => {
    setDrills((prev) => {
      const idx = prev.findIndex((d) => d.tempId === tempId);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  const filteredPool = DRILLS.filter((d) => {
    if (poolSearch && !d.name.toLowerCase().includes(poolSearch.toLowerCase())) return false;
    if (poolArea !== 'all' && !d.areas.includes(poolArea)) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>HITTING PROGRAM</Text>
          <Text style={styles.headerTitle}>{programId ? 'Edit Program' : 'New Program'}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PROGRAM TITLE *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Barrel Control Phase 1"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* Focus Notes — prominent */}
          <View style={styles.fieldGroup}>
            <View style={styles.focusHeader}>
              <Ionicons name="bulb-outline" size={16} color={ACCENT} />
              <Text style={[styles.fieldLabel, { color: ACCENT }]}>FOCUS NOTES</Text>
            </View>
            <Text style={styles.focusHint}>
              Key teaching points and areas of emphasis for this athlete
            </Text>
            <TextInput
              style={[styles.textInput, styles.focusInput]}
              value={focusNotes}
              onChangeText={setFocusNotes}
              placeholder="e.g. Working on early barrel turn and staying through the ball. Focus on deep contact point and keeping hands inside..."
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Drills */}
          <View style={styles.drillsHeader}>
            <Text style={styles.sectionLabel}>DRILLS ({drills.length})</Text>
            <View style={styles.addBtns}>
              <TouchableOpacity style={styles.addPoolBtn} onPress={() => setPoolOpen(true)}>
                <Ionicons name="search-outline" size={14} color="#3b82f6" />
                <Text style={styles.addPoolText}>From Pool</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addCustomBtn} onPress={addCustom}>
                <Ionicons name="add" size={14} color={ACCENT} />
                <Text style={styles.addCustomText}>Custom</Text>
              </TouchableOpacity>
            </View>
          </View>

          {drills.length === 0 && (
            <View style={styles.emptyDrills}>
              <Ionicons name="baseball-outline" size={28} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No drills yet. Add from the pool or create custom.</Text>
            </View>
          )}

          {drills.map((d, idx) => (
            <View key={d.tempId} style={styles.drillCard}>
              <View style={styles.drillTop}>
                <View style={styles.drillNum}>
                  <Text style={styles.drillNumText}>{idx + 1}</Text>
                </View>
                <TextInput
                  style={styles.drillNameInput}
                  value={d.name}
                  onChangeText={(t) => updateDrill(d.tempId, 'name', t)}
                  placeholder="Drill name"
                  placeholderTextColor={Colors.textMuted}
                />
                <TouchableOpacity onPress={() => moveDrill(d.tempId, -1)} style={styles.moveBtn}>
                  <Ionicons name="arrow-up" size={14} color={Colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => moveDrill(d.tempId, 1)} style={styles.moveBtn}>
                  <Ionicons name="arrow-down" size={14} color={Colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeDrill(d.tempId)} style={styles.moveBtn}>
                  <Ionicons name="close" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.drillBottom}>
                <View style={styles.repsField}>
                  <Text style={styles.repsLabel}>REPS</Text>
                  <TextInput
                    style={styles.repsInput}
                    value={d.reps}
                    onChangeText={(t) => updateDrill(d.tempId, 'reps', t)}
                    placeholder="10"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.cueField}>
                  <Text style={styles.repsLabel}>COACHING CUE</Text>
                  <TextInput
                    style={styles.cueInput}
                    value={d.cue ?? ''}
                    onChangeText={(t) => updateDrill(d.tempId, 'cue', t)}
                    placeholder="Optional coaching cue..."
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>
            </View>
          ))}

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Hitting Program'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Drill Pool Modal */}
      <Modal visible={poolOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hitting Drill Pool</Text>
              <TouchableOpacity onPress={() => setPoolOpen(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalSearch}
              value={poolSearch}
              onChangeText={setPoolSearch}
              placeholder="Search drills..."
              placeholderTextColor={Colors.textMuted}
            />

            {/* Area filter pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {AREAS.map((area) => {
                const isActive = poolArea === area.key;
                return (
                  <TouchableOpacity
                    key={area.key}
                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                    onPress={() => setPoolArea(isActive && area.key !== 'all' ? 'all' : area.key)}
                  >
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                      {area.label}
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
                  onPress={() => addFromPool(item)}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.poolItemName}>{item.name}</Text>
                    <Text style={styles.poolItemMeta}>
                      {item.areas.join(', ')}
                      {item.cue ? ` \u00B7 "${item.cue}"` : ''}
                    </Text>
                  </View>
                  <Ionicons name="add-circle" size={24} color={ACCENT} />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text style={styles.poolEmpty}>No drills match your search.</Text>
              }
            />
          </View>
        </View>
      </Modal>
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
  headerLabel: { fontSize: 10, fontWeight: '800', color: ACCENT, letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  content: { padding: 16, gap: 14, paddingBottom: 48 },

  /* Fields */
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

  /* Focus Notes */
  focusHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  focusHint: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  focusInput: { minHeight: 100, textAlignVertical: 'top' },

  /* Drills section */
  drillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionLabel: { fontSize: 10, fontWeight: '900', color: Colors.textMuted, letterSpacing: 1.5 },
  addBtns: { flexDirection: 'row', gap: 8 },
  addPoolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#3b82f615',
    borderRadius: 8,
  },
  addPoolText: { fontSize: 11, fontWeight: '700', color: '#3b82f6' },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: ACCENT + '15',
    borderRadius: 8,
  },
  addCustomText: { fontSize: 11, fontWeight: '700', color: ACCENT },

  emptyDrills: {
    alignItems: 'center',
    gap: 10,
    padding: 28,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    borderStyle: 'dashed',
  },
  emptyText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 19 },

  /* Drill card */
  drillCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  drillTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  drillNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ACCENT + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drillNumText: { fontSize: 12, fontWeight: '900', color: ACCENT },
  drillNameInput: {
    flex: 1,
    backgroundColor: Colors.bg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  moveBtn: { padding: 6 },

  drillBottom: { flexDirection: 'row', gap: 8 },
  repsField: { width: 70, gap: 2 },
  repsLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1 },
  repsInput: {
    backgroundColor: Colors.bg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  cueField: { flex: 1, gap: 2 },
  cueInput: {
    backgroundColor: Colors.bg,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  /* Save */
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

  /* Pool Modal */
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
  filterChipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  filterChipText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  filterChipTextActive: { color: '#fff' },

  poolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  poolItemName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  poolItemMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  poolEmpty: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
    fontStyle: 'italic',
  },
});

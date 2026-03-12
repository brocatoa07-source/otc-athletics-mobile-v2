import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/common/Card';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useDailyStandards, StandardItem } from '@/hooks/useDailyStandards';

const ICON_OPTIONS = [
  'barbell', 'baseball', 'pencil', 'bulb', 'play-circle',
  'fitness', 'walk', 'water', 'nutrition', 'bed',
  'book', 'timer', 'eye', 'megaphone', 'trophy',
] as const;

export function WeeklyChecklist() {
  const { standards, updateStandards, todayChecked, toggleItem } = useDailyStandards();
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState<StandardItem[]>([]);

  const count = todayChecked.size;

  const openEditor = () => {
    setDraft(standards.map((s) => ({ ...s })));
    setEditOpen(true);
  };

  const saveEdits = () => {
    const cleaned = draft.filter((d) => d.label.trim().length > 0);
    updateStandards(cleaned);
    setEditOpen(false);
  };

  const addItem = () => {
    setDraft((prev) => [
      ...prev,
      { id: `custom_${Date.now()}`, label: '', icon: 'checkmark-circle' },
    ]);
  };

  const removeItem = (id: string) => {
    setDraft((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDraftLabel = (id: string, label: string) => {
    setDraft((prev) => prev.map((d) => d.id === id ? { ...d, label } : d));
  };

  const updateDraftIcon = (id: string, icon: string) => {
    setDraft((prev) => prev.map((d) => d.id === id ? { ...d, icon } : d));
  };

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.headerRow}>
          <SectionHeader title={`Daily Standard — ${count}/${standards.length}`} />
          <TouchableOpacity onPress={openEditor} hitSlop={8}>
            <Ionicons name="settings-outline" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.bar}>
          <View
            style={[
              styles.fill,
              { width: standards.length > 0 ? `${(count / standards.length) * 100}%` : '0%' },
            ]}
          />
        </View>
        <View style={styles.list}>
          {standards.map((item) => {
            const done = todayChecked.has(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={() => toggleItem(item.id)}
              >
                <Ionicons
                  name={done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={done ? Colors.success : Colors.textMuted}
                />
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  color={Colors.textMuted}
                  style={{ marginLeft: 6 }}
                />
                <Text style={[styles.itemText, done && styles.itemDone]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Edit Standards Modal */}
      <Modal visible={editOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setEditOpen(false)}>
          <Pressable style={styles.modal} onPress={() => {}}>
            <Text style={styles.modalTitle}>Customize Standards</Text>
            <Text style={styles.modalSub}>
              Set your daily non-negotiables. Streaks count when you hit all of them.
            </Text>

            <View style={styles.draftList}>
              {draft.map((d, idx) => (
                <View key={d.id} style={styles.draftItem}>
                  <TouchableOpacity
                    style={styles.iconPicker}
                    onPress={() => {
                      const currentIdx = ICON_OPTIONS.indexOf(d.icon as any);
                      const nextIcon = ICON_OPTIONS[(currentIdx + 1) % ICON_OPTIONS.length];
                      updateDraftIcon(d.id, nextIcon);
                    }}
                  >
                    <Ionicons name={d.icon as any} size={18} color={Colors.primary} />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.draftInput}
                    value={d.label}
                    onChangeText={(text) => updateDraftLabel(d.id, text)}
                    placeholder={`Standard ${idx + 1}`}
                    placeholderTextColor={Colors.textMuted}
                  />
                  <TouchableOpacity onPress={() => removeItem(d.id)} hitSlop={8}>
                    <Ionicons name="close-circle" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={addItem}>
              <Ionicons name="add-circle" size={18} color={Colors.primary} />
              <Text style={styles.addBtnText}>Add Standard</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditOpen(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdits}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bar: {
    height: 3,
    backgroundColor: Colors.bgElevated,
    borderRadius: 2,
    marginBottom: 14,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 2,
  },
  list: { gap: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemText: { fontSize: 14, color: Colors.textPrimary, flex: 1 },
  itemDone: { color: Colors.textMuted, textDecorationLine: 'line-through' },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  draftList: { gap: 10 },
  draftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconPicker: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftInput: {
    flex: 1,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  addBtnText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});

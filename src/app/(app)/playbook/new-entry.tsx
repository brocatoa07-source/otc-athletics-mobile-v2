/**
 * New Entry — Unified creation screen for all Playbook entry types.
 *
 * Route: /(app)/playbook/new-entry?type=note|journal|cue|saved_drill|mental_tool|routine|game_note
 * Also supports edit mode: ?id=xxx
 */

import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  savePlaybookEntry, generatePlaybookId, loadPlaybookEntries,
  getEntryTypeMeta, ENTRY_TYPE_META,
  type PlaybookEntryType, type PlaybookEntry,
} from '@/data/playbook';

export default function NewEntryScreen() {
  const params = useLocalSearchParams<{ type?: string; id?: string }>();
  const entryType = (params.type ?? 'note') as PlaybookEntryType;
  const editId = params.id;
  const isEdit = !!editId;

  const meta = getEntryTypeMeta(entryType);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  // Load existing entry for edit mode
  useEffect(() => {
    if (!editId) return;
    loadPlaybookEntries().then((all) => {
      const entry = all.find((e) => e.id === editId);
      if (entry) {
        setTitle(entry.title);
        setBody(entry.body);
        setTags(entry.tags ?? []);
      }
      setLoaded(true);
    });
  }, [editId]);

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  }

  async function handleSave() {
    if (!title.trim() && !body.trim()) {
      Alert.alert('Empty Entry', 'Write something before saving.');
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();
    await savePlaybookEntry({
      id: editId ?? generatePlaybookId(),
      type: entryType,
      title: title.trim() || `Untitled ${meta.label}`,
      body: body.trim(),
      tags,
      favorite: false,
      createdAt: isEdit ? now : now, // preserve original on edit? simplify for now
      updatedAt: now,
    });
    router.back();
  }

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name={meta.icon as any} size={14} color={meta.color} />
          <Text style={[styles.headerType, { color: meta.color }]}>{isEdit ? 'Edit' : 'New'} {meta.label}</Text>
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: meta.color }, (!title.trim() && !body.trim()) && { opacity: 0.4 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus={!isEdit}
            returnKeyType="next"
          />

          <TextInput
            style={styles.bodyInput}
            placeholder={meta.placeholder}
            placeholderTextColor={colors.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
          />

          {/* Tags */}
          <View style={styles.tagSection}>
            <Text style={styles.fieldLabel}>TAGS</Text>
            <View style={styles.tagInputRow}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag..."
                placeholderTextColor={colors.textMuted}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                returnKeyType="done"
              />
              <TouchableOpacity style={[styles.tagAddBtn, { backgroundColor: meta.color + '15' }]} onPress={addTag}>
                <Ionicons name="add" size={16} color={meta.color} />
              </TouchableOpacity>
            </View>
            {tags.length > 0 && (
              <View style={styles.tagList}>
                {tags.map((tag) => (
                  <TouchableOpacity key={tag} style={[styles.tag, { backgroundColor: meta.color + '12' }]} onPress={() => setTags(tags.filter((t) => t !== tag))}>
                    <Text style={[styles.tagText, { color: meta.color }]}>{tag}</Text>
                    <Ionicons name="close-circle" size={12} color={meta.color} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerType: { fontSize: 14, fontWeight: '800' },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.sm },
  saveBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  form: { padding: 16, paddingBottom: 60, gap: 16 },
  titleInput: { fontSize: 20, fontWeight: '900', color: colors.textPrimary, padding: 0 },
  bodyInput: { flex: 1, fontSize: 15, color: colors.textSecondary, lineHeight: 22, padding: 0, minHeight: 120 },
  tagSection: { gap: 8 },
  fieldLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  tagInputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 8,
  },
  tagInput: { flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0 },
  tagAddBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  tagText: { fontSize: 11, fontWeight: '700' },
});

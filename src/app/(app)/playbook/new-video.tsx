/**
 * New Video — Upload from camera roll or record a new video.
 */

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius } from '@/theme';
import {
  savePlaybookVideo,
  generatePlaybookId,
  VIDEO_CATEGORIES,
  type VideoCategory,
} from '@/data/playbook';

const ACCENT = '#3b82f6';

export default function NewVideoScreen() {
  const { mode } = useLocalSearchParams<{ mode?: 'record' }>();

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<VideoCategory>('hitting');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function pickVideo() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Allow access to your photo library to upload videos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 0.8,
      videoMaxDuration: 120,
    });
    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
    }
  }

  async function recordVideo() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Allow camera access to record videos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['videos'],
      quality: 0.8,
      videoMaxDuration: 120,
    });
    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
    }
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSave() {
    if (!videoUri) {
      Alert.alert('No Video', 'Upload or record a video first.');
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();
    await savePlaybookVideo({
      id: generatePlaybookId(),
      title: title.trim() || 'Untitled Video',
      videoUri,
      notes: notes.trim(),
      category,
      tags,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    });
    router.back();
  }

  // Auto-launch based on mode param
  if (!videoUri && mode === 'record') {
    // Will fire once on mount — not ideal but simple
    // The user can still manually pick from the buttons
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Save Video</Text>
        <TouchableOpacity
          style={[styles.saveBtn, !videoUri && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving || !videoUri}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          {/* Video Picker */}
          {!videoUri ? (
            <View style={styles.pickerArea}>
              <Ionicons name="videocam-outline" size={40} color={colors.textMuted} />
              <Text style={styles.pickerText}>Choose a video source</Text>
              <View style={styles.pickerBtns}>
                <TouchableOpacity style={styles.pickerBtn} onPress={pickVideo} activeOpacity={0.8}>
                  <Ionicons name="images-outline" size={18} color={ACCENT} />
                  <Text style={styles.pickerBtnText}>Camera Roll</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pickerBtn} onPress={recordVideo} activeOpacity={0.8}>
                  <Ionicons name="videocam" size={18} color="#ef4444" />
                  <Text style={styles.pickerBtnText}>Record New</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.selectedVideo}>
              <View style={styles.videoThumb}>
                <Ionicons name="videocam" size={28} color={ACCENT} />
              </View>
              <Text style={styles.videoSelected}>Video selected</Text>
              <TouchableOpacity onPress={() => setVideoUri(null)}>
                <Text style={styles.changeVideo}>Change</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Title */}
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          {/* Category */}
          <Text style={styles.fieldLabel}>CATEGORY</Text>
          <View style={styles.categoryRow}>
            {VIDEO_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryChip,
                  category === cat.key && { backgroundColor: cat.color + '20', borderColor: cat.color + '40' },
                ]}
                onPress={() => setCategory(cat.key)}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={12}
                  color={category === cat.key ? cat.color : colors.textMuted}
                />
                <Text style={[
                  styles.categoryChipText,
                  category === cat.key && { color: cat.color },
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tags */}
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
            <TouchableOpacity style={styles.tagAddBtn} onPress={addTag}>
              <Ionicons name="add" size={16} color={ACCENT} />
            </TouchableOpacity>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagList}>
              {tags.map((tag) => (
                <TouchableOpacity key={tag} style={styles.tag} onPress={() => removeTag(tag)}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <Ionicons name="close-circle" size={12} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Notes */}
          <Text style={styles.fieldLabel}>NOTES</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="What to remember about this video..."
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  saveBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.sm,
    backgroundColor: ACCENT,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  form: { padding: 16, paddingBottom: 60, gap: 14 },

  // Video picker
  pickerArea: {
    alignItems: 'center', gap: 12, paddingVertical: 32,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, borderStyle: 'dashed',
  },
  pickerText: { fontSize: 13, color: colors.textMuted },
  pickerBtns: { flexDirection: 'row', gap: 12 },
  pickerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.md,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  pickerBtnText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  selectedVideo: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14,
  },
  videoThumb: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: ACCENT + '15', alignItems: 'center', justifyContent: 'center',
  },
  videoSelected: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  changeVideo: { fontSize: 12, fontWeight: '700', color: ACCENT },

  titleInput: {
    fontSize: 18, fontWeight: '900', color: colors.textPrimary, padding: 0,
    borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10,
  },
  fieldLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },

  // Category
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  categoryChipText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },

  // Tags
  tagInputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 8,
  },
  tagInput: { flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0 },
  tagAddBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: ACCENT + '15', alignItems: 'center', justifyContent: 'center',
  },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    backgroundColor: ACCENT + '12',
  },
  tagText: { fontSize: 11, fontWeight: '700', color: ACCENT },

  // Notes
  notesInput: {
    fontSize: 14, color: colors.textSecondary, lineHeight: 20, padding: 12, minHeight: 80,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md,
  },
});

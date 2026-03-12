import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet,
  Switch, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useAuth } from '@/hooks/useAuth';
import { uploadMedia, announcementPath } from '@/utils/uploadMedia';
import type { Announcement } from '@/types/database';

type Audience = Announcement['audience'];

const AUDIENCE_OPTIONS: { value: Audience; label: string; icon: string }[] = [
  { value: 'all', label: 'Everyone', icon: 'people-outline' },
  { value: 'athletes', label: 'Athletes', icon: 'barbell-outline' },
  { value: 'coaches', label: 'Coaches', icon: 'ribbon-outline' },
];

export default function CreateAnnouncementScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = !!editId;

  const { user, dbUser } = useAuth();
  const { createAnnouncement, updateAnnouncement } = useAnnouncements();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<Audience>('all');
  const [isPinned, setIsPinned] = useState(false);
  const [attachment, setAttachment] = useState<Announcement['attachments'][0] | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: existing } = useQuery<Announcement | null>({
    queryKey: ['announcement', editId],
    enabled: isEditing,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', editId!)
        .maybeSingle();
      if (error) throw error;
      return data as Announcement | null;
    },
  });

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setBody(existing.body);
      setAudience(existing.audience);
      setIsPinned(existing.is_pinned);
      if (existing.attachments && existing.attachments.length > 0) {
        setAttachment(existing.attachments[0]);
      }
    }
  }, [existing]);

  const handlePickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const isVideo = asset.mimeType?.startsWith('video') || asset.uri.endsWith('.mp4');
    const filename = asset.fileName ?? `attachment_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;
    const contentType = asset.mimeType ?? (isVideo ? 'video/mp4' : 'image/jpeg');

    const tempId = editId ?? `new_${Date.now()}`;
    const storagePath = announcementPath(tempId, filename);

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const { publicUrl } = await uploadMedia({
        fileUri: asset.uri,
        storagePath,
        contentType,
        onProgress: setUploadProgress,
      });
      setAttachment({
        type: isVideo ? 'video' : 'image',
        url: publicUrl,
        name: filename,
      });
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message ?? 'Could not upload attachment.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const canSave = title.trim().length > 0 && body.trim().length > 0 && !isUploading;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      const authorName = dbUser?.full_name ?? user?.email?.split('@')[0] ?? 'Coach';
      const attachments = attachment ? [attachment] : undefined;

      if (isEditing) {
        await updateAnnouncement.mutateAsync({
          id: editId!,
          title: title.trim(),
          body: body.trim(),
          audience,
          is_pinned: isPinned,
          attachments,
        });
      } else {
        await createAnnouncement.mutateAsync({
          title: title.trim(),
          body: body.trim(),
          audience,
          is_pinned: isPinned,
          attachments,
          author_name: authorName,
        });
      }
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Could not save announcement.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Announcement' : 'New Announcement'}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!canSave || isSaving}
          style={[styles.postBtn, (!canSave || isSaving) && styles.postBtnDisabled]}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.bg} />
          ) : (
            <Text style={styles.postBtnText}>{isEditing ? 'Save' : 'Post'}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>TITLE</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Announcement title..."
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>MESSAGE</Text>
          <TextInput
            style={styles.bodyInput}
            placeholder="Write your message..."
            placeholderTextColor={Colors.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
            maxLength={2000}
          />
          <Text style={styles.charCount}>{body.length}/2000</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>AUDIENCE</Text>
          <View style={styles.audienceRow}>
            {AUDIENCE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setAudience(opt.value)}
                style={[styles.audienceChip, audience === opt.value && styles.audienceChipActive]}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={14}
                  color={audience === opt.value ? Colors.bg : Colors.textSecondary}
                />
                <Text style={[styles.audienceChipText, audience === opt.value && styles.audienceChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Ionicons name="pin-outline" size={18} color={Colors.primary} />
            <View>
              <Text style={styles.toggleTitle}>Pin Announcement</Text>
              <Text style={styles.toggleSub}>Shows at top of the feed</Text>
            </View>
          </View>
          <Switch
            value={isPinned}
            onValueChange={setIsPinned}
            trackColor={{ true: Colors.primary, false: Colors.border }}
            thumbColor={Colors.textPrimary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>ATTACHMENT (OPTIONAL)</Text>

          {attachment ? (
            <View style={styles.attachPreview}>
              <Ionicons
                name={attachment.type === 'video' ? 'videocam-outline' : 'image-outline'}
                size={22}
                color={Colors.primary}
              />
              <Text style={styles.attachName} numberOfLines={1}>{attachment.name ?? attachment.url}</Text>
              <TouchableOpacity onPress={handleRemoveAttachment} style={styles.attachRemove}>
                <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          ) : isUploading ? (
            <View style={styles.uploadingRow}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${Math.round(uploadProgress * 100)}%` }]} />
              </View>
              <Text style={styles.progressLabel}>{Math.round(uploadProgress * 100)}%</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.pickBtn} onPress={handlePickMedia} activeOpacity={0.75}>
              <Ionicons name="attach-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.pickBtnText}>Attach Image or Video</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  headerBtn: { padding: 2 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  postBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
  },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: { fontSize: 14, fontWeight: '800', color: Colors.bg },
  content: { padding: 20, gap: 24, paddingBottom: 60 },
  field: { gap: 8 },
  fieldLabel: { fontSize: 10, fontWeight: '900', color: Colors.textMuted, letterSpacing: 1.5 },
  titleInput: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  bodyInput: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    minHeight: 140,
  },
  charCount: { fontSize: 11, color: Colors.textMuted, alignSelf: 'flex-end' },
  audienceRow: { flexDirection: 'row', gap: 8 },
  audienceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  audienceChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  audienceChipText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  audienceChipTextActive: { color: Colors.bg },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  toggleSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  attachPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  attachName: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  attachRemove: { padding: 2 },
  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  progressLabel: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, minWidth: 34, textAlign: 'right' },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  pickBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
});

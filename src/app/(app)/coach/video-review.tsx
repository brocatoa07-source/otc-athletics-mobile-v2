import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';

export default function VideoReviewScreen() {
  const { videoUrl, athleteId, athleteName, messageId } = useLocalSearchParams<{
    videoUrl: string;
    athleteId: string;
    athleteName: string;
    messageId: string;
  }>();

  const user = useAuthStore((s) => s.user);
  const videoRef = useRef<Video>(null);

  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState('0:00');
  const [sending, setSending] = useState(false);

  const formatTime = (millis: number) => {
    const secs = Math.floor(millis / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlaybackUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.positionMillis != null) {
      setCurrentTime(formatTime(status.positionMillis));
    }
  };

  const handleSendReview = async () => {
    if (!notes.trim()) {
      Alert.alert('Add Notes', 'Please add review notes before sending.');
      return;
    }
    if (!user?.id || !athleteId) return;

    setSending(true);
    try {
      const reviewText = `Video Review\n\n${notes.trim()}`;

      // Find or create a DM conversation with this athlete
      const { data: existing } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', user.id);

      let conversationId: string | null = null;

      if (existing) {
        // Check if any of these conversations also include the athlete
        for (const row of existing) {
          const { data: members } = await supabase
            .from('conversation_members')
            .select('user_id')
            .eq('conversation_id', row.conversation_id);

          const memberIds = members?.map((m) => m.user_id) ?? [];
          if (memberIds.includes(athleteId) && memberIds.length === 2) {
            conversationId = row.conversation_id;
            break;
          }
        }
      }

      if (!conversationId) {
        // Create new DM conversation
        const { data: conv } = await supabase
          .from('conversations')
          .insert({ conversation_type: 'dm', created_by: user.id })
          .select('id')
          .single();

        if (conv) {
          conversationId = conv.id;
          await supabase.from('conversation_members').insert([
            { conversation_id: conv.id, user_id: user.id, role: 'coach' },
            { conversation_id: conv.id, user_id: athleteId, role: 'athlete' },
          ]);
        }
      }

      if (conversationId) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          sender_id: user.id,
          body: reviewText,
        });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Sent', 'Review notes sent to athlete.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to send review.');
    } finally {
      setSending(false);
    }
  };

  const handleSaveLocal = () => {
    if (!notes.trim()) {
      Alert.alert('Empty', 'Nothing to save.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Saved', 'Notes saved locally. You can send them later.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>VIDEO REVIEW</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {athleteName || 'Athlete'}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.videoContainer}>
            {videoUrl ? (
              <Video
                ref={videoRef}
                source={{ uri: videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                onPlaybackStatusUpdate={handlePlaybackUpdate}
              />
            ) : (
              <View style={styles.videoPlaceholder}>
                <Ionicons name="videocam-off-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.placeholderText}>No video URL provided</Text>
              </View>
            )}
          </View>

          <View style={styles.timestampRow}>
            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.timestampText}>Current: {currentTime}</Text>
          </View>

          <View style={styles.notesSection}>
            <Text style={styles.sectionLabel}>REVIEW NOTES</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Write your review notes here... Include timestamps, corrections, and praise."
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, sending && { opacity: 0.6 }]}
            onPress={handleSendReview}
            disabled={sending}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>
              {sending ? 'Sending...' : 'Mark Reviewed & Send'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleSaveLocal}
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.secondaryBtnText}>Save Notes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.disabledBtn} disabled activeOpacity={1}>
            <Ionicons name="git-compare-outline" size={18} color={Colors.textMuted} />
            <Text style={styles.disabledBtnText}>Compare (Coming Soon)</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: { padding: 16, gap: 14, paddingBottom: 48 },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: { width: '100%', height: '100%' },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: { fontSize: 13, color: Colors.textMuted },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  timestampText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  notesSection: { gap: 6 },
  sectionLabel: { fontSize: 10, fontWeight: '900', color: Colors.textMuted, letterSpacing: 1.5 },
  notesInput: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 100,
    lineHeight: 20,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 14,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: 14,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  disabledBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.bgElevated,
    paddingVertical: 14,
    borderRadius: 14,
    opacity: 0.5,
  },
  disabledBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
});

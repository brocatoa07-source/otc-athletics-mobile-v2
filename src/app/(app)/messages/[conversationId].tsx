import { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/colors';
import { useMessages, type EnrichedMessage } from '@/hooks/useMessages';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { uploadMedia, messagePath } from '@/utils/uploadMedia';

function MessageBubble({ message, isOwn }: { message: EnrichedMessage; isOwn: boolean }) {
  const time = new Date(message.created_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View style={[styles.bubbleWrapper, isOwn ? styles.bubbleWrapperOwn : styles.bubbleWrapperOther]}>
      {!isOwn && (
        <Text style={styles.senderName}>{message.sender?.full_name ?? 'Unknown'}</Text>
      )}
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        {message.media_url && message.media_type === 'image' ? (
          <TouchableOpacity onPress={() => message.media_url && Linking.openURL(message.media_url)}>
            <Image source={{ uri: message.media_url }} style={styles.mediaImage} resizeMode="cover" />
          </TouchableOpacity>
        ) : message.media_url && message.media_type === 'video' ? (
          <TouchableOpacity
            style={styles.videoThumb}
            onPress={() => message.media_url && Linking.openURL(message.media_url)}
          >
            <Ionicons name="play-circle" size={40} color={Colors.textPrimary} />
            <Text style={styles.videoLabel}>Tap to open video</Text>
          </TouchableOpacity>
        ) : null}
        {message.body ? (
          <Text style={[styles.bubbleText, isOwn ? styles.bubbleTextOwn : styles.bubbleTextOther]}>
            {message.body}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.timeText, isOwn ? styles.timeTextOwn : styles.timeTextOther]}>{time}</Text>
    </View>
  );
}

export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, markRead } = useMessages(conversationId);
  const { conversations } = useConversations();

  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherUser = conversation?.other_user;

  // Reset draft when switching conversations (component may reuse across nav)
  useEffect(() => {
    setDraft('');
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      markRead();
    }
  }, [messages.length, conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || isSending) return;
    setIsSending(true);
    try {
      await sendMessage.mutateAsync({ body: text });
      setDraft('');
    } catch (err: any) {
      Alert.alert('Send failed', err.message ?? 'Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const isVideo = asset.mimeType?.startsWith('video') || asset.uri.endsWith('.mp4');
    const filename = asset.fileName ?? `media_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;
    const contentType = asset.mimeType ?? (isVideo ? 'video/mp4' : 'image/jpeg');
    const tempMsgId = `msg_${Date.now()}`;
    const storagePath = messagePath(conversationId!, tempMsgId, filename);

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const { publicUrl } = await uploadMedia({
        fileUri: asset.uri,
        storagePath,
        contentType,
        onProgress: setUploadProgress,
      });
      await sendMessage.mutateAsync({
        mediaUrl: publicUrl,
        mediaType: isVideo ? 'video' : 'image',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>
            {otherUser?.full_name?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.headerName} numberOfLines={1}>
          {otherUser?.full_name ?? 'Conversation'}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="chatbubble-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => (
              <MessageBubble message={item} isOwn={item.sender_id === user?.id} />
            )}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          />
        )}

        {isUploading && (
          <View style={styles.uploadBar}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(uploadProgress * 100)}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{Math.round(uploadProgress * 100)}%</Text>
          </View>
        )}

        <View style={styles.inputBar}>
          <TouchableOpacity onPress={handlePickMedia} style={styles.attachBtn} disabled={isUploading}>
            <Ionicons name="attach-outline" size={24} color={isUploading ? Colors.textMuted : Colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={Colors.textMuted}
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={1000}
            returnKeyType="default"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!draft.trim() || isSending}
            style={[styles.sendBtn, (!draft.trim() || isSending) && styles.sendBtnDisabled]}
          >
            <Ionicons name="send" size={18} color={Colors.bg} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  backBtn: { padding: 2 },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  headerName: { flex: 1, fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  messageList: { padding: 16, gap: 12, paddingBottom: 8 },
  bubbleWrapper: { maxWidth: '80%', gap: 3 },
  bubbleWrapperOwn: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubbleWrapperOther: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  senderName: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, marginLeft: 4 },
  bubble: { borderRadius: 18, overflow: 'hidden', maxWidth: '100%' },
  bubbleOwn: { backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleOther: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTextOwn: { color: Colors.bg },
  bubbleTextOther: { color: Colors.textPrimary },
  mediaImage: { width: 200, height: 150, borderRadius: 12 },
  videoThumb: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  videoLabel: { fontSize: 12, color: Colors.textMuted },
  timeText: { fontSize: 10, color: Colors.textMuted, marginHorizontal: 4 },
  timeTextOwn: { alignSelf: 'flex-end' },
  timeTextOther: { alignSelf: 'flex-start' },
  uploadBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: 3, backgroundColor: Colors.primary, borderRadius: 2 },
  progressLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, minWidth: 30, textAlign: 'right' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  attachBtn: { padding: 6, paddingBottom: 8 },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxHeight: 120,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.35 },
});

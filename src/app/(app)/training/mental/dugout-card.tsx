import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const ACCENT = '#8b5cf6';

interface DugoutCardData {
  identity_cue: string;
  approach_reminder: string;
  reset_cue: string;
  breathing_cue: string;
  focus_cue: string;
  confidence_statement: string;
}

const MAX_LEN = 60;

const DEFAULTS: DugoutCardData = {
  identity_cue:         'Calm and aggressive',
  approach_reminder:    'Middle of the field',
  reset_cue:            'Next pitch',
  breathing_cue:        'Slow inhale, slow exhale',
  focus_cue:            'See it deep',
  confidence_statement: 'I prepared for this',
};

interface FieldDef {
  key: keyof DugoutCardData;
  label: string;
  prompt: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const FIELDS: FieldDef[] = [
  { key: 'identity_cue', label: 'IDENTITY', prompt: 'Who are you when you step in the box?', icon: 'person-outline', color: '#a855f7' },
  { key: 'approach_reminder', label: 'APPROACH', prompt: 'What is your hitting approach?', icon: 'baseball-outline', color: '#E10600' },
  { key: 'reset_cue', label: 'RESET', prompt: 'What do you say after a bad swing?', icon: 'refresh-outline', color: '#3b82f6' },
  { key: 'breathing_cue', label: 'BREATHE', prompt: 'What reminds you to slow the game down?', icon: 'leaf-outline', color: '#22c55e' },
  { key: 'focus_cue', label: 'FOCUS', prompt: 'What do you lock into before the pitch?', icon: 'locate-outline', color: '#f59e0b' },
  { key: 'confidence_statement', label: 'CONFIDENCE', prompt: 'What reminds you you\'re ready?', icon: 'shield-checkmark-outline', color: '#ef4444' },
];

function resolveCard(row: Partial<DugoutCardData> | null): DugoutCardData {
  return {
    identity_cue:         row?.identity_cue         || DEFAULTS.identity_cue,
    approach_reminder:    row?.approach_reminder    || DEFAULTS.approach_reminder,
    reset_cue:            row?.reset_cue            || DEFAULTS.reset_cue,
    breathing_cue:        row?.breathing_cue        || DEFAULTS.breathing_cue,
    focus_cue:            row?.focus_cue            || DEFAULTS.focus_cue,
    confidence_statement: row?.confidence_statement || DEFAULTS.confidence_statement,
  };
}

const LOCAL_STORAGE_KEY = 'otc:dugout-card';

export default function DugoutCardScreen() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [gameMode, setGameMode] = useState(false);
  const [draft, setDraft] = useState<DugoutCardData>(DEFAULTS);
  const [localFallback, setLocalFallback] = useState<Partial<DugoutCardData> | null>(null);

  // Load local fallback on mount
  useEffect(() => {
    AsyncStorage.getItem(LOCAL_STORAGE_KEY).then((val) => {
      if (val) try { setLocalFallback(JSON.parse(val)); } catch {}
    });
  }, []);

  const { data: row, isLoading } = useQuery({
    queryKey: ['dugout-card', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dugout_cards')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) {
        // Fall back to local storage if Supabase fails
        const local = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) return JSON.parse(local) as Partial<DugoutCardData>;
        return null;
      }
      // Sync to local storage as backup
      if (data) AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return data as Partial<DugoutCardData> | null;
    },
  });

  const card = resolveCard(row ?? localFallback ?? null);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: async (updates: DugoutCardData) => {
      // Always save locally first
      await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updates));

      if (!user?.id) throw new Error('Not signed in');

      const { error } = await supabase
        .from('dugout_cards')
        .upsert(
          { user_id: user.id, ...updates, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dugout-card', user?.id] });
      setIsEditing(false);
    },
    onError: (err) => {
      // Data is still saved locally, so inform user but don't lose data
      Alert.alert(
        'Sync Issue',
        'Your Dugout Card was saved locally but couldn\'t sync to the cloud. It will sync next time you have a connection.',
      );
      setIsEditing(false);
    },
  });

  const handleEditPress = () => { setDraft({ ...card }); setIsEditing(true); };
  const handleCancel = () => setIsEditing(false);
  const handleSave = () => save(draft);
  const updateField = (key: keyof DugoutCardData, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value.slice(0, MAX_LEN) }));
  };

  // Game Mode
  if (gameMode) {
    return (
      <SafeAreaView style={styles.gameSafe}>
        <View style={styles.gameHeader}>
          <TouchableOpacity onPress={() => setGameMode(false)} style={styles.gameExitBtn}>
            <Ionicons name="chevron-down" size={22} color="#fff" />
            <Text style={styles.gameExitText}>EXIT GAME MODE</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.gameContent}>
          <Text style={styles.gameTitle}>DUGOUT CARD</Text>
          {FIELDS.map((f) => (
            <View key={f.key} style={styles.gameRow}>
              <Text style={[styles.gameLabel, { color: f.color }]}>{f.label}</Text>
              <Text style={styles.gameValue}>{card[f.key]}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Edit Mode
  if (isEditing) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>EDIT</Text>
            <Text style={styles.headerTitle}>Dugout Card</Text>
          </View>
          <TouchableOpacity
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveBtnText}>{isSaving ? 'Saving…' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.editContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {FIELDS.map((f) => {
              const val = draft[f.key];
              const remaining = MAX_LEN - val.length;
              return (
                <View key={f.key} style={styles.editField}>
                  <View style={styles.editFieldHeader}>
                    <View style={[styles.editFieldIcon, { backgroundColor: `${f.color}20` }]}>
                      <Ionicons name={f.icon} size={16} color={f.color} />
                    </View>
                    <Text style={[styles.editFieldLabel, { color: f.color }]}>{f.label}</Text>
                  </View>
                  <Text style={styles.editPrompt}>{f.prompt}</Text>
                  <View style={styles.editInputWrap}>
                    <TextInput
                      style={styles.editInput}
                      value={val}
                      onChangeText={(t) => updateField(f.key, t)}
                      placeholder={DEFAULTS[f.key]}
                      placeholderTextColor={colors.textMuted}
                      maxLength={MAX_LEN}
                      returnKeyType="done"
                    />
                    <Text style={[styles.charCount, remaining <= 10 && styles.charCountWarn]}>{remaining}</Text>
                  </View>
                </View>
              );
            })}
            <View style={styles.editTip}>
              <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
              <Text style={styles.editTipText}>Keep it short. These cues need to work in 2 seconds between pitches.</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Normal View
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>MENTAL TOOL</Text>
          <Text style={styles.headerTitle}>Dugout Card</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={handleEditPress}>
          <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.gameModeRow} onPress={() => setGameMode(true)} activeOpacity={0.8}>
          <View style={styles.gameModeLeft}>
            <Ionicons name="game-controller-outline" size={18} color={ACCENT} />
            <Text style={styles.gameModeLabel}>Game Mode</Text>
            <Text style={styles.gameModeDesc}>Full-screen, enlarged view for in-dugout reading</Text>
          </View>
          <View style={styles.gameModeArrow}>
            <Ionicons name="chevron-forward" size={16} color={ACCENT} />
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="document-text" size={16} color="#E10600" />
            <Text style={styles.cardTitleText}>DUGOUT CARD</Text>
            {!isLoading && !row && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            )}
          </View>
          {FIELDS.map((f, i) => (
            <View key={f.key} style={[styles.cardRow, i < FIELDS.length - 1 && styles.cardRowBorder]}>
              <View style={[styles.cardRowIcon, { backgroundColor: `${f.color}18` }]}>
                <Ionicons name={f.icon} size={14} color={f.color} />
              </View>
              <View style={styles.cardRowBody}>
                <Text style={[styles.cardRowLabel, { color: f.color }]}>{f.label}</Text>
                <Text style={styles.cardRowValue}>{card[f.key]}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>HOW TO USE</Text>
          {['Read before every game. Every time. No exceptions.',
            'Use Game Mode in the dugout for a quick full-screen glance.',
            'Tap the pencil icon to personalize your cues.',
          ].map((t, i) => (
            <View key={i} style={styles.instructionRow}>
              <View style={styles.instructionDot} />
              <Text style={styles.instructionText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tip}>
          <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
          <Text style={styles.tipText}>
            High performers use process cards to remove decision fatigue.
            Your cues are already decided — so when pressure hits, you don't think. You execute.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  label: { fontSize: 10, fontWeight: '800', color: ACCENT, letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  editBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 16, gap: 14, paddingBottom: 48 },

  gameModeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: `${ACCENT}10`, borderWidth: 1, borderColor: `${ACCENT}30`,
    borderRadius: 12, padding: 14,
  },
  gameModeLeft: { flex: 1, gap: 2 },
  gameModeLabel: { fontSize: 14, fontWeight: '800', color: ACCENT },
  gameModeDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  gameModeArrow: { flexShrink: 0 },

  card: {
    backgroundColor: colors.surface, borderWidth: 2, borderColor: '#E1060035',
    borderRadius: 16, padding: 16,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardTitleText: { flex: 1, fontSize: 12, fontWeight: '900', color: '#E10600', letterSpacing: 1.5 },
  defaultBadge: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  defaultBadgeText: { fontSize: 9, fontWeight: '800', color: colors.textMuted, letterSpacing: 1 },

  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10 },
  cardRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  cardRowIcon: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
  },
  cardRowBody: { flex: 1, gap: 3 },
  cardRowLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  cardRowValue: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, lineHeight: 22 },

  instructions: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 14, gap: 10,
  },
  instructionsTitle: { fontSize: 9, fontWeight: '900', color: colors.textMuted, letterSpacing: 1.5, marginBottom: 2 },
  instructionRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  instructionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textMuted, marginTop: 7, flexShrink: 0 },
  instructionText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  tip: {
    flexDirection: 'row', gap: 10, padding: 14,
    backgroundColor: '#f59e0b0d', borderWidth: 1, borderColor: '#f59e0b30',
    borderRadius: 12, alignItems: 'flex-start',
  },
  tipText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  // Edit Mode
  saveBtn: { backgroundColor: '#E10600', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontSize: 14, fontWeight: '800', color: colors.bg },
  editContent: { padding: 16, gap: 14, paddingBottom: 48 },
  editField: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 14, gap: 8,
  },
  editFieldHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  editFieldIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  editFieldLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  editPrompt: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  editInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
  },
  editInput: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary, padding: 0 },
  charCount: { fontSize: 11, fontWeight: '700', color: colors.textMuted, width: 24, textAlign: 'right' },
  charCountWarn: { color: '#ef4444' },
  editTip: { flexDirection: 'row', gap: 8, padding: 12, backgroundColor: colors.surface, borderRadius: 10, alignItems: 'flex-start' },
  editTipText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  // Game Mode
  gameSafe: { flex: 1, backgroundColor: '#000' },
  gameHeader: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#ffffff15' },
  gameExitBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gameExitText: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5 },
  gameContent: { padding: 24, gap: 28, paddingBottom: 60 },
  gameTitle: { fontSize: 13, fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textAlign: 'center', marginBottom: 8 },
  gameRow: { gap: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)', paddingBottom: 22 },
  gameLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  gameValue: { fontSize: 26, fontWeight: '800', color: '#fff', lineHeight: 32 },
});

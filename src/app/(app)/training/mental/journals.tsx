import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useAccountability } from '@/hooks/useAccountability';

const ACCENT = '#8b5cf6';

const GRATITUDE_PROMPTS = [
  'What are 3 things you\'re grateful for today?',
  'What is something baseball has given you that you would not have without it?',
  'Who is someone that has helped you that you are grateful for?',
  'What is one challenge you are grateful for because it made you better?',
  'What is something you get to do that most people don\'t?',
  'What is one opportunity in front of you that you are grateful for right now?',
];

const STANDARD_JOURNALS = [
  { key: 'daily', label: 'Daily Reflection', icon: 'today-outline' as const, color: '#3b82f6', desc: 'Reflect on today — what happened, how you responded, and what you learned.', prompts: undefined as string[] | undefined },
  { key: 'pregame', label: 'Pre-Game Reflection', icon: 'flash-outline' as const, color: '#22c55e', desc: 'Set your intention. What is your approach? What are you focused on? How will you compete?', prompts: ['What is my approach today?', 'What one thing am I focused on?', 'How do I want to compete today?'] },
  { key: 'game_day', label: 'Post-Game Reflection', icon: 'baseball-outline' as const, color: '#E10600', desc: 'Review what happened. What went well? What broke down? What will you do differently?', prompts: ['What went well today?', 'Where did my mental game break down?', 'What is my one focus for next game?'] },
  { key: 'weekly', label: 'Weekly Reflection', icon: 'calendar-outline' as const, color: '#f59e0b', desc: 'Look back on the week. Patterns, wins, areas to grow.', prompts: ['What patterns did I see this week?', 'What was my best mental moment?', 'What do I need to improve next week?'] },
  { key: 'confidence', label: 'Confidence Journal', icon: 'shield-checkmark-outline' as const, color: '#f97316', desc: 'Stack evidence that you belong. Write proof of your ability.', prompts: ['What are 3 things I did well recently?', 'What evidence proves I am capable?', 'What is something I have overcome that proves I am tough?'] },
  { key: 'self_talk', label: 'Self-Talk Journal', icon: 'megaphone-outline' as const, color: '#84cc16', desc: 'Audit your internal voice. Catch negative thoughts and replace them.', prompts: ['What negative thoughts showed up today?', 'What would a great coach say instead?', 'What is my top cue word for tomorrow?'] },
  { key: 'pressure', label: 'Pressure Journal', icon: 'flame-outline' as const, color: '#e11d48', desc: 'Process pressure moments. Learn from them instead of avoiding them.', prompts: ['When did I feel pressure today?', 'How did my body respond?', 'What would it look like to thrive in that moment next time?'] },
  { key: 'mistake_recovery', label: 'Mistake Recovery Journal', icon: 'refresh-outline' as const, color: '#0891b2', desc: 'Process mistakes without carrying them. Extract the lesson. Move on.', prompts: ['What mistake am I holding onto?', 'What did I learn from it?', 'What will I do differently next time? Now let it go.'] },
  { key: 'gratitude', label: 'Gratitude Journal', icon: 'heart-outline' as const, color: '#a855f7', desc: 'Train your brain to find the good. Gratitude builds resilience and perspective.', prompts: GRATITUDE_PROMPTS },
];

type Screen = 'list' | 'write';

interface JournalTarget {
  key: string;
  label: string;
  color: string;
  prompts: string[];
}

export default function JournalsScreen() {
  const { type: deepLinkType } = useLocalSearchParams<{ type?: string }>();
  const { hasFullMental, isCoach } = useTier();
  const canAccess = hasFullMental || isCoach;
  const { markJournalDoneToday } = useAccountability();

  const [screen, setScreen] = useState<Screen>('list');
  const [target, setTarget] = useState<JournalTarget | null>(null);
  const [entry, setEntry] = useState('');
  const [saved, setSaved] = useState(false);
  const [deepLinked, setDeepLinked] = useState(false);

  const dayIdx = Math.floor(Date.now() / 86_400_000);

  // Auto-open a specific journal when deep-linked from Daily Work
  useEffect(() => {
    if (deepLinked || !deepLinkType) return;
    const match = STANDARD_JOURNALS.find(j => j.key === deepLinkType);
    if (match) {
      setDeepLinked(true);
      openJournal({
        key: match.key,
        label: match.label,
        color: match.color,
        prompts: match.prompts ?? [match.desc],
      });
    }
  }, [deepLinkType, deepLinked]);

  const openJournal = async (t: JournalTarget) => {
    setTarget(t);
    setSaved(false);
    // Load previous entry for today if it exists
    try {
      const key = `otc:journal:${t.key}:${dayIdx}`;
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setEntry(parsed.entry ?? '');
        setSaved(true); // Show as saved since it was loaded
      } else {
        setEntry('');
      }
    } catch {
      setEntry('');
    }
    setScreen('write');
  };

  const handleSave = async () => {
    if (!entry.trim() || !target) return;
    const key = `otc:journal:${target.key}:${dayIdx}`;
    await AsyncStorage.setItem(key, JSON.stringify({ entry, timestamp: Date.now() }));
    await markJournalDoneToday();
    setSaved(true);
  };

  // Write screen
  if (screen === 'write' && target) {
    const prompt = target.prompts[dayIdx % target.prompts.length];
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreen('list')} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: target.color }]}>{target.label.toUpperCase()}</Text>
            <Text style={styles.headerTitle}>Journal Entry</Text>
          </View>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.writeContent} keyboardShouldPersistTaps="handled">
            <View style={[styles.promptCard, { borderColor: target.color + '30' }]}>
              <Ionicons name="chatbox-ellipses-outline" size={16} color={target.color} />
              <Text style={styles.promptText}>{prompt}</Text>
            </View>

            <TextInput
              style={styles.textArea}
              placeholder="Start writing..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              value={entry}
              onChangeText={setEntry}
              autoFocus
            />

            {saved ? (
              <View style={styles.savedBanner}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.savedText}>Entry saved</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.saveBtn, !entry.trim() && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!entry.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Save Entry</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // List screen
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.label}>MENTAL VAULT</Text>
          <Text style={styles.headerTitle}>Journals</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Journaling builds awareness, processes emotion, and creates a record of your mental growth. Pick a format that fits today.
        </Text>

        {/* Standard Journals */}
        <Text style={styles.sectionLabel}>STANDARD JOURNALS</Text>
        {STANDARD_JOURNALS.map((j) => (
          <TouchableOpacity
            key={j.key}
            style={styles.card}
            onPress={() => openJournal({ key: j.key, label: j.label, color: j.color, prompts: j.prompts ?? [j.desc] })}
            activeOpacity={0.85}
          >
            <View style={[styles.cardIcon, { backgroundColor: j.color + '18' }]}>
              <Ionicons name={j.icon} size={22} color={j.color} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{j.label}</Text>
              <Text style={styles.cardSub}>{j.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

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
  content: { padding: 16, gap: 10, paddingBottom: 48 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4 },

  sectionLabel: { fontSize: 10, fontWeight: '900', color: colors.textMuted, letterSpacing: 1.4, marginTop: 4 },
  skillJournalIntro: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginBottom: 4 },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  cardLocked: { opacity: 0.5 },
  cardIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  cardTitleLocked: { color: colors.textMuted },
  cardSub: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14,
  },
  upgradeBannerText: { flex: 1, fontSize: 13, fontWeight: '700', color: ACCENT },

  // Write screen
  writeContent: { padding: 16, gap: 14, paddingBottom: 48 },
  promptCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg, padding: 14,
  },
  promptText: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 20, fontStyle: 'italic' },
  textArea: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, minHeight: 200,
    fontSize: 15, color: colors.textPrimary, lineHeight: 22,
  },
  saveBtn: {
    backgroundColor: ACCENT, paddingVertical: 16, borderRadius: radius.lg,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  savedBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#22c55e12', borderWidth: 1, borderColor: '#22c55e30',
    borderRadius: radius.lg, paddingVertical: 16,
  },
  savedText: { fontSize: 15, fontWeight: '800', color: '#22c55e' },
});

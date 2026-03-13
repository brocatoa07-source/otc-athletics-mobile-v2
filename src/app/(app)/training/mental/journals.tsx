import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { MENTAL_SKILLS } from '@/data/skillsJournal';
import { SKILL_JOURNAL_CONFIG, type SkillJournalType } from '@/data/skill-journal-prompts';
import { useTier } from '@/hooks/useTier';

const ACCENT = '#8b5cf6';

const STANDARD_JOURNALS = [
  { key: 'daily', label: 'Daily Entry', icon: 'today-outline' as const, color: '#3b82f6', desc: 'Reflect on today — what happened, how you responded, and what you learned.' },
  { key: 'game_day', label: 'Game Day', icon: 'baseball-outline' as const, color: '#E10600', desc: 'Pre-game and post-game thoughts. Mental approach, adjustments, takeaways.' },
  { key: 'mental_reset', label: 'Mental Reset', icon: 'refresh-outline' as const, color: '#22c55e', desc: 'After a rough day. Brain dump, release, and set a new intention.' },
  { key: 'weekly', label: 'Weekly Review', icon: 'calendar-outline' as const, color: '#f59e0b', desc: 'Look back on the week. Patterns, wins, areas to grow.' },
  { key: 'weekly_reflection', label: 'Weekly Reflection', icon: 'sparkles-outline' as const, color: '#a855f7', desc: 'Deeper reflection. What kind of competitor are you becoming?' },
];

type Screen = 'list' | 'write';

interface JournalTarget {
  key: string;
  label: string;
  color: string;
  prompts: string[];
}

export default function JournalsScreen() {
  const { hasFullMental, isCoach } = useTier();
  const canAccess = hasFullMental || isCoach;

  const [screen, setScreen] = useState<Screen>('list');
  const [target, setTarget] = useState<JournalTarget | null>(null);
  const [entry, setEntry] = useState('');
  const [saved, setSaved] = useState(false);

  const dayIdx = Math.floor(Date.now() / 86_400_000);

  const openJournal = (t: JournalTarget) => {
    setTarget(t);
    setEntry('');
    setSaved(false);
    setScreen('write');
  };

  const handleSave = async () => {
    if (!entry.trim() || !target) return;
    const key = `otc:journal:${target.key}:${dayIdx}`;
    await AsyncStorage.setItem(key, JSON.stringify({ entry, timestamp: Date.now() }));
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
            onPress={() => openJournal({ key: j.key, label: j.label, color: j.color, prompts: [j.desc] })}
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

        {/* Skill Journals */}
        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>SKILL JOURNALS</Text>
        <Text style={styles.skillJournalIntro}>
          Targeted reflection tied to specific mental skills. Each journal rotates through 3 prompts.
        </Text>

        {MENTAL_SKILLS.map((skill, i) => {
          const config = SKILL_JOURNAL_CONFIG[`skill_${skill.key}` as SkillJournalType];
          if (!config) return null;
          const locked = !canAccess && i >= 4;
          return (
            <TouchableOpacity
              key={skill.key}
              style={[styles.card, locked && styles.cardLocked]}
              onPress={() => !locked && openJournal({
                key: `skill_${skill.key}`,
                label: config.label,
                color: config.color,
                prompts: config.prompts,
              })}
              activeOpacity={locked ? 1 : 0.85}
            >
              <View style={[styles.cardIcon, { backgroundColor: config.color + '18' }]}>
                <Ionicons name={locked ? 'lock-closed-outline' : config.icon} size={22} color={locked ? colors.textMuted : config.color} />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, locked && styles.cardTitleLocked]}>{config.label}</Text>
                <Text style={styles.cardSub}>{skill.builds}</Text>
              </View>
              {!locked && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
            </TouchableOpacity>
          );
        })}

        {!canAccess && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
            <Text style={styles.upgradeBannerText}>Upgrade to Double for all skill journals</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}
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

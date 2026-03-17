import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  type GameLog,
  type GameType,
  generateId,
  saveGame,
} from '@/data/at-bat-accountability';

const ACCENT = '#E10600';

const GAME_TYPES: { value: GameType; label: string }[] = [
  { value: 'game', label: 'Game' },
  { value: 'scrimmage', label: 'Scrimmage' },
  { value: 'practice', label: 'Practice' },
];

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function LogGameScreen() {
  const [date, setDate] = useState(getTodayString());
  const [opponent, setOpponent] = useState('');
  const [gameType, setGameType] = useState<GameType>('game');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      const game: GameLog = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        date,
        opponent: opponent.trim() || undefined,
        gameType,
        note: note.trim() || undefined,
      };
      await saveGame(game);
      // Navigate to add at-bats for this game
      router.replace(`/(app)/training/mechanical/edit-at-bat?gameId=${game.id}&orderIndex=0` as any);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>AT-BAT ACCOUNTABILITY</Text>
          <Text style={styles.headerTitle}>Log Game</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DATE</Text>
          <TextInput
            style={styles.textInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Opponent */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>OPPONENT (OPTIONAL)</Text>
          <TextInput
            style={styles.textInput}
            value={opponent}
            onChangeText={setOpponent}
            placeholder="e.g. Rivals"
            placeholderTextColor={colors.textMuted}
            maxLength={60}
          />
        </View>

        {/* Game Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>GAME TYPE</Text>
          <View style={styles.chipRow}>
            {GAME_TYPES.map((gt) => (
              <TouchableOpacity
                key={gt.value}
                style={[styles.chip, gameType === gt.value && styles.chipActive]}
                onPress={() => setGameType(gt.value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, gameType === gt.value && styles.chipTextActive]}>
                  {gt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>GAME NOTE (OPTIONAL)</Text>
          <TextInput
            style={[styles.textInput, { height: 60, textAlignVertical: 'top' }]}
            value={note}
            onChangeText={setNote}
            placeholder="Quick note about the game..."
            placeholderTextColor={colors.textMuted}
            maxLength={120}
            multiline
          />
          <Text style={styles.charCount}>{note.length}/120</Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>Save & Add At-Bats</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 16, paddingBottom: 120, gap: 20 },

  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  textInput: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
    fontSize: 15, fontWeight: '700', color: colors.textPrimary,
  },
  charCount: { fontSize: 10, color: colors.textMuted, textAlign: 'right' },

  chipRow: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { borderColor: ACCENT, backgroundColor: ACCENT + '15' },
  chipText: { fontSize: 14, fontWeight: '800', color: colors.textSecondary },
  chipTextActive: { color: ACCENT },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, paddingBottom: 32,
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border,
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 14,
  },
  saveBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
});

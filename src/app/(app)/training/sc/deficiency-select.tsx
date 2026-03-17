import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import {
  DEFICIENCY_META,
  saveStrengthProfile,
  type BaseballPosition,
  type MovementDeficiency,
  type StrengthArchetype,
} from '@/data/strength-profile';
import {
  generateProgram,
  saveGeneratedProgram,
  initStrengthProgress,
} from '@/data/strength-program-engine';

const ACCENT = '#1DB954';

const DEFICIENCIES: { key: MovementDeficiency; meta: typeof DEFICIENCY_META[MovementDeficiency] }[] = [
  { key: 'hip_mobility', meta: DEFICIENCY_META.hip_mobility },
  { key: 'shoulder_stability', meta: DEFICIENCY_META.shoulder_stability },
  { key: 'acceleration_weakness', meta: DEFICIENCY_META.acceleration_weakness },
];

export default function DeficiencySelectScreen() {
  const { position } = useLocalSearchParams<{ position: string }>();
  const [selected, setSelected] = useState<MovementDeficiency | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    if (!selected || !position || saving) return;
    setSaving(true);

    try {
      // Load mover type from AsyncStorage
      const moverType = (await AsyncStorage.getItem('otc:lifting-mover-type')) as StrengthArchetype | null;
      if (!moverType) {
        // Fallback — shouldn't happen since quiz must be done first
        router.back();
        return;
      }

      const profile = {
        archetype: moverType,
        position: position as BaseballPosition,
        deficiency: selected,
        updatedAt: new Date().toISOString(),
      };

      // Save profile
      await saveStrengthProfile(profile);

      // Generate and save program
      const program = generateProgram(profile);
      await saveGeneratedProgram(program);

      // Init progress tracking
      await initStrengthProgress();

      // Navigate to vault
      router.replace('/(app)/training/sc' as any);
    } catch (err) {
      if (__DEV__) console.warn('[deficiency-select] error:', err);
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>STRENGTH SETUP</Text>
          <Text style={styles.headerTitle}>Movement Focus</Text>
        </View>
        <Text style={styles.stepBadge}>Step 2 of 2</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Select the area where your body needs the most work. This determines which corrective exercises get added to your program.
        </Text>

        {DEFICIENCIES.map(({ key, meta }) => {
          const isSelected = selected === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.optionCard,
                isSelected && { borderColor: ACCENT, backgroundColor: ACCENT + '08' },
              ]}
              onPress={() => setSelected(key)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.optionIcon,
                { backgroundColor: isSelected ? ACCENT + '20' : colors.surfaceElevated },
              ]}>
                <Ionicons
                  name={meta.icon as any}
                  size={28}
                  color={isSelected ? ACCENT : colors.textMuted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionLabel, isSelected && { color: ACCENT }]}>
                  {meta.label}
                </Text>
                <Text style={styles.optionDesc}>{meta.description}</Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color={ACCENT} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
          <Text style={styles.noteText}>
            Not sure? Pick the one your coaches or trainers have mentioned most. You can update this later.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.finishBtn, (!selected || saving) && { opacity: 0.4 }]}
          onPress={handleFinish}
          activeOpacity={0.85}
          disabled={!selected || saving}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.finishBtnText}>
            {saving ? 'Generating Program...' : 'Generate My Program'}
          </Text>
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  stepBadge: { fontSize: 11, fontWeight: '700', color: colors.textMuted },

  content: { padding: 16, paddingBottom: 100, gap: 12 },

  intro: {
    fontSize: 14, fontWeight: '600', color: colors.textSecondary, lineHeight: 21,
  },

  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.lg, padding: 18,
  },
  optionIcon: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  optionLabel: { fontSize: 17, fontWeight: '900', color: colors.textPrimary },
  optionDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 3 },

  noteCard: {
    flexDirection: 'row', gap: 10, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.md,
  },
  noteText: { flex: 1, fontSize: 13, color: colors.textMuted, lineHeight: 19 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, paddingBottom: 32,
    backgroundColor: colors.bg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  finishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: ACCENT, paddingVertical: 16, borderRadius: radius.md,
  },
  finishBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
});

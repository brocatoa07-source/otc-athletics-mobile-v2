import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import {
  DAYS_PER_WEEK_OPTIONS, SEASON_PHASE_META,
  GOAL_META, GYM_ACCESS_META,
  saveStrengthProfile,
  type BaseballPosition, type MovementDeficiency, type StrengthArchetype,
  type DaysPerWeek, type SeasonPhase, type ProgramDuration, type PrimaryGoal, type GymAccess,
} from '@/data/strength-profile';
import {
  generateProgram, saveGeneratedProgram, initStrengthProgress,
} from '@/data/strength-program-engine';

const ACCENT = '#1DB954';
const SEASON_PHASES: SeasonPhase[] = ['OFFSEASON', 'PRESEASON', 'IN_SEASON'];
const GOALS: PrimaryGoal[] = ['get_stronger', 'get_faster', 'maintain_in_season', 'improve_mobility', 'return_from_layoff'];
const GYM_OPTIONS: GymAccess[] = ['full_gym', 'limited_gym', 'home_bodyweight'];

export default function TrainingConfigScreen() {
  const { position, deficiency } = useLocalSearchParams<{ position: string; deficiency: string }>();

  const [seasonPhase, setSeasonPhase] = useState<SeasonPhase>('OFFSEASON');
  const [daysPerWeek, setDaysPerWeek] = useState<DaysPerWeek>(3);
  const [duration, setDuration] = useState<ProgramDuration>(6);
  const [goal, setGoal] = useState<PrimaryGoal>('get_stronger');
  const [gymAccess, setGymAccess] = useState<GymAccess>('full_gym');
  const [limitations, setLimitations] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    if (!position || !deficiency || saving) return;
    setSaving(true);
    try {
      const moverType = (await AsyncStorage.getItem('otc:lifting-mover-type')) as StrengthArchetype | null;
      if (!moverType) { router.back(); return; }

      const profile = {
        archetype: moverType,
        position: position as BaseballPosition,
        deficiency: deficiency as MovementDeficiency,
        daysPerWeek,
        seasonPhase,
        programDurationMonths: duration,
        primaryGoal: goal,
        gymAccess,
        limitations: limitations.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };

      await saveStrengthProfile(profile);
      const program = generateProgram(profile);
      await saveGeneratedProgram(program);
      await initStrengthProgress();
      router.replace('/(app)/training/sc' as any);
    } catch (err) {
      if (__DEV__) console.warn('[training-config] error:', err);
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
          <Text style={styles.headerTitle}>Program Setup</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 1. Season Phase */}
        <Text style={styles.sectionLabel}>WHAT PART OF THE SEASON ARE YOU IN?</Text>
        <Text style={styles.intro}>This changes the volume, intensity, and emphasis of your program.</Text>
        {SEASON_PHASES.map((phase) => {
          const meta = SEASON_PHASE_META[phase];
          const selected = seasonPhase === phase;
          return (
            <TouchableOpacity
              key={phase}
              style={[styles.optionCard, selected && { borderColor: meta.color, backgroundColor: meta.color + '08' }]}
              onPress={() => setSeasonPhase(phase)}
              activeOpacity={0.7}
            >
              <Ionicons name={meta.icon as any} size={20} color={selected ? meta.color : colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionTitle, selected && { color: meta.color }]}>{meta.label}</Text>
                <Text style={styles.optionDesc}>{meta.description}</Text>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={18} color={meta.color} />}
            </TouchableOpacity>
          );
        })}

        {/* 2. Days Per Week */}
        <Text style={styles.sectionLabel}>HOW MANY DAYS PER WEEK?</Text>
        <View style={styles.chipRow}>
          {DAYS_PER_WEEK_OPTIONS.map(({ value, label }) => {
            const selected = daysPerWeek === value;
            return (
              <TouchableOpacity
                key={value}
                style={[styles.chip, selected && { borderColor: ACCENT, backgroundColor: ACCENT + '15' }]}
                onPress={() => setDaysPerWeek(value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, selected && { color: ACCENT }]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Duration */}
        <Text style={styles.sectionLabel}>HOW LONG SHOULD THE PROGRAM BE?</Text>
        <View style={styles.chipRow}>
          {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((m) => {
            const selected = duration === m;
            return (
              <TouchableOpacity
                key={m}
                style={[styles.chip, selected && { borderColor: ACCENT, backgroundColor: ACCENT + '15' }]}
                onPress={() => setDuration(m as ProgramDuration)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, selected && { color: ACCENT }]}>{m} mo</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4. Primary Goal */}
        <Text style={styles.sectionLabel}>PRIMARY GOAL</Text>
        {GOALS.map((g) => {
          const meta = GOAL_META[g];
          const selected = goal === g;
          return (
            <TouchableOpacity
              key={g}
              style={[styles.optionCard, selected && { borderColor: meta.color, backgroundColor: meta.color + '08' }]}
              onPress={() => setGoal(g)}
              activeOpacity={0.7}
            >
              <Ionicons name={meta.icon as any} size={18} color={selected ? meta.color : colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionTitle, selected && { color: meta.color }]}>{meta.label}</Text>
                <Text style={styles.optionDesc}>{meta.description}</Text>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={18} color={meta.color} />}
            </TouchableOpacity>
          );
        })}

        {/* 5. Gym Access */}
        <Text style={styles.sectionLabel}>GYM ACCESS</Text>
        <View style={styles.chipRow}>
          {GYM_OPTIONS.map((g) => {
            const meta = GYM_ACCESS_META[g];
            const selected = gymAccess === g;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.chip, { minWidth: '30%' }, selected && { borderColor: ACCENT, backgroundColor: ACCENT + '15' }]}
                onPress={() => setGymAccess(g)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, selected && { color: ACCENT }]}>{meta.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 6. Limitations */}
        <Text style={styles.sectionLabel}>LIMITATIONS OR INJURIES (OPTIONAL)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Any current injuries, soreness, or areas to avoid..."
          placeholderTextColor={colors.textMuted}
          value={limitations}
          onChangeText={setLimitations}
          multiline
        />

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>YOUR PROGRAM</Text>
          <Text style={styles.summaryItem}>{SEASON_PHASE_META[seasonPhase].label} · {daysPerWeek} days/week · {duration} months</Text>
          <Text style={styles.summaryItem}>Goal: {GOAL_META[goal].label}</Text>
          <Text style={styles.summaryItem}>Equipment: {GYM_ACCESS_META[gymAccess].label}</Text>
          {limitations.trim() ? <Text style={styles.summaryItem}>Notes: {limitations.trim()}</Text> : null}
        </View>

        {/* Generate */}
        <TouchableOpacity
          style={[styles.generateBtn, saving && { opacity: 0.5 }]}
          onPress={handleFinish}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={18} color="#fff" />
          <Text style={styles.generateBtnText}>{saving ? 'Generating...' : 'Generate My Program'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 10 },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 12 },
  intro: { fontSize: 11, color: colors.textMuted, lineHeight: 16, marginBottom: 4 },

  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  optionTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  optionDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1, lineHeight: 15 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    backgroundColor: colors.surface, alignItems: 'center',
  },
  chipText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },

  textInput: {
    minHeight: 60, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 13, color: colors.textPrimary, textAlignVertical: 'top',
  },

  summaryCard: {
    padding: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: ACCENT + '30', borderRadius: radius.md, gap: 4, marginTop: 8,
  },
  summaryTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: ACCENT },
  summaryItem: { fontSize: 12, color: colors.textSecondary },

  generateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: radius.md, backgroundColor: ACCENT, marginTop: 8,
  },
  generateBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
});

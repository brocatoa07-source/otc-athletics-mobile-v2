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
  DAYS_PER_WEEK_OPTIONS,
  SEASON_PHASE_META,
  saveStrengthProfile,
  type BaseballPosition,
  type MovementDeficiency,
  type StrengthArchetype,
  type DaysPerWeek,
  type SeasonPhase,
} from '@/data/strength-profile';
import {
  generateProgram,
  saveGeneratedProgram,
  initStrengthProgress,
} from '@/data/strength-program-engine';

const ACCENT = '#1DB954';

const SEASON_PHASES: SeasonPhase[] = ['OFFSEASON', 'PRESEASON', 'IN_SEASON'];

export default function TrainingConfigScreen() {
  const { position, deficiency } = useLocalSearchParams<{
    position: string;
    deficiency: string;
  }>();

  const [daysPerWeek, setDaysPerWeek] = useState<DaysPerWeek>(3);
  const [seasonPhase, setSeasonPhase] = useState<SeasonPhase>('OFFSEASON');
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    if (!position || !deficiency || saving) return;
    setSaving(true);

    try {
      const moverType = (await AsyncStorage.getItem('otc:lifting-mover-type')) as StrengthArchetype | null;
      if (!moverType) {
        router.back();
        return;
      }

      const profile = {
        archetype: moverType,
        position: position as BaseballPosition,
        deficiency: deficiency as MovementDeficiency,
        daysPerWeek,
        seasonPhase,
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
          <Text style={styles.headerTitle}>Training Schedule</Text>
        </View>
        <Text style={styles.stepBadge}>Step 3 of 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Days Per Week ──────────────────────── */}
        <Text style={styles.sectionLabel}>DAYS PER WEEK</Text>
        <Text style={styles.intro}>
          How many days per week can you commit to strength training?
        </Text>

        <View style={styles.daysRow}>
          {DAYS_PER_WEEK_OPTIONS.map(({ value, label }) => {
            const isSelected = daysPerWeek === value;
            return (
              <TouchableOpacity
                key={value}
                style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                onPress={() => setDaysPerWeek(value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayChipText, isSelected && styles.dayChipTextSelected]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.dayDescCard}>
          <Ionicons name="calendar-outline" size={16} color={ACCENT} />
          <Text style={styles.dayDescText}>
            {DAYS_PER_WEEK_OPTIONS.find(o => o.value === daysPerWeek)?.description}
          </Text>
        </View>

        {/* ── Season Phase ───────────────────────── */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>SEASON PHASE</Text>
        <Text style={styles.intro}>
          Where are you in your competitive season? This changes volume and training emphasis.
        </Text>

        {SEASON_PHASES.map((phase) => {
          const meta = SEASON_PHASE_META[phase];
          const isSelected = seasonPhase === phase;
          return (
            <TouchableOpacity
              key={phase}
              style={[
                styles.phaseCard,
                isSelected && { borderColor: meta.color, backgroundColor: meta.color + '08' },
              ]}
              onPress={() => setSeasonPhase(phase)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.phaseIcon,
                { backgroundColor: isSelected ? meta.color + '20' : colors.surfaceElevated },
              ]}>
                <Ionicons
                  name={meta.icon as any}
                  size={24}
                  color={isSelected ? meta.color : colors.textMuted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.phaseLabel, isSelected && { color: meta.color }]}>
                  {meta.label}
                </Text>
                <Text style={styles.phaseDesc}>{meta.description}</Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color={meta.color} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
          <Text style={styles.noteText}>
            You can update these settings anytime from My Path. Your program will regenerate with the new configuration.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.finishBtn, saving && { opacity: 0.4 }]}
          onPress={handleFinish}
          activeOpacity={0.85}
          disabled={saving}
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

  content: { padding: 16, paddingBottom: 100, gap: 10 },

  sectionLabel: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 4,
  },

  intro: {
    fontSize: 14, fontWeight: '600', color: colors.textSecondary, lineHeight: 21,
  },

  /* Days per week chips */
  daysRow: {
    flexDirection: 'row', gap: 8, marginTop: 4,
  },
  dayChip: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md,
  },
  dayChipSelected: {
    borderColor: ACCENT, backgroundColor: ACCENT + '10',
  },
  dayChipText: {
    fontSize: 14, fontWeight: '800', color: colors.textMuted,
  },
  dayChipTextSelected: {
    color: ACCENT,
  },

  dayDescCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderRadius: radius.sm,
    padding: 12,
  },
  dayDescText: {
    flex: 1, fontSize: 13, fontWeight: '600', color: colors.textSecondary, lineHeight: 18,
  },

  /* Season phase cards */
  phaseCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16,
  },
  phaseIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  phaseLabel: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  phaseDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 2 },

  noteCard: {
    flexDirection: 'row', gap: 10, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.md, marginTop: 8,
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

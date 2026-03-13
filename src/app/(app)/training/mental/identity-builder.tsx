import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import {
  IDENTITY_PROMPTS,
  HABIT_LOOP_STEPS,
  HABIT_STACKING_EXAMPLES,
  DEFAULT_HABITS,
  type HabitItem,
} from '@/data/identity-data';

const ACCENT = '#8b5cf6';
const STORAGE_KEY = 'otc:identity-builder';

/** Single tier: limited habit examples + limited tracker */
const SINGLE_STACKING_LIMIT = 2;
const SINGLE_HABITS_LIMIT = 3;

interface IdentityState {
  statement: string;
  habitLoop: Record<string, string>;
  habits: Record<string, boolean>;
}

const EMPTY: IdentityState = {
  statement: '',
  habitLoop: {},
  habits: {},
};

export default function IdentityBuilderScreen() {
  const { isWalk, hasFullMental, isCoach } = useTier();
  const canFull = hasFullMental || isCoach;
  const [data, setData] = useState<IdentityState>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try { setData(JSON.parse(val)); } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const persist = (next: IdentityState) => {
    setData(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const setStatement = (s: string) => persist({ ...data, statement: s });
  const setHabitLoopField = (key: string, val: string) =>
    persist({ ...data, habitLoop: { ...data.habitLoop, [key]: val } });
  const toggleHabit = (id: string) =>
    persist({ ...data, habits: { ...data.habits, [id]: !data.habits[id] } });

  const completedHabits = DEFAULT_HABITS.filter((h) => data.habits[h.id]).length;

  const visibleStacking = canFull ? HABIT_STACKING_EXAMPLES : HABIT_STACKING_EXAMPLES.slice(0, SINGLE_STACKING_LIMIT);
  const visibleHabits = canFull ? DEFAULT_HABITS : DEFAULT_HABITS.slice(0, SINGLE_HABITS_LIMIT);

  if (!loaded) return null;

  // Walk tier — fully locked
  if (isWalk) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.label}>MENTAL TOOL</Text>
            <Text style={styles.headerTitle}>Identity Builder</Text>
          </View>
        </View>
        <View style={styles.lockedState}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textMuted} />
          <Text style={styles.lockedTitle}>Identity Builder Locked</Text>
          <Text style={styles.lockedDesc}>
            Upgrade to unlock the Identity Builder with statement creation, habit loops, and daily tracking.
          </Text>
          <TouchableOpacity
            style={[styles.upgradeBtn, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.upgradeBtnText}>Upgrade to Double</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.label}>MENTAL TOOL</Text>
          <Text style={styles.headerTitle}>Identity Builder</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Preview banner for Single tier */}
          {!canFull && (
            <TouchableOpacity
              style={styles.previewBanner}
              onPress={() => router.push('/(app)/upgrade' as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
              <View style={{ flex: 1 }}>
                <Text style={styles.previewTitle}>Preview Mode</Text>
                <Text style={styles.previewSub}>
                  Statement builder + limited habits. Upgrade to Double for full access.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          )}

          {/* Identity Statement — always available for Single+ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#a855f718' }]}>
                <Ionicons name="person-outline" size={18} color="#a855f7" />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Identity Statement</Text>
                <Text style={styles.sectionSub}>Define who you are as a competitor.</Text>
              </View>
            </View>

            <Text style={styles.promptLabel}>CHOOSE OR WRITE YOUR OWN</Text>
            {IDENTITY_PROMPTS.map((p, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.promptChip, data.statement === p && styles.promptChipActive]}
                onPress={() => setStatement(p)}
                activeOpacity={0.8}
              >
                <Text style={[styles.promptChipText, data.statement === p && styles.promptChipTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.textInput}
              placeholder="Or write your own identity statement..."
              placeholderTextColor={colors.textMuted}
              value={data.statement}
              onChangeText={setStatement}
              multiline
            />
          </View>

          {/* Habit Loop — Double+ only */}
          {canFull ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: '#3b82f618' }]}>
                  <Ionicons name="sync-outline" size={18} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Habit Loop Builder</Text>
                  <Text style={styles.sectionSub}>Design one keystone habit using the loop framework.</Text>
                </View>
              </View>

              {HABIT_LOOP_STEPS.map((step) => (
                <View key={step.key} style={styles.loopStep}>
                  <View style={styles.loopStepHeader}>
                    <View style={[styles.loopStepIcon, { backgroundColor: step.color + '18' }]}>
                      <Ionicons name={step.icon} size={14} color={step.color} />
                    </View>
                    <Text style={[styles.loopStepLabel, { color: step.color }]}>{step.label}</Text>
                  </View>
                  <Text style={styles.loopStepDesc}>{step.desc}</Text>
                  <Text style={styles.loopStepExample}>Example: &quot;{step.example}&quot;</Text>
                  <TextInput
                    style={styles.loopInput}
                    placeholder={`Your ${step.label.toLowerCase()}...`}
                    placeholderTextColor={colors.textMuted}
                    value={data.habitLoop[step.key] ?? ''}
                    onChangeText={(t) => setHabitLoopField(step.key, t)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.section, { opacity: 0.5 }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: '#3b82f618' }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Habit Loop Builder</Text>
                  <Text style={styles.sectionSub}>Upgrade to Double to unlock</Text>
                </View>
              </View>
            </View>
          )}

          {/* Habit Stacking — limited for Single */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#22c55e18' }]}>
                <Ionicons name="layers-outline" size={18} color="#22c55e" />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Habit Stacking</Text>
                <Text style={styles.sectionSub}>Attach new habits to things you already do.</Text>
              </View>
            </View>

            {visibleStacking.map((ex, i) => (
              <View key={i} style={styles.stackRow}>
                <Text style={styles.stackCurrent}>After: {ex.current}</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.textMuted} />
                <Text style={styles.stackNext}>{ex.next}</Text>
              </View>
            ))}
            {!canFull && HABIT_STACKING_EXAMPLES.length > SINGLE_STACKING_LIMIT && (
              <TouchableOpacity onPress={() => router.push('/(app)/upgrade' as any)} activeOpacity={0.8}>
                <Text style={styles.upgradeInline}>
                  +{HABIT_STACKING_EXAMPLES.length - SINGLE_STACKING_LIMIT} more — Upgrade to unlock
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Daily Habit Tracker — limited for Single */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: '#f59e0b18' }]}>
                <Ionicons name="checkbox-outline" size={18} color="#f59e0b" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Daily Habits</Text>
                <Text style={styles.sectionSub}>{completedHabits}/{visibleHabits.length} completed today</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${visibleHabits.length > 0 ? (completedHabits / visibleHabits.length) * 100 : 0}%` as any }]} />
            </View>

            {visibleHabits.map((h) => (
              <TouchableOpacity
                key={h.id}
                style={styles.habitRow}
                onPress={() => toggleHabit(h.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={data.habits[h.id] ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={data.habits[h.id] ? '#22c55e' : colors.textMuted}
                />
                <Text style={[styles.habitLabel, data.habits[h.id] && styles.habitLabelDone]}>
                  {h.label}
                </Text>
              </TouchableOpacity>
            ))}
            {!canFull && DEFAULT_HABITS.length > SINGLE_HABITS_LIMIT && (
              <TouchableOpacity onPress={() => router.push('/(app)/upgrade' as any)} activeOpacity={0.8}>
                <Text style={styles.upgradeInline}>
                  +{DEFAULT_HABITS.length - SINGLE_HABITS_LIMIT} more habits — Upgrade to unlock
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tip */}
          <View style={styles.tip}>
            <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
            <Text style={styles.tipText}>
              Identity is built through daily action, not big moments. Small habits done consistently define who you become.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: { padding: 16, gap: 14, paddingBottom: 48 },

  section: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  sectionSub: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  promptLabel: { fontSize: 9, fontWeight: '900', color: colors.textMuted, letterSpacing: 1.2, marginTop: 4 },
  promptChip: {
    backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  promptChipActive: { borderColor: ACCENT + '60', backgroundColor: ACCENT + '10' },
  promptChipText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  promptChipTextActive: { color: ACCENT, fontWeight: '700' },

  textInput: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, minHeight: 60,
    fontSize: 14, color: colors.textPrimary, lineHeight: 20,
  },

  loopStep: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, gap: 6,
  },
  loopStepHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loopStepIcon: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  loopStepLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  loopStepDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  loopStepExample: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },
  loopInput: {
    backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: colors.textPrimary,
  },

  stackRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.bg, borderRadius: radius.sm, padding: 10,
  },
  stackCurrent: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  stackNext: { fontSize: 12, color: '#22c55e', fontWeight: '700', flex: 1 },

  progressTrack: {
    height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 3 },

  habitRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 6,
  },
  habitLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  habitLabelDone: { color: colors.textMuted, textDecorationLine: 'line-through' },

  tip: {
    flexDirection: 'row', gap: 10, padding: 14,
    backgroundColor: '#f59e0b10', borderWidth: 1, borderColor: '#f59e0b30',
    borderRadius: 12,
  },
  tipText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  /* Locked state (Walk tier) */
  lockedState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  lockedTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  lockedDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  upgradeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: radius.lg, marginTop: 4,
  },
  upgradeBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },

  /* Preview banner (Single tier) */
  previewBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14,
  },
  previewTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  previewSub: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginTop: 2 },

  /* Upgrade inline link */
  upgradeInline: { fontSize: 12, fontWeight: '700', color: ACCENT, paddingVertical: 4 },
});

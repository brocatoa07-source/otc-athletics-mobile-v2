import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useGating } from '@/hooks/useGating';
import { MENTAL_PROFILES, type MentalProfileData } from '@/data/mental-profile-data';
import { type MentalDiagnosticResult } from '@/data/mental-struggles-data';
import {
  getRecommendedMentalTools,
  flattenMentalRecommendation,
  type FlatMentalTool,
} from '@/lib/recommendation/mentalRecommendationEngine';
import { SKILL_JOURNAL_CONFIG, type SkillJournalType } from '@/data/skill-journal-prompts';

const ACCENT = '#8b5cf6';
const STORAGE_KEY = 'otc:mental-daily-work';

interface MentalDailyItem {
  id: string;
  type: 'tool' | 'reflection';
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  route?: string;
}

interface MentalDailyPlan {
  date: string;
  items: MentalDailyItem[];
  completion: Record<string, boolean>;
}

function getLocalDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function generateMentalDailyPlan(
  diagnostic: MentalDiagnosticResult,
  profile: MentalProfileData | null,
): MentalDailyPlan {
  const rec = getRecommendedMentalTools({
    primaryStruggle: diagnostic.primary,
    secondaryStruggle: diagnostic.secondary,
    mentalProfile: profile?.slug ?? null,
    recentTools: [],
  });
  const flat = flattenMentalRecommendation(rec);

  const items: MentalDailyItem[] = [];

  // 1 primary tool
  const primaryTool = flat.find((f) => f.role === 'primary');
  if (primaryTool) {
    items.push({
      id: 'mental-primary',
      type: 'tool',
      title: primaryTool.name,
      subtitle: 'Primary mental tool',
      tag: 'Primary',
      tagColor: '#ef4444',
      route: '/(app)/training/mental/toolbox',
    });
  }

  // 1 reflection prompt
  const reflection = flat.find((f) => f.role === 'reflection');
  if (reflection) {
    const journalType = reflection.name as SkillJournalType;
    const config = SKILL_JOURNAL_CONFIG[journalType];
    const dayIndex = Math.floor(Date.now() / 86_400_000);
    const prompt = config?.prompts[dayIndex % config.prompts.length];

    items.push({
      id: 'mental-reflection',
      type: 'reflection',
      title: config?.label ?? 'Reflection',
      subtitle: prompt ?? 'Reflect on your mental game today.',
      tag: 'Reflection',
      tagColor: '#22c55e',
      route: '/(app)/training/mental/journals',
    });
  }

  // Optional: secondary support tool
  const secondaryTool = flat.find((f) => f.role === 'secondary');
  if (secondaryTool) {
    items.push({
      id: 'mental-secondary',
      type: 'tool',
      title: secondaryTool.name,
      subtitle: 'Support tool',
      tag: 'Support',
      tagColor: '#3b82f6',
      route: '/(app)/training/mental/toolbox',
    });
  }

  const completion: Record<string, boolean> = {};
  for (const item of items) {
    completion[item.id] = false;
  }

  return { date: getLocalDateString(), items, completion };
}

export default function MentalDailyWorkScreen() {
  const { gate } = useGating();
  const [profile, setProfile] = useState<MentalProfileData | null>(null);
  const [diagnostic, setDiagnostic] = useState<MentalDiagnosticResult | null>(null);
  const [plan, setPlan] = useState<MentalDailyPlan | null>(null);

  const mentalDiagDone = gate.mental.archetypeDone && gate.mental.identityDone && gate.mental.habitsDone;

  // Load profile + diagnostic from storage
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('otc:mental-profile'),
      AsyncStorage.getItem('otc:mental-struggles'),
    ]).then(([pVal, dVal]) => {
      if (pVal) {
        try {
          const p = JSON.parse(pVal);
          const slug = p.slug ?? p;
          const found = Object.values(MENTAL_PROFILES).find((m) => m.slug === slug);
          if (found) setProfile(found);
        } catch {}
      }
      if (dVal) {
        try { setDiagnostic(JSON.parse(dVal)); } catch {}
      }
    });
  }, []);

  // Load or generate today's plan
  useEffect(() => {
    if (!diagnostic) return;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved: MentalDailyPlan = JSON.parse(raw);
          if (saved.date === getLocalDateString()) {
            setPlan(saved);
            return;
          }
        } catch {}
      }
      const newPlan = generateMentalDailyPlan(diagnostic, profile);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
      setPlan(newPlan);
    });
  }, [diagnostic, profile]);

  const toggleItem = useCallback(async (itemId: string) => {
    if (!plan) return;
    const updated = {
      ...plan,
      completion: { ...plan.completion, [itemId]: !plan.completion[itemId] },
    };
    setPlan(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [plan]);

  // ── Empty state ───────────────────────────────────
  if (!diagnostic) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>MENTAL</Text>
            <Text style={styles.headerTitle}>Daily Work</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="flash-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Complete Your Assessment</Text>
          <Text style={styles.emptyDesc}>
            Take the Mental Struggles Assessment to unlock your daily mental training plan.
          </Text>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/training/mental/mental-struggles-quiz' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>Take Assessment</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!plan) return null;

  const completedCount = Object.values(plan.completion).filter(Boolean).length;
  const totalCount = plan.items.length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL</Text>
          <Text style={styles.headerTitle}>Daily Work</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{completedCount}/{totalCount}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {completedCount === totalCount
              ? 'All done! Great mental work today.'
              : `${totalCount - completedCount} task${totalCount - completedCount !== 1 ? 's' : ''} remaining`}
          </Text>
        </View>

        {/* Items */}
        {plan.items.map((item) => {
          const isDone = plan.completion[item.id];
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemCard, isDone && styles.itemDone]}
              onPress={() => {
                if (item.route) {
                  router.push(item.route as any);
                } else {
                  toggleItem(item.id);
                }
              }}
              activeOpacity={0.7}
            >
              <TouchableOpacity
                style={[styles.checkbox, isDone && styles.checkboxDone]}
                onPress={() => toggleItem(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {isDone && <Ionicons name="checkmark" size={14} color="#fff" />}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <View style={styles.itemTitleRow}>
                  <Text style={[styles.itemTitle, isDone && styles.itemTitleDone]}>
                    {item.title}
                  </Text>
                  <View style={[styles.tagBadge, { backgroundColor: item.tagColor + '15' }]}>
                    <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
                  </View>
                </View>
                <Text style={styles.itemSub}>{item.subtitle}</Text>
              </View>
              {item.route && (
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  progressBadge: {
    backgroundColor: ACCENT + '18', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  progressText: { fontSize: 13, fontWeight: '900', color: ACCENT },

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  emptyDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },

  progressCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 8,
  },
  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: ACCENT },
  progressLabel: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },

  itemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16,
  },
  itemDone: { opacity: 0.6 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: ACCENT, borderColor: ACCENT },

  itemTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  itemTitleDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  itemSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 17 },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 10, fontWeight: '900' },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

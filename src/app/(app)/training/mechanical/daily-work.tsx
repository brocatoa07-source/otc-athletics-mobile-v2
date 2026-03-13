import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useAuth } from '@/hooks/useAuth';
import { useGating } from '@/hooks/useGating';
import {
  generateUnifiedDailyWork,
  loadDailyWork,
  saveDailyWork,
  type UnifiedDailyWork,
  type DailyWorkItem,
} from '@/data/daily-work';
import {
  HITTING_VAULT_SECTIONS,
  type DrillCard,
} from '@/data/hitting-vault-sections';
import type { MechanicalDiagnosticResult } from '@/data/hitting-mechanical-diagnostic-data';
import type { MoverType } from '@/data/hitting-mover-type-data';
import { useTier } from '@/hooks/useTier';
import { filterDailyWorkItems, getLockedTypes, getUpgradeTargetLabel } from '@/lib/tier-content';

const ACCENT = '#E10600';

const TYPE_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  foundation: { icon: 'construct-outline', color: '#22c55e', label: 'FOUNDATION' },
  hitting:    { icon: 'baseball-outline', color: '#E10600', label: 'HITTING' },
  strength:   { icon: 'barbell-outline', color: '#1DB954', label: 'STRENGTH' },
  mental:     { icon: 'sparkles-outline', color: '#A78BFA', label: 'MENTAL' },
  challenge:  { icon: 'trophy-outline', color: '#FBBF24', label: 'CHALLENGE' },
};

function findDrillCard(drillName: string): DrillCard | null {
  for (const section of HITTING_VAULT_SECTIONS) {
    const found = section.drills.find((d) => d.name === drillName);
    if (found) return found;
  }
  return null;
}

export default function DailyWorkScreen() {
  const { athlete } = useAuth();
  const { gate } = useGating();
  const { tier, isCoach } = useTier();
  const [plan, setPlan] = useState<UnifiedDailyWork | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const loadOrGenerate = useCallback(async () => {
    // Try loading today's persisted plan first
    const existing = await loadDailyWork();
    if (existing) {
      setPlan(existing);
      return;
    }

    // Generate a new plan from diagnostic results
    const raw = await AsyncStorage.getItem('otc:mechanical-diagnostic');
    if (!raw) return;
    try {
      const result: MechanicalDiagnosticResult = JSON.parse(raw);

      // Load mover type for drill affinity bias (supports new + legacy format)
      let moverType: MoverType | null = null;
      const moverRaw = await AsyncStorage.getItem('otc:mover-type');
      if (moverRaw) {
        try {
          const parsed = JSON.parse(moverRaw);
          moverType = (parsed.primary ?? parsed.slug ?? parsed) as MoverType;
        } catch {}
      }

      // Load mental scores for smart task selection
      let mentalScores: { iss?: number | null; hss?: number | null } | null = null;
      try {
        const mentalRaw = await AsyncStorage.getItem('otc:mental-profile-scores');
        if (mentalRaw) mentalScores = JSON.parse(mentalRaw);
      } catch {}

      const generated = generateUnifiedDailyWork(
        result.primary,
        result.secondary,
        athlete?.age ?? null,
        moverType,
        mentalScores,
      );
      await saveDailyWork(generated);
      setPlan(generated);
    } catch {}
  }, [athlete?.age]);

  useEffect(() => {
    loadOrGenerate();
  }, [loadOrGenerate]);

  const hasDiagnostic = gate.hitting.mechanicalDone;

  const handleToggle = async (itemId: string, item: DailyWorkItem) => {
    if (!plan) return;

    // Challenges require video — don't allow honor-system toggle
    if (item.type === 'challenge' && !plan.completion[itemId]) {
      Alert.alert(
        'Video Required',
        'Challenge completion requires a video submission. This feature is coming soon.',
      );
      return;
    }

    const updated = { ...plan, completion: { ...plan.completion, [itemId]: !plan.completion[itemId] } };
    setPlan(updated);
    await saveDailyWork(updated);
  };

  // ── No diagnostic — show CTA ──────────────────────
  if (!hasDiagnostic || !plan) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSup}>DAILY WORK</Text>
            <Text style={styles.headerTitle}>Today's Training</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Ionicons name="clipboard-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Complete Your Swing Diagnostic</Text>
          <Text style={styles.emptySub}>
            Daily Work is personalized from your diagnostic results. Take the 10-question assessment to unlock your daily plan.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any)}
          >
            <Text style={styles.ctaBtnText}>Take Swing Diagnostic</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.bg} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Filter items by tier
  const visibleItems = filterDailyWorkItems(plan.items, tier, isCoach);
  const lockedTypes = getLockedTypes(tier, isCoach);
  const upgradeTarget = getUpgradeTargetLabel(tier);

  const completedCount = visibleItems.filter((i) => plan.completion[i.id]).length;
  const totalCount = visibleItems.length;
  const isYouth = athlete?.age !== null && athlete?.age !== undefined && athlete.age <= 14;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>DAILY WORK</Text>
          <Text style={styles.headerTitle}>Today's Training</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{completedCount}/{totalCount}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.dateText}>{todayStr}</Text>
          <Text style={styles.summaryTitle}>Today's Work</Text>
          <View style={styles.fixRow}>
            <View style={[styles.fixPill, { backgroundColor: ACCENT + '20', borderColor: ACCENT + '40' }]}>
              <Text style={[styles.fixPillText, { color: ACCENT }]}>{plan.primaryFix.label}</Text>
            </View>
            <View style={[styles.fixPill, { backgroundColor: '#3b82f620', borderColor: '#3b82f640' }]}>
              <Text style={[styles.fixPillText, { color: '#3b82f6' }]}>{plan.secondaryFix.label}</Text>
            </View>
          </View>
          {isYouth && (
            <View style={styles.youthNote}>
              <Ionicons name="star-outline" size={12} color="#22c55e" />
              <Text style={styles.youthNoteText}>Includes a Foundations drill for your age group</Text>
            </View>
          )}
          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }]} />
          </View>
        </View>

        {/* Locked types upgrade banner */}
        {lockedTypes.length > 0 && upgradeTarget && (
          <TouchableOpacity
            style={styles.lockedBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.lockedBannerTitle}>
                {lockedTypes.map((t) => t === 'mental' ? 'Mental' : 'Strength').join(' & ')} tasks locked
              </Text>
              <Text style={styles.lockedBannerSub}>
                Upgrade to {upgradeTarget} to unlock
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Task items */}
        {visibleItems.map((item) => {
          const meta = TYPE_META[item.type] ?? TYPE_META.hitting;
          const isDone = plan.completion[item.id] ?? false;
          const isExpanded = expandedItem === item.id;
          const drillCard = (item.type === 'hitting' || item.type === 'foundation')
            ? findDrillCard(item.title)
            : null;

          return (
            <View key={item.id} style={[styles.itemCard, isDone && styles.itemCardDone]}>
              {/* Main row */}
              <View style={styles.itemRow}>
                {/* Completion toggle */}
                <TouchableOpacity
                  style={[styles.checkbox, isDone && { backgroundColor: meta.color, borderColor: meta.color }]}
                  onPress={() => handleToggle(item.id, item)}
                >
                  {isDone && <Ionicons name="checkmark" size={14} color={colors.bg} />}
                </TouchableOpacity>

                {/* Content — tappable for expand */}
                <TouchableOpacity
                  style={styles.itemContent}
                  onPress={() => setExpandedItem(isExpanded ? null : item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.itemMeta}>
                    <Ionicons name={meta.icon} size={12} color={meta.color} />
                    <Text style={[styles.itemTypeLabel, { color: meta.color }]}>{meta.label}</Text>
                    {item.tag && (
                      <View style={[styles.itemTag, { backgroundColor: (item.tagColor ?? meta.color) + '18' }]}>
                        <Text style={[styles.itemTagText, { color: item.tagColor ?? meta.color }]}>
                          {item.tag}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.itemTitle, isDone && styles.itemTitleDone]}>{item.title}</Text>
                </TouchableOpacity>

                {/* Expand chevron */}
                {(drillCard || item.challenge) && (
                  <TouchableOpacity onPress={() => setExpandedItem(isExpanded ? null : item.id)}>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Expanded drill detail */}
              {isExpanded && drillCard && (
                <View style={styles.expandedBody}>
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: meta.color }]}>FIXES</Text>
                    <Text style={styles.fieldText}>{drillCard.fixes}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: meta.color }]}>HOW TO DO IT</Text>
                    <Text style={styles.fieldText}>{drillCard.howTo}</Text>
                  </View>
                  <View style={[styles.focusBadge, { borderColor: meta.color + '40' }]}>
                    <Text style={[styles.focusLabel, { color: meta.color }]}>FOCUS</Text>
                    <Text style={styles.focusText}>{drillCard.focus}</Text>
                  </View>
                  <View style={styles.demoRow}>
                    <Ionicons name="play-circle-outline" size={18} color={colors.textMuted} />
                    <Text style={styles.demoText}>Watch Demo — coming soon</Text>
                  </View>
                </View>
              )}

              {/* Expanded challenge detail */}
              {isExpanded && item.challenge && (
                <View style={styles.expandedBody}>
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: meta.color }]}>GOAL</Text>
                    <Text style={styles.fieldText}>{item.challenge.goal}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: meta.color }]}>RULES</Text>
                    <Text style={styles.fieldText}>{item.challenge.rules}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: meta.color }]}>SCORING</Text>
                    <Text style={styles.fieldText}>{item.challenge.scoring}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: meta.color }]}>MEDALS</Text>
                    <Text style={styles.fieldText}>{item.challenge.medalLogic}</Text>
                  </View>
                  <View style={styles.videoRequired}>
                    <Ionicons name="videocam-outline" size={16} color={meta.color} />
                    <Text style={[styles.videoRequiredText, { color: meta.color }]}>
                      Video submission required
                    </Text>
                  </View>
                  <Text style={styles.deadlineText}>
                    Due: {item.challenge.submissionDeadline}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Retake link */}
        <TouchableOpacity
          style={styles.retakeRow}
          onPress={() => router.push('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any)}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.textMuted} />
          <Text style={styles.retakeText}>Retake Swing Diagnostic to update your Daily Work</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  emptySub: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, textAlign: 'center' },

  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ACCENT,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: 8,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '800', color: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  progressBadge: {
    backgroundColor: ACCENT + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  progressText: { fontSize: 13, fontWeight: '900', color: ACCENT },

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  summaryCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 6,
  },
  dateText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  summaryTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  fixRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  fixPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  fixPillText: { fontSize: 12, fontWeight: '800' },
  youthNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  youthNoteText: { fontSize: 11, fontWeight: '600', color: '#22c55e' },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },

  itemCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
  },
  itemCardDone: { opacity: 0.6 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemContent: { flex: 1, gap: 3 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemTypeLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  itemTag: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  itemTagText: { fontSize: 9, fontWeight: '800' },
  itemTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  itemTitleDone: { textDecorationLine: 'line-through', color: colors.textMuted },

  expandedBody: {
    gap: 12,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fieldRow: { gap: 4 },
  fieldLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  fieldText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  focusBadge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 10,
    backgroundColor: colors.bg,
    gap: 4,
  },
  focusLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  focusText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4 },
  demoText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },

  videoRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  videoRequiredText: { fontSize: 12, fontWeight: '700' },
  deadlineText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },

  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: ACCENT + '08',
    borderWidth: 1,
    borderColor: ACCENT + '25',
    borderRadius: radius.md,
    padding: 14,
  },
  lockedBannerTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  lockedBannerSub: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },

  retakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  retakeText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
});

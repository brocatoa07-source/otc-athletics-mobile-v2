import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { AccountabilityResult, WeeklyChecklist } from '@/data/accountability-engine';
import type { DevelopmentStatus, StandardStatus } from '@/types/progress';
import {
  useRequiredTodayConfig,
  REQUIRED_TODAY_ORDER,
  REQUIRED_TODAY_META,
  type RequiredTodayItemKey,
} from '@/hooks/useRequiredTodayConfig';

interface Props {
  accountability: AccountabilityResult | null;
  developmentStatus: DevelopmentStatus;
  standardStatus: StandardStatus | null;
}

const STANDARD_CONFIG: Record<StandardStatus, { label: string; color: string; icon: string }> = {
  below: { label: 'Below Standard', color: '#ef4444', icon: 'trending-down-outline' },
  on:    { label: 'On Standard',    color: '#f59e0b', icon: 'remove-outline'        },
  above: { label: 'Above Standard', color: '#22c55e', icon: 'trending-up-outline'   },
};

const GRADE_COLOR: Record<string, string> = {
  A: '#22c55e',
  B: '#84cc16',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444',
};

/** Maps each RequiredTodayItemKey to a checklist field + label + color */
interface BarConfig {
  label: string;
  color: string;
  done: (c: WeeklyChecklist) => number;
  target: (c: WeeklyChecklist) => number;
}

const BAR_CONFIG: Record<RequiredTodayItemKey, BarConfig> = {
  readiness: {
    label: 'Readiness',
    color: '#8b5cf6',
    done: (c) => c.readinessCheckins,
    target: (c) => c.readinessTarget,
  },
  training: {
    label: 'Workouts',
    color: '#22c55e',
    done: (c) => c.workoutsCompleted,
    target: (c) => c.workoutsTarget,
  },
  skillWork: {
    label: 'Skill Work',
    color: '#E10600',
    done: (c) => c.skillWorkDaysCount ?? 0,
    target: (c) => Math.max(1, c.workoutsTarget),
  },
  mental: {
    label: 'Mental',
    color: '#A78BFA',
    done: (c) => c.courseSessionsDone,
    target: (c) => c.courseSessionsTarget,
  },
  journal: {
    label: 'Journals',
    color: '#f59e0b',
    done: (c) => c.journalEntries,
    target: (c) => c.journalTarget,
  },
  habits: {
    label: 'Habits',
    color: '#06b6d4',
    done: (c) => c.habitsDaysCount ?? 0,
    target: (c) => Math.max(1, c.habitsTarget ?? c.workoutsTarget),
  },
  addons: {
    label: 'Add-Ons',
    color: '#f97316',
    done: (c) => c.addonDaysCount ?? 0,
    target: (c) => Math.max(1, c.addonTarget ?? 1),
  },
};

function ChecklistBar({ label, done, target, color }: {
  label: string; done: number; target: number; color: string;
}) {
  const pct = target > 0 ? Math.min(1, done / target) : 0;
  return (
    <View style={styles.checklistRow}>
      <Text style={styles.checklistLabel}>{label}</Text>
      <View style={styles.checklistTrack}>
        <View style={[styles.checklistFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.checklistValue}>{done}/{target}</Text>
    </View>
  );
}

export function StandardEngineCard({ accountability, developmentStatus, standardStatus }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { enabled, toggle } = useRequiredTodayConfig();

  const verified = developmentStatus === 'verified';
  const gradeColor = accountability ? (GRADE_COLOR[accountability.grade] ?? colors.textPrimary) : colors.textMuted;

  // Only show bars for enabled items (in config order)
  const enabledBars = REQUIRED_TODAY_ORDER.filter((k) => enabled[k]);

  return (
    <>
      <View style={styles.card}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={[styles.iconWrap, { backgroundColor: '#f59e0b15' }]}>
            <Ionicons name="trophy-outline" size={20} color="#f59e0b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Standard Engine</Text>
            <Text style={styles.sub}>
              {accountability
                ? `Week of ${accountability.weekStart}`
                : 'Loading...'}
            </Text>
          </View>
          {accountability && (
            <View style={styles.gradeWrap}>
              <Text style={[styles.gradeNum, { color: gradeColor }]}>{accountability.score}</Text>
              <Text style={styles.gradeDenom}>/ 100</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.gearBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="options-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Standard status row */}
        <View style={styles.standardRow}>
          {verified && standardStatus ? (
            <>
              <Ionicons
                name={STANDARD_CONFIG[standardStatus].icon as any}
                size={14}
                color={STANDARD_CONFIG[standardStatus].color}
              />
              <Text style={[styles.standardLabel, { color: STANDARD_CONFIG[standardStatus].color }]}>
                {STANDARD_CONFIG[standardStatus].label}
              </Text>
              <View style={[styles.gradePill, { backgroundColor: gradeColor + '20' }]}>
                <Text style={[styles.gradePillText, { color: gradeColor }]}>
                  Grade {accountability?.grade ?? '—'}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Ionicons name="alert-circle-outline" size={14} color="#f59e0b" />
              <Text style={styles.unverifiedNote}>
                Log key metrics to unlock Standard Status
              </Text>
            </>
          )}
        </View>

        {/* Dynamic checklist bars (only enabled items) */}
        {accountability && enabledBars.length > 0 && (
          <View style={styles.breakdown}>
            {enabledBars.map((key) => {
              const bar = BAR_CONFIG[key];
              return (
                <ChecklistBar
                  key={key}
                  label={bar.label}
                  done={bar.done(accountability.checklist)}
                  target={bar.target(accountability.checklist)}
                  color={bar.color}
                />
              );
            })}
          </View>
        )}
      </View>

      {/* Customize Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Customize Standard Engine</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sheetNote}>
            Choose which habits count toward your Standard Engine score. Your Required Today panel will match exactly what you enable here.
          </Text>

          {REQUIRED_TODAY_ORDER.map((key) => {
            const meta = REQUIRED_TODAY_META[key];
            const isOn = enabled[key];
            return (
              <View key={key} style={styles.toggleRow}>
                <View style={[styles.toggleIcon, { backgroundColor: isOn ? '#22c55e15' : colors.surfaceElevated }]}>
                  <Ionicons
                    name={meta.icon as any}
                    size={18}
                    color={isOn ? '#22c55e' : colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.toggleLabel, !isOn && styles.toggleLabelOff]}>
                    {meta.label}
                  </Text>
                  <Text style={styles.toggleDesc}>{meta.description}</Text>
                </View>
                <Switch
                  value={isOn}
                  onValueChange={() => toggle(key)}
                  trackColor={{ true: '#22c55e', false: colors.border }}
                  thumbColor={colors.white}
                />
              </View>
            );
          })}

          <View style={{ height: 32 }} />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  sub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  gradeWrap: { alignItems: 'center' },
  gradeNum: { fontSize: 28, fontWeight: '900' },
  gradeDenom: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  gearBtn: { padding: 2 },

  standardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  standardLabel: { flex: 1, fontSize: 13, fontWeight: '800' },
  gradePill: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gradePillText: { fontSize: 11, fontWeight: '800' },
  unverifiedNote: {
    flex: 1,
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },

  breakdown: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checklistRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checklistLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 68,
  },
  checklistTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  checklistFill: { height: 4, borderRadius: 2 },
  checklistValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    width: 28,
    textAlign: 'right',
  },

  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  handle: {
    width: 38, height: 4, borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 10, marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  sheetNote: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  toggleLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  toggleLabelOff: { color: colors.textMuted },
  toggleDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
});

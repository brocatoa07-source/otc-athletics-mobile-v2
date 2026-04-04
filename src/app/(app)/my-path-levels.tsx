import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useAccess, type PermissionKey } from '@/features/billing/useAccess';
import { InlineLock } from '@/features/billing/AccessGate';
import {
  ALL_PATH_LANES,
  getCurrentLevel,
  getLaneProgress,
  type PathLane,
} from '@/features/strength/config/pathLevels';
import { getLaneStep, adjustLaneStep } from '@/features/strength/config/myPathMapping';
import { loadStrengthProgress } from '@/data/strength-program-engine';
import {
  getProgressionDecision,
  type ProgressionSnapshot,
} from '@/features/strength/services/feedbackLoop';

const ACCENT = '#1DB954';

const PILLAR_COLORS: Record<string, string> = {
  hitting: '#f97316',
  strength: '#1DB954',
  mental: '#a855f7',
};

const PILLAR_ICONS: Record<string, string> = {
  hitting: 'baseball-outline',
  strength: 'barbell-outline',
  mental: 'bulb-outline',
};

const PILLAR_PERMISSIONS: Record<string, PermissionKey> = {
  hitting: 'myPath.hitting',
  strength: 'myPath.strength',
  mental: 'myPath.mental',
};

export default function MyPathLevelsScreen() {
  const access = useAccess();
  const [currentMonth, setCurrentMonth] = useState(1);
  const [snapshot, setSnapshot] = useState<ProgressionSnapshot | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [progress, snap] = await Promise.all([
          loadStrengthProgress(),
          getProgressionDecision().catch(() => null),
        ]);
        if (active) {
          setCurrentMonth(progress?.currentMonth ?? 1);
          setSnapshot(snap);
        }
      })();
      return () => { active = false; };
    }, []),
  );

  const baseStep = getLaneStep(currentMonth);
  const decision = snapshot?.result.decision ?? 'hold';
  const laneAdj = adjustLaneStep(baseStep, decision);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>DEVELOPMENT</Text>
          <Text style={styles.headerTitle}>My Path</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Ionicons name="navigate" size={14} color={ACCENT} />
            <Text style={styles.statusText}>
              Month {currentMonth} — {decision === 'progress' ? 'Advancing' : decision === 'regress' ? 'Rebuilding' : 'Holding'}
            </Text>
          </View>
          <Text style={styles.statusSub}>{laneAdj.note}</Text>
        </View>

        {/* Lane Cards */}
        {ALL_PATH_LANES.map((lane) => {
          const permission = PILLAR_PERMISSIONS[lane.pillar];
          const isLocked = permission ? access.isLocked(permission) : false;
          const pillarColor = PILLAR_COLORS[lane.pillar] ?? ACCENT;

          return (
            <LaneCard
              key={lane.key}
              lane={lane}
              step={laneAdj.step}
              color={pillarColor}
              icon={PILLAR_ICONS[lane.pillar] ?? 'navigate'}
              locked={isLocked}
              permission={permission}
            />
          );
        })}

        {/* How progression works */}
        <View style={styles.explainCard}>
          <Text style={styles.explainTitle}>How Progression Works</Text>
          <View style={styles.explainRow}>
            <Ionicons name="trending-up" size={12} color="#22c55e" />
            <Text style={styles.explainText}><Text style={{ fontWeight: '800' }}>Progress</Text> — move forward one level when compliance, readiness, and outputs are strong.</Text>
          </View>
          <View style={styles.explainRow}>
            <Ionicons name="pause-circle" size={12} color="#f59e0b" />
            <Text style={styles.explainText}><Text style={{ fontWeight: '800' }}>Hold</Text> — stay at your current level. Your body is adapting.</Text>
          </View>
          <View style={styles.explainRow}>
            <Ionicons name="trending-down" size={12} color="#ef4444" />
            <Text style={styles.explainText}><Text style={{ fontWeight: '800' }}>Regress</Text> — move back one level to rebuild the foundation before pushing again.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LaneCard({
  lane, step, color, icon, locked, permission,
}: {
  lane: PathLane;
  step: number;
  color: string;
  icon: string;
  locked: boolean;
  permission?: PermissionKey;
}) {
  const clampedStep = Math.min(step, lane.levels.length - 1);
  const current = getCurrentLevel(lane, clampedStep);
  const next = clampedStep < lane.levels.length - 1 ? lane.levels[clampedStep + 1] : null;
  const progress = getLaneProgress(lane, clampedStep);

  return (
    <View style={[styles.laneCard, locked && { opacity: 0.45 }, { borderColor: color + '25' }]}>
      {/* Header */}
      <View style={styles.laneHeader}>
        <View style={[styles.laneIcon, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon as any} size={16} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.laneTitle}>{lane.title}</Text>
          <Text style={styles.laneSub}>Level {clampedStep} — {current.title}</Text>
        </View>
        {locked && permission && <InlineLock permission={permission} />}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.progressText}>{progress}% complete</Text>

      {/* Current level */}
      <View style={styles.levelBlock}>
        <Text style={[styles.levelLabel, { color }]}>CURRENT</Text>
        <Text style={styles.levelTitle}>{current.title}</Text>
        <Text style={styles.levelDesc}>{current.description}</Text>
        <View style={styles.focusWrap}>
          {current.focus.map((f) => (
            <View key={f} style={[styles.focusChip, { borderColor: color + '30' }]}>
              <Text style={[styles.focusText, { color }]}>{f}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Next level */}
      {next && (
        <View style={[styles.levelBlock, { opacity: 0.6 }]}>
          <Text style={styles.levelLabel}>NEXT</Text>
          <Text style={styles.levelTitle}>{next.title}</Text>
          <Text style={styles.levelDesc}>{next.description}</Text>
        </View>
      )}

      {/* All levels indicator */}
      <View style={styles.dotsRow}>
        {lane.levels.map((lvl, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i <= clampedStep ? color : colors.border },
              i === clampedStep && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: '#8b5cf6' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  /* Status */
  statusCard: {
    padding: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, gap: 4,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontSize: 12, fontWeight: '800', color: colors.textPrimary },
  statusSub: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  /* Lane Card */
  laneCard: {
    padding: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderRadius: radius.lg, gap: 8,
  },
  laneHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  laneIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  laneTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  laneSub: { fontSize: 10, color: colors.textMuted },

  /* Progress */
  progressBarBg: {
    height: 5, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden',
  },
  progressBarFill: { height: 5, borderRadius: 3 },
  progressText: { fontSize: 9, color: colors.textMuted, textAlign: 'right' },

  /* Level */
  levelBlock: { gap: 3 },
  levelLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  levelTitle: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  levelDesc: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  focusWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  focusChip: {
    paddingHorizontal: 7, paddingVertical: 3,
    borderWidth: 1, borderRadius: radius.sm, backgroundColor: colors.bg,
  },
  focusText: { fontSize: 9, fontWeight: '700' },

  /* Dots */
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 12, height: 8, borderRadius: 4 },

  /* Explain */
  explainCard: {
    padding: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, gap: 8,
  },
  explainTitle: { fontSize: 12, fontWeight: '900', color: colors.textPrimary },
  explainRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  explainText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});

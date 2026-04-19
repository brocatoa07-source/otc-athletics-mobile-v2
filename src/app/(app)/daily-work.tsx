import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useAccess } from '@/features/billing/useAccess';
import { InlineLock } from '@/features/billing/AccessGate';
import {
  getProgressionDecision,
  computeWorkoutStreak,
  type ProgressionSnapshot,
} from '@/features/strength/services/feedbackLoop';
import { getProgressionMessage } from '@/features/strength/config/progressionMessages';
import { evaluatePRWindow } from '@/features/strength/services/prWindow';
import {
  generateBehaviorNotifications,
  type BehaviorNotification,
} from '@/features/strength/services/behaviorMessages';

const ACCENT = '#1DB954';

interface WorkItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
  permission?: string;
  pillar: 'strength' | 'hitting' | 'mental' | 'accountability';
}

const WORK_ITEMS: WorkItem[] = [
  { id: 'prep', title: 'Movement Prep', subtitle: 'Warm up and activate', icon: 'flash-outline', color: '#22c55e', route: '/(app)/training/sc/mobility/category?cat=movement_prep', permission: 'dailyWork.strength', pillar: 'strength' },
  { id: 'lifting', title: 'Lifting', subtitle: 'Plyos, sprints, lifts, accessory, conditioning', icon: 'barbell-outline', color: '#3b82f6', route: '/(app)/training/sc/workout', permission: 'dailyWork.strength', pillar: 'strength' },
  { id: 'recovery', title: 'Recovery', subtitle: 'Mobility, tissue work, and recovery flows', icon: 'leaf-outline', color: '#0891b2', route: '/(app)/training/sc/mobility/category?cat=yoga_flow', permission: 'dailyWork.strength', pillar: 'strength' },
  { id: 'hitting', title: 'Hitting', subtitle: 'Drills and focus work', icon: 'baseball-outline', color: '#f97316', route: '/(app)/training/mechanical/daily-work', permission: 'dailyWork.hitting', pillar: 'hitting' },
  { id: 'mental', title: 'Mental', subtitle: 'Focus, confidence, routines', icon: 'bulb-outline', color: '#a855f7', route: '/(app)/training/mental/daily-work', permission: 'dailyWork.mental', pillar: 'mental' },
  { id: 'checkin', title: 'Daily Check-In', subtitle: 'Own the cost', icon: 'checkbox-outline', color: '#6b7280', route: '/(app)/training/own-the-cost-checkin', pillar: 'accountability' },
];

export default function DailyWorkScreen() {
  const access = useAccess();
  const [snapshot, setSnapshot] = useState<ProgressionSnapshot | null>(null);
  const [streak, setStreak] = useState(0);
  const [notifications, setNotifications] = useState<BehaviorNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [snap, stk] = await Promise.all([
          getProgressionDecision(),
          computeWorkoutStreak(),
        ]);
        if (active) {
          setSnapshot(snap);
          setStreak(stk);
          if (snap) {
            setNotifications(generateBehaviorNotifications(snap, stk));
          }
          setLoading(false);
        }
      })();
      return () => { active = false; };
    }, []),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={ACCENT} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const prWindow = snapshot ? evaluatePRWindow(snapshot) : null;
  const isDeload = snapshot?.result.adjustments.some(a => a.note.toLowerCase().includes('deload')) ?? false;
  const coachMsg = snapshot ? getProgressionMessage(snapshot.result.decision, isDeload) : null;

  // Filter work items by tier access
  const visibleItems = WORK_ITEMS.filter(item => {
    if (!item.permission) return true;
    return access.isVisible(item.permission as any);
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>TODAY</Text>
          <Text style={styles.headerTitle}>Daily Work</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Status Bar */}
        {coachMsg && snapshot && (
          <View style={[styles.statusBar, { borderColor: coachMsg.color + '40' }]}>
            <View style={styles.statusRow}>
              <Ionicons name={coachMsg.icon as any} size={16} color={coachMsg.color} />
              <Text style={[styles.statusLabel, { color: coachMsg.color }]}>{coachMsg.title}</Text>
              {snapshot.readiness.entries > 0 && (
                <View style={styles.readinessPill}>
                  <Ionicons name="heart" size={10} color="#8b5cf6" />
                  <Text style={styles.readinessText}>{snapshot.readiness.avg.toFixed(0)}</Text>
                </View>
              )}
              <View style={styles.streakPill}>
                <Ionicons name="flame" size={10} color="#f97316" />
                <Text style={styles.streakText}>{streak}</Text>
              </View>
            </View>
            <Text style={styles.statusMessage}>{coachMsg.message}</Text>
          </View>
        )}

        {/* PR Window Alert */}
        {prWindow?.isOpen && (
          <TouchableOpacity
            style={[styles.prBanner, { borderColor: '#f59e0b40' }]}
            onPress={() => router.push('/(app)/training/sc/exercises' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="trophy" size={18} color="#f59e0b" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.prTitle, { color: '#f59e0b' }]}>PR Window Open</Text>
              <Text style={styles.prSub}>{prWindow.message}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Top Behavior Notification */}
        {notifications.length > 0 && !prWindow?.isOpen && (
          <TouchableOpacity
            style={[styles.notifCard, {
              borderColor: notifications[0].message.tone === 'warning' ? '#ef444430' :
                notifications[0].message.tone === 'positive' ? '#22c55e30' : colors.border,
            }]}
            onPress={() => notifications[0].action && router.push(notifications[0].action.route as any)}
            activeOpacity={notifications[0].action ? 0.75 : 1}
          >
            <Ionicons name={notifications[0].message.icon as any} size={14}
              color={notifications[0].message.tone === 'warning' ? '#ef4444' : notifications[0].message.tone === 'positive' ? '#22c55e' : '#f59e0b'} />
            <Text style={styles.notifText}>{notifications[0].message.text}</Text>
          </TouchableOpacity>
        )}

        {/* Work Items */}
        <Text style={styles.sectionLabel}>TODAY'S WORK</Text>

        {visibleItems.map((item) => {
          const isLocked = item.permission ? access.isLocked(item.permission as any) : false;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.workCard, isLocked && styles.workCardLocked]}
              onPress={() => {
                if (isLocked) {
                  router.push('/(app)/upgrade' as any);
                } else {
                  router.push(item.route as any);
                }
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.workIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={18} color={isLocked ? colors.textMuted : item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.workTitle, isLocked && { color: colors.textMuted }]}>{item.title}</Text>
                <Text style={styles.workSub}>{item.subtitle}</Text>
              </View>
              {isLocked ? (
                <InlineLock permission={item.permission as any} />
              ) : (
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 10 },

  statusBar: {
    padding: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderRadius: radius.md, gap: 4,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusLabel: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  statusMessage: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  readinessPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 6, paddingVertical: 2,
    backgroundColor: '#8b5cf615', borderRadius: 8,
  },
  readinessText: { fontSize: 10, fontWeight: '800', color: '#8b5cf6' },
  streakPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 6, paddingVertical: 2,
    backgroundColor: '#f9731615', borderRadius: 8,
  },
  streakText: { fontSize: 10, fontWeight: '800', color: '#f97316' },

  prBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.md,
  },
  prTitle: { fontSize: 13, fontWeight: '800' },
  prSub: { fontSize: 10, color: colors.textMuted },

  sectionLabel: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
    color: colors.textMuted, marginTop: 4,
  },

  workCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md,
  },
  workCardLocked: { opacity: 0.5 },
  workIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  workTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  workSub: { fontSize: 11, color: colors.textMuted },
  notifCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.sm,
  },
  notifText: { flex: 1, fontSize: 11, color: colors.textSecondary, lineHeight: 15 },
});

import { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  type OwnTheCostCheckInLog,
  loadCheckIns,
  loadTodayCheckIn,
  calculateStreak,
  getStreakMessage,
  getLocalDateString,
  getFeedbackTier,
  getFeedbackMessage,
} from '@/data/own-the-cost-checkin';

const ACCENT = '#f59e0b';

export default function OwnTheCostHomeScreen() {
  const [todayLog, setTodayLog] = useState<OwnTheCostCheckInLog | null>(null);
  const [streak, setStreak] = useState(0);
  const [streakMessage, setStreakMessage] = useState('');
  const [recentLogs, setRecentLogs] = useState<OwnTheCostCheckInLog[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [today, all] = await Promise.all([loadTodayCheckIn(), loadCheckIns()]);
        if (cancelled) return;
        setTodayLog(today);
        const todayStr = getLocalDateString();
        const s = calculateStreak(all, todayStr);
        setStreak(s);
        setStreakMessage(getStreakMessage(s));
        setRecentLogs(all.slice(0, 7));
      })();
      return () => { cancelled = true; };
    }, []),
  );

  const todayCompleted = !!todayLog;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>ACCOUNTABILITY</Text>
          <Text style={styles.headerTitle}>Own The Cost</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Ionicons name="flame" size={32} color={streak > 0 ? ACCENT : colors.textMuted} />
          <Text style={[styles.streakValue, streak > 0 && { color: ACCENT }]}>
            {streak}
          </Text>
          <Text style={styles.streakLabel}>DAY STREAK</Text>
          <Text style={styles.streakMessage}>{streakMessage}</Text>
        </View>

        {/* Today CTA or Completed */}
        {todayCompleted ? (
          <TouchableOpacity
            style={styles.completedCard}
            onPress={() => router.push('/(app)/training/own-the-cost-summary' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.completedRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={18} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.completedTitle}>Today's Check-In Complete</Text>
                <Text style={styles.completedSub}>Tap to view your summary</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push('/(app)/training/own-the-cost-checkin' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
            <Text style={styles.ctaBtnText}>Start Today's Check-In</Text>
          </TouchableOpacity>
        )}

        {/* Philosophy */}
        <View style={styles.philosophyCard}>
          <Ionicons name="bulb-outline" size={16} color={ACCENT} />
          <Text style={styles.philosophyText}>
            Elite athletes must also be disciplined people. This check-in holds you accountable to the standard you set for yourself.
          </Text>
        </View>

        {/* Recent History */}
        {recentLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RECENT CHECK-INS</Text>
            {recentLogs.map((log) => {
              const tier = getFeedbackTier(log);
              const tierColor = tier === 'strong' ? colors.success : tier === 'mixed' ? ACCENT : colors.error;
              const tierLabel = tier === 'strong' ? 'Strong' : tier === 'mixed' ? 'Mixed' : 'Weak';
              return (
                <View key={log.id} style={styles.historyRow}>
                  <View style={[styles.historyDot, { backgroundColor: tierColor }]} />
                  <Text style={styles.historyDate}>{formatDate(log.date)}</Text>
                  <Text style={[styles.historyTier, { color: tierColor }]}>{tierLabel}</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[1]}/${parts[2]}`;
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

  content: { padding: 16, paddingBottom: 60, gap: 14 },

  /* Streak */
  streakCard: {
    alignItems: 'center', gap: 4,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 24,
  },
  streakValue: { fontSize: 48, fontWeight: '900', color: colors.textMuted },
  streakLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted },
  streakMessage: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginTop: 4, textAlign: 'center' },

  /* CTA */
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 16,
  },
  ctaBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },

  /* Completed */
  completedCard: {
    backgroundColor: colors.success + '10', borderWidth: 1, borderColor: colors.success + '30',
    borderRadius: radius.md, padding: 16,
  },
  completedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center',
  },
  completedTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  completedSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  /* Philosophy */
  philosophyCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.lg, padding: 16,
  },
  philosophyText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textSecondary, lineHeight: 20 },

  /* Section */
  section: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  sectionTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted },

  /* History */
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  historyDot: { width: 8, height: 8, borderRadius: 4 },
  historyDate: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, flex: 1 },
  historyTier: { fontSize: 13, fontWeight: '800' },
});

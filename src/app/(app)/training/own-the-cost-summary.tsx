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
  type FeedbackTier,
  loadTodayCheckIn,
  loadCheckIns,
  calculateStreak,
  getStreakMessage,
  getLocalDateString,
  getFeedbackTier,
  getFeedbackMessage,
} from '@/data/own-the-cost-checkin';

const ACCENT = '#f59e0b';

const IDENTITY_LABELS: Record<string, string> = { yes: 'Yes', somewhat: 'Somewhat', no: 'No' };
const WORK_LABELS: Record<string, string> = { fully: 'Fully', partially: 'Partially', no: 'No' };
const ENERGY_LABELS: Record<string, string> = { high: 'High', okay: 'Okay', low: 'Low' };
const FOCUS_LABELS: Record<string, string> = { locked_in: 'Locked In', in_and_out: 'In and Out', distracted: 'Distracted' };
const EXCUSE_LABELS: Record<string, string> = { none: 'None', a_little: 'A Little', yes: 'Yes' };
const RESPONSIBILITY_LABELS: Record<string, string> = {
  owned_everything: 'Owned Everything',
  avoided_once_or_twice: 'Once or Twice',
  avoided_more_than_should: 'More Than I Should',
};
const CHALLENGE_LABELS: Record<string, string> = {
  challenged_myself: 'Challenged Myself',
  mix: 'A Mix',
  stayed_comfortable: 'Stayed Comfortable',
};
const FAILURE_LABELS: Record<string, string> = {
  leaned_into_it: 'Leaned Into It',
  avoided_it: 'Avoided It',
  none_today: 'None Today',
};

function tierColor(tier: FeedbackTier): string {
  if (tier === 'strong') return colors.success;
  if (tier === 'mixed') return ACCENT;
  return colors.error;
}

function tierIcon(tier: FeedbackTier): keyof typeof Ionicons.glyphMap {
  if (tier === 'strong') return 'shield-checkmark';
  if (tier === 'mixed') return 'shield-half';
  return 'shield-outline';
}

export default function OwnTheCostSummaryScreen() {
  const [log, setLog] = useState<OwnTheCostCheckInLog | null>(null);
  const [tier, setTier] = useState<FeedbackTier>('mixed');
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState(0);
  const [streakMsg, setStreakMsg] = useState('');

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [today, all] = await Promise.all([loadTodayCheckIn(), loadCheckIns()]);
        if (cancelled) return;
        if (today) {
          setLog(today);
          const t = getFeedbackTier(today);
          setTier(t);
          setMessage(getFeedbackMessage(t, today.date));
        }
        const todayStr = getLocalDateString();
        const s = calculateStreak(all, todayStr);
        setStreak(s);
        setStreakMsg(getStreakMessage(s));
      })();
      return () => { cancelled = true; };
    }, []),
  );

  if (!log) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Summary</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>No check-in found for today.</Text>
          <TouchableOpacity
            style={[styles.ctaBtn, { marginTop: 16 }]}
            onPress={() => router.replace('/(app)/training/own-the-cost-checkin' as any)}
          >
            <Text style={styles.ctaBtnText}>Start Check-In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const color = tierColor(tier);
  const icon = tierIcon(tier);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/(app)/training/own-the-cost-home' as any)}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>OWN THE COST</Text>
          <Text style={styles.headerTitle}>Today's Summary</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Feedback Card */}
        <View style={[styles.feedbackCard, { borderColor: color + '30' }]}>
          <Ionicons name={icon} size={36} color={color} />
          <Text style={[styles.feedbackTier, { color }]}>
            {tier === 'strong' ? 'STRONG DAY' : tier === 'mixed' ? 'MIXED DAY' : 'HONEST DAY'}
          </Text>
          <Text style={styles.feedbackMessage}>{message}</Text>
        </View>

        {/* Streak */}
        <View style={styles.streakRow}>
          <Ionicons name="flame" size={20} color={streak > 0 ? ACCENT : colors.textMuted} />
          <Text style={styles.streakText}>
            {streak > 0 ? `${streak}-day streak` : 'Start your streak'}
          </Text>
          <Text style={styles.streakSub}>{streakMsg}</Text>
        </View>

        {/* Response Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR RESPONSES</Text>
          <ResponseRow label="Athlete Identity" value={IDENTITY_LABELS[log.identityAthlete]} field={log.identityAthlete} />
          <ResponseRow label="Person Identity" value={IDENTITY_LABELS[log.identityPerson]} field={log.identityPerson} />
          <ResponseRow label="Work Completion" value={WORK_LABELS[log.workCompletion]} field={log.workCompletion} />
          <ResponseRow label="Energy" value={ENERGY_LABELS[log.energy]} field={log.energy} />
          <ResponseRow label="Focus" value={FOCUS_LABELS[log.focus]} field={log.focus} />
          <ResponseRow label="Excuses" value={EXCUSE_LABELS[log.excuses]} field={log.excuses} />
          <ResponseRow label="Responsibility" value={RESPONSIBILITY_LABELS[log.responsibilityAvoidance]} field={log.responsibilityAvoidance} />
          <ResponseRow label="Challenge" value={CHALLENGE_LABELS[log.challengeLevel]} field={log.challengeLevel} />
          <ResponseRow label="Failure Response" value={FAILURE_LABELS[log.failureResponse]} field={log.failureResponse} />
        </View>

        {/* Reflections */}
        {(log.winReflection || log.cleanupReflection) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REFLECTIONS</Text>
            {log.winReflection && (
              <View style={styles.reflectionRow}>
                <Text style={styles.reflectionLabel}>WIN</Text>
                <Text style={styles.reflectionText}>{log.winReflection}</Text>
              </View>
            )}
            {log.cleanupReflection && (
              <View style={styles.reflectionRow}>
                <Text style={styles.reflectionLabel}>CLEAN UP</Text>
                <Text style={styles.reflectionText}>{log.cleanupReflection}</Text>
              </View>
            )}
          </View>
        )}

        {/* Done */}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.replace('/(app)/training/own-the-cost-home' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Sub-components ─────────────────────────────── */

// Map field values to a quality tier for coloring
const POSITIVE_VALUES = new Set([
  'yes', 'fully', 'high', 'locked_in', 'none', 'owned_everything',
  'challenged_myself', 'leaned_into_it',
]);
const NEGATIVE_VALUES = new Set([
  'no', 'low', 'distracted', 'yes', 'avoided_more_than_should',
  'stayed_comfortable', 'avoided_it',
]);

function ResponseRow({ label, value, field }: { label: string; value: string; field: string }) {
  let dotColor = ACCENT; // mixed / neutral
  if (POSITIVE_VALUES.has(field)) dotColor = colors.success;
  // Check negatives — 'yes' for excuses is negative, 'no' for work is negative
  if (field === 'no' || field === 'low' || field === 'distracted' ||
      field === 'avoided_more_than_should' || field === 'stayed_comfortable' ||
      field === 'avoided_it') {
    dotColor = colors.error;
  }
  // Excuses: 'yes' means made excuses = negative
  if (label === 'Excuses' && field === 'yes') dotColor = colors.error;
  if (label === 'Excuses' && field === 'none') dotColor = colors.success;

  return (
    <View style={styles.responseRow}>
      <View style={[styles.responseDot, { backgroundColor: dotColor }]} />
      <Text style={styles.responseLabel}>{label}</Text>
      <Text style={[styles.responseValue, { color: dotColor }]}>{value}</Text>
    </View>
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

  content: { padding: 16, paddingBottom: 60, gap: 14 },

  /* Feedback */
  feedbackCard: {
    alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 24,
  },
  feedbackTier: { fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  feedbackMessage: {
    fontSize: 15, fontWeight: '700', color: colors.textPrimary,
    textAlign: 'center', lineHeight: 22,
  },

  /* Streak row */
  streakRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  streakText: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  streakSub: { flex: 1, fontSize: 12, color: colors.textSecondary, textAlign: 'right' },

  /* Section */
  section: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  sectionTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted },

  /* Response rows */
  responseRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  responseDot: { width: 8, height: 8, borderRadius: 4 },
  responseLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  responseValue: { fontSize: 13, fontWeight: '800' },

  /* Reflections */
  reflectionRow: { gap: 4 },
  reflectionLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: ACCENT },
  reflectionText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, lineHeight: 20 },

  /* CTA */
  ctaBtn: {
    backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 24,
    alignItems: 'center',
  },
  ctaBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  doneBtn: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 14,
  },
  doneBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
});

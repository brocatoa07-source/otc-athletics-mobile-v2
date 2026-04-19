/**
 * Mental Vault — Simple, actionable mental training hub.
 *
 * Simple on the front end. Smart on the back end.
 *
 * Home shows 5 things:
 *   1. Today's Mental Work (primary)
 *   2. Log Mental Check-In
 *   3. Troubleshoot My Mind
 *   4. Mental Tools
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useGating } from '@/hooks/useGating';
import { useMentalProfile } from '@/hooks/useMentalProfile';
import { type ArchetypeKey } from '@/data/mental-diagnostics-data';
import {
  computeMentalFocus, generateMentalDailyWork,
  type MentalFocusState, type MentalDailyPrescription,
} from '@/features/mental/mentalFocusEngine';
import { getTodayCheckIn } from '@/features/mental/mentalProgression';

const ACCENT = '#8b5cf6';

export default function MentalHome() {
  const { isWalk } = useTier();
  const { gate } = useGating();
  const { profile: dbProfile } = useMentalProfile();

  const mentalDiagDone = gate.mental.archetypeDone && gate.mental.identityDone && gate.mental.habitsDone;
  const archKey = dbProfile?.primary_archetype as ArchetypeKey | undefined;

  const [focus, setFocus] = useState<MentalFocusState | null>(null);
  const [dailyRx, setDailyRx] = useState<MentalDailyPrescription | null>(null);
  const [checkedInToday, setCheckedInToday] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!mentalDiagDone || !archKey) return;
      let active = true;
      (async () => {
        const [f, ci] = await Promise.all([
          computeMentalFocus(archKey),
          getTodayCheckIn(),
        ]);
        if (!active) return;
        setFocus(f);
        setDailyRx(generateMentalDailyWork(f));
        setCheckedInToday(!!ci);
      })();
      return () => { active = false; };
    }, [mentalDiagDone, archKey]),
  );

  // ── Locked State ──
  if (isWalk) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header />
        <View style={styles.lockedState}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textMuted} />
          <Text style={styles.lockedTitle}>Mental System Locked</Text>
          <Text style={styles.lockedDesc}>
            Upgrade to unlock personalized mental training, tools, and daily routines.
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/upgrade' as any)}
          >
            <Text style={styles.primaryBtnText}>Upgrade to Double</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Assessment Required ──
  if (!mentalDiagDone) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header />
        <View style={styles.lockedState}>
          <Ionicons name="clipboard-outline" size={48} color={ACCENT} />
          <Text style={styles.lockedTitle}>Complete Your Mental Assessment</Text>
          <Text style={styles.lockedDesc}>
            3 diagnostics to personalize your mental training.
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: ACCENT }]}
            onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
          >
            <Text style={styles.primaryBtnText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header showDiag />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ═══ 0. MY MENTAL PROFILE ═══ */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(app)/training/mental/profile-summary' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIcon, { backgroundColor: ACCENT + '15' }]}>
            <Ionicons name="person-circle-outline" size={20} color={ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>My Mental Profile</Text>
            <Text style={styles.actionSub}>Strengths, watch-outs, and your development roadmap</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══ 1. TODAY'S MENTAL WORK (Primary) ═══ */}
        {dailyRx && (
          <View style={[styles.workCard, { borderColor: ACCENT + '30' }]}>
            <View style={styles.workHeader}>
              <View style={[styles.workIcon, { backgroundColor: ACCENT + '15' }]}>
                <Ionicons name="flash" size={20} color={ACCENT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.workLabel}>TODAY'S MENTAL WORK</Text>
                {focus && <Text style={styles.workFocus}>Focus: {focus.lane.title}</Text>}
              </View>
            </View>

            <WorkItem icon="flash-outline" color="#f59e0b" label={dailyRx.tool.title} desc={dailyRx.tool.description} />
            <WorkItem icon="chatbubble-outline" color="#3b82f6" label="Reflection" desc={dailyRx.reflection.prompt} />
            <WorkItem icon="refresh-outline" color="#ef4444" label={`Reset Reps (${dailyRx.resetRep.reps}x)`} desc={dailyRx.resetRep.instruction} />
            <WorkItem icon="megaphone-outline" color="#22c55e" label="Routine Cue" desc={dailyRx.routineCue.cue} />
            <WorkItem icon="book-outline" color="#8b5cf6" label="Journal" desc={dailyRx.journal.prompt} />

            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: ACCENT }]}
              onPress={() => router.push('/(app)/training/mental/daily-work' as any)}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle" size={18} color="#fff" />
              <Text style={styles.startBtnText}>Start Today's Work</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ═══ 2. LOG MENTAL CHECK-IN ═══ */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(app)/training/mental/mental-checkin' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#f59e0b15' }]}>
            <Ionicons name="add-circle-outline" size={20} color="#f59e0b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Log Mental Check-In</Text>
            <Text style={styles.actionSub}>Rate your confidence, focus, and emotional control</Text>
          </View>
          {checkedInToday ? (
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
          ) : (
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          )}
        </TouchableOpacity>

        {/* ═══ 3. TROUBLESHOOT MY MIND ═══ */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(app)/training/mental/troubleshooting' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#ef444415' }]}>
            <Ionicons name="hammer-outline" size={20} color="#ef4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Troubleshoot My Mind</Text>
            <Text style={styles.actionSub}>Something wrong? Find the fix.</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══ 4. MENTAL TOOLS ═══ */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(app)/training/mental/toolbox' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#3b82f615' }]}>
            <Ionicons name="build-outline" size={20} color="#3b82f6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Mental Tools</Text>
            <Text style={styles.actionSub}>Breathing, resets, visualization, routines, meditations</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ showDiag }: { showDiag?: boolean }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerSup}>MENTAL</Text>
        <Text style={styles.headerTitle}>Mental Vault</Text>
      </View>
      {showDiag && (
        <TouchableOpacity
          style={styles.diagBtn}
          onPress={() => router.push('/(app)/training/mental/diagnostics/entry' as any)}
        >
          <Ionicons name="clipboard-outline" size={18} color={ACCENT} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function WorkItem({ icon, color, label, desc }: { icon: string; color: string; label: string; desc: string }) {
  return (
    <View style={styles.workItem}>
      <Ionicons name={icon as any} size={14} color={color} />
      <View style={{ flex: 1 }}>
        <Text style={styles.workItemLabel}>{label}</Text>
        <Text style={styles.workItemDesc}>{desc}</Text>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  diagBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: ACCENT + '15', alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 60, gap: 10 },

  /* Locked / Assessment */
  lockedState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  lockedTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  lockedDesc: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 19 },
  primaryBtn: {
    paddingVertical: 14, paddingHorizontal: 28, borderRadius: radius.md, marginTop: 8,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },

  /* Today's Work Card */
  workCard: {
    padding: 16, backgroundColor: colors.surface,
    borderWidth: 1, borderRadius: radius.lg, gap: 10,
  },
  workHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  workIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  workLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  workFocus: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },
  workItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  workItemLabel: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  workItemDesc: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: radius.md, marginTop: 4,
  },
  startBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  /* Action Cards */
  actionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  actionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  actionSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

});

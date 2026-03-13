import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { COURSE_REGISTRY, type CourseWeek, type OutlineSegment } from '@/data/course-registry';

type Phase = 'shadow' | 'mastery';

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const course = COURSE_REGISTRY[id ?? ''];
  const { hasFullMental, isCoach } = useTier();
  const canAccess = hasFullMental || isCoach;

  const totalSections = course?.totalSections ?? 0;
  const progress = useCourseProgress(id ?? '', totalSections);

  const [phase, setPhase] = useState<Phase>('shadow');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (!course) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Course Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const ACCENT = course.color;
  const week: CourseWeek = phase === 'shadow' ? course.shadow : course.mastery;
  const weekNum = phase === 'shadow' ? course.skillNum * 2 - 1 : course.skillNum * 2;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: ACCENT }]}>
            SKILL #{course.skillNum} · WEEK {weekNum}
          </Text>
          <Text style={styles.headerTitle}>{course.label}</Text>
        </View>
        <Text style={[styles.progressBadge, { color: ACCENT }]}>
          {progress.progress.completed}/{progress.progress.total}
        </Text>
      </View>

      {/* Phase toggle */}
      <View style={styles.phaseRow}>
        {(['shadow', 'mastery'] as Phase[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.phaseTab, phase === p && { backgroundColor: ACCENT + '18', borderColor: ACCENT + '50' }]}
            onPress={() => { setPhase(p); setExpandedIdx(null); }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={p === 'shadow' ? 'cloudy-outline' : 'sunny-outline'}
              size={16}
              color={phase === p ? ACCENT : colors.textMuted}
            />
            <Text style={[styles.phaseTabText, phase === p && { color: ACCENT }]}>
              {p === 'shadow' ? 'Shadow' : 'Mastery'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Week title + quote */}
        <View style={[styles.weekCard, { borderColor: ACCENT + '30' }]}>
          <Text style={[styles.weekTitle, { color: ACCENT }]}>{week.title}</Text>
          <Text style={styles.weekQuote}>"{week.quote}"</Text>
          {week.objective && <Text style={styles.weekObj}>{week.objective}</Text>}
        </View>

        {/* Coach Science */}
        <View style={[styles.scienceCard, { borderColor: ACCENT + '25' }]}>
          <View style={styles.scienceHeader}>
            <Ionicons name="school-outline" size={18} color={ACCENT} />
            <Text style={[styles.scienceTitle, { color: ACCENT }]}>{week.coachScience.videoTitle}</Text>
          </View>
          {week.coachScience.points.map((pt, i) => (
            <View key={i} style={styles.sciencePoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.scienceText}>{pt}</Text>
            </View>
          ))}
          <View style={[styles.analogyBox, { backgroundColor: ACCENT + '08' }]}>
            <Text style={styles.analogyLabel}>Player Analogy</Text>
            <Text style={styles.analogyText}>{week.coachScience.playerAnalogy}</Text>
          </View>
          <View style={[styles.analogyBox, { backgroundColor: ACCENT + '08' }]}>
            <Text style={styles.analogyLabel}>Baseball Analogy</Text>
            <Text style={styles.analogyText}>{week.coachScience.baseballAnalogy}</Text>
          </View>
        </View>

        {/* Questions (if any) */}
        {week.questions && week.questions.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>QUESTIONS TO PONDER</Text>
            {week.questions.map((q, i) => {
              const inputKey = `w${weekNum}-q${i}`;
              return (
                <View key={i} style={styles.questionCard}>
                  <Text style={styles.questionText}>{q.question}</Text>
                  <Text style={styles.insightText}>{q.insight}</Text>
                  <TextInput
                    style={styles.questionInput}
                    placeholder="Your thoughts…"
                    placeholderTextColor={colors.textMuted}
                    multiline
                    value={progress.inputs[inputKey] ?? ''}
                    onChangeText={(v) => progress.setInput(inputKey, v)}
                  />
                </View>
              );
            })}
          </>
        )}

        {/* Outline / Segments */}
        <Text style={styles.sectionLabel}>COURSE OUTLINE</Text>
        {week.outline.map((seg: OutlineSegment, idx: number) => {
          const sectionId = seg.segment.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          const isComplete = progress.isSectionComplete(weekNum, sectionId);
          const isExpanded = expandedIdx === idx;

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.segCard, isComplete && { borderColor: '#22c55e40', backgroundColor: '#22c55e06' }]}
              onPress={() => setExpandedIdx(isExpanded ? null : idx)}
              activeOpacity={0.8}
            >
              <View style={styles.segTop}>
                <TouchableOpacity
                  style={[styles.checkCircle, isComplete && { backgroundColor: '#22c55e', borderColor: '#22c55e' }]}
                  onPress={() => {
                    if (isComplete) progress.unmarkSectionComplete(weekNum, sectionId);
                    else progress.markSectionComplete(weekNum, sectionId);
                  }}
                >
                  {isComplete && <Ionicons name="checkmark" size={12} color="#fff" />}
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.segTitle, isComplete && { color: colors.textMuted }]}>{seg.segment}</Text>
                  {isExpanded && (
                    <View style={styles.segDetail}>
                      <Text style={styles.segFocus}>Focus: {seg.focus}</Text>
                      <Text style={styles.segObjective}>Goal: {seg.objective}</Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.textMuted}
                />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Tier gating note */}
        {!canAccess && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
            <Text style={[styles.upgradeBannerText, { color: ACCENT }]}>
              Upgrade to Double for full course access
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  progressBadge: { fontSize: 12, fontWeight: '800' },

  phaseRow: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  phaseTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  phaseTabText: { fontSize: 13, fontWeight: '800', color: colors.textMuted },

  content: { padding: 16, paddingBottom: 60, gap: 12 },

  weekCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 6,
  },
  weekTitle: { fontSize: 18, fontWeight: '900' },
  weekQuote: { fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', lineHeight: 19 },
  weekObj: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginTop: 4 },

  scienceCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 8,
  },
  scienceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scienceTitle: { fontSize: 14, fontWeight: '900' },
  sciencePoint: { flexDirection: 'row', gap: 8 },
  bullet: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  scienceText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  analogyBox: { borderRadius: radius.sm, padding: 12, gap: 4, marginTop: 4 },
  analogyLabel: { fontSize: 10, fontWeight: '900', color: colors.textMuted, letterSpacing: 1 },
  analogyText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, fontStyle: 'italic' },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 4 },

  questionCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 6,
  },
  questionText: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, lineHeight: 20 },
  insightText: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },
  questionInput: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, padding: 10, minHeight: 60,
    fontSize: 13, color: colors.textPrimary, lineHeight: 19, marginTop: 4,
  },

  segCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  segTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  segTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  segDetail: { gap: 2, marginTop: 6 },
  segFocus: { fontSize: 12, color: colors.textSecondary },
  segObjective: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#8b5cf608', borderWidth: 1, borderColor: '#8b5cf630',
    borderRadius: radius.lg, padding: 14,
  },
  upgradeBannerText: { flex: 1, fontSize: 13, fontWeight: '700' },
});

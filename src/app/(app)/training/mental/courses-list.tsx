import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { COURSE_LIST, COURSE_REGISTRY } from '@/data/course-registry';
import { readCourseProgress } from '@/hooks/useCourseProgress';

const ACCENT = '#a855f7';

/**
 * Sequential unlocking:
 * - Week 1 is always unlocked (if tier allows)
 * - Week N+1 unlocks when Week N is 100% complete
 */
function useUnlockedWeeks() {
  const [maxUnlocked, setMaxUnlocked] = useState(1);

  useEffect(() => {
    (async () => {
      let unlocked = 1;
      for (const course of COURSE_LIST) {
        if (course.totalSections === 0) break;
        const completed = await readCourseProgress(course.id);
        if (completed >= course.totalSections) {
          unlocked = course.week + 1;
        } else {
          break;
        }
      }
      setMaxUnlocked(unlocked);
    })();
  }, []);

  return maxUnlocked;
}

export default function CoursesListScreen() {
  const { hasFullMental, isCoach } = useTier();
  const canAccess = hasFullMental || isCoach;
  const maxUnlocked = useUnlockedWeeks();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL MASTERY</Text>
          <Text style={styles.headerTitle}>11-Week Course</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>11 weeks</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          A sequential 11-week mental performance curriculum. Each week targets one core skill and exposes the shadow pattern sabotaging it. Complete each week to unlock the next.
        </Text>

        {COURSE_LIST.map((course) => {
          const weekLocked = !canAccess || course.week > maxUnlocked;

          return (
            <TouchableOpacity
              key={course.id}
              style={[styles.card, weekLocked && styles.cardLocked]}
              onPress={() => {
                if (weekLocked) return;
                router.push(`/(app)/training/mental/course?id=${course.id}` as any);
              }}
              activeOpacity={weekLocked ? 1 : 0.8}
            >
              {/* Week badge */}
              <View style={[styles.weekBadge, { backgroundColor: weekLocked ? colors.border : course.color + '20' }]}>
                <Text style={[styles.weekNum, { color: weekLocked ? colors.textMuted : course.color }]}>
                  {course.week}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                {/* Skill name */}
                <Text style={[styles.cardTitle, weekLocked && { color: colors.textMuted }]}>
                  {course.label}
                </Text>

                {/* What it builds */}
                <Text style={styles.buildText} numberOfLines={1}>
                  {course.whatItBuilds}
                </Text>

                {/* Shadow pattern */}
                <View style={styles.shadowRow}>
                  <Ionicons
                    name="warning-outline"
                    size={11}
                    color={weekLocked ? colors.textMuted : '#f59e0b'}
                  />
                  <Text style={[styles.shadowText, weekLocked && { color: colors.textMuted }]}>
                    Shadow: {course.shadowPattern}
                  </Text>
                </View>
              </View>

              {weekLocked ? (
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              )}
            </TouchableOpacity>
          );
        })}

        {!canAccess && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
            <Text style={styles.upgradeBannerText}>
              Upgrade to Double to unlock the Mental Mastery Course
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  countBadge: {
    backgroundColor: ACCENT + '15', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  countText: { fontSize: 11, fontWeight: '800', color: ACCENT },

  content: { padding: 16, paddingBottom: 60, gap: 10 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4 },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  cardLocked: { opacity: 0.45 },

  weekBadge: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  weekNum: { fontSize: 16, fontWeight: '900' },

  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  buildText: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  shadowRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  shadowText: { fontSize: 11, color: '#f59e0b', fontWeight: '600' },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14, marginTop: 4,
  },
  upgradeBannerText: { flex: 1, fontSize: 13, fontWeight: '700', color: ACCENT },
});

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { COURSE_LIST } from '@/data/course-registry';

const ACCENT = '#8b5cf6';

export default function CoursesListScreen() {
  const { hasFullMental, isCoach } = useTier();
  const canAccess = hasFullMental || isCoach;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL VAULT</Text>
          <Text style={styles.headerTitle}>Courses</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{COURSE_LIST.length} courses</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          6 core mental skill courses. Each has a Shadow week and a Mastery week.
        </Text>

        {COURSE_LIST.map((course, idx) => {
          const locked = !canAccess && idx >= 2;
          return (
            <TouchableOpacity
              key={course.id}
              style={[styles.card, locked && styles.cardLocked]}
              onPress={() => {
                if (locked) return;
                router.push(`/(app)/training/mental/course?id=${course.id}` as any);
              }}
              activeOpacity={locked ? 1 : 0.8}
            >
              <View style={[styles.icon, { backgroundColor: course.color + '18' }]}>
                <Ionicons
                  name={locked ? 'lock-closed-outline' : 'school-outline'}
                  size={22}
                  color={locked ? colors.textMuted : course.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, locked && { color: colors.textMuted }]}>
                  {course.label}
                </Text>
                <Text style={styles.cardSub}>
                  Skill #{course.skillNum} · {course.totalSections} sections
                </Text>
              </View>
              {!locked && (
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
              Upgrade to Double to unlock all courses
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
  cardLocked: { opacity: 0.5 },
  icon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  cardSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14, marginTop: 4,
  },
  upgradeBannerText: { flex: 1, fontSize: 13, fontWeight: '700', color: ACCENT },
});

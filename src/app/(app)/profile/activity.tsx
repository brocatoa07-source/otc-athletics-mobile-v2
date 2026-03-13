import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';

const ACCENT = '#8b5cf6';

interface ActivityEntry {
  key: string;
  label: string;
  category: 'mental' | 'hitting';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  timestamp?: string;
  detail?: string;
}

/** Storage keys to check for activity */
const ACTIVITY_SOURCES: {
  storageKey: string;
  label: string;
  category: 'mental' | 'hitting';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  extractDetail?: (data: any) => string | undefined;
}[] = [
  {
    storageKey: 'otc:mental-daily-work',
    label: 'Mental Daily Work',
    category: 'mental',
    icon: 'flash-outline',
    color: ACCENT,
    extractDetail: (d) => {
      if (!d?.items) return undefined;
      const done = Object.values(d.completion ?? {}).filter(Boolean).length;
      return `${done}/${d.items.length} tasks completed · ${d.date}`;
    },
  },
  {
    storageKey: 'otc:identity-builder',
    label: 'Identity Builder',
    category: 'mental',
    icon: 'construct-outline',
    color: '#22c55e',
    extractDetail: (d) => {
      if (!d?.statement) return 'No statement set';
      const habits = Object.values(d.habits ?? {}).filter(Boolean).length;
      return `Statement set · ${habits} habits tracked`;
    },
  },
  {
    storageKey: 'otc:mental-profile',
    label: 'Mental Profile Quiz',
    category: 'mental',
    icon: 'person-circle-outline',
    color: '#a855f7',
    extractDetail: (d) => {
      const slug = d?.slug ?? d;
      return slug ? `Profile: ${slug}` : undefined;
    },
  },
  {
    storageKey: 'otc:mental-struggles',
    label: 'Mental Struggles Assessment',
    category: 'mental',
    icon: 'clipboard-outline',
    color: '#3b82f6',
    extractDetail: (d) => {
      if (!d?.primary) return undefined;
      return `Primary: ${d.primary} · Secondary: ${d.secondary}`;
    },
  },
  {
    storageKey: 'otc:dugout-card',
    label: 'Dugout Card',
    category: 'mental',
    icon: 'document-text-outline',
    color: '#E10600',
    extractDetail: (d) => d?.identity_cue ? `Identity: "${d.identity_cue}"` : undefined,
  },
  {
    storageKey: 'otc:mechanical-diagnostic',
    label: 'Swing Diagnostic',
    category: 'hitting',
    icon: 'analytics-outline',
    color: '#E10600',
    extractDetail: (d) => {
      if (!d?.primary) return undefined;
      return `Primary: ${d.primary} · Secondary: ${d.secondary}`;
    },
  },
  {
    storageKey: 'otc:mover-type',
    label: 'Mover Type Quiz',
    category: 'hitting',
    icon: 'body-outline',
    color: '#f59e0b',
    extractDetail: (d) => {
      if (d?.primary) return `Primary: ${d.primary} · Secondary: ${d.secondary}`;
      const slug = d?.slug ?? d;
      return slug ? `Type: ${slug}` : undefined;
    },
  },
  {
    storageKey: 'otc:daily-work',
    label: 'Daily Work',
    category: 'hitting',
    icon: 'flash-outline',
    color: '#3b82f6',
    extractDetail: (d) => {
      if (!d?.items) return undefined;
      const done = Object.values(d.completion ?? {}).filter(Boolean).length;
      return `${done}/${d.items.length} tasks · ${d.date}`;
    },
  },
];

type TabKey = 'all' | 'mental' | 'hitting';

export default function ActivityScreen() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [tab, setTab] = useState<TabKey>('all');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadActivity();
  }, []);

  async function loadActivity() {
    const results: ActivityEntry[] = [];

    for (const source of ACTIVITY_SOURCES) {
      try {
        const raw = await AsyncStorage.getItem(source.storageKey);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const detail = source.extractDetail?.(parsed);
        results.push({
          key: source.storageKey,
          label: source.label,
          category: source.category,
          icon: source.icon,
          color: source.color,
          detail: detail ?? 'Completed',
        });
      } catch {}
    }

    setEntries(results);
    setLoaded(true);
  }

  const filtered = tab === 'all' ? entries : entries.filter((e) => e.category === tab);
  const mentalCount = entries.filter((e) => e.category === 'mental').length;
  const hittingCount = entries.filter((e) => e.category === 'hitting').length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>PROFILE</Text>
          <Text style={styles.headerTitle}>Activity & History</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {([
          { key: 'all' as TabKey, label: 'All', count: entries.length },
          { key: 'mental' as TabKey, label: 'Mental', count: mentalCount },
          { key: 'hitting' as TabKey, label: 'Hitting', count: hittingCount },
        ]).map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
            <View style={[styles.tabBadge, tab === t.key && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, tab === t.key && styles.tabBadgeTextActive]}>
                {t.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!loaded && (
          <Text style={styles.loadingText}>Loading activity...</Text>
        )}

        {loaded && filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Activity Yet</Text>
            <Text style={styles.emptyDesc}>
              Complete diagnostics, daily work, and journal entries to see your history here.
            </Text>
          </View>
        )}

        {filtered.map((entry) => (
          <View key={entry.key} style={styles.entryCard}>
            <View style={[styles.entryIcon, { backgroundColor: entry.color + '18' }]}>
              <Ionicons name={entry.icon} size={20} color={entry.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.entryTitleRow}>
                <Text style={styles.entryLabel}>{entry.label}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: entry.category === 'mental' ? ACCENT + '15' : '#E1060015' }]}>
                  <Text style={[styles.categoryText, { color: entry.category === 'mental' ? ACCENT : '#E10600' }]}>
                    {entry.category === 'mental' ? 'Mental' : 'Hitting'}
                  </Text>
                </View>
              </View>
              {entry.detail && (
                <Text style={styles.entryDetail}>{entry.detail}</Text>
              )}
            </View>
          </View>
        ))}

        {/* Course progress */}
        {loaded && <CourseProgressSection />}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Shows any course progress stored locally */
function CourseProgressSection() {
  const [courses, setCourses] = useState<{ id: string; progress: number; total: number }[]>([]);

  useEffect(() => {
    loadCourseProgress();
  }, []);

  async function loadCourseProgress() {
    const courseIds = ['awareness', 'confidence', 'focus', 'emotional-control', 'resilience', 'accountability'];
    const found: typeof courses = [];

    for (const id of courseIds) {
      try {
        const raw = await AsyncStorage.getItem(`otc:course-progress-${id}`);
        if (!raw) continue;
        const data = JSON.parse(raw);
        const completed = Object.values(data.completed ?? {}).filter(Boolean).length;
        const total = Object.keys(data.completed ?? {}).length;
        if (total > 0) found.push({ id, progress: completed, total });
      } catch {}
    }

    setCourses(found);
  }

  if (courses.length === 0) return null;

  return (
    <View style={styles.courseSection}>
      <Text style={styles.courseSectionTitle}>COURSE PROGRESS</Text>
      {courses.map((c) => (
        <View key={c.id} style={styles.courseRow}>
          <View style={[styles.courseDot, { backgroundColor: ACCENT }]} />
          <Text style={styles.courseName}>{c.id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</Text>
          <Text style={styles.courseProgress}>{c.progress}/{c.total}</Text>
        </View>
      ))}
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  tabs: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  tabActive: { backgroundColor: ACCENT + '15', borderColor: ACCENT + '40' },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: ACCENT },
  tabBadge: { backgroundColor: colors.border, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  tabBadgeActive: { backgroundColor: ACCENT + '30' },
  tabBadgeText: { fontSize: 10, fontWeight: '800', color: colors.textMuted },
  tabBadgeTextActive: { color: ACCENT },

  content: { padding: 16, paddingBottom: 60, gap: 10 },
  loadingText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingVertical: 40 },

  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  emptyDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },

  entryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  entryIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  entryTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  entryLabel: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  entryDetail: { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 17 },
  categoryBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  categoryText: { fontSize: 9, fontWeight: '900' },

  courseSection: { marginTop: 8, gap: 8 },
  courseSectionTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted },
  courseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 12,
  },
  courseDot: { width: 8, height: 8, borderRadius: 4 },
  courseName: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  courseProgress: { fontSize: 13, fontWeight: '800', color: ACCENT },
});

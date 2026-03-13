import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { SKILLS_BY_KEY } from '@/data/skillsJournal';
import { ADVANCED_SKILL_TRACKS } from '@/data/advanced-skill-tracks';
import { COURSE_REGISTRY } from '@/data/course-registry';

const ACCENT = '#8b5cf6';

export default function SkillDetailScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const { hasFullMental, isCoach } = useTier();
  const canAccess = hasFullMental || isCoach;

  const skill = SKILLS_BY_KEY[key ?? ''];
  const advanced = ADVANCED_SKILL_TRACKS[key ?? ''];
  const course = skill?.courseId ? COURSE_REGISTRY[skill.courseId] : null;

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!skill) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Skill Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const color = skill.color;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color }]}>
            SKILL #{skill.num} {advanced ? '· ADVANCED' : '· CORE'}
          </Text>
          <Text style={styles.headerTitle}>{skill.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.heroCard, { borderColor: color + '30' }]}>
          <View style={[styles.heroIcon, { backgroundColor: color + '15' }]}>
            <Ionicons name={skill.icon} size={32} color={color} />
          </View>
          <Text style={[styles.heroName, { color }]}>{skill.name}</Text>
          <Text style={styles.heroBuilds}>{skill.builds}</Text>
        </View>

        {/* Shadow */}
        <View style={[styles.shadowCard, { borderColor: '#f59e0b30' }]}>
          <Text style={styles.shadowLabel}>THE SHADOW</Text>
          <Text style={styles.shadowName}>{skill.shadow}</Text>
          <Text style={styles.shadowLooks}>{skill.looksLike}</Text>
          {advanced && (
            <Text style={styles.shadowDesc}>{advanced.shadowDescription}</Text>
          )}
        </View>

        {/* Course CTA (skills 1-6) */}
        {course && (
          <TouchableOpacity
            style={[styles.courseCard, { borderColor: color + '30' }]}
            onPress={() => router.push(`/(app)/training/mental/course?id=${course.id}` as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="school-outline" size={20} color={color} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.courseTitle, { color }]}>{course.label} Course</Text>
              <Text style={styles.courseSub}>2-week Shadow → Mastery course</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={color} />
          </TouchableOpacity>
        )}

        {/* Advanced Track Content (skills 7-11) */}
        {advanced && (
          <>
            {/* Looks Like */}
            <CollapsibleSection
              title="WHAT IT LOOKS LIKE"
              color={color}
              isOpen={expandedSection === 'looks'}
              onToggle={() => setExpandedSection(expandedSection === 'looks' ? null : 'looks')}
            >
              {advanced.looksLike.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </CollapsibleSection>

            {/* Core Cues */}
            <CollapsibleSection
              title="CORE CUES"
              color={color}
              isOpen={expandedSection === 'cues'}
              onToggle={() => setExpandedSection(expandedSection === 'cues' ? null : 'cues')}
            >
              {advanced.coreCues.map((cue, i) => (
                <View key={i} style={[styles.cueCard, { backgroundColor: color + '08' }]}>
                  <Text style={[styles.cueText, { color }]}>{cue}</Text>
                </View>
              ))}
            </CollapsibleSection>

            {/* Tools */}
            <CollapsibleSection
              title="TOOLS"
              color={color}
              isOpen={expandedSection === 'tools'}
              onToggle={() => setExpandedSection(expandedSection === 'tools' ? null : 'tools')}
            >
              {advanced.tools.map((tool, i) => (
                <View key={i} style={styles.listItem}>
                  <Ionicons name="build-outline" size={14} color={color} style={{ marginTop: 2 }} />
                  <Text style={styles.listText}>{tool}</Text>
                </View>
              ))}
            </CollapsibleSection>

            {/* Journal Prompts */}
            <CollapsibleSection
              title="JOURNAL PROMPTS"
              color={color}
              isOpen={expandedSection === 'journal'}
              onToggle={() => setExpandedSection(expandedSection === 'journal' ? null : 'journal')}
            >
              {advanced.journalPrompts.map((prompt, i) => (
                <View key={i} style={[styles.promptCard, { borderColor: color + '25' }]}>
                  <Ionicons name="chatbox-ellipses-outline" size={14} color={color} />
                  <Text style={styles.promptText}>{prompt}</Text>
                </View>
              ))}
            </CollapsibleSection>

            {/* Daily Routine */}
            <CollapsibleSection
              title="DAILY ROUTINE"
              color={color}
              isOpen={expandedSection === 'routine'}
              onToggle={() => setExpandedSection(expandedSection === 'routine' ? null : 'routine')}
            >
              {advanced.routine.map((step, i) => (
                <View key={i} style={styles.routineStep}>
                  <View style={[styles.routineNum, { backgroundColor: color + '18' }]}>
                    <Text style={[styles.routineNumText, { color }]}>{i + 1}</Text>
                  </View>
                  <Text style={styles.routineText}>{step}</Text>
                </View>
              ))}
            </CollapsibleSection>
          </>
        )}

        {/* Tier gating */}
        {!canAccess && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
            <Text style={styles.upgradeBannerText}>Upgrade to Double for full skill access</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CollapsibleSection({
  title, color, isOpen, onToggle, children,
}: {
  title: string;
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View>
      <TouchableOpacity style={styles.collapseHeader} onPress={onToggle} activeOpacity={0.7}>
        <Text style={[styles.collapseTitle, { color }]}>{title}</Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
      </TouchableOpacity>
      {isOpen && <View style={styles.collapseBody}>{children}</View>}
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 16, paddingBottom: 60, gap: 12 },

  heroCard: {
    alignItems: 'center', gap: 10, padding: 20,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
  },
  heroIcon: {
    width: 64, height: 64, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  heroName: { fontSize: 24, fontWeight: '900' },
  heroBuilds: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  shadowCard: {
    backgroundColor: '#f59e0b08', borderWidth: 1, borderRadius: radius.lg,
    padding: 16, gap: 6,
  },
  shadowLabel: { fontSize: 9, fontWeight: '900', color: '#f59e0b', letterSpacing: 1.5 },
  shadowName: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  shadowLooks: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  shadowDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginTop: 4, fontStyle: 'italic' },

  courseCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg, padding: 14,
  },
  courseTitle: { fontSize: 15, fontWeight: '900' },
  courseSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  collapseHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10,
  },
  collapseTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  collapseBody: { gap: 8, marginBottom: 4 },

  listItem: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bullet: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  listText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  cueCard: { borderRadius: radius.sm, padding: 12 },
  cueText: { fontSize: 14, fontWeight: '700', fontStyle: 'italic' },

  promptCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.sm, padding: 12,
  },
  promptText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19, fontStyle: 'italic' },

  routineStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  routineNum: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  routineNumText: { fontSize: 12, fontWeight: '900' },
  routineText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19, paddingTop: 4 },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14,
  },
  upgradeBannerText: { flex: 1, fontSize: 13, fontWeight: '700', color: ACCENT },
});

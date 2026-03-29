/**
 * SkillFocusCard — Dashboard widget showing top 2 focus skills per category.
 *
 * Focus skills are determined by diagnostics + lowest scores.
 * Tapping navigates to the full Skill Progress screen.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius } from '@/theme';
import {
  getSkillMeta,
  type SkillKey,
  type SkillScore,
  type FocusSkills,
} from '@/data/skill-progress-engine';

interface Props {
  scores: Record<SkillKey, SkillScore>;
  focus: FocusSkills;
}

const SECTION_CONFIG: { key: keyof FocusSkills; label: string; accent: string }[] = [
  { key: 'hitting', label: 'HITTING', accent: '#E10600' },
  { key: 'mental', label: 'MENTAL', accent: '#A78BFA' },
  { key: 'physical', label: 'PHYSICAL', accent: '#1DB954' },
];

export function SkillFocusCard({ scores, focus }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/(app)/training/skill-progress' as any)}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="analytics-outline" size={16} color="#3b82f6" />
        </View>
        <Text style={styles.label}>SKILL FOCUS</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
      </View>

      <View style={styles.sections}>
        {SECTION_CONFIG.map((section) => {
          const keys = focus[section.key];
          return (
            <View key={section.key} style={styles.section}>
              <Text style={[styles.sectionLabel, { color: section.accent }]}>{section.label}</Text>
              {keys.map((skillKey) => {
                const meta = getSkillMeta(skillKey);
                const scoreData = scores[skillKey];
                const val = scoreData?.score ?? 0;
                const hasData = (scoreData?.logCount ?? 0) > 0;
                return (
                  <View key={skillKey} style={styles.skillRow}>
                    <Ionicons name={meta.icon as any} size={12} color={meta.color} style={{ width: 16 }} />
                    <Text style={styles.skillLabel}>{meta.label}</Text>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: `${val}%`, backgroundColor: meta.color }]} />
                    </View>
                    <Text style={[styles.skillValue, { color: hasData ? meta.color : colors.textMuted }]}>
                      {hasData ? `${val}%` : '—'}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 10,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#3b82f618',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
  sections: { gap: 10 },
  section: { gap: 5 },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skillLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    width: 90,
  },
  track: {
    flex: 1,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: 5,
    borderRadius: 3,
  },
  skillValue: {
    fontSize: 11,
    fontWeight: '800',
    width: 30,
    textAlign: 'right',
  },
});

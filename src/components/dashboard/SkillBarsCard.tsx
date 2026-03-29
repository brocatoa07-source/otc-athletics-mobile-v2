import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { SkillScores } from '@/data/engagement-engine';

const SKILLS: { key: keyof SkillScores; label: string; icon: string; color: string }[] = [
  { key: 'confidence', label: 'Confidence', icon: 'shield-checkmark-outline', color: '#A78BFA' },
  { key: 'focus', label: 'Focus', icon: 'eye-outline', color: '#3b82f6' },
  { key: 'power', label: 'Power', icon: 'flash-outline', color: '#E10600' },
  { key: 'timing', label: 'Timing', icon: 'timer-outline', color: '#f59e0b' },
  { key: 'consistency', label: 'Consistency', icon: 'repeat-outline', color: '#22c55e' },
];

export function SkillBarsCard({ skills }: { skills: SkillScores }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="stats-chart-outline" size={16} color="#3b82f6" />
        </View>
        <Text style={styles.label}>SKILL PROGRESS</Text>
      </View>

      <View style={styles.bars}>
        {SKILLS.map((skill) => {
          const val = skills[skill.key];
          return (
            <View key={skill.key} style={styles.barRow}>
              <Ionicons name={skill.icon as any} size={13} color={skill.color} style={{ width: 16 }} />
              <Text style={styles.barLabel}>{skill.label}</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${val}%`, backgroundColor: skill.color }]} />
              </View>
              <Text style={[styles.barValue, { color: skill.color }]}>{val}%</Text>
            </View>
          );
        })}
      </View>
    </View>
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
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
  bars: { gap: 8 },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    width: 80,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '800',
    width: 32,
    textAlign: 'right',
  },
});

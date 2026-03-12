import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { DayPlan } from '@/data/week-program-engine';

interface Props {
  todayPlan: DayPlan | null;
  weekNumber?: number;
  phase?: string;
}

const ACCENT = '#22c55e';

export function BlockIntelligenceStrip({ todayPlan, weekNumber, phase }: Props) {
  if (!todayPlan || todayPlan.type === 'rest') return null;

  const blocks = todayPlan.blocks
    ? Object.entries(todayPlan.blocks)
        .filter(([, exercises]) => exercises.length > 0)
        .map(([name]) => name)
    : [];

  const blockSummary = blocks.slice(0, 3).join(' · ');
  const hasMore = blocks.length > 3;

  return (
    <View style={styles.strip}>
      <View style={[styles.iconWrap]}>
        <Ionicons name="layers-outline" size={16} color={ACCENT} />
      </View>
      <View style={{ flex: 1 }}>
        {blockSummary ? (
          <Text style={styles.blocks} numberOfLines={1}>
            {blockSummary}{hasMore ? ' +more' : ''}
          </Text>
        ) : (
          <Text style={styles.blocks}>Training session</Text>
        )}
        <Text style={styles.meta}>
          {[
            weekNumber ? `Wk ${weekNumber}` : null,
            phase ?? null,
            `~${todayPlan.estimatedMinutes ?? 0} min`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ACCENT + '0D',
    borderWidth: 1,
    borderColor: ACCENT + '30',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: ACCENT + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blocks: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 1,
  },
});

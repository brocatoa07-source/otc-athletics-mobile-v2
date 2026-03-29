import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius } from '@/theme';
import type { NextPriority } from '@/data/engagement-engine';

const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  hitting: { icon: 'baseball-outline', color: '#E10600' },
  strength: { icon: 'barbell-outline', color: '#1DB954' },
  mental: { icon: 'brain-outline', color: '#A78BFA' },
  recovery: { icon: 'heart-outline', color: '#3b82f6' },
};

export function NextPriorityCard({ priority }: { priority: NextPriority }) {
  const config = CATEGORY_CONFIG[priority.category] ?? CATEGORY_CONFIG.hitting;

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: config.color + '30' }]}
      onPress={() => {
        if (priority.drillRoute) {
          router.push(priority.drillRoute as any);
        }
      }}
      activeOpacity={priority.drillRoute ? 0.85 : 1}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: config.color + '18' }]}>
          <Ionicons name={config.icon as any} size={18} color={config.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>NEXT PRIORITY</Text>
          <Text style={styles.title}>{priority.title}</Text>
        </View>
        {priority.drillRoute && (
          <Ionicons name="arrow-forward-circle" size={24} color={config.color} />
        )}
      </View>

      <Text style={styles.explanation}>{priority.explanation}</Text>

      {priority.recommendedDrill && (
        <View style={[styles.drillTag, { backgroundColor: config.color + '12', borderColor: config.color + '30' }]}>
          <Ionicons name="play-circle-outline" size={14} color={config.color} />
          <Text style={[styles.drillText, { color: config.color }]}>{priority.recommendedDrill}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
    gap: 10,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 1,
  },
  explanation: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  drillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  drillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

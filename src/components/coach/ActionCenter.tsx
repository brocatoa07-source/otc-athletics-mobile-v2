import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import type { DashboardStats } from '@/hooks/useCoachDashboard';

interface Card {
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  label: string;
  color: string;
  route: string;
}

export function ActionCenter({ stats }: { stats: DashboardStats }) {
  const cards: Card[] = [
    {
      icon: 'eye-outline',
      count: stats.toReview,
      label: 'To Review',
      color: '#ef4444',
      route: '/(app)/coach/roster',
    },
    {
      icon: 'videocam-outline',
      count: stats.videosPending,
      label: 'Videos',
      color: '#3b82f6',
      route: '/(app)/messages',
    },
    {
      icon: 'clipboard-outline',
      count: stats.programsToUpdate,
      label: 'Programs',
      color: '#8b5cf6',
      route: '/(app)/coach/programs',
    },
    {
      icon: 'chatbubble-outline',
      count: stats.unreadMessages,
      label: 'Messages',
      color: '#f59e0b',
      route: '/(app)/messages',
    },
  ];

  return (
    <View style={styles.grid}>
      {cards.map((card) => (
        <TouchableOpacity
          key={card.label}
          style={styles.card}
          onPress={() => router.push(card.route as any)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, { backgroundColor: card.color + '18' }]}>
            <Ionicons name={card.icon} size={20} color={card.color} />
          </View>
          <Text style={[styles.count, { color: card.color }]}>{card.count}</Text>
          <Text style={styles.label}>{card.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingVertical: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { fontSize: 22, fontWeight: '900' },
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

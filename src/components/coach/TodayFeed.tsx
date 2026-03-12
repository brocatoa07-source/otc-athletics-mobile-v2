import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import type { ActivityFeedItem } from '@/hooks/useCoachDashboard';

interface Props {
  items: ActivityFeedItem[];
}

const FEED_ACTION_LABEL: Record<string, string> = {
  video_upload: 'uploaded a video',
  session_log:  'logged a session',
  journal_log:  'wrote in their journal',
  message:      'sent a message',
};

export function TodayFeed({ items }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>TODAY'S FEED</Text>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="flash-outline" size={28} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No activity yet today</Text>
        </View>
      ) : (
        items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: '/(app)/coach/athlete-detail',
                params: { userId: item.athleteId ?? '' },
              } as any)
            }
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.iconColor + '18' }]}>
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={16}
                color={item.iconColor}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.text} numberOfLines={1}>
                <Text style={styles.name}>{item.athleteName}</Text>
                {'  '}
                {FEED_ACTION_LABEL[item.type] ?? item.type}
              </Text>
              <Text style={styles.time}>{item.relativeTime}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  emptyText: { fontSize: 13, color: Colors.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  text: { fontSize: 13, color: Colors.textPrimary },
  name: { fontWeight: '800' },
  time: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
});

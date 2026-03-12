import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

export function CoachTools() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>TOOLS</Text>

      <NavCard
        icon="people"
        color="#3b82f6"
        title="My Athletes"
        desc="Roster, progress & quiz results"
        route="/(app)/coach/roster"
      />
      <NavCard
        icon="clipboard"
        color="#8b5cf6"
        title="Programs"
        desc="View, create & assign programs"
        route="/(app)/coach/programs"
      />
      <NavCard
        icon="chatbubbles"
        color="#f59e0b"
        title="Messages"
        desc="Chat with your athletes"
        route="/(app)/messages"
      />

      <View style={styles.miniRow}>
        <MiniCard
          icon="baseball-outline"
          color="#22c55e"
          title="New Hitting"
          desc="Drills + focus"
          route="/(app)/coach/hitting-program"
        />
        <MiniCard
          icon="barbell-outline"
          color="#3b82f6"
          title="New Lifting"
          desc="Day + section"
          route="/(app)/coach/lifting-program"
        />
        <MiniCard
          icon="cloud-upload-outline"
          color="#f59e0b"
          title="Import CSV"
          desc="Bulk program"
          route="/(app)/coach/import-program"
        />
      </View>
    </View>
  );
}

function NavCard({
  icon,
  color,
  title,
  desc,
  route,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  desc: string;
  route: string;
}) {
  return (
    <TouchableOpacity
      style={styles.navCard}
      onPress={() => router.push(route as any)}
      activeOpacity={0.7}
    >
      <View style={[styles.navIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.navInfo}>
        <Text style={styles.navTitle}>{title}</Text>
        <Text style={styles.navDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

function MiniCard({
  icon,
  color,
  title,
  desc,
  route,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  desc: string;
  route: string;
}) {
  return (
    <TouchableOpacity
      style={styles.miniCard}
      onPress={() => router.push(route as any)}
      activeOpacity={0.7}
    >
      <View style={[styles.miniIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.miniTitle}>{title}</Text>
      <Text style={styles.miniDesc}>{desc}</Text>
    </TouchableOpacity>
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
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },
  navIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navInfo: { flex: 1 },
  navTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  navDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },

  miniRow: { flexDirection: 'row', gap: 10 },
  miniCard: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
    padding: 15,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },
  miniIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  miniDesc: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
});

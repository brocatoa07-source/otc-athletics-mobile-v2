import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTier } from '@/hooks/useTier';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';

const SECTIONS = [
  {
    key: 'announcements',
    icon: 'megaphone' as const,
    label: 'Announcements',
    desc: 'Official updates from the coaching staff',
    accentColor: Colors.primary,
  },
  {
    key: 'leaderboards',
    icon: 'trophy' as const,
    label: 'Leaderboards',
    desc: 'Rankings for streaks, exit velo, bat speed & more',
    accentColor: '#f59e0b',
  },
];

export default function CommunityIndex() {
  const { isWalk } = useTier();

  const { data: announcementCount = 0 } = useQuery({
    queryKey: ['community-announcement-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const getBadge = (key: string): number | null => {
    if (key === 'announcements' && announcementCount > 0) return announcementCount;
    return null;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Community</Text>
          <Text style={styles.sub}>OTC Athletics — Elite by design.</Text>
        </View>
        {isWalk && (
          <View style={styles.viewOnlyBadge}>
            <Ionicons name="eye-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.viewOnlyText}>View Only</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((sec) => {
          const badge = getBadge(sec.key);
          return (
            <TouchableOpacity
              key={sec.key}
              style={styles.card}
              onPress={() => router.push(`/(app)/community/${sec.key}` as any)}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBox, { backgroundColor: sec.accentColor + '20' }]}>
                <Ionicons name={sec.icon} size={22} color={sec.accentColor} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: sec.accentColor }]}>{sec.label}</Text>
                <Text style={styles.cardDesc}>{sec.desc}</Text>
              </View>
              <View style={styles.cardRight}>
                {badge !== null && (
                  <View style={[styles.badge, { backgroundColor: sec.accentColor }]}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          );
        })}

        {isWalk && (
          <TouchableOpacity
            style={styles.upgradeHint}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="lock-closed-outline" size={16} color={Colors.primary} />
            <View style={styles.upgradeBody}>
              <Text style={styles.upgradeTitle}>
                Upgrade to <Text style={styles.otcLabLink}>OTC Triple</Text> to post
              </Text>
              <Text style={styles.upgradeSub}>
                Walk can read all sections. Triple members can post, react, and join challenges.
              </Text>
            </View>
            <View style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>$120/mo</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  viewOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewOnlyText: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  content: { padding: 16, gap: 10, paddingBottom: 48 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardText: { flex: 1, gap: 3 },
  cardLabel: { fontSize: 15, fontWeight: '900' },
  cardDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  upgradeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    padding: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    borderRadius: 14,
  },
  upgradeBody: { flex: 1 },
  upgradeTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  otcLabLink: { color: Colors.primary, textDecorationLine: 'underline' },
  upgradeSub: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginTop: 2 },
  upgradeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  upgradeBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },
});

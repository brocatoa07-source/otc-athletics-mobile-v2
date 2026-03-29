/**
 * Mobility Category Screen — Lists all flows in a category.
 *
 * Route: /(app)/training/sc/mobility/category?cat=mobility|movement_prep|yoga_flow
 */

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { getFlowsByCategory } from '@/data/mobility-vault/flows';
import { MOBILITY_VAULT_CATEGORIES } from '@/data/mobility-vault/categories';
import type { Flow } from '@/data/mobility-vault/types';

export default function MobilityCategoryScreen() {
  const { cat } = useLocalSearchParams<{ cat: string }>();
  const category = MOBILITY_VAULT_CATEGORIES.find((c) => c.slug === cat);
  const flows = getFlowsByCategory(cat ?? '');

  if (!category) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: category.color }]}>{category.title.toUpperCase()}</Text>
          <Text style={styles.headerTitle}>{category.title}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{flows.length} flow{flows.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.desc}>{category.description}</Text>

        {flows.map((flow) => (
          <FlowCard key={flow.id} flow={flow} accent={category.color} />
        ))}

        {flows.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="construct-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Coming Soon</Text>
            <Text style={styles.emptySub}>Flows for this category are being built.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FlowCard({ flow, accent }: { flow: Flow; accent: string }) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: accent + '20' }]}
      onPress={() => router.push(`/(app)/training/sc/mobility/${flow.slug}` as any)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: accent + '15' }]}>
          <Ionicons name="body-outline" size={18} color={accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{flow.title}</Text>
          <Text style={styles.cardSub}>{flow.athleteDescription}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>{flow.durationMinutes} min</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="speedometer-outline" size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>{flow.intensity}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="barbell-outline" size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>{flow.drills.length} drill{flow.drills.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>

      {flow.badges.length > 0 && (
        <View style={styles.badgeRow}>
          {flow.badges.map((b) => (
            <View key={b} style={[styles.badge, { backgroundColor: accent + '12', borderColor: accent + '25' }]}>
              <Text style={[styles.badgeText, { color: accent }]}>{b}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
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
  countBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  countText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  content: { padding: 16, paddingBottom: 60, gap: 10 },
  desc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4 },

  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderRadius: radius.lg,
    padding: 14, gap: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  cardSub: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 2 },
  cardMeta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 40, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  emptySub: { fontSize: 13, color: colors.textSecondary },
});

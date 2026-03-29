/**
 * Performance Services — Structured training programs athletes can enroll in.
 *
 * Replaces the old Add-Ons and Programs sections with a unified listing.
 * Each service card links to its detail/purchase page.
 */

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#E10600';

interface ServiceProgram {
  key: string;
  name: string;
  goal: string;
  length: string;
  bestFor: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  price: string;
  route: string;
  badge?: string;
}

const PROGRAMS: ServiceProgram[] = [
  {
    key: 'exit-velo',
    name: 'Bat Speed Program',
    goal: 'Increase bat speed and exit velocity through overload/underload training, rotational power, and sprint work.',
    length: '12 weeks',
    bestFor: 'Hitters who want to swing faster and hit the ball harder.',
    icon: 'speedometer-outline',
    color: '#E10600',
    price: '$97',
    route: '/(app)/training/add-ons/exit-velo',
    badge: 'FEATURED',
  },
  {
    key: 'speed',
    name: 'Speed Program',
    goal: 'Improve sprint times, acceleration, max velocity, and baseball-specific movement speed.',
    length: '12 weeks',
    bestFor: 'Athletes who want to run faster 60s, steal more bases, and cover more ground.',
    icon: 'flash-outline',
    color: '#22c55e',
    price: '$25–$35',
    route: '/(app)/training/add-ons/speed',
  },
  {
    key: 'rotational-power',
    name: 'Rotational Power Program',
    goal: 'Build rotational explosiveness for hitting and throwing through med ball work and core training.',
    length: '8–10 weeks',
    bestFor: 'Athletes who need more rotational power and hip-to-shoulder separation.',
    icon: 'sync-outline',
    color: '#f59e0b',
    price: 'Coming Soon',
    route: '/(app)/training/placeholder?section=rotational-power',
  },
  {
    key: 'throwing-velo',
    name: 'Throwing Velocity Program',
    goal: 'Increase throwing velocity through arm care, long toss progressions, and rotational training.',
    length: '10–12 weeks',
    bestFor: 'Pitchers and position players who want to throw harder.',
    icon: 'baseball-outline',
    color: '#3b82f6',
    price: 'Coming Soon',
    route: '/(app)/training/placeholder?section=throwing-velo',
  },
  {
    key: 'game-confidence',
    name: 'Game Confidence & Routine Program',
    goal: 'Build pre-game routines, in-game mental resets, and competitive confidence systems.',
    length: '6 weeks',
    bestFor: 'Athletes who perform well in practice but struggle in games.',
    icon: 'shield-checkmark-outline',
    color: '#8b5cf6',
    price: 'Coming Soon',
    route: '/(app)/training/placeholder?section=game-confidence',
  },
  {
    key: 'functional-movement',
    name: 'Functional Movement Program',
    goal: 'Improve mobility, stability, and movement quality for injury prevention and better performance.',
    length: '8 weeks',
    bestFor: 'Athletes with movement restrictions, stiffness, or injury history.',
    icon: 'body-outline',
    color: '#0891b2',
    price: 'Coming Soon',
    route: '/(app)/training/placeholder?section=functional-movement',
  },
];

export default function PerformanceServicesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>OTC ATHLETICS</Text>
          <Text style={styles.headerTitle}>Performance Services</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Structured training programs designed for specific outcomes. Each program is a standalone system you can add to your training.
        </Text>

        {PROGRAMS.map((program) => {
          const isComingSoon = program.price === 'Coming Soon';
          return (
            <TouchableOpacity
              key={program.key}
              style={[styles.card, { borderColor: program.color + '25' }]}
              onPress={() => router.push(program.route as any)}
              activeOpacity={0.85}
            >
              {program.badge && (
                <View style={[styles.badge, { backgroundColor: program.color + '15' }]}>
                  <Text style={[styles.badgeText, { color: program.color }]}>{program.badge}</Text>
                </View>
              )}

              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: program.color + '12' }]}>
                  <Ionicons name={program.icon} size={24} color={program.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{program.name}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaChip}>
                      <Ionicons name="calendar-outline" size={10} color={colors.textMuted} />
                      <Text style={styles.metaText}>{program.length}</Text>
                    </View>
                    <View style={[
                      styles.metaChip,
                      isComingSoon
                        ? { backgroundColor: colors.surface }
                        : { backgroundColor: program.color + '12', borderColor: program.color + '25' },
                    ]}>
                      <Text style={[
                        styles.metaText,
                        !isComingSoon && { color: program.color, fontWeight: '900' },
                      ]}>
                        {program.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.cardGoal}>{program.goal}</Text>
              <Text style={styles.cardBestFor}>Best for: {program.bestFor}</Text>

              <View style={[styles.cardCta, { backgroundColor: isComingSoon ? colors.surface : program.color }]}>
                <Text style={[styles.cardCtaText, isComingSoon && { color: colors.textMuted }]}>
                  {isComingSoon ? 'Coming Soon' : 'View Program'}
                </Text>
                {!isComingSoon && <Ionicons name="arrow-forward" size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  card: {
    backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
  },
  badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },

  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  cardName: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  metaText: { fontSize: 10, fontWeight: '700', color: colors.textMuted },

  cardGoal: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  cardBestFor: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },

  cardCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: radius.md, marginTop: 2,
  },
  cardCtaText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});

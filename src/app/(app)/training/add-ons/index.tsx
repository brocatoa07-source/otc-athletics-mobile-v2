/**
 * Add-Ons Hub — Browse purchasable training programs.
 */

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { EV_PROGRAM_META } from '@/data/exit-velo-program/product';

const ACCENT = '#E10600';

export default function AddOnsHub() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>OTC ATHLETICS</Text>
          <Text style={styles.headerTitle}>Add-On Programs</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Specialized training programs you can add to your account. Each program is a standalone system designed for a specific outcome.
        </Text>

        {/* Exit Velocity Program Card */}
        <TouchableOpacity
          style={styles.productCard}
          onPress={() => router.push('/(app)/training/add-ons/exit-velo' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.productBadge}>
            <Text style={styles.productBadgeText}>FEATURED</Text>
          </View>

          <View style={styles.productIcon}>
            <Ionicons name="speedometer" size={32} color={ACCENT} />
          </View>

          <Text style={styles.productName}>{EV_PROGRAM_META.name}</Text>
          <Text style={styles.productTagline}>{EV_PROGRAM_META.tagline}</Text>

          <View style={styles.productMeta}>
            <View style={styles.metaChip}>
              <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>{EV_PROGRAM_META.durationWeeks} weeks</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="barbell-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>{EV_PROGRAM_META.daysPerWeek}x/week</Text>
            </View>
            <View style={[styles.metaChip, { backgroundColor: ACCENT + '15', borderColor: ACCENT + '30' }]}>
              <Text style={[styles.metaText, { color: ACCENT, fontWeight: '900' }]}>{EV_PROGRAM_META.price}</Text>
            </View>
          </View>

          <View style={styles.productCta}>
            <Text style={styles.productCtaText}>View Program</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Speed Development Program Card */}
        <TouchableOpacity
          style={[styles.productCard, { borderColor: '#22c55e30' }]}
          onPress={() => router.push('/(app)/training/add-ons/speed' as any)}
          activeOpacity={0.85}
        >
          <View style={[styles.productBadge, { backgroundColor: '#22c55e15' }]}>
            <Text style={[styles.productBadgeText, { color: '#22c55e' }]}>NEW</Text>
          </View>

          <View style={[styles.productIcon, { backgroundColor: '#22c55e10' }]}>
            <Ionicons name="flash" size={32} color="#22c55e" />
          </View>

          <Text style={styles.productName}>12-Week Speed Program</Text>
          <Text style={styles.productTagline}>
            Sprint faster. Improve your 60. Build real baseball speed.
          </Text>

          <View style={styles.productMeta}>
            <View style={styles.metaChip}>
              <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>12 weeks</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="flash-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>3x/week</Text>
            </View>
            <View style={[styles.metaChip, { backgroundColor: '#22c55e15', borderColor: '#22c55e30' }]}>
              <Text style={[styles.metaText, { color: '#22c55e', fontWeight: '900' }]}>$25–$35</Text>
            </View>
          </View>

          <View style={[styles.productCta, { backgroundColor: '#22c55e' }]}>
            <Text style={styles.productCtaText}>View Speed Programs</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* More Coming Soon */}
        <View style={styles.comingSoon}>
          <Ionicons name="construct-outline" size={20} color={colors.textMuted} />
          <Text style={styles.comingSoonText}>More add-on programs coming soon</Text>
        </View>
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
  content: { padding: 16, paddingBottom: 60, gap: 16 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  productCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 20, gap: 12, alignItems: 'center',
  },
  productBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
    backgroundColor: ACCENT + '15',
  },
  productBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: ACCENT },
  productIcon: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: ACCENT + '10',
    alignItems: 'center', justifyContent: 'center',
  },
  productName: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  productTagline: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  productMeta: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
  },
  metaText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  productCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', paddingVertical: 14, borderRadius: radius.md,
    backgroundColor: ACCENT, marginTop: 4,
  },
  productCtaText: { fontSize: 15, fontWeight: '900', color: '#fff' },

  comingSoon: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 20,
  },
  comingSoonText: { fontSize: 13, color: colors.textMuted },
});

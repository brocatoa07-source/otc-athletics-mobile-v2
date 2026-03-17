import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { FUEL_FOUNDATIONS, FUEL_REAL_WORLD, type FuelSection } from '@/data/fuel-the-engine';

const ACCENT = '#10b981';

function SectionRow({ section }: { section: FuelSection }) {
  return (
    <TouchableOpacity
      style={styles.sectionCard}
      onPress={() => router.push(`/(app)/training/sc/fuel-section?section=${section.key}` as any)}
      activeOpacity={0.8}
    >
      <View style={[styles.sectionIcon, { backgroundColor: section.color + '15' }]}>
        <Ionicons name={section.icon} size={22} color={section.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionLabel}>{section.label}</Text>
        <Text style={styles.sectionSub}>{section.sub}</Text>
      </View>
      <Text style={styles.cardCount}>{section.cards.length}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function FuelTheEngineHub() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={[styles.headerIcon, { backgroundColor: ACCENT + '18' }]}>
          <Ionicons name="flame-outline" size={18} color={ACCENT} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>STRENGTH VAULT</Text>
          <Text style={styles.headerTitle}>Fuel The Engine</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <Text style={styles.subtitle}>Performance Nutrition for Athletes</Text>

        {/* Intro */}
        <Text style={styles.intro}>
          Fueling is not about eating perfectly. It's about giving your body what it needs to train hard, recover fast, and perform when it matters.
        </Text>

        {/* Group A — Foundations */}
        <Text style={styles.groupTitle}>Foundations</Text>
        {FUEL_FOUNDATIONS.map((section) => (
          <SectionRow key={section.key} section={section} />
        ))}

        {/* Group B — Real-World Fueling */}
        <Text style={[styles.groupTitle, { marginTop: 8 }]}>Real-World Fueling</Text>
        {FUEL_REAL_WORLD.map((section) => (
          <SectionRow key={section.key} section={section} />
        ))}

        {/* Footer note */}
        <Text style={styles.footer}>
          This module is educational and performance-focused. It is not a tracker, calculator, or meal logger.
        </Text>
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
  headerIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 10 },
  subtitle: {
    fontSize: 14, fontWeight: '800', color: ACCENT,
    letterSpacing: 0.5, marginBottom: -2,
  },
  intro: {
    fontSize: 14, color: colors.textSecondary, lineHeight: 21, marginBottom: 4,
  },
  groupTitle: {
    fontSize: 11, fontWeight: '900', letterSpacing: 1.2,
    color: colors.textMuted, textTransform: 'uppercase',
    marginTop: 4, marginBottom: 2,
  },
  sectionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16,
  },
  sectionIcon: {
    width: 46, height: 46, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionLabel: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  sectionSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardCount: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  footer: {
    fontSize: 11, color: colors.textMuted, textAlign: 'center',
    lineHeight: 16, marginTop: 8, paddingHorizontal: 16,
  },
});

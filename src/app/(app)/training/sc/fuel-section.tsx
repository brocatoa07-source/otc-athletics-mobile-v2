import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { getFuelSection, type FuelSectionKey } from '@/data/fuel-the-engine';
import { FuelCard } from '@/components/training/FuelCard';

export default function FuelSectionScreen() {
  const { section: sectionKey } = useLocalSearchParams<{ section: string }>();
  const section = getFuelSection((sectionKey ?? 'daily') as FuelSectionKey);

  if (!section) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Not Found</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.textMuted} />
          <Text style={styles.emptyText}>Section not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={[styles.headerIcon, { backgroundColor: section.color + '18' }]}>
          <Ionicons name={section.icon} size={18} color={section.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{section.label}</Text>
          <Text style={styles.headerSub}>{section.cards.length} cards</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <Text style={styles.intro}>{section.intro}</Text>

        {/* Cards */}
        {section.cards.map((card) => (
          <FuelCard key={card.title} card={card} accent={section.color} />
        ))}
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  headerSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  intro: {
    fontSize: 14, color: colors.textSecondary, lineHeight: 21,
  },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 14, color: colors.textSecondary },
});

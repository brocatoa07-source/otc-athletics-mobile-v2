import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const SECTION_META: Record<string, { title: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  'add-ons': { title: 'Add-Ons', icon: 'add-circle-outline', color: '#E10600' },
  'recruiting': { title: 'College Recruiting', icon: 'school-outline', color: '#8b5cf6' },
  'programs': { title: 'Programs', icon: 'clipboard-outline', color: '#3b82f6' },
};

export default function PlaceholderScreen() {
  const { section = '' } = useLocalSearchParams<{ section?: string }>();
  const meta = SECTION_META[section] ?? { title: section || 'Coming Soon', icon: 'time-outline' as const, color: colors.textMuted };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{meta.title}</Text>
      </View>

      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: meta.color + '15' }]}>
          <Ionicons name={meta.icon} size={44} color={meta.color} />
        </View>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.desc}>
          This feature is currently in development.
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: meta.color + '40' }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-outline" size={16} color={meta.color} />
          <Text style={[styles.backButtonText, { color: meta.color }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  body: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 12,
  },
  iconWrap: {
    width: 88, height: 88, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },
  desc: {
    fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20,
  },
  backButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: radius.md,
    paddingHorizontal: 16, paddingVertical: 10, marginTop: 8,
  },
  backButtonText: { fontSize: 14, fontWeight: '700' },
});

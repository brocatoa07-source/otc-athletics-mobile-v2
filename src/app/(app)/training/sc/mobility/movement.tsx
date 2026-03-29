/**
 * Movement Detail — Individual drill detail view.
 *
 * Shows full movement info: name, body region, coaching cue,
 * dosage, athlete instruction, equipment, and "used in" flows.
 */

import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { getDrill } from '@/data/mobility-vault/drills';
import {
  getPrimaryCategory,
  getUsedInFlows,
  formatDosage,
  DRILL_TYPE_LABELS,
  BODY_REGION_LABELS,
} from '@/data/mobility-vault/library';
import type { BodyRegionTag } from '@/data/mobility-vault/types';

const ACCENT = '#0891b2';

const CATEGORY_COLORS: Record<string, string> = {
  mobility: '#3b82f6',
  movement_prep: '#22c55e',
  yoga_flow: '#8b5cf6',
};

export default function MovementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const drill = id ? getDrill(id) : undefined;

  if (!drill) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Movement Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const cat = getPrimaryCategory(drill);
  const usedIn = getUsedInFlows(drill.id);
  const typeLabel = DRILL_TYPE_LABELS[drill.drillType] ?? drill.drillType;
  const dosage = formatDosage(drill);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MOVEMENT LIBRARY</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{drill.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: cat.color + '15' }]}>
            <Ionicons name={cat.icon as any} size={32} color={cat.color} />
          </View>
          <Text style={styles.heroTitle}>{drill.title}</Text>
          <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: cat.color + '15', borderColor: cat.color + '30' }]}>
              <Text style={[styles.tagText, { color: cat.color }]}>{cat.label}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{typeLabel}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{drill.difficulty}</Text>
            </View>
          </View>
        </View>

        {/* What It Helps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="body-outline" size={16} color={ACCENT} />
            <Text style={[styles.sectionLabel, { color: ACCENT }]}>WHAT IT HELPS</Text>
          </View>
          <View style={styles.regionRow}>
            {drill.bodyRegionTags.map((tag) => (
              <View key={tag} style={styles.regionChip}>
                <View style={[styles.regionDot, { backgroundColor: cat.color }]} />
                <Text style={styles.regionText}>{BODY_REGION_LABELS[tag as BodyRegionTag] ?? tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Coaching Cue */}
        <View style={styles.cueCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mic-outline" size={16} color="#f59e0b" />
            <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>COACHING CUE</Text>
          </View>
          <Text style={styles.cueText}>{drill.coachingCue}</Text>
        </View>

        {/* How To Do It */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="clipboard-outline" size={16} color={ACCENT} />
            <Text style={[styles.sectionLabel, { color: ACCENT }]}>HOW TO DO IT</Text>
          </View>
          <Text style={styles.bodyText}>{drill.athleteInstruction}</Text>
        </View>

        {/* Dosage */}
        <View style={styles.dosageCard}>
          <View style={styles.dosageItem}>
            <Ionicons name="repeat-outline" size={16} color={ACCENT} />
            <Text style={styles.dosageLabel}>Dosage</Text>
            <Text style={styles.dosageValue}>{dosage}</Text>
          </View>
          <View style={styles.dosageDivider} />
          <View style={styles.dosageItem}>
            <Ionicons name="timer-outline" size={16} color={ACCENT} />
            <Text style={styles.dosageLabel}>Hold</Text>
            <Text style={styles.dosageValue}>
              {drill.holdType.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Text>
          </View>
          {drill.equipmentNeeded.length > 0 && (
            <>
              <View style={styles.dosageDivider} />
              <View style={styles.dosageItem}>
                <Ionicons name="construct-outline" size={16} color={ACCENT} />
                <Text style={styles.dosageLabel}>Equipment</Text>
                <Text style={styles.dosageValue}>{drill.equipmentNeeded.join(', ')}</Text>
              </View>
            </>
          )}
        </View>

        {/* Coach Note */}
        {drill.coachNote && (
          <View style={styles.coachNote}>
            <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
            <Text style={styles.coachNoteText}>{drill.coachNote}</Text>
          </View>
        )}

        {/* Used In Flows */}
        {usedIn.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="layers-outline" size={16} color={ACCENT} />
              <Text style={[styles.sectionLabel, { color: ACCENT }]}>USED IN FLOWS</Text>
            </View>
            {usedIn.map((flow) => (
              <TouchableOpacity
                key={flow.flowId}
                style={styles.flowRow}
                onPress={() => router.push(`/(app)/training/sc/mobility/${flow.flowSlug}` as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.flowDot, { backgroundColor: CATEGORY_COLORS[flow.category] ?? ACCENT }]} />
                <Text style={styles.flowName}>{flow.flowShortTitle}</Text>
                <Text style={styles.flowCat}>
                  {flow.category === 'mobility' ? 'Mobility' : flow.category === 'movement_prep' ? 'Prep' : 'Recovery'}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 16, paddingBottom: 60, gap: 14 },

  hero: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  heroIcon: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  tag: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  tagText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, textTransform: 'capitalize' },

  section: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 10,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },

  regionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  regionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    backgroundColor: colors.bg,
  },
  regionDot: { width: 6, height: 6, borderRadius: 3 },
  regionText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },

  cueCard: {
    backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  cueText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, fontStyle: 'italic', lineHeight: 22 },

  bodyText: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },

  dosageCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 10,
  },
  dosageItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dosageLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted, width: 70 },
  dosageValue: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  dosageDivider: { height: 1, backgroundColor: colors.border },

  coachNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.md,
  },
  coachNoteText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },

  flowRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border,
  },
  flowDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  flowName: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  flowCat: { fontSize: 11, color: colors.textMuted },
});

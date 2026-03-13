import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { MENTAL_VAULT_SECTIONS, type MentalToolCard } from '@/data/mental-vault-sections';

export default function MentalSectionScreen() {
  const { section: sectionKey } = useLocalSearchParams<{ section: string }>();
  const { hasLimitedMental, hasFullMental, isCoach } = useTier();
  const [expanded, setExpanded] = useState<number | null>(null);

  const section = MENTAL_VAULT_SECTIONS.find((s) => s.key === sectionKey);
  if (!section) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Section Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canAccessAll = hasFullMental || isCoach;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: section.color }]}>
            {section.label.toUpperCase()}
          </Text>
          <Text style={styles.headerTitle}>{section.label}</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: section.color + '20' }]}>
          <Text style={[styles.countText, { color: section.color }]}>
            {section.tools.length}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={[styles.descCard, { borderLeftColor: section.color }]}>
          <Text style={styles.descText}>{section.description}</Text>
        </View>

        {/* Limited access note */}
        {hasLimitedMental && (
          <TouchableOpacity
            style={[styles.freeNote, { borderColor: section.color + '30' }]}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="information-circle-outline" size={16} color={section.color} />
            <Text style={styles.freeNoteText}>
              {section.freeCount} starter tools free — upgrade to Double for all {section.tools.length}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Tool Cards */}
        {section.tools.map((tool: MentalToolCard, idx: number) => {
          const isLocked = hasLimitedMental && !canAccessAll && idx >= section.freeCount;
          const isExpanded = expanded === idx;

          return (
            <TouchableOpacity
              key={tool.name}
              style={[styles.toolCard, isLocked && { opacity: 0.5 }]}
              onPress={() => {
                if (isLocked) {
                  router.push('/(app)/upgrade' as any);
                } else {
                  setExpanded(isExpanded ? null : idx);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.toolHeader}>
                <View style={[styles.toolDot, { backgroundColor: section.color }]} />
                <Text style={styles.toolName}>{tool.name}</Text>
                {isLocked ? (
                  <View style={styles.lockRow}>
                    <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
                    <Text style={styles.upgradePill}>UPGRADE</Text>
                  </View>
                ) : (
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.textMuted}
                  />
                )}
              </View>

              {isExpanded && !isLocked && (
                <View style={styles.toolDetail}>
                  <Text style={styles.detailLabel}>FIXES</Text>
                  <Text style={styles.detailText}>{tool.fixes}</Text>

                  <Text style={styles.detailLabel}>HOW TO DO IT</Text>
                  <Text style={styles.detailText}>{tool.howTo}</Text>

                  <View style={[styles.focusBadge, { backgroundColor: section.color + '15' }]}>
                    <Ionicons name="bulb-outline" size={14} color={section.color} />
                    <Text style={[styles.focusText, { color: section.color }]}>
                      {tool.focus}
                    </Text>
                  </View>
                </View>
              )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: { fontSize: 13, fontWeight: '900' },

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  descCard: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderRadius: radius.md,
    padding: 14,
  },
  descText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  freeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
  },
  freeNoteText: { flex: 1, fontSize: 12, color: colors.textSecondary },

  toolCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toolDot: { width: 8, height: 8, borderRadius: 4 },
  toolName: { flex: 1, fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  upgradePill: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 0.8,
    backgroundColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },

  toolDetail: { marginTop: 14, gap: 8 },
  detailLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.textMuted,
    marginTop: 4,
  },
  detailText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  focusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.md,
    padding: 10,
    marginTop: 4,
  },
  focusText: { flex: 1, fontSize: 13, fontWeight: '700', fontStyle: 'italic' },
});

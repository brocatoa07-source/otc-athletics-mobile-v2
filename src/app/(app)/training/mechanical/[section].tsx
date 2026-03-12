import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useGating } from '@/hooks/useGating';
import { HITTING_VAULT_SECTIONS } from '@/data/hitting-vault-sections';

export default function SectionScreen() {
  const { section: sectionKey } = useLocalSearchParams<{ section: string }>();
  const { hasLimitedHitting } = useTier();
  const { gate } = useGating();
  const [expandedDrill, setExpandedDrill] = useState<string | null>(null);

  const section = HITTING_VAULT_SECTIONS.find((s) => s.key === sectionKey);

  if (!section) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Section not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isPlaceholder = section.isPlaceholder;
  const hasDiagnostic = gate.hitting.mechanicalDone;
  const drills = section.drills;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: section.color }]}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>{section.label}</Text>
        </View>
        {drills.length > 0 && (
          <View style={[styles.countBadge, { backgroundColor: section.color + '20' }]}>
            <Text style={[styles.countText, { color: section.color }]}>
              {drills.length}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Section description */}
        <Text style={[styles.sectionDesc, { borderLeftColor: section.color + '50' }]}>
          {section.description}
        </Text>

        {/* Troubleshooting placeholder */}
        {isPlaceholder && (
          <TouchableOpacity
            style={[styles.placeholderCard, { borderColor: section.color + '40' }]}
            onPress={() => {
              if (!hasDiagnostic) {
                router.push('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any);
              }
            }}
            activeOpacity={hasDiagnostic ? 1 : 0.8}
          >
            <Ionicons
              name={hasDiagnostic ? 'checkmark-circle' : 'clipboard-outline'}
              size={24}
              color={section.color}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.placeholderTitle}>
                {hasDiagnostic
                  ? 'Diagnostic Complete'
                  : 'Take the Swing Diagnostic'}
              </Text>
              <Text style={styles.placeholderSub}>
                {hasDiagnostic
                  ? 'Recommended fixes based on your results are coming soon.'
                  : '10 questions to identify your primary mechanical issues and unlock personalized drill recommendations.'}
              </Text>
            </View>
            {!hasDiagnostic && (
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        )}

        {/* Walk tier upgrade CTA */}
        {hasLimitedHitting && !isPlaceholder && (
          <TouchableOpacity
            style={styles.freeNote}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={14} color={section.color} />
            <Text style={styles.freeNoteText}>
              {section.freeCount} starter drill{section.freeCount !== 1 ? 's' : ''} free — upgrade to Single for all {drills.length}
            </Text>
            <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Drill Cards */}
        {drills.map((drill, idx) => {
          const isLocked = hasLimitedHitting && idx >= section.freeCount;
          const isExpanded = expandedDrill === drill.name;

          return (
            <TouchableOpacity
              key={drill.name}
              style={[
                styles.drillCard,
                isExpanded && styles.drillCardExpanded,
                isLocked && styles.drillCardLocked,
              ]}
              onPress={() => {
                if (isLocked) {
                  router.push('/(app)/upgrade' as any);
                  return;
                }
                setExpandedDrill(isExpanded ? null : drill.name);
              }}
              activeOpacity={0.8}
            >
              {/* Collapsed — drill name */}
              <View style={styles.drillHeader}>
                {isLocked ? (
                  <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
                ) : (
                  <View style={[styles.drillDot, { backgroundColor: section.color }]} />
                )}
                <Text
                  style={[styles.drillName, isLocked && styles.drillNameLocked]}
                  numberOfLines={1}
                >
                  {drill.name}
                </Text>
                {isLocked ? (
                  <Text style={styles.upgradePill}>UPGRADE</Text>
                ) : (
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.textMuted}
                  />
                )}
              </View>

              {/* Expanded — full drill card */}
              {isExpanded && !isLocked && (
                <View style={styles.drillBody}>
                  {/* Fixes */}
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: section.color }]}>FIXES</Text>
                    <Text style={styles.fieldText}>{drill.fixes}</Text>
                  </View>

                  {/* How To Do It */}
                  <View style={styles.fieldRow}>
                    <Text style={[styles.fieldLabel, { color: section.color }]}>HOW TO DO IT</Text>
                    <Text style={styles.fieldText}>{drill.howTo}</Text>
                  </View>

                  {/* Focus */}
                  <View style={[styles.focusBadge, { borderColor: section.color + '40' }]}>
                    <Text style={[styles.focusLabel, { color: section.color }]}>FOCUS</Text>
                    <Text style={styles.focusText}>{drill.focus}</Text>
                  </View>

                  {/* Watch Demo placeholder */}
                  <View style={styles.demoRow}>
                    <Ionicons name="play-circle-outline" size={18} color={colors.textMuted} />
                    <Text style={styles.demoText}>Watch Demo — coming soon</Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  backLink: { fontSize: 14, fontWeight: '700', color: '#E10600' },

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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: { fontSize: 13, fontWeight: '900' },

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  sectionDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 4,
  },

  placeholderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 16,
  },
  placeholderTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  placeholderSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },

  freeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  freeNoteText: { flex: 1, fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  drillCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
  },
  drillCardExpanded: { borderColor: colors.borderStrong },
  drillCardLocked: { opacity: 0.5 },

  drillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  drillDot: { width: 6, height: 6, borderRadius: 3 },
  drillName: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  drillNameLocked: { color: colors.textMuted },
  upgradePill: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E10600',
    letterSpacing: 0.8,
    borderWidth: 1,
    borderColor: '#E1060040',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  drillBody: { gap: 12, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },

  fieldRow: { gap: 4 },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  fieldText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  focusBadge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 10,
    backgroundColor: colors.bg,
    gap: 4,
  },
  focusLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  focusText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  demoText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
});

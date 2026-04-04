import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { TOOLS } from '@/data/mental-tools';

const ACCENT = '#8b5cf6';

export default function ToolboxScreen() {
  const { hasFullMental, isCoach } = useTier();
  const canAccess = hasFullMental || isCoach;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL VAULT</Text>
          <Text style={styles.headerTitle}>Mental Toolbox</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {TOOLS.reduce((sum, t) => sum + t.items.length, 0)} tools
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Practical mental tools organized by category. Tap a category to explore all tools within it.
        </Text>

        {TOOLS.map((category, catIdx) => {
          const isExpanded = expandedIdx === catIdx;
          const locked = !canAccess && catIdx >= 2;

          return (
            <View key={catIdx}>
              <TouchableOpacity
                style={[styles.categoryCard, locked && styles.cardLocked]}
                onPress={() => {
                  if (locked) return;
                  // Categories with a dedicated screen route there directly
                  if (category.route) {
                    router.push(category.route as any);
                    return;
                  }
                  setExpandedIdx(isExpanded ? null : catIdx);
                }}
                activeOpacity={locked ? 1 : 0.8}
              >
                <View style={[styles.catIcon, { backgroundColor: category.color + '18' }]}>
                  <Ionicons
                    name={locked ? 'lock-closed-outline' : category.icon}
                    size={22}
                    color={locked ? colors.textMuted : category.color}
                  />
                </View>
                <View style={styles.catBody}>
                  <Text style={[styles.catTitle, locked && { color: colors.textMuted }]}>
                    {category.title}
                  </Text>
                  <Text style={styles.catDesc} numberOfLines={isExpanded ? undefined : 1}>
                    {category.desc}
                  </Text>
                  <Text style={[styles.catCount, { color: category.color }]}>
                    {category.items.length} {category.route ? 'sessions' : 'tools'}
                  </Text>
                </View>
                {!locked && (
                  <Ionicons
                    name={category.route ? 'chevron-forward' : isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                  />
                )}
              </TouchableOpacity>

              {isExpanded && !locked && !category.route && (
                <View style={styles.toolsList}>
                  {/* Structured tools — tappable with detail screen */}
                  {category.structuredItems ? (
                    category.structuredItems.map((tool) => (
                      <TouchableOpacity
                        key={tool.id}
                        style={styles.structuredToolItem}
                        onPress={() => router.push(`/(app)/training/mental/tool-detail?catIdx=${catIdx}&toolId=${tool.id}` as any)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.toolDot, { backgroundColor: category.color }]} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.structuredToolName}>{tool.name}</Text>
                          <Text style={styles.structuredToolTagline}>{tool.tagline}</Text>
                        </View>
                        <View style={styles.quickBadgeWrap}>
                          {tool.quickTool && (
                            <View style={[styles.quickBadge, { backgroundColor: category.color + '15' }]}>
                              <Text style={[styles.quickBadgeText, { color: category.color }]}>QUICK</Text>
                            </View>
                          )}
                          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    /* Legacy string items — no detail screen */
                    category.items.map((item, itemIdx) => (
                      <View key={itemIdx} style={styles.toolItem}>
                        <View style={[styles.toolDot, { backgroundColor: category.color }]} />
                        <Text style={styles.toolText}>{item}</Text>
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          );
        })}

        {!canAccess && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={16} color={ACCENT} />
            <Text style={styles.upgradeBannerText}>
              Upgrade to Double to unlock all {TOOLS.length} tool categories
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
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
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  countBadge: {
    backgroundColor: ACCENT + '15', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  countText: { fontSize: 11, fontWeight: '800', color: ACCENT },

  content: { padding: 16, paddingBottom: 60, gap: 10 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4 },

  categoryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  cardLocked: { opacity: 0.5 },
  catIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  catBody: { flex: 1, gap: 3 },
  catTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  catDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  catCount: { fontSize: 11, fontWeight: '700', marginTop: 2 },

  toolsList: {
    marginLeft: 30, paddingLeft: 14, borderLeftWidth: 2, borderLeftColor: colors.border,
    gap: 8, paddingVertical: 8, marginBottom: 4,
  },
  toolItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  toolDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  toolText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '30',
    borderRadius: radius.lg, padding: 14, marginTop: 4,
  },
  upgradeBannerText: { flex: 1, fontSize: 13, fontWeight: '700', color: ACCENT },

  /* Structured tool items */
  structuredToolItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 4,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  structuredToolName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  structuredToolTagline: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  quickBadgeWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  quickBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
  quickBadgeText: { fontSize: 7, fontWeight: '900', letterSpacing: 0.8 },
});

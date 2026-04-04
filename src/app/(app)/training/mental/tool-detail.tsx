/**
 * Mental Tool Detail Screen — Renders a structured tool as a readable playbook page.
 *
 * Route: /(app)/training/mental/tool-detail?catIdx=0&toolId=478-breathing
 */

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { TOOLS, type StructuredTool } from '@/data/mental-tools';

const ACCENT = '#8b5cf6';

export default function ToolDetailScreen() {
  const { catIdx: catIdxStr, toolId } = useLocalSearchParams<{ catIdx?: string; toolId?: string }>();
  const catIdx = catIdxStr ? parseInt(catIdxStr, 10) : -1;

  const category = TOOLS[catIdx];
  const tool = category?.structuredItems?.find(t => t.id === toolId);

  if (!tool || !category) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Tool not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: ACCENT, fontWeight: '700' }}>Go back</Text>
          </TouchableOpacity>
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
          <Text style={[styles.categoryLabel, { color: category.color }]}>{category.title.toUpperCase()}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{tool.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Tagline */}
        <Text style={styles.tagline}>{tool.tagline}</Text>

        {/* What It Is */}
        <Section title="What It Is" color={category.color}>
          <Text style={styles.body}>{tool.whatIs}</Text>
        </Section>

        {/* Why It Works */}
        <Section title="Why It Works" color="#f59e0b">
          <Text style={styles.body}>{tool.whyItWorks}</Text>
        </Section>

        {/* How To Use It */}
        <Section title="How To Use It" color="#22c55e">
          {tool.howToUse.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: '#22c55e15' }]}>
                <Text style={[styles.stepNumText, { color: '#22c55e' }]}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Section>

        {/* Best Time To Use It */}
        <Section title="Best Time To Use It" color="#3b82f6">
          <Text style={styles.body}>{tool.bestTime}</Text>
        </Section>

        {/* Cue */}
        {tool.cue && (
          <View style={[styles.cueCard, { borderColor: category.color + '30' }]}>
            <Ionicons name="mic-outline" size={16} color={category.color} />
            <Text style={[styles.cueText, { color: category.color }]}>"{tool.cue}"</Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metaCard}>
          <MetaRow label="Difficulty" value={tool.difficulty} />
          <MetaRow label="Time" value={tool.timeRequired} />
          <MetaRow label="Type" value={tool.toolType} />
          <MetaRow label="Quick Tool" value={tool.quickTool ? 'Yes' : 'No'} />
          <View style={styles.tagsRow}>
            {tool.bestUsed.map(tag => (
              <View key={tag} style={[styles.tag, { borderColor: category.color + '30' }]}>
                <Text style={[styles.tagText, { color: category.color }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      {children}
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  errorText: { fontSize: 14, color: colors.textMuted },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  categoryLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 20, paddingBottom: 60, gap: 20 },

  tagline: {
    fontSize: 16, fontWeight: '600', color: colors.textSecondary,
    fontStyle: 'italic', lineHeight: 22,
  },

  section: { gap: 8 },
  sectionTitle: {
    fontSize: 11, fontWeight: '900', letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  stepNumText: { fontSize: 12, fontWeight: '900' },
  stepText: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 22 },

  cueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderWidth: 1, borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  cueText: { flex: 1, fontSize: 15, fontWeight: '700', fontStyle: 'italic' },

  metaCard: {
    padding: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, gap: 8,
  },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { fontSize: 12, color: colors.textMuted },
  metaValue: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tag: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderRadius: radius.sm, backgroundColor: colors.bg,
  },
  tagText: { fontSize: 9, fontWeight: '700' },
});

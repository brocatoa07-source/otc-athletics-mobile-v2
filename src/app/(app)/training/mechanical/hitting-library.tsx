import { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { HITTING_VAULT_SECTIONS, type DrillCard } from '@/data/hitting-vault-sections';

const ACCENT = '#E10600';

interface LibraryDrill extends DrillCard {
  sectionKey: string;
  sectionLabel: string;
  sectionColor: string;
}

const ALL_DRILLS: LibraryDrill[] = HITTING_VAULT_SECTIONS.filter((s) => !s.isPlaceholder).flatMap((s) =>
  s.drills.map((d) => ({
    ...d,
    sectionKey: s.key,
    sectionLabel: s.label,
    sectionColor: s.color,
  })),
);

const SECTION_FILTERS = [
  { key: 'all', label: 'All' },
  ...HITTING_VAULT_SECTIONS.filter((s) => !s.isPlaceholder).map((s) => ({
    key: s.key,
    label: s.label,
  })),
];

export default function HittingLibraryScreen() {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('all');

  const filtered = useMemo(() => {
    let items = ALL_DRILLS;
    if (activeSection !== 'all') {
      items = items.filter((d) => d.sectionKey === activeSection);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.fixes.toLowerCase().includes(q) ||
          d.focus.toLowerCase().includes(q),
      );
    }
    return items;
  }, [search, activeSection]);

  const grouped = useMemo(() => {
    const map: Record<string, LibraryDrill[]> = {};
    for (const d of filtered) {
      if (!map[d.sectionLabel]) map[d.sectionLabel] = [];
      map[d.sectionLabel].push(d);
    }
    return Object.entries(map);
  }, [filtered]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={[styles.headerIcon, { backgroundColor: ACCENT + '18' }]}>
          <Ionicons name="library-outline" size={18} color={ACCENT} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Hitting Library</Text>
          <Text style={styles.headerSub}>{filtered.length} drills</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search all drills..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Section Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {SECTION_FILTERS.map((f) => {
          const active = activeSection === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterPill, active && { backgroundColor: ACCENT, borderColor: ACCENT }]}
              onPress={() => setActiveSection(f.key === activeSection ? 'all' : f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, active && { color: '#fff' }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Drill List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {grouped.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySub}>
              {search ? `No drills match "${search}"` : 'No drills in this category'}
            </Text>
          </View>
        ) : (
          grouped.map(([sectionLabel, drills]) => (
            <View key={sectionLabel} style={styles.group}>
              <Text style={styles.groupLabel}>{sectionLabel}</Text>
              {drills.map((d) => (
                <TouchableOpacity
                  key={`${d.sectionKey}-${d.name}`}
                  style={styles.drillCard}
                  onPress={() => router.push(`/(app)/training/mechanical/${d.sectionKey}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.drillDot, { backgroundColor: d.sectionColor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.drillName}>{d.name}</Text>
                    <Text style={styles.drillFixes} numberOfLines={1}>{d.fixes}</Text>
                    <Text style={styles.drillFocus} numberOfLines={1}>{d.focus}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          ))
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
  headerIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  headerSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },

  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0 },

  filterRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  filterPill: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterPillText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },

  content: { padding: 16, paddingBottom: 60, gap: 20 },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  emptySub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },

  group: { gap: 8 },
  groupLabel: {
    fontSize: 11, fontWeight: '900', letterSpacing: 1.2,
    color: colors.textMuted, textTransform: 'uppercase', marginBottom: 2,
  },

  drillCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14,
  },
  drillDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  drillName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  drillFixes: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  drillFocus: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
});

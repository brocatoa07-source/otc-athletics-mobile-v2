/**
 * ExpandableProfileCard — Collapsible profile breakdown for vault dashboards.
 *
 * Shows a condensed profile summary by default.
 * Expands to full detailed breakdown on tap.
 *
 * Used by Mental, Hitting, and Strength vault dashboards.
 */

import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface ProfileSection {
  label: string;
  items: string[];
  color: string;
  icon?: string;
}

interface Props {
  /** Vault accent color */
  accent: string;
  /** Profile/archetype title */
  title: string;
  /** Short one-line summary */
  subtitle?: string;
  /** 2–3 key strengths for collapsed view */
  collapsedStrengths: string[];
  /** 1–2 key watch-outs for collapsed view */
  collapsedWatchOuts: string[];
  /** Full sections for expanded view */
  expandedSections: ProfileSection[];
}

export function ExpandableProfileCard({
  accent,
  title,
  subtitle,
  collapsedStrengths,
  collapsedWatchOuts,
  expandedSections,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  }

  return (
    <View style={[styles.card, { borderColor: accent + '25' }]}>
      {/* ── Collapsed: always visible ────────── */}
      <TouchableOpacity style={styles.headerRow} onPress={toggle} activeOpacity={0.8}>
        <View style={[styles.iconWrap, { backgroundColor: accent + '15' }]}>
          <Ionicons name="person-outline" size={16} color={accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: accent }]}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Condensed strengths + watch-outs (always visible) */}
      <View style={styles.condensedSection}>
        {collapsedStrengths.slice(0, 3).map((s) => (
          <View key={s} style={styles.condensedRow}>
            <View style={[styles.condensedDot, { backgroundColor: accent }]} />
            <Text style={styles.condensedText}>{s}</Text>
          </View>
        ))}
        {collapsedWatchOuts.slice(0, 2).map((w) => (
          <View key={w} style={styles.condensedRow}>
            <View style={[styles.condensedDot, { backgroundColor: '#f59e0b60' }]} />
            <Text style={styles.condensedText}>{w}</Text>
          </View>
        ))}
      </View>

      {/* ── Expanded: full breakdown ──────────── */}
      {expanded && (
        <View style={styles.expandedWrap}>
          <View style={styles.divider} />
          {expandedSections.map((section) => (
            <View key={section.label} style={styles.expandedSection}>
              <Text style={[styles.sectionLabel, { color: section.color }]}>{section.label}</Text>
              {section.items.map((item) => (
                <View key={item} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: section.color + '80' }]} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Toggle label */}
      <TouchableOpacity style={styles.toggleRow} onPress={toggle} activeOpacity={0.7}>
        <Text style={[styles.toggleText, { color: accent }]}>
          {expanded ? 'Hide Profile' : 'View Full Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  title: {
    fontSize: 15, fontWeight: '900',
  },
  subtitle: {
    fontSize: 11, fontWeight: '600', color: colors.textMuted, marginTop: 1,
  },

  /* Condensed */
  condensedSection: { gap: 3 },
  condensedRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  condensedDot: {
    width: 5, height: 5, borderRadius: 3, flexShrink: 0,
  },
  condensedText: {
    flex: 1, fontSize: 12, fontWeight: '600', color: colors.textSecondary,
  },

  /* Expanded */
  divider: {
    height: 1, backgroundColor: colors.border, marginVertical: 4,
  },
  expandedWrap: { gap: 8 },
  expandedSection: { gap: 4 },
  sectionLabel: {
    fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginTop: 2,
  },
  bulletRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
  },
  bulletDot: {
    width: 5, height: 5, borderRadius: 3, marginTop: 5, flexShrink: 0,
  },
  bulletText: {
    flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17,
  },

  /* Toggle */
  toggleRow: {
    alignItems: 'center', paddingTop: 4,
  },
  toggleText: {
    fontSize: 12, fontWeight: '800',
  },
});

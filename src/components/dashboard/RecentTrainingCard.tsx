/**
 * RecentTrainingCard — Compact summary of last completed training activities.
 *
 * Sources:
 *   Strength: otc:workout-completions (AsyncStorage map of date → timestamp)
 *   Mental:   otc:mental-session-date (AsyncStorage date string)
 *   Hitting:  otc:skill-work-date (AsyncStorage date string)
 *
 * Hidden if no training history exists.
 */

import { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';

interface RecentItem {
  label: string;
  icon: string;
  color: string;
  dateStr: string | null;
}

function formatRecency(dateStr: string | null): string {
  if (!dateStr) return 'Not yet';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return dateStr;
}

export function RecentTrainingCard() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadRecent().then(setItems);
    }, []),
  );

  // Hide if nothing loaded yet or no activity at all
  if (items.length === 0 || items.every((i) => !i.dateStr)) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={14} color={colors.textMuted} />
        <Text style={styles.headerLabel}>RECENT TRAINING</Text>
      </View>
      <View style={styles.rows}>
        {items.map((item) => (
          <View key={item.label} style={styles.row}>
            <Ionicons name={item.icon as any} size={14} color={item.color} />
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={[styles.rowDate, item.dateStr && { color: colors.textSecondary }]}>
              {formatRecency(item.dateStr)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

async function loadRecent(): Promise<RecentItem[]> {
  try {
    const [strengthRaw, mentalDate, hittingDate] = await Promise.all([
      AsyncStorage.getItem('otc:workout-completions'),
      AsyncStorage.getItem('otc:mental-session-date'),
      AsyncStorage.getItem('otc:skill-work-date'),
    ]);

    // Strength: find most recent completion date from the map
    let lastStrength: string | null = null;
    if (strengthRaw) {
      try {
        const map: Record<string, string> = JSON.parse(strengthRaw);
        const dates = Object.keys(map).sort().reverse();
        lastStrength = dates[0] ?? null;
      } catch {}
    }

    return [
      { label: 'Hitting', icon: 'baseball-outline', color: '#E10600', dateStr: hittingDate },
      { label: 'Strength', icon: 'barbell-outline', color: '#1DB954', dateStr: lastStrength },
      { label: 'Mental', icon: 'brain-outline', color: '#A78BFA', dateStr: mentalDate },
    ];
  } catch {
    return [];
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 12,
    gap: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLabel: {
    flex: 1,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.textMuted,
  },
  rows: { gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  rowDate: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
});

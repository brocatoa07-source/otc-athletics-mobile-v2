/**
 * PlaybookCard — Dashboard preview of the athlete's personal playbook.
 *
 * Shows most recent entry preview + quick actions.
 * Empty state when no entries exist yet.
 */

import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, radius } from '@/theme';
import {
  getRecentPlaybookEntry,
  getEntryTypeLabel,
  getEntryTypeIcon,
  getEntryTypeColor,
  type PlaybookEntry,
} from '@/data/playbook';

const ACCENT = '#3b82f6';

export function PlaybookCard() {
  const [recent, setRecent] = useState<PlaybookEntry | null>(null);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getRecentPlaybookEntry().then((entry) => {
        setRecent(entry);
        setLoaded(true);
      });
    }, []),
  );

  if (!loaded) return null;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="book" size={16} color={ACCENT} />
        <Text style={styles.title}>Playbook</Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/playbook' as any)}
          hitSlop={8}
        >
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Recent entry preview OR empty state */}
      {recent ? (
        <TouchableOpacity
          style={styles.preview}
          onPress={() => router.push('/(app)/playbook' as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.previewIcon, { backgroundColor: getEntryTypeColor(recent.type) + '15' }]}>
            <Ionicons name={getEntryTypeIcon(recent.type) as any} size={14} color={getEntryTypeColor(recent.type)} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.previewMeta}>
              <Text style={styles.previewType}>{getEntryTypeLabel(recent.type)}</Text>
              <Text style={styles.previewDate}>{formatRelativeDate(recent.createdAt)}</Text>
            </View>
            <Text style={styles.previewTitle} numberOfLines={1}>{recent.title}</Text>
            <Text style={styles.previewBody} numberOfLines={2}>{recent.body}</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Save what's working — drills, cues, notes, journal entries, and videos.
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(app)/playbook/new-entry?type=note' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={14} color={ACCENT} />
          <Text style={styles.actionText}>Note</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(app)/playbook/new-entry?type=journal' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="book-outline" size={14} color={ACCENT} />
          <Text style={styles.actionText}>Journal</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(app)/playbook/new-video' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="videocam-outline" size={14} color={ACCENT} />
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(app)/playbook' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="folder-open-outline" size={14} color={ACCENT} />
          <Text style={styles.actionText}>View Playbook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatRelativeDate(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginTop: 10,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  viewAll: {
    fontSize: 11,
    fontWeight: '700',
    color: ACCENT,
  },

  // Preview
  preview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
  },
  previewIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: ACCENT + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewType: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  previewDate: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  previewBody: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    marginTop: 2,
  },

  // Empty state
  emptyState: {
    padding: 10,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    textAlign: 'center',
  },

  // Quick actions
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
    color: ACCENT,
  },
  actionDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
  },
});

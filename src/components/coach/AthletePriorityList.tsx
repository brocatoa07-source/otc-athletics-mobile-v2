import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import type { PrioritizedAthlete } from '@/hooks/useCoachDashboard';

const TAG_META: Record<string, { label: string; color: string }> = {
  hitting: { label: 'HIT',  color: '#3b82f6' },
  lifting: { label: 'LIFT', color: '#22c55e' },
  mental:  { label: 'MNT',  color: '#8b5cf6' },
  general: { label: 'GEN',  color: '#6b7280' },
};

interface Props {
  athletes: PrioritizedAthlete[];
  limit?: number;
  onShowAll?: () => void;
}

export function AthletePriorityList({ athletes, limit = 8, onShowAll }: Props) {
  const visible = athletes.slice(0, limit);
  const hasMore = athletes.length > limit;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>ATHLETES</Text>
        {athletes.length > 0 && (
          <Text style={styles.count}>{athletes.length}</Text>
        )}
      </View>

      {athletes.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No athletes yet</Text>
          <Text style={styles.emptyDesc}>Share your connect code to add athletes.</Text>
        </View>
      ) : (
        <>
          {visible.map((athlete) => (
            <AthleteRow key={athlete.userId} athlete={athlete} />
          ))}

          {hasMore && onShowAll && (
            <TouchableOpacity style={styles.showMore} onPress={onShowAll} activeOpacity={0.7}>
              <Text style={styles.showMoreText}>Show all {athletes.length} athletes</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

function AthleteRow({ athlete }: { athlete: PrioritizedAthlete }) {
  const tag  = TAG_META[athlete.tag] ?? TAG_META.general;
  const isCritical = athlete.priorityLevel === 'critical';

  return (
    <TouchableOpacity
      style={[styles.row, isCritical && styles.rowCritical]}
      onPress={() =>
        router.push({
          pathname: '/(app)/coach/athlete-detail',
          params: { userId: athlete.userId },
        } as any)
      }
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{athlete.initial}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{athlete.name}</Text>
          {isCritical && (
            <View style={styles.criticalBadge}>
              <Text style={styles.criticalText}>CRITICAL</Text>
            </View>
          )}
        </View>
        <Text style={styles.meta}>
          Last touch: {athlete.daysSinceTouchpoint === 0 ? 'today' : `${athlete.daysSinceTouchpoint}d ago`}
          {athlete.hasVideoPending && '  •  Video pending'}
        </Text>
      </View>

      <View style={styles.right}>
        <View style={[styles.priorityDot, { backgroundColor: athlete.priorityColor }]} />
        <View style={[styles.tagChip, { backgroundColor: tag.color + '20' }]}>
          <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  sectionLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  count: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  emptyDesc: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 13,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 13,
  },
  rowCritical: {
    borderColor: '#ef444440',
    backgroundColor: '#ef444408',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '900', color: Colors.primary },

  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  criticalBadge: {
    backgroundColor: '#ef444420',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  criticalText: { fontSize: 9, fontWeight: '900', color: '#ef4444', letterSpacing: 0.5 },
  meta: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  right: { alignItems: 'flex-end', gap: 5 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  tagChip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 },
  tagText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  showMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  showMoreText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
});

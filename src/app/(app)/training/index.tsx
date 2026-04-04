import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useAccess } from '@/features/billing/useAccess';
import { InlineLock } from '@/features/billing/AccessGate';
import {
  PROGRAMS, COURSES,
  canUserAccessContent, getLockMessage,
  type ContentItem, type LockState,
} from '@/features/content/programsAndCourses';

/* ────────────────────────────────────────────────
 * TRAIN — Vaults + Programs + Courses
 * ──────────────────────────────────────────────── */

const VAULT_CARDS = [
  { title: 'Hitting Vault', sub: 'The OTC hitting system', icon: 'baseball-outline', color: '#f97316', route: '/(app)/training/mechanical', permission: 'hittingVault.useFull' as const },
  { title: 'Strength Vault', sub: 'Strength, speed, and power', icon: 'barbell-outline', color: '#1DB954', route: '/(app)/training/sc', permission: 'strengthVault.useFull' as const },
  { title: 'Mental Vault', sub: 'Confidence, focus, and routines', icon: 'bulb-outline', color: '#a855f7', route: '/(app)/training/mental', permission: 'mentalVault.useFull' as const },
];

export default function TrainHub() {
  const access = useAccess();
  const purchasedIds: string[] = []; // TODO: Load from user_purchases table

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>Train</Text>
        <Text style={styles.headingSub}>Vaults, Programs & Courses</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ═══ DAILY WORK ═══ */}
        <TouchableOpacity
          style={[styles.vaultCard, { borderColor: '#1DB95430' }]}
          onPress={() => router.push('/(app)/daily-work' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.vaultIcon, { backgroundColor: '#1DB95415' }]}>
            <Ionicons name="flash" size={22} color="#1DB954" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vaultTitle}>Daily Work</Text>
            <Text style={styles.cardSub}>Today's hitting, strength, and mental work</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ═══ VAULTS ═══ */}
        <Text style={styles.sectionLabel}>VAULTS</Text>
        {VAULT_CARDS.map((v) => {
          const locked = access.isLocked(v.permission);
          return (
            <TouchableOpacity
              key={v.title}
              style={styles.vaultCard}
              onPress={() => router.push(v.route as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.vaultIcon, { backgroundColor: v.color + '15' }]}>
                <Ionicons name={v.icon as any} size={22} color={locked ? colors.textMuted : v.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vaultTitle}>{v.title}</Text>
                <Text style={styles.cardSub}>{v.sub}</Text>
              </View>
              {locked && <InlineLock permission={v.permission} />}
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        {/* ═══ PROGRAMS ═══ */}
        <Text style={styles.sectionLabel}>PROGRAMS</Text>
        <Text style={styles.sectionSub}>Included in your membership</Text>
        {PROGRAMS.filter(p => p.isActive).map((program) => {
          const lockState = canUserAccessContent(access.effectiveTier, program, purchasedIds);
          return (
            <ContentCard
              key={program.id}
              item={program}
              lockState={lockState}
              lockMessage={getLockMessage(program, lockState)}
            />
          );
        })}

        {/* ═══ COURSES ═══ */}
        <Text style={styles.sectionLabel}>COURSES</Text>
        <Text style={styles.sectionSub}>Premium educational programs — one-time purchase</Text>
        {COURSES.filter(c => c.isActive).map((course) => {
          const lockState = canUserAccessContent(access.effectiveTier, course, purchasedIds);
          return (
            <ContentCard
              key={course.id}
              item={course}
              lockState={lockState}
              lockMessage={getLockMessage(course, lockState)}
            />
          );
        })}

        {/* Playbook link */}
        <TouchableOpacity
          style={styles.vaultCard}
          onPress={() => router.push('/(app)/playbook' as any)}
          activeOpacity={0.75}
        >
          <View style={[styles.vaultIcon, { backgroundColor: '#0891b215' }]}>
            <Ionicons name="book-outline" size={22} color="#0891b2" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vaultTitle}>Playbook</Text>
            <Text style={styles.cardSub}>Notes, cues, and saved tools</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function ContentCard({
  item, lockState, lockMessage,
}: {
  item: ContentItem;
  lockState: LockState;
  lockMessage: string;
}) {
  const isLocked = lockState !== 'unlocked';

  return (
    <TouchableOpacity
      style={[styles.contentCard, isLocked && { opacity: 0.55 }]}
      onPress={() => {
        if (lockState === 'locked_tier') {
          router.push('/(app)/upgrade' as any);
        } else if (lockState === 'locked_purchase') {
          // TODO: Open purchase flow
          router.push('/(app)/upgrade' as any);
        }
        // TODO: Route to program/course detail screen when unlocked
      }}
      activeOpacity={0.75}
    >
      <View style={[styles.contentIcon, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon as any} size={18} color={isLocked ? colors.textMuted : item.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.contentTitle, isLocked && { color: colors.textMuted }]}>{item.title}</Text>
        <Text style={styles.cardSub} numberOfLines={1}>{item.description}</Text>
      </View>
      {isLocked ? (
        <View style={styles.lockBadge}>
          <Ionicons
            name={lockState === 'locked_purchase' ? 'cart-outline' : 'lock-closed'}
            size={10}
            color={lockState === 'locked_purchase' ? '#f59e0b' : colors.textMuted}
          />
          <Text style={[styles.lockText, lockState === 'locked_purchase' && { color: '#f59e0b' }]}>
            {lockState === 'locked_purchase' && item.price ? `$${item.price}` : 'Upgrade'}
          </Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  heading: { fontSize: 24, fontWeight: '900', color: colors.textPrimary },
  headingSub: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5, marginTop: 2 },
  content: { padding: 16, paddingBottom: 60, gap: 8 },

  sectionLabel: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.5,
    color: colors.textMuted, marginTop: 12,
  },
  sectionSub: { fontSize: 10, color: colors.textMuted, opacity: 0.6, marginTop: -4 },

  vaultCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  vaultIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  vaultTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  cardSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  contentCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  contentIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  contentTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  lockBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 6, paddingVertical: 3,
    backgroundColor: colors.bg, borderRadius: 6,
  },
  lockText: { fontSize: 9, fontWeight: '700', color: colors.textMuted },
});

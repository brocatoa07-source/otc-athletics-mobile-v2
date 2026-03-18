import { ActivityIndicator, ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '@/theme';
import { IconTile } from '@/components/common/IconTile';
import { IconGrid } from '@/components/common/IconGrid';
import { useGating, type GateState } from '@/hooks/useGating';

/* ────────────────────────────────────────────────
 * LAB — HUB + EXECUTION LAUNCHER
 *
 * Phase 3: Vault entry + gating only.
 * MY PATH cards and additional tiles come later.
 * ──────────────────────────────────────────────── */

const COMING_SOON_TILES = [
  {
    icon: 'add-circle-outline' as const,
    title: 'Add-Ons',
    subtitle: 'Coming soon',
    accent: 'hitting' as const,
    route: '/(app)/training/placeholder?section=add-ons',
  },
  {
    icon: 'school-outline' as const,
    title: 'College Recruiting',
    subtitle: 'Coming soon',
    accent: 'mental' as const,
    route: '/(app)/training/placeholder?section=recruiting',
  },
  {
    icon: 'clipboard-outline' as const,
    title: 'Programs',
    subtitle: 'Coming soon',
    accent: 'lifting' as const,
    route: '/(app)/training/placeholder?section=programs',
  },
];

const VAULT_TILES = [
  {
    icon: 'baseball-outline' as const,
    title: 'Hitting Vault',
    subtitle: 'The OTC hitting system',
    accent: 'hitting' as const,
    route: '/(app)/training/mechanical',
  },
  {
    icon: 'sparkles-outline' as const,
    title: 'Mental Vault',
    subtitle: '11 mental skills\nComplete mental performance system',
    accent: 'mental' as const,
    route: '/(app)/training/mental',
  },
  {
    icon: 'barbell-outline' as const,
    title: 'Lifting Vault',
    subtitle: 'Full training library',
    accent: 'lifting' as const,
    route: '/(app)/training/sc',
  },
];

export default function TrainingHub() {
  const { gate, isLoading } = useGating();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.heading}>Lab</Text>
          <Text style={styles.headingSub}>Hub + Execution</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.textMuted} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>Lab</Text>
        <Text style={styles.headingSub}>Hub + Execution</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Locked My Path banner ───────────────── */}
        {!gate.myPathUnlocked && <LockedMyPathBanner gate={gate} />}

        {/* ─── Vault Tiles ─────────────────────────── */}
        <View style={styles.hubHeader}>
          <Text style={styles.hubLabel}>Vaults</Text>
          <Text style={styles.hubSub}>Complete diagnostics to unlock</Text>
        </View>

        <IconGrid>
          {VAULT_TILES.map((tile) => {
            const isHittingLocked = tile.title === 'Hitting Vault' && !gate.hittingUnlocked;
            const isLiftingLocked = tile.title === 'Lifting Vault' && !gate.scUnlocked;
            const isMentalLocked  = tile.title === 'Mental Vault'  && !gate.mentalUnlocked;
            const isLocked = isHittingLocked || isLiftingLocked || isMentalLocked;

            const handlePress = () => {
              if (isHittingLocked) {
                router.push('/(app)/training/mechanical/diagnostics' as any);
              } else if (isLiftingLocked) {
                router.push('/(app)/training/sc/diagnostics' as any);
              } else if (isMentalLocked) {
                router.push('/(app)/training/mental/diagnostics/entry' as any);
              } else {
                router.push(tile.route as any);
              }
            };

            return (
              <IconTile
                key={tile.title}
                icon={tile.icon}
                title={tile.title}
                subtitle={tile.subtitle}
                accent={tile.accent}
                onPress={handlePress}
                badge={isLocked ? 'LOCKED' : undefined}
              />
            );
          })}
        </IconGrid>

        {/* ─── Coming Soon Sections ──────────────── */}
        <View style={styles.hubHeader}>
          <Text style={styles.hubLabel}>More</Text>
          <Text style={styles.hubSub}>New features in development</Text>
        </View>

        <IconGrid>
          {COMING_SOON_TILES.map((tile) => (
            <IconTile
              key={tile.title}
              icon={tile.icon}
              title={tile.title}
              subtitle={tile.subtitle}
              accent={tile.accent}
              onPress={() => router.push(tile.route as any)}
              badge="SOON"
            />
          ))}
        </IconGrid>
      </ScrollView>
    </SafeAreaView>
  );
}

function LockedMyPathBanner({ gate }: { gate: GateState }) {
  const remaining: { label: string; done: boolean; route: string }[] = [
    {
      label: 'Hitting: Mover Type Quiz',
      done: gate.hitting.moverDone,
      route: '/(app)/training/mechanical/diagnostics',
    },
    {
      label: `Mental: ${gate.mental.completedCount}/3 Diagnostics`,
      done: gate.mentalUnlocked,
      route: '/(app)/training/mental/diagnostics/entry',
    },
    {
      label: 'S&C: Mover Type Quiz',
      done: gate.sc.moverDone,
      route: '/(app)/training/sc/diagnostics',
    },
  ];

  return (
    <View style={styles.lockedBanner}>
      <View style={styles.lockedBannerHeader}>
        <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
        <Text style={styles.lockedBannerTitle}>Complete All Diagnostics to Unlock My Path</Text>
      </View>
      <Text style={styles.lockedBannerSub}>
        Finish your assessments in each vault to personalize your training path.
      </Text>
      {remaining.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.lockedBannerRow}
          onPress={() => !item.done && router.push(item.route as any)}
          activeOpacity={item.done ? 1 : 0.7}
        >
          <Ionicons
            name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
            size={18}
            color={item.done ? '#22c55e' : colors.textMuted}
          />
          <Text style={[styles.lockedBannerRowText, item.done && styles.lockedBannerRowDone]}>
            {item.label}
          </Text>
          {!item.done && (
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 48, paddingTop: 8 },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heading: { fontSize: 26, fontWeight: '900', color: colors.textPrimary },
  headingSub: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },

  hubHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  hubLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
  },
  hubSub: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    opacity: 0.6,
    marginTop: 2,
  },

  lockedBanner: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
    marginTop: 8,
  },
  lockedBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockedBannerTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  lockedBannerSub: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  lockedBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  lockedBannerRowText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  lockedBannerRowDone: {
    color: '#22c55e',
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
});

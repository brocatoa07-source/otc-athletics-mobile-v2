import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { useTier } from '@/hooks/useTier';
import { useGating } from '@/hooks/useGating';
import { HITTING_VAULT_SECTIONS } from '@/data/hitting-vault-sections';
import { MOVER_TYPES, type MoverTypeData } from '@/data/hitting-mover-type-data';

const ACCENT = '#E10600';

export default function HittingVaultIndex() {
  const { hasLimitedHitting } = useTier();
  const { gate } = useGating();
  const [moverResult, setMoverResult] = useState<MoverTypeData | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('otc:mover-type').then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val);
          const slug = parsed.slug ?? parsed;
          const found = Object.values(MOVER_TYPES).find((m) => m.slug === slug);
          if (found) setMoverResult(found);
        } catch {}
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>The OTC Hitting System</Text>
        </View>
        <TouchableOpacity
          style={styles.diagBtn}
          onPress={() => router.push('/(app)/training/mechanical/diagnostics' as any)}
        >
          <Ionicons name="clipboard-outline" size={18} color={ACCENT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Mover Type Banner */}
        {moverResult && (
          <TouchableOpacity
            style={[styles.moverBanner, { borderColor: moverResult.color + '40' }]}
            onPress={() => router.push('/(app)/training/mechanical/mover-type-quiz' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.moverDot, { backgroundColor: moverResult.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.moverLabel}>Your Swing Identity</Text>
              <Text style={[styles.moverType, { color: moverResult.color }]}>
                {moverResult.name}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Walk Tier Banner */}
        {hasLimitedHitting && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/upgrade' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-open-outline" size={18} color={ACCENT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Free Preview Mode</Text>
              <Text style={styles.upgradeSub}>
                Starter drills unlocked in each section. Upgrade to Single for full access.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* My Path Card */}
        <TouchableOpacity
          style={styles.myPathCard}
          onPress={() => router.push('/(app)/training/mechanical/my-path' as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.dailyWorkIcon, { backgroundColor: '#3b82f618' }]}>
            <Ionicons name="map-outline" size={22} color="#3b82f6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.dailyWorkLabel}>My Path</Text>
            <Text style={styles.dailyWorkSub}>
              {gate.hitting.mechanicalDone
                ? 'Your personalized development plan'
                : 'Complete diagnostics to unlock'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Daily Work Card */}
        <TouchableOpacity
          style={styles.dailyWorkCard}
          onPress={() => router.push('/(app)/training/mechanical/daily-work' as any)}
          activeOpacity={0.8}
        >
          <View style={styles.dailyWorkIcon}>
            <Ionicons name="flash" size={22} color={ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.dailyWorkLabel}>Daily Work</Text>
            <Text style={styles.dailyWorkSub}>
              {gate.hitting.mechanicalDone
                ? 'Today\'s personalized drills'
                : 'Complete Swing Diagnostic to unlock'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Section Cards */}
        <Text style={styles.sectionHeader}>Sections</Text>

        {HITTING_VAULT_SECTIONS.map((section) => {
          const drillCount = section.drills.length;
          const isPlaceholder = section.isPlaceholder;
          const hasDiagnostic = gate.hitting.mechanicalDone;

          return (
            <TouchableOpacity
              key={section.key}
              style={styles.sectionCard}
              onPress={() => router.push(`/(app)/training/mechanical/${section.key}` as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.sectionIcon, { backgroundColor: section.color + '18' }]}>
                <Ionicons name={section.icon} size={22} color={section.color} />
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionLabel}>{section.label}</Text>
                <Text style={styles.sectionDesc} numberOfLines={2}>
                  {section.description}
                </Text>
                <View style={styles.sectionMeta}>
                  {isPlaceholder ? (
                    <Text style={[styles.metaText, { color: section.color }]}>
                      {hasDiagnostic ? 'Personalized fixes' : 'Take Swing Diagnostic to unlock'}
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.metaText}>
                        {drillCount} drill{drillCount !== 1 ? 's' : ''}
                      </Text>
                      {hasLimitedHitting && section.freeCount > 0 && (
                        <Text style={[styles.metaFree, { color: section.color }]}>
                          {section.freeCount} free
                        </Text>
                      )}
                    </>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

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
  headerSup: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: ACCENT,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  diagBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ACCENT + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: { padding: 16, paddingBottom: 60, gap: 10 },

  moverBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
  },
  moverDot: { width: 10, height: 10, borderRadius: 5 },
  moverLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  moverType: { fontSize: 16, fontWeight: '900' },

  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: ACCENT + '08',
    borderWidth: 1,
    borderColor: ACCENT + '30',
    borderRadius: radius.lg,
    padding: 14,
  },
  upgradeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  upgradeSub: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },

  myPathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#3b82f608',
    borderWidth: 1,
    borderColor: '#3b82f625',
    borderRadius: radius.lg,
    padding: 16,
  },
  dailyWorkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: ACCENT + '08',
    borderWidth: 1,
    borderColor: ACCENT + '25',
    borderRadius: radius.lg,
    padding: 16,
  },
  dailyWorkIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ACCENT + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyWorkLabel: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  dailyWorkSub: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 2 },

  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 2,
  },

  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: { flex: 1, gap: 3 },
  sectionLabel: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  sectionDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  sectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  metaFree: { fontSize: 11, fontWeight: '800' },
});

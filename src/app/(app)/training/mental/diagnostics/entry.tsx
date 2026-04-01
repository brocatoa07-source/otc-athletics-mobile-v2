import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { colors, accents, radius } from '@/theme';
import { DIAGNOSTIC_META, DIAGNOSTIC_ORDER } from '@/data/mental-diagnostics-data';
import type { DiagnosticType } from '@/data/mental-diagnostics-data';
import { useGating } from '@/hooks/useGating';
import { supabase } from '@/lib/supabase';
import { getLiveUser } from '@/utils/getLiveUser';
import { generateDiagnosticResult } from '@/lib/gating/generateDiagnosticResult';
import { VAULT, QUERY_KEYS } from '@/lib/gating/diagnosticConstants';

const ACCENT = accents.mental;

// ── Step card ─────────────────────────────────────────────────────────────────

function StepCard({
  type,
  order,
  isComplete,
  isLocked,
  onPress,
}: {
  type: DiagnosticType;
  order: number;
  isComplete: boolean;
  isLocked: boolean;
  onPress: () => void;
}) {
  const meta = DIAGNOSTIC_META[type];
  return (
    <TouchableOpacity
      style={[
        styles.stepCard,
        isComplete && styles.stepCardComplete,
        isLocked && styles.stepCardLocked,
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.8}
    >
      <View style={[styles.stepIcon, isComplete && styles.stepIconComplete]}>
        {isComplete ? (
          <Ionicons name="checkmark" size={18} color={colors.black} />
        ) : (
          <Text style={[styles.stepNum, isLocked && { opacity: 0.4 }]}>{order}</Text>
        )}
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.stepLabel, isLocked && { opacity: 0.4 }]}>{meta.label}</Text>
        <Text style={[styles.stepDesc, isLocked && { opacity: 0.3 }]}>{meta.description}</Text>
      </View>

      {isComplete ? (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>Done</Text>
        </View>
      ) : isLocked ? (
        <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
      ) : (
        <View style={[styles.startBadge, { backgroundColor: ACCENT + '20', borderColor: ACCENT + '50' }]}>
          <Text style={[styles.startBadgeText, { color: ACCENT }]}>Start →</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function DiagnosticsEntryScreen() {
  const { gate } = useGating();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);

  // Derive step completion from gate state (diagnostic_submissions)
  const completedTypes = new Set<DiagnosticType>([
    ...(gate.mental.archetypeDone ? ['archetype' as DiagnosticType] : []),
    ...(gate.mental.identityDone  ? ['identity'  as DiagnosticType] : []),
    ...(gate.mental.habitsDone    ? ['habits'    as DiagnosticType] : []),
  ]);

  const allDiagnosticsComplete =
    gate.mental.archetypeDone && gate.mental.identityDone && gate.mental.habitsDone;

  // Determine which step is unlocked (sequential: archetype → identity → habits)
  const isUnlocked = (type: DiagnosticType): boolean => {
    if (type === 'archetype') return true;
    if (type === 'identity')  return completedTypes.has('archetype');
    return completedTypes.has('archetype') && completedTypes.has('identity');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: ACCENT }]}>MENTAL VAULT</Text>
          <Text style={styles.headerTitle}>Entry Diagnostics</Text>
        </View>
        {allDiagnosticsComplete && (
          <TouchableOpacity
            style={styles.vaultBtn}
            onPress={() => router.replace('/(app)/training/mental' as any)}
          >
            <Text style={[styles.vaultBtnText, { color: ACCENT }]}>Back to Vault</Text>
            <Ionicons name="chevron-forward" size={14} color={ACCENT} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Complete all 3 diagnostics to generate your personalized Mental Profile and unlock your
          Mental Vault tools. Each diagnostic takes 3–5 minutes.
        </Text>

        {/* Progress indicator */}
        <View style={styles.progressRow}>
          {DIAGNOSTIC_ORDER.map((type) => (
            <View
              key={type}
              style={[
                styles.progressDot,
                completedTypes.has(type) && { backgroundColor: ACCENT },
              ]}
            />
          ))}
          <Text style={styles.progressText}>
            {completedTypes.size} / 3 complete
          </Text>
        </View>

        {/* Step cards */}
        {DIAGNOSTIC_ORDER.map((type, i) => (
          <StepCard
            key={type}
            type={type}
            order={i + 1}
            isComplete={completedTypes.has(type)}
            isLocked={!isUnlocked(type)}
            onPress={() =>
              router.push({
                pathname: '/(app)/training/mental/diagnostics/quiz' as any,
                params: { type },
              })
            }
          />
        ))}

        {/* Generate profile CTA — shown when all diagnostics are complete */}
        {allDiagnosticsComplete && (
          <TouchableOpacity
            style={[styles.generateBtn, { borderColor: ACCENT + '60', shadowColor: ACCENT }]}
            onPress={async () => {
              if (generating) return;
              setGenerating(true);
              try {
                const liveUser = await getLiveUser();
                if (!liveUser) {
                  Alert.alert('Session Expired', 'Please sign in again.');
                  setGenerating(false);
                  return;
                }

                console.log('[entry] Generating mental profile for', liveUser.id.slice(0, 8));

                const result = await generateDiagnosticResult({
                  supabase,
                  userId: liveUser.id,
                  vaultType: VAULT.MENTAL,
                });

                if (!result.success) {
                  throw new Error(result.error ?? 'Profile generation failed');
                }

                // Invalidate all related queries
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mentalProfile(liveUser.id) });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mentalSubmissions(liveUser.id) });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gateState(liveUser.id) });
                console.log('[entry] Profile generated, queries invalidated');

                router.push('/(app)/training/mental' as any);
              } catch (err: any) {
                console.error('[entry] Profile generation FAILED:', err?.message ?? err);
                Alert.alert(
                  'Profile Generation Failed',
                  err?.message ?? 'Could not generate your mental profile. Please try again.',
                );
              } finally {
                setGenerating(false);
              }
            }}
            activeOpacity={0.85}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator size="small" color={ACCENT} />
            ) : (
              <Ionicons name="sparkles-outline" size={22} color={ACCENT} />
            )}
            <Text style={[styles.generateBtnText, { color: ACCENT }]}>
              {generating ? 'Generating Profile…' : 'Generate Profile & Enter Vault'}
            </Text>
            {!generating && <Ionicons name="arrow-forward" size={18} color={ACCENT} />}
          </TouchableOpacity>
        )}

        {/* Info note */}
        <Text style={styles.note}>
          You can retake any diagnostic at any time. Your profile will update with the most
          recent results.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  vaultBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 4, paddingHorizontal: 6 },
  vaultBtnText: { fontSize: 12, fontWeight: '700' },

  content: { padding: 20, gap: 14, paddingBottom: 60 },

  intro: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    borderLeftWidth: 3,
    borderLeftColor: accents.mental + '50',
    paddingLeft: 12,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginLeft: 4,
  },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  stepCardComplete: {
    borderColor: '#22c55e40',
    backgroundColor: '#22c55e08',
  },
  stepCardLocked: { opacity: 0.6 },

  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconComplete: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  stepNum: { fontSize: 15, fontWeight: '900', color: colors.textMuted },

  stepLabel: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  stepDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#22c55e20',
  },
  completedBadgeText: { fontSize: 10, fontWeight: '800', color: '#22c55e' },

  startBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  startBadgeText: { fontSize: 11, fontWeight: '800' },

  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    backgroundColor: accents.mental + '10',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
    marginTop: 4,
  },
  generateBtnText: { fontSize: 16, fontWeight: '900' },

  note: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});

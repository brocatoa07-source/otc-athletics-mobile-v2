import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface DiagnosticStepItem {
  key: string;
  label: string;
  description: string;
  isComplete: boolean;
  isLocked?: boolean;
  onPress: () => void;
}

export interface VaultDiagnosticsEntryProps {
  vaultLabel: string;
  accent: string;
  introText: string;
  steps: DiagnosticStepItem[];
  completedCount: number;
  totalCount: number;
  allComplete: boolean;
  profileExists: boolean;
  ctaLabel: string;
  ctaLoading?: boolean;
  onCtaPress: () => void;
  onBack: () => void;
  onBackToVault?: () => void;
  noteText?: string;
}

/* ─── Step Card ───────────────────────────────────────────────────────── */

function StepCard({
  step,
  order,
  accent,
}: {
  step: DiagnosticStepItem;
  order: number;
  accent: string;
}) {
  const { label, description, isComplete, isLocked = false, onPress } = step;

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
        <Text style={[styles.stepLabel, isLocked && { opacity: 0.4 }]}>{label}</Text>
        <Text style={[styles.stepDesc, isLocked && { opacity: 0.3 }]}>{description}</Text>
      </View>

      {isComplete ? (
        <View style={styles.doneBadge}>
          <Text style={styles.doneBadgeText}>Done</Text>
        </View>
      ) : isLocked ? (
        <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
      ) : (
        <View style={[styles.startBadge, { backgroundColor: accent + '20', borderColor: accent + '50' }]}>
          <Text style={[styles.startBadgeText, { color: accent }]}>Start →</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────── */

export function VaultDiagnosticsEntry({
  vaultLabel,
  accent,
  introText,
  steps,
  completedCount,
  totalCount,
  allComplete,
  profileExists,
  ctaLabel,
  ctaLoading,
  onCtaPress,
  onBack,
  onBackToVault,
  noteText,
}: VaultDiagnosticsEntryProps) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: accent }]}>{vaultLabel}</Text>
          <Text style={styles.headerTitle}>Entry Diagnostics</Text>
        </View>
        {profileExists && onBackToVault && (
          <TouchableOpacity style={styles.vaultBtn} onPress={onBackToVault}>
            <Text style={[styles.vaultBtnText, { color: accent }]}>Back to Vault</Text>
            <Ionicons name="chevron-forward" size={14} color={accent} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <Text style={[styles.intro, { borderLeftColor: accent + '50' }]}>
          {introText}
        </Text>

        {/* Progress */}
        <View style={styles.progressRow}>
          {steps.map((step) => (
            <View
              key={step.key}
              style={[
                styles.progressDot,
                step.isComplete && { backgroundColor: accent },
              ]}
            />
          ))}
          <Text style={styles.progressText}>
            {completedCount} / {totalCount} complete
          </Text>
        </View>

        {/* Step cards */}
        {steps.map((step, i) => (
          <StepCard key={step.key} step={step} order={i + 1} accent={accent} />
        ))}

        {/* CTA button */}
        <TouchableOpacity
          style={[styles.ctaBtn, { borderColor: accent + '60', shadowColor: accent }]}
          onPress={onCtaPress}
          disabled={ctaLoading}
          activeOpacity={0.85}
        >
          {ctaLoading ? (
            <ActivityIndicator color={accent} />
          ) : (
            <>
              <Ionicons
                name={allComplete ? 'enter-outline' : 'arrow-forward'}
                size={22}
                color={accent}
              />
              <Text style={[styles.ctaBtnText, { color: accent }]}>{ctaLabel}</Text>
              <Ionicons name="arrow-forward" size={18} color={accent} />
            </>
          )}
        </TouchableOpacity>

        {/* Note */}
        {noteText && (
          <Text style={styles.note}>{noteText}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────── */

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
  vaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  vaultBtnText: { fontSize: 12, fontWeight: '700' },

  content: { padding: 20, gap: 14, paddingBottom: 60 },

  intro: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    borderLeftWidth: 3,
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

  doneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#22c55e20',
  },
  doneBadgeText: { fontSize: 10, fontWeight: '800', color: '#22c55e' },

  startBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  startBadgeText: { fontSize: 11, fontWeight: '800' },

  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    backgroundColor: colors.surface,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
    marginTop: 4,
  },
  ctaBtnText: { fontSize: 16, fontWeight: '900' },

  note: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});

import { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  TREND_METRICS,
  STRENGTH_INPUTS,
  calculateStrengthIndex,
  getStrengthBand,
  saveSnapshot,
  generateSnapshotId,
  type TrendMetricConfig,
  type PerformanceTrendSnapshot,
} from '@/data/performance-trend';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

const ACCENT = '#3b82f6';

export default function LogTestSnapshot() {
  const athlete = useAuthStore((s) => s.athlete);
  const [values, setValues] = useState<Record<string, string>>({});
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);

  function updateValue(key: string, text: string) {
    setValues((prev) => ({ ...prev, [key]: text }));
  }

  function parseNum(key: string): number | null {
    const raw = values[key]?.trim();
    if (!raw) return null;
    const n = parseFloat(raw);
    return isNaN(n) ? null : n;
  }

  const bodyweight = parseNum('bodyweight');
  const trapBar = parseNum('trapBarDeadlift');
  const frontSquat = parseNum('frontSquat');
  const splitSquat = parseNum('splitSquat');
  const strengthIndex = useMemo(
    () => calculateStrengthIndex(bodyweight, trapBar, frontSquat, splitSquat),
    [bodyweight, trapBar, frontSquat, splitSquat],
  );

  const filledCount = [...TREND_METRICS, ...STRENGTH_INPUTS].filter(
    (m) => values[m.key]?.trim(),
  ).length;

  async function handleSave() {
    if (filledCount === 0) {
      Alert.alert('No Data', 'Enter at least one metric value.');
      return;
    }
    setSaving(true);
    try {
      const snapshot: PerformanceTrendSnapshot = {
        id: generateSnapshotId(),
        createdAt: new Date().toISOString(),
        testDate: new Date().toISOString().slice(0, 10),
        note: note.trim(),
        bodyweight,
        exitVelo: parseNum('exitVelo'),
        throwingVelo: parseNum('throwingVelo'),
        sixtyYard: parseNum('sixtyYard'),
        tenYard: parseNum('tenYard'),
        batSpeed: parseNum('batSpeed'),
        verticalJump: parseNum('verticalJump'),
        broadJump: parseNum('broadJump'),
        rotationalPower: parseNum('rotationalPower'),
        trapBarDeadlift: trapBar,
        frontSquat,
        splitSquat,
        strengthIndex,
      };

      await saveSnapshot(snapshot);

      // Supabase write-through for key metrics (non-blocking)
      if (athlete?.id) {
        const entries: { athlete_id: string; metric_type: string; value: number; recorded_at: string }[] = [];
        const metricMap: Record<string, string> = {
          exitVelo: 'exit_velocity_mph',
          throwingVelo: 'throw_velocity_mph',
          sixtyYard: 'sprint_60yd_seconds',
          tenYard: 'sprint_10yd_seconds',
          batSpeed: 'bat_speed_mph',
          verticalJump: 'vertical_jump_inches',
          broadJump: 'broad_jump_inches',
          rotationalPower: 'rot_power_watts',
        };
        for (const [local, remote] of Object.entries(metricMap)) {
          const val = (snapshot as any)[local];
          if (val !== null) {
            entries.push({ athlete_id: athlete.id, metric_type: remote, value: val, recorded_at: snapshot.createdAt });
          }
        }
        if (strengthIndex !== null) {
          entries.push({ athlete_id: athlete.id, metric_type: 'strength_index', value: strengthIndex, recorded_at: snapshot.createdAt });
        }
        if (entries.length > 0) {
          supabase.from('athlete_progress').insert(entries).then(() => {});
        }
      }

      Alert.alert(
        'Saved',
        `Test snapshot logged with ${filledCount} metric${filledCount === 1 ? '' : 's'}.`,
        [
          { text: 'View Results', onPress: () => router.replace('/(app)/progress' as any) },
          { text: 'Done', onPress: () => router.back() },
        ],
      );
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Test Snapshot</Text>
        <View style={{ flex: 1 }} />
        {filledCount > 0 && (
          <Text style={styles.filledBadge}>{filledCount} filled</Text>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.intro}>
            Enter your testing results below. Each metric saves independently. Fill in only what you tested.
          </Text>

          {/* Performance Metrics */}
          <Text style={styles.groupLabel}>PERFORMANCE METRICS</Text>
          {TREND_METRICS.map((m) => (
            <MetricInput
              key={m.key}
              config={m}
              value={values[m.key] ?? ''}
              onChange={(t) => updateValue(m.key, t)}
              expanded={expandedDesc === m.key}
              onToggleDesc={() => setExpandedDesc(expandedDesc === m.key ? null : m.key)}
            />
          ))}

          {/* Strength Index Inputs */}
          <Text style={styles.groupLabel}>STRENGTH INDEX</Text>
          <Text style={styles.groupSub}>
            Enter your max or working max for each lift. Strength Index auto-calculates from bodyweight.
          </Text>
          {STRENGTH_INPUTS.map((m) => (
            <MetricInput
              key={m.key}
              config={m}
              value={values[m.key] ?? ''}
              onChange={(t) => updateValue(m.key, t)}
              expanded={expandedDesc === m.key}
              onToggleDesc={() => setExpandedDesc(expandedDesc === m.key ? null : m.key)}
            />
          ))}

          {/* Strength Index Preview */}
          {strengthIndex !== null && (
            <View style={styles.siPreview}>
              <Text style={styles.siLabel}>Calculated Strength Index</Text>
              <Text style={styles.siValue}>{strengthIndex.toFixed(2)}</Text>
              <View style={[styles.siBand, { backgroundColor: getStrengthBand(strengthIndex).color + '18' }]}>
                <Text style={[styles.siBandText, { color: getStrengthBand(strengthIndex).color }]}>
                  {getStrengthBand(strengthIndex).label}
                </Text>
              </View>
              {bodyweight && (
                <Text style={styles.siBreakdown}>
                  {trapBar ? `TB: ${(trapBar / bodyweight).toFixed(2)}` : ''}
                  {frontSquat ? `  FS: ${(frontSquat / bodyweight).toFixed(2)}` : ''}
                  {splitSquat ? `  SS: ${(splitSquat / bodyweight).toFixed(2)}` : ''}
                </Text>
              )}
            </View>
          )}

          {/* Notes */}
          <Text style={styles.groupLabel}>NOTES (OPTIONAL)</Text>
          <TextInput
            style={styles.notesInput}
            value={note}
            onChangeText={setNote}
            placeholder="Testing conditions, how you felt..."
            placeholderTextColor={colors.textMuted}
            multiline
          />

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveBtn, (filledCount === 0 || saving) && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={filledCount === 0 || saving}
          >
            <Text style={styles.saveBtnText}>
              {saving ? 'Saving...' : `Save Snapshot (${filledCount} metric${filledCount === 1 ? '' : 's'})`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ─── Metric Input Row ───────────────────────────── */

function MetricInput({
  config, value, onChange, expanded, onToggleDesc,
}: {
  config: TrendMetricConfig;
  value: string;
  onChange: (t: string) => void;
  expanded: boolean;
  onToggleDesc: () => void;
}) {
  const filled = !!value.trim();
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricTop}>
        <TouchableOpacity onPress={onToggleDesc} style={styles.metricLabelWrap}>
          <Ionicons
            name={config.icon}
            size={14}
            color={filled ? ACCENT : colors.textMuted}
          />
          <Text style={[styles.metricLabel, filled && styles.metricLabelFilled]}>
            {config.label}
          </Text>
          {config.unit ? <Text style={styles.metricUnit}>{config.unit}</Text> : null}
          <Ionicons
            name={expanded ? 'chevron-up' : 'information-circle-outline'}
            size={14}
            color={colors.textMuted}
          />
        </TouchableOpacity>
        <TextInput
          style={[styles.metricInput, filled && styles.metricInputFilled]}
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor={colors.textMuted}
        />
      </View>
      {expanded && (
        <Text style={styles.metricDesc}>{config.description}</Text>
      )}
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  filledBadge: { fontSize: 12, fontWeight: '700', color: ACCENT },
  content: { padding: 20, gap: 10, paddingBottom: 60 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4 },

  groupLabel: {
    fontSize: 11, fontWeight: '900', letterSpacing: 1.2,
    color: colors.textMuted, textTransform: 'uppercase', marginTop: 12, marginBottom: 2,
  },
  groupSub: {
    fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginBottom: 4,
  },

  metricRow: {
    borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 8,
  },
  metricTop: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6,
  },
  metricLabelWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  metricLabel: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, flex: 1 },
  metricLabelFilled: { color: colors.textPrimary, fontWeight: '700' },
  metricUnit: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  metricInput: {
    width: 90, backgroundColor: colors.surfaceElevated,
    borderWidth: 1, borderColor: colors.border, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    color: colors.textPrimary, fontSize: 18, fontWeight: '800', textAlign: 'center',
  },
  metricInputFilled: { borderColor: ACCENT, backgroundColor: ACCENT + '08' },
  metricDesc: {
    fontSize: 11, color: colors.textMuted, lineHeight: 16,
    paddingLeft: 20, paddingTop: 2, paddingBottom: 4,
  },

  siPreview: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, alignItems: 'center', gap: 6,
  },
  siLabel: { fontSize: 11, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.5 },
  siValue: { fontSize: 28, fontWeight: '900', color: colors.textPrimary },
  siBand: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  siBandText: { fontSize: 12, fontWeight: '800' },
  siBreakdown: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },

  notesInput: {
    backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, padding: 14, color: colors.textPrimary,
    fontSize: 15, minHeight: 80, textAlignVertical: 'top',
  },

  saveBtn: {
    backgroundColor: ACCENT, borderRadius: 10, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

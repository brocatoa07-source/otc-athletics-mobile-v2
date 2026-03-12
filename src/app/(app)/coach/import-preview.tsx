import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme';
import { commitImport } from '@/lib/program-import';
import { useImportStore } from '@/store/import.store';
import { useAuthStore } from '@/store/auth.store';
import type { ImportError, ParsedWorkout } from '@/lib/program-import';

export default function ImportPreviewScreen() {
  const parseResult = useImportStore((s) => s.parseResult);
  const clearImport = useImportStore((s) => s.clear);
  const userId = useAuthStore((s) => s.user?.id);

  const [description, setDescription] = useState('');
  const [committing, setCommitting] = useState(false);
  const [expandedErrors, setExpandedErrors] = useState(false);
  const [expandedUnknown, setExpandedUnknown] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));

  if (!parseResult) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.icon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Import Preview</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No import data. Go back and pick a file.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { summary, errors, unknownExercises, workouts, programTitle } = parseResult;
  const hasErrors = summary.errorCount > 0;

  // Group workouts by week
  const weekMap = new Map<number, ParsedWorkout[]>();
  for (const wo of workouts) {
    if (!weekMap.has(wo.weekNumber)) weekMap.set(wo.weekNumber, []);
    weekMap.get(wo.weekNumber)!.push(wo);
  }
  const weeks = [...weekMap.keys()].sort((a, b) => a - b);

  function toggleWeek(w: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      next.has(w) ? next.delete(w) : next.add(w);
      return next;
    });
  }

  async function handleCommit() {
    if (!userId || hasErrors) return;
    setCommitting(true);
    try {
      await commitImport(parseResult!, userId, description || undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      clearImport();
      Alert.alert('Success', 'Program imported successfully.', [
        { text: 'OK', onPress: () => router.replace('/(app)/coach/programs' as any) },
      ]);
    } catch (err) {
      Alert.alert('Import Failed', String(err));
    } finally {
      setCommitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { clearImport(); router.back(); }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.icon} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>IMPORT PREVIEW</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {programTitle}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>SUMMARY</Text>
          <View style={styles.statsRow}>
            <StatBadge label="Weeks" value={summary.totalWeeks} />
            <StatBadge label="Days" value={summary.totalDays} />
            <StatBadge label="Exercises" value={summary.totalExercises} />
            <StatBadge label="Rows" value={summary.totalRows} />
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>DESCRIPTION (OPTIONAL)</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note about this program..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        {/* Errors */}
        {errors.length > 0 && (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.collapseHeader}
              onPress={() => setExpandedErrors(!expandedErrors)}
            >
              <View style={styles.badgeRow}>
                <View style={[styles.badge, hasErrors ? styles.badgeError : styles.badgeWarning]}>
                  <Text style={styles.badgeText}>
                    {summary.errorCount} error{summary.errorCount !== 1 ? 's' : ''}
                  </Text>
                </View>
                {summary.warningCount > 0 && (
                  <View style={[styles.badge, styles.badgeWarning]}>
                    <Text style={styles.badgeText}>
                      {summary.warningCount} warning{summary.warningCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>
              <Ionicons
                name={expandedErrors ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
            {expandedErrors &&
              errors.map((e, i) => <ErrorRow key={i} error={e} />)}
          </View>
        )}

        {/* Unknown Exercises */}
        {unknownExercises.length > 0 && (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.collapseHeader}
              onPress={() => setExpandedUnknown(!expandedUnknown)}
            >
              <View style={styles.badgeRow}>
                <View style={[styles.badge, styles.badgeOrange]}>
                  <Text style={styles.badgeText}>
                    {unknownExercises.length} unknown exercise
                    {unknownExercises.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={expandedUnknown ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
            {expandedUnknown && (
              <>
                <Text style={styles.unknownHint}>
                  These exercises will be stored by name in the program.
                </Text>
                {unknownExercises.map((name, i) => (
                  <View key={i} style={styles.unknownRow}>
                    <Ionicons name="help-circle-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.unknownName}>{name}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* Workout Preview */}
        {weeks.map((week) => {
          const isOpen = expandedWeeks.has(week);
          const weekWorkouts = weekMap.get(week) ?? [];
          return (
            <View key={week} style={styles.card}>
              <TouchableOpacity
                style={styles.collapseHeader}
                onPress={() => toggleWeek(week)}
              >
                <Text style={styles.weekTitle}>WEEK {week}</Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.weekMeta}>
                    {weekWorkouts.length} day{weekWorkouts.length !== 1 ? 's' : ''}
                  </Text>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                  />
                </View>
              </TouchableOpacity>

              {isOpen &&
                weekWorkouts.map((wo, wIdx) => (
                  <View key={wIdx} style={styles.dayBlock}>
                    <View style={styles.dayHeader}>
                      <Text style={styles.dayLabel}>{wo.dayLabel}</Text>
                      <View
                        style={[
                          styles.dayTypeBadge,
                          wo.dayType === 'strength'
                            ? styles.dayTypeStrength
                            : styles.dayTypeAR,
                        ]}
                      >
                        <Text style={styles.dayTypeText}>{wo.dayType}</Text>
                      </View>
                    </View>

                    {/* Group items by category */}
                    {groupByCategory(wo.items).map(([cat, items]) => (
                      <View key={cat} style={styles.catGroup}>
                        <Text style={styles.catLabel}>{cat}</Text>
                        {items.map((item, iIdx) => (
                          <View key={iIdx} style={styles.exerciseRow}>
                            <Text style={styles.exerciseName} numberOfLines={1}>
                              {item.supersetGroup ? `${item.supersetGroup}. ` : ''}
                              {item.exerciseNameRaw}
                            </Text>
                            <Text style={styles.exerciseSets}>
                              {item.sets.length}×{item.sets[0]?.reps ?? ''}
                            </Text>
                            {item.sets[0]?.load && (
                              <Text style={styles.exerciseLoad}>
                                {item.sets[0].load}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.commitBtn, hasErrors && styles.commitBtnDisabled]}
          onPress={handleCommit}
          disabled={hasErrors || committing}
          activeOpacity={0.85}
        >
          {committing ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.black} />
              <Text style={styles.commitBtnText}>
                {hasErrors ? 'Fix Errors to Import' : 'Commit Import'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Helpers ──

function groupByCategory(
  items: { category: string; [k: string]: any }[],
): [string, typeof items][] {
  const map = new Map<string, typeof items>();
  for (const item of items) {
    if (!map.has(item.category)) map.set(item.category, []);
    map.get(item.category)!.push(item);
  }
  return [...map.entries()];
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ErrorRow({ error }: { error: ImportError }) {
  const isError = error.severity === 'error';
  return (
    <View style={styles.errorRow}>
      <Ionicons
        name={isError ? 'close-circle' : 'warning'}
        size={14}
        color={isError ? '#ef4444' : '#f59e0b'}
      />
      <Text style={styles.errorText}>
        {error.row > 0 ? `Row ${error.row}: ` : ''}
        {error.message}
      </Text>
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 100 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: { fontSize: 14, color: colors.textMuted },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginBottom: 10,
  },

  statsRow: { flexDirection: 'row', gap: 8 },
  statBadge: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  statLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 2 },

  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 14,
    minHeight: 48,
  },

  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeError: { backgroundColor: 'rgba(239,68,68,0.2)' },
  badgeWarning: { backgroundColor: 'rgba(245,158,11,0.2)' },
  badgeOrange: { backgroundColor: 'rgba(249,115,22,0.2)' },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },

  errorRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 10,
  },
  errorText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17 },

  unknownHint: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 4,
  },
  unknownRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  unknownName: { fontSize: 13, color: colors.textSecondary },

  weekTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  weekMeta: { fontSize: 12, color: colors.textMuted },

  dayBlock: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayLabel: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  dayTypeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  dayTypeStrength: { backgroundColor: 'rgba(29,185,84,0.2)' },
  dayTypeAR: { backgroundColor: 'rgba(59,130,246,0.2)' },
  dayTypeText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, textTransform: 'uppercase' },

  catGroup: { marginTop: 8 },
  catLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.textMuted,
    marginBottom: 4,
  },

  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  exerciseName: { flex: 1, fontSize: 13, color: colors.textSecondary },
  exerciseSets: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  exerciseLoad: { fontSize: 11, color: colors.textMuted, minWidth: 50, textAlign: 'right' },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 36,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  commitBtn: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  commitBtnDisabled: { opacity: 0.4 },
  commitBtnText: { fontSize: 16, fontWeight: '800', color: colors.black },
});

/**
 * 7-Day Plan Builder — Custom drill selection per day.
 *
 * Day 1-2: Tee, Day 3-4: Flips, Day 5: Overhand, Day 6: Machine, Day 7: Compete
 * Only shows drills tagged for the current topic AND the day's drill type.
 */

import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { getTopicById, getCategoryById, canLockIn, lockInTopicWithPlan } from '@/data/troubleshooting-engine';
import {
  getDrillsForTopicAndType, getDrillById,
  DAY_DRILL_TYPE, DAY_LABELS, DRILL_TYPE_META,
  type TaggedDrill,
} from '@/data/tagged-drills';

const ACCENT = '#E10600';

export default function PlanBuilderScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const topic = topicId ? getTopicById(topicId) : undefined;
  const category = topic ? getCategoryById(topic.categoryId) : undefined;

  const [selections, setSelections] = useState<Record<number, string>>({});
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [locking, setLocking] = useState(false);

  if (!topic || !category) return null;

  const allDaysSelected = [1, 2, 3, 4, 5, 6, 7].every((d) => !!selections[d]);

  function selectDrill(day: number, drillId: string) {
    setSelections((prev) => ({ ...prev, [day]: drillId }));
    setExpandedDay(null);
  }

  async function handleLock() {
    const check = await canLockIn();
    if (!check.allowed && !check.canSwitch) {
      Alert.alert('Already Locked In', check.reason ?? 'You have an active 7-day block.');
      return;
    }
    if (!allDaysSelected) {
      Alert.alert('Incomplete Plan', 'Select a drill for every day before locking in.');
      return;
    }

    Alert.alert(
      'Lock Your 7-Day Plan',
      'You are about to choose your focus for the next 7 days.\n\nTo improve, you must work on one problem at a time. If you switch every day, you will not improve.\n\nOnce you lock this plan, all other topics will be locked for 7 days.\n\nSerious players fix one thing at a time.\n\nDo you want to commit to this for the next 7 days?',
      [
        { text: 'No — Go Back', style: 'cancel' },
        {
          text: 'Yes — Lock My Focus',
          onPress: async () => {
            setLocking(true);
            await lockInTopicWithPlan(topic!.id, selections);
            router.back();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: category.color }]}>BUILD YOUR PLAN</Text>
          <Text style={styles.headerTitle}>{topic.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Coaching message */}
        <View style={styles.coachCard}>
          <Ionicons name="bulb" size={16} color="#f59e0b" />
          <Text style={styles.coachText}>
            Don't pick drills you're comfortable with. Pick drills that actually fix your problem. This week is about improvement, not feeling good.
          </Text>
        </View>

        {/* Day cards */}
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const drillType = DAY_DRILL_TYPE[day];
          const typeMeta = DRILL_TYPE_META[drillType];
          const selectedDrillId = selections[day];
          const selectedDrill = selectedDrillId ? getDrillById(selectedDrillId) : null;
          const isExpanded = expandedDay === day;
          const availableDrills = getDrillsForTopicAndType(topic!.id, drillType);

          return (
            <View key={day}>
              <TouchableOpacity
                style={[styles.dayCard, selectedDrill && { borderColor: typeMeta.color + '40' }]}
                onPress={() => setExpandedDay(isExpanded ? null : day)}
                activeOpacity={0.8}
              >
                <View style={[styles.dayBadge, { backgroundColor: typeMeta.color + '15' }]}>
                  <Text style={[styles.dayBadgeText, { color: typeMeta.color }]}>D{day}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dayLabel}>{DAY_LABELS[day]}</Text>
                  <View style={styles.dayTypeRow}>
                    <Ionicons name={typeMeta.icon as any} size={10} color={typeMeta.color} />
                    <Text style={[styles.dayTypeText, { color: typeMeta.color }]}>{typeMeta.label}</Text>
                  </View>
                  {selectedDrill && (
                    <Text style={styles.selectedDrillName}>{selectedDrill.name}</Text>
                  )}
                </View>
                {selectedDrill ? (
                  <Ionicons name="checkmark-circle" size={18} color={typeMeta.color} />
                ) : (
                  <Text style={[styles.selectText, { color: typeMeta.color }]}>Select</Text>
                )}
              </TouchableOpacity>

              {/* Drill picker dropdown */}
              {isExpanded && (
                <View style={styles.pickerWrap}>
                  {availableDrills.length === 0 ? (
                    <Text style={styles.noDrills}>No drills tagged for this day type yet.</Text>
                  ) : (
                    availableDrills.map((drill) => (
                      <TouchableOpacity
                        key={drill.id}
                        style={[styles.drillOption, selections[day] === drill.id && { borderColor: typeMeta.color + '50' }]}
                        onPress={() => selectDrill(day, drill.id)}
                        activeOpacity={0.8}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.drillName}>{drill.name}</Text>
                          <Text style={styles.drillDesc}>{drill.shortDescription}</Text>
                          <Text style={styles.drillFixes}>{drill.whatItFixes}</Text>
                        </View>
                        {selections[day] === drill.id && (
                          <Ionicons name="checkmark-circle" size={16} color={typeMeta.color} />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Lock CTA */}
        <TouchableOpacity
          style={[styles.lockBtn, (!allDaysSelected || locking) && { opacity: 0.4 }]}
          onPress={handleLock}
          disabled={!allDaysSelected || locking}
          activeOpacity={0.85}
        >
          <Ionicons name="lock-closed" size={18} color="#fff" />
          <Text style={styles.lockBtnText}>
            {locking ? 'Locking...' : allDaysSelected ? 'Lock My 7-Day Plan' : `Select drills for all 7 days (${Object.keys(selections).length}/7)`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 10 },

  coachCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.md,
  },
  coachText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17, fontStyle: 'italic' },

  dayCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12,
  },
  dayBadge: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  dayBadgeText: { fontSize: 12, fontWeight: '900' },
  dayLabel: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  dayTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  dayTypeText: { fontSize: 10, fontWeight: '700' },
  selectedDrillName: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, marginTop: 2 },
  selectText: { fontSize: 12, fontWeight: '700' },

  pickerWrap: { paddingLeft: 42, gap: 6, marginBottom: 4 },
  noDrills: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic', padding: 8 },
  drillOption: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  drillName: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  drillDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  drillFixes: { fontSize: 10, color: colors.textSecondary, fontStyle: 'italic', marginTop: 2 },

  lockBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, backgroundColor: ACCENT, marginTop: 8,
  },
  lockBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

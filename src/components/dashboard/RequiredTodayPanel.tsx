import { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, Pressable, Switch, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useMyProgram } from '@/hooks/useMyProgram';
import { useReadiness } from '@/hooks/useReadiness';
import { useAccountability } from '@/hooks/useAccountability';
import {
  useRequiredTodayConfig,
  REQUIRED_TODAY_ORDER,
  REQUIRED_TODAY_META,
  type RequiredTodayItemKey,
} from '@/hooks/useRequiredTodayConfig';

export function RequiredTodayPanel() {
  const [modalVisible, setModalVisible] = useState(false);

  const { enabled, toggle } = useRequiredTodayConfig();
  const { todayPlan, completedToday } = useMyProgram();
  const { readiness } = useReadiness();
  const { skillWorkDoneToday, habitsDoneToday, addonsDoneToday, mentalDoneToday, journalDoneToday } = useAccountability();

  const hasTrainingToday = todayPlan?.type === 'training';
  const readinessDone   = !!readiness;

  const completions: Record<RequiredTodayItemKey, boolean> = {
    readiness: readinessDone,
    training:  completedToday,
    skillWork: skillWorkDoneToday,
    mental:    mentalDoneToday,
    journal:   journalDoneToday,
    habits:    habitsDoneToday,
    addons:    addonsDoneToday,
  };

  // Only show items that are enabled; hide 'training' on rest days
  const visibleItems = REQUIRED_TODAY_ORDER.filter((key) => {
    if (!enabled[key]) return false;
    if (key === 'training' && !hasTrainingToday) return false;
    return true;
  });

  const doneCount  = visibleItems.filter((k) => completions[k]).length;
  const totalCount = visibleItems.length;

  return (
    <>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Required Today</Text>
          <View style={styles.headerRight}>
            <Text style={styles.progress}>{doneCount} / {totalCount}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="options-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Items */}
        {visibleItems.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No items selected — tap the icon to customize</Text>
          </View>
        ) : (
          visibleItems.map((key, idx) => {
            const meta = REQUIRED_TODAY_META[key];
            const done = completions[key];
            return (
              <TouchableOpacity
                key={key}
                style={[styles.row, idx < visibleItems.length - 1 && styles.rowBorder]}
                onPress={() => router.push(meta.route as any)}
                activeOpacity={0.75}
              >
                <View style={[styles.iconWrap, done && styles.iconWrapDone]}>
                  <Ionicons
                    name={meta.icon as any}
                    size={18}
                    color={done ? '#22c55e' : colors.textSecondary}
                  />
                </View>
                <Text style={[styles.label, done && styles.labelDone]}>{meta.label}</Text>
                {done ? (
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                ) : (
                  <View style={styles.emptyCircle} />
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Customize Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Customize Daily Standard</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sheetNote}>
            Choose which habits make up your daily standard. Your Standard Engine score and Next Up card will match exactly what you enable here.
          </Text>

          {REQUIRED_TODAY_ORDER.map((key) => {
            const meta = REQUIRED_TODAY_META[key];
            const isOn = enabled[key];
            return (
              <View key={key} style={styles.toggleRow}>
                <View style={[styles.toggleIcon, { backgroundColor: isOn ? '#22c55e15' : colors.surfaceElevated }]}>
                  <Ionicons
                    name={meta.icon as any}
                    size={18}
                    color={isOn ? '#22c55e' : colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.toggleLabel, !isOn && styles.toggleLabelOff]}>
                    {meta.label}
                  </Text>
                  <Text style={styles.toggleDesc}>{meta.description}</Text>
                </View>
                <Switch
                  value={isOn}
                  onValueChange={() => toggle(key)}
                  trackColor={{ true: '#22c55e', false: colors.border }}
                  thumbColor={colors.white}
                />
              </View>
            );
          })}

          <View style={{ height: 32 }} />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  progress: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDone: { backgroundColor: '#22c55e12' },
  label: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  labelDone: { color: colors.textSecondary },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  emptyRow: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  handle: {
    width: 38, height: 4, borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 10, marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  sheetNote: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  toggleLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  toggleLabelOff: { color: colors.textMuted },
  toggleDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
});

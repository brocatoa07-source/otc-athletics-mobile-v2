import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { POSITION_META, type BaseballPosition } from '@/data/strength-profile';

const ACCENT = '#1DB954';

const POSITIONS: { key: BaseballPosition; meta: typeof POSITION_META[BaseballPosition] }[] = [
  { key: 'outfielder', meta: POSITION_META.outfielder },
  { key: 'infielder', meta: POSITION_META.infielder },
  { key: 'catcher', meta: POSITION_META.catcher },
];

export default function PositionSelectScreen() {
  const [selected, setSelected] = useState<BaseballPosition | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>STRENGTH SETUP</Text>
          <Text style={styles.headerTitle}>Select Your Position</Text>
        </View>
        <Text style={styles.stepBadge}>Step 1 of 2</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Your position shapes which athletic qualities we prioritize in your program.
        </Text>

        {POSITIONS.map(({ key, meta }) => {
          const isSelected = selected === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.optionCard,
                isSelected && { borderColor: ACCENT, backgroundColor: ACCENT + '08' },
              ]}
              onPress={() => setSelected(key)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.optionIcon,
                { backgroundColor: isSelected ? ACCENT + '20' : colors.surfaceElevated },
              ]}>
                <Ionicons
                  name={meta.icon as any}
                  size={28}
                  color={isSelected ? ACCENT : colors.textMuted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionLabel, isSelected && { color: ACCENT }]}>
                  {meta.label}
                </Text>
                <Text style={styles.optionDesc}>{meta.description}</Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color={ACCENT} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
          <Text style={styles.noteText}>
            Pick the position you play most. If you play multiple positions, choose the one that demands the most from your body.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.nextBtn, !selected && { opacity: 0.4 }]}
          onPress={() => {
            if (!selected) return;
            router.push({
              pathname: '/(app)/training/sc/deficiency-select' as any,
              params: { position: selected },
            });
          }}
          activeOpacity={0.85}
          disabled={!selected}
        >
          <Text style={styles.nextBtnText}>Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  stepBadge: { fontSize: 11, fontWeight: '700', color: colors.textMuted },

  content: { padding: 16, paddingBottom: 100, gap: 12 },

  intro: {
    fontSize: 14, fontWeight: '600', color: colors.textSecondary, lineHeight: 21,
  },

  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.lg, padding: 18,
  },
  optionIcon: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  optionLabel: { fontSize: 17, fontWeight: '900', color: colors.textPrimary },
  optionDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 3 },

  noteCard: {
    flexDirection: 'row', gap: 10, padding: 14,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderRadius: radius.md,
  },
  noteText: { flex: 1, fontSize: 13, color: colors.textMuted, lineHeight: 19 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, paddingBottom: 32,
    backgroundColor: colors.bg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: ACCENT, paddingVertical: 16, borderRadius: radius.md,
  },
  nextBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
});

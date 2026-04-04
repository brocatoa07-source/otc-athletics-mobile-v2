import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { saveMentalCheckIn, getTodayCheckIn, type MentalCheckIn } from '@/features/mental/mentalProgression';

const ACCENT = '#a855f7';

const METRICS = [
  { key: 'confidence' as const, label: 'Confidence', icon: 'shield-checkmark', question: 'How confident do you feel right now?' },
  { key: 'focus' as const, label: 'Focus', icon: 'eye', question: 'How locked in is your focus today?' },
  { key: 'emotionalControl' as const, label: 'Emotional Control', icon: 'pulse', question: 'How well are you managing emotions today?' },
];

export default function MentalCheckInScreen() {
  const [values, setValues] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);
  const [existing, setExisting] = useState<MentalCheckIn | null>(null);

  useFocusEffect(
    useCallback(() => {
      getTodayCheckIn().then((c) => {
        if (c) {
          setExisting(c);
          setValues({ confidence: c.confidence, focus: c.focus, emotionalControl: c.emotionalControl });
        }
      });
    }, []),
  );

  function setRating(key: string, val: number) {
    setValues(prev => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    const today = new Date().toISOString().slice(0, 10);
    await saveMentalCheckIn({
      date: today,
      confidence: values.confidence ?? 5,
      focus: values.focus ?? 5,
      emotionalControl: values.emotionalControl ?? 5,
    });
    setSaved(true);
  }

  const allSet = METRICS.every(m => values[m.key] != null);

  if (saved) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
          <Text style={styles.doneTitle}>Check-In Saved</Text>
          <Text style={styles.doneSub}>Your mental metrics are updated.</Text>
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: ACCENT }]} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>Back to Mental Vault</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL</Text>
          <Text style={styles.headerTitle}>Mental Check-In</Text>
        </View>
      </View>

      <View style={styles.content}>
        {existing && (
          <View style={styles.existingBanner}>
            <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
            <Text style={styles.existingText}>You checked in today. Updating will overwrite.</Text>
          </View>
        )}

        {METRICS.map((m) => (
          <View key={m.key} style={styles.metricBlock}>
            <View style={styles.metricHeader}>
              <Ionicons name={m.icon as any} size={16} color={ACCENT} />
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
            <Text style={styles.metricQuestion}>{m.question}</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.ratingBtn,
                    values[m.key] === n && { backgroundColor: ACCENT, borderColor: ACCENT },
                  ]}
                  onPress={() => setRating(m.key, n)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.ratingText,
                    values[m.key] === n && { color: '#fff' },
                  ]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: ACCENT }, !allSet && { opacity: 0.4 }]}
          onPress={handleSave}
          disabled={!allSet}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark" size={18} color="#fff" />
          <Text style={styles.saveBtnText}>Save Check-In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  doneTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  doneSub: { fontSize: 13, color: colors.textMuted },
  doneBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.md, marginTop: 12 },
  doneBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 16, gap: 20 },

  existingBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    padding: 10, backgroundColor: '#22c55e10', borderRadius: radius.sm,
  },
  existingText: { fontSize: 11, color: '#22c55e', fontWeight: '600' },

  metricBlock: { gap: 8 },
  metricHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricLabel: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  metricQuestion: { fontSize: 12, color: colors.textMuted },

  ratingRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  ratingBtn: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  ratingText: { fontSize: 12, fontWeight: '800', color: colors.textMuted },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: radius.md, marginTop: 8,
  },
  saveBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});

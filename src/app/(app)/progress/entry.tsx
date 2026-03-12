import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { Colors } from '@/constants/colors';
import { METRIC_CONFIG, type MetricType } from '@/types/progress';

const ALL_METRICS = Object.keys(METRIC_CONFIG) as MetricType[];

export default function ProgressEntry() {
  const { metric: defaultMetric } = useLocalSearchParams<{ metric?: string }>();
  const athlete = useAuthStore((s) => s.athlete);
  const qc = useQueryClient();

  const [selectedMetric, setSelectedMetric] = useState<MetricType>(
    (defaultMetric as MetricType) || ALL_METRICS[0]
  );
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  const config = METRIC_CONFIG[selectedMetric];

  const mutation = useMutation({
    mutationFn: async () => {
      const numVal = parseFloat(value);
      if (isNaN(numVal)) throw new Error('Enter a valid number');
      if (!athlete) throw new Error('No profile found');

      const { error } = await supabase.from('athlete_progress').insert({
        athlete_id: athlete.id,
        metric_type: selectedMetric,
        value: numVal,
        notes: notes.trim() || null,
        recorded_at: new Date().toISOString(),
      });

      if (error) {
        if (error.code === '42P01' || error.message?.includes('not exist') || error.message?.includes('Not Found')) {
          throw new Error('Progress tracking table not set up. Ask your coach to run the latest database migration.');
        }
        throw new Error(error.message || 'Failed to save. Please try again.');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['progress', athlete?.id] });
      Alert.alert('Logged', 'Progress entry saved.', [
        { text: 'Log Another', onPress: () => { setValue(''); setNotes(''); } },
        { text: 'Done', onPress: () => router.back() },
      ]);
    },
    onError: (err: Error) => Alert.alert('Error', err.message),
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Progress</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionLabel}>Select Metric</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricScroll}>
            {ALL_METRICS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.metricPill, selectedMetric === m && styles.metricPillActive]}
                onPress={() => setSelectedMetric(m)}
              >
                <Ionicons
                  name={METRIC_CONFIG[m].icon as keyof typeof Ionicons.glyphMap}
                  size={14}
                  color={selectedMetric === m ? '#fff' : Colors.textMuted}
                />
                <Text style={[styles.metricPillText, selectedMetric === m && styles.metricPillTextActive]}>
                  {METRIC_CONFIG[m].label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionLabel}>{config.label} ({config.unit})</Text>
          <View style={styles.valueRow}>
            <TextInput
              style={styles.valueInput}
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor={Colors.textMuted}
              autoFocus
            />
            <Text style={styles.unit}>{config.unit}</Text>
          </View>

          <Text style={styles.sectionLabel}>Notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Context, conditions, how you felt..."
            placeholderTextColor={Colors.textMuted}
            multiline
          />

          <TouchableOpacity
            style={[styles.button, (!value || mutation.isPending) && styles.buttonDisabled]}
            onPress={() => mutation.mutate()}
            disabled={!value || mutation.isPending}
          >
            <Text style={styles.buttonText}>
              {mutation.isPending ? 'Saving...' : 'Save Entry'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  content: { padding: 20, gap: 12 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  metricScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  metricPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  metricPillText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  metricPillTextActive: { color: '#fff' },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  valueInput: {
    flex: 1,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  unit: { fontSize: 16, color: Colors.textMuted, fontWeight: '600', minWidth: 30 },
  notesInput: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    color: Colors.textPrimary,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

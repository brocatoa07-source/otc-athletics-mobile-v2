import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/common/Card';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TodayFocusCard() {
  const athlete = useAuthStore((s) => s.athlete);

  const { data: program, isLoading } = useQuery({
    queryKey: ['assigned-program', athlete?.id],
    enabled: !!athlete?.id,
    queryFn: async () => {
      // Try assigned program first
      const { data: assigned } = await supabase
        .from('program_assignments')
        .select('*, sc_programs(*, sc_exercises(*))')
        .eq('athlete_id', athlete!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (assigned?.sc_programs) return assigned.sc_programs;

      // Fall back to tier-based program
      const tierVal = athlete!.tier ?? 'WALK';
      const { data: tierProgram } = await supabase
        .from('sc_programs')
        .select('*, sc_exercises(*)')
        .eq('assigned_to_tier', tierVal === 'SINGLE' ? 'SINGLE' : 'DOUBLE')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return tierProgram;
    },
  });

  const today = DAYS[new Date().getDay()];
  const exerciseCount = program?.sc_exercises?.length ?? 0;

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <ActivityIndicator color={Colors.primary} />
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dayLabel}>{today.toUpperCase()}</Text>
          <Text style={styles.title}>Today's Training</Text>
        </View>
        <Ionicons name="barbell" size={24} color={Colors.primary} />
      </View>

      {program ? (
        <>
          <Text style={styles.programName}>{program.title}</Text>
          <Text style={styles.detail}>{exerciseCount} exercises assigned</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(`/(app)/training/sc/${program.id}` as any)}
          >
            <Text style={styles.buttonText}>Start Session</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.detail}>No training assigned yet. Check the Training Lab.</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  dayLabel: { fontSize: 11, fontWeight: '800', color: Colors.primary, letterSpacing: 2 },
  title: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  programName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  detail: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14 },
  button: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

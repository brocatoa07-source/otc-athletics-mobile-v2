/**
 * Diagnostic Debug Panel — DEV ONLY
 *
 * Shows the current state of all diagnostic submissions, generated results,
 * gate state, and AsyncStorage cache. Accessible from the profile screen.
 */

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius } from '@/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { getGateState, type GateState, LOCKED_GATE_STATE } from '@/lib/gating/gatingEngine';
import { CACHE_KEYS, CANONICAL_PAIRS } from '@/lib/gating/diagnosticConstants';
import { deleteAllSubmissions } from '@/lib/gating/diagnosticService';

interface SubmissionRow {
  diagnostic_type: string;
  vault_type: string;
  submitted_at: string;
  updated_at: string;
  result_payload: Record<string, unknown>;
}

export default function DiagnosticDebugScreen() {
  const user = useAuthStore((s) => s.user);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [mentalProfile, setMentalProfile] = useState<Record<string, unknown> | null>(null);
  const [strengthProfileData, setStrengthProfileData] = useState<Record<string, unknown> | null>(null);
  const [gate, setGate] = useState<GateState>(LOCKED_GATE_STATE);
  const [cacheState, setCacheState] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      // Fetch submissions
      const { data: subs } = await supabase
        .from('diagnostic_submissions')
        .select('diagnostic_type, vault_type, submitted_at, updated_at, result_payload')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });
      setSubmissions((subs ?? []) as SubmissionRow[]);

      // Fetch mental profile
      const { data: mp } = await supabase
        .from('mental_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      setMentalProfile(mp as Record<string, unknown> | null);

      // Fetch strength profile
      const { data: sp } = await supabase
        .from('strength_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      setStrengthProfileData(sp as Record<string, unknown> | null);

      // Fetch gate state
      const gs = await getGateState(supabase, user.id);
      setGate(gs);

      // Read cache keys
      const cache: Record<string, string | null> = {};
      for (const [label, key] of Object.entries(CACHE_KEYS)) {
        cache[label] = await AsyncStorage.getItem(key);
      }
      setCacheState(cache);
    } catch (err: any) {
      console.error('[diagnostic-debug] refresh error:', err?.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  async function handleReset() {
    if (!user?.id) return;
    Alert.alert(
      'Reset All Diagnostics?',
      'This will delete all diagnostic submissions and the mental profile. Cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await deleteAllSubmissions(supabase, user.id);
            await supabase.from('mental_profiles').delete().eq('user_id', user.id);
            for (const key of Object.values(CACHE_KEYS)) {
              await AsyncStorage.removeItem(key);
            }
            refresh();
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
        <Text style={styles.headerTitle}>Diagnostic Debug</Text>
        <TouchableOpacity onPress={refresh} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading && <Text style={styles.loading}>Loading...</Text>}

        {/* Gate State */}
        <Text style={styles.sectionLabel}>GATE STATE</Text>
        <View style={styles.card}>
          <Row label="Mental Unlocked" value={gate.mentalUnlocked ? 'YES' : 'NO'} color={gate.mentalUnlocked ? '#22c55e' : '#ef4444'} />
          <Row label="SC Unlocked" value={gate.scUnlocked ? 'YES' : 'NO'} color={gate.scUnlocked ? '#22c55e' : '#ef4444'} />
          <Row label="Hitting Unlocked" value={gate.hittingUnlocked ? 'YES' : 'NO'} color={gate.hittingUnlocked ? '#22c55e' : '#ef4444'} />
          <Row label="Archetype Done" value={gate.mental.archetypeDone ? 'YES' : 'NO'} color={gate.mental.archetypeDone ? '#22c55e' : '#ef4444'} />
          <Row label="Identity Done" value={gate.mental.identityDone ? 'YES' : 'NO'} color={gate.mental.identityDone ? '#22c55e' : '#ef4444'} />
          <Row label="Habits Done" value={gate.mental.habitsDone ? 'YES' : 'NO'} color={gate.mental.habitsDone ? '#22c55e' : '#ef4444'} />
          <Row label="SC Mover Done" value={gate.sc.moverDone ? 'YES' : 'NO'} color={gate.sc.moverDone ? '#22c55e' : '#ef4444'} />
          <Row label="Mental Complete" value={`${gate.mental.completedCount}/${gate.mental.total}`} />
        </View>

        {/* Submissions */}
        <Text style={styles.sectionLabel}>DIAGNOSTIC SUBMISSIONS ({submissions.length})</Text>
        {submissions.length === 0 ? (
          <Text style={styles.empty}>No submissions found</Text>
        ) : (
          submissions.map((s, i) => (
            <View key={i} style={styles.card}>
              <Row label="Vault" value={s.vault_type} />
              <Row label="Type" value={s.diagnostic_type} />
              <Row label="Submitted" value={new Date(s.submitted_at).toLocaleString()} />
              <Row label="Updated" value={new Date(s.updated_at).toLocaleString()} />
              <Text style={styles.payloadLabel}>Payload Keys:</Text>
              <Text style={styles.payloadText}>
                {Object.keys(s.result_payload ?? {}).join(', ') || '(empty)'}
              </Text>
            </View>
          ))
        )}

        {/* Canonical Pairs Check */}
        <Text style={styles.sectionLabel}>CANONICAL PAIRS vs SUBMISSIONS</Text>
        <View style={styles.card}>
          {CANONICAL_PAIRS.map((pair) => {
            const found = submissions.some(
              (s) => s.vault_type === pair.vault && s.diagnostic_type === pair.diagnostic,
            );
            return (
              <Row
                key={`${pair.vault}/${pair.diagnostic}`}
                label={`${pair.vault}/${pair.diagnostic}`}
                value={found ? 'SUBMITTED' : 'MISSING'}
                color={found ? '#22c55e' : '#f59e0b'}
              />
            );
          })}
        </View>

        {/* Mental Profile */}
        <Text style={styles.sectionLabel}>MENTAL PROFILE</Text>
        <View style={styles.card}>
          {mentalProfile ? (
            <>
              <Row label="Archetype" value={String((mentalProfile as any)?.archetype ?? 'N/A')} />
              <Row label="ISS" value={String((mentalProfile as any)?.iss ?? 'N/A')} />
              <Row label="HSS" value={String((mentalProfile as any)?.hss ?? 'N/A')} />
              <Row label="Updated" value={
                (mentalProfile as any)?.updated_at
                  ? new Date((mentalProfile as any).updated_at).toLocaleString()
                  : 'N/A'
              } />
            </>
          ) : (
            <Text style={styles.empty}>No mental profile generated</Text>
          )}
        </View>

        {/* Strength Profile */}
        <Text style={styles.sectionLabel}>STRENGTH PROFILE</Text>
        <View style={styles.card}>
          {strengthProfileData ? (
            <>
              <Row label="Mover Type" value={String((strengthProfileData as any)?.primary_mover_type ?? 'N/A')} />
              <Row label="Movement" value={String((strengthProfileData as any)?.movement_profile ?? 'N/A')} />
              <Row label="Force-Velocity" value={String((strengthProfileData as any)?.force_velocity_profile ?? 'N/A')} />
              <Row label="Conditioning" value={String((strengthProfileData as any)?.conditioning_bias ?? 'N/A')} />
              <Row label="Generated" value={
                (strengthProfileData as any)?.generated_at
                  ? new Date((strengthProfileData as any).generated_at).toLocaleString()
                  : 'N/A'
              } />
            </>
          ) : (
            <Text style={styles.empty}>No strength profile generated</Text>
          )}
        </View>

        {/* AsyncStorage Cache */}
        <Text style={styles.sectionLabel}>ASYNCSTORAGE CACHE</Text>
        <View style={styles.card}>
          {Object.entries(cacheState).map(([label, value]) => (
            <Row
              key={label}
              label={label}
              value={value ? `${value.slice(0, 40)}${value.length > 40 ? '...' : ''}` : '(empty)'}
              color={value ? '#22c55e' : colors.textMuted}
            />
          ))}
        </View>

        {/* Reset */}
        {__DEV__ && (
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7}>
            <Ionicons name="trash" size={16} color="#ef4444" />
            <Text style={styles.resetBtnText}>Reset All Diagnostics (DEV)</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, color ? { color } : undefined]}>{value}</Text>
    </View>
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
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  refreshBtn: { padding: 6 },
  content: { padding: 16, paddingBottom: 60, gap: 10 },
  loading: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted, marginTop: 8 },
  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 10, gap: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2 },
  rowLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  rowValue: { fontSize: 11, fontWeight: '800', color: colors.textPrimary },
  payloadLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 4 },
  payloadText: { fontSize: 10, color: colors.textMuted, fontFamily: 'monospace' },
  empty: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', padding: 8 },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderWidth: 1, borderColor: '#ef444440',
    borderRadius: radius.md, marginTop: 8,
  },
  resetBtnText: { fontSize: 13, fontWeight: '800', color: '#ef4444' },
});

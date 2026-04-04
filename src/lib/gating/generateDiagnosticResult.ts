/**
 * Generate Diagnostic Result — Centralized profile/result generation service.
 *
 * After all required diagnostics for a vault are submitted,
 * this service reads the submissions, scores them, and writes
 * the generated profile/result to the appropriate table.
 *
 * Currently handles:
 *   - Mental vault → mental_profiles table
 *
 * Hitting and SC vaults store results directly in diagnostic_submissions
 * (no separate generation step needed — the quiz result IS the profile).
 */

import { SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VAULT, DIAGNOSTIC, CACHE_KEYS } from './diagnosticConstants';
import { logDiagnosticEvent, startTimer } from './diagnosticEvents';
import {
  scoreArchetype,
  scoreIdentity,
  scoreHabits,
  buildMentalProfilePayload,
  type ArchetypeResult,
} from '@/utils/mentalDiagnosticScoring';
import type { MentalStruggle } from '@/data/mental-struggles-data';
import { buildStrengthProfile } from '@/features/strength/services/buildStrengthProfile';
import type { ScoringSignal } from '@/features/strength/types/strengthProfile';

// ── Mental archetype → legacy struggle mapping ─────────────────────────────

const ARCHETYPE_TO_STRUGGLE: Record<string, MentalStruggle> = {
  reactor:     'emotional_frustration',
  overthinker: 'overthinking',
  avoider:     'fear_of_failure',
  performer:   'pregame_nerves',
  doubter:     'confidence_drop',
  driver:      'burnout',
};

function deriveLegacyStruggles(archetype: ArchetypeResult): {
  primary: MentalStruggle;
  secondary: MentalStruggle;
} {
  const primary = ARCHETYPE_TO_STRUGGLE[archetype.primary] ?? 'overthinking';
  const secondary = archetype.secondary
    ? (ARCHETYPE_TO_STRUGGLE[archetype.secondary] ?? 'focus_loss')
    : 'focus_loss';
  return { primary, secondary };
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface GenerateResultParams {
  supabase: SupabaseClient;
  userId: string;
  vaultType: string;
}

export interface GenerateResultReturn {
  success: boolean;
  error?: string;
}

// ── Main generation function ────────────────────────────────────────────────

/**
 * Generate the profile/result for a vault after all diagnostics are complete.
 *
 * For mental vault: reads all 3 submissions, scores, writes to mental_profiles.
 * For hitting/sc: no-op (results stored in diagnostic_submissions directly).
 */
export async function generateDiagnosticResult(
  params: GenerateResultParams,
): Promise<GenerateResultReturn> {
  const { supabase, userId, vaultType } = params;

  logDiagnosticEvent({ event: 'profile_generation_started', vault: vaultType, userId: userId.slice(0, 8) });

  try {
    if (vaultType === VAULT.MENTAL) {
      return await generateMentalProfile(supabase, userId);
    }

    if (vaultType === VAULT.SC) {
      return await generateStrengthProfile(supabase, userId);
    }

    // Hitting has no diagnostics
    return { success: true };
  } catch (err: any) {
    logDiagnosticEvent({ event: 'profile_generation_failed', vault: vaultType, error: err?.message ?? String(err) });
    return { success: false, error: err?.message ?? 'Unknown error during result generation' };
  }
}

// ── Mental profile generation ───────────────────────────────────────────────

async function generateMentalProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<GenerateResultReturn> {
  const elapsed = startTimer();
  logDiagnosticEvent({ event: 'profile_generation_started', vault: 'mental', userId: userId.slice(0, 8) });

  // 1. Fetch all 3 mental diagnostic submissions
  const { data: submissions, error: fetchErr } = await supabase
    .from('diagnostic_submissions')
    .select('diagnostic_type, result_payload')
    .eq('user_id', userId)
    .eq('vault_type', VAULT.MENTAL);

  if (fetchErr || !submissions) {
    const msg = fetchErr?.message ?? 'Could not fetch mental diagnostic submissions';
    logDiagnosticEvent({ event: 'profile_generation_failed', vault: 'mental', error: msg, durationMs: elapsed() });
    return { success: false, error: msg };
  }

  // 2. Extract payloads by type
  const byType: Record<string, any> = {};
  for (const s of submissions) {
    byType[s.diagnostic_type] = s.result_payload;
  }

  const archetypePayload = byType[DIAGNOSTIC.ARCHETYPE];
  const identityPayload = byType[DIAGNOSTIC.IDENTITY];
  const habitsPayload = byType[DIAGNOSTIC.HABITS];

  if (!archetypePayload || !identityPayload || !habitsPayload) {
    const missing = [
      !archetypePayload && 'archetype',
      !identityPayload && 'identity',
      !habitsPayload && 'habits',
    ].filter(Boolean);
    const msg = `Missing diagnostic data: ${missing.join(', ')}. Please retake missing diagnostics.`;
    logDiagnosticEvent({ event: 'profile_generation_failed', vault: 'mental', error: msg, durationMs: elapsed() });
    return { success: false, error: msg };
  }

  // 3. Score from stored answers (or use pre-scored results)
  const archetypeResult = archetypePayload.answers
    ? scoreArchetype(archetypePayload.answers)
    : archetypePayload.scored;
  const identityResult = identityPayload.answers
    ? scoreIdentity(identityPayload.answers)
    : identityPayload.scored;
  const habitsResult = habitsPayload.answers
    ? scoreHabits(habitsPayload.answers)
    : habitsPayload.scored;

  if (!archetypeResult || !identityResult || !habitsResult) {
    logDiagnosticEvent({ event: 'profile_generation_failed', vault: 'mental', error: 'Scoring returned null', durationMs: elapsed() });
    return { success: false, error: 'Diagnostic data is corrupted. Please retake diagnostics.' };
  }

  // 4. Build profile payload
  const profilePayload = buildMentalProfilePayload(
    archetypeResult,
    identityResult,
    habitsResult,
  );


  // 5. Upsert to mental_profiles
  const { error: upsertErr } = await supabase
    .from('mental_profiles')
    .upsert(
      {
        user_id: userId,
        ...profilePayload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

  if (upsertErr) {
    logDiagnosticEvent({ event: 'profile_generation_failed', vault: 'mental', error: upsertErr.message, durationMs: elapsed() });
    return { success: false, error: `Failed to save mental profile: ${upsertErr.message}` };
  }

  logDiagnosticEvent({ event: 'profile_generation_succeeded', vault: 'mental', durationMs: elapsed(), metadata: { archetype: archetypeResult.primary } });

  // 6. Cache scores locally (best-effort)
  try {
    if (profilePayload.iss != null || profilePayload.hss != null) {
      await AsyncStorage.setItem(CACHE_KEYS.mentalProfileScores, JSON.stringify({
        iss: profilePayload.iss ?? null,
        hss: profilePayload.hss ?? null,
      }));
    }
    const legacyStruggles = deriveLegacyStruggles(archetypeResult);
    await AsyncStorage.setItem(CACHE_KEYS.mentalStruggles, JSON.stringify(legacyStruggles));
    await AsyncStorage.removeItem(CACHE_KEYS.mentalDailyWork);
    // Cache OK
  } catch {
    // Cache write is best-effort
  }

  return { success: true };
}

// ── Strength profile generation (v1 prescription engine) ────────────────────

async function generateStrengthProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<GenerateResultReturn> {
  console.log('[generateStrengthProfile] START');

  // 1. Fetch the lifting-mover submission
  const { data: submission, error: fetchErr } = await supabase
    .from('diagnostic_submissions')
    .select('id, result_payload')
    .eq('user_id', userId)
    .eq('vault_type', VAULT.SC)
    .eq('diagnostic_type', DIAGNOSTIC.LIFTING_MOVER)
    .maybeSingle();

  if (fetchErr || !submission) {
    const msg = fetchErr?.message ?? 'No lifting-mover submission found';
    console.error('[generateStrengthProfile] Fetch FAILED:', msg);
    return { success: false, error: msg };
  }

  // 2. Extract scoring signals from payload
  const payload = submission.result_payload as Record<string, unknown> | null;
  const signals = (payload?.signals as ScoringSignal[] | undefined)
    ?? inferSignalsFromMoverType(payload?.moverType as string | undefined);

  if (!signals || signals.length === 0) {
    console.error('[generateStrengthProfile] No scoring signals found in payload');
    return { success: false, error: 'No scoring signals. Please retake the assessment.' };
  }

  console.log('[generateStrengthProfile] Signals:', signals.length);

  // 3. Build profile using prescription engine
  const buildResult = buildStrengthProfile(signals, userId, submission.id);

  if (!buildResult.success || !buildResult.payload) {
    console.error('[generateStrengthProfile] Build FAILED:', buildResult.errors);
    return {
      success: false,
      error: `Strength profile validation failed: ${(buildResult.errors ?? []).join('; ')}`,
    };
  }

  // 4. Upsert to strength_profiles (one profile per user, retakes overwrite)
  // Destructure to ensure no 'id' leaks into the payload
  const { user_id, version, primary_archetype, archetype_confidence, secondary_need,
    force_bias, control_bias, mobility_score, stability_control_score, strength_score,
    elasticity_score, speed_rotation_score, static_score, spring_score, hybrid_score,
    top_training_priorities, avoid_overemphasis, daily_work_focus, my_path_start_point,
    prep_bias, plyo_bias, sprint_bias, strength_bias, accessory_bias, conditioning_bias,
    recovery_bias, programming_notes, recommended_block_swaps, raw_need_scores,
    raw_archetype_scores, generated_from_submission_id,
  } = buildResult.payload;

  const { error: upsertErr } = await supabase
    .from('strength_profiles')
    .upsert(
      {
        user_id, version, primary_archetype, archetype_confidence, secondary_need,
        force_bias, control_bias, mobility_score, stability_control_score, strength_score,
        elasticity_score, speed_rotation_score, static_score, spring_score, hybrid_score,
        top_training_priorities, avoid_overemphasis, daily_work_focus, my_path_start_point,
        prep_bias, plyo_bias, sprint_bias, strength_bias, accessory_bias, conditioning_bias,
        recovery_bias, programming_notes, recommended_block_swaps, raw_need_scores,
        raw_archetype_scores, generated_from_submission_id,
        generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id', ignoreDuplicates: false },
    );

  if (upsertErr) {
    // If table doesn't exist yet, log warning but don't crash the flow
    if (upsertErr.message?.includes('schema cache') || upsertErr.code === '42P01') {
      console.warn('[generateStrengthProfile] strength_profiles table not found — run migration 20260331_create_strength_profiles.sql');
      return { success: false, error: 'Strength profiles table not created yet. Please apply the database migration.' };
    }
    console.error('[generateStrengthProfile] Upsert FAILED:', upsertErr.message);
    return { success: false, error: `Failed to save strength profile: ${upsertErr.message}` };
  }

  console.log('[generateStrengthProfile] Profile saved — archetype:', buildResult.payload.primary_archetype,
    'need:', buildResult.payload.secondary_need,
    'daily_work:', buildResult.payload.daily_work_focus,
    'my_path:', buildResult.payload.my_path_start_point);

  // 5. Cache locally (best-effort)
  try {
    await AsyncStorage.setItem(CACHE_KEYS.strengthProfile, JSON.stringify(buildResult.payload));
    if (payload?.moverType) {
      await AsyncStorage.setItem(CACHE_KEYS.liftingMoverType, payload.moverType as string);
    }
  } catch {
    console.warn('[generateStrengthProfile] Cache write failed (non-critical)');
  }

  return { success: true };
}

/**
 * Backward compatibility: infer scoring signals from a legacy moverType slug.
 * This allows profiles to be generated from old quiz submissions that only stored { moverType: 'static' }.
 */
function inferSignalsFromMoverType(moverType: string | undefined): ScoringSignal[] {
  if (!moverType) return [];

  const LEGACY_SIGNAL_MAP: Record<string, ScoringSignal[]> = {
    static: [
      'strong_but_stiff', 'poor_elasticity', 'better_lift_outputs_than_jump_outputs',
      'dead_off_ground', 'limited_separation', 'poor_max_velocity',
      'hip_ir_limit', 'poor_rsi',
    ],
    spring: [
      'bouncy_reactive', 'poor_eccentric_control', 'weak_max_strength',
      'poor_landing_ownership', 'poor_deceleration', 'weak_isometric_strength',
      'pelvis_control_limit', 'low_base_strength',
    ],
    hybrid: [
      'mixed_profile', 'balanced_outputs', 'no_clear_force_or_elastic_dominance',
      'moderate_across_all_buckets',
    ],
  };

  const signals = LEGACY_SIGNAL_MAP[moverType];
  if (!signals) {
    console.warn('[inferSignalsFromMoverType] Unknown moverType:', moverType);
    return [];
  }

  console.log('[inferSignalsFromMoverType] Inferred', signals.length, 'signals from legacy moverType:', moverType);
  return signals;
}

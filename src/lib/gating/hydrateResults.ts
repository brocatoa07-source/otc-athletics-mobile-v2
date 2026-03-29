/**
 * Diagnostic Result Hydration
 *
 * Pure functions that take a Supabase result_payload and produce
 * the full, display-ready result object using client-side data maps.
 *
 * These are the ONLY place where payload → result conversion happens.
 * If the payload is invalid, the hydrator returns null.
 */

import {
  MOVEMENT_PROFILES,
  BAT_PATH_PROFILES,
  COMBINED_PROFILE_LABELS,
  COMBINED_PROFILE_SUMMARIES,
  type HittingMovementType,
  type HittingBatPathType,
  type HittingIdentityProfile,
  type HittingIdentityDiagnosticResult,
} from '@/data/hitting-identity-data';

import type { MechanicalIssue, MechanicalDiagnosticResult } from '@/data/hitting-mechanical-diagnostic-data';
import { MECHANICAL_ISSUES } from '@/data/hitting-mechanical-diagnostic-data';

import { LIFTING_MOVER_TYPES, type LiftingMoverType } from '@/data/lifting-mover-type-data';

// ── Hitting Identity ────────────────────────────────────────────────────────

/**
 * Hydrate a hitting identity result from Supabase result_payload.
 *
 * Payload must contain: movementType, batPathType, combinedProfile,
 * movementScores, batPathScores.
 *
 * Returns the full HittingIdentityDiagnosticResult or null if invalid.
 */
export function hydrateHittingIdentity(
  payload: Record<string, unknown>,
): HittingIdentityDiagnosticResult | null {
  const movementType = payload.movementType as HittingMovementType | undefined;
  const batPathType = payload.batPathType as HittingBatPathType | undefined;
  const combinedProfile = payload.combinedProfile as HittingIdentityProfile | undefined;
  const movementScores = payload.movementScores as { springy: number; grounded: number } | undefined;
  const batPathScores = payload.batPathScores as { horizontal: number; vertical: number } | undefined;

  // Validate required fields exist and are valid keys
  if (!movementType || !batPathType || !combinedProfile) return null;
  if (!MOVEMENT_PROFILES[movementType] || !BAT_PATH_PROFILES[batPathType]) return null;
  if (!COMBINED_PROFILE_LABELS[combinedProfile]) return null;

  const mv = MOVEMENT_PROFILES[movementType];
  const bp = BAT_PATH_PROFILES[batPathType];

  return {
    diagnosticKey: 'hitting_identity_v2',
    version: 2,
    completedAt: '',
    movementType,
    batPathType,
    combinedProfile,
    movementScores: movementScores ?? { springy: 0, grounded: 0 },
    batPathScores: batPathScores ?? { horizontal: 0, vertical: 0 },
    movementDescription: mv.description,
    batPathDescription: bp.description,
    movementStrengths: mv.strengths,
    movementStruggles: mv.struggles,
    movementWorkOns: mv.workOns,
    batPathStrengths: bp.strengths,
    batPathStruggles: bp.struggles,
    batPathWorkOns: bp.workOns,
    movementExamples: mv.mlbExamples,
    batPathExamples: bp.mlbExamples,
    movementCues: mv.cues,
    batPathCues: bp.cues,
    summaryLabel: COMBINED_PROFILE_LABELS[combinedProfile],
  };
}

// ── Mechanical ──────────────────────────────────────────────────────────────

/**
 * Hydrate a mechanical diagnostic result from Supabase result_payload.
 *
 * Payload must contain: primary, secondary (both valid MechanicalIssue keys).
 * Returns MechanicalDiagnosticResult or null if invalid.
 */
export function hydrateMechanicalResult(
  payload: Record<string, unknown>,
): MechanicalDiagnosticResult | null {
  const primary = payload.primary as MechanicalIssue | undefined;
  const secondary = payload.secondary as MechanicalIssue | undefined;

  if (!primary || !secondary) return null;
  if (!MECHANICAL_ISSUES[primary] || !MECHANICAL_ISSUES[secondary]) return null;

  return { primary, secondary };
}

// ── Lifting Mover ───────────────────────────────────────────────────────────

/**
 * Hydrate a lifting mover type from Supabase result_payload.
 *
 * Payload must contain: moverType (a valid LiftingMoverType slug).
 * Returns the slug string or null if invalid.
 */
export function hydrateLiftingMover(
  payload: Record<string, unknown>,
): LiftingMoverType | null {
  const moverType = payload.moverType as LiftingMoverType | undefined;

  if (!moverType || !LIFTING_MOVER_TYPES[moverType]) return null;

  return moverType;
}

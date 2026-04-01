/**
 * Diagnostic Result Hydration
 *
 * Pure functions that take a Supabase result_payload and produce
 * the full, display-ready result object using client-side data maps.
 *
 * These are the ONLY place where payload → result conversion happens.
 * If the payload is invalid, the hydrator returns null.
 *
 * NOTE: Hitting diagnostics have been removed. Only lifting hydration remains.
 */

import { LIFTING_MOVER_TYPES, type LiftingMoverType } from '@/data/lifting-mover-type-data';

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

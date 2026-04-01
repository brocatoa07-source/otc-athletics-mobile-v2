# Modifier Precedence — OTC Strength Program Engine

Canonical reference for how workout exercises are modified.
Later steps cannot override earlier steps' constraints.

## Precedence Order (highest priority first)

| Step | Layer | Source | Effect |
|------|-------|--------|--------|
| 1 | Phase template | `otcs-{archetype}-month-{n}.ts` | Base exercises, sets, reps |
| 2 | Season modifiers | `SEASON_BLOCK_CONFIG` | Volume caps, block drops per season phase |
| 3 | Week progression | `SEASON_WEEK_SETS` + `adjustSetsForWeek()` | Sets/reps scaled by intro/volume/peak/deload |
| 4 | Position modifiers | `OTCS_POSITION_TWEAKS` | Exercise swaps for position-specific needs |
| 5 | Deficiency modifiers | `OTCS_DEFICIENCY_OVERRIDES` | Exercise swaps for movement limitations |
| 6 | Profile suppressions | `SUPPRESSION_RULES` via `applyProfileOverrides()` | Remove/cap exercises per `avoid_overemphasis` |
| 7 | Profile swaps | `SWAP_RULES` via `applyProfileOverrides()` | Replace exercises per profile bias tags |
| 8 | Profile injections | `INJECTION_RULES` via `applyProfileOverrides()` | Add exercises per profile bias tags |
| 9 | Session coherence | `validateSessionCoherence()` | Final cleanup: fatigue budget, re-introduction guard, phase cap |

## Rules

1. An injection (step 8) cannot exceed the phase exercise cap (step 2).
2. A profile swap (step 7) cannot undo a deficiency override (step 5).
3. A suppression (step 6) runs before injections (step 8) to prevent contradictions.
4. Session coherence (step 9) catches any exercises that violate avoid rules despite being injected.
5. The monthly phase governs the fatigue budget — the profile only biases WITHIN phase constraints.

## Metadata Resolution

Suppression rules support both:
- `namePatterns` — substring match against exercise name (legacy, still supported)
- `metadataFilter` — structured match against `ExerciseMetadata` fields (preferred)

When both are present, metadata filter takes priority. An exercise is removed if it matches EITHER.

## Bridge Removal Criteria

The `inferSignalsFromMoverType` bridge in `generateDiagnosticResult.ts` can be removed when:
1. `SELECT COUNT(*) FROM diagnostic_submissions WHERE vault_type='sc' AND diagnostic_type='lifting-mover' AND result_payload->>'signals' IS NULL` returns 0
2. `SELECT COUNT(*) FROM strength_profiles` equals `SELECT COUNT(DISTINCT user_id) FROM diagnostic_submissions WHERE vault_type='sc'`
3. At least 30 days have passed since Phase 3 deployment

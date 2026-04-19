# OTC Athletics — Diagnostics Audit

## Overview

6 diagnostic types exist in the codebase. 3 are active and fully wired. 3 are legacy/partial.

---

## Active Diagnostics

### 1. Mental Archetype Diagnostic

| Field | Value |
|-------|-------|
| **User-facing name** | "Archetype Diagnostic" |
| **Route entry** | `training/mental/diagnostics/entry.tsx` → `quiz.tsx?type=archetype` |
| **Questions** | 20 (Q1-3: Reactor, Q4-6: Overthinker, Q7-9: Avoider, Q10-12: Performer, Q13-15: Doubter, Q16-18: Driver, Q19-20: tie-breakers) |
| **Answer model** | Likert 1-5 (Never → Always) |
| **Scoring** | Sum per archetype bucket. Highest = primary. Within-2-points = secondary. |
| **Result type** | `ArchetypeResult { scores: Record<ArchetypeKey, number>, primary: ArchetypeKey, secondary: ArchetypeKey \| null }` |
| **Storage** | `diagnostic_submissions` table (vault_type='mental', diagnostic_type='archetype') |
| **Result destination** | `mental_profiles.primary_archetype`, `secondary_archetype`, `archetype_scores` |
| **Gating impact** | Unlocks daily mental work, profile summary, focus engine, tool recommendations |
| **Downstream screens** | mental/index.tsx, profile-summary.tsx, daily-work.tsx, mental-progress.tsx |
| **Data file** | `src/data/mental-diagnostics-data.ts` — `ARCHETYPE_QUESTIONS`, `ARCHETYPE_INFO` |
| **Scoring file** | `src/utils/mentalDiagnosticScoring.ts` — `scoreArchetype()` |

### 2. Mental Identity Diagnostic

| Field | Value |
|-------|-------|
| **User-facing name** | "Identity Diagnostic" |
| **Route entry** | `training/mental/diagnostics/entry.tsx` → `quiz.tsx?type=identity` |
| **Questions** | 20 (Q1-5: Core identity, Q6-10: Outcome attachment, Q11-14: Approval load, Q15-20: Self-concept) |
| **Answer model** | Likert 1-5 |
| **Scoring** | ISS = mean(Q1-5 raw + Q6-10 reversed + Q15-20 raw). OA = mean(Q6-10 raw). AL = mean(Q11-14 raw). |
| **Result type** | `IdentityResult { ISS: number, outcomeAttachment: number, approvalLoad: number, profile: string }` |
| **Profile tiers** | Elite (ISS ≥ 4.3), Stable (≥ 3.7), Developing (≥ 3.0), Fragile (< 3.0) |
| **Storage** | `diagnostic_submissions` + `mental_profiles.identity_profile`, `iss`, `outcome_attachment`, `approval_load` |
| **Gating impact** | Required for full profile generation |
| **Data file** | `src/data/mental-diagnostics-data.ts` — `IDENTITY_QUESTIONS` |
| **Scoring file** | `src/utils/mentalDiagnosticScoring.ts` — `scoreIdentity()` |

### 3. Mental Habits Diagnostic

| Field | Value |
|-------|-------|
| **User-facing name** | "Habits Diagnostic" |
| **Route entry** | `training/mental/diagnostics/entry.tsx` → `quiz.tsx?type=habits` |
| **Questions** | 20 (Q1-5: Daily foundation, Q6-9: Pre-game, Q10-14: In-game reset, Q15-18: Post-game, Q19-20: Consistency) |
| **Answer model** | Likert 1-5 |
| **Scoring** | HSS = mean of all 20. Subscores = mean of each group. |
| **Result type** | `HabitsResult { HSS: number, subscores: { daily_foundation, pregame, ingame_reset, postgame, consistency }, profile: string }` |
| **Profile tiers** | Elite System (≥ 4.3), Structured (≥ 3.7), Inconsistent (≥ 3.0), Reactive (< 3.0) |
| **Storage** | `diagnostic_submissions` + `mental_profiles.habit_profile`, `hss`, `habit_subscores` |
| **Gating impact** | Required for full profile generation |
| **Data file** | `src/data/mental-diagnostics-data.ts` — `HABITS_QUESTIONS` |
| **Scoring file** | `src/utils/mentalDiagnosticScoring.ts` — `scoreHabits()` |

---

## Legacy / Partial Diagnostics

### 4. Hitting Mover-Type Diagnostic

| Field | Value |
|-------|-------|
| **User-facing name** | "Mover Type Quiz" |
| **Route** | `training/mechanical/mover-type-quiz.tsx` |
| **Questions** | Variable (from `hitting-mover-type-data.ts`) |
| **Storage** | AsyncStorage key `otc:mover-type` |
| **Status** | **Built but may be redundant** — hitting vault functions without it |
| **Data file** | `src/data/hitting-mover-type-data.ts` |

### 5. Hitting Mechanical Diagnostic

| Field | Value |
|-------|-------|
| **User-facing name** | "Mechanical Diagnostic" |
| **Route** | `training/mechanical/mechanical-diagnostic-quiz.tsx` |
| **Questions** | Variable (from `hitting-mechanical-diagnostic-data.ts`) |
| **Storage** | AsyncStorage key `otc:mechanical-diagnostic` |
| **Status** | **Built** — drives troubleshooting and fix recommendations |
| **Data file** | `src/data/hitting-mechanical-diagnostic-data.ts` |

### 6. Lifting Mover-Type Diagnostic

| Field | Value |
|-------|-------|
| **User-facing name** | "Lifting Mover Quiz" |
| **Route** | `training/sc/lifting-mover-quiz.tsx` |
| **Questions** | 20 (from `lifting-mover-type-data.ts`) |
| **Result** | StrengthArchetype: static \| spring \| hybrid |
| **Storage** | AsyncStorage key `otc:lifting-mover-type` + Supabase `strength_profiles` |
| **Status** | **Built** — drives strength program generation |
| **Data file** | `src/data/lifting-mover-type-data.ts` |

---

## Diagnostic Type Inconsistencies

| Issue | Detail |
|-------|--------|
| **TypeScript vs DB mismatch** | `database.ts` defines `DiagnosticType` including `mover-type`, `mechanical`, `lifting-mover`. But `vaultConfig.ts` only lists `archetype`, `identity`, `habits` as `MentalDiagnosticKey`. The hitting and strength diagnostics use AsyncStorage, not the `diagnostic_submissions` table. |
| **Hitting diagnostics don't use Supabase** | Mover-type and mechanical quizzes write to AsyncStorage only. They aren't in `diagnostic_submissions`. |
| **Dead migration** | `20260324_add_hitting_diagnostic_types.sql` added hitting types to the DB, then `20260331_remove_dead_diagnostic_types.sql` removed them. The DB doesn't support these types anymore. |
| **No unified diagnostic hub** | Mental has a clean entry → quiz → results → profile flow. Hitting and strength diagnostics are standalone screens accessed from their respective vaults with no shared infrastructure. |

---

## Diagnostic Flow Diagram

```
Mental:
  entry.tsx → quiz.tsx(archetype) → results.tsx → 
  entry.tsx → quiz.tsx(identity)  → results.tsx →
  entry.tsx → quiz.tsx(habits)    → results.tsx →
  entry.tsx → "Generate Profile" button →
  generateDiagnosticResult() → mental_profiles table →
  Mental Vault unlocked

Hitting:
  diagnostics.tsx → mover-type-quiz.tsx → AsyncStorage
  diagnostics.tsx → mechanical-diagnostic-quiz.tsx → AsyncStorage
  (No unified profile generation)

Strength:
  diagnostics.tsx → lifting-mover-quiz.tsx → AsyncStorage → training-config.tsx → generateProgram()
```

---

## Profile Generation

After all 3 mental diagnostics are complete, `generateDiagnosticResult()` in `src/lib/gating/generateDiagnosticResult.ts`:
1. Reads all 3 submissions from `diagnostic_submissions`
2. Re-scores each using `scoreArchetype()`, `scoreIdentity()`, `scoreHabits()`
3. Calls `buildMentalProfilePayload()` from `mentalDiagnosticScoring.ts`
4. Generates `primary_focus[]` and `recommended_tools[]`
5. Upserts into `mental_profiles` table
6. Returns success/failure

The `MentalProfile` row then drives:
- `useMentalProfile()` hook
- `computeMentalFocus()` in focus engine
- `synthesizeProfile()` in profile summary
- `generateMentalDailyWork()` for daily prescriptions

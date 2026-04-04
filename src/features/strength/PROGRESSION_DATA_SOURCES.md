# Progression Data Sources — Source of Truth Plan

The progression engine (`progressionEngine.ts`) requires three inputs:
- `complianceRate`
- `readinessAvg`
- `outputTrend`

This document defines where each value comes from in the app.

## 1. complianceRate

**Definition:** Fraction of planned workouts completed in the last 2 weeks (0-1).

**Source of truth:** `StrengthProgress.completedWorkouts` in AsyncStorage (`otc:strength-progress`).

**Computation:**
```
planned = daysPerWeek × 2 (last 2 weeks)
completed = count of completedWorkouts keys matching last 14 days
complianceRate = completed / planned
```

**Where computed:** Should be computed in `strength-program-engine.ts` using existing `loadStrengthProgress()` and `getCompletionCount()`.

**Status:** Data exists. Computation function needs to be written.

## 2. readinessAvg

**Definition:** Average self-reported readiness over the last 7 days (1-10 scale).

**Source of truth:** Readiness check-in system (`otc:readiness-checkin` in AsyncStorage or Supabase).

**Current state:** The app has a readiness check-in screen at `src/app/(app)/dashboard/readiness.tsx` that stores daily check-ins. The `ReadinessSummaryCard` on the dashboard reads from it.

**Computation:**
```
last7 = readiness check-ins from last 7 days
readinessAvg = sum(last7.scores) / last7.length
default = 7 (if no check-ins exist)
```

**Where computed:** Should be computed by reading from the existing readiness data source.

**Status:** Data collection exists. Computation function needs to be written. Default fallback of 7 is safe.

## 3. outputTrend

**Definition:** Whether key performance outputs are improving, flat, or declining.

**Relevant outputs (by priority):**
1. Sprint times (10yd, 60yd) — if tracked
2. Jump metrics (broad jump, vertical) — if tracked
3. Exit velocity — if tracked (from hitting vault)
4. Key lift numbers (squat, deadlift, bench) — if tracked
5. Med ball velocity — if tracked

**Current state:** The app has a performance trend system at `src/data/performance-trend.ts` that tracks snapshots. Personal records are tracked in `src/data/engagement-engine.ts`.

**Computation:**
```
if no data: return 'unknown'
compare last 2 measurements of primary output:
  if latest > previous by >2%: return 'improving'
  if latest < previous by >5%: return 'declining'
  else: return 'flat'
```

**Where computed:** Should be computed from performance trend snapshots or PR tracking data.

**Status:** Data model exists but output-specific trend computation needs to be written. 'unknown' is the safe default.

## Implementation Priority

1. **complianceRate** — data already in AsyncStorage, just needs a computation function. Ship first.
2. **readinessAvg** — data collection exists, needs aggregation. Ship second.
3. **outputTrend** — requires PR/metric tracking to be more mature. Ship last with 'unknown' as default.

## When to Enable Progression

The progression engine should only be called when:
- `complianceRate` is computable (≥2 weeks of program data)
- The athlete has completed at least 1 full month

Until then, the program should follow the standard weekly progression (intro → volume → peak → deload) without adaptive overrides.

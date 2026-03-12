import {
  CsvRowSchema,
  type CsvRow,
  type ImportError,
  type ParsedWorkout,
  type ParsedWorkoutItem,
  type ParsedSet,
  type ParseResult,
  type ImportSummary,
} from './types';
import {
  STRENGTH_CATEGORY_MAP,
  AR_CATEGORY_MAP,
  STRENGTH_CATEGORY_ORDER,
  AR_CATEGORY_ORDER,
  MAX_DAYS_PER_WEEK,
} from './constants';

/**
 * Validate raw CSV rows with Zod, apply business rules,
 * and group into ParsedWorkout structures.
 */
export function validateAndGroup(
  rawRows: Record<string, string>[],
  parseErrors: ImportError[],
): ParseResult {
  const errors: ImportError[] = [...parseErrors];
  const validRows: (CsvRow & { _rowNum: number })[] = [];
  let programTitle = '';

  // ── Phase 1: Zod-validate each row ──
  for (let i = 0; i < rawRows.length; i++) {
    const rowNum = i + 2; // header = row 1
    const result = CsvRowSchema.safeParse(rawRows[i]);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          row: rowNum,
          column: issue.path.join('.'),
          message: issue.message,
          severity: 'error',
        });
      }
      continue;
    }

    const row = result.data;
    if (!programTitle) programTitle = row.program_title;

    // Validate category against day_type
    const catLower = row.category.toLowerCase();
    if (row.day_type === 'strength') {
      if (!STRENGTH_CATEGORY_MAP.has(catLower)) {
        errors.push({
          row: rowNum,
          column: 'category',
          message: `Invalid strength category: "${row.category}". Valid: Prep, Plyo, Loaded Power, Main Superset, Secondary Lifts, Accessories, Core, Finisher`,
          severity: 'error',
        });
        continue;
      }
    } else {
      if (!AR_CATEGORY_MAP.has(catLower)) {
        errors.push({
          row: rowNum,
          column: 'category',
          message: `Invalid active_recovery category: "${row.category}". Valid: Prep & Mobility, Isometrics, Full Body Circuit, Elasticity, Sprint Mechanics`,
          severity: 'error',
        });
        continue;
      }
    }

    validRows.push({ ...row, _rowNum: rowNum });
  }

  // ── Phase 2: Group into workouts ──
  const workoutMap = new Map<
    string,
    {
      weekNumber: number;
      dayLabel: string;
      dayType: 'strength' | 'active_recovery';
      items: (CsvRow & { _rowNum: number })[];
    }
  >();

  for (const row of validRows) {
    const key = `${row.week}::${row.day_label}`;

    if (!workoutMap.has(key)) {
      workoutMap.set(key, {
        weekNumber: row.week,
        dayLabel: row.day_label,
        dayType: row.day_type,
        items: [],
      });
    }

    const workout = workoutMap.get(key)!;

    // Check day_type consistency within a workout
    if (workout.dayType !== row.day_type) {
      errors.push({
        row: row._rowNum,
        column: 'day_type',
        message: `Conflicting day_type for week ${row.week}, ${row.day_label}: "${row.day_type}" vs "${workout.dayType}"`,
        severity: 'error',
      });
      continue;
    }

    workout.items.push(row);
  }

  // ── Phase 3: Validate ≤5 day_labels per week ──
  const weekDaysMap = new Map<number, Set<string>>();
  for (const wo of workoutMap.values()) {
    if (!weekDaysMap.has(wo.weekNumber)) {
      weekDaysMap.set(wo.weekNumber, new Set());
    }
    weekDaysMap.get(wo.weekNumber)!.add(wo.dayLabel);
  }

  for (const [week, days] of weekDaysMap) {
    if (days.size > MAX_DAYS_PER_WEEK) {
      errors.push({
        row: 0,
        message: `Week ${week} has ${days.size} unique day_labels (max ${MAX_DAYS_PER_WEEK}): ${[...days].join(', ')}`,
        severity: 'error',
      });
    }
  }

  // ── Phase 4: Build ParsedWorkout[] ──
  const workouts: ParsedWorkout[] = [];
  let orderIndex = 0;

  const sortedKeys = [...workoutMap.keys()].sort((a, b) => {
    const [wA, dA] = a.split('::');
    const [wB, dB] = b.split('::');
    if (Number(wA) !== Number(wB)) return Number(wA) - Number(wB);
    return dA.localeCompare(dB);
  });

  for (const key of sortedKeys) {
    const wo = workoutMap.get(key)!;
    const catOrder =
      wo.dayType === 'strength' ? STRENGTH_CATEGORY_ORDER : AR_CATEGORY_ORDER;

    // Sort by category order, then CSV order field
    wo.items.sort((a, b) => {
      const catA = catOrder.get(a.category.toLowerCase()) ?? 99;
      const catB = catOrder.get(b.category.toLowerCase()) ?? 99;
      if (catA !== catB) return catA - catB;
      return a.order - b.order;
    });

    const catMap =
      wo.dayType === 'strength' ? STRENGTH_CATEGORY_MAP : AR_CATEGORY_MAP;

    const items: ParsedWorkoutItem[] = wo.items.map((row, idx) => {
      const sets: ParsedSet[] = [];
      for (let s = 1; s <= row.sets; s++) {
        sets.push({
          setNumber: s,
          reps: row.reps,
          load: row.load || undefined,
          tempo: row.tempo || undefined,
          restSec: row.rest_sec,
        });
      }

      return {
        category: catMap.get(row.category.toLowerCase()) ?? row.category,
        orderIndex: idx,
        exerciseNameRaw: row.exercise,
        supersetGroup: row.superset_group || undefined,
        notes: row.notes || undefined,
        sets,
        matchStatus: 'pending' as const,
      };
    });

    workouts.push({
      weekNumber: wo.weekNumber,
      dayLabel: wo.dayLabel,
      dayType: wo.dayType,
      orderIndex: orderIndex++,
      items,
    });
  }

  const allNames = [
    ...new Set(workouts.flatMap((w) => w.items.map((i) => i.exerciseNameRaw))),
  ];

  const summary: ImportSummary = {
    totalRows: rawRows.length,
    totalWeeks: weekDaysMap.size,
    totalDays: workoutMap.size,
    totalExercises: allNames.length,
    errorCount: errors.filter((e) => e.severity === 'error').length,
    warningCount: errors.filter((e) => e.severity === 'warning').length,
    unknownExerciseCount: 0, // filled after exercise matching
  };

  return {
    programTitle,
    workouts,
    errors,
    unknownExercises: [], // filled after exercise matching
    summary,
  };
}

import { z } from 'zod';

// ── Raw CSV Row Schema ──

export const CsvRowSchema = z.object({
  program_title: z.string().min(1, 'program_title is required'),
  week: z.coerce.number().int().positive('week must be a positive integer'),
  day_label: z.string().min(1, 'day_label is required'),
  day_type: z.enum(['strength', 'active_recovery'], {
    errorMap: () => ({ message: 'day_type must be "strength" or "active_recovery"' }),
  }),
  category: z.string().min(1, 'category is required'),
  order: z.coerce.number().int().nonnegative('order must be >= 0'),
  exercise: z.string().min(1, 'exercise name is required'),
  sets: z.coerce.number().int().positive('sets must be a positive integer'),
  reps: z.string().min(1, 'reps is required'),
  // Optional columns
  load: z.string().optional(),
  tempo: z.string().optional(),
  rest_sec: z.coerce.number().int().nonnegative().optional().catch(undefined),
  notes: z.string().optional(),
  superset_group: z.string().optional(),
});

export type CsvRow = z.infer<typeof CsvRowSchema>;

// ── Parsed & Grouped Structures ──

export interface ParsedSet {
  setNumber: number;
  reps: string;
  load?: string;
  tempo?: string;
  restSec?: number;
}

export interface ParsedWorkoutItem {
  category: string;
  orderIndex: number;
  exerciseNameRaw: string;
  supersetGroup?: string;
  notes?: string;
  sets: ParsedSet[];
  matchStatus: 'matched' | 'unknown' | 'pending';
}

export interface ParsedWorkout {
  weekNumber: number;
  dayLabel: string;
  dayType: 'strength' | 'active_recovery';
  orderIndex: number;
  items: ParsedWorkoutItem[];
}

export interface ImportError {
  row: number;
  column?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportSummary {
  totalRows: number;
  totalWeeks: number;
  totalDays: number;
  totalExercises: number;
  errorCount: number;
  warningCount: number;
  unknownExerciseCount: number;
}

export interface ParseResult {
  programTitle: string;
  workouts: ParsedWorkout[];
  errors: ImportError[];
  unknownExercises: string[];
  summary: ImportSummary;
}

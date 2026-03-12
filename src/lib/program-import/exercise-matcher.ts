import { supabase } from '@/lib/supabase';
import type { ParseResult } from './types';

/** Normalize an exercise name for fuzzy matching. */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\(.*?\)/g, '')
    .trim();
}

interface ExerciseRecord {
  id: string;
  name: string;
  aliases: string[];
}

/**
 * Load all exercises from Supabase, build name→id lookup,
 * then resolve matchStatus on each ParsedWorkoutItem.
 * Mutates parseResult in place.
 *
 * If the exercises table doesn't exist, all exercises are marked as unknown.
 */
export async function matchExercises(
  parseResult: ParseResult,
): Promise<string[]> {
  let lookup = new Map<string, string>();

  try {
    const { data: exercises } = await supabase
      .from('exercises')
      .select('id, name, aliases');

    for (const ex of (exercises ?? []) as ExerciseRecord[]) {
      lookup.set(normalize(ex.name), ex.id);
      for (const alias of ex.aliases ?? []) {
        lookup.set(normalize(alias), ex.id);
      }
    }
  } catch {
    // exercises table may not exist yet — all will be marked unknown
  }

  const unknowns = new Set<string>();

  for (const workout of parseResult.workouts) {
    for (const item of workout.items) {
      const norm = normalize(item.exerciseNameRaw);
      const matched = lookup.get(norm);
      if (matched) {
        item.matchStatus = 'matched';
      } else {
        item.matchStatus = 'unknown';
        unknowns.add(item.exerciseNameRaw);
      }
    }
  }

  parseResult.unknownExercises = [...unknowns];
  parseResult.summary.unknownExerciseCount = unknowns.size;

  return [...unknowns];
}

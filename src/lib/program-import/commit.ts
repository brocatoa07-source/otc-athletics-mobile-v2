import { supabase } from '@/lib/supabase';
import type { ParseResult } from './types';

const BATCH_SIZE = 100;

/**
 * Commit a validated ParseResult to Supabase.
 *
 * 1. Insert program
 * 2. Insert workouts
 * 3. Batch-insert workout_items
 * 4. Batch-insert workout_sets
 */
export async function commitImport(
  parseResult: ParseResult,
  userId: string,
  description?: string,
): Promise<{ programId: string }> {
  // 1. Create program
  const { data: program, error: progErr } = await supabase
    .from('programs')
    .insert({
      title: parseResult.programTitle,
      description: description || null,
      owner_user_id: userId,
    })
    .select('id')
    .single();

  if (progErr || !program) {
    throw new Error(`Failed to create program: ${progErr?.message}`);
  }

  const programId = program.id;

  try {
    // 2. Insert workouts
    const workoutInserts = parseResult.workouts.map((wo) => ({
      program_id: programId,
      week_number: wo.weekNumber,
      day_label: wo.dayLabel,
      day_type: wo.dayType,
      order_index: wo.orderIndex,
    }));

    const { data: workoutRows, error: woErr } = await supabase
      .from('workouts')
      .insert(workoutInserts)
      .select('id, week_number, day_label');

    if (woErr || !workoutRows) {
      throw new Error(`Failed to insert workouts: ${woErr?.message}`);
    }

    // Build lookup: "week::day_label" → workout_id
    const workoutIdMap = new Map<string, string>();
    for (const wo of workoutRows) {
      workoutIdMap.set(`${wo.week_number}::${wo.day_label}`, wo.id);
    }

    // 3. Build item inserts with their sets attached
    interface ItemInsert {
      workout_id: string;
      category: string;
      order_index: number;
      superset_group: string | null;
      exercise_name_raw: string;
      notes: string | null;
    }

    interface SetData {
      reps: string;
      load?: string;
      tempo?: string;
      rest_sec?: number;
    }

    const itemInserts: { dbRow: ItemInsert; sets: SetData[] }[] = [];

    for (const wo of parseResult.workouts) {
      const workoutId = workoutIdMap.get(
        `${wo.weekNumber}::${wo.dayLabel}`,
      );
      if (!workoutId) continue;

      for (const item of wo.items) {
        itemInserts.push({
          dbRow: {
            workout_id: workoutId,
            category: item.category,
            order_index: item.orderIndex,
            superset_group: item.supersetGroup ?? null,
            exercise_name_raw: item.exerciseNameRaw,
            notes: item.notes ?? null,
          },
          sets: item.sets.map((s) => ({
            reps: s.reps,
            load: s.load,
            tempo: s.tempo,
            rest_sec: s.restSec,
          })),
        });
      }
    }

    // 4. Batch-insert items, collect IDs, build sets
    const allSets: {
      workout_item_id: string;
      set_number: number;
      reps: string;
      load: string | null;
      tempo: string | null;
      rest_sec: number | null;
    }[] = [];

    for (let i = 0; i < itemInserts.length; i += BATCH_SIZE) {
      const batch = itemInserts.slice(i, i + BATCH_SIZE);
      const dbBatch = batch.map((b) => b.dbRow);

      const { data: insertedItems, error: itemErr } = await supabase
        .from('workout_items')
        .insert(dbBatch)
        .select('id');

      if (itemErr || !insertedItems) {
        throw new Error(
          `Failed to insert workout items: ${itemErr?.message}`,
        );
      }

      for (let j = 0; j < insertedItems.length; j++) {
        const itemId = insertedItems[j].id;
        const sets = batch[j].sets;
        for (let s = 0; s < sets.length; s++) {
          allSets.push({
            workout_item_id: itemId,
            set_number: s + 1,
            reps: sets[s].reps,
            load: sets[s].load ?? null,
            tempo: sets[s].tempo ?? null,
            rest_sec: sets[s].rest_sec ?? null,
          });
        }
      }
    }

    // 5. Batch-insert sets
    for (let i = 0; i < allSets.length; i += BATCH_SIZE) {
      const batch = allSets.slice(i, i + BATCH_SIZE);
      const { error: setErr } = await supabase
        .from('workout_sets')
        .insert(batch);

      if (setErr) {
        throw new Error(`Failed to insert workout sets: ${setErr.message}`);
      }
    }

    return { programId };
  } catch (err) {
    // Clean up the program on failure
    await supabase.from('programs').delete().eq('id', programId);
    throw err;
  }
}

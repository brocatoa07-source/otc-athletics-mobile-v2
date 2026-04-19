/**
 * Exercise Weight Log — Tracks weights used per exercise for progression.
 *
 * Simple V1: weight per set, optional notes, previous weight lookup.
 * Stored in AsyncStorage, keyed by exercise name.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'otc:exercise-logs';

// ── Types ───────────────────────────────────────────────────────────────────

export interface SetLog {
  set: number;
  weight: number;
  reps: number;
}

export interface ExerciseLogEntry {
  exerciseName: string;
  date: string; // YYYY-MM-DD
  sets: SetLog[];
  notes: string;
}

// ── Storage ─────────────────────────────────────────────────────────────────

async function loadAllLogs(): Promise<ExerciseLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveAllLogs(logs: ExerciseLogEntry[]): Promise<void> {
  // Keep last 500 entries (roughly 3 months of daily training)
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 500)));
}

/**
 * Save a weight log for an exercise.
 * Replaces any existing entry for the same exercise + date.
 */
export async function saveExerciseLog(entry: ExerciseLogEntry): Promise<void> {
  const logs = await loadAllLogs();
  const filtered = logs.filter(
    l => !(l.exerciseName === entry.exerciseName && l.date === entry.date),
  );
  filtered.unshift(entry);
  await saveAllLogs(filtered);
}

/**
 * Get the most recent log for an exercise (for "Last time" display).
 * Excludes today's date so it shows the PREVIOUS session.
 */
export async function getLastExerciseLog(exerciseName: string): Promise<ExerciseLogEntry | null> {
  const today = new Date().toISOString().slice(0, 10);
  const logs = await loadAllLogs();
  return logs.find(l => l.exerciseName === exerciseName && l.date !== today) ?? null;
}

/**
 * Get today's log for an exercise (if already saved today).
 */
export async function getTodayExerciseLog(exerciseName: string): Promise<ExerciseLogEntry | null> {
  const today = new Date().toISOString().slice(0, 10);
  const logs = await loadAllLogs();
  return logs.find(l => l.exerciseName === exerciseName && l.date === today) ?? null;
}

/**
 * Get all logs for an exercise (for history view).
 */
export async function getExerciseHistory(exerciseName: string): Promise<ExerciseLogEntry[]> {
  const logs = await loadAllLogs();
  return logs.filter(l => l.exerciseName === exerciseName);
}

/**
 * Parse a sets string like "4×5" into { sets: number, reps: number }.
 */
export function parseSetsReps(setsStr: string): { sets: number; reps: number } {
  const match = setsStr.match(/^(\d+)\s*[×x]\s*(\d+)/i);
  if (match) {
    return { sets: parseInt(match[1], 10), reps: parseInt(match[2], 10) };
  }
  return { sets: 3, reps: 5 }; // Default fallback
}

/**
 * Format a previous log into a display string.
 * Example: "Last: 185 lbs × 5"
 */
export function formatLastWeight(entry: ExerciseLogEntry): string {
  if (entry.sets.length === 0) return '';
  // Use the heaviest set
  const heaviest = entry.sets.reduce((max, s) => s.weight > max.weight ? s : max, entry.sets[0]);
  return `Last: ${heaviest.weight} lbs × ${heaviest.reps}`;
}

/**
 * 12-Week Exit Velocity Program — Progress Tracking
 *
 * AsyncStorage-based progress persistence.
 * Tracks: purchase status, current week, completed days, EV test results.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProgramProgress, EVTestResult } from './types';

export type { ProgramProgress, EVTestResult };

const STORAGE_KEY = 'otc:exit-velo-progress';

const DEFAULT_PROGRESS: ProgramProgress = {
  purchased: false,
  currentWeek: 1,
  completedDays: [],
  testResults: [],
};

// ── Load / Save ─────────────────────────────────────────────────────────────

export async function loadProgress(): Promise<ProgramProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

async function saveProgress(progress: ProgramProgress): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// ── Mutations ───────────────────────────────────────────────────────────────

export async function markPurchased(): Promise<ProgramProgress> {
  const p = await loadProgress();
  p.purchased = true;
  p.purchaseDate = new Date().toISOString().slice(0, 10);
  await saveProgress(p);
  return p;
}

export async function completeDay(weekNum: number, dayNum: number): Promise<ProgramProgress> {
  const p = await loadProgress();
  const key = `W${weekNum}D${dayNum}`;
  if (!p.completedDays.includes(key)) {
    p.completedDays.push(key);
  }
  // Auto-advance week if all 3 days completed
  const weekDays = [1, 2, 3].map((d) => `W${weekNum}D${d}`);
  if (weekDays.every((k) => p.completedDays.includes(k)) && weekNum >= p.currentWeek && weekNum < 12) {
    p.currentWeek = weekNum + 1;
  }
  await saveProgress(p);
  return p;
}

export async function saveTestResult(result: EVTestResult): Promise<ProgramProgress> {
  const p = await loadProgress();
  // Replace if same week + bat type exists
  const idx = p.testResults.findIndex(
    (r) => r.weekNumber === result.weekNumber && r.batType === result.batType,
  );
  if (idx >= 0) {
    p.testResults[idx] = result;
  } else {
    p.testResults.push(result);
  }
  await saveProgress(p);
  return p;
}

// ── Queries ─────────────────────────────────────────────────────────────────

export function isDayComplete(progress: ProgramProgress, weekNum: number, dayNum: number): boolean {
  return progress.completedDays.includes(`W${weekNum}D${dayNum}`);
}

export function weekCompletionCount(progress: ProgramProgress, weekNum: number): number {
  return [1, 2, 3].filter((d) => isDayComplete(progress, weekNum, d)).length;
}

export function getEVPR(progress: ProgramProgress): number | null {
  if (progress.testResults.length === 0) return null;
  return Math.max(...progress.testResults.map((r) => r.maxEV));
}

export function getAvgEVForWeek(progress: ProgramProgress, weekNum: number, batType: string): number | null {
  const result = progress.testResults.find(
    (r) => r.weekNumber === weekNum && r.batType === batType,
  );
  return result?.avgEV ?? null;
}

export function getProgressSummary(progress: ProgramProgress) {
  const gameBatResults = progress.testResults.filter((r) => r.batType === 'game');
  const firstTest = gameBatResults.find((r) => r.weekNumber === 1);
  const latestTest = gameBatResults.length > 0
    ? gameBatResults.reduce((a, b) => (a.weekNumber > b.weekNumber ? a : b))
    : null;

  return {
    evPR: getEVPR(progress),
    bestGameAvg: gameBatResults.length > 0 ? Math.max(...gameBatResults.map((r) => r.avgEV)) : null,
    baselineEV: firstTest?.avgEV ?? null,
    latestEV: latestTest?.avgEV ?? null,
    evGain: firstTest && latestTest ? latestTest.avgEV - firstTest.avgEV : null,
    totalDaysCompleted: progress.completedDays.length,
    totalDays: 36,
    completionPct: Math.round((progress.completedDays.length / 36) * 100),
  };
}

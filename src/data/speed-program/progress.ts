/**
 * Speed Development Program — Progress Tracking
 *
 * AsyncStorage persistence for purchase state, completed sessions, and test results.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SpeedProgress, SpeedTestResult, SpeedLevel } from './types';

export type { SpeedProgress, SpeedTestResult };

const STORAGE_KEY = 'otc:speed-program-progress';

const DEFAULT_PROGRESS: SpeedProgress = {
  purchased: false,
  level: 'beginner',
  currentWeek: 1,
  completedSessions: [],
  testResults: [],
  weeklyNotes: {},
};

// ── Load / Save ─────────────────────────────────────────────────────────────

export async function loadSpeedProgress(): Promise<SpeedProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

async function saveSpeedProgress(p: SpeedProgress): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

// ── Mutations ───────────────────────────────────────────────────────────────

export async function markSpeedPurchased(level: SpeedLevel): Promise<SpeedProgress> {
  const p = await loadSpeedProgress();
  p.purchased = true;
  p.level = level;
  p.purchaseDate = new Date().toISOString().slice(0, 10);
  await saveSpeedProgress(p);
  return p;
}

export async function completeSpeedSession(weekNum: number, dayNum: number): Promise<SpeedProgress> {
  const p = await loadSpeedProgress();
  const key = `W${weekNum}D${dayNum}`;
  if (!p.completedSessions.includes(key)) {
    p.completedSessions.push(key);
  }
  const weekDays = [1, 2, 3].map((d) => `W${weekNum}D${d}`);
  if (weekDays.every((k) => p.completedSessions.includes(k)) && weekNum >= p.currentWeek && weekNum < 12) {
    p.currentWeek = weekNum + 1;
  }
  await saveSpeedProgress(p);
  return p;
}

export async function saveSpeedTestResult(result: SpeedTestResult): Promise<SpeedProgress> {
  const p = await loadSpeedProgress();
  const idx = p.testResults.findIndex((r) => r.weekNumber === result.weekNumber);
  if (idx >= 0) {
    p.testResults[idx] = result;
  } else {
    p.testResults.push(result);
  }
  await saveSpeedProgress(p);
  return p;
}

export async function saveWeeklyNote(weekNum: number, note: string): Promise<SpeedProgress> {
  const p = await loadSpeedProgress();
  p.weeklyNotes[`W${weekNum}`] = note;
  await saveSpeedProgress(p);
  return p;
}

// ── Queries ─────────────────────────────────────────────────────────────────

export function isSpeedSessionComplete(p: SpeedProgress, weekNum: number, dayNum: number): boolean {
  return p.completedSessions.includes(`W${weekNum}D${dayNum}`);
}

export function speedWeekCompletionCount(p: SpeedProgress, weekNum: number): number {
  return [1, 2, 3].filter((d) => isSpeedSessionComplete(p, weekNum, d)).length;
}

export function getSpeedProgressSummary(p: SpeedProgress) {
  const firstTest = p.testResults.find((r) => r.weekNumber === 1);
  const latestTest = p.testResults.length > 0
    ? p.testResults.reduce((a, b) => (a.weekNumber > b.weekNumber ? a : b))
    : null;

  const tenImprove = firstTest?.tenYard && latestTest?.tenYard
    ? firstTest.tenYard - latestTest.tenYard : null;
  const thirtyImprove = firstTest?.thirtyYard && latestTest?.thirtyYard
    ? firstTest.thirtyYard - latestTest.thirtyYard : null;
  const sixtyImprove = firstTest?.sixtyYard && latestTest?.sixtyYard
    ? firstTest.sixtyYard - latestTest.sixtyYard : null;

  return {
    tenPR: p.testResults.length > 0
      ? Math.min(...p.testResults.filter((r) => r.tenYard).map((r) => r.tenYard!)) : null,
    thirtyPR: p.testResults.length > 0
      ? Math.min(...p.testResults.filter((r) => r.thirtyYard).map((r) => r.thirtyYard!)) : null,
    sixtyPR: p.testResults.length > 0
      ? Math.min(...p.testResults.filter((r) => r.sixtyYard).map((r) => r.sixtyYard!)) : null,
    broadJumpPR: p.testResults.length > 0
      ? Math.max(...p.testResults.filter((r) => r.broadJump).map((r) => r.broadJump!)) : null,
    tenImprove,
    thirtyImprove,
    sixtyImprove,
    totalSessionsCompleted: p.completedSessions.length,
    totalSessions: 36,
    completionPct: Math.round((p.completedSessions.length / 36) * 100),
  };
}

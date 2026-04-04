/**
 * Onboarding State Manager
 *
 * Tracks onboarding completion and stores athlete setup choices.
 * Local-first (AsyncStorage), can later sync to Supabase athlete row.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'otc:onboarding';

// ── Types ───────────────────────────────────────────────────────────────────

export type AthleteGoal =
  | 'hit_power'
  | 'make_contact'
  | 'throw_harder'
  | 'run_faster'
  | 'get_stronger'
  | 'improve_confidence'
  | 'next_level';

export type PrimaryPillar = 'hitting' | 'strength' | 'mental' | 'complete';

export interface OnboardingData {
  completed: boolean;
  completedAt: string | null;
  goal: AthleteGoal | null;
  pillar: PrimaryPillar | null;
  trialOffered: boolean;
  trialAccepted: boolean;
  diagnosticsCompleted: string[]; // e.g. ['mental-archetype', 'lifting-mover']
}

const DEFAULT_STATE: OnboardingData = {
  completed: false,
  completedAt: null,
  goal: null,
  pillar: null,
  trialOffered: false,
  trialAccepted: false,
  diagnosticsCompleted: [],
};

// ── Core Functions ──────────────────────────────────────────────────────────

export async function loadOnboardingState(): Promise<OnboardingData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export async function saveOnboardingState(data: Partial<OnboardingData>): Promise<OnboardingData> {
  const current = await loadOnboardingState();
  const updated = { ...current, ...data };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function completeOnboarding(): Promise<void> {
  await saveOnboardingState({
    completed: true,
    completedAt: new Date().toISOString(),
  });
}

export async function isOnboardingComplete(): Promise<boolean> {
  const state = await loadOnboardingState();
  return state.completed;
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

// ── Goal Metadata ───────────────────────────────────────────────────────────

export const GOALS: Array<{ key: AthleteGoal; label: string; icon: string; color: string }> = [
  { key: 'hit_power', label: 'Hit for more power', icon: 'flash', color: '#f97316' },
  { key: 'make_contact', label: 'Make more contact', icon: 'baseball-outline', color: '#22c55e' },
  { key: 'throw_harder', label: 'Throw harder', icon: 'rocket-outline', color: '#3b82f6' },
  { key: 'run_faster', label: 'Run faster', icon: 'speedometer-outline', color: '#ef4444' },
  { key: 'get_stronger', label: 'Get stronger', icon: 'barbell-outline', color: '#8b5cf6' },
  { key: 'improve_confidence', label: 'Improve confidence', icon: 'bulb-outline', color: '#f59e0b' },
  { key: 'next_level', label: 'Play at the next level', icon: 'trophy-outline', color: '#1DB954' },
];

export const PILLARS: Array<{ key: PrimaryPillar; label: string; description: string; icon: string; color: string }> = [
  { key: 'hitting', label: 'Hitting', description: 'Focus on becoming a better hitter', icon: 'baseball-outline', color: '#f97316' },
  { key: 'strength', label: 'Strength & Speed', description: 'Focus on getting faster and more powerful', icon: 'barbell-outline', color: '#1DB954' },
  { key: 'mental', label: 'Mental Performance', description: 'Focus on confidence, focus, and competing', icon: 'bulb-outline', color: '#a855f7' },
  { key: 'complete', label: 'Complete Player', description: 'Develop everything — hitting, strength, and mental', icon: 'shield-checkmark', color: '#3b82f6' },
];

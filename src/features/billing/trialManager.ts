/**
 * Free Trial Manager
 *
 * Rules:
 *   - Only DOUBLE has a 7-day free trial
 *   - Trial is available once per user
 *   - Trial should not stack or restart
 *   - Trial unlocks DOUBLE access only
 *   - When trial ends: revert to current paid tier (or WALK)
 *
 * Local-first storage that can later migrate to Supabase
 * without changing screen logic.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Tier, TrialState } from './tierAccess';
import { tierAtLeast, EMPTY_TRIAL } from './tierAccess';

const TRIAL_STORAGE_KEY = 'otc:double-trial';
const TRIAL_DURATION_DAYS = 7;

// ── Storage Model ───────────────────────────────────────────────────────────

interface StoredTrial {
  startDate: string;     // ISO date (YYYY-MM-DD)
  endDate: string;       // ISO date (YYYY-MM-DD)
  used: boolean;         // true once trial has been started (never resets)
}

// ── Core Functions ──────────────────────────────────────────────────────────

/**
 * Load trial state from storage and compute derived fields.
 */
export async function loadTrialState(currentTier: Tier): Promise<TrialState> {
  try {
    const raw = await AsyncStorage.getItem(TRIAL_STORAGE_KEY);
    if (!raw) {
      // No trial ever started
      return {
        ...EMPTY_TRIAL,
        trialEligible: canStartTrialForTier(currentTier, false),
      };
    }

    const stored: StoredTrial = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    const isActive = stored.startDate <= today && today <= stored.endDate;

    return {
      trialEligible: false, // Already used
      trialStarted: true,
      trialActive: isActive,
      trialUsed: stored.used,
      trialStartDate: stored.startDate,
      trialEndDate: stored.endDate,
    };
  } catch {
    return { ...EMPTY_TRIAL, trialEligible: canStartTrialForTier(currentTier, false) };
  }
}

/**
 * Start a 7-day Double trial.
 * Returns the new trial state, or null if not eligible.
 */
export async function startDoubleTrial(currentTier: Tier): Promise<TrialState | null> {
  // Check eligibility
  const existing = await loadTrialState(currentTier);
  if (existing.trialUsed || existing.trialStarted) {
    return null; // Already used, cannot restart
  }
  if (!canStartTrialForTier(currentTier, false)) {
    return null; // TRIPLE+ doesn't need trial
  }

  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + TRIAL_DURATION_DAYS);

  const startDate = start.toISOString().slice(0, 10);
  const endDate = end.toISOString().slice(0, 10);

  const stored: StoredTrial = {
    startDate,
    endDate,
    used: true,
  };

  await AsyncStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(stored));

  return {
    trialEligible: false,
    trialStarted: true,
    trialActive: true,
    trialUsed: true,
    trialStartDate: startDate,
    trialEndDate: endDate,
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Check if a tier is eligible to start a trial.
 * WALK and SINGLE can start. DOUBLE+ already has DOUBLE access or better.
 */
function canStartTrialForTier(tier: Tier, trialUsed: boolean): boolean {
  if (trialUsed) return false;
  // If already at DOUBLE or higher, no trial needed
  if (tierAtLeast(tier, 'DOUBLE')) return false;
  return true;
}

/**
 * Check if the trial is currently active.
 */
export function isTrialActive(trial: TrialState): boolean {
  return trial.trialActive;
}

/**
 * Check if the trial has expired (was used but is no longer active).
 */
export function isTrialExpired(trial: TrialState): boolean {
  return trial.trialUsed && !trial.trialActive;
}

/**
 * Check if a new trial can be started.
 */
export function canStartTrial(trial: TrialState): boolean {
  return trial.trialEligible && !trial.trialUsed;
}

/**
 * Get the number of days remaining in an active trial.
 */
export function getTrialDaysRemaining(trial: TrialState): number {
  if (!trial.trialActive || !trial.trialEndDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(trial.trialEndDate);
  end.setHours(23, 59, 59, 999);

  const diff = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Clear trial state (for dev/debug only).
 */
export async function clearTrialState(): Promise<void> {
  await AsyncStorage.removeItem(TRIAL_STORAGE_KEY);
}

/**
 * useAccess — React hook that bridges useTier() with the central access system.
 *
 * Loads trial state, computes effective tier, and provides
 * access helpers for any screen to check permissions.
 */

import { useState, useEffect, useCallback } from 'react';
import { useTier } from '@/hooks/useTier';
import {
  buildSubscriptionState,
  hasAccess as checkAccess,
  isFeatureLocked as checkLocked,
  isFeatureVisible as checkVisible,
  getUpgradeCopy as getCopy,
  getUpgradeTarget as getTarget,
  getLockReason as getReason,
  type SubscriptionState,
  type PermissionKey,
  type Tier,
  type TrialState,
  EMPTY_TRIAL,
  TIER_LABELS,
} from './tierAccess';
import {
  loadTrialState,
  startDoubleTrial,
  isTrialActive,
  isTrialExpired,
  canStartTrial,
  getTrialDaysRemaining,
} from './trialManager';

export interface AccessState {
  /** Full subscription state */
  sub: SubscriptionState;

  /** The tier the athlete is paying for */
  currentTier: Tier;

  /** The tier the athlete effectively has (may be upgraded by trial) */
  effectiveTier: Tier;

  /** Trial state */
  trial: TrialState;

  /** Whether data has been loaded */
  loaded: boolean;

  /** Check if a specific permission is granted */
  hasAccess: (key: PermissionKey) => boolean;

  /** Check if a feature is locked */
  isLocked: (key: PermissionKey) => boolean;

  /** Check if a feature should be visible (even if locked) */
  isVisible: (key: PermissionKey) => boolean;

  /** Get the upgrade target tier for a locked feature */
  upgradeTarget: (key: PermissionKey) => Tier;

  /** Get upgrade copy for a locked feature */
  upgradeCopy: (key: PermissionKey) => ReturnType<typeof getCopy>;

  /** Get short lock reason */
  lockReason: (key: PermissionKey) => string;

  /** Trial helpers */
  trialActive: boolean;
  trialExpired: boolean;
  trialEligible: boolean;
  trialDaysRemaining: number;

  /** Start the Double trial */
  startTrial: () => Promise<boolean>;

  /** Refresh trial state (e.g., after app resume) */
  refreshTrial: () => Promise<void>;
}

export function useAccess(): AccessState {
  const { tier, isCoach } = useTier();
  const [trial, setTrial] = useState<TrialState>(EMPTY_TRIAL);
  const [loaded, setLoaded] = useState(false);

  // Load trial state on mount and when tier changes
  useEffect(() => {
    loadTrialState(tier).then((state) => {
      setTrial(state);
      setLoaded(true);
    });
  }, [tier]);

  const sub = buildSubscriptionState(tier, isCoach, trial);

  const startTrial = useCallback(async () => {
    const result = await startDoubleTrial(tier);
    if (result) {
      setTrial(result);
      return true;
    }
    return false;
  }, [tier]);

  const refreshTrial = useCallback(async () => {
    const state = await loadTrialState(tier);
    setTrial(state);
  }, [tier]);

  return {
    sub,
    currentTier: tier,
    effectiveTier: sub.effectiveTier,
    trial,
    loaded,

    hasAccess: (key) => checkAccess(sub, key),
    isLocked: (key) => checkLocked(sub, key),
    isVisible: (key) => checkVisible(sub, key),
    upgradeTarget: (key) => getTarget(key),
    upgradeCopy: (key) => getCopy(sub, key),
    lockReason: (key) => getReason(sub, key),

    trialActive: isTrialActive(trial),
    trialExpired: isTrialExpired(trial),
    trialEligible: canStartTrial(trial),
    trialDaysRemaining: getTrialDaysRemaining(trial),

    startTrial,
    refreshTrial,
  };
}

// Re-export types for convenience
export { type PermissionKey, type Tier, TIER_LABELS } from './tierAccess';

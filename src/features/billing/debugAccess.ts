/**
 * Debug Access — dev-only utility to inspect access state.
 */

import type { SubscriptionState, PermissionKey } from './tierAccess';
import { hasAccess, TIER_LABELS } from './tierAccess';
import { getTrialDaysRemaining } from './trialManager';

const KEY_PERMISSIONS: PermissionKey[] = [
  'hittingVault.useFull',
  'mentalVault.useFull',
  'strengthVault.useFull',
  'diagnostics.mental',
  'diagnostics.strength',
  'dailyWork.mental',
  'dailyWork.strength',
  'weeklyReview',
  'progressDashboard',
  'adaptiveProgramming',
  'messages',
  'coaching',
];

/**
 * Print a summary of access state to console (dev only).
 */
export function logAccessDebug(sub: SubscriptionState): void {
  if (!__DEV__) return;

  const lines = [
    `=== OTC ACCESS DEBUG ===`,
    `currentTier: ${TIER_LABELS[sub.currentTier]} (${sub.currentTier})`,
    `effectiveTier: ${TIER_LABELS[sub.effectiveTier]} (${sub.effectiveTier})`,
    `isCoach: ${sub.isCoach}`,
    `trial.started: ${sub.trial.trialStarted}`,
    `trial.active: ${sub.trial.trialActive}`,
    `trial.used: ${sub.trial.trialUsed}`,
    `trial.daysRemaining: ${getTrialDaysRemaining(sub.trial)}`,
    `--- Permissions ---`,
  ];

  for (const key of KEY_PERMISSIONS) {
    const granted = hasAccess(sub, key);
    lines.push(`  ${granted ? '✓' : '✗'} ${key}`);
  }

  console.log(lines.join('\n'));
}

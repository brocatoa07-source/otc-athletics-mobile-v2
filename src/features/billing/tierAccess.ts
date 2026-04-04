/**
 * Central Tier Access Control System
 *
 * Single source of truth for:
 *   - tier types and hierarchy
 *   - feature access per tier
 *   - free trial state
 *   - access helpers (hasAccess, isLocked, isVisible, upgradeTarget)
 *   - upgrade messaging
 *
 * Every screen checks access through this system.
 * Do not scatter tier conditionals across the codebase.
 */

import type { AthleteTier } from '@/types/database';

// ── Tier Types ──────────────────────────────────────────────────────────────

export type Tier = AthleteTier;

/** Tier hierarchy (index = rank, higher = more access) */
const TIER_RANK: Record<Tier, number> = {
  WALK: 0,
  SINGLE: 1,
  DOUBLE: 2,
  TRIPLE: 3,
  HOME_RUN: 4,   // Lifetime — same app access as TRIPLE
  GRAND_SLAM: 5,  // Coaching — everything + 1-on-1
};

export function tierAtLeast(current: Tier, required: Tier): boolean {
  return TIER_RANK[current] >= TIER_RANK[required];
}

// ── Trial State ─────────────────────────────────────────────────────────────

export interface TrialState {
  trialEligible: boolean;
  trialStarted: boolean;
  trialActive: boolean;
  trialUsed: boolean;
  trialStartDate: string | null;
  trialEndDate: string | null;
}

export const EMPTY_TRIAL: TrialState = {
  trialEligible: false,
  trialStarted: false,
  trialActive: false,
  trialUsed: false,
  trialStartDate: null,
  trialEndDate: null,
};

// ── Subscription State ──────────────────────────────────────────────────────

export interface SubscriptionState {
  /** The tier the athlete is paying for (or WALK if free) */
  currentTier: Tier;
  /** The tier the athlete effectively has (may differ during trial, lifetime, or coaching) */
  effectiveTier: Tier;
  /** Trial state */
  trial: TrialState;
  /** Whether the user is a coach (bypasses all tier checks) */
  isCoach: boolean;
  /** Whether the user has lifetime access (HOME_RUN one-time purchase) */
  lifetimeAccess: boolean;
  /** Whether the user has coaching access (GRAND_SLAM) */
  coachingAccess: boolean;
}

/**
 * Compute effective tier from current tier + trial + lifetime + coaching state.
 *
 * Priority: coaching > lifetime > monthlyTier > trial
 */
export function getEffectiveTier(
  currentTier: Tier,
  trial: TrialState,
  lifetimeAccess: boolean = false,
  coachingAccess: boolean = false,
): Tier {
  if (coachingAccess) return 'GRAND_SLAM';
  if (lifetimeAccess) return 'HOME_RUN';
  // If already TRIPLE+, trial is irrelevant
  if (tierAtLeast(currentTier, 'TRIPLE')) return currentTier;
  // Active trial grants DOUBLE access
  if (trial.trialActive) return 'DOUBLE';
  return currentTier;
}

// ── Permission Keys ─────────────────────────────────────────────────────────

export type PermissionKey =
  // Vaults
  | 'hittingVault.view'
  | 'hittingVault.useLimited'
  | 'hittingVault.useFull'
  | 'mentalVault.view'
  | 'mentalVault.useFull'
  | 'strengthVault.view'
  | 'strengthVault.useFull'
  // Diagnostics
  | 'diagnostics.hitting'
  | 'diagnostics.mental'
  | 'diagnostics.strength'
  // Daily Work
  | 'dailyWork.hitting'
  | 'dailyWork.mental'
  | 'dailyWork.strength'
  // My Path
  | 'myPath.hitting'
  | 'myPath.mental'
  | 'myPath.strength'
  // Features
  | 'weeklyReview'
  | 'progressDashboard'
  | 'monthlyReport'
  | 'prWindow'
  | 'coachBrain'
  | 'messages'
  | 'announcements'
  | 'atBatAccountability'
  | 'logging.basic'
  | 'logging.advanced'
  | 'adaptiveProgramming'
  | 'coaching';

// ── Feature Access Map ──────────────────────────────────────────────────────

/**
 * Central feature access map.
 * For each permission key, defines the minimum tier required.
 * Coaches bypass all checks.
 */
const ACCESS_MAP: Record<PermissionKey, Tier> = {
  // Hitting — WALK can view + use limited, SINGLE+ gets full
  'hittingVault.view':       'WALK',
  'hittingVault.useLimited': 'WALK',
  'hittingVault.useFull':    'SINGLE',

  // Mental — all can view, DOUBLE+ gets full
  'mentalVault.view':        'WALK',
  'mentalVault.useFull':     'DOUBLE',

  // Strength — all can view, TRIPLE+ gets full
  'strengthVault.view':      'WALK',
  'strengthVault.useFull':   'TRIPLE',

  // Diagnostics
  'diagnostics.hitting':     'SINGLE',
  'diagnostics.mental':      'DOUBLE',
  'diagnostics.strength':    'TRIPLE',

  // Daily Work
  'dailyWork.hitting':       'WALK',
  'dailyWork.mental':        'DOUBLE',
  'dailyWork.strength':      'TRIPLE',

  // My Path
  'myPath.hitting':          'WALK',
  'myPath.mental':           'DOUBLE',
  'myPath.strength':         'TRIPLE',

  // Features
  'weeklyReview':            'DOUBLE',
  'progressDashboard':       'DOUBLE',
  'monthlyReport':           'TRIPLE',
  'prWindow':                'TRIPLE',
  'coachBrain':              'TRIPLE',
  'messages':                'DOUBLE',
  'announcements':           'WALK',
  'atBatAccountability':     'WALK',
  'logging.basic':           'WALK',
  'logging.advanced':        'SINGLE',
  'adaptiveProgramming':     'TRIPLE',
  'coaching':                'GRAND_SLAM',
};

// ── Access Helpers ──────────────────────────────────────────────────────────

/**
 * Check if the subscription state grants access to a permission.
 */
export function hasAccess(state: SubscriptionState, key: PermissionKey): boolean {
  if (state.isCoach) return true;
  const required = ACCESS_MAP[key];
  return tierAtLeast(state.effectiveTier, required);
}

/**
 * Check if a feature is locked for this subscription state.
 */
export function isFeatureLocked(state: SubscriptionState, key: PermissionKey): boolean {
  return !hasAccess(state, key);
}

/**
 * Check if a feature should be visible (even if locked).
 * View permissions are always visible; full-access permissions show as locked preview.
 */
export function isFeatureVisible(state: SubscriptionState, key: PermissionKey): boolean {
  if (state.isCoach) return true;

  // View permissions are always visible
  if (key.endsWith('.view')) return true;

  // Vaults are always visible (even if locked)
  if (key.includes('Vault')) return true;

  // Everything else: visible if tier is at least one below required
  const required = ACCESS_MAP[key];
  const requiredRank = TIER_RANK[required];
  const currentRank = TIER_RANK[state.effectiveTier];
  // Show if within 2 tiers (so users can see what's ahead)
  return currentRank >= requiredRank - 2;
}

/**
 * Get the upgrade target tier for a locked permission.
 */
export function getUpgradeTarget(key: PermissionKey): Tier {
  return ACCESS_MAP[key];
}

/**
 * Get the minimum tier label for display.
 */
export function getRequiredTierLabel(key: PermissionKey): string {
  return TIER_LABELS[ACCESS_MAP[key]];
}

// ── Tier Display ────────────────────────────────────────────────────────────

export const TIER_LABELS: Record<Tier, string> = {
  WALK: 'Walk',
  SINGLE: 'Single',
  DOUBLE: 'Double',
  TRIPLE: 'Triple',
  HOME_RUN: 'Home Run',
  GRAND_SLAM: 'Grand Slam',
};

export const TIER_PRICES: Record<Tier, string> = {
  WALK: 'Free',
  SINGLE: '$29.99/mo',
  DOUBLE: '$54.99/mo',
  TRIPLE: '$99.99/mo',
  HOME_RUN: '$500 one-time',
  GRAND_SLAM: 'Custom',
};

export const TIER_COLORS: Record<Tier, string> = {
  WALK: '#6b7280',
  SINGLE: '#22c55e',
  DOUBLE: '#3b82f6',
  TRIPLE: '#f59e0b',
  HOME_RUN: '#a855f7',
  GRAND_SLAM: '#e11d48',
};

// ── Upgrade Messaging ───────────────────────────────────────────────────────

interface UpgradeCopy {
  headline: string;
  body: string;
  ctaLabel: string;
  ctaAction: 'upgrade' | 'trial' | 'apply';
  targetTier: Tier;
}

const UPGRADE_COPY: Record<string, Record<string, UpgradeCopy>> = {
  // WALK user hitting locked features
  WALK: {
    'hittingVault.useFull': {
      headline: 'Unlock the Full Hitting System',
      body: 'Full hitting drill access is part of Single. Upgrade to unlock the complete hitting development system.',
      ctaLabel: 'Upgrade to Single',
      ctaAction: 'upgrade',
      targetTier: 'SINGLE',
    },
    'mentalVault.useFull': {
      headline: 'Unlock Mental Performance',
      body: 'Mental performance training is part of Double. Start your 7-day free trial to unlock confidence, focus, and game-day routines.',
      ctaLabel: 'Start Free Trial',
      ctaAction: 'trial',
      targetTier: 'DOUBLE',
    },
    'strengthVault.useFull': {
      headline: 'Unlock Strength & Power',
      body: 'Strength, speed, and power training are part of Triple. Upgrade to unlock full athlete development.',
      ctaLabel: 'Upgrade to Triple',
      ctaAction: 'upgrade',
      targetTier: 'TRIPLE',
    },
    'diagnostics.mental': {
      headline: 'Unlock Mental Diagnostics',
      body: 'Mental diagnostics are part of Double. Start your 7-day free trial to discover your mental profile.',
      ctaLabel: 'Start Free Trial',
      ctaAction: 'trial',
      targetTier: 'DOUBLE',
    },
    'diagnostics.strength': {
      headline: 'Unlock Strength Diagnostics',
      body: 'Strength diagnostics and adaptive programming are part of Triple.',
      ctaLabel: 'Upgrade to Triple',
      ctaAction: 'upgrade',
      targetTier: 'TRIPLE',
    },
    _default: {
      headline: 'Upgrade Your Plan',
      body: 'This feature requires a higher tier. Start your 7-day free trial of Double or upgrade to unlock more.',
      ctaLabel: 'View Plans',
      ctaAction: 'upgrade',
      targetTier: 'DOUBLE',
    },
  },

  // SINGLE user hitting locked features
  SINGLE: {
    'mentalVault.useFull': {
      headline: 'Unlock Mental Performance',
      body: 'Mental performance training is part of Double. Upgrade to unlock full player development.',
      ctaLabel: 'Upgrade to Double',
      ctaAction: 'upgrade',
      targetTier: 'DOUBLE',
    },
    'strengthVault.useFull': {
      headline: 'Unlock Strength & Power',
      body: 'Strength, speed, and power training are part of Triple. Upgrade to unlock full athlete development.',
      ctaLabel: 'Upgrade to Triple',
      ctaAction: 'upgrade',
      targetTier: 'TRIPLE',
    },
    _default: {
      headline: 'Upgrade Your Plan',
      body: 'This feature requires a higher tier.',
      ctaLabel: 'View Plans',
      ctaAction: 'upgrade',
      targetTier: 'DOUBLE',
    },
  },

  // DOUBLE user hitting locked features
  DOUBLE: {
    'strengthVault.useFull': {
      headline: 'Unlock Strength & Power',
      body: 'Strength, speed, and power training are part of Triple. Upgrade to unlock adaptive programming and full athlete development.',
      ctaLabel: 'Upgrade to Triple',
      ctaAction: 'upgrade',
      targetTier: 'TRIPLE',
    },
    'diagnostics.strength': {
      headline: 'Unlock Strength Diagnostics',
      body: 'Strength diagnostics and adaptive programming are part of Triple.',
      ctaLabel: 'Upgrade to Triple',
      ctaAction: 'upgrade',
      targetTier: 'TRIPLE',
    },
    'adaptiveProgramming': {
      headline: 'Unlock Adaptive Programming',
      body: 'Adaptive programming that adjusts to your performance is part of Triple.',
      ctaLabel: 'Upgrade to Triple',
      ctaAction: 'upgrade',
      targetTier: 'TRIPLE',
    },
    _default: {
      headline: 'Upgrade Your Plan',
      body: 'This feature requires Triple tier.',
      ctaLabel: 'Upgrade to Triple',
      ctaAction: 'upgrade',
      targetTier: 'TRIPLE',
    },
  },

  // TRIPLE user — coaching is locked, lifetime is an option
  TRIPLE: {
    coaching: {
      headline: '1-on-1 Coaching',
      body: 'Custom programs, direct coaching access, and personalized development. Available by application.',
      ctaLabel: 'Apply for Grand Slam',
      ctaAction: 'apply',
      targetTier: 'GRAND_SLAM',
    },
    _default: {
      headline: 'Full App Access',
      body: 'You have full access to the app. Want lifetime access or 1-on-1 coaching?',
      ctaLabel: 'View Options',
      ctaAction: 'upgrade',
      targetTier: 'HOME_RUN',
    },
  },

  // HOME_RUN user — lifetime, only coaching is locked
  HOME_RUN: {
    coaching: {
      headline: '1-on-1 Coaching',
      body: 'Custom programs, direct coaching access, and personalized development. Available by application.',
      ctaLabel: 'Apply for Grand Slam',
      ctaAction: 'apply',
      targetTier: 'GRAND_SLAM',
    },
    _default: {
      headline: 'Lifetime Access',
      body: 'You have lifetime access to the full system.',
      ctaLabel: 'Apply for Coaching',
      ctaAction: 'apply',
      targetTier: 'GRAND_SLAM',
    },
  },
};

/**
 * Get tier-appropriate upgrade copy for a locked permission.
 */
export function getUpgradeCopy(
  state: SubscriptionState,
  key: PermissionKey,
): UpgradeCopy {
  const tierCopy = UPGRADE_COPY[state.effectiveTier] ?? UPGRADE_COPY.WALK;
  const specific = tierCopy[key];
  if (specific) return specific;

  // Fall back to default for this tier, or WALK default
  return tierCopy._default ?? UPGRADE_COPY.WALK._default!;
}

/**
 * Get a short lock reason for inline display.
 */
export function getLockReason(state: SubscriptionState, key: PermissionKey): string {
  const required = ACCESS_MAP[key];
  return `Requires ${TIER_LABELS[required]}`;
}

// ── Build Subscription State ────────────────────────────────────────────────

/**
 * Build a SubscriptionState from the useTier() hook values + trial data.
 * This bridges the existing useTier hook with the new access system.
 */
export function buildSubscriptionState(
  currentTier: Tier,
  isCoach: boolean,
  trial: TrialState = EMPTY_TRIAL,
  lifetimeAccess: boolean = false,
  coachingAccess: boolean = false,
): SubscriptionState {
  const effectiveTier = isCoach ? 'GRAND_SLAM' : getEffectiveTier(currentTier, trial, lifetimeAccess, coachingAccess);
  return { currentTier, effectiveTier, trial, isCoach, lifetimeAccess, coachingAccess };
}

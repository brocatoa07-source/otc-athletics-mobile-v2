/**
 * Dashboard Insight — Pure logic for dynamic message selection and streak computation.
 *
 * All functions are pure and testable.
 * Data inputs come from hooks/AsyncStorage — this file has zero side effects.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export interface DashboardMessageContext {
  missedYesterday: boolean;
  workoutsCompletedThisWeek: number;
  weeklyWorkoutsTarget: number;
  streakDays: number;
  hasNewPR: boolean;
  prWindowOpen: boolean;
  /** Positive = improved rank, negative = dropped */
  leaderboardDelta?: number;
  performanceTrend?: {
    metric: string;
    delta: number;
    direction: 'up' | 'down';
    timeframeLabel: string;
  };
  returningAfterInactivity: boolean;
}

export interface DashboardInsight {
  greeting: string;
  athleteName: string;
  dynamicMessage: string;
  streakDays: number;
  streakLabel: string;
}

// ── Greeting ────────────────────────────────────────────────────────────────

export function getTimeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

// ── Dynamic Message Selection (priority-ordered) ────────────────────────────

const FALLBACK_MESSAGES = [
  'Get your work in.',
  'Stack days.',
  'Do the work.',
  'No zero days.',
  'Progress is earned.',
  'Show up today.',
  'Earn it.',
];

export function selectDynamicMessage(ctx: DashboardMessageContext): string {
  // P1: Missed yesterday
  if (ctx.missedYesterday && ctx.streakDays === 0) {
    return 'You missed yesterday. Don\u2019t miss twice.';
  }

  // P2: One workout away from perfect week
  const remaining = ctx.weeklyWorkoutsTarget - ctx.workoutsCompletedThisWeek;
  if (remaining === 1 && ctx.weeklyWorkoutsTarget > 0) {
    return 'You\u2019re 1 workout away from a perfect week.';
  }

  // P3: Active streak
  if (ctx.streakDays >= 2) {
    return `You\u2019re on a ${ctx.streakDays} day streak. Don\u2019t break it.`;
  }

  // P4: New PR
  if (ctx.hasNewPR) {
    return 'New PR. You\u2019re getting better.';
  }

  // P5: PR test window
  if (ctx.prWindowOpen) {
    return 'PR window is open \u2014 test this week.';
  }

  // P6: Leaderboard drop
  if (ctx.leaderboardDelta !== undefined && ctx.leaderboardDelta < 0) {
    return 'You dropped on the leaderboard. Respond.';
  }

  // P7: Performance trend
  if (ctx.performanceTrend && ctx.performanceTrend.direction === 'up' && ctx.performanceTrend.delta > 0) {
    const { metric, delta, timeframeLabel } = ctx.performanceTrend;
    return `Your ${metric} is up ${delta} ${timeframeLabel}.`;
  }

  // P8: Returning after inactivity
  if (ctx.returningAfterInactivity) {
    return 'Welcome back. Start your streak again.';
  }

  // P9: Fallback — deterministic rotation based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
  return FALLBACK_MESSAGES[dayOfYear % FALLBACK_MESSAGES.length];
}

// ── Streak Label ────────────────────────────────────────────────────────────

export function getStreakLabel(days: number): string {
  if (days === 0) return 'Start your streak today';
  if (days === 1) return 'Day 1 — keep it going';
  return `${days} day streak`;
}

// ── Build Full Insight ──────────────────────────────────────────────────────

export function buildDashboardInsight(
  firstName: string,
  streakDays: number,
  ctx: DashboardMessageContext,
): DashboardInsight {
  return {
    greeting: getTimeOfDayGreeting(),
    athleteName: firstName,
    dynamicMessage: selectDynamicMessage(ctx),
    streakDays,
    streakLabel: getStreakLabel(streakDays),
  };
}

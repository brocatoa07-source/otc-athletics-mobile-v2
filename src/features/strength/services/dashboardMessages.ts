/**
 * Smart Dashboard Messages — dynamic coaching messages for the athlete dashboard.
 *
 * Reads live signal data and returns the most relevant message.
 * Priority order: pain > low readiness > missed workouts > streak > progress > general.
 */

export interface DashboardMessage {
  text: string;
  tone: 'positive' | 'neutral' | 'warning';
  icon: string;
}

export interface DashboardMessageInput {
  streak: number;
  complianceRate: number;
  completedThisWeek: number;
  plannedThisWeek: number;
  readinessAvg: number;
  readinessToday: number | null;
  progressionDecision: 'progress' | 'hold' | 'regress';
  isDeloadWeek: boolean;
  painFlags: number;
  missedYesterday: boolean;
  outputTrend: 'improving' | 'flat' | 'declining' | 'unknown';
}

/**
 * Returns the single most important message for the dashboard right now.
 */
export function getDashboardMessage(input: DashboardMessageInput): DashboardMessage {
  const {
    streak, complianceRate, completedThisWeek, plannedThisWeek,
    readinessAvg, readinessToday, progressionDecision,
    isDeloadWeek, painFlags, missedYesterday, outputTrend,
  } = input;

  // Priority 1: Pain / injury signals
  if (painFlags >= 3) {
    return {
      text: 'Multiple pain flags recently. Consider modifying or checking in with your coach.',
      tone: 'warning',
      icon: 'alert-circle',
    };
  }

  // Priority 2: Very low readiness today
  if (readinessToday !== null && readinessToday <= 3) {
    return {
      text: "Your readiness is low today. Focus on recovery — don't force it.",
      tone: 'warning',
      icon: 'bed-outline',
    };
  }

  // Priority 3: Deload week
  if (isDeloadWeek) {
    return {
      text: 'Recovery week. Light work, good sleep, and let your body catch up.',
      tone: 'neutral',
      icon: 'leaf-outline',
    };
  }

  // Priority 4: Missed yesterday
  if (missedYesterday && streak === 0) {
    return {
      text: "You missed yesterday. Don't miss twice.",
      tone: 'warning',
      icon: 'arrow-redo',
    };
  }

  // Priority 5: Regression state
  if (progressionDecision === 'regress') {
    return {
      text: 'Rebuilding phase. Show up, stay consistent, and the progress will follow.',
      tone: 'warning',
      icon: 'trending-down',
    };
  }

  // Priority 6: Low readiness average
  if (readinessAvg < 5) {
    return {
      text: 'Your readiness has been low this week. Prioritize sleep and recovery.',
      tone: 'warning',
      icon: 'moon-outline',
    };
  }

  // Priority 7: Almost perfect week
  const remaining = plannedThisWeek - completedThisWeek;
  if (remaining === 1 && complianceRate >= 0.7) {
    return {
      text: "You're 1 workout away from a perfect week.",
      tone: 'positive',
      icon: 'flame',
    };
  }

  // Priority 8: Progress ready
  if (progressionDecision === 'progress') {
    return {
      text: "You're ready to progress. Keep pushing.",
      tone: 'positive',
      icon: 'trending-up',
    };
  }

  // Priority 9: Hot streak
  if (streak >= 7) {
    return {
      text: `${streak}-day streak. That's elite consistency.`,
      tone: 'positive',
      icon: 'flame',
    };
  }
  if (streak >= 5) {
    return {
      text: `${streak}-day streak. Don't break it.`,
      tone: 'positive',
      icon: 'flame',
    };
  }
  if (streak >= 3) {
    return {
      text: `${streak} days in a row. Keep building.`,
      tone: 'positive',
      icon: 'flash',
    };
  }

  // Priority 10: Output trending up
  if (outputTrend === 'improving') {
    return {
      text: 'Outputs are trending up. PR window is open.',
      tone: 'positive',
      icon: 'rocket',
    };
  }

  // Priority 11: High readiness
  if (readinessToday !== null && readinessToday >= 8) {
    return {
      text: "You're feeling good today. Attack the session.",
      tone: 'positive',
      icon: 'flash',
    };
  }

  // Priority 12: Hold state encouragement
  if (progressionDecision === 'hold') {
    return {
      text: "Stay the course. Your body is adapting. Don't rush.",
      tone: 'neutral',
      icon: 'pause-circle',
    };
  }

  // Default
  return {
    text: 'Show up. Do the work. Trust the process.',
    tone: 'neutral',
    icon: 'barbell',
  };
}

/**
 * Returns multiple relevant messages (for a feed or card stack).
 * Max 3, priority-ordered.
 */
export function getDashboardMessages(input: DashboardMessageInput): DashboardMessage[] {
  const messages: DashboardMessage[] = [];
  const primary = getDashboardMessage(input);
  messages.push(primary);

  // Add secondary messages that don't duplicate the primary
  if (input.streak >= 3 && !primary.text.includes('streak')) {
    messages.push({
      text: `${input.streak}-day streak.`,
      tone: 'positive',
      icon: 'flame',
    });
  }

  if (input.outputTrend === 'improving' && !primary.text.includes('PR')) {
    messages.push({
      text: 'Outputs are trending up.',
      tone: 'positive',
      icon: 'trending-up',
    });
  }

  if (input.complianceRate >= 0.9 && !primary.text.includes('perfect')) {
    messages.push({
      text: 'Near-perfect compliance. Elite work.',
      tone: 'positive',
      icon: 'checkmark-done',
    });
  }

  return messages.slice(0, 3);
}

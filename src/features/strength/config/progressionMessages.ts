/**
 * Athlete-facing progression messages.
 *
 * Maps progression decisions to human-readable coaching language.
 * These are the words the athlete sees — no internal labels.
 */

export type MessageTone = 'positive' | 'neutral' | 'warning';

export interface ProgressionMessage {
  title: string;
  message: string;
  tone: MessageTone;
  color: string;
  icon: string;
}

const MESSAGES: Record<string, ProgressionMessage> = {
  progress: {
    title: 'Time to Push',
    message: "You're doing the work and improving. We're progressing your program.",
    tone: 'positive',
    color: '#22c55e',
    icon: 'trending-up',
  },
  hold: {
    title: 'Stay the Course',
    message: "Stay here. Your body is adapting. Don't rush the process.",
    tone: 'neutral',
    color: '#f59e0b',
    icon: 'pause-circle',
  },
  regress: {
    title: 'Rebuild First',
    message: 'We need to rebuild consistency and recovery before pushing again.',
    tone: 'warning',
    color: '#ef4444',
    icon: 'trending-down',
  },
  deload: {
    title: 'Recovery Week',
    message: 'This week is for recovery so we can push next week. Trust the process.',
    tone: 'neutral',
    color: '#8b5cf6',
    icon: 'bed-outline',
  },
};

/**
 * Get the athlete-facing message for a progression decision.
 */
export function getProgressionMessage(
  decision: string,
  isDeload: boolean = false,
): ProgressionMessage {
  if (isDeload) return MESSAGES.deload;
  return MESSAGES[decision] ?? MESSAGES.hold;
}

/**
 * Get a contextual sub-message based on specific conditions.
 */
export function getContextualNote(params: {
  complianceRate: number;
  readinessAvg: number;
  painFlags: number;
  weeksInState: number;
  streak: number;
}): string | null {
  const { complianceRate, readinessAvg, painFlags, weeksInState, streak } = params;

  if (painFlags >= 3) {
    return 'Multiple pain flags this week. Talk to your coach about modifying.';
  }
  if (readinessAvg < 4) {
    return 'Your readiness has been low. Prioritize sleep and recovery.';
  }
  if (complianceRate < 0.5) {
    return 'Consistency is the foundation. Show up before you push.';
  }
  if (weeksInState >= 4 && complianceRate >= 0.8) {
    return "You've held steady for a while. Time to test the next level.";
  }
  if (streak >= 7) {
    return `${streak}-day streak. That's elite consistency.`;
  }
  if (streak >= 3) {
    return `${streak} days in a row. Keep building.`;
  }
  return null;
}

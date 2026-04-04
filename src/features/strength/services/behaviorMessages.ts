/**
 * Behavior Messages — in-app coaching notifications.
 *
 * Extends dashboardMessages.ts with additional trigger conditions
 * and a multi-message feed for the notification layer.
 */

import {
  getDashboardMessages,
  type DashboardMessage,
  type DashboardMessageInput,
} from './dashboardMessages';
import { evaluatePRWindow } from './prWindow';
import type { ProgressionSnapshot } from './feedbackLoop';

export interface BehaviorNotification {
  id: string;
  message: DashboardMessage;
  priority: number;
  dismissable: boolean;
  action?: { label: string; route: string };
}

/**
 * Generate all relevant behavior notifications from current state.
 * Returns up to 5 priority-ordered messages.
 */
export function generateBehaviorNotifications(
  snapshot: ProgressionSnapshot,
  streak: number,
  missedYesterday: boolean = false,
): BehaviorNotification[] {
  const notifications: BehaviorNotification[] = [];
  let id = 0;

  // PR Window check
  const prWindow = evaluatePRWindow(snapshot);
  if (prWindow.isOpen) {
    notifications.push({
      id: `pr-${id++}`,
      message: { text: prWindow.message, tone: 'positive', icon: 'trophy' },
      priority: 1,
      dismissable: false,
      action: { label: 'Test Now', route: '/(app)/training/sc/exercises' },
    });
  }

  // Dashboard messages (already priority-sorted)
  const dashInput: DashboardMessageInput = {
    streak,
    complianceRate: snapshot.compliance.rate,
    completedThisWeek: snapshot.compliance.completed,
    plannedThisWeek: snapshot.compliance.planned,
    readinessAvg: snapshot.readiness.avg,
    readinessToday: null,
    progressionDecision: snapshot.result.decision,
    isDeloadWeek: snapshot.result.adjustments.some(a => a.note.toLowerCase().includes('deload')),
    painFlags: snapshot.painFlags,
    missedYesterday,
    outputTrend: snapshot.output.trend,
  };

  const dashMsgs = getDashboardMessages(dashInput);
  for (const msg of dashMsgs) {
    notifications.push({
      id: `dash-${id++}`,
      message: msg,
      priority: msg.tone === 'warning' ? 2 : msg.tone === 'positive' ? 3 : 4,
      dismissable: true,
    });
  }

  // Testing overdue check (4-week retest cycle)
  if (snapshot.output.trend === 'unknown') {
    notifications.push({
      id: `test-${id++}`,
      message: {
        text: 'You are overdue for your 4-week retest. Log your numbers to measure real progress.',
        tone: 'neutral',
        icon: 'clipboard',
      },
      priority: 5,
      dismissable: true,
      action: { label: 'Log Retest', route: '/(app)/progress/entry' },
    });
  }

  // Compliance drop
  if (snapshot.compliance.rate < 0.6 && snapshot.compliance.rate > 0) {
    notifications.push({
      id: `comp-${id++}`,
      message: {
        text: `Your compliance dropped to ${Math.round(snapshot.compliance.rate * 100)}% this period.`,
        tone: 'warning',
        icon: 'alert-circle',
      },
      priority: 3,
      dismissable: true,
    });
  }

  // Output trend
  if (snapshot.output.trend === 'improving' && !prWindow.isOpen) {
    notifications.push({
      id: `trend-${id++}`,
      message: {
        text: `Your ${snapshot.output.metric?.replace(/([A-Z])/g, ' $1').toLowerCase() ?? 'outputs'} ${snapshot.output.trend === 'improving' ? 'trending up' : ''}.`,
        tone: 'positive',
        icon: 'trending-up',
      },
      priority: 6,
      dismissable: true,
    });
  }

  // Sort by priority and limit
  return notifications
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);
}

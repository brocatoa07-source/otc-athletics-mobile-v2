import type { RequiredTodayEnabled, RequiredTodayItemKey } from '@/hooks/useRequiredTodayConfig';
import { REQUIRED_TODAY_ORDER } from '@/hooks/useRequiredTodayConfig';

/* ────────────────────────────────────────────────────
 * NEXT PRIORITY ENGINE
 *
 * Returns the single most important action right now.
 *
 * Priority waterfall:
 *   1. Complete assessment (if no profile/assessment) — always first
 *   2. Walk Required Today items in config order, returning
 *      the first one that is enabled AND not yet done today.
 *   3. Log metrics (if retest is due — >= 28 days)
 *   4. Explore Lab (fallback)
 * ──────────────────────────────────────────────────── */

export type PriorityAction =
  | 'complete_assessment'
  | 'readiness_checkin'
  | 'todays_workout'
  | 'skill_work'
  | 'continue_course'
  | 'journal_entry'
  | 'log_metrics'
  | 'explore_lab';

export interface NextPriority {
  action: PriorityAction;
  title: string;
  subtitle: string;
  route: string;
  icon: string;
  color: string;
}

/** Map each RequiredToday key → NextPriority display data */
const ITEM_PRIORITY: Record<RequiredTodayItemKey, Omit<NextPriority, 'action'>> = {
  readiness: {
    title: 'OTC Check-In',
    subtitle: 'Complete your daily check-in before training',
    route: '/(app)/training/own-the-cost-checkin',
    icon: 'pulse-outline',
    color: '#22c55e',
  },
  training: {
    title: "Today's Training Session",
    subtitle: 'Your personalized workout is ready',
    route: '/(app)/training/sc/workout',
    icon: 'barbell-outline',
    color: '#3b82f6',
  },
  skillWork: {
    title: 'Skill Work',
    subtitle: 'Hitting drills, tee work, or cage session',
    route: '/(app)/training/mechanical',
    icon: 'baseball-outline',
    color: '#E10600',
  },
  mental: {
    title: 'Mental Session',
    subtitle: 'Course, visualization, or mental tool',
    route: '/(app)/training/mental',
    icon: 'sparkles-outline',
    color: '#A78BFA',
  },
  journal: {
    title: 'Write a Journal Entry',
    subtitle: 'Reflect on your training and mindset',
    route: '/(app)/training/mental/journals',
    icon: 'journal-outline',
    color: '#A78BFA',
  },
};

const ITEM_ACTION: Record<RequiredTodayItemKey, PriorityAction> = {
  readiness: 'readiness_checkin',
  training:  'todays_workout',
  skillWork: 'skill_work',
  mental:    'continue_course',
  journal:   'journal_entry',
};

const STATIC: Record<string, Omit<NextPriority, 'action'>> = {
  complete_assessment: {
    title: 'Complete Your Assessment',
    subtitle: 'Set up your profile to unlock personalized training',
    route: '/(app)/training/sc/diagnostics',
    icon: 'clipboard-outline',
    color: '#f59e0b',
  },
  log_metrics: {
    title: 'Log Performance Test',
    subtitle: 'Retest due — log your testing snapshot',
    route: '/(app)/progress',
    icon: 'speedometer-outline',
    color: '#8b5cf6',
  },
  explore_lab: {
    title: 'Explore the Lab',
    subtitle: 'Browse drills, tools, and resources',
    route: '/(app)/training',
    icon: 'flask-outline',
    color: '#FFFFFF',
  },
};

export interface NextPriorityInput {
  hasScProfile: boolean;
  hasAssessment: boolean;
  enabled: RequiredTodayEnabled;
  hasTrainingToday: boolean;
  completions: Record<RequiredTodayItemKey, boolean>;
  metricsRetestDue: boolean;
}

export function getNextPriority(input: NextPriorityInput): NextPriority {
  // 1. First enabled + incomplete Required Today item
  for (const key of REQUIRED_TODAY_ORDER) {
    if (!input.enabled[key]) continue;
    if (key === 'training' && !input.hasTrainingToday) continue;
    if (!input.completions[key]) {
      return { action: ITEM_ACTION[key], ...ITEM_PRIORITY[key] };
    }
  }

  // 3. Metrics retest due
  if (input.metricsRetestDue) {
    return { action: 'log_metrics', ...STATIC.log_metrics };
  }

  // 4. Fallback
  return { action: 'explore_lab', ...STATIC.explore_lab };
}

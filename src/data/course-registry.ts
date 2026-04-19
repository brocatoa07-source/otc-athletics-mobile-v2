/* ────────────────────────────────────────────────
 * Course Registry — Mental Mastery Course
 *
 * 11 sequential weeks, one mental skill per week.
 * Each skill has a shadow pattern the athlete is replacing
 * and a mastery pattern they are building toward.
 * ──────────────────────────────────────────────── */

import { AWARENESS_WEEK } from './awareness-course-data';
import { CONFIDENCE_WEEK } from './confidence-course-data';
import { FOCUS_WEEK } from './focus-course-data';
import { EMOTIONAL_CONTROL_WEEK } from './emotional-control-course-data';
import { RESILIENCE_WEEK } from './resilience-course-data';
import { ACCOUNTABILITY_WEEK } from './accountability-course-data';
import { COMMUNICATION_WEEK } from './communication-course-data';
import { PRESENCE_WEEK } from './presence-course-data';
import { COMPOSURE_WEEK } from './composure-course-data';
import { LEADERSHIP_WEEK } from './leadership-course-data';
import { FLOW_STATE_WEEK } from './flow-state-course-data';

// Re-export types from shared module
export type {
  OutlineSegment, CoachScience, CourseQuestion,
  CourseWeekContent, CourseEntry,
} from './course-types';

import type { CourseWeekContent, CourseEntry } from './course-types';

// ── Registry ───────────────────────────────────────

function entry(
  id: string,
  week: number,
  label: string,
  whatItBuilds: string,
  shadowPattern: string,
  shadowLooksLike: string,
  color: string,
  content: CourseWeekContent,
): CourseEntry {
  return {
    id,
    week,
    label,
    whatItBuilds,
    shadowPattern,
    shadowLooksLike,
    color,
    content,
    totalSections: content.outline.length,
  };
}

export const COURSE_REGISTRY: Record<string, CourseEntry> = {};

// Week 1
COURSE_REGISTRY['awareness'] = entry(
  'awareness', 1, 'Awareness',
  'Recognizing thoughts, emotions, and triggers in real time',
  'Autopilot',
  'Going through the motions, unaware of focus or emotion',
  '#8b5cf6',
  AWARENESS_WEEK,
);

// Week 2
COURSE_REGISTRY['confidence'] = entry(
  'confidence', 2, 'Confidence',
  'Trusting preparation and self-belief',
  'Perfectionism / Fear of Failure',
  'Only confident when things go perfectly',
  '#E10600',
  CONFIDENCE_WEEK,
);

// Week 3
COURSE_REGISTRY['focus'] = entry(
  'focus', 3, 'Focus',
  'Staying locked in pitch-to-pitch',
  'Distraction / Outcome Obsession',
  'Thinking about results or stats mid-game',
  '#3b82f6',
  FOCUS_WEEK,
);

// Week 4
COURSE_REGISTRY['emotional-control'] = entry(
  'emotional-control', 4, 'Emotional Control',
  'Regulating reactions and staying composed',
  'Overreaction / Suppression',
  'Slamming gear or shutting down after mistakes',
  '#ef4444',
  EMOTIONAL_CONTROL_WEEK,
);

// Week 5
COURSE_REGISTRY['resilience'] = entry(
  'resilience', 5, 'Resilience',
  'Bouncing back after failure',
  'Victim Mindset / Avoidance',
  'Blaming others or quitting mentally after errors',
  '#22c55e',
  RESILIENCE_WEEK,
);

// Week 6
COURSE_REGISTRY['accountability'] = entry(
  'accountability', 6, 'Accountability',
  'Taking ownership of actions and attitude',
  'Excuses / Blame',
  'Pointing fingers, externalizing problems',
  '#f59e0b',
  ACCOUNTABILITY_WEEK,
);

// Week 7
COURSE_REGISTRY['communication'] = entry(
  'communication', 7, 'Communication',
  'Clear expression and connection with coaches/teammates',
  'Assumptions / Poor Listening',
  'Misunderstanding feedback, tone, or intent',
  '#06b6d4',
  COMMUNICATION_WEEK,
);

// Week 8
COURSE_REGISTRY['presence'] = entry(
  'presence', 8, 'Presence',
  'Competing in the "now" moment',
  'Anxiety / Rumination',
  'Living in past mistakes or future fears',
  '#a855f7',
  PRESENCE_WEEK,
);

// Week 9
COURSE_REGISTRY['composure'] = entry(
  'composure', 9, 'Composure',
  'Maintaining calm body language and posture',
  'Frustration / Ego',
  'Emotional leak through visible frustration',
  '#64748b',
  COMPOSURE_WEEK,
);

// Week 10
COURSE_REGISTRY['leadership'] = entry(
  'leadership', 10, 'Leadership',
  'Modeling consistency, discipline, and energy',
  'Self-Centeredness / Inconsistency',
  'Low energy or lack of follow-through when struggling',
  '#ec4899',
  LEADERSHIP_WEEK,
);

// Week 11
COURSE_REGISTRY['flow-state'] = entry(
  'flow-state', 11, 'Flow State',
  'Competing in total immersion and freedom',
  'Over-Control / Tension',
  'Trying too hard, losing rhythm and feel',
  '#14b8a6',
  FLOW_STATE_WEEK,
);

/** Ordered course list (week 1 → 11) */
export const COURSE_LIST = Object.values(COURSE_REGISTRY).sort((a, b) => a.week - b.week);

/** All 11 course IDs in week order */
export const ALL_COURSE_IDS = COURSE_LIST.map((c) => c.id);

/* ────────────────────────────────────────────────
 * Course Registry — maps courseId to week data
 * Used by the shared course screen component.
 * ──────────────────────────────────────────────── */

import { WEEK_1, WEEK_2 } from './awareness-course-data';
import { WEEK_3, WEEK_4 } from './confidence-course-data';
import { WEEK_5, WEEK_6 } from './focus-course-data';
import { WEEK_7, WEEK_8 } from './emotional-control-course-data';
import { WEEK_9, WEEK_10 } from './resilience-course-data';
import { WEEK_11, WEEK_12 } from './accountability-course-data';

export interface OutlineSegment {
  segment: string;
  focus: string;
  objective: string;
}

export interface CoachScience {
  videoTitle: string;
  points: string[];
  playerAnalogy: string;
  baseballAnalogy: string;
}

export interface CourseQuestion {
  question: string;
  insight: string;
}

export interface CourseWeek {
  title: string;
  quote: string;
  objective?: string;
  outline: OutlineSegment[];
  coachScience: CoachScience;
  questions?: CourseQuestion[];
}

export interface CourseEntry {
  id: string;
  label: string;
  color: string;
  skillNum: number;
  shadow: CourseWeek;
  mastery: CourseWeek;
  /** Total outline segments across both weeks (for progress tracking) */
  totalSections: number;
  /** True for courses 7–11 whose content is not yet built */
  placeholder?: boolean;
}

export const COURSE_REGISTRY: Record<string, CourseEntry> = {
  awareness: {
    id: 'awareness',
    label: 'Awareness',
    color: '#8b5cf6',
    skillNum: 1,
    shadow: WEEK_1 as CourseWeek,
    mastery: WEEK_2 as CourseWeek,
    totalSections: WEEK_1.outline.length + WEEK_2.outline.length,
  },
  confidence: {
    id: 'confidence',
    label: 'Confidence',
    color: '#E10600',
    skillNum: 2,
    shadow: WEEK_3 as CourseWeek,
    mastery: WEEK_4 as CourseWeek,
    totalSections: WEEK_3.outline.length + WEEK_4.outline.length,
  },
  focus: {
    id: 'focus',
    label: 'Focus',
    color: '#3b82f6',
    skillNum: 3,
    shadow: WEEK_5 as CourseWeek,
    mastery: WEEK_6 as CourseWeek,
    totalSections: WEEK_5.outline.length + WEEK_6.outline.length,
  },
  'emotional-control': {
    id: 'emotional-control',
    label: 'Emotional Control',
    color: '#ef4444',
    skillNum: 4,
    shadow: WEEK_7 as CourseWeek,
    mastery: WEEK_8 as CourseWeek,
    totalSections: WEEK_7.outline.length + WEEK_8.outline.length,
  },
  resilience: {
    id: 'resilience',
    label: 'Resilience',
    color: '#22c55e',
    skillNum: 5,
    shadow: WEEK_9 as CourseWeek,
    mastery: WEEK_10 as CourseWeek,
    totalSections: WEEK_9.outline.length + WEEK_10.outline.length,
  },
  accountability: {
    id: 'accountability',
    label: 'Accountability',
    color: '#f59e0b',
    skillNum: 6,
    shadow: WEEK_11 as CourseWeek,
    mastery: WEEK_12 as CourseWeek,
    totalSections: WEEK_11.outline.length + WEEK_12.outline.length,
  },
};

/* ─── Placeholder stub for courses 7–11 ─────────── */

const PLACEHOLDER_WEEK: CourseWeek = {
  title: 'Coming Soon',
  quote: 'This module is being built.',
  outline: [],
  coachScience: {
    videoTitle: 'Content in Development',
    points: ['Full course content is being developed.'],
    playerAnalogy: '',
    baseballAnalogy: '',
  },
};

/** Advanced courses 7–11: visible as placeholders, gated behind 1–6 completion */

COURSE_REGISTRY['communication'] = {
  id: 'communication',
  label: 'Communication',
  color: '#06b6d4',
  skillNum: 7,
  shadow: PLACEHOLDER_WEEK,
  mastery: PLACEHOLDER_WEEK,
  totalSections: 0,
  placeholder: true,
};

COURSE_REGISTRY['presence'] = {
  id: 'presence',
  label: 'Presence',
  color: '#a855f7',
  skillNum: 8,
  shadow: PLACEHOLDER_WEEK,
  mastery: PLACEHOLDER_WEEK,
  totalSections: 0,
  placeholder: true,
};

COURSE_REGISTRY['composure'] = {
  id: 'composure',
  label: 'Composure',
  color: '#64748b',
  skillNum: 9,
  shadow: PLACEHOLDER_WEEK,
  mastery: PLACEHOLDER_WEEK,
  totalSections: 0,
  placeholder: true,
};

COURSE_REGISTRY['leadership'] = {
  id: 'leadership',
  label: 'Leadership',
  color: '#ec4899',
  skillNum: 10,
  shadow: PLACEHOLDER_WEEK,
  mastery: PLACEHOLDER_WEEK,
  totalSections: 0,
  placeholder: true,
};

COURSE_REGISTRY['flow-state'] = {
  id: 'flow-state',
  label: 'Flow State',
  color: '#14b8a6',
  skillNum: 11,
  shadow: PLACEHOLDER_WEEK,
  mastery: PLACEHOLDER_WEEK,
  totalSections: 0,
  placeholder: true,
};

export const COURSE_LIST = Object.values(COURSE_REGISTRY);

/** IDs of the 6 core courses that must be completed to unlock advanced courses */
export const CORE_COURSE_IDS = ['awareness', 'confidence', 'focus', 'emotional-control', 'resilience', 'accountability'] as const;

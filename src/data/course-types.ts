/* ────────────────────────────────────────────────
 * Course Types — shared by registry and data files
 * ──────────────────────────────────────────────── */

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

export interface CourseWeekContent {
  title: string;
  quote: string;
  objective?: string;
  outline: OutlineSegment[];
  coachScience: CoachScience;
  questions?: CourseQuestion[];
  /** Lesson — the core teaching for this week */
  lesson: string;
  /** Primary tool or exercise for the week */
  tool: string;
  /** Meditation focus for the week */
  meditation: string;
  /** Journal prompt for the week */
  journalPrompt: string;
  /** Weekly challenge — the behavioral homework */
  weeklyChallenge: string;
  /** End-of-week reflection question */
  reflection: string;
}

export interface CourseEntry {
  id: string;
  /** Week number (1–11) */
  week: number;
  /** Display label */
  label: string;
  /** The skill being built */
  whatItBuilds: string;
  /** The shadow pattern being replaced */
  shadowPattern: string;
  /** What the shadow looks like in competition */
  shadowLooksLike: string;
  /** Accent color */
  color: string;
  /** Week content — lesson, outline, exercises, etc. */
  content: CourseWeekContent;
  /** Total outline segments (for progress tracking) */
  totalSections: number;
}

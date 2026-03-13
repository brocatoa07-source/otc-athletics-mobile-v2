/* ────────────────────────────────────────────────
 * MENTAL VAULT — Archetype → Personalized Path
 * Maps each of the 6 archetypes to recommended
 * courses, tools, journals, and focus skills.
 * ──────────────────────────────────────────────── */

export interface ArchetypePath {
  slug: string;
  label: string;
  color: string;
  tagline: string;
  recommendedCourse: {
    id: string;
    label: string;
    route: string;
  };
  topTools: string[];
  journalType: {
    key: string;
    label: string;
  };
  focusSkills: string[];
}

export const ARCHETYPE_PATHS: Record<string, ArchetypePath> = {
  reactor: {
    slug: 'reactor',
    label: 'The Reactor',
    color: '#ef4444',
    tagline: 'Emotion → Reaction → Regret',
    recommendedCourse: {
      id: 'emotional-control',
      label: 'Emotional Control',
      route: '/(app)/training/mental/course?id=emotional-control',
    },
    topTools: ['At-Bat Reset', 'Breathing & Regulation', 'Visualization'],
    journalType: { key: 'daily', label: 'Daily Entry' },
    focusSkills: ['Emotional Control', 'Composure', 'Resilience'],
  },
  overthinker: {
    slug: 'overthinker',
    label: 'The Overthinker',
    color: '#3b82f6',
    tagline: 'Analysis → Paralysis → Tension',
    recommendedCourse: {
      id: 'focus',
      label: 'Focus',
      route: '/(app)/training/mental/course?id=focus',
    },
    topTools: ['At-Bat Reset', 'Breathing & Regulation', 'Self-Talk'],
    journalType: { key: 'mental_reset', label: 'Daily Mental Reset' },
    focusSkills: ['Focus', 'Presence', 'Confidence'],
  },
  avoider: {
    slug: 'avoider',
    label: 'The Avoider',
    color: '#8b5cf6',
    tagline: 'Avoid Discomfort → Play Small',
    recommendedCourse: {
      id: 'confidence',
      label: 'Confidence',
      route: '/(app)/training/mental/course?id=confidence',
    },
    topTools: ['Self-Talk', 'Visualization', 'Pre-Game Routine'],
    journalType: { key: 'game_day', label: 'Game Day' },
    focusSkills: ['Confidence', 'Resilience', 'Presence'],
  },
  performer: {
    slug: 'performer',
    label: 'The Performer',
    color: '#f59e0b',
    tagline: 'Plays for Approval',
    recommendedCourse: {
      id: 'awareness',
      label: 'Awareness',
      route: '/(app)/training/mental/course?id=awareness',
    },
    topTools: ['Self-Talk', 'Pre-Game Routine', 'Post-Game Review'],
    journalType: { key: 'weekly_reflection', label: 'Weekly Reflection' },
    focusSkills: ['Awareness', 'Confidence', 'Focus'],
  },
  doubter: {
    slug: 'doubter',
    label: 'The Doubter',
    color: '#06b6d4',
    tagline: '"I hope I do well."',
    recommendedCourse: {
      id: 'confidence',
      label: 'Confidence',
      route: '/(app)/training/mental/course?id=confidence',
    },
    topTools: ['Self-Talk', 'Visualization', 'Breathing & Regulation'],
    journalType: { key: 'daily', label: 'Daily Entry' },
    focusSkills: ['Confidence', 'Resilience', 'Accountability'],
  },
  driver: {
    slug: 'driver',
    label: 'The Driver',
    color: '#22c55e',
    tagline: 'Push → Grind → Override → Burnout',
    recommendedCourse: {
      id: 'awareness',
      label: 'Awareness',
      route: '/(app)/training/mental/course?id=awareness',
    },
    topTools: ['Post-Game Review', 'Breathing & Regulation', 'Pre-Game Routine'],
    journalType: { key: 'weekly', label: 'Weekly Review' },
    focusSkills: ['Awareness', 'Presence', 'Emotional Control'],
  },
};

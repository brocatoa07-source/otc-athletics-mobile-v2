/**
 * skillsJournal.ts — Single source of truth for the 11 mental skills.
 *
 * Used by:
 *   - mental/vault-hub.tsx    (library + tools tabs)
 *   - mental/skills-journal.tsx (list screen)
 *   - mental/skill-detail.tsx   (parameterized detail screen)
 */

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

export interface MentalSkill {
  key: string;
  num: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  builds: string;
  shadow: string;
  looksLike: string;
  /** Only skills 1–6 have a 2-week course */
  courseId?: string;
  courseRoute?: string;
  courseLabel?: string;
  courseColor?: string;
}

export const MENTAL_SKILLS: MentalSkill[] = [
  {
    key: 'awareness',
    num: 1,
    name: 'Awareness',
    icon: 'eye-outline',
    color: '#8b5cf6',
    builds: 'Recognizing thoughts, emotions, and triggers in real time',
    shadow: 'Autopilot',
    looksLike: 'Going through the motions, unaware of focus or emotion',
    courseId: 'awareness',
    courseRoute: '/(app)/training/mental/course?id=awareness',
    courseLabel: 'Awareness',
    courseColor: '#8b5cf6',
  },
  {
    key: 'confidence',
    num: 2,
    name: 'Confidence',
    icon: 'shield-checkmark-outline',
    color: Colors.primary,
    builds: 'Trusting preparation and self-belief',
    shadow: 'Perfectionism / Fear of Failure',
    looksLike: 'Only confident when things go perfectly',
    courseId: 'confidence',
    courseRoute: '/(app)/training/mental/course?id=confidence',
    courseLabel: 'Confidence',
    courseColor: Colors.primary,
  },
  {
    key: 'focus',
    num: 3,
    name: 'Focus',
    icon: 'locate-outline',
    color: '#3b82f6',
    builds: 'Staying locked in pitch-to-pitch',
    shadow: 'Distraction / Outcome Obsession',
    looksLike: 'Thinking about results or stats mid-game',
    courseId: 'focus',
    courseRoute: '/(app)/training/mental/course?id=focus',
    courseLabel: 'Focus',
    courseColor: '#3b82f6',
  },
  {
    key: 'emotional_control',
    num: 4,
    name: 'Emotional Control',
    icon: 'pulse-outline',
    color: '#ef4444',
    builds: 'Regulating reactions and staying composed',
    shadow: 'Overreaction / Suppression',
    looksLike: 'Slamming gear or shutting down after mistakes',
    courseId: 'emotional-control',
    courseRoute: '/(app)/training/mental/course?id=emotional-control',
    courseLabel: 'Emotional Control',
    courseColor: '#ef4444',
  },
  {
    key: 'resilience',
    num: 5,
    name: 'Resilience',
    icon: 'trending-up-outline',
    color: '#22c55e',
    builds: 'Bouncing back after failure',
    shadow: 'Victim Mindset / Avoidance',
    looksLike: 'Blaming others or quitting mentally after errors',
    courseId: 'resilience',
    courseRoute: '/(app)/training/mental/course?id=resilience',
    courseLabel: 'Resilience',
    courseColor: '#22c55e',
  },
  {
    key: 'accountability',
    num: 6,
    name: 'Accountability',
    icon: 'hand-left-outline',
    color: '#f59e0b',
    builds: 'Taking ownership of actions and attitude',
    shadow: 'Excuses / Blame',
    looksLike: 'Pointing fingers, externalizing problems',
    courseId: 'accountability',
    courseRoute: '/(app)/training/mental/course?id=accountability',
    courseLabel: 'Accountability',
    courseColor: '#f59e0b',
  },
  {
    key: 'communication',
    num: 7,
    name: 'Communication',
    icon: 'chatbubbles-outline',
    color: '#06b6d4',
    builds: 'Clear expression and connection with coaches/teammates',
    shadow: 'Assumptions / Poor Listening',
    looksLike: 'Misunderstanding feedback, tone, or intent',
  },
  {
    key: 'presence',
    num: 8,
    name: 'Presence',
    icon: 'footsteps-outline',
    color: '#a855f7',
    builds: 'Competing in the "now" moment',
    shadow: 'Anxiety / Rumination',
    looksLike: 'Living in past mistakes or future fears',
  },
  {
    key: 'composure',
    num: 9,
    name: 'Composure',
    icon: 'snow-outline',
    color: '#64748b',
    builds: 'Maintaining calm body language and posture',
    shadow: 'Frustration / Ego',
    looksLike: 'Emotional leak through visible frustration',
  },
  {
    key: 'leadership',
    num: 10,
    name: 'Leadership',
    icon: 'flag-outline',
    color: '#ec4899',
    builds: 'Modeling consistency, discipline, and energy',
    shadow: 'Self-Centeredness / Inconsistency',
    looksLike: 'Low energy or lack of follow-through when struggling',
  },
  {
    key: 'flow_state',
    num: 11,
    name: 'Flow State',
    icon: 'water-outline',
    color: '#14b8a6',
    builds: 'Competing in total immersion and freedom',
    shadow: 'Over-Control / Tension',
    looksLike: 'Trying too hard, losing rhythm and feel',
  },
];

/** Map skillKey → MentalSkill */
export const SKILLS_BY_KEY = Object.fromEntries(
  MENTAL_SKILLS.map((s) => [s.key, s]),
) as Record<string, MentalSkill>;

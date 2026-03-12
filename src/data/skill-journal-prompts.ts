import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

export type SkillJournalType =
  | 'skill_awareness'
  | 'skill_confidence'
  | 'skill_focus'
  | 'skill_emotional_control'
  | 'skill_resilience'
  | 'skill_accountability'
  | 'skill_communication'
  | 'skill_presence'
  | 'skill_composure'
  | 'skill_leadership'
  | 'skill_flow_state';

export interface SkillJournalConfig {
  label: string;
  skillName: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  prompts: string[];
}

export const SKILL_JOURNAL_CONFIG: Record<SkillJournalType, SkillJournalConfig> = {
  skill_awareness: {
    label: 'Awareness Journal',
    skillName: 'Awareness',
    icon: 'eye-outline',
    color: '#8b5cf6',
    prompts: [
      'What emotion or thought did you notice during competition today?',
      'Was there a moment you caught yourself on autopilot? What happened?',
      'What triggered a shift in your focus or energy today?',
    ],
  },
  skill_confidence: {
    label: 'Confidence Journal',
    skillName: 'Confidence',
    icon: 'shield-checkmark-outline',
    color: Colors.primary,
    prompts: [
      'What is one thing from your preparation this week that you can trust?',
      'Did you catch yourself only feeling confident when things went well? What happened?',
      'Write one statement about yourself as a competitor that you believe is true.',
    ],
  },
  skill_focus: {
    label: 'Focus Journal',
    skillName: 'Focus',
    icon: 'locate-outline',
    color: '#3b82f6',
    prompts: [
      'Was there a moment you caught yourself thinking about results mid-game?',
      'What was your pitch-to-pitch reset process today?',
      'What pulled your attention away from the present moment?',
    ],
  },
  skill_emotional_control: {
    label: 'Emotional Control Journal',
    skillName: 'Emotional Control',
    icon: 'pulse-outline',
    color: '#ef4444',
    prompts: [
      'Describe a moment where your reaction matched the level of the situation.',
      'Did you suppress or overreact to anything today? What happened?',
      'What is one emotion that tried to control you today, and how did you handle it?',
    ],
  },
  skill_resilience: {
    label: 'Resilience Journal',
    skillName: 'Resilience',
    icon: 'trending-up-outline',
    color: '#22c55e',
    prompts: [
      'What failure or setback did you face recently, and how did you respond?',
      'Did you catch a victim-mindset thought today? What was it?',
      'What is one thing you are choosing to bounce back from right now?',
    ],
  },
  skill_accountability: {
    label: 'Accountability Journal',
    skillName: 'Accountability',
    icon: 'hand-left-outline',
    color: '#f59e0b',
    prompts: [
      'What is one thing you could have done better today that was 100% in your control?',
      'Did you catch yourself making an excuse or blaming someone else? What was it?',
      'What is one commitment you are making to yourself for tomorrow?',
    ],
  },
  skill_communication: {
    label: 'Communication Journal',
    skillName: 'Communication',
    icon: 'chatbubbles-outline',
    color: '#06b6d4',
    prompts: [
      'Did you have a conversation with a coach or teammate today that went well? What made it work?',
      'Was there a moment where you assumed instead of asking? What happened?',
      'How did you respond to feedback today?',
    ],
  },
  skill_presence: {
    label: 'Presence Journal',
    skillName: 'Presence',
    icon: 'footsteps-outline',
    color: '#a855f7',
    prompts: [
      'Was there a moment today where you were stuck in the past or worrying about the future?',
      'What does it feel like when you are competing in the "now"?',
      'What pulled you out of the present moment during competition?',
    ],
  },
  skill_composure: {
    label: 'Composure Journal',
    skillName: 'Composure',
    icon: 'snow-outline',
    color: '#64748b',
    prompts: [
      'What did your body language communicate to your teammates today?',
      'Was there a moment where frustration leaked through your posture or expression?',
      'What does "calm body language under pressure" look like for you?',
    ],
  },
  skill_leadership: {
    label: 'Leadership Journal',
    skillName: 'Leadership',
    icon: 'flag-outline',
    color: '#ec4899',
    prompts: [
      'What energy did you bring to the field or weight room today?',
      'Did you model consistency and discipline today, or did you show up inconsistently?',
      'Who on your team needed leadership from you today, and did you provide it?',
    ],
  },
  skill_flow_state: {
    label: 'Flow State Journal',
    skillName: 'Flow State',
    icon: 'water-outline',
    color: '#14b8a6',
    prompts: [
      'Describe a moment where you felt completely immersed and competing freely.',
      'Did you catch yourself trying too hard or over-controlling today?',
      'What conditions help you get into flow? What disrupts it?',
    ],
  },
};

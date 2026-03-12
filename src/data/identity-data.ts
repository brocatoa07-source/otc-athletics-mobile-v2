export const IDENTITY_PROMPTS = [
  'I am the type of player who shows up every day regardless of how I feel.',
  'I am the type of player who stays disciplined at the plate.',
  'I am the type of player who does the work when nobody is watching.',
  'I am the type of player who leads by example.',
  'I am the type of player who bounces back after failure.',
  'I am the type of player who controls what I can control.',
  'I am the type of player who competes on every pitch.',
  'I am the type of player who takes care of my body.',
];

export const HABIT_LOOP_STEPS = [
  { key: 'cue', label: 'CUE', icon: 'notifications-outline' as const, color: '#3b82f6', desc: 'The trigger that initiates the behavior. Make it obvious.', example: 'My alarm goes off at 6 AM' },
  { key: 'craving', label: 'CRAVING', icon: 'flame-outline' as const, color: '#f59e0b', desc: 'The motivation or desire behind the habit. Make it attractive.', example: 'I want to feel strong and prepared' },
  { key: 'response', label: 'RESPONSE', icon: 'arrow-forward-outline' as const, color: '#22c55e', desc: 'The actual habit or action you perform. Make it easy.', example: 'I do my morning mobility routine for 10 min' },
  { key: 'reward', label: 'REWARD', icon: 'trophy-outline' as const, color: '#e11d48', desc: 'The positive reinforcement. Make it satisfying.', example: 'I check it off and feel accomplished before anyone else is awake' },
];

export const HABIT_STACKING_EXAMPLES = [
  { current: 'I finish my last class', next: 'I put on my workout clothes' },
  { current: 'I park at the field', next: 'I do 5 minutes of visualization' },
  { current: 'I eat dinner', next: 'I write in my journal for 3 minutes' },
  { current: 'I brush my teeth at night', next: 'I review my identity statement' },
  { current: 'I wake up', next: 'I drink 16 oz of water' },
];

export interface HabitItem {
  id: string;
  label: string;
}

export const DEFAULT_HABITS: HabitItem[] = [
  { id: 'mobility', label: 'Morning mobility routine' },
  { id: 'visualize', label: 'Visualize before practice' },
  { id: 'journal', label: 'Journal reflection' },
  { id: 'hydration', label: 'Hydration goal (half bodyweight in oz)' },
  { id: 'development', label: 'Read or listen to 10 min of development' },
  { id: 'breathing', label: 'Pre-game breathing routine' },
  { id: 'review', label: 'Post-game review (3 things)' },
];

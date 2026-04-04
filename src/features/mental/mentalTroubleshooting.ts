/**
 * Mental Troubleshooting — reactive problem → solution system.
 *
 * "When something is wrong, help me fix it."
 */

export interface MentalProblem {
  id: string;
  title: string;
  icon: string;
  color: string;
  whatsHappening: string;
  whyItHappens: string;
  whatToDo: string[];
  tools: string[];
  resetRoutine: string;
  journalPrompts: string[];
  challenge: string;
}

export const MENTAL_PROBLEMS: MentalProblem[] = [
  {
    id: 'lose-confidence',
    title: 'I lose confidence after I fail',
    icon: 'shield-outline', color: '#ef4444',
    whatsHappening: 'One bad at-bat or one mistake and your confidence crashes. You start doubting yourself and playing smaller.',
    whyItHappens: 'Your confidence is tied to outcomes instead of preparation. When the result is bad, you feel like YOU are bad.',
    whatToDo: [
      'Build an evidence log — write 3 things you did well after every game.',
      'Separate outcome from effort. Bad results do not mean bad player.',
      'Use a power statement before your next at-bat: "I trust my work."',
    ],
    tools: ['Evidence Log', 'Power Statement', 'Highlight Reel Visualization'],
    resetRoutine: 'Step out. Deep breath. Say your power statement. Step in ready.',
    journalPrompts: ['What did I do well today despite the result?', 'What evidence proves I am capable?'],
    challenge: 'After your next bad at-bat, write 2 things you did well before you think about the result.',
  },
  {
    id: 'nervous-before-games',
    title: 'I get nervous before games',
    icon: 'pulse-outline', color: '#f59e0b',
    whatsHappening: 'Butterflies, racing heart, tight muscles, overthinking before the game starts.',
    whyItHappens: 'You are focused on what could go wrong instead of what you can control. Your body is in fight-or-flight.',
    whatToDo: [
      'Build a pre-game routine you control. Same warm-up, same music, same cues.',
      'Use physiological sighs to calm your nervous system.',
      'Reframe nerves as excitement — your body is getting ready to compete.',
    ],
    tools: ['Physiological Sigh', 'Pre-Game Routine', 'Reframe Script'],
    resetRoutine: 'Double inhale through nose. Long exhale through mouth. Repeat 3 times.',
    journalPrompts: ['What am I actually afraid of?', 'What does my best pre-game routine look like?'],
    challenge: 'Before your next game, run your full pre-game routine with zero deviation.',
  },
  {
    id: 'mad-after-mistakes',
    title: 'I get mad after mistakes',
    icon: 'flame-outline', color: '#ef4444',
    whatsHappening: 'Slamming helmet, bad body language, bringing one at-bat into the next.',
    whyItHappens: 'Emotional carryover. You are reacting to the last play instead of competing in the next one.',
    whatToDo: [
      'Build a 10-second reset. Step out, breathe, reset body language.',
      'Use the "flush it" cue — say it, do a physical gesture, and move on.',
      'Practice controlled body language even when you feel angry.',
    ],
    tools: ['10-Second Reset', 'Body Language Reset', 'Release Breath'],
    resetRoutine: 'Step out. Shoulders back. Deep breath. Say "next pitch." Step in.',
    journalPrompts: ['What triggered my emotions today?', 'How fast did I reset after my worst moment?'],
    challenge: 'After your next mistake, reset in under 10 seconds with zero negative body language.',
  },
  {
    id: 'cant-focus',
    title: "I can't focus in games",
    icon: 'eye-outline', color: '#3b82f6',
    whatsHappening: 'Mind wandering during at-bats, losing track of the count, thinking about other things.',
    whyItHappens: 'No focus anchor. Without a cue word or routine, your brain has nowhere to lock in.',
    whatToDo: [
      'Pick one cue word for the game. Use it before every pitch.',
      'Build a between-pitch routine that brings you back.',
      'Practice focal lock drills — 30 seconds of single-point focus.',
    ],
    tools: ['Cue Word Practice', 'Focal Lock Drill', 'Between-Pitch Routine'],
    resetRoutine: 'Say your cue word. Lock eyes on one point. Breathe. Compete.',
    journalPrompts: ['When was I most locked in today?', 'What broke my focus?'],
    challenge: 'Use your cue word before every single pitch in your next game.',
  },
  {
    id: 'overthink',
    title: 'I overthink',
    icon: 'cloud-outline', color: '#8b5cf6',
    whatsHappening: 'Thinking about mechanics during at-bats, replaying scenarios, paralysis by analysis.',
    whyItHappens: 'You are trying to think your way through something that needs to be felt. Trust your training.',
    whatToDo: [
      'Separate practice brain from game brain. Practice = think. Game = compete.',
      'Use one simple cue instead of a checklist.',
      'Visualization before the game replaces in-game thinking.',
    ],
    tools: ['One-Cue System', 'Pre-Game Visualization', 'Compete Mode Switch'],
    resetRoutine: 'Take a breath. Say "see ball, hit ball." Trust your body.',
    journalPrompts: ['When did I overthink today?', 'What would it look like to just compete?'],
    challenge: 'In your next at-bat, use only ONE cue. No mechanical thoughts allowed.',
  },
  {
    id: 'too-much-pressure',
    title: 'I put too much pressure on myself',
    icon: 'barbell-outline', color: '#f97316',
    whatsHappening: 'Every at-bat feels like it defines you. You grip tighter, try harder, and perform worse.',
    whyItHappens: 'Self-worth is tied to performance. You think the result determines your value.',
    whatToDo: [
      'Remind yourself: pressure is a privilege. Only important moments have pressure.',
      'Focus on process, not outcome. "Win the pitch" not "win the game."',
      'Build an identity that is bigger than one at-bat.',
    ],
    tools: ['Pressure Reframe', 'Process Focus Cue', 'Identity Statement'],
    resetRoutine: 'Deep breath. "This moment does not define me. But I will own it."',
    journalPrompts: ['Why do I put so much pressure on myself?', 'What would it look like to play free?'],
    challenge: 'Before your next high-pressure moment, say "pressure is a privilege" and mean it.',
  },
  {
    id: 'good-practice-bad-games',
    title: 'I play good in practice but bad in games',
    icon: 'swap-horizontal-outline', color: '#0891b2',
    whatsHappening: 'You crush it in the cage but can\'t transfer to games. Practice feels easy, games feel hard.',
    whyItHappens: 'Practice is predictable. Games are chaotic. You need to train in chaos.',
    whatToDo: [
      'Add consequences to practice. Make it harder than the game.',
      'Practice with competition rounds, not just reps.',
      'Build a game-day routine that bridges practice and competition.',
    ],
    tools: ['Competition Rounds', 'Game-Day Routine Builder', 'Pressure Visualization'],
    resetRoutine: 'Before the game, visualize 3 at-bats going well. Feel the confidence transfer.',
    journalPrompts: ['What is different between my practice and game mindset?', 'What would it take to compete the same way in both?'],
    challenge: 'Add one competition element to your next practice session.',
  },
  {
    id: 'bad-body-language',
    title: 'I have bad body language',
    icon: 'body-outline', color: '#6b7280',
    whatsHappening: 'Head down, slouching, slamming equipment. Everyone can see you\'re frustrated.',
    whyItHappens: 'Your body is expressing emotions your mind hasn\'t processed. The body leads the mind.',
    whatToDo: [
      'Fake it until you make it. Stand tall even when you feel bad.',
      'Build a body language reset: shoulders back, chin up, breathe.',
      'Your teammates are watching. Leaders look the same after failure and success.',
    ],
    tools: ['Body Language Reset', 'Leadership Posture Drill', 'Composure Practice'],
    resetRoutine: 'Stand up. Shoulders back. Chin level. Walk with purpose. No one knows how you feel inside.',
    journalPrompts: ['What does my body language say about me after mistakes?', 'What would a leader look like in that moment?'],
    challenge: 'After your next bad play, make your body language look identical to after a great play.',
  },
  {
    id: 'scared-to-fail',
    title: "I'm scared to fail",
    icon: 'warning-outline', color: '#ef4444',
    whatsHappening: 'Playing safe, not swinging at your pitch, avoiding big moments.',
    whyItHappens: 'Fear of failure means you are focused on avoiding bad outcomes instead of chasing good ones.',
    whatToDo: [
      'Redefine failure. Failure is not the result — failure is not competing.',
      'Attack the moment instead of avoiding it.',
      'The best players fail more than anyone. They just keep competing.',
    ],
    tools: ['Failure Reframe', 'Attack Mode Cue', 'Evidence Log'],
    resetRoutine: '"I would rather fail competing than succeed playing safe." Step in and swing.',
    journalPrompts: ['What am I actually afraid of?', 'What would I do if I couldn\'t fail?'],
    challenge: 'In your next at-bat, swing with full intent. No holding back.',
  },
  {
    id: 'cant-let-go',
    title: "I can't let go of mistakes",
    icon: 'refresh-outline', color: '#f59e0b',
    whatsHappening: 'One bad play follows you for the rest of the game. You replay it over and over.',
    whyItHappens: 'No reset routine. Without a system to let go, your brain holds on.',
    whatToDo: [
      'Build a physical reset gesture — touch your hat, adjust your gloves, breathe.',
      'The best hitters forget faster than anyone.',
      'Use the "flush it" technique: acknowledge, release, refocus.',
    ],
    tools: ['Flush It Technique', '10-Second Reset', 'Release Breath'],
    resetRoutine: 'Acknowledge what happened. Take one breath. Say "next pitch." Let go physically.',
    journalPrompts: ['What mistake did I hold onto today?', 'How fast can I reset next time?'],
    challenge: 'After your next mistake, use a physical reset gesture and move on in under 5 seconds.',
  },
];

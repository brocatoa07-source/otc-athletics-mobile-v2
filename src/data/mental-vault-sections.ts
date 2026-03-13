/**
 * Mental Vault — Sections + Tool Cards
 *
 * 9 sections, 5 tools each (45 total).
 * Walk/Single tier: no mental access.
 * Double: limited preview (first 2 tools per section free).
 * Triple+: full access.
 */

import { Ionicons } from '@expo/vector-icons';

/* ─── Tool Card ──────────────────────────────────────────── */

export interface MentalToolCard {
  name: string;
  fixes: string;
  howTo: string;
  focus: string;
}

/* ─── Section ─────────────────────────────────────────────── */

export interface MentalVaultSection {
  key: string;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tools: MentalToolCard[];
  /** Number of tools free for Double tier (counted from top of list) */
  freeCount: number;
  /** Placeholder section — no tools yet */
  isPlaceholder?: boolean;
}

/* ─── Sections ────────────────────────────────────────────── */

export const MENTAL_VAULT_SECTIONS: MentalVaultSection[] = [
  // ── 1. Awareness ──────────────────────────────────────────
  {
    key: 'awareness',
    label: 'Awareness',
    description: 'Know what you\'re feeling before it controls you.',
    icon: 'eye-outline',
    color: '#8b5cf6',
    freeCount: 2,
    tools: [
      {
        name: 'Body Scan Check-In',
        fixes: 'Unaware of tension, playing on autopilot.',
        howTo: 'Before your first rep, scan head to toe. Notice jaw, shoulders, hands, stomach. Name any tension. Breathe into it.',
        focus: 'Notice before you react.',
      },
      {
        name: 'Emotion Naming',
        fixes: 'Vague frustration, unidentified anxiety.',
        howTo: 'When you feel off, name the exact emotion: angry, anxious, embarrassed, bored. Naming it reduces its power by 50%.',
        focus: 'Name it to tame it.',
      },
      {
        name: 'Thought Logging',
        fixes: 'Negative self-talk running unchecked.',
        howTo: 'After practice or a game, write down the 3 loudest thoughts you had. Were they helpful or harmful? Replace harmful ones with cues.',
        focus: 'Catch the pattern.',
      },
      {
        name: 'Autopilot Check',
        fixes: 'Going through the motions without purpose.',
        howTo: 'Between innings or reps, ask: "Am I here right now?" If the answer is no, take one deep breath and re-engage with a cue word.',
        focus: 'Be here now.',
      },
      {
        name: 'Present Moment Anchor',
        fixes: 'Mind drifting to past mistakes or future outcomes.',
        howTo: 'Pick one physical sensation: feet in cleats, bat in hands, wind on face. Lock your attention there for 5 seconds. Return to competing.',
        focus: 'Anchor to now.',
      },
    ],
  },

  // ── 2. Focus ──────────────────────────────────────────────
  {
    key: 'focus',
    label: 'Focus',
    description: 'Control your attention. Own every pitch.',
    icon: 'locate-outline',
    color: '#3b82f6',
    freeCount: 2,
    tools: [
      {
        name: 'Spotlight Drill',
        fixes: 'Scattered attention, can\'t lock in pitch-to-pitch.',
        howTo: 'Pick one thing to focus on for 5 pitches: pitcher\'s release point. Nothing else matters. Narrow your spotlight.',
        focus: 'Narrow the spotlight.',
      },
      {
        name: 'Pitch-to-Pitch Reset',
        fixes: 'Carrying the last pitch into the next one.',
        howTo: 'After every pitch: step out, deep breath, cue word, step in. Same routine every time. The last pitch is dead.',
        focus: 'Reset. Reload. Compete.',
      },
      {
        name: 'Distraction Release',
        fixes: 'Losing focus to noise, crowd, scoreboard.',
        howTo: 'When you catch yourself drifting, say "release" internally. Let the distraction go like exhaling smoke. Return to your focal point.',
        focus: 'Release and return.',
      },
      {
        name: 'Anchor Breathing',
        fixes: 'Shallow breathing, tight muscles, racing mind.',
        howTo: 'Inhale 4 counts through nose, exhale 6 counts through mouth. Repeat twice. Your body can\'t be anxious and breathe slowly at the same time.',
        focus: 'Breath controls the body.',
      },
      {
        name: 'Focus Countdown',
        fixes: 'Can\'t sustain attention for a full at-bat.',
        howTo: 'Count down from 5 as you step into the box. By 1, you\'re locked in. Nothing exists except the pitcher\'s hand.',
        focus: '5-4-3-2-1. Locked in.',
      },
    ],
  },

  // ── 3. Emotional Control ──────────────────────────────────
  {
    key: 'emotional-control',
    label: 'Emotional Control',
    description: 'Feel everything. Let nothing control you.',
    icon: 'pulse-outline',
    color: '#ef4444',
    freeCount: 2,
    tools: [
      {
        name: 'Emotion Labeling',
        fixes: 'Emotions hijacking performance before you realize it.',
        howTo: 'The moment you feel a surge — anger, panic, shame — label it: "That\'s frustration." Labeling activates your thinking brain and reduces the emotional spike.',
        focus: 'Label the emotion.',
      },
      {
        name: 'Body Release Scan',
        fixes: 'Carrying physical tension from emotional reactions.',
        howTo: 'Find where the emotion lives: jaw? fists? shoulders? Unclench it. Release the tension on a long exhale. Emotion leaves when the body softens.',
        focus: 'Soften to compete.',
      },
      {
        name: 'Anger-to-Energy Conversion',
        fixes: 'Anger turning destructive instead of productive.',
        howTo: 'When anger hits, don\'t suppress it. Channel it. Clap your hands, say "Let\'s go," and redirect the fire into competitive intensity.',
        focus: 'Use it, don\'t lose it.',
      },
      {
        name: '4-7-8 Breathing Reset',
        fixes: 'Panic, chest tightness, racing heart.',
        howTo: 'Inhale 4 counts. Hold 7 counts. Exhale 8 counts. One rep changes your nervous system state. Two reps and you\'re back.',
        focus: 'Slow the system down.',
      },
      {
        name: 'Tame the Trigger',
        fixes: 'Same situations always causing the same emotional spiral.',
        howTo: 'Identify your #1 trigger (bad call, error, coach). Pre-plan your response: "When X happens, I will Y." Practice the response until it\'s automatic.',
        focus: 'Plan the response.',
      },
    ],
  },

  // ── 4. Confidence ─────────────────────────────────────────
  {
    key: 'confidence',
    label: 'Confidence',
    description: 'Build confidence you own — not confidence you rent.',
    icon: 'shield-checkmark-outline',
    color: '#f59e0b',
    freeCount: 2,
    tools: [
      {
        name: 'Proof Stacking',
        fixes: 'Confidence that disappears after one bad game.',
        howTo: 'Every day, write down 3 pieces of proof that you belong: a good rep, a smart adjustment, a moment of effort. Stack evidence for yourself.',
        focus: 'Stack the proof.',
      },
      {
        name: 'Owned vs Rented Check',
        fixes: 'Confidence based only on recent results.',
        howTo: 'Ask: "Is my confidence based on last game (rented) or my preparation (owned)?" Owned confidence survives bad days. Rented confidence dies with one mistake.',
        focus: 'Own it. Don\'t rent it.',
      },
      {
        name: 'Box Routine',
        fixes: 'No consistent pre-at-bat mental routine.',
        howTo: 'Build a 4-step box routine: 1) Breath 2) Cue word 3) Visualize 4) Step in with intent. Same routine every at-bat. Confidence comes from consistency.',
        focus: 'Same routine. Every time.',
      },
      {
        name: 'Power Statement',
        fixes: 'Negative self-talk undermining belief.',
        howTo: 'Write one statement about yourself that is true and powerful. Say it before every at-bat. "I am prepared. I compete." Make it yours.',
        focus: 'Say it. Believe it. Be it.',
      },
      {
        name: 'Perfectionism Audit',
        fixes: 'Perfectionism destroying enjoyment and performance.',
        howTo: 'Rate yourself honestly: do you need perfect results to feel good? If yes, shift the standard to effort and approach. Excellence, not perfection.',
        focus: 'Compete, don\'t perfect.',
      },
    ],
  },

  // ── 5. Resilience ─────────────────────────────────────────
  {
    key: 'resilience',
    label: 'Resilience',
    description: 'Bounce back faster. Failure is fuel.',
    icon: 'trending-up-outline',
    color: '#22c55e',
    freeCount: 2,
    tools: [
      {
        name: 'Bounce-Back Protocol',
        fixes: 'Staying stuck after failure or bad games.',
        howTo: 'After any failure: 1) Name what happened (fact, not emotion). 2) Find one thing to learn. 3) State your next action. Move forward in 30 seconds.',
        focus: 'Fact. Learn. Go.',
      },
      {
        name: 'Failure Reframe',
        fixes: 'Treating failure as evidence you\'re not good enough.',
        howTo: 'Take your worst thought ("I suck") and rewrite it as data: "My timing was late on fastballs." Data is actionable. Emotion is not.',
        focus: 'Failure is data.',
      },
      {
        name: 'Recovery Routine',
        fixes: 'No system for processing tough games.',
        howTo: 'After a bad game: 10 minutes of processing (write, talk, think). Then close the book. It\'s done. Tomorrow is a new chapter.',
        focus: 'Process it. Close it.',
      },
      {
        name: 'Adversity Advantage',
        fixes: 'Crumbling when things get hard instead of rising.',
        howTo: 'Reframe adversity: "This is where I get better." The players who handle hard moments are the ones who separate. Choose to be that player.',
        focus: 'Hard is where growth lives.',
      },
      {
        name: 'Chaos Training',
        fixes: 'Only performing well in comfortable conditions.',
        howTo: 'Intentionally add disruption to practice: switch hands, add a timer, change routine mid-drill. Train your brain to adapt, not break.',
        focus: 'Train for chaos.',
      },
    ],
  },

  // ── 6. Accountability ─────────────────────────────────────
  {
    key: 'accountability',
    label: 'Accountability',
    description: 'Own everything. Excuses change nothing.',
    icon: 'hand-left-outline',
    color: '#f97316',
    freeCount: 2,
    tools: [
      {
        name: 'Excuse Filter',
        fixes: 'Blaming external factors for poor performance.',
        howTo: 'After a bad result, catch your first thought. Is it an excuse or ownership? Rewrite excuses as ownership: "The ump missed it" → "I need to protect the plate."',
        focus: 'Filter the excuse.',
      },
      {
        name: 'Control Circle',
        fixes: 'Wasting energy on things you can\'t control.',
        howTo: 'Draw two circles: inner (what I control) and outer (what I don\'t). Effort, attitude, preparation — inner. Umpires, weather, coaches — outer. Stay inside.',
        focus: 'Control what you can.',
      },
      {
        name: 'Ownership Statement',
        fixes: 'No personal accountability standard.',
        howTo: 'Write one thing you own completely today: "I own my body language after bad plays." Check yourself against it after every game.',
        focus: 'Own one thing.',
      },
      {
        name: 'Feedback Reframe',
        fixes: 'Taking coaching feedback as personal criticism.',
        howTo: 'When a coach corrects you, reframe it: "They\'re investing in me because they believe I can improve." Feedback is data, not judgment.',
        focus: 'Feedback is fuel.',
      },
      {
        name: 'Standard Check',
        fixes: 'Effort fluctuating based on mood or results.',
        howTo: 'Set 3 non-negotiable standards: Effort, Attitude, Preparation. Rate yourself 1-5 on each after every practice and game. The score doesn\'t lie.',
        focus: 'Standards over feelings.',
      },
    ],
  },

  // ── 7. Pre-Game Routine ───────────────────────────────────
  {
    key: 'pre-game',
    label: 'Pre-Game Routine',
    description: 'Win the game before the first pitch.',
    icon: 'clipboard-outline',
    color: '#0891b2',
    freeCount: 2,
    tools: [
      {
        name: 'Arrival Reset',
        fixes: 'Bringing outside stress to the field.',
        howTo: 'At the field entrance, take 3 deep breaths. Leave school, family, and phone at the gate. You are an athlete now. Nothing else exists.',
        focus: 'Leave it at the gate.',
      },
      {
        name: 'Visualization Protocol',
        fixes: 'No mental preparation before competing.',
        howTo: 'Close your eyes. See yourself in the box. Run 3 perfect at-bats in your mind. See the pitch. Feel the barrel. Hear the crack. Open your eyes — compete.',
        focus: 'See it before you do it.',
      },
      {
        name: 'Body Activation',
        fixes: 'Starting the game physically and mentally cold.',
        howTo: 'Dynamic warmup with intention. Every stretch, every throw has a purpose. Get your heart rate up and your mind locked in before the first pitch.',
        focus: 'Activate body and mind.',
      },
      {
        name: 'Cue Word Setup',
        fixes: 'No trigger to shift into compete mode.',
        howTo: 'Choose one word for today: "Attack," "Smooth," "Compete," "Trust." Write it on your wrist or glove. That\'s your word. Use it all game.',
        focus: 'One word. All game.',
      },
      {
        name: 'Compete Commitment',
        fixes: 'Going through the motions instead of competing.',
        howTo: 'Before the game, answer: "What am I committing to today?" Write it down. One clear intention. Check yourself against it after every inning.',
        focus: 'Commit before you compete.',
      },
    ],
  },

  // ── 8. In-Game Reset ──────────────────────────────────────
  {
    key: 'in-game-reset',
    label: 'In-Game Reset',
    description: 'Reset between pitches. Stay in the fight.',
    icon: 'refresh-outline',
    color: '#e11d48',
    freeCount: 2,
    tools: [
      {
        name: 'Between-Pitch Reset',
        fixes: 'Carrying the last pitch into the next one.',
        howTo: 'After every pitch: step out, deep breath, reset your body, step in with your cue word. 5 seconds. Same routine every time.',
        focus: 'Step out. Breathe. Step in.',
      },
      {
        name: 'At-Bat Reset Protocol',
        fixes: 'No system for resetting during a live at-bat.',
        howTo: '10-step reset: Breathe → Drop shoulders → Anchor tap → Power phrase → Focal point → Flip fear → Visualize → Nod → Control focus → Compete.',
        focus: 'Run the protocol.',
      },
      {
        name: 'Grounding 5-4-3-2-1',
        fixes: 'Overwhelm, panic, or freezing mid-game.',
        howTo: 'Name: 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste. Takes 30 seconds. Pulls you out of your head and into the present.',
        focus: 'Get back in your body.',
      },
      {
        name: 'Pressure Flip',
        fixes: 'Pressure making you tight instead of sharp.',
        howTo: 'Reframe: "I\'m nervous" → "I\'m excited." Same physical feeling, different interpretation. Your body doesn\'t know the difference. Your mind does.',
        focus: 'Nervous = excited.',
      },
      {
        name: 'Focus Word Trigger',
        fixes: 'Can\'t re-engage after losing focus mid-game.',
        howTo: 'Pick a trigger word: "Lock." "Next." "Here." When you drift, say it once, sharply, internally. It snaps your attention back. Practice it daily.',
        focus: 'One word. Snap back.',
      },
    ],
  },

  // ── 9. Post-Game Reflection ───────────────────────────────
  {
    key: 'post-game',
    label: 'Post-Game Reflection',
    description: 'Process the game. Prepare for the next one.',
    icon: 'journal-outline',
    color: '#16a34a',
    freeCount: 2,
    tools: [
      {
        name: 'Win/Learn Journal',
        fixes: 'Only remembering what went wrong.',
        howTo: 'After every game, write: 1 Win (something that went well), 1 Learn (something to improve). No negative spirals. One of each. Move on.',
        focus: 'Win. Learn. Move on.',
      },
      {
        name: 'Emotional Release',
        fixes: 'Taking game emotions home with you.',
        howTo: 'Before you leave the field: take 3 deep breaths, physically brush off your shoulders, and say "It\'s done." Leave the game at the field.',
        focus: 'Leave it at the field.',
      },
      {
        name: 'Gratitude Moment',
        fixes: 'Losing perspective and joy for the game.',
        howTo: 'Name one thing you\'re grateful for about today\'s game. Not a result — a moment, a feeling, an opportunity. Gratitude protects against burnout.',
        focus: 'Find the gratitude.',
      },
      {
        name: 'Next-Day Intent',
        fixes: 'Showing up the next day without purpose.',
        howTo: 'Before you leave, decide: "Tomorrow I will focus on ___." One thing. Write it in your phone. Show up tomorrow with a plan.',
        focus: 'Tomorrow starts now.',
      },
      {
        name: 'Film Review Mindset',
        fixes: 'Watching film with emotion instead of objectivity.',
        howTo: 'Watch film like a scout, not a fan. No emotion. What do you see? What\'s the data? Find one thing to keep and one thing to adjust.',
        focus: 'Watch like a scout.',
      },
    ],
  },
];

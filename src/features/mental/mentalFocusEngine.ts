/**
 * Mental Focus Engine
 *
 * Determines the athlete's current mental focus based on:
 *   - mental profile (archetype, identity, habits)
 *   - mental progress trends
 *   - completion data
 *
 * Drives: Mental Focus card, Mental Daily Work, Mental Path, Mental Review
 *
 * Decision rules:
 *   1. If routine completion < 40% → focus = Routines
 *   2. If emotional control declining → focus = Emotional Control
 *   3. If confidence declining → focus = Confidence
 *   4. If archetype is reactor/overthinker → bias toward Emotional Control / Focus
 *   5. If all metrics stable/improving → advance lane level
 *   6. Default to archetype-driven primary focus
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  computeMentalTrends,
  MENTAL_LANES,
  type MentalMetricTrend,
  type MentalLane,
  type Trend,
} from './mentalProgress';

const FOCUS_STORAGE_KEY = 'otc:mental-focus-state';

// ── Types ───────────────────────────────────────────────────────────────────

export interface MentalFocusState {
  /** Current lane key (e.g., 'confidence', 'emotional_control') */
  currentLane: string;
  /** Current level within the lane (0-2) */
  currentLevel: number;
  /** Human-readable focus description */
  focusTitle: string;
  /** What the athlete is working on this week */
  weekFocus: string;
  /** What comes next */
  nextSkill: string;
  /** Why this was chosen */
  reason: string;
  /** Lane data */
  lane: MentalLane;
}

export interface MentalDailyPrescription {
  tool: { title: string; description: string };
  reflection: { prompt: string };
  resetRep: { instruction: string; reps: number };
  routineCue: { cue: string };
  journal: { prompt: string };
  focusContext: string;
}

export interface MentalReviewData {
  strongestGain: string | null;
  weakestArea: string | null;
  nextFocus: string;
  consistencyNote: string;
  trends: MentalMetricTrend[];
}

// ── Archetype → Default Lane Mapping ────────────────────────────────────────

const ARCHETYPE_DEFAULT_LANE: Record<string, string> = {
  reactor: 'emotional_control',
  overthinker: 'focus',
  avoider: 'confidence',
  performer: 'self_talk',
  doubter: 'confidence',
  driver: 'routines',
};

// ── Focus Selection Engine ──────────────────────────────────────────────────

/**
 * Determine the athlete's current mental focus based on data signals.
 */
export async function computeMentalFocus(
  archetype: string | null,
): Promise<MentalFocusState> {
  const trends = await computeMentalTrends();
  const stored = await loadStoredFocus();

  // Build signal map
  const trendMap: Record<string, Trend> = {};
  const valueMap: Record<string, number | null> = {};
  for (const t of trends) {
    trendMap[t.key] = t.trend;
    valueMap[t.key] = t.latest;
  }

  // Decision rules (priority order)
  let laneKey: string;
  let reason: string;

  // Rule 1: Routine completion critically low
  if (valueMap.routineCompletion !== null && valueMap.routineCompletion < 40) {
    laneKey = 'routines';
    reason = 'Your routines need attention — consistency is the foundation.';
  }
  // Rule 2: Emotional control declining
  else if (trendMap.emotionalControl === 'declining') {
    laneKey = 'emotional_control';
    reason = 'Emotional control is trending down — time to refocus on resets.';
  }
  // Rule 3: Confidence declining
  else if (trendMap.confidence === 'declining') {
    laneKey = 'confidence';
    reason = 'Confidence dipped — we are rebuilding it with evidence and reps.';
  }
  // Rule 4: Focus declining
  else if (trendMap.focus === 'declining') {
    laneKey = 'focus';
    reason = 'Focus has slipped — sharpen your attention this week.';
  }
  // Rule 5: Journal completion low
  else if (valueMap.journalCompletion !== null && valueMap.journalCompletion < 30) {
    laneKey = 'self_talk';
    reason = 'Journaling builds self-awareness — make it a habit.';
  }
  // Rule 6: Default to archetype-driven lane
  else if (archetype && ARCHETYPE_DEFAULT_LANE[archetype]) {
    laneKey = ARCHETYPE_DEFAULT_LANE[archetype];
    reason = 'Based on your mental profile, this is your primary development area.';
  }
  // Rule 7: Fallback
  else {
    laneKey = stored?.currentLane ?? 'confidence';
    reason = 'Building your mental game one skill at a time.';
  }

  const lane = MENTAL_LANES.find(l => l.key === laneKey) ?? MENTAL_LANES[0];

  // Determine level: check if previous lane was same and if we should advance
  let level = stored?.currentLane === laneKey ? (stored.currentLevel ?? 0) : 0;

  // Advance if the lane's key metric is improving and we're not at max
  const laneMetricKey = LANE_TO_METRIC[laneKey];
  if (laneMetricKey && trendMap[laneMetricKey] === 'improving' && level < lane.levels.length - 1) {
    level = Math.min(level + 1, lane.levels.length - 1);
  }

  const currentLevelData = lane.levels[Math.min(level, lane.levels.length - 1)];
  const nextLevelData = level < lane.levels.length - 1 ? lane.levels[level + 1] : null;

  const focusState: MentalFocusState = {
    currentLane: laneKey,
    currentLevel: level,
    focusTitle: `Your current mental focus is ${lane.title}.`,
    weekFocus: currentLevelData.description,
    nextSkill: nextLevelData ? `Next: ${nextLevelData.title} — ${nextLevelData.description}` : 'You are at the advanced level. Maintain and compete.',
    reason,
    lane,
  };

  // Persist
  await saveStoredFocus(focusState);
  return focusState;
}

const LANE_TO_METRIC: Record<string, string> = {
  confidence: 'confidence',
  focus: 'focus',
  emotional_control: 'emotionalControl',
  routines: 'routineCompletion',
  self_talk: 'journalCompletion',
  pressure: 'confidence', // pressure correlates with confidence
};

// ── Mental Daily Work Generator ─────────────────────────────────────────────

const TOOLS_BY_LANE: Record<string, Array<{ title: string; description: string }>> = {
  confidence: [
    { title: 'Evidence Log', description: 'Write 3 things you did well recently.' },
    { title: 'Highlight Reel', description: 'Visualize your best moments for 60 seconds.' },
    { title: 'Power Statement', description: 'Say your identity statement out loud 3 times.' },
  ],
  focus: [
    { title: 'Focal Lock Drill', description: 'Pick one object and lock focus for 30 seconds.' },
    { title: 'Cue Word Practice', description: 'Choose one cue word and use it before each rep.' },
    { title: 'Distraction Reset', description: 'Practice refocusing after an intentional distraction.' },
  ],
  emotional_control: [
    { title: 'Physiological Sigh', description: 'Double inhale through the nose, long exhale through the mouth.' },
    { title: 'Body Language Reset', description: 'Stand tall, shoulders back, breathe — own your space.' },
    { title: 'Release Breath', description: 'Breathe in tension, breathe out with a physical release.' },
  ],
  routines: [
    { title: 'Pre-Pitch Routine Rep', description: 'Run your full pre-pitch or pre-AB routine 5 times.' },
    { title: 'Between-Inning Routine', description: 'Practice your transition routine in full.' },
    { title: 'Warm-Up Routine Check', description: 'Run your pre-game warm-up exactly as planned.' },
  ],
  self_talk: [
    { title: 'Thought Swap', description: 'Catch one negative thought and replace it with a productive cue.' },
    { title: 'Inner Coach Voice', description: 'Talk to yourself like a great coach would.' },
    { title: 'Cue Card Review', description: 'Read your personal cue cards before training.' },
  ],
  pressure: [
    { title: 'Pressure Visualization', description: 'Visualize a high-pressure at-bat. Stay calm. Execute.' },
    { title: 'Controlled Chaos Rep', description: 'Add consequence to a drill and compete through it.' },
    { title: 'Embrace the Moment', description: 'Remind yourself: pressure is a privilege.' },
  ],
};

const REFLECTIONS_BY_LANE: Record<string, string[]> = {
  confidence: ['What made you feel confident today?', 'When did you doubt yourself?', 'What evidence proves you are capable?'],
  focus: ['When did your focus break today?', 'What brought you back?', 'What is your strongest focus trigger?'],
  emotional_control: ['What triggered your emotions today?', 'How fast did you reset?', 'What would a calm version of you have done?'],
  routines: ['Did you complete your full routine today?', 'Where did it break down?', 'What one routine matters most right now?'],
  self_talk: ['What did your inner voice say today?', 'Was it helpful or harmful?', 'What would your best self say instead?'],
  pressure: ['When did you feel pressure today?', 'How did your body respond?', 'What would it look like to thrive in that moment?'],
};

const RESET_REPS_BY_LANE: Record<string, { instruction: string; reps: number }> = {
  confidence: { instruction: 'After each rep, say "I earned this" before the next one.', reps: 5 },
  focus: { instruction: 'After a distraction, take one breath and re-lock your cue word.', reps: 3 },
  emotional_control: { instruction: 'After a mistake, do a physiological sigh before the next rep.', reps: 3 },
  routines: { instruction: 'Run your pre-pitch routine between every rep.', reps: 5 },
  self_talk: { instruction: 'Catch one negative thought, swap it, then continue.', reps: 3 },
  pressure: { instruction: 'Visualize consequences, then execute with composure.', reps: 3 },
};

const ROUTINE_CUES: Record<string, string> = {
  confidence: 'Before each at-bat: "I am prepared. I trust my work."',
  focus: 'Between pitches: one word, one breath, locked in.',
  emotional_control: 'After mistakes: step out, breathe, reset body language.',
  routines: 'Stick to the plan. No shortcuts. Same routine every time.',
  self_talk: 'Catch it. Swap it. Compete.',
  pressure: 'Pressure is a privilege. Step in and own the moment.',
};

const JOURNAL_PROMPTS: Record<string, string[]> = {
  confidence: ['Where did your confidence come from today?', 'What are you most proud of this week?', 'Write one thing you believe about yourself as an athlete.'],
  focus: ['What broke your focus today?', 'When were you most locked in?', 'What is your best focus strategy?'],
  emotional_control: ['Where did your self-talk slip?', 'What emotion hit you hardest today?', 'How fast did you recover?'],
  routines: ['Did you follow your routines today?', 'What routine felt automatic?', 'What routine still needs work?'],
  self_talk: ['What did you tell yourself after a mistake?', 'How would your best coach respond?', 'Write your top 3 cue words.'],
  pressure: ['When did you feel pressure today?', 'Did you lean in or pull back?', 'What does thriving under pressure look like for you?'],
};

/**
 * Generate today's mental daily work based on current focus.
 */
export function generateMentalDailyWork(focus: MentalFocusState): MentalDailyPrescription {
  const lane = focus.currentLane;
  const dayIndex = new Date().getDay(); // 0-6

  const tools = TOOLS_BY_LANE[lane] ?? TOOLS_BY_LANE.confidence;
  const reflections = REFLECTIONS_BY_LANE[lane] ?? REFLECTIONS_BY_LANE.confidence;
  const journals = JOURNAL_PROMPTS[lane] ?? JOURNAL_PROMPTS.confidence;
  const reset = RESET_REPS_BY_LANE[lane] ?? RESET_REPS_BY_LANE.confidence;
  const routineCue = ROUTINE_CUES[lane] ?? ROUTINE_CUES.confidence;

  return {
    tool: tools[dayIndex % tools.length],
    reflection: { prompt: reflections[dayIndex % reflections.length] },
    resetRep: reset,
    routineCue: { cue: routineCue },
    journal: { prompt: journals[dayIndex % journals.length] },
    focusContext: focus.focusTitle,
  };
}

// ── Mental Review Data ──────────────────────────────────────────────────────

/**
 * Generate review data for weekly/monthly reports.
 */
export async function generateMentalReviewData(
  archetype: string | null,
): Promise<MentalReviewData> {
  const trends = await computeMentalTrends();

  const improving = trends.filter(t => t.trend === 'improving');
  const declining = trends.filter(t => t.trend === 'declining');

  const strongestGain = improving.length > 0
    ? `${improving[0].label} is improving.`
    : null;

  const weakestArea = declining.length > 0
    ? `${declining[0].label} needs attention.`
    : null;

  // Determine next focus
  const focus = await computeMentalFocus(archetype);
  const nextFocus = focus.focusTitle;

  // Consistency note
  const routineTrend = trends.find(t => t.key === 'routineCompletion');
  const journalTrend = trends.find(t => t.key === 'journalCompletion');
  let consistencyNote = 'Keep building your mental habits.';
  if (routineTrend && routineTrend.latest !== null && routineTrend.latest >= 70 && journalTrend && journalTrend.latest !== null && journalTrend.latest >= 70) {
    consistencyNote = 'Mental consistency is strong — your habits are becoming automatic.';
  } else if (routineTrend && routineTrend.latest !== null && routineTrend.latest < 40) {
    consistencyNote = 'Routine completion is low — build the habit before chasing performance.';
  }

  return {
    strongestGain,
    weakestArea,
    nextFocus,
    consistencyNote,
    trends,
  };
}

// ── Persistence ─────────────────────────────────────────────────────────────

async function loadStoredFocus(): Promise<{ currentLane: string; currentLevel: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(FOCUS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

async function saveStoredFocus(state: MentalFocusState): Promise<void> {
  await AsyncStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify({
    currentLane: state.currentLane,
    currentLevel: state.currentLevel,
  }));
}

/**
 * 12-Week Exit Velocity Program — Complete Training Data
 *
 * 4 phases × 3 weeks × 3 days = 36 training sessions.
 * Each day includes tee swings + strength/power/speed work.
 */

import type {
  ProgramWeek, TrainingDay, TeePrescription, ExerciseBlock,
  PhaseNumber,
} from './types';
import { isTestWeek } from './product';

// ═══════════════════════════════════════════════════════════════════════════════
// TEE PRESCRIPTIONS PER PHASE
// ═══════════════════════════════════════════════════════════════════════════════

const TEE_PHASE_1: TeePrescription = {
  overload: { sets: 6, reps: 5 },
  underload: { sets: 2, reps: 5 },
  gameBat: { sets: 4, reps: 5 },
  totalSwings: 60,
  note: 'Overload emphasis. Heavier bat builds bat speed capacity.',
};

const TEE_PHASE_2: TeePrescription = {
  overload: { sets: 4, reps: 5 },
  underload: { sets: 4, reps: 5 },
  gameBat: { sets: 4, reps: 5 },
  totalSwings: 60,
  note: 'Mixed loading. Balance between overload and underload.',
};

const TEE_PHASE_3: TeePrescription = {
  overload: { sets: 2, reps: 5 },
  underload: { sets: 6, reps: 5 },
  gameBat: { sets: 4, reps: 5 },
  totalSwings: 60,
  note: 'Underload emphasis. Train the nervous system to fire faster.',
};

const TEE_PHASE_4: TeePrescription = {
  overload: { sets: 3, reps: 5 },
  underload: { sets: 3, reps: 5 },
  gameBat: { sets: 6, reps: 5 },
  totalSwings: 60,
  note: 'Game bat emphasis. Transfer speed gains to competition.',
};

function getTeeForPhase(phase: PhaseNumber): TeePrescription {
  if (phase === 1) return TEE_PHASE_1;
  if (phase === 2) return TEE_PHASE_2;
  if (phase === 3) return TEE_PHASE_3;
  return TEE_PHASE_4;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAY TEMPLATES — Exercise blocks that progress across phases
// ═══════════════════════════════════════════════════════════════════════════════

// ── DAY 1: Lower Body Power + Rotation ──────────────────────────────────────

function day1Blocks(phase: PhaseNumber): ExerciseBlock[] {
  const blocks: ExerciseBlock[] = [];

  // Plyometrics
  if (phase <= 2) {
    blocks.push({
      label: 'Plyometrics',
      exercises: [
        { id: 'd1-box-jump', name: 'Box Jumps', category: 'plyometric', sets: '4', reps: '3', rest: '90s', coachingCue: 'Explode up. Stick the landing. Reset between reps.' },
        { id: 'd1-lat-bound', name: 'Lateral Bounds', category: 'plyometric', sets: '3', reps: '4/side', rest: '60s', coachingCue: 'Drive off the outside foot. Stick each landing.' },
      ],
    });
  } else {
    blocks.push({
      label: 'Plyometrics',
      exercises: [
        { id: 'd1-depth-drop', name: 'Depth Drops', category: 'plyometric', sets: '3', reps: '3', rest: '90s', coachingCue: 'Step off the box. Absorb and stick. Athletic position.' },
        { id: 'd1-lat-bound', name: 'Lateral Bounds', category: 'plyometric', sets: '4', reps: '4/side', rest: '60s', coachingCue: 'Max distance. Stick and hold 2 seconds.' },
      ],
    });
  }

  // Med Ball Rotation
  const mbWeight = phase === 1 ? '6–8 lb' : phase === 2 ? '4–6 lb' : phase === 3 ? '3–4 lb' : '3–5 lb';
  blocks.push({
    label: `Rotational Med Ball (${mbWeight})`,
    exercises: [
      { id: 'd1-scoop-toss', name: 'Rotational Scoop Toss', category: 'med_ball', sets: phase <= 2 ? '3' : '4', reps: '5/side', rest: '60s', coachingCue: 'Load the back hip. Fire through the front. Max intent every throw.' },
      { id: 'd1-step-behind-mb', name: 'Step-Behind MB Throw', category: 'med_ball', sets: '3', reps: '5/side', rest: '60s', coachingCue: 'Step behind to load. Separate hips from shoulders. Throw through the wall.' },
    ],
  });

  // Lower Body Strength
  if (phase <= 2) {
    blocks.push({
      label: 'Lower Body Strength',
      exercises: [
        { id: 'd1-trap-dl', name: 'Trap Bar Deadlift', category: 'strength', sets: phase === 1 ? '4' : '3', reps: phase === 1 ? '5' : '4', rest: '2–3 min', coachingCue: 'Grip it, brace hard, drive the floor away. Lock out at the top.' },
        { id: 'd1-bss', name: 'Bulgarian Split Squat', category: 'strength', sets: '3', reps: '8/side', rest: '90s', coachingCue: 'Control the descent. Drive through the front heel.' },
        { id: 'd1-rdl', name: 'DB RDL', category: 'strength', sets: '3', reps: '8', rest: '90s', coachingCue: 'Push hips back. Flat back. Feel the hamstrings load.' },
      ],
    });
  } else {
    blocks.push({
      label: 'Lower Body Strength',
      exercises: [
        { id: 'd1-trap-dl', name: 'Trap Bar Deadlift', category: 'strength', sets: '3', reps: '3', rest: '2–3 min', coachingCue: 'Explosive intent. Move the bar fast.', note: 'Reduce load 10%, increase speed.' },
        { id: 'd1-bss', name: 'Bulgarian Split Squat', category: 'strength', sets: '3', reps: '6/side', rest: '90s', coachingCue: 'Controlled descent, explosive drive up.' },
        { id: 'd1-rdl', name: 'Single-Leg RDL', category: 'strength', sets: '3', reps: '6/side', rest: '60s', coachingCue: 'Hinge with control. Stay square.' },
      ],
    });
  }

  // Lead Leg Block
  blocks.push({
    label: 'Lead Leg Block Work',
    exercises: [
      { id: 'd1-ll-split-iso', name: 'Lead Leg Split Squat Iso', category: 'strength', sets: '3', reps: '20s/side', rest: '45s', coachingCue: 'Lock the front leg. Drive into the ground. Don\'t let the knee cave.' },
    ],
  });

  // Core
  blocks.push({
    label: 'Core — Anti-Rotation',
    exercises: [
      { id: 'd1-pallof', name: 'Pallof Press', category: 'core', sets: '3', reps: '10/side', rest: '45s', coachingCue: 'Press out. Don\'t let the cable pull you. Stay square.' },
    ],
  });

  return blocks;
}

// ── DAY 2: Rotational Power ─────────────────────────────────────────────────

function day2Blocks(phase: PhaseNumber): ExerciseBlock[] {
  const blocks: ExerciseBlock[] = [];
  const mbWeight = phase === 1 ? '6–8 lb' : phase === 2 ? '4–6 lb' : phase === 3 ? '3–4 lb' : '3–5 lb';

  // High-Velocity Med Ball
  blocks.push({
    label: `Rotational Med Ball (${mbWeight})`,
    exercises: [
      { id: 'd2-step-behind', name: 'Step-Behind Throw', category: 'med_ball', sets: phase >= 3 ? '4' : '3', reps: '5/side', rest: '60s', coachingCue: 'Load the back hip. Separate. Fire through the front side.' },
      { id: 'd2-shot-put', name: 'Shot Put Throw', category: 'med_ball', sets: '3', reps: '5/side', rest: '60s', coachingCue: 'Push from the back hip through the front shoulder. Explosive.' },
      { id: 'd2-rot-slam', name: 'Rotational Slam', category: 'med_ball', sets: '3', reps: '5/side', rest: '60s', coachingCue: 'Full rotation. Slam with intent. Reset between reps.' },
      ...(phase >= 2 ? [{ id: 'd2-shuffle-rotate', name: 'Shuffle → Rotate Throw', category: 'med_ball' as const, sets: '3', reps: '4/side', rest: '60s', coachingCue: 'Shuffle to load. Plant and rotate. Throw max velocity.' }] : []),
    ],
  });

  // Rotational Strength
  blocks.push({
    label: 'Rotational Strength',
    exercises: [
      { id: 'd2-landmine-rot', name: 'Landmine Rotation', category: 'strength', sets: '3', reps: '8/side', rest: '60s', coachingCue: 'Rotate from the hips. Guide with the hands. Control the decel.' },
      { id: 'd2-cable-chop', name: 'Cable Chops', category: 'strength', sets: '3', reps: '10/side', rest: '45s', coachingCue: 'Pull through your rotation pattern. Fast hands, stable hips.' },
      { id: 'd2-cable-lift', name: 'Cable Lifts', category: 'strength', sets: '3', reps: '10/side', rest: '45s', coachingCue: 'Low to high. Drive from the hips. Stay tall.' },
    ],
  });

  // Core
  blocks.push({
    label: 'Core',
    exercises: [
      { id: 'd2-hang-leg', name: 'Hanging Leg Raises', category: 'core', sets: '3', reps: '10', rest: '45s', coachingCue: 'Control the movement. No swinging. Curl the hips up.' },
      { id: 'd2-russian-twist', name: 'Russian Twists', category: 'core', sets: '3', reps: '12/side', rest: '45s', coachingCue: 'Rotate from the trunk. Don\'t just move your arms.' },
    ],
  });

  // Mobility
  blocks.push({
    label: 'Hip & T-Spine Mobility',
    exercises: [
      { id: 'd2-hip-90-90', name: '90/90 Hip Transitions', category: 'mobility', sets: '2', reps: '8/side', coachingCue: 'Stay tall through the switch. Control the transition.' },
      { id: 'd2-tspine-rot', name: 'Quadruped T-Spine Rotation', category: 'mobility', sets: '2', reps: '8/side', coachingCue: 'Hand behind head. Rotate upper back only. Lock the hips.' },
      { id: 'd2-open-books', name: 'Open Books', category: 'mobility', sets: '2', reps: '8/side', coachingCue: 'Side-lying. Rotate open. Follow with your eyes.' },
    ],
  });

  return blocks;
}

// ── DAY 3: Total Body Power + Speed ─────────────────────────────────────────

function day3Blocks(phase: PhaseNumber): ExerciseBlock[] {
  const blocks: ExerciseBlock[] = [];

  // Olympic / Explosive
  if (phase <= 2) {
    blocks.push({
      label: 'Explosive Power',
      exercises: [
        { id: 'd3-hang-clean', name: 'Hang Clean', category: 'olympic_lift', sets: phase === 1 ? '4' : '3', reps: '3', rest: '2 min', coachingCue: 'Violent hip extension. Pull yourself under the bar. Catch with fast elbows.' },
        { id: 'd3-push-press', name: 'Push Press', category: 'olympic_lift', sets: '3', reps: '5', rest: '90s', coachingCue: 'Dip and drive. Use the legs. Lock out overhead.' },
      ],
    });
  } else {
    blocks.push({
      label: 'Explosive Power',
      exercises: [
        { id: 'd3-db-snatch', name: 'DB Snatch', category: 'olympic_lift', sets: '4', reps: '3/side', rest: '90s', coachingCue: 'Rip it from the floor. One explosive motion. Lock out overhead.' },
        { id: 'd3-push-press', name: 'Push Press', category: 'olympic_lift', sets: '3', reps: '3', rest: '90s', coachingCue: 'Max intent. Explode through the bar.', note: 'Reduce load 5-10%, increase speed.' },
      ],
    });
  }

  // Med Ball
  const mbWeight = phase === 1 ? '6–8 lb' : phase === 2 ? '4–6 lb' : phase === 3 ? '3–4 lb' : '3–5 lb';
  blocks.push({
    label: `Med Ball Overhead (${mbWeight})`,
    exercises: [
      { id: 'd3-oh-throw', name: 'Overhead MB Slam', category: 'med_ball', sets: '3', reps: '5', rest: '60s', coachingCue: 'Reach back. Slam with full body. Max velocity.' },
    ],
  });

  // Sprint Work
  blocks.push({
    label: 'Sprint Work',
    exercises: [
      { id: 'd3-10yd', name: '10-Yard Sprint', category: 'sprint', sets: phase >= 3 ? '4' : '3', reps: '1', rest: '90s', coachingCue: 'Explosive first step. Stay low through the drive phase.' },
      { id: 'd3-20yd', name: '20-Yard Sprint', category: 'sprint', sets: '3', reps: '1', rest: '2 min', coachingCue: 'Accelerate through 10. Open up through 20.' },
      ...(phase >= 2 ? [{ id: 'd3-shuffle-sprint', name: 'Shuffle → Sprint (10 yds)', category: 'sprint' as const, sets: '3', reps: '1/side', rest: '90s', coachingCue: 'Shuffle 5 yards. Plant and sprint 10. Explosive transition.' }] : []),
    ],
  });

  // Accessory Strength
  blocks.push({
    label: 'Accessory Strength',
    exercises: [
      { id: 'd3-chinup', name: 'Chin-Ups', category: 'accessory', sets: '3', reps: phase <= 2 ? '6–8' : '8–10', rest: '60s', coachingCue: 'Full range. Pull the chest to the bar. Control the descent.' },
      { id: 'd3-step-up', name: 'DB Step-Ups', category: 'accessory', sets: '3', reps: '8/side', rest: '60s', coachingCue: 'Drive through the top foot. No push-off from the bottom leg.' },
      { id: 'd3-face-pull', name: 'Face Pulls', category: 'accessory', sets: '3', reps: '15', rest: '45s', coachingCue: 'Pull to the face. Squeeze the rear delts. External rotate at the end.' },
    ],
  });

  return blocks;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD COMPLETE PROGRAM
// ═══════════════════════════════════════════════════════════════════════════════

function buildDay(phase: PhaseNumber, dayNum: 1 | 2 | 3): TrainingDay {
  const tee = getTeeForPhase(phase);

  if (dayNum === 1) {
    return {
      dayNumber: 1,
      dayType: 'lower_power_rotation',
      title: 'Lower Body Power + Rotation',
      subtitle: 'Plyos · Med Ball · Lower Strength · Lead Leg',
      tee,
      blocks: day1Blocks(phase),
    };
  }
  if (dayNum === 2) {
    return {
      dayNumber: 2,
      dayType: 'rotational_power',
      title: 'Rotational Power',
      subtitle: 'Med Ball · Rotational Strength · Core · Mobility',
      tee,
      blocks: day2Blocks(phase),
    };
  }
  return {
    dayNumber: 3,
    dayType: 'total_body_speed',
    title: 'Total Body Power + Speed',
    subtitle: 'Olympic Lift · Sprints · Accessory · Upper Back',
    tee,
    blocks: day3Blocks(phase),
  };
}

function getPhaseNumber(week: number): PhaseNumber {
  if (week <= 3) return 1;
  if (week <= 6) return 2;
  if (week <= 9) return 3;
  return 4;
}

function buildAllWeeks(): ProgramWeek[] {
  const weeks: ProgramWeek[] = [];
  for (let w = 1; w <= 12; w++) {
    const phase = getPhaseNumber(w);
    weeks.push({
      weekNumber: w,
      phase,
      isTestWeek: isTestWeek(w),
      days: [buildDay(phase, 1), buildDay(phase, 2), buildDay(phase, 3)],
    });
  }
  return weeks;
}

export const PROGRAM_WEEKS: ProgramWeek[] = buildAllWeeks();

export function getWeek(weekNumber: number): ProgramWeek | undefined {
  return PROGRAM_WEEKS.find((w) => w.weekNumber === weekNumber);
}

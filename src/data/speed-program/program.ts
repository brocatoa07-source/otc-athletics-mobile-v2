/**
 * Speed Development Program — Complete 12-Week Training Data
 *
 * 3 Levels × 4 Phases × 3 Weeks × 3 Sessions = 108 total sessions.
 *
 * Each session includes: warm-up → mechanics → sprints → plyos.
 * Volumes, intensities, and distances differ by level.
 */

import type {
  SpeedWeek, SpeedSession, SessionBlock, SpeedLevel, PhaseNumber,
} from './types';
import { isSpeedTestWeek } from './product';

// ═══════════════════════════════════════════════════════════════════════════════
// WARM-UP TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

function warmUpBlock(type: 'acceleration' | 'max_velocity' | 'cod'): SessionBlock {
  const base = [
    { exerciseId: 'wu-jog', name: 'Easy Jog', sets: '1', reps: '200 yd', rest: '—', intensity: '50%', coachingCue: 'Easy effort. Relax the shoulders.' },
    { exerciseId: 'wu-leg-cradle', name: 'Leg Cradle', sets: '1', reps: '10/side', rest: '—', coachingCue: 'Pull the knee and ankle to the chest.' },
    { exerciseId: 'wu-walking-lunge-twist', name: 'Walking Lunge + Rotation', sets: '1', reps: '8/side', rest: '—', coachingCue: 'Deep lunge, rotate over the front knee.' },
    { exerciseId: 'wu-straight-leg-march', name: 'Straight Leg March', sets: '1', reps: '10/side', rest: '—', coachingCue: 'Kick to your hand. Keep the leg straight.' },
  ];

  if (type === 'acceleration') {
    return {
      label: 'Warm-Up (Acceleration Prep)',
      drills: [
        ...base,
        { exerciseId: 'wu-a-march', name: 'A-March', sets: '2', reps: '15 yd', rest: 'walk back', coachingCue: 'Knee up, toe up, strike under the hip.' },
        { exerciseId: 'wu-a-skip', name: 'A-Skip', sets: '2', reps: '20 yd', rest: 'walk back', coachingCue: 'Rhythm over speed. Knee drive.' },
        { exerciseId: 'wu-build-up-sprint', name: 'Build-Up Sprint', sets: '2', reps: '40 yd', rest: 'walk back', intensity: '70-80%', coachingCue: 'Accelerate smoothly to 80%.' },
      ],
    };
  }

  if (type === 'max_velocity') {
    return {
      label: 'Warm-Up (Max Velocity Prep)',
      drills: [
        ...base,
        { exerciseId: 'wu-a-skip', name: 'A-Skip', sets: '2', reps: '20 yd', rest: 'walk back', coachingCue: 'Rhythm. Knee drive. Toe dorsiflexed.' },
        { exerciseId: 'wu-b-skip', name: 'B-Skip', sets: '2', reps: '20 yd', rest: 'walk back', coachingCue: 'Extend and paw. Front-side mechanics.' },
        { exerciseId: 'mech-ankling', name: 'Ankling', sets: '2', reps: '15 yd', rest: 'walk back', coachingCue: 'Stiff ankle. Quick contact.' },
        { exerciseId: 'wu-build-up-sprint', name: 'Build-Up Sprint', sets: '2', reps: '50 yd', rest: 'walk back', intensity: '80-85%', coachingCue: 'Smooth acceleration to near-max.' },
      ],
    };
  }

  // COD
  return {
    label: 'Warm-Up (COD / Baseball Speed Prep)',
    drills: [
      ...base,
      { exerciseId: 'wu-lateral-shuffle', name: 'Lateral Shuffle', sets: '2', reps: '10 yd/side', rest: '—', coachingCue: 'Stay low. Push off the trailing foot.' },
      { exerciseId: 'wu-carioca', name: 'Carioca', sets: '2', reps: '15 yd/side', rest: '—', coachingCue: 'Rotate the hips. Light feet.' },
      { exerciseId: 'wu-a-skip', name: 'A-Skip', sets: '2', reps: '20 yd', rest: 'walk back', coachingCue: 'Rhythm. Knee drive.' },
      { exerciseId: 'wu-build-up-sprint', name: 'Build-Up Sprint', sets: '2', reps: '40 yd', rest: 'walk back', intensity: '75%', coachingCue: 'Easy build to moderate speed.' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION BUILDERS — PER LEVEL + PHASE
// ═══════════════════════════════════════════════════════════════════════════════

type LevelConfig = {
  accelReps: number;
  accelRest: string;
  flyReps: number;
  flyRest: string;
  plyoSets: number;
  codReps: number;
  sprintYardMult: number; // multiplier on base yardage
};

const LEVEL_CONFIGS: Record<SpeedLevel, LevelConfig> = {
  beginner:     { accelReps: 4, accelRest: '90s',  flyReps: 3, flyRest: '2 min',   plyoSets: 2, codReps: 3, sprintYardMult: 0.8 },
  intermediate: { accelReps: 5, accelRest: '75s',  flyReps: 4, flyRest: '90s',     plyoSets: 3, codReps: 4, sprintYardMult: 1.0 },
  advanced:     { accelReps: 6, accelRest: '60-75s', flyReps: 5, flyRest: '75-90s', plyoSets: 4, codReps: 5, sprintYardMult: 1.2 },
};

// ── Day 1: Acceleration ─────────────────────────────────────────────────────

function buildAccelSession(level: SpeedLevel, phase: PhaseNumber): SpeedSession {
  const cfg = LEVEL_CONFIGS[level];
  const blocks: SessionBlock[] = [];
  let yardage = 0;

  // Mechanics block
  if (phase <= 2) {
    blocks.push({
      label: 'Sprint Mechanics',
      drills: [
        { exerciseId: 'mech-wall-drive', name: 'Wall Drive', sets: '2', reps: '6/side', rest: '30s', coachingCue: 'Full body lean. Drive knee to 90°. Switch fast.' },
        { exerciseId: 'mech-arm-action-drill', name: 'Seated Arm Action', sets: '2', reps: '10s', rest: '30s', coachingCue: 'Cheek to cheek. Drive the elbow back.' },
        ...(phase === 2 ? [{ exerciseId: 'mech-falling-start', name: 'Falling Start Drill', sets: '3', reps: '1', rest: '45s', coachingCue: 'Fall as one unit. Don\'t step first.' }] : []),
      ],
    });
  } else {
    blocks.push({
      label: 'Sprint Mechanics',
      drills: [
        { exerciseId: 'mech-wall-drive-hold', name: 'Wall Drive Iso', sets: '2', reps: '10s/side', rest: '30s', coachingCue: 'Hold the position with full tension.' },
        { exerciseId: 'mech-3pt-start', name: '3-Point Start Practice', sets: '2', reps: '1', rest: '45s', coachingCue: 'Load back leg. Push hard. Stay low.' },
      ],
    });
  }

  // Acceleration sprints
  const accelBlock: SessionBlock = { label: 'Acceleration Sprints', drills: [] };

  if (phase === 1) {
    // Phase 1: 10 yd from falling starts
    const reps = cfg.accelReps;
    accelBlock.drills.push(
      { exerciseId: 'acc-falling-10', name: 'Falling Start → 10 yd', sets: `${reps}`, reps: '1', rest: cfg.accelRest, intensity: '100%', coachingCue: 'Fall and go. Push hard at contact.' },
      { exerciseId: 'acc-10yd', name: '10 yd Sprint (2-Point)', sets: `${reps}`, reps: '1', rest: cfg.accelRest, intensity: '100%', coachingCue: 'Explosive first step. Stay low through 10.' },
    );
    yardage = reps * 10 * 2;
  } else if (phase === 2) {
    const reps = cfg.accelReps;
    accelBlock.drills.push(
      { exerciseId: 'acc-10yd', name: '10 yd Sprint (2-Point)', sets: `${reps}`, reps: '1', rest: cfg.accelRest, intensity: '100%', coachingCue: 'Explosive. Stay low.' },
      { exerciseId: 'acc-15yd', name: '15 yd Sprint (Falling)', sets: `${reps}`, reps: '1', rest: cfg.accelRest, intensity: '100%', coachingCue: 'Fall and push. Rise gradually.' },
    );
    yardage = reps * 10 + reps * 15;
    if (level !== 'beginner') {
      accelBlock.drills.push(
        { exerciseId: 'acc-resisted-10', name: 'Resisted Sprint — 10 yd', sets: `${Math.max(2, reps - 2)}`, reps: '1', rest: '2 min', intensity: '100%', coachingCue: 'Drive hard. Stay at 45°.' },
      );
      yardage += (reps - 2) * 10;
    }
  } else if (phase === 3) {
    const reps = cfg.accelReps;
    accelBlock.drills.push(
      { exerciseId: 'acc-3pt-10', name: '3-Point → 10 yd', sets: `${reps}`, reps: '1', rest: cfg.accelRest, intensity: '100%', coachingCue: 'Violent push. Stay low 5+ yards.' },
      { exerciseId: 'acc-20yd', name: '20 yd Sprint', sets: `${reps}`, reps: '1', rest: '2 min', intensity: '100%', coachingCue: 'Low first 5. Rise through 10. Hit speed by 20.' },
    );
    yardage = reps * 10 + reps * 20;
    if (level !== 'beginner') {
      accelBlock.drills.push(
        { exerciseId: 'acc-resisted-15', name: 'Resisted Sprint — 15 yd', sets: `${Math.max(2, reps - 2)}`, reps: '1', rest: '2 min', intensity: '100%', coachingCue: 'Push the ground. Stay at 45°.' },
      );
      yardage += (reps - 2) * 15;
    }
  } else {
    // Phase 4: Mixed starts
    const reps = Math.max(3, cfg.accelReps - 1);
    accelBlock.drills.push(
      { exerciseId: 'acc-3pt-15', name: '3-Point → 15 yd', sets: `${reps}`, reps: '1', rest: cfg.accelRest, intensity: '100%', coachingCue: 'Aggressive start. Rise through the sprint.' },
      { exerciseId: 'mech-lateral-start', name: 'Lateral Start → 10 yd', sets: `${reps}`, reps: '1', rest: cfg.accelRest, intensity: '100%', coachingCue: 'Violent hip turn. Cross and go.' },
      { exerciseId: 'mech-crossover-start', name: 'Crossover Start → 10 yd', sets: `${reps}`, reps: '1', rest: cfg.accelRest, intensity: '100%', coachingCue: 'Aggressive crossover. Push and sprint.' },
    );
    yardage = reps * 15 + reps * 10 + reps * 10;
  }
  blocks.push(accelBlock);

  // Plyometrics
  blocks.push({
    label: 'Sprint Plyometrics',
    drills: [
      ...(phase <= 2 ? [
        { exerciseId: 'plyo-pogos', name: 'Pogos', sets: `${cfg.plyoSets}`, reps: '15', rest: '45s', coachingCue: 'Stiff ankles. Quick contact.' },
        { exerciseId: 'plyo-broad-jump', name: 'Broad Jump', sets: `${cfg.plyoSets}`, reps: '3', rest: '60s', coachingCue: 'Swing arms. Explode. Stick it.' },
      ] : [
        { exerciseId: 'plyo-bound', name: 'Bounding', sets: `${cfg.plyoSets}`, reps: '5/side', rest: '60s', coachingCue: 'Max distance each bound. Drive the knee.' },
        ...(level === 'advanced' ? [{ exerciseId: 'plyo-depth-jump', name: 'Depth Jump', sets: `${cfg.plyoSets}`, reps: '3', rest: '90s', coachingCue: 'Step off, land, explode. Minimize ground time.' }]
          : [{ exerciseId: 'plyo-snap-down', name: 'Snap Downs', sets: `${cfg.plyoSets}`, reps: '4', rest: '45s', coachingCue: 'Tall to low. Snap and stick.' }]),
      ]),
    ],
  });

  return {
    dayNumber: 1,
    sessionType: 'acceleration',
    title: 'Acceleration Day',
    subtitle: 'Short sprints · Starting positions · Plyos',
    totalSprintYardage: Math.round(yardage * cfg.sprintYardMult),
    warmUp: warmUpBlock('acceleration'),
    blocks,
  };
}

// ── Day 2: Max Velocity ─────────────────────────────────────────────────────

function buildMaxVeloSession(level: SpeedLevel, phase: PhaseNumber): SpeedSession {
  const cfg = LEVEL_CONFIGS[level];
  const blocks: SessionBlock[] = [];
  let yardage = 0;

  // Mechanics
  blocks.push({
    label: 'Upright Sprint Mechanics',
    drills: [
      { exerciseId: 'wu-a-skip', name: 'A-Skip (Tall)', sets: '2', reps: '20 yd', rest: 'walk back', coachingCue: 'Tall posture. Knee drive. Quick contact.' },
      { exerciseId: 'wu-b-skip', name: 'B-Skip', sets: '2', reps: '20 yd', rest: 'walk back', coachingCue: 'Extend and paw back. Front-side focus.' },
      ...(phase >= 2 ? [{ exerciseId: 'mech-ankling', name: 'Ankling', sets: '2', reps: '15 yd', rest: 'walk back', coachingCue: 'Stiff ankle. Roll forward. Quick.' }] : []),
    ],
  });

  // Flying sprints
  const flyBlock: SessionBlock = { label: 'Flying Sprints', drills: [] };

  if (phase <= 2) {
    const reps = cfg.flyReps;
    flyBlock.drills.push(
      { exerciseId: 'mv-fly-10', name: 'Flying 10 yd (20 yd build)', distance: '20+10 yd', sets: `${reps}`, reps: '1', rest: cfg.flyRest, intensity: phase === 1 ? '90-95%' : '95-100%', coachingCue: 'Build to speed. Hit the zone fast and tall.' },
    );
    yardage = reps * 30;
    if (phase === 2) {
      flyBlock.drills.push(
        { exerciseId: 'mv-fly-20', name: 'Flying 20 yd (20 yd build)', distance: '20+20 yd', sets: `${Math.max(2, reps - 1)}`, reps: '1', rest: cfg.flyRest, intensity: '95-100%', coachingCue: 'Smooth build. Maintain mechanics.' },
      );
      yardage += (reps - 1) * 40;
    }
  } else if (phase === 3) {
    const reps = cfg.flyReps;
    flyBlock.drills.push(
      { exerciseId: 'mv-fly-20', name: 'Flying 20 yd', distance: '20+20 yd', sets: `${reps}`, reps: '1', rest: cfg.flyRest, intensity: '100%', coachingCue: 'Tall. Fast hands. Relax the face.' },
    );
    yardage = reps * 40;
    if (level !== 'beginner') {
      flyBlock.drills.push(
        { exerciseId: 'mv-wicket-run', name: 'Wicket Run', sets: `${Math.max(2, reps - 2)}`, reps: '30 yd', rest: '2 min', coachingCue: 'Step over each wicket. Quick ground contact.' },
      );
      yardage += (reps - 2) * 30;
    }
  } else {
    // Phase 4: peak
    const reps = Math.max(3, cfg.flyReps - 1);
    flyBlock.drills.push(
      { exerciseId: 'mv-fly-20', name: 'Flying 20 yd', distance: '20+20 yd', sets: `${reps}`, reps: '1', rest: cfg.flyRest, intensity: '100%', coachingCue: 'Top speed. Relax and run.' },
    );
    yardage = reps * 40;
    if (level !== 'beginner') {
      flyBlock.drills.push(
        { exerciseId: 'mv-ins-outs', name: 'In-and-Outs', distance: '20+20+20 yd', sets: `${Math.max(2, reps - 1)}`, reps: '1', rest: '2 min', coachingCue: 'Accel, hold, coast. Smooth transitions.' },
      );
      yardage += (reps - 1) * 60;
    }
  }
  blocks.push(flyBlock);

  // Plyos
  blocks.push({
    label: 'Stiffness + Elasticity',
    drills: [
      { exerciseId: 'plyo-pogos', name: 'Pogos', sets: `${cfg.plyoSets}`, reps: '15', rest: '45s', coachingCue: 'Stiff ankles. Quick bounce.' },
      ...(phase >= 2 ? [
        { exerciseId: 'plyo-hurdle-hop', name: 'Hurdle Hops', sets: `${cfg.plyoSets}`, reps: '5', rest: '60s', coachingCue: 'Quick off the ground. Drive the knees.' },
      ] : [
        { exerciseId: 'plyo-line-hops', name: 'Line Hops', sets: `${cfg.plyoSets}`, reps: '10', rest: '30s', coachingCue: 'Stiff ankles. Quick lateral contact.' },
      ]),
      ...(phase >= 3 && level !== 'beginner' ? [
        { exerciseId: 'plyo-single-leg-hop', name: 'Single-Leg Hops', sets: `${cfg.plyoSets}`, reps: '5/side', rest: '60s', coachingCue: 'Drive the knee. Stay balanced.' },
      ] : []),
    ],
  });

  return {
    dayNumber: 2,
    sessionType: 'max_velocity',
    title: 'Max Velocity Day',
    subtitle: 'Flying sprints · Stiffness · Front-side mechanics',
    totalSprintYardage: Math.round(yardage * cfg.sprintYardMult),
    warmUp: warmUpBlock('max_velocity'),
    blocks,
  };
}

// ── Day 3: COD + Baseball Transfer ──────────────────────────────────────────

function buildCODSession(level: SpeedLevel, phase: PhaseNumber): SpeedSession {
  const cfg = LEVEL_CONFIGS[level];
  const blocks: SessionBlock[] = [];
  let yardage = 0;

  if (phase <= 2) {
    // Early phases: COD fundamentals
    blocks.push({
      label: 'Change of Direction',
      drills: [
        { exerciseId: 'cod-shuffle-sprint', name: 'Shuffle → Sprint', distance: '5+10 yd', sets: `${cfg.codReps}`, reps: '1/side', rest: '60s', intensity: '100%', coachingCue: 'Low shuffle. Hard plant. Explode.' },
        { exerciseId: 'cod-decel-5yd', name: 'Sprint → Decel', distance: '15+5 yd', sets: `${cfg.codReps}`, reps: '1', rest: '60s', intensity: '100%', coachingCue: 'Chop the feet. Lower the hips.' },
        ...(phase === 2 ? [
          { exerciseId: 'cod-5-10-5', name: '5-10-5 Pro Agility', distance: '20 yd total', sets: `${cfg.codReps}`, reps: '1', rest: '90s', intensity: '100%', coachingCue: 'Low to the line. Plant hard. Push off.' },
        ] : []),
      ],
    });
    yardage = cfg.codReps * 15 * 2 + cfg.codReps * 20 + (phase === 2 ? cfg.codReps * 20 : 0);

    blocks.push({
      label: 'Baseball Speed',
      drills: [
        { exerciseId: 'bb-drop-step-sprint', name: 'Drop Step → Sprint', distance: '15 yd', sets: `${cfg.codReps}`, reps: '1/side', rest: '60s', coachingCue: 'Open the hip. Push and sprint.' },
        ...(phase === 2 ? [
          { exerciseId: 'bb-crossover-go', name: 'Crossover → Go', distance: '15 yd', sets: `${cfg.codReps}`, reps: '1/side', rest: '60s', coachingCue: 'Aggressive crossover. Accelerate.' },
        ] : []),
      ],
    });
    yardage += cfg.codReps * 15 * 2 + (phase === 2 ? cfg.codReps * 15 * 2 : 0);
  } else {
    // Late phases: advanced COD + full baseball transfer
    blocks.push({
      label: 'Advanced COD',
      drills: [
        { exerciseId: 'cod-5-10-5', name: '5-10-5 Pro Agility', distance: '20 yd total', sets: `${cfg.codReps}`, reps: '1', rest: '90s', intensity: '100%', coachingCue: 'Max speed. Plant hard.' },
        { exerciseId: 'cod-decel-reaccel', name: 'Decel → Re-Accel', distance: '15+5+10 yd', sets: `${cfg.codReps}`, reps: '1', rest: '90s', intensity: '100%', coachingCue: 'Stop clean. Reload. Explode.' },
        ...(level !== 'beginner' ? [
          { exerciseId: 'cod-reaction-sprint', name: 'Reaction Sprint', distance: '10 yd', sets: `${cfg.codReps}`, reps: '1', rest: '60s', coachingCue: 'React and go. Don\'t guess.' },
        ] : []),
      ],
    });
    yardage = cfg.codReps * 20 + cfg.codReps * 30 + (level !== 'beginner' ? cfg.codReps * 10 : 0);

    blocks.push({
      label: 'Baseball Transfer Speed',
      drills: [
        { exerciseId: 'bb-curved-sprint', name: 'Curved Sprint (Base Path)', distance: '90 ft', sets: `${cfg.codReps}`, reps: '1', rest: '90s', intensity: '100%', coachingCue: 'Lean into the curve. Inside arm short.' },
        { exerciseId: 'bb-shuffle-break-sprint', name: 'Shuffle → Break → Sprint', distance: '5+15 yd', sets: `${cfg.codReps}`, reps: '1/side', rest: '60s', coachingCue: 'Low shuffle. Plant. Sprint.' },
        ...(phase === 4 ? [
          { exerciseId: 'bb-lead-steal-sprint', name: 'Lead + Steal Sprint', distance: '20 yd', sets: `${cfg.codReps}`, reps: '1', rest: '90s', coachingCue: 'Athletic base. Explosive crossover.' },
          { exerciseId: 'bb-home-to-first', name: 'Home-to-First', distance: '90 ft', sets: `${Math.max(2, cfg.codReps - 1)}`, reps: '1', rest: '2 min', coachingCue: 'Sprint through the bag. Max effort.' },
        ] : []),
      ],
    });
    yardage += cfg.codReps * 30 + cfg.codReps * 20 * 2 + (phase === 4 ? cfg.codReps * 20 + (cfg.codReps - 1) * 30 : 0);
  }

  // Plyos — lateral and decel focused
  blocks.push({
    label: 'Speed Plyometrics',
    drills: [
      { exerciseId: 'plyo-lateral-bound', name: 'Lateral Bound', sets: `${cfg.plyoSets}`, reps: '4/side', rest: '45s', coachingCue: 'Push off, fly, stick.' },
      { exerciseId: 'plyo-snap-down', name: 'Snap Downs', sets: `${cfg.plyoSets}`, reps: '4', rest: '45s', coachingCue: 'Tall to low. Absorb and stick.' },
      ...(phase >= 3 && level !== 'beginner' ? [
        { exerciseId: 'plyo-reactive-jump', name: 'Reactive Vertical Jump', sets: `${cfg.plyoSets}`, reps: '4', rest: '60s', coachingCue: 'Fast down, fast up. Minimize ground time.' },
      ] : []),
    ],
  });

  return {
    dayNumber: 3,
    sessionType: 'cod_baseball',
    title: phase <= 2 ? 'COD + Baseball Speed' : 'Baseball Transfer Speed',
    subtitle: phase <= 2
      ? 'Change of direction · Decel · Baseball starts'
      : 'COD · Curved sprints · Steal speed · Game speed',
    totalSprintYardage: Math.round(yardage * cfg.sprintYardMult),
    warmUp: warmUpBlock('cod'),
    blocks,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD COMPLETE PROGRAM
// ═══════════════════════════════════════════════════════════════════════════════

function getPhaseNumber(week: number): PhaseNumber {
  if (week <= 3) return 1;
  if (week <= 6) return 2;
  if (week <= 9) return 3;
  return 4;
}

function buildProgram(level: SpeedLevel): SpeedWeek[] {
  const weeks: SpeedWeek[] = [];
  for (let w = 1; w <= 12; w++) {
    const phase = getPhaseNumber(w);
    weeks.push({
      weekNumber: w,
      phase,
      isTestWeek: isSpeedTestWeek(w),
      sessions: [
        buildAccelSession(level, phase),
        buildMaxVeloSession(level, phase),
        buildCODSession(level, phase),
      ],
    });
  }
  return weeks;
}

// ── Exported Program Data ───────────────────────────────────────────────────

export const SPEED_PROGRAMS: Record<SpeedLevel, SpeedWeek[]> = {
  beginner: buildProgram('beginner'),
  intermediate: buildProgram('intermediate'),
  advanced: buildProgram('advanced'),
};

export function getSpeedWeek(level: SpeedLevel, weekNumber: number): SpeedWeek | undefined {
  return SPEED_PROGRAMS[level].find((w) => w.weekNumber === weekNumber);
}

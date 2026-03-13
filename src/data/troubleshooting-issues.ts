/* ────────────────────────────────────────────────
 * TROUBLESHOOTING ISSUE CONTENT
 *
 * Separate from diagnostic scoring — this is the display layer.
 * Each issue maps back to a MechanicalIssue (diagnostic output)
 * and a QUICK_FIXES key (drill pool).
 *
 * Diagnostic scoring is NOT touched by this file.
 * ──────────────────────────────────────────────── */

import type { MechanicalIssue } from './hitting-mechanical-diagnostic-data';

export type TroubleshootingSlug =
  | 'late'
  | 'lunging'
  | 'stuck'
  | 'losing-posture'
  | 'casting'
  | 'pulling-off'
  | 'rolling-over'
  | 'inconsistent-contact';

export interface TroubleshootingIssueData {
  slug: TroubleshootingSlug;
  label: string;
  /** Which diagnostic issue triggers this troubleshooting issue */
  diagnosticIssue: MechanicalIssue;
  /** Key into QUICK_FIXES for drill pool */
  drillPoolKey: string;
  description: string;
  cue: string;
  symptoms: string[];
  why: string;
  whatItLeadsTo: string;
  areas: string[];
  color: string;
}

export const TROUBLESHOOTING_ISSUES: Record<TroubleshootingSlug, TroubleshootingIssueData> = {
  late: {
    slug: 'late',
    label: 'Late',
    diagnosticIssue: 'timing',
    drillPoolKey: 'late',
    description:
      'Your load and stride aren\'t syncing with pitch speed. By the time the barrel gets to the zone, the ball is already past you.',
    cue: 'Get your foot down early, let the ball travel.',
    symptoms: [
      'Consistently late on fastballs',
      'Fouling pitches straight back',
      'Can\'t catch up to inside pitches',
    ],
    why: 'Your load is starting too late or your stride is taking too long to land. Without early timing, you\'re always chasing the pitch instead of letting it come to you.',
    whatItLeadsTo:
      'Missed fastballs, weak opposite-field contact, and an inability to handle inside pitches at any velocity.',
    areas: ['Forward Move', 'Launch Position'],
    color: '#e11d48',
  },

  lunging: {
    slug: 'lunging',
    label: 'Lunging',
    diagnosticIssue: 'weight_shift',
    drillPoolKey: 'lunging',
    description:
      'Your weight is drifting forward instead of staying back and driving through your hips. You lose balance and can\'t adjust mid-swing.',
    cue: 'Drive back hip forward before the barrel moves.',
    symptoms: [
      'Falling forward after swings',
      'Front knee collapsing on contact',
      'Getting fooled on every offspeed pitch',
    ],
    why: 'Your center of mass is moving toward the pitcher instead of rotating around a stable axis. The lower half leaks forward and your hands have nowhere to work from.',
    whatItLeadsTo:
      'Weak contact on offspeed, loss of adjustability, and power that never transfers from the ground into the barrel.',
    areas: ['Forward Move', 'Launch Position'],
    color: '#16a34a',
  },

  stuck: {
    slug: 'stuck',
    label: 'Stuck',
    diagnosticIssue: 'early_rotation',
    drillPoolKey: 'stuck',
    description:
      'Your hips fire before your weight shift is complete. The barrel drags through the zone and you lose both power and direction.',
    cue: 'Keep the barrel back — let the hips load first.',
    symptoms: [
      'Hips opening too early',
      'Weak pull-side ground balls',
      'Barrel dragging through the zone',
    ],
    why: 'Your lower half is rotating before it has anything to rotate against. Without a complete weight shift, the hips spin and the upper half has to play catch-up.',
    whatItLeadsTo:
      'Rolled-over ground balls to the pull side, loss of power to center and opposite field, and a swing that feels rushed.',
    areas: ['Connection', 'Forward Move'],
    color: '#f97316',
  },

  'losing-posture': {
    slug: 'losing-posture',
    label: 'Losing Posture',
    diagnosticIssue: 'swing_plane',
    drillPoolKey: 'losing-posture',
    description:
      'Your barrel isn\'t matching the pitch plane. You\'re either too steep or too flat, leading to pop-ups and weak grounders.',
    cue: 'Match the pitch plane — stay on it longer.',
    symptoms: [
      'Pop-ups on pitches you should drive',
      'Chopping down at the ball',
      'Standing up or pulling off during the swing',
    ],
    why: 'Your posture is breaking down during the swing — your head and spine angle change, which pulls the barrel off the pitch plane. You can\'t stay through the ball if your body is moving away from it.',
    whatItLeadsTo:
      'Pop-ups, weak grounders, inconsistent launch angles, and an inability to drive the ball with authority.',
    areas: ['Posture & Direction', 'Barrel Turn'],
    color: '#0891b2',
  },

  casting: {
    slug: 'casting',
    label: 'Casting',
    diagnosticIssue: 'disconnection',
    drillPoolKey: 'casting',
    description:
      'Your arms are working independently from your body rotation. The swing is all arms — you lose the chain of force from the ground up.',
    cue: 'Stay connected — body first, barrel follows.',
    symptoms: [
      'Hands drifting away from your body early',
      'Long, loopy swing path',
      'Feeling "armsy" or disconnected',
    ],
    why: 'Your hands are starting the swing instead of your body. When the arms work independently, you lose the kinetic chain — power generated by the legs and hips never reaches the barrel.',
    whatItLeadsTo:
      'Slow bat speed, inability to handle inside pitches, and inconsistent barrel accuracy across the zone.',
    areas: ['Connection', 'Barrel Turn'],
    color: '#8b5cf6',
  },

  'pulling-off': {
    slug: 'pulling-off',
    label: 'Pulling Off',
    diagnosticIssue: 'disconnection',
    drillPoolKey: 'pulling-off',
    description:
      'Your front side opens too early, pulling your barrel off the ball\'s path. Your head and eyes leave the ball before contact.',
    cue: 'Stay closed — see the ball hit the barrel.',
    symptoms: [
      'Flying open with the front shoulder',
      'Hitting everything to the pull side',
      'Missing or fouling outside pitches',
    ],
    why: 'Your front shoulder and hip are opening before the barrel reaches the hitting zone. This pulls your eye line and barrel path off the ball. You\'re swinging where the ball was, not where it is.',
    whatItLeadsTo:
      'Inability to use the whole field, weak pop-ups on outside pitches, and inconsistent contact even on good swings.',
    areas: ['Connection', 'Posture & Direction'],
    color: '#ec4899',
  },

  'rolling-over': {
    slug: 'rolling-over',
    label: 'Rolling Over',
    diagnosticIssue: 'early_rotation',
    drillPoolKey: 'rolling-over',
    description:
      'Your top hand rolls over the bottom hand at or before contact. The barrel dumps and you can\'t stay through the ball.',
    cue: 'Palm up, palm down through contact — stay through it.',
    symptoms: [
      'Weak ground balls to the pull side',
      'Top hand rolling over at contact',
      'Can\'t get the ball in the air consistently',
    ],
    why: 'Your top hand is dominating and pronating too early. Instead of staying through the ball with extension, the barrel rolls over and dumps the ball into the ground.',
    whatItLeadsTo:
      'Constant ground balls, inability to drive the ball in the air, and wasted bat speed that never turns into hard contact.',
    areas: ['Barrel Turn', 'Extension'],
    color: '#d946ef',
  },

  'inconsistent-contact': {
    slug: 'inconsistent-contact',
    label: 'Inconsistent Contact',
    diagnosticIssue: 'barrel_path',
    drillPoolKey: 'barrel-path',
    description:
      'Your barrel path is inefficient — either cutting across the ball or taking too long to get to the zone. You can\'t find consistent barrels.',
    cue: 'Get the barrel on plane early and stay through it.',
    symptoms: [
      'Fouling off hittable pitches',
      'Missing barrels consistently',
      'No pattern to your contact quality',
    ],
    why: 'Your barrel isn\'t getting on the pitch plane early enough or staying on it long enough. A short window of contact means you have to be perfect with timing — and nobody is perfect every swing.',
    whatItLeadsTo:
      'Foul balls on pitches you should crush, inconsistent hard contact, and a low average despite competitive at-bats.',
    areas: ['Barrel Turn', 'Extension'],
    color: '#ca8a04',
  },
};

/**
 * Given a diagnostic result (primary/secondary MechanicalIssue),
 * return all troubleshooting issues that apply.
 */
export function getTroubleshootingIssuesForDiagnostic(
  primary: MechanicalIssue,
  secondary: MechanicalIssue,
): { primary: TroubleshootingIssueData[]; secondary: TroubleshootingIssueData[] } {
  const all = Object.values(TROUBLESHOOTING_ISSUES);
  return {
    primary: all.filter((i) => i.diagnosticIssue === primary),
    secondary: all.filter(
      (i) => i.diagnosticIssue === secondary && i.diagnosticIssue !== primary,
    ),
  };
}

/* ────────────────────────────────────────────────
 * MOVER TYPE → MLB COMPARISONS
 *
 * Visual reference data so athletes can study how
 * elite hitters with similar movement patterns move.
 *
 * These are NOT meant to imply the athlete should
 * copy these swings exactly — they help visualize
 * movement patterns.
 * ──────────────────────────────────────────────── */

import type { MoverType } from './hitting-mover-type-data';

export interface MlbComparison {
  name: string;
  /** Short note on what to watch for in this hitter's swing */
  studyNote: string;
}

export const MOVER_MLB_COMPARISONS: Record<MoverType, MlbComparison[]> = {
  torque_engine: [
    {
      name: 'Shohei Ohtani',
      studyNote: 'Watch the massive hip-shoulder separation before the barrel fires. Pure torque.',
    },
    {
      name: 'Bryce Harper',
      studyNote: 'Notice how he winds up and unloads — the stretch creates the power.',
    },
    {
      name: 'Josh Donaldson',
      studyNote: 'Study his coil and delayed barrel release. The torque is unmistakable.',
    },
  ],

  ground_force: [
    {
      name: 'Aaron Judge',
      studyNote: 'Watch how he pushes into the ground before the barrel moves. Legs first.',
    },
    {
      name: 'Giancarlo Stanton',
      studyNote: 'Notice the ground force transfer from his back leg through rotation.',
    },
    {
      name: 'Vladimir Guerrero Jr.',
      studyNote: 'Study how his lower half drives everything — leg strength is his engine.',
    },
  ],

  linear_momentum: [
    {
      name: 'Freddie Freeman',
      studyNote: 'Watch his smooth forward move — everything flows toward the pitcher.',
    },
    {
      name: 'Corey Seager',
      studyNote: 'Notice how his weight transfer creates effortless power through momentum.',
    },
    {
      name: 'Trea Turner',
      studyNote: 'Study how his forward ride creates consistent hard contact to all fields.',
    },
  ],

  elastic: [
    {
      name: 'Fernando Tatis Jr.',
      studyNote: 'Watch how loose and elastic his body is — the whip creates elite bat speed.',
    },
    {
      name: 'Juan Soto',
      studyNote: 'Notice the natural flexibility and looseness through his entire swing.',
    },
    {
      name: 'Manny Machado',
      studyNote: 'Study how effortless his swing looks — flexibility creates the speed.',
    },
  ],

  compact_rotational: [
    {
      name: 'Mookie Betts',
      studyNote: 'Watch how compact his rotation is — quick hips, minimal wasted movement.',
    },
    {
      name: 'José Ramírez',
      studyNote: 'Notice how he stays centered and lets rotational speed create the power.',
    },
    {
      name: 'Alex Bregman',
      studyNote: 'Study his ability to stay short and still drive the ball with authority.',
    },
  ],

  explosive_quick_twitch: [
    {
      name: 'Ronald Acuña Jr.',
      studyNote: 'Watch the explosive athleticism — he reacts and fires with elite bat speed.',
    },
    {
      name: 'Bo Bichette',
      studyNote: 'Notice the fast-twitch violence in his swing — pure explosive energy.',
    },
    {
      name: 'Julio Rodríguez',
      studyNote: 'Study how his athleticism and explosiveness create power from any position.',
    },
  ],
};

/** Get MLB comparisons for a specific mover type. */
export function getMlbComparisons(moverType: MoverType): MlbComparison[] {
  return MOVER_MLB_COMPARISONS[moverType] ?? [];
}

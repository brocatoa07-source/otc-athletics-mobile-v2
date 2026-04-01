/**
 * My Path Mapping — Deterministic my_path_start_point → lane title + ordered steps.
 *
 * Each MyPathStartPoint maps to a development lane with 4 ordered phases.
 */

import type { MyPathStartPoint } from '../types/strengthProfile';

export interface MyPathLane {
  startPoint: MyPathStartPoint;
  title: string;
  description: string;
  steps: [string, string, string, string];
}

export const MY_PATH_LANES: Record<MyPathStartPoint, MyPathLane> = {
  own_positions: {
    startPoint: 'own_positions',
    title: 'Own Your Positions',
    description: 'Access → Control → Strength → Transfer',
    steps: [
      'Improve movement access',
      'Control positions under load',
      'Add usable strength',
      'Transfer to speed and rotation',
    ],
  },

  build_strength_base: {
    startPoint: 'build_strength_base',
    title: 'Build Your Strength Base',
    description: 'Force → Eccentric/Iso → Speed-Strength → Transfer',
    steps: [
      'Improve base force output',
      'Build eccentric and isometric strength',
      'Express force faster',
      'Transfer to sport',
    ],
  },

  build_elasticity: {
    startPoint: 'build_elasticity',
    title: 'Build Elasticity',
    description: 'Stiffness → Rebound → Max V Rhythm → Baseball Movement',
    steps: [
      'Improve stiffness and rebound',
      'Convert force to quickness',
      'Refine max velocity rhythm',
      'Transfer to baseball movement',
    ],
  },

  improve_acceleration: {
    startPoint: 'improve_acceleration',
    title: 'Improve Acceleration',
    description: 'First Step → Projection → Rotational Speed → Position-Specific',
    steps: [
      'Sharpen first-step mechanics',
      'Improve projection and force transfer',
      'Add rotational speed transfer',
      'Transfer to position-specific movement',
    ],
  },

  improve_rotation: {
    startPoint: 'improve_rotation',
    title: 'Improve Rotation',
    description: 'Separation → Sequencing → Speed Expression → Baseball Actions',
    steps: [
      'Improve separation access',
      'Improve sequencing and decel',
      'Increase rotational speed expression',
      'Transfer to baseball actions',
    ],
  },
};

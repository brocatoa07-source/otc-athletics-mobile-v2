/**
 * Mobility Vault — Category Definitions
 */

import type { VaultCategoryMeta } from './types';

export const MOBILITY_VAULT_CATEGORIES: VaultCategoryMeta[] = [
  {
    id: 'cat-mobility',
    slug: 'mobility',
    title: 'Mobility',
    description: 'Joint access, tissue quality, and range of motion work.',
    icon: 'body-outline',
    color: '#3b82f6',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'cat-movement-prep',
    slug: 'movement_prep',
    title: 'Movement Prep',
    description: 'Pre-training activation, CNS prep, and movement patterning.',
    icon: 'flash-outline',
    color: '#22c55e',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'cat-yoga-flow',
    slug: 'yoga_flow',
    title: 'Yoga Flow',
    description: 'Breath-driven flows for recovery, restoration, and body control.',
    icon: 'leaf-outline',
    color: '#8b5cf6',
    sortOrder: 3,
    active: true,
  },
];

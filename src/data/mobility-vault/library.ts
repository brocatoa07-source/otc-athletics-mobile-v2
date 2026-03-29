/**
 * Mobility Library — Master movement database.
 *
 * Aggregates all individual drills from the shared DRILL_LIBRARY,
 * organizes them into athlete-facing body-region categories,
 * and provides a "used in" flow lookup for each drill.
 */

import type { Drill, BodyRegionTag } from './types';
import { DRILL_LIBRARY } from './drills';
import { FLOWS } from './flows';

// ── Library Category ────────────────────────────────────────────────────────

export interface LibraryCategory {
  key: string;
  label: string;
  icon: string;          // Ionicons name
  color: string;
  /** Which BodyRegionTags map to this category */
  regionTags: BodyRegionTag[];
}

/**
 * Athlete-facing categories inferred from body region tags.
 * A drill belongs to a category if it has ANY matching region tag.
 */
export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  { key: 'hips',       label: 'Hips',                icon: 'body-outline',    color: '#3b82f6', regionTags: ['hip', 'pelvis', 'adductor'] },
  { key: 'tspine',     label: 'T-Spine',             icon: 'swap-vertical-outline', color: '#8b5cf6', regionTags: ['t_spine', 'ribcage'] },
  { key: 'shoulders',  label: 'Shoulders',           icon: 'fitness-outline', color: '#0891b2', regionTags: ['shoulder'] },
  { key: 'ankles',     label: 'Ankles & Feet',       icon: 'footsteps-outline', color: '#f59e0b', regionTags: ['ankle', 'foot_ankle'] },
  { key: 'hamstrings', label: 'Hamstrings',          icon: 'trending-up-outline', color: '#ef4444', regionTags: ['hamstring', 'posterior_chain'] },
  { key: 'trunk',      label: 'Trunk & Rotation',    icon: 'sync-outline',    color: '#22c55e', regionTags: ['trunk'] },
  { key: 'breathing',  label: 'Breathing & Recovery', icon: 'leaf-outline',   color: '#a855f7', regionTags: [] }, // special — drillType === 'breathing'
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** All active drills sorted alphabetically */
export function getAllDrills(): Drill[] {
  return Object.values(DRILL_LIBRARY)
    .filter((d) => d.active)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/** Get drills that belong to a library category */
export function getDrillsForCategory(categoryKey: string): Drill[] {
  const cat = LIBRARY_CATEGORIES.find((c) => c.key === categoryKey);
  if (!cat) return [];

  const all = getAllDrills();

  // Breathing category uses drillType instead of body region
  if (categoryKey === 'breathing') {
    return all.filter((d) => d.drillType === 'breathing');
  }

  return all.filter((d) =>
    d.bodyRegionTags.some((tag) => cat.regionTags.includes(tag)),
  );
}

/** Get the primary library category key for a drill (first match) */
export function getPrimaryCategoryKey(drill: Drill): string {
  if (drill.drillType === 'breathing') return 'breathing';

  for (const cat of LIBRARY_CATEGORIES) {
    if (cat.regionTags.length === 0) continue;
    if (drill.bodyRegionTags.some((tag) => cat.regionTags.includes(tag))) {
      return cat.key;
    }
  }
  return 'trunk'; // fallback
}

/** Get the primary category metadata for a drill */
export function getPrimaryCategory(drill: Drill): LibraryCategory {
  const key = getPrimaryCategoryKey(drill);
  return LIBRARY_CATEGORIES.find((c) => c.key === key) ?? LIBRARY_CATEGORIES[0];
}

// ── "Used In" flow lookup ───────────────────────────────────────────────────

export interface UsedInFlow {
  flowId: string;
  flowSlug: string;
  flowTitle: string;
  flowShortTitle: string;
  category: string;
}

/** Build a map of drillId → flows that use it */
let _usedInCache: Record<string, UsedInFlow[]> | null = null;

function buildUsedInMap(): Record<string, UsedInFlow[]> {
  if (_usedInCache) return _usedInCache;

  const map: Record<string, UsedInFlow[]> = {};
  for (const flow of FLOWS) {
    if (!flow.active) continue;
    for (const entry of flow.drills) {
      if (!map[entry.drillId]) map[entry.drillId] = [];
      // Dedupe — a drill can appear in a flow only once
      if (!map[entry.drillId].some((f) => f.flowId === flow.id)) {
        map[entry.drillId].push({
          flowId: flow.id,
          flowSlug: flow.slug,
          flowTitle: flow.title,
          flowShortTitle: flow.shortTitle,
          category: flow.category,
        });
      }
    }
  }
  _usedInCache = map;
  return map;
}

/** Get all flows that include a specific drill */
export function getUsedInFlows(drillId: string): UsedInFlow[] {
  return buildUsedInMap()[drillId] ?? [];
}

// ── Search ──────────────────────────────────────────────────────────────────

/** Search drills by name, body region, or cue text */
export function searchDrills(query: string): Drill[] {
  if (!query.trim()) return getAllDrills();
  const q = query.toLowerCase().trim();
  return getAllDrills().filter((d) =>
    d.title.toLowerCase().includes(q) ||
    d.coachingCue.toLowerCase().includes(q) ||
    d.bodyRegionTags.some((t) => t.replace('_', ' ').includes(q)) ||
    d.drillType.replace('_', ' ').includes(q),
  );
}

/** Filter drills by category key + optional search query */
export function filterLibraryDrills(categoryKey: string | null, query: string): Drill[] {
  let drills = query.trim() ? searchDrills(query) : getAllDrills();
  if (categoryKey) {
    const cat = LIBRARY_CATEGORIES.find((c) => c.key === categoryKey);
    if (cat) {
      if (categoryKey === 'breathing') {
        drills = drills.filter((d) => d.drillType === 'breathing');
      } else {
        drills = drills.filter((d) =>
          d.bodyRegionTags.some((tag) => cat.regionTags.includes(tag)),
        );
      }
    }
  }
  return drills;
}

/** Human-readable label for a body region tag */
export const BODY_REGION_LABELS: Record<BodyRegionTag, string> = {
  hip: 'Hip',
  ankle: 'Ankle',
  t_spine: 'T-Spine',
  shoulder: 'Shoulder',
  hamstring: 'Hamstring',
  adductor: 'Adductor',
  ribcage: 'Ribcage',
  pelvis: 'Pelvis',
  foot_ankle: 'Foot / Ankle',
  posterior_chain: 'Posterior Chain',
  trunk: 'Trunk',
};

/** Human-readable label for a drill type */
export const DRILL_TYPE_LABELS: Record<string, string> = {
  stretch: 'Stretch',
  mobilization: 'Mobilization',
  activation: 'Activation',
  flow: 'Flow',
  isometric: 'Isometric',
  dynamic: 'Dynamic',
  breathing: 'Breathing',
  balance: 'Balance',
  plyometric_prep: 'Plyo Prep',
};

/** Format dosage from drill defaults into readable string */
export function formatDosage(drill: Drill): string {
  const parts: string[] = [];
  if (drill.timingUnit === 'reps' && drill.defaultReps) {
    parts.push(`${drill.defaultReps} reps`);
  } else if (drill.timingUnit === 'seconds' && drill.defaultTimeSec) {
    parts.push(`${drill.defaultTimeSec}s hold`);
  } else if (drill.timingUnit === 'breaths' && drill.defaultBreaths) {
    parts.push(`${drill.defaultBreaths} breaths`);
  }
  if ((drill.defaultSides ?? 1) === 2) parts.push('/ side');
  return parts.join(' ') || '—';
}

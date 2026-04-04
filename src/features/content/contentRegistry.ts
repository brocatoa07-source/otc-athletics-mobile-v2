/**
 * Content Registry — Centralized structure for all content placeholders.
 *
 * Defines the shape of video, drill, and educational content
 * so the app can render placeholder states consistently
 * and content can be populated without code changes.
 */

// ── Content Item Types ──────────────────────────────────────────────────────

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  /** Video URL (empty string = placeholder) */
  videoUrl: string;
  /** Thumbnail URL (empty string = use default) */
  thumbnailUrl: string;
  /** Coaching notes shown below video */
  coachingNotes: string;
  /** Category for filtering */
  category: ContentCategory;
  /** Tags for search/filter */
  tags: string[];
}

export type ContentCategory =
  // Hitting
  | 'hitting_tee'
  | 'hitting_flips'
  | 'hitting_machine'
  | 'hitting_compete'
  | 'hitting_education'
  // Strength
  | 'strength_movement_prep'
  | 'strength_lift_demo'
  | 'strength_sprint_demo'
  | 'strength_plyo_demo'
  | 'strength_mobility'
  // Mental
  | 'mental_tools'
  | 'mental_breathing'
  | 'mental_resets'
  | 'mental_journal'
  | 'mental_routines';

// ── Content Status Helpers ──────────────────────────────────────────────────

/**
 * Check if a content item has a real video vs placeholder.
 */
export function hasVideo(item: ContentItem | { videoUrl?: string }): boolean {
  return !!(item.videoUrl && item.videoUrl.length > 0);
}

/**
 * Get a placeholder message for missing content.
 */
export function getPlaceholderMessage(category: ContentCategory): string {
  const messages: Partial<Record<ContentCategory, string>> = {
    hitting_tee: 'Tee drill video coming soon.',
    hitting_flips: 'Flips drill video coming soon.',
    hitting_machine: 'Machine training video coming soon.',
    hitting_compete: 'Competition round video coming soon.',
    hitting_education: 'Educational content coming soon.',
    strength_lift_demo: 'Lift demonstration coming soon.',
    strength_sprint_demo: 'Sprint drill video coming soon.',
    strength_plyo_demo: 'Plyometric drill video coming soon.',
    strength_movement_prep: 'Movement prep flow coming soon.',
    strength_mobility: 'Mobility routine coming soon.',
    mental_tools: 'Mental performance tool coming soon.',
    mental_breathing: 'Breathing exercise coming soon.',
    mental_resets: 'Reset routine coming soon.',
    mental_journal: 'Journal prompt coming soon.',
    mental_routines: 'Game-day routine coming soon.',
  };
  return messages[category] ?? 'Content coming soon.';
}

// ── Content Counts (for progress tracking) ──────────────────────────────────

export interface ContentCounts {
  total: number;
  withVideo: number;
  placeholder: number;
  percentPopulated: number;
}

/**
 * Count content population status for an array of items.
 */
export function getContentCounts(items: Array<{ videoUrl?: string }>): ContentCounts {
  const total = items.length;
  const withVideo = items.filter(i => i.videoUrl && i.videoUrl.length > 0).length;
  return {
    total,
    withVideo,
    placeholder: total - withVideo,
    percentPopulated: total > 0 ? Math.round((withVideo / total) * 100) : 0,
  };
}

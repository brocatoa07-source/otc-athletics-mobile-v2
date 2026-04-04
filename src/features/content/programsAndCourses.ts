/**
 * Programs & Courses — Content Access System
 *
 * Programs: included in membership tier
 * Courses: one-time purchases (separate from tier)
 *
 * Programs unlock based on tier (SINGLE → TRIPLE → HOME_RUN)
 * Courses unlock based on purchase (except GRAND_SLAM which unlocks all)
 */

import type { AthleteTier } from '@/types/database';
import { tierAtLeast } from '../billing/tierAccess';

// ── Types ───────────────────────────────────────────────────────────────────

export type ContentType = 'program' | 'course';
export type ContentCategory = 'hitting' | 'mental' | 'strength' | 'general';

export type LockState = 'unlocked' | 'locked_tier' | 'locked_purchase';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: ContentCategory;
  /** Minimum tier required (programs only) */
  requiredTier: AthleteTier | null;
  /** Price in dollars (courses only) */
  price: number | null;
  icon: string;
  color: string;
  /** Whether this content is currently active/available */
  isActive: boolean;
}

// ── Programs (Included in Membership) ───────────────────────────────────────

export const PROGRAMS: ContentItem[] = [
  // ── Launch Programs (5) ────────────────────────────────────────────────────
  { id: 'prog-strength', title: 'Strength Program', description: 'A baseball performance lifting program built to improve force production, durability, power, and total athletic development.', type: 'program', category: 'strength', requiredTier: 'TRIPLE', price: null, icon: 'barbell-outline', color: '#1DB954', isActive: true },
  { id: 'prog-speed', title: 'Speed Program', description: 'A speed development program focused on acceleration, first-step quickness, max velocity, and baseball movement.', type: 'program', category: 'strength', requiredTier: 'TRIPLE', price: null, icon: 'speedometer-outline', color: '#ef4444', isActive: true },
  { id: 'prog-arm-care', title: 'Arm Care Program', description: 'A structured arm care program for shoulder health, cuff strength, scap control, recovery, and throwing preparation.', type: 'program', category: 'strength', requiredTier: 'TRIPLE', price: null, icon: 'fitness-outline', color: '#8b5cf6', isActive: true },
  { id: 'prog-bat-speed', title: 'Bat Speed Program', description: 'A bat speed and rotational power program designed to improve barrel speed, connection, and game power.', type: 'program', category: 'hitting', requiredTier: 'SINGLE', price: null, icon: 'flash-outline', color: '#f97316', isActive: true },
  { id: 'prog-mobility', title: 'Mobility Program', description: 'A mobility system for hips, shoulders, t-spine, ankles, and recovery to help athletes move better and stay available.', type: 'program', category: 'strength', requiredTier: 'TRIPLE', price: null, icon: 'body-outline', color: '#0891b2', isActive: true },
];

// ── Courses (One-Time Purchases) ────────────────────────────────────────────

export const COURSES: ContentItem[] = [
  // ── Launch Courses (4) ─────────────────────────────────────────────────────
  { id: 'course-mental-mastery', title: 'Mental Mastery', description: 'A structured mental performance course built around the 11 core skills athletes need to compete with confidence, emotional control, focus, and accountability.', type: 'course', category: 'mental', requiredTier: null, price: 99, icon: 'bulb', color: '#a855f7', isActive: true },
  { id: 'course-hitting-approach', title: 'Hitting Approach', description: 'A hitting IQ course that teaches game planning, timing, pitch recognition, counts, zones, and the approach serious hitters need in competition.', type: 'course', category: 'hitting', requiredTier: null, price: 99, icon: 'baseball', color: '#f97316', isActive: true },
  { id: 'course-throwing-arm-care', title: 'Throwing & Arm Care', description: 'An education course covering throwing development, arm care, recovery, mechanics, and how to protect and improve throwing performance.', type: 'course', category: 'strength', requiredTier: null, price: 99, icon: 'fitness', color: '#22c55e', isActive: true },
  { id: 'course-strength-speed', title: 'Strength & Speed', description: 'A performance education course teaching baseball athletes how to train for speed, strength, explosiveness, mobility, and recovery.', type: 'course', category: 'strength', requiredTier: null, price: 99, icon: 'barbell', color: '#1DB954', isActive: true },
];

// ── All Content ─────────────────────────────────────────────────────────────

export const ALL_CONTENT: ContentItem[] = [...PROGRAMS, ...COURSES];

// ── Access Logic ────────────────────────────────────────────────────────────

/**
 * Determine if a user can access a content item.
 *
 * Programs: tier-based access
 * Courses: purchase-based access (GRAND_SLAM overrides)
 */
export function canUserAccessContent(
  userTier: AthleteTier,
  item: ContentItem,
  purchasedContentIds: string[] = [],
): LockState {
  // GRAND_SLAM gets everything
  if (userTier === 'GRAND_SLAM') return 'unlocked';

  if (item.type === 'program') {
    if (!item.requiredTier) return 'unlocked';
    return tierAtLeast(userTier, item.requiredTier) ? 'unlocked' : 'locked_tier';
  }

  if (item.type === 'course') {
    return purchasedContentIds.includes(item.id) ? 'unlocked' : 'locked_purchase';
  }

  return 'locked_tier';
}

/**
 * Get the lock message for a content item.
 */
export function getLockMessage(item: ContentItem, lockState: LockState): string {
  if (lockState === 'unlocked') return '';

  if (lockState === 'locked_tier') {
    const tierLabels: Record<string, string> = {
      SINGLE: 'Single', DOUBLE: 'Double', TRIPLE: 'Triple',
      HOME_RUN: 'Home Run', GRAND_SLAM: 'Grand Slam',
    };
    const label = item.requiredTier ? tierLabels[item.requiredTier] ?? item.requiredTier : 'a higher tier';
    return `Upgrade to ${label} to unlock`;
  }

  if (lockState === 'locked_purchase') {
    return item.price ? `$${item.price} — Purchase to unlock` : 'Purchase to unlock';
  }

  return 'Locked';
}

/**
 * Get programs available for a pillar/category.
 */
export function getProgramsForCategory(category: ContentCategory): ContentItem[] {
  return PROGRAMS.filter(p => p.category === category && p.isActive);
}

/**
 * Get all active courses.
 */
export function getActiveCourses(): ContentItem[] {
  return COURSES.filter(c => c.isActive);
}

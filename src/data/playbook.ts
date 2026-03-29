/**
 * Playbook — Athlete's personal performance notebook.
 *
 * Entry types: note, journal, cue, saved_drill, mental_tool, routine, game_note
 * Plus: video uploads with separate storage.
 * AsyncStorage-backed for now. TODO: Sync to Supabase notebook_entries / notebook_videos.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Entry Types ─────────────────────────────────────────────────────────────

export type PlaybookEntryType =
  | 'note'
  | 'journal'
  | 'cue'
  | 'saved_drill'
  | 'mental_tool'
  | 'routine'
  | 'game_note';

export interface PlaybookEntry {
  id: string;
  type: PlaybookEntryType;
  title: string;
  body: string;
  tags: string[];
  favorite: boolean;
  /** Optional metadata (e.g. source drill name, tool name) */
  meta?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Entry Type Metadata ─────────────────────────────────────────────────────

export interface EntryTypeMeta {
  key: PlaybookEntryType;
  label: string;
  icon: string;
  color: string;
  placeholder: string;
}

export const ENTRY_TYPE_META: EntryTypeMeta[] = [
  { key: 'note', label: 'Note', icon: 'document-text-outline', color: '#3b82f6', placeholder: 'What\'s on your mind? Save a thought, idea, or observation...' },
  { key: 'journal', label: 'Journal', icon: 'book-outline', color: '#8b5cf6', placeholder: 'Reflect on your day. What went well? What needs work?' },
  { key: 'cue', label: 'Cue', icon: 'mic-outline', color: '#f59e0b', placeholder: 'Save a coaching cue that clicked for you...' },
  { key: 'saved_drill', label: 'Saved Drill', icon: 'baseball-outline', color: '#E10600', placeholder: 'Describe the drill and what it helps you with...' },
  { key: 'mental_tool', label: 'Mental Tool', icon: 'sparkles-outline', color: '#a855f7', placeholder: 'Save a mental reset, routine, or tool that works...' },
  { key: 'routine', label: 'Routine', icon: 'repeat-outline', color: '#22c55e', placeholder: 'Describe your pre-game, in-game, or training routine...' },
  { key: 'game_note', label: 'Game Note', icon: 'trophy-outline', color: '#0891b2', placeholder: 'What happened in the game? What did you learn?' },
];

export function getEntryTypeMeta(type: PlaybookEntryType): EntryTypeMeta {
  return ENTRY_TYPE_META.find((m) => m.key === type) ?? ENTRY_TYPE_META[0];
}

export function getEntryTypeLabel(type: PlaybookEntryType): string {
  return getEntryTypeMeta(type).label;
}

export function getEntryTypeIcon(type: PlaybookEntryType): string {
  return getEntryTypeMeta(type).icon;
}

export function getEntryTypeColor(type: PlaybookEntryType): string {
  return getEntryTypeMeta(type).color;
}

// ── Entry Storage ───────────────────────────────────────────────────────────

const STORAGE_KEY = 'otc:playbook-entries';

export async function loadPlaybookEntries(): Promise<PlaybookEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const entries = raw ? JSON.parse(raw) : [];
    // Migrate old entries missing new fields
    return entries.map((e: any) => ({
      ...e,
      tags: e.tags ?? [],
      favorite: e.favorite ?? false,
      type: e.type === 'drill' ? 'saved_drill' : e.type === 'video' ? 'note' : e.type,
    }));
  } catch {
    return [];
  }
}

export async function savePlaybookEntry(entry: PlaybookEntry): Promise<void> {
  const all = await loadPlaybookEntries();
  const idx = all.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.unshift(entry);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export async function deletePlaybookEntry(id: string): Promise<void> {
  const all = await loadPlaybookEntries();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter((e) => e.id !== id)));
}

export async function toggleEntryFavorite(id: string): Promise<void> {
  const all = await loadPlaybookEntries();
  const idx = all.findIndex((e) => e.id === id);
  if (idx >= 0) {
    all[idx].favorite = !all[idx].favorite;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

export async function getRecentPlaybookEntry(): Promise<PlaybookEntry | null> {
  const all = await loadPlaybookEntries();
  return all.length > 0 ? all[0] : null;
}

export function generatePlaybookId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Video Types ─────────────────────────────────────────────────────────────

export type VideoCategory = 'hitting' | 'throwing' | 'strength' | 'game' | 'mental';

export interface PlaybookVideo {
  id: string;
  title: string;
  videoUri: string;
  thumbnailUri?: string;
  notes: string;
  category: VideoCategory;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export const VIDEO_CATEGORIES: { key: VideoCategory; label: string; icon: string; color: string }[] = [
  { key: 'hitting', label: 'Hitting', icon: 'baseball-outline', color: '#E10600' },
  { key: 'throwing', label: 'Throwing', icon: 'arrow-up-outline', color: '#3b82f6' },
  { key: 'strength', label: 'Strength', icon: 'barbell-outline', color: '#22c55e' },
  { key: 'game', label: 'Game', icon: 'trophy-outline', color: '#f59e0b' },
  { key: 'mental', label: 'Mental / Reflection', icon: 'sparkles-outline', color: '#8b5cf6' },
];

// ── Video Storage ───────────────────────────────────────────────────────────

const VIDEO_STORAGE_KEY = 'otc:playbook-videos';

export async function loadPlaybookVideos(): Promise<PlaybookVideo[]> {
  try {
    const raw = await AsyncStorage.getItem(VIDEO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function savePlaybookVideo(video: PlaybookVideo): Promise<void> {
  const all = await loadPlaybookVideos();
  const idx = all.findIndex((v) => v.id === video.id);
  if (idx >= 0) {
    all[idx] = video;
  } else {
    all.unshift(video);
  }
  await AsyncStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(all));
}

export async function deletePlaybookVideo(id: string): Promise<void> {
  const all = await loadPlaybookVideos();
  await AsyncStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(all.filter((v) => v.id !== id)));
}

export async function toggleVideoFavorite(id: string): Promise<void> {
  const all = await loadPlaybookVideos();
  const idx = all.findIndex((v) => v.id === id);
  if (idx >= 0) {
    all[idx].favorite = !all[idx].favorite;
    await AsyncStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(all));
  }
}

export async function getRecentVideo(): Promise<PlaybookVideo | null> {
  const all = await loadPlaybookVideos();
  return all.length > 0 ? all[0] : null;
}

export function getVideoCategoryLabel(cat: VideoCategory): string {
  return VIDEO_CATEGORIES.find((c) => c.key === cat)?.label ?? cat;
}

export function getVideoCategoryColor(cat: VideoCategory): string {
  return VIDEO_CATEGORIES.find((c) => c.key === cat)?.color ?? '#666';
}

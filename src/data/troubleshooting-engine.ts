/**
 * Troubleshooting Engine — 7-Day Lock Block System
 *
 * Core rule: FREE TO LEARN. LOCKED TO TRAIN.
 *
 * Product rules (Phase 1.5):
 *   - Athlete can lock into ONE topic at a time
 *   - Block lasts 7 days from lock-in date
 *   - Athlete can SWITCH topic on Day 1 only (same-day grace period)
 *   - Athlete can ABANDON a block any time (tracked, warned)
 *   - Block auto-expires after 7 days → completed (≥5 check-ins) or expired
 *   - Athlete can immediately repeat a topic or choose new after block ends
 *   - Check-in can happen from topic page or dashboard
 *   - History tracks: completed | expired | abandoned
 *   - Smart suggestions fire on repeat topics, quit patterns, category habits
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface TroubleshootingCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  orderIndex: number;
}

export interface TroubleshootingTopic {
  id: string;
  categoryId: string;
  title: string;
  shortDescription: string;
  relatedSectionKeys: string[];
  drillNames: string[];
  cues: string[];
}

export type BlockStatus = 'completed' | 'expired' | 'abandoned';

export interface ActiveBlock {
  id: string;
  topicId: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  isActive: boolean;
  completedDaysCount: number;
  checkedInDays: string[];
  createdAt: string;
  /** Custom drill selections per day (1-7 → drill id). Null = legacy/no custom plan. */
  dailyDrills: Record<number, string> | null;
}

export interface BlockHistoryEntry {
  id: string;
  topicId: string;
  startDate: string;
  endDate: string;
  completedDaysCount: number;
  blockStatus: BlockStatus;
  abandonedAt: string | null;
  createdAt: string;
}

export interface TopicStats {
  topicId: string;
  timesSelected: number;
  timesCompleted: number;
  lastSelectedDate: string;
}

export interface SmartSuggestion {
  type: 'repeat_warning' | 'quit_warning' | 'playbook_prompt';
  message: string;
  topicId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════════════

const ACTIVE_BLOCK_KEY = 'otc:ts-active-block';
const HISTORY_KEY = 'otc:ts-block-history';
const STATS_KEY = 'otc:ts-topic-stats';

// ═══════════════════════════════════════════════════════════════════════════════
// DATE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getCurrentDayOfBlock(startDate: string): number {
  const today = todayStr();
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  const start = new Date(sy, sm - 1, sd);
  const now = new Date(ty, tm - 1, td);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return Math.min(Math.max(diff + 1, 1), 8); // 1-7, or 8 if past end
}

export function getDaysRemaining(endDate: string): number {
  const today = todayStr();
  const [ey, em, ed] = endDate.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  const end = new Date(ey, em - 1, ed);
  const now = new Date(ty, tm - 1, td);
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 86_400_000));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVE BLOCK — CRUD + STATE TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function loadActiveBlock(): Promise<ActiveBlock | null> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_BLOCK_KEY);
    if (!raw) return null;
    const block: ActiveBlock = JSON.parse(raw);

    // Auto-expire if past end date
    if (block.isActive && todayStr() > block.endDate) {
      const status: BlockStatus = block.completedDaysCount >= 5 ? 'completed' : 'expired';
      block.isActive = false;
      await AsyncStorage.setItem(ACTIVE_BLOCK_KEY, JSON.stringify(block));

      // Finalize history
      await finalizeHistoryEntry(block.id, block.completedDaysCount, status);

      if (status === 'completed') {
        await incrementTopicCompleted(block.topicId);
      }
    }

    return block;
  } catch {
    return null;
  }
}

/** Check if athlete can lock into a new topic */
export async function canLockIn(): Promise<{ allowed: boolean; reason?: string; currentTopic?: string; canSwitch?: boolean }> {
  const block = await loadActiveBlock();
  if (!block || !block.isActive) return { allowed: true };

  // Day 1 grace: can switch topics on the same day as lock-in
  const day = getCurrentDayOfBlock(block.startDate);
  const canSwitch = day === 1;

  const topic = TROUBLESHOOTING_TOPICS.find((t) => t.id === block.topicId);
  return {
    allowed: false,
    reason: canSwitch
      ? `You locked into "${topic?.title ?? 'a topic'}" today. You can switch to a different topic since it's still Day 1.`
      : `You are locked into "${topic?.title ?? 'a topic'}". Your block ends on ${block.endDate}.`,
    currentTopic: topic?.title,
    canSwitch,
  };
}

/** Lock into a topic. If Day 1 switch, abandons the current block first. */
export async function lockInTopic(topicId: string): Promise<ActiveBlock> {
  // If switching on Day 1, abandon current block
  const current = await loadActiveBlock();
  if (current?.isActive) {
    const day = getCurrentDayOfBlock(current.startDate);
    if (day === 1) {
      await abandonBlock(); // Day 1 switch — counts as abandoned
    }
  }

  const today = todayStr();
  const endDate = addDays(today, 7);
  const now = new Date().toISOString();

  const block: ActiveBlock = {
    id: generateId(),
    topicId,
    startDate: today,
    endDate,
    isActive: true,
    completedDaysCount: 0,
    checkedInDays: [],
    createdAt: now,
    dailyDrills: null,
  };

  await AsyncStorage.setItem(ACTIVE_BLOCK_KEY, JSON.stringify(block));

  // Create history entry (status TBD — will be finalized on completion/expiry/abandon)
  await addToHistory({
    id: block.id,
    topicId,
    startDate: today,
    endDate,
    completedDaysCount: 0,
    blockStatus: 'expired', // default — will be updated on finalization
    abandonedAt: null,
    createdAt: now,
  });

  await incrementTopicSelected(topicId);

  return block;
}

/** Check in for today's training. Can be called from any screen. */
export async function checkInToday(): Promise<ActiveBlock | null> {
  const block = await loadActiveBlock();
  if (!block || !block.isActive) return null;

  const today = todayStr();
  if (block.checkedInDays.includes(today)) return block; // already checked in

  block.checkedInDays.push(today);
  block.completedDaysCount = block.checkedInDays.length;
  await AsyncStorage.setItem(ACTIVE_BLOCK_KEY, JSON.stringify(block));

  await updateHistoryDaysCount(block.id, block.completedDaysCount);

  return block;
}

/** Abandon the current block. Tracked in history with abandoned status. */
export async function abandonBlock(): Promise<void> {
  const block = await loadActiveBlock();
  if (!block || !block.isActive) return;

  block.isActive = false;
  await AsyncStorage.setItem(ACTIVE_BLOCK_KEY, JSON.stringify(block));

  await finalizeHistoryEntry(block.id, block.completedDaysCount, 'abandoned');
}

/** Clear active block from storage (used after viewing completion state) */
export async function clearActiveBlock(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_BLOCK_KEY);
}

/** Lock in a topic WITH a custom 7-day drill plan */
export async function lockInTopicWithPlan(topicId: string, dailyDrills: Record<number, string>): Promise<ActiveBlock> {
  const current = await loadActiveBlock();
  if (current?.isActive) {
    const day = getCurrentDayOfBlock(current.startDate);
    if (day === 1) await abandonBlock();
  }

  const today = todayStr();
  const endDate = addDays(today, 7);
  const now = new Date().toISOString();

  const block: ActiveBlock = {
    id: generateId(),
    topicId,
    startDate: today,
    endDate,
    isActive: true,
    completedDaysCount: 0,
    checkedInDays: [],
    createdAt: now,
    dailyDrills,
  };

  await AsyncStorage.setItem(ACTIVE_BLOCK_KEY, JSON.stringify(block));

  await addToHistory({
    id: block.id,
    topicId,
    startDate: today,
    endDate,
    completedDaysCount: 0,
    blockStatus: 'expired',
    abandonedAt: null,
    createdAt: now,
  });

  await incrementTopicSelected(topicId);
  return block;
}

/** Get today's assigned drill ID from the active block */
export function getTodaysDrillId(block: ActiveBlock | null): string | null {
  if (!block?.isActive || !block.dailyDrills) return null;
  const day = getCurrentDayOfBlock(block.startDate);
  if (day > 7) return null;
  return block.dailyDrills[day] ?? null;
}

/** Check if today is checked in for the active block */
export function isTodayCheckedIn(block: ActiveBlock | null): boolean {
  if (!block || !block.isActive) return false;
  return block.checkedInDays.includes(todayStr());
}

// ═══════════════════════════════════════════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════════════════════════════════════════

export async function loadHistory(): Promise<BlockHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    // Migrate old entries missing blockStatus
    const entries = JSON.parse(raw) as any[];
    return entries.map((e) => ({
      ...e,
      blockStatus: e.blockStatus ?? (e.completed ? 'completed' : 'expired'),
      abandonedAt: e.abandonedAt ?? null,
    }));
  } catch {
    return [];
  }
}

async function addToHistory(entry: BlockHistoryEntry): Promise<void> {
  const history = await loadHistory();
  const idx = history.findIndex((h) => h.id === entry.id);
  if (idx >= 0) {
    history[idx] = entry;
  } else {
    history.unshift(entry);
  }
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

async function updateHistoryDaysCount(blockId: string, completedDays: number): Promise<void> {
  const history = await loadHistory();
  const idx = history.findIndex((h) => h.id === blockId);
  if (idx >= 0) {
    history[idx].completedDaysCount = completedDays;
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

async function finalizeHistoryEntry(blockId: string, completedDays: number, status: BlockStatus): Promise<void> {
  const history = await loadHistory();
  const idx = history.findIndex((h) => h.id === blockId);
  if (idx >= 0) {
    history[idx].completedDaysCount = completedDays;
    history[idx].blockStatus = status;
    if (status === 'abandoned') {
      history[idx].abandonedAt = new Date().toISOString();
    }
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOPIC STATS
// ═══════════════════════════════════════════════════════════════════════════════

export async function loadTopicStats(): Promise<TopicStats[]> {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getTopicStat(topicId: string): Promise<TopicStats | null> {
  const stats = await loadTopicStats();
  return stats.find((s) => s.topicId === topicId) ?? null;
}

async function incrementTopicSelected(topicId: string): Promise<void> {
  const stats = await loadTopicStats();
  const idx = stats.findIndex((s) => s.topicId === topicId);
  if (idx >= 0) {
    stats[idx].timesSelected++;
    stats[idx].lastSelectedDate = todayStr();
  } else {
    stats.push({ topicId, timesSelected: 1, timesCompleted: 0, lastSelectedDate: todayStr() });
  }
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

async function incrementTopicCompleted(topicId: string): Promise<void> {
  const stats = await loadTopicStats();
  const idx = stats.findIndex((s) => s.topicId === topicId);
  if (idx >= 0) {
    stats[idx].timesCompleted++;
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMART SUGGESTIONS (rule-based)
// ═══════════════════════════════════════════════════════════════════════════════

export async function getSmartSuggestions(): Promise<SmartSuggestion[]> {
  const stats = await loadTopicStats();
  const history = await loadHistory();
  const suggestions: SmartSuggestion[] = [];

  // Rule 1: Repeated topic (selected 3+ times)
  for (const s of stats) {
    if (s.timesSelected >= 3) {
      const topic = TROUBLESHOOTING_TOPICS.find((t) => t.id === s.topicId);
      suggestions.push({
        type: 'repeat_warning',
        message: `You've worked on "${topic?.title ?? 'this problem'}" ${s.timesSelected} times. Spend more time this week on flips, overhand, and machine work so the change transfers to games.`,
        topicId: s.topicId,
      });
    }
  }

  // Rule 2: Quit early often (abandoned 2+ blocks)
  const abandonedCount = history.filter((h) => h.blockStatus === 'abandoned').length;
  if (abandonedCount >= 2) {
    suggestions.push({
      type: 'quit_warning',
      message: 'You tend to switch topics before finishing a full week. Real change happens when you stay with a skill long enough.',
    });
  }

  // Rule 3: Same category appears often (3+ blocks in same category)
  const categoryCount: Record<string, number> = {};
  for (const h of history) {
    const topic = TROUBLESHOOTING_TOPICS.find((t) => t.id === h.topicId);
    if (topic) {
      categoryCount[topic.categoryId] = (categoryCount[topic.categoryId] ?? 0) + 1;
    }
  }
  for (const [catId, count] of Object.entries(categoryCount)) {
    if (count >= 3) {
      const cat = TROUBLESHOOTING_CATEGORIES.find((c) => c.id === catId);
      suggestions.push({
        type: 'playbook_prompt',
        message: `Add your best drills and cues from ${cat?.title ?? 'this category'} to your Playbook.`,
      });
    }
  }

  return suggestions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA — Categories + Topics
// ═══════════════════════════════════════════════════════════════════════════════

export const TROUBLESHOOTING_CATEGORIES: TroubleshootingCategory[] = [
  { id: 'timing', title: 'Timing', description: 'Late, early, out of sync with the pitch.', icon: 'timer-outline', color: '#e11d48', orderIndex: 1 },
  { id: 'contact', title: 'Contact Point & Barrel Control', description: 'Rolling over, popping up, foul balls, weak contact.', icon: 'baseball-outline', color: '#3b82f6', orderIndex: 2 },
  { id: 'posture', title: 'Posture & Direction', description: 'Pulling off, no oppo, losing posture through contact.', icon: 'body-outline', color: '#0891b2', orderIndex: 3 },
  { id: 'adjustability', title: 'Adjustability & Pitch Recognition', description: 'Can\'t adjust to locations, chasing, can\'t hit offspeed.', icon: 'options-outline', color: '#f59e0b', orderIndex: 4 },
  { id: 'approach', title: 'Approach & Game Performance', description: 'No plan, passive, BP hitter, strikeouts.', icon: 'bulb-outline', color: '#a855f7', orderIndex: 5 },
  { id: 'power', title: 'Barrel Speed, Strength & Connection', description: 'Weak contact, no power, disconnected swing.', icon: 'flash-outline', color: '#22c55e', orderIndex: 6 },
];

export const TROUBLESHOOTING_TOPICS: TroubleshootingTopic[] = [
  // ── Timing ──
  { id: 'always-late', categoryId: 'timing', title: 'I\'m Always Late', shortDescription: 'Can\'t catch up to fastballs. Swing starts too late.', relatedSectionKeys: ['timing', 'foundations'], drillNames: ['Go Drill', 'Heel Load Drill', 'Swing at Release', 'Rhythm Rocker Drill'], cues: ['Start earlier', 'Be early to launch', 'See it, go'] },
  { id: 'always-early', categoryId: 'timing', title: 'I Commit Too Early', shortDescription: 'Out in front of everything. Can\'t stay back.', relatedSectionKeys: ['timing', 'adjustability'], drillNames: ['Delay Load Drill', 'Variable Front Toss', 'Yes/No Drill'], cues: ['See it longer', 'Let it travel', 'Adjust, don\'t guess'] },
  { id: 'no-rhythm', categoryId: 'timing', title: 'I Have No Rhythm', shortDescription: 'Stiff, tense, dead legs. No flow to the swing.', relatedSectionKeys: ['timing', 'forward-move'], drillNames: ['Rhythm Rocker Drill', 'Step Back Drill', 'Belli\'s Drill'], cues: ['Slow early, fast late', 'Find your rhythm', 'Breathe and move'] },
  // ── Contact ──
  { id: 'rolling-over', categoryId: 'contact', title: 'I Keep Rolling Over', shortDescription: 'Weak ground balls to the pull side.', relatedSectionKeys: ['extension', 'connection'], drillNames: ['No Roll Overs', 'Out Front Tee Drill', 'Connection Ball Drill'], cues: ['Let it fly', 'Through the middle', 'Stay through the ball'] },
  { id: 'popping-up', categoryId: 'contact', title: 'I Pop Up Everything', shortDescription: 'Getting under the ball. Swing is too steep.', relatedSectionKeys: ['posture', 'barrel-turn'], drillNames: ['PVC Pipe Swings', 'High Tee Normal Swing', 'Low Away Tee'], cues: ['Match the plane', 'Stay through the ball', 'Posture, not arms'] },
  { id: 'getting-jammed', categoryId: 'contact', title: 'I Get Jammed Inside', shortDescription: 'Inside pitches beat you.', relatedSectionKeys: ['barrel-turn', 'timing'], drillNames: ['Inside Tee', 'Steering Wheel Turns', 'Snap Series'], cues: ['Turn the barrel', 'Get to it faster', 'Tight turns'] },
  { id: 'foul-balls', categoryId: 'contact', title: 'I Foul Everything Off', shortDescription: 'Can\'t square it up.', relatedSectionKeys: ['timing', 'extension'], drillNames: ['Command Drill', 'Out Front Tee Drill', 'Finish Through the Middle'], cues: ['Be on time', 'Through the middle', 'Match the pitch'] },
  // ── Posture ──
  { id: 'pulling-off', categoryId: 'posture', title: 'I Pull Off the Ball', shortDescription: 'Front side flies open. Everything pulls.', relatedSectionKeys: ['posture', 'extension'], drillNames: ['Freddie\'s Drill', 'Trout Step Drill', 'Bottom Hand Throws'], cues: ['Step through oppo', 'Hit it mid oppo', 'Stay through it'] },
  { id: 'no-oppo', categoryId: 'posture', title: 'I Can\'t Go Opposite Field', shortDescription: 'Everything pulls. No oppo authority.', relatedSectionKeys: ['posture', 'adjustability'], drillNames: ['Away Tee', 'Opposite Field Only Round', 'Freddie\'s Drill'], cues: ['Deep and through', 'Let it travel', 'Through the gap'] },
  { id: 'losing-posture', categoryId: 'posture', title: 'I Stand Up Through Contact', shortDescription: 'Coming out of the swing.', relatedSectionKeys: ['posture', 'foundations'], drillNames: ['Mo Vaughn Drill', 'Low Away Tee', 'PVC Pipe Swings'], cues: ['Stay in your legs', 'Match the plane', 'Get down with the body'] },
  // ── Adjustability ──
  { id: 'cant-hit-offspeed', categoryId: 'adjustability', title: 'I Can\'t Hit Offspeed', shortDescription: 'Breaking balls and changeups eat you up.', relatedSectionKeys: ['adjustability', 'approach'], drillNames: ['Variable Front Toss', 'Yes/No Drill', 'Delay Load Drill', 'Breaking Ball Round'], cues: ['See it longer', 'Adjust, don\'t guess', 'Let it travel'] },
  { id: 'chasing', categoryId: 'adjustability', title: 'I Chase Too Much', shortDescription: 'Swings at pitches outside the zone.', relatedSectionKeys: ['approach', 'adjustability'], drillNames: ['Yes/No Drill', 'Take Until Strike', 'Zone Hunting Round'], cues: ['Hunt your pitch', 'Earn the right to swing', 'Yes yes yes no'] },
  { id: 'cant-adjust-height', categoryId: 'adjustability', title: 'I Can\'t Adjust to Pitch Height', shortDescription: 'Good on one height, lost on others.', relatedSectionKeys: ['adjustability', 'foundations'], drillNames: ['2-Ball High/Low Tee', 'Random Tee Locations', 'High/Low/In/Out Callout Drill'], cues: ['Same swing, different posture', 'Adjust, don\'t guess', 'Match the plane'] },
  // ── Approach ──
  { id: 'no-plan', categoryId: 'approach', title: 'I Have No Plan at the Plate', shortDescription: 'Walk up and hope. No approach.', relatedSectionKeys: ['approach'], drillNames: ['Zone Hunting Round', 'Count Hitting Round', '3-Pitch At-Bat Simulation'], cues: ['Hunt your pitch', 'Have a plan', 'Win the count'] },
  { id: 'too-passive', categoryId: 'approach', title: 'I\'m Too Passive', shortDescription: 'Watch good pitches go by.', relatedSectionKeys: ['approach', 'competition'], drillNames: ['Damage Round', 'Sit Fastball Round', 'Count Hitting Round'], cues: ['Don\'t miss your pitch', 'Attack when it\'s yours', 'Damage on your pitch'] },
  { id: 'bp-hitter', categoryId: 'approach', title: 'I\'m Good in BP, Bad in Games', shortDescription: 'Great in practice, disappears in games.', relatedSectionKeys: ['competition', 'approach', 'machine-training'], drillNames: ['2-Strike Battle Round', '21 Outs Game', 'Random Pitch Machine'], cues: ['Train the way you compete', 'Compete every swing', 'Pressure is practice'] },
  { id: 'strikeout-prone', categoryId: 'approach', title: 'I Strike Out Too Much', shortDescription: 'Too many Ks.', relatedSectionKeys: ['approach', 'adjustability', 'connection'], drillNames: ['2-Strike Approach Round', 'Yes/No Drill', 'Connection Ball Drill'], cues: ['Compete with 2 strikes', 'Put it in play', 'Battle'] },
  // ── Power ──
  { id: 'weak-contact', categoryId: 'power', title: 'I Hit the Ball Weak', shortDescription: 'Making contact but nothing hard.', relatedSectionKeys: ['foundations', 'extension', 'competition'], drillNames: ['High Tee Normal Swing', 'Damage Round', 'Out Front Tee Drill'], cues: ['Swing with intent', 'Through the ball', 'Let the body do the work'] },
  { id: 'no-bat-speed', categoryId: 'power', title: 'My Bat Speed Is Low', shortDescription: 'Swing feels slow.', relatedSectionKeys: ['barrel-turn', 'connection', 'timing'], drillNames: ['Steering Wheel Turns', 'Snap Series', 'Reverse Grip Drill'], cues: ['Turn the barrel', 'Snap it', 'Short to the ball'] },
  { id: 'disconnected', categoryId: 'power', title: 'My Swing Feels Disconnected', shortDescription: 'All arms. Body and barrel not connected.', relatedSectionKeys: ['connection', 'foundations'], drillNames: ['Connection Ball Drill', 'Bat on Shoulder Drill Series', 'Fence Constraint Drill'], cues: ['Body first', 'Stay tight', 'Tight turns'] },
  { id: 'no-power', categoryId: 'power', title: 'I Don\'t Have Power', shortDescription: 'No extra-base hits.', relatedSectionKeys: ['foundations', 'forward-move', 'extension'], drillNames: ['High Tee Normal Swing', 'Happy Gilmore Drill', 'Out Front Tee Drill'], cues: ['Use the ground', 'Through the ball', 'Swing with intent'] },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getCategoryById(id: string): TroubleshootingCategory | undefined {
  return TROUBLESHOOTING_CATEGORIES.find((c) => c.id === id);
}

export function getTopicById(id: string): TroubleshootingTopic | undefined {
  return TROUBLESHOOTING_TOPICS.find((t) => t.id === id);
}

export function getTopicsByCategory(categoryId: string): TroubleshootingTopic[] {
  return TROUBLESHOOTING_TOPICS.filter((t) => t.categoryId === categoryId);
}

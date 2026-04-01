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
  { id: 'contact', title: 'Contact, Barrel & Power', description: 'Barrel control, contact quality, weak contact, power, bat speed, connection.', icon: 'baseball-outline', color: '#3b82f6', orderIndex: 2 },
  { id: 'posture', title: 'Posture & Direction', description: 'Pulling off, no oppo, losing posture through contact.', icon: 'body-outline', color: '#0891b2', orderIndex: 3 },
  { id: 'adjustability', title: 'Adjustability & Pitch Recognition', description: 'Can\'t adjust to locations, chasing, can\'t hit offspeed.', icon: 'options-outline', color: '#f59e0b', orderIndex: 4 },
  { id: 'approach', title: 'Approach & Game Performance', description: 'No plan, passive, BP hitter, strikeouts.', icon: 'bulb-outline', color: '#a855f7', orderIndex: 5 },
  { id: 'power', title: 'Power & Strength Programs', description: 'Bat speed, rotational power, strength programs. Bridge to Lifting Vault.', icon: 'flash-outline', color: '#22c55e', orderIndex: 6 },
];

export const TROUBLESHOOTING_TOPICS: TroubleshootingTopic[] = [
  // ── Timing (6 topics) ──
  { id: 'always-late', categoryId: 'timing', title: 'I\'m Always Late', shortDescription: 'Can\'t catch up to fastballs. Swing starts too late.', relatedSectionKeys: ['timing', 'foundations'], drillNames: ['Rhythm Rockers', 'Heel Load', 'Belli\'s / Hover', 'Step Back Drill', 'Happy Gilmore', 'Command Drill', 'Rapid Fire Side Flips', 'Go Drill', 'Swing At Release', 'Overhand Timing Focus'], cues: ['Be ready for the best fastball', 'Get to launch early', 'Be fast from launch', 'Start earlier'] },
  { id: 'always-early', categoryId: 'timing', title: 'I\'m Always Early', shortDescription: 'Out in front of everything. Committing before seeing the pitch.', relatedSectionKeys: ['timing', 'adjustability'], drillNames: ['Rapid Fire Side Flips', 'Variable Front Toss', '7 Ball Drill', 'Color Ball Drill'], cues: ['Hold longer', 'See it late', 'Don\'t decide early', 'Be ready for fast, adjust to slow'] },
  { id: 'no-rhythm', categoryId: 'timing', title: 'I Have No Rhythm', shortDescription: 'Stiff, tense, dead legs. No flow into launch.', relatedSectionKeys: ['timing', 'forward-move'], drillNames: ['Rhythm Rockers', 'Heel Load', 'Step Back Drill', 'Happy Gilmore', 'Overhand Timing Focus'], cues: ['Loose hands', 'Flow into launch', 'Start early', 'Move before you swing'] },
  { id: 'feel-rushed', categoryId: 'timing', title: 'I Feel Rushed', shortDescription: 'Everything feels fast. Can\'t slow it down.', relatedSectionKeys: ['timing', 'foundations'], drillNames: ['Rhythm Rockers', 'Heel Load', 'Belli\'s / Hover', 'Happy Gilmore', 'Go Drill', 'Swing At Release', 'Command Drill'], cues: ['Slow early, fast late', 'Get to launch earlier', 'Be fast FROM launch', 'Don\'t rush TO launch'] },
  { id: 'struggle-with-velocity', categoryId: 'timing', title: 'I Struggle With Velocity', shortDescription: 'Can\'t catch up to hard throwers.', relatedSectionKeys: ['timing', 'machine-training'], drillNames: ['Belli\'s / Hover', 'Command Drill', 'Rapid Fire Side Flips', 'Go Drill', 'Swing At Release', 'Overhand Timing Focus', '7 Ball Drill', 'Color Ball Drill', 'Mixed Machine', 'Variable Front Toss'], cues: ['Be ready for the BEST fastball', 'Get to launch before the window closes', 'Smaller move = faster launch', 'Ready early, fire late'] },
  { id: 'commit-too-early', categoryId: 'timing', title: 'I Commit Too Early', shortDescription: 'Body goes before eyes confirm the pitch. Can\'t adjust.', relatedSectionKeys: ['timing', 'adjustability'], drillNames: ['7 Ball Drill', 'Color Ball Drill', 'Mixed Machine', 'Variable Front Toss'], cues: ['Hold and decide', 'Don\'t decide before you see it', 'See the lane', 'Be ready, not committed'] },
  // ── Contact (4 topics) ──
  { id: 'rolling-over', categoryId: 'contact', title: 'I Keep Rolling Over', shortDescription: 'Weak ground balls to the pull side. Barrel works around the ball.', relatedSectionKeys: ['extension', 'connection', 'barrel-turn'], drillNames: ['High Tee — Stop at Contact', 'Deep Tee', 'Out Front Tee', 'Swing Over Tee', 'Split Grip Swings', 'Front Toss — Stop at Contact', 'Side Flips — Different Contact Points', 'Arise Deep Tee Flips'], cues: [] },
  { id: 'popping-up', categoryId: 'contact', title: 'I Pop Everything Up', shortDescription: 'Getting under the ball. Fly balls with no carry. Barrel drops too early.', relatedSectionKeys: ['posture', 'barrel-turn', 'foundations'], drillNames: ['High Tee — No Fly Balls', 'PVC Pipe Tilt & Posture', 'Two Ball / High-Low Tee', 'Barry Bonds Tee Progression', 'Top Hand Swings', 'Bottom Hand Swings', 'Barry Bonds Flips'], cues: [] },
  { id: 'getting-jammed', categoryId: 'contact', title: 'I Get Jammed Inside', shortDescription: 'Inside pitches beat you. Can\'t get the barrel there on time.', relatedSectionKeys: ['barrel-turn', 'timing', 'connection'], drillNames: ['Connection Ball Drill', 'Inside Tee', 'High Tee — Stop at Contact', 'Freddie Freeman Drill', 'Closed Stance Swings', 'Move-Ons / Trout Steps', 'Angled Flips', 'Front Hip Tee', 'Front Hip Flips'], cues: [] },
  { id: 'foul-balls', categoryId: 'contact', title: 'I Foul Everything Off', shortDescription: 'Close to contact but can\'t square it up. Fouls instead of fair balls.', relatedSectionKeys: ['timing', 'extension', 'barrel-turn'], drillNames: ['Out Front Tee', 'Line Drive / Ground Ball Rounds', 'Command Drill', 'Go Drill', 'Pull Side Rounds', 'Machine Timing Rounds'], cues: [] },
  // ── Posture & Direction (1 topic — losing-posture + no-oppo merged into pulling-off) ──
  { id: 'pulling-off', categoryId: 'posture', title: 'Posture & Direction', shortDescription: 'Pulling off, standing up, losing posture, spinning off, can\'t go oppo. Barrel works around the ball instead of through it.', relatedSectionKeys: ['posture', 'extension', 'connection', 'adjustability'], drillNames: ['High Tee — Stop at Contact', 'Deep Tee', 'In-In Tee', 'Away Tee', 'PVC Pipe Swings', 'Split Stance Swings', 'Finish Holds', 'Move & Hold', 'Freddie Freeman Drill', 'In-In Flips', 'Angled Flips', 'Arraez Drill', 'Arraez Flips From Behind', 'Bottom Hand Throws', 'Top Hand Punch', 'Short Bat Work', '3/4 Swings to Middle', '3/4 Swings to Oppo', 'Opposite Field Only Round', 'Angled Machine', 'Oppo Round — Machine', 'Middle Round — Machine', 'Line Drive Round — Machine'], cues: [] },
  // ── Adjustability & Pitch Recognition (3 topics) ──
  { id: 'cant-hit-offspeed', categoryId: 'adjustability', title: 'I Can\'t Hit Offspeed', shortDescription: 'Breaking balls and changeups eat you up. Out in front, swings over spin, caught between speeds.', relatedSectionKeys: ['adjustability', 'timing', 'approach'], drillNames: ['Hover Holds / Bellies', 'Preset Hand Load Swings', 'Go Drill', 'Command Drill', '45s with Hover', 'Deep Tee', 'Random Tee Locations', 'Variable Front Toss', 'Slow Breaking Ball Feeds', 'Weighted Foam Ball Recognition', 'Three Plate Machine Drill', 'FB + Breaking Ball Mix', 'Slow Loopy Curveball Machine'], cues: [] },
  { id: 'chasing', categoryId: 'adjustability', title: 'I Chase Too Much', shortDescription: 'Expands zone, swings at pitcher\'s pitch, can\'t take bad pitches. Often a timing problem disguised as a discipline problem.', relatedSectionKeys: ['adjustability', 'approach', 'timing'], drillNames: ['Zone Hitting Rounds', 'Shrink the Zone Drill', 'Two Strike Approach Rounds', 'Count Approach Rounds', 'Strike / Ball Foam Recognition', 'Mixed BP with Approach', 'Gap to Gap Fastball Rounds', 'Go Drill', 'Command Drill'], cues: [] },
  { id: 'cant-adjust-height', categoryId: 'adjustability', title: 'I Can\'t Adjust to Pitch Height', shortDescription: 'Only hits belt-high. Pops up high, rolls over low. Posture and shoulder plane don\'t adjust.', relatedSectionKeys: ['adjustability', 'posture', 'foundations'], drillNames: ['PVC Pipe Swings', 'High Tee', 'Low Tee', 'High / Low Alternating Tee', 'Command Drill + High / Low', '2-Ball High/Low Tee', 'High Round Only', 'Low Round Only', 'Mixed Height Front Toss', 'High Machine Day', 'Low Machine Day'], cues: [] },
  // ── Approach & Game Performance (4 topics) ──
  { id: 'no-plan', categoryId: 'approach', title: 'I Have No Plan at the Plate', shortDescription: 'Walk up and react. No approach, no count awareness, no pitch hunting. Decisions are random.', relatedSectionKeys: ['approach'], drillNames: ['Zone Hunting Round', 'Count Hitting Round', 'Situation Rounds', '3-Pitch At-Bat Simulation', 'Damage Count Rounds', 'Limited Swings Round', 'Count Battle Game', 'Situational Challenge'], cues: [] },
  { id: 'too-passive', categoryId: 'approach', title: 'I\'m Too Passive', shortDescription: 'Watches good pitches. No damage in hitter\'s counts. Afraid to commit. Passive hitters get themselves out.', relatedSectionKeys: ['approach', 'competition'], drillNames: ['First Pitch Swing Rounds', 'Damage Round', 'Damage Count Rounds', 'Sit Fastball Round', 'Early Count Damage Training', 'Limited Swings Round', '2-Strike Battle Round'], cues: [] },
  { id: 'bp-hitter', categoryId: 'approach', title: 'I\'m Good in BP, Bad in Games', shortDescription: 'Great in cage, disappears in games. Practice is too easy. No pressure, no consequences, no transfer.', relatedSectionKeys: ['competition', 'approach', 'machine-training'], drillNames: ['Short Distance BP', 'High Velocity Machine', 'Mixed Pitch BP', 'Situational BP', 'Pressure Rounds', 'Barrel Game', 'At-Bat Simulation', '21 Outs Game', 'Random Pitch Machine'], cues: [] },
  { id: 'strikeout-prone', categoryId: 'approach', title: 'I Strike Out Too Much', shortDescription: 'Too many Ks. No 2-strike adjustment. Can\'t put ball in play on tough pitches. Doesn\'t battle.', relatedSectionKeys: ['approach', 'adjustability', 'connection'], drillNames: ['Early Count Damage Training', 'Two Strike Approach Rounds', 'Choke Up Rounds', 'Bad Pitch Hitting Rounds', 'Oppo with Two Strikes', 'Foul Ball Rounds', 'Must Put Ball in Play', '2-Strike Battle Round', '2-Strike Machine'], cues: [] },
  // ── Power / Bat Speed / Connection (4 topics — moved to contact category) ──
  { id: 'weak-contact', categoryId: 'contact', title: 'I Hit the Ball Weak', shortDescription: 'Making contact but nothing hard. Low exit velo. Ball dies off the bat. Could be contact point, connection, or strength.', relatedSectionKeys: ['foundations', 'extension', 'connection', 'competition'], drillNames: ['High Tee Normal Swing', 'Out Front Tee', 'Walk-Through Connection', 'Stop at Contact into Bag', 'Damage Round', 'High Intent Flips', 'Max Intent Rounds', 'Overload Swings', 'Consecutive Hard-Hit Challenge'], cues: [] },
  { id: 'no-bat-speed', categoryId: 'contact', title: 'My Bat Speed Is Low', shortDescription: 'Barrel can\'t get there fast enough. Feels slow. Can\'t catch up to velocity. CNS speed + intent problem.', relatedSectionKeys: ['barrel-turn', 'connection', 'timing'], drillNames: ['Steering Wheel Turns', 'Snap Series', 'Reverse Grip Drill', 'Overload Swings', 'Underload Swings', 'Step-Behind Swings', 'Run-Up Swings', 'Max Intent Rounds', 'Command Drill'], cues: [] },
  { id: 'disconnected', categoryId: 'contact', title: 'My Swing Feels Disconnected', shortDescription: 'All arms. Body and barrel not connected. Force doesn\'t chain from ground to barrel. Energy transfer problem.', relatedSectionKeys: ['connection', 'foundations'], drillNames: ['Connection Ball Drill', 'Bat on Shoulder Drill', 'Fence Constraint Drill', 'PVC Connection Turns', 'Walk-Through Connection', 'Stop at Contact into Bag', 'Short Bat Connection', 'Front Toss — Stop at Contact'], cues: [] },
  { id: 'no-power', categoryId: 'contact', title: 'I Don\'t Have Power', shortDescription: 'No extra-base hits. Can\'t drive the ball. Could be connection, bat speed, or physical strength. Multiple causes.', relatedSectionKeys: ['foundations', 'forward-move', 'extension', 'connection'], drillNames: ['Happy Gilmore Drill', 'Walk-Through Connection', 'Overload Swings', 'Step-Behind Swings', 'Run-Up Swings', 'Max Intent Rounds', 'High Intent Flips', 'Damage Round'], cues: [] },
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

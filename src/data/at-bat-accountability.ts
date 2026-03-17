/* ────────────────────────────────────────────────
 * AT-BAT ACCOUNTABILITY
 *
 * Post-game logging and review system.
 * Types, scoring, coaching insights, and storage.
 *
 * Philosophy: "A bad result is not always a bad at-bat."
 * ──────────────────────────────────────────────── */

import AsyncStorage from '@react-native-async-storage/async-storage';

/* ─── Types ──────────────────────────────────────── */

export type AtBatResult =
  | 'single'
  | 'double'
  | 'triple'
  | 'home_run'
  | 'walk'
  | 'hbp'
  | 'strikeout'
  | 'groundout'
  | 'flyout'
  | 'lineout'
  | 'popout'
  | 'reached_on_error'
  | 'fielders_choice'
  | 'sacrifice'
  | 'other_out';

export type TimingValue = 'on_time' | 'early' | 'late';
export type FocusValue = 'locked_in' | 'neutral' | 'frustrated';
export type PitchDecisionValue = 'my_pitch' | 'chase' | 'take_my_pitch';
export type VisionValue = 'yes' | 'no';
export type ApproachValue = 'yes' | 'no';
export type CountLeverageValue = 'advantage' | 'even' | 'disadvantage';
export type ContactQualityValue = 'barreled' | 'solid' | 'weak' | 'no_contact';
export type GameType = 'practice' | 'scrimmage' | 'game';

export type AtBatContextValue =
  | 'standard'
  | 'two_strike_protect'
  | 'productive_ab'
  | 'rbi_execution'
  | 'battle_ab'
  | 'missed_opportunity';

export type TeamOutcomeValue = 'helped_team' | 'neutral' | 'hurt_team';

export type AtBatQualityValue =
  | 'quality_ab'
  | 'productive_ab'
  | 'neutral_ab'
  | 'poor_ab';

export interface AtBatLog {
  id: string;
  gameId: string;
  createdAt: string;
  orderIndex: number;
  result: AtBatResult;
  timing: TimingValue;
  focus: FocusValue;
  pitchDecision: PitchDecisionValue;
  vision: VisionValue;
  approach: ApproachValue;
  countLeverage: CountLeverageValue;
  contactQuality: ContactQualityValue;
  context: AtBatContextValue;
  teamOutcome: TeamOutcomeValue;
  abQuality: AtBatQualityValue;
  note?: string;
}

export interface GameLog {
  id: string;
  createdAt: string;
  date: string;
  opponent?: string;
  gameType?: GameType;
  note?: string;
}

export interface ProcessBreakdown {
  onTime: number;
  early: number;
  late: number;
  lockedIn: number;
  neutral: number;
  frustrated: number;
  myPitch: number;
  chase: number;
  takeMyPitch: number;
  sawBallWellYes: number;
  sawBallWellNo: number;
  stuckToPlanYes: number;
  stuckToPlanNo: number;
  advantage: number;
  even: number;
  disadvantage: number;
  barreled: number;
  solid: number;
  weak: number;
  noContact: number;
}

export interface ContextBreakdown {
  qualityAB: number;
  productiveAB: number;
  neutralAB: number;
  poorAB: number;
  helpedTeam: number;
  neutralTeam: number;
  hurtTeam: number;
  battleAB: number;
  twoStrikeProtect: number;
  rbiExecution: number;
  missedOpportunity: number;
}

export interface CountSummary {
  advantage: number;
  even: number;
  disadvantage: number;
  /** advantage / totalLoggedABs (0–1). Null when no ABs logged. */
  countWinRate: number | null;
  /** disadvantage / totalLoggedABs (0–1). Null when no ABs logged. */
  disadvantageRate: number | null;
}

export interface GameReviewSummary {
  gameId: string;
  totalABs: number;
  hits: number;
  walks: number;
  strikeouts: number;
  battingAverage: number | null;
  outcomeBreakdown: Record<string, number>;
  processBreakdown: ProcessBreakdown;
  contextBreakdown: ContextBreakdown;
  countSummary: CountSummary;
  otcApproachScore: number;
  coachingTakeaway: string;
}

/* ─── Display helpers ────────────────────────────── */

export const RESULT_LABELS: Record<AtBatResult, string> = {
  single: 'Single',
  double: 'Double',
  triple: 'Triple',
  home_run: 'Home Run',
  walk: 'Walk',
  hbp: 'HBP',
  strikeout: 'Strikeout',
  groundout: 'Groundout',
  flyout: 'Flyout',
  lineout: 'Lineout',
  popout: 'Popout',
  reached_on_error: 'Reached on Error',
  fielders_choice: "Fielder's Choice",
  sacrifice: 'Sacrifice',
  other_out: 'Other Out',
};

const HIT_RESULTS: AtBatResult[] = ['single', 'double', 'triple', 'home_run'];
const ON_BASE_RESULTS: AtBatResult[] = [...HIT_RESULTS, 'walk', 'hbp', 'reached_on_error'];

export function isHit(result: AtBatResult): boolean {
  return HIT_RESULTS.includes(result);
}

export function isOnBase(result: AtBatResult): boolean {
  return ON_BASE_RESULTS.includes(result);
}

/* ─── Scoring ────────────────────────────────────── */

/** Per-AB process scoring weights. */
const PROCESS_SCORES: Record<string, number> = {
  // Timing
  on_time: 2,
  early: -1,
  late: -1,
  // Focus
  locked_in: 2,
  neutral: 0,
  frustrated: -2,
  // Pitch decision
  my_pitch: 2,
  chase: -3,
  take_my_pitch: 0,
  // Vision
  vision_yes: 2,
  vision_no: -2,
  // Approach
  approach_yes: 3,
  approach_no: -3,
  // Count leverage
  advantage: 1,
  even: 0,
  disadvantage: -1,
  // Contact quality
  barreled: 2,
  solid: 1,
  weak: -1,
  no_contact: -1,
};

/** Outcome modifiers — intentionally smaller than process. */
const OUTCOME_SCORES: Record<AtBatResult, number> = {
  single: 1,
  double: 2,
  triple: 3,
  home_run: 4,
  walk: 1,
  hbp: 1,
  reached_on_error: 0,
  strikeout: -1,
  groundout: 0,
  flyout: 0,
  lineout: 0,
  popout: 0,
  fielders_choice: 0,
  sacrifice: 0,
  other_out: 0,
};

/** Context modifiers — adjusts interpretation without overpowering process. */
const CONTEXT_SCORES: Record<AtBatContextValue, number> = {
  standard: 0,
  two_strike_protect: 1,
  productive_ab: 2,
  rbi_execution: 2,
  battle_ab: 1,
  missed_opportunity: -2,
};

const TEAM_OUTCOME_SCORES: Record<TeamOutcomeValue, number> = {
  helped_team: 2,
  neutral: 0,
  hurt_team: -2,
};

const AB_QUALITY_SCORES: Record<AtBatQualityValue, number> = {
  quality_ab: 2,
  productive_ab: 2,
  neutral_ab: 0,
  poor_ab: -2,
};

/**
 * Max theoretical positive per AB:
 * Process: on_time(2) + locked_in(2) + my_pitch(2) + vision_yes(2) +
 *   approach_yes(3) + advantage(1) + barreled(2) = 14
 * Outcome: home_run(4)
 * Context: rbi_execution(2) + helped_team(2) + quality_ab(2) = 6
 * Total max = 24
 *
 * Min theoretical:
 * Process: early(-1) + frustrated(-2) + chase(-3) + vision_no(-2) +
 *   approach_no(-3) + disadvantage(-1) + no_contact(-1) = -13
 * Outcome: strikeout(-1)
 * Context: missed_opportunity(-2) + hurt_team(-2) + poor_ab(-2) = -6
 * Total min = -20
 */
const MAX_RAW_PER_AB = 24;
const MIN_RAW_PER_AB = -20;

/** Score a single at-bat. Returns raw score. */
export function scoreAtBat(ab: AtBatLog): number {
  let raw = 0;

  // Process (primary driver)
  raw += PROCESS_SCORES[ab.timing] ?? 0;
  raw += PROCESS_SCORES[ab.focus] ?? 0;
  raw += PROCESS_SCORES[ab.pitchDecision] ?? 0;
  raw += PROCESS_SCORES[ab.vision === 'yes' ? 'vision_yes' : 'vision_no'] ?? 0;
  raw += PROCESS_SCORES[ab.approach === 'yes' ? 'approach_yes' : 'approach_no'] ?? 0;
  raw += PROCESS_SCORES[ab.countLeverage] ?? 0;
  raw += PROCESS_SCORES[ab.contactQuality] ?? 0;

  // Outcome (smaller weight)
  raw += OUTCOME_SCORES[ab.result] ?? 0;

  // Context modifiers (adjusts interpretation)
  raw += CONTEXT_SCORES[ab.context] ?? 0;
  raw += TEAM_OUTCOME_SCORES[ab.teamOutcome] ?? 0;
  raw += AB_QUALITY_SCORES[ab.abQuality] ?? 0;

  return raw;
}

/**
 * Normalize raw AB scores to a 0–100 game score.
 * Uses linear mapping from [MIN, MAX] → [0, 100] then clamps.
 */
export function computeOTCApproachScore(atBats: AtBatLog[]): number {
  if (atBats.length === 0) return 0;

  const totalRaw = atBats.reduce((sum, ab) => sum + scoreAtBat(ab), 0);
  const avgRaw = totalRaw / atBats.length;

  // Map avg raw score to 0-100
  const normalized = ((avgRaw - MIN_RAW_PER_AB) / (MAX_RAW_PER_AB - MIN_RAW_PER_AB)) * 100;

  return Math.round(Math.max(0, Math.min(100, normalized)));
}

/* ─── Summary Builder ────────────────────────────── */

export function buildGameSummary(game: GameLog, atBats: AtBatLog[]): GameReviewSummary {
  const hits = atBats.filter((ab) => isHit(ab.result)).length;
  const walks = atBats.filter((ab) => ab.result === 'walk' || ab.result === 'hbp').length;
  const strikeouts = atBats.filter((ab) => ab.result === 'strikeout').length;

  // Official ABs exclude walks, HBP, sacrifice
  const officialABs = atBats.filter(
    (ab) => !['walk', 'hbp', 'sacrifice'].includes(ab.result),
  ).length;
  const battingAverage = officialABs > 0 ? hits / officialABs : null;

  // Outcome breakdown
  const outcomeBreakdown: Record<string, number> = {};
  for (const ab of atBats) {
    outcomeBreakdown[ab.result] = (outcomeBreakdown[ab.result] ?? 0) + 1;
  }

  // Process breakdown
  const processBreakdown: ProcessBreakdown = {
    onTime: atBats.filter((ab) => ab.timing === 'on_time').length,
    early: atBats.filter((ab) => ab.timing === 'early').length,
    late: atBats.filter((ab) => ab.timing === 'late').length,
    lockedIn: atBats.filter((ab) => ab.focus === 'locked_in').length,
    neutral: atBats.filter((ab) => ab.focus === 'neutral').length,
    frustrated: atBats.filter((ab) => ab.focus === 'frustrated').length,
    myPitch: atBats.filter((ab) => ab.pitchDecision === 'my_pitch').length,
    chase: atBats.filter((ab) => ab.pitchDecision === 'chase').length,
    takeMyPitch: atBats.filter((ab) => ab.pitchDecision === 'take_my_pitch').length,
    sawBallWellYes: atBats.filter((ab) => ab.vision === 'yes').length,
    sawBallWellNo: atBats.filter((ab) => ab.vision === 'no').length,
    stuckToPlanYes: atBats.filter((ab) => ab.approach === 'yes').length,
    stuckToPlanNo: atBats.filter((ab) => ab.approach === 'no').length,
    advantage: atBats.filter((ab) => ab.countLeverage === 'advantage').length,
    even: atBats.filter((ab) => ab.countLeverage === 'even').length,
    disadvantage: atBats.filter((ab) => ab.countLeverage === 'disadvantage').length,
    barreled: atBats.filter((ab) => ab.contactQuality === 'barreled').length,
    solid: atBats.filter((ab) => ab.contactQuality === 'solid').length,
    weak: atBats.filter((ab) => ab.contactQuality === 'weak').length,
    noContact: atBats.filter((ab) => ab.contactQuality === 'no_contact').length,
  };

  // Context breakdown
  const contextBreakdown: ContextBreakdown = {
    qualityAB: atBats.filter((ab) => ab.abQuality === 'quality_ab').length,
    productiveAB: atBats.filter((ab) => ab.abQuality === 'productive_ab').length,
    neutralAB: atBats.filter((ab) => ab.abQuality === 'neutral_ab').length,
    poorAB: atBats.filter((ab) => ab.abQuality === 'poor_ab').length,
    helpedTeam: atBats.filter((ab) => ab.teamOutcome === 'helped_team').length,
    neutralTeam: atBats.filter((ab) => ab.teamOutcome === 'neutral').length,
    hurtTeam: atBats.filter((ab) => ab.teamOutcome === 'hurt_team').length,
    battleAB: atBats.filter((ab) => ab.context === 'battle_ab').length,
    twoStrikeProtect: atBats.filter((ab) => ab.context === 'two_strike_protect').length,
    rbiExecution: atBats.filter((ab) => ab.context === 'rbi_execution').length,
    missedOpportunity: atBats.filter((ab) => ab.context === 'missed_opportunity').length,
  };

  // Count summary (derived from process breakdown)
  const countSummary: CountSummary = {
    advantage: processBreakdown.advantage,
    even: processBreakdown.even,
    disadvantage: processBreakdown.disadvantage,
    countWinRate: atBats.length > 0 ? processBreakdown.advantage / atBats.length : null,
    disadvantageRate: atBats.length > 0 ? processBreakdown.disadvantage / atBats.length : null,
  };

  const otcApproachScore = computeOTCApproachScore(atBats);
  const coachingTakeaway = generateCoachingTakeaway(atBats, processBreakdown, contextBreakdown, countSummary, hits, otcApproachScore);

  return {
    gameId: game.id,
    totalABs: atBats.length,
    hits,
    walks,
    strikeouts,
    battingAverage,
    outcomeBreakdown,
    processBreakdown,
    contextBreakdown,
    countSummary,
    otcApproachScore,
    coachingTakeaway,
  };
}

/* ─── Coaching Takeaway Generator ────────────────── */

function generateCoachingTakeaway(
  atBats: AtBatLog[],
  pb: ProcessBreakdown,
  cb: ContextBreakdown,
  cs: CountSummary,
  hits: number,
  score: number,
): string {
  const n = atBats.length;
  if (n === 0) return 'Log at-bats to see your coaching takeaway.';

  const chaseRate = pb.chase / n;
  const frustrationRate = pb.frustrated / n;
  const lateRate = pb.late / n;
  const stuckRate = pb.stuckToPlanYes / n;
  const onTimeRate = pb.onTime / n;
  const hitRate = hits / n;
  const countWinRate = cs.countWinRate ?? 0;

  // ── Context-aware rules (checked first for situational relevance) ──

  // Situational execution stood out
  if ((cb.rbiExecution + cb.productiveAB) >= n * 0.4 && n >= 2) {
    return 'You executed situational baseball well today.';
  }

  // Battle ABs stood out
  if (cb.battleAB >= n * 0.4 && n >= 2) {
    return 'You competed well in long at-bats. Keep forcing pitchers to work.';
  }

  // Missed opportunity present
  if (cb.missedOpportunity >= 1 && score < 60) {
    return 'You had a chance to do damage in a key moment. Stay calm and trust your approach next time.';
  }

  // Poor results but high quality self-assessment
  if (hitRate <= 0.15 && cb.qualityAB >= n * 0.5 && n >= 2) {
    return 'Your process was stronger than the stat line. Stay with the same approach.';
  }

  // ── Core process rules ──

  // 1. High chase rate (biggest leak)
  if (chaseRate >= 0.4) {
    return 'Your biggest leak today was chasing. Tighten your zone and trust your plan.';
  }

  // 2. High frustration
  if (frustrationRate >= 0.4) {
    return 'Emotion leaked into too many at-bats today. Reset faster and compete pitch to pitch.';
  }

  // 3. Timing issue
  if (lateRate >= 0.5) {
    return 'You were late too often today. Your next step is winning timing earlier.';
  }

  // 4. Poor outcome but strong process
  if (hitRate <= 0.15 && score >= 65) {
    return "Your process was stronger than the result line. Stay with the same approach.";
  }

  // 5. Poor outcome, decent process
  if (hitRate <= 0.15 && score >= 50) {
    return "You're closer than the box score says. Keep hunting the right pitches.";
  }

  // 6. Strong process, strong result
  if (score >= 75 && hitRate >= 0.3) {
    return 'Strong day. You stayed with your plan and the results followed.';
  }

  // 7. Strong process overall
  if (score >= 75) {
    return 'Your approach was locked in. Trust the process — results will come.';
  }

  // 8. Decent process with plan adherence
  if (stuckRate >= 0.7 && onTimeRate >= 0.5) {
    return 'You were mostly on time and locked in. The next step is winning more advantage counts.';
  }

  // 9. Low plan adherence
  if (stuckRate < 0.5) {
    return 'Your plan broke down too often. Go in with a clearer plan and commit to it.';
  }

  // 10. Rough result, some leaks
  if (hitRate <= 0.2 && score < 50) {
    return "The result line was rough, but identify the specific leak and attack it tomorrow.";
  }

  // ── Count leverage rules (supporting signal, checked after core leaks) ──

  // 11. Strong count control
  if (countWinRate >= 0.6) {
    return 'You consistently worked into hitter\'s counts today. Keep hunting from advantage.';
  }

  // 12. Mixed count control
  if (countWinRate >= 0.4 && countWinRate < 0.6 && n >= 3) {
    return 'You created some hitter\'s counts, but there is room to control the count earlier.';
  }

  // 13. Weak count control
  if (countWinRate < 0.4 && n >= 3) {
    return 'Too many swings came from disadvantage counts today. Work to win the count earlier.';
  }

  // 14. Default
  return 'Solid effort. Review the process numbers and find one area to sharpen next game.';
}

/* ─── ID Generation ──────────────────────────────── */

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ─── Storage ────────────────────────────────────── */

const GAMES_KEY = 'otc:ab-accountability:games';
const AT_BATS_KEY = 'otc:ab-accountability:at-bats';

export async function loadGames(): Promise<GameLog[]> {
  try {
    const raw = await AsyncStorage.getItem(GAMES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveGames(games: GameLog[]): Promise<void> {
  await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

export async function loadAtBats(): Promise<AtBatLog[]> {
  try {
    const raw = await AsyncStorage.getItem(AT_BATS_KEY);
    if (!raw) return [];
    const parsed: AtBatLog[] = JSON.parse(raw);
    // Migrate legacy ABs missing new fields
    return parsed.map(migrateAtBat);
  } catch {
    return [];
  }
}

/** Apply safe defaults to legacy at-bat records missing v2 fields. */
function migrateAtBat(ab: AtBatLog): AtBatLog {
  return {
    ...ab,
    context: ab.context ?? 'standard',
    teamOutcome: ab.teamOutcome ?? 'neutral',
    abQuality: ab.abQuality ?? 'neutral_ab',
  };
}

export async function saveAtBats(atBats: AtBatLog[]): Promise<void> {
  await AsyncStorage.setItem(AT_BATS_KEY, JSON.stringify(atBats));
}

/** Load at-bats for a specific game. */
export async function loadGameAtBats(gameId: string): Promise<AtBatLog[]> {
  const all = await loadAtBats();
  return all
    .filter((ab) => ab.gameId === gameId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/** Save a single game (upsert). */
export async function saveGame(game: GameLog): Promise<void> {
  const games = await loadGames();
  const idx = games.findIndex((g) => g.id === game.id);
  if (idx >= 0) {
    games[idx] = game;
  } else {
    games.unshift(game);
  }
  await saveGames(games);
}

/** Save a single at-bat (upsert). */
export async function saveAtBat(atBat: AtBatLog): Promise<void> {
  const atBats = await loadAtBats();
  const idx = atBats.findIndex((ab) => ab.id === atBat.id);
  if (idx >= 0) {
    atBats[idx] = atBat;
  } else {
    atBats.push(atBat);
  }
  await saveAtBats(atBats);
}

/** Delete a single at-bat. */
export async function deleteAtBat(atBatId: string): Promise<void> {
  const atBats = await loadAtBats();
  await saveAtBats(atBats.filter((ab) => ab.id !== atBatId));
}

/** Delete a game and all its at-bats. */
export async function deleteGame(gameId: string): Promise<void> {
  const [games, atBats] = await Promise.all([loadGames(), loadAtBats()]);
  await Promise.all([
    saveGames(games.filter((g) => g.id !== gameId)),
    saveAtBats(atBats.filter((ab) => ab.gameId !== gameId)),
  ]);
}

/** Compute aggregate stats across recent games. */
export async function getRecentStats(limit = 10): Promise<{
  gamesLogged: number;
  avgApproachScore: number | null;
  chaseRate: number | null;
  onTimeRate: number | null;
  countWinRate: number | null;
}> {
  const games = await loadGames();
  const allABs = await loadAtBats();

  const gamesLogged = games.length;
  if (gamesLogged === 0 || allABs.length === 0) {
    return { gamesLogged, avgApproachScore: null, chaseRate: null, onTimeRate: null, countWinRate: null };
  }

  // Take latest N games
  const recentGameIds = new Set(games.slice(0, limit).map((g) => g.id));
  const recentABs = allABs.filter((ab) => recentGameIds.has(ab.gameId));

  if (recentABs.length === 0) {
    return { gamesLogged, avgApproachScore: null, chaseRate: null, onTimeRate: null, countWinRate: null };
  }

  // Compute average OTC Approach Score per game
  const gameScores: number[] = [];
  for (const gameId of recentGameIds) {
    const gameABs = recentABs.filter((ab) => ab.gameId === gameId);
    if (gameABs.length > 0) {
      gameScores.push(computeOTCApproachScore(gameABs));
    }
  }
  const avgApproachScore = gameScores.length > 0
    ? Math.round(gameScores.reduce((a, b) => a + b, 0) / gameScores.length)
    : null;

  const chaseRate = Math.round(
    (recentABs.filter((ab) => ab.pitchDecision === 'chase').length / recentABs.length) * 100,
  );

  const onTimeRate = Math.round(
    (recentABs.filter((ab) => ab.timing === 'on_time').length / recentABs.length) * 100,
  );

  const advantageABs = recentABs.filter((ab) => ab.countLeverage === 'advantage').length;
  const countWinRate = Math.round((advantageABs / recentABs.length) * 100);

  return { gamesLogged, avgApproachScore, chaseRate, onTimeRate, countWinRate };
}

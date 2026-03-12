// Mental Vault Entry — Diagnostic questions and archetype metadata

import type { MentalDiagnosticKey } from '@/lib/gating/vaultConfig';

/**
 * Re-export from canonical source. All mental diagnostic keys derive from
 * DiagnosticKey in vaultConfig.ts — no parallel definition.
 */
export type DiagnosticType = MentalDiagnosticKey;

export type ArchetypeKey =
  | 'reactor'
  | 'overthinker'
  | 'avoider'
  | 'performer'
  | 'doubter'
  | 'driver';

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
}

// ── Archetype Diagnostic (20 questions) ──────────────────────────────────────
// Q1–3:  Reactor       Q4–6:  Overthinker  Q7–9:  Avoider
// Q10–12: Performer    Q13–15: Doubter     Q16–18: Driver
// Q19: tie-breaker (Doubter ×2, Performer ×1)
// Q20: tie-breaker (Driver ×2, Reactor ×1)

export const ARCHETYPE_QUESTIONS: DiagnosticQuestion[] = [
  { id: 'arch_01', prompt: 'After making an error, my emotions take over before I can process what happened.' },
  { id: 'arch_02', prompt: 'My body language changes noticeably after a tough play — teammates can read how I feel.' },
  { id: 'arch_03', prompt: 'During competition, I can go from calm to heated in a matter of seconds.' },
  { id: 'arch_04', prompt: 'Before games, I replay different scenarios of what could go wrong.' },
  { id: 'arch_05', prompt: 'During at-bats, my mind fills with technique cues or mechanical adjustments.' },
  { id: 'arch_06', prompt: 'Between innings or at-bats, I struggle to turn off the mental chatter.' },
  { id: 'arch_07', prompt: 'When I sense failure coming, I instinctively pull back my effort.' },
  { id: 'arch_08', prompt: 'I play it safe in high-pressure moments rather than attacking the challenge.' },
  { id: 'arch_09', prompt: 'There are situations in games where I hold back so I do not fail publicly.' },
  { id: 'arch_10', prompt: 'I care deeply about what coaches, scouts, and teammates think of my performance.' },
  { id: 'arch_11', prompt: 'When important people are watching, I play differently — better or worse.' },
  { id: 'arch_12', prompt: 'I am more focused on looking good than competing freely.' },
  { id: 'arch_13', prompt: 'In key moments, doubt about my ability creeps in before I have even started.' },
  { id: 'arch_14', prompt: 'A stretch of bad results makes me question whether I belong at this level.' },
  { id: 'arch_15', prompt: 'I rely on external feedback — coaches\' approval or stats — to feel confident.' },
  { id: 'arch_16', prompt: 'I push through fatigue, discomfort, or pain to squeeze in more training.' },
  { id: 'arch_17', prompt: 'When I take a rest day, I feel guilty or like I am falling behind.' },
  { id: 'arch_18', prompt: 'My self-worth is tightly connected to how hard I work and how I perform.' },
  { id: 'arch_19', prompt: 'When I fall short of my own standards, I question not just my skill but my character.' },
  { id: 'arch_20', prompt: 'I feel most alive when I am grinding hard — training, competing, pushing my limits.' },
];

// ── Identity Diagnostic (20 questions) ───────────────────────────────────────
// Q1–5:  Core identity (forward for ISS)
// Q6–10: Outcome attachment (reversed for ISS, raw for OA subscore)
// Q11–14: Approval load (reversed for ISS — NOT included in ISS; raw for AL subscore)
// Q15–20: Self-concept (forward for ISS)
// ISS = mean(Q1–5 raw + Q6–10 reversed + Q15–20 raw)
// OA  = mean(Q6–10 raw)
// AL  = mean(Q11–14 raw)

export const IDENTITY_QUESTIONS: DiagnosticQuestion[] = [
  { id: 'ident_01', prompt: 'I know who I am as a competitor, regardless of my recent results.' },
  { id: 'ident_02', prompt: 'My confidence comes from my preparation and process, not my last performance.' },
  { id: 'ident_03', prompt: 'After a bad game, I can separate the outcome from my sense of self-worth.' },
  { id: 'ident_04', prompt: 'I feel settled in who I am as a baseball player, even when things get hard.' },
  { id: 'ident_05', prompt: 'I can compete with full effort and commitment even when I am in a slump.' },
  { id: 'ident_06', prompt: 'A good result makes me feel better about myself as a person.' },
  { id: 'ident_07', prompt: 'When I am struggling at the plate, I feel less valuable to my team.' },
  { id: 'ident_08', prompt: 'My self-image is closely tied to my stats and on-field performance.' },
  { id: 'ident_09', prompt: 'My mood in the days following a game is heavily influenced by how I played.' },
  { id: 'ident_10', prompt: 'A big hit or strong game makes me feel like a better person overall.' },
  { id: 'ident_11', prompt: 'I worry about what coaches think of me after a tough at-bat.' },
  { id: 'ident_12', prompt: 'I adjust how I approach situations based on what I think others want to see.' },
  { id: 'ident_13', prompt: 'I need praise or acknowledgment from coaches to feel like my effort was worth it.' },
  { id: 'ident_14', prompt: 'Knowing that others respect my work ethic is important to my motivation.' },
  { id: 'ident_15', prompt: 'I compete for my own development and love of the game, not to impress others.' },
  { id: 'ident_16', prompt: 'I can receive critical feedback without it shaking my confidence or identity.' },
  { id: 'ident_17', prompt: 'My sense of who I am as a player stays stable even through tough stretches.' },
  { id: 'ident_18', prompt: 'I focus on what I can control rather than outcomes I cannot change.' },
  { id: 'ident_19', prompt: 'I have a clear picture of the player I am becoming and what I am working toward.' },
  { id: 'ident_20', prompt: 'I play my best when I trust my preparation and let go of attachment to results.' },
];

// ── Habits Diagnostic (20 questions) ─────────────────────────────────────────
// Q1–5:  Daily foundation    Q6–9:   Pre-game
// Q10–14: In-game reset      Q15–18: Post-game    Q19–20: Consistency

export const HABITS_QUESTIONS: DiagnosticQuestion[] = [
  { id: 'hab_01', prompt: 'I follow a consistent daily routine that covers training, recovery, and mental prep.' },
  { id: 'hab_02', prompt: 'I prioritize 7–9 hours of sleep before games and demanding training days.' },
  { id: 'hab_03', prompt: 'I eat intentionally around practices, workouts, and games to fuel my performance.' },
  { id: 'hab_04', prompt: 'I spend dedicated time on mental preparation or film review each day.' },
  { id: 'hab_05', prompt: 'I maintain the same intensity and focus in practice that I bring to games.' },
  { id: 'hab_06', prompt: 'I have a consistent pregame warm-up routine I complete before every game.' },
  { id: 'hab_07', prompt: 'I arrive to the field early enough to complete my full physical and mental preparation.' },
  { id: 'hab_08', prompt: 'I use specific cues, routines, or rituals to get mentally dialed in before games.' },
  { id: 'hab_09', prompt: 'I track my mental state before games and adjust my approach based on how I feel.' },
  { id: 'hab_10', prompt: 'Between innings, I use a consistent routine to reset and refocus.' },
  { id: 'hab_11', prompt: 'After an error or strikeout, I have a specific process to reset before the next moment.' },
  { id: 'hab_12', prompt: 'I use a breathing or grounding technique during high-pressure in-game moments.' },
  { id: 'hab_13', prompt: 'I can let go of a bad at-bat or play before the next opportunity comes.' },
  { id: 'hab_14', prompt: 'My body language and self-talk remain consistent when I am struggling in a game.' },
  { id: 'hab_15', prompt: 'After games, I review what went well and what I want to build on going forward.' },
  { id: 'hab_16', prompt: 'I can separate my emotional reaction from my post-game learning process.' },
  { id: 'hab_17', prompt: 'I actively recover after demanding games — sleep, nutrition, and light movement.' },
  { id: 'hab_18', prompt: 'I journal or reflect after games to track patterns in my mental performance.' },
  { id: 'hab_19', prompt: 'I stick to my training and mental prep routine even during slumps or tough stretches.' },
  { id: 'hab_20', prompt: 'My habits and routines stay consistent throughout the entire season — not just when things are going well.' },
];

export const QUESTIONS_BY_TYPE: Record<DiagnosticType, DiagnosticQuestion[]> = {
  archetype: ARCHETYPE_QUESTIONS,
  identity:  IDENTITY_QUESTIONS,
  habits:    HABITS_QUESTIONS,
};

// ── Diagnostic metadata ───────────────────────────────────────────────────────

export const DIAGNOSTIC_META: Record<
  DiagnosticType,
  { label: string; description: string; icon: string; order: number }
> = {
  archetype: {
    label: 'Archetype Diagnostic',
    description: 'Identify your mental pattern under pressure. Find your archetype.',
    icon: 'finger-print-outline',
    order: 1,
  },
  identity: {
    label: 'Identity Diagnostic',
    description: 'Discover how you define yourself as a competitor and where your confidence lives.',
    icon: 'person-circle-outline',
    order: 2,
  },
  habits: {
    label: 'Habits Diagnostic',
    description: 'Map your mental routine system from daily prep to postgame recovery.',
    icon: 'repeat-outline',
    order: 3,
  },
};

export const DIAGNOSTIC_ORDER: DiagnosticType[] = ['archetype', 'identity', 'habits'];

// ── Archetype info ────────────────────────────────────────────────────────────

export const ARCHETYPE_INFO: Record<
  ArchetypeKey,
  { name: string; tagline: string; summary: string; strength: string; challenge: string }
> = {
  reactor: {
    name: 'The Reactor',
    tagline: 'Fast, intense, and driven by the moment.',
    summary:
      'Your responses are immediate and fueled by emotion. Your competitive fire is real and contagious — but it can spike in the wrong direction when things go sideways.',
    strength: 'High intensity, competitive urgency, and natural fire.',
    challenge: 'Managing emotional spikes after errors or bad breaks.',
  },
  overthinker: {
    name: 'The Overthinker',
    tagline: 'Analytical. Prepared. Sometimes too much of both.',
    summary:
      'You analyze everything — before, during, and after competition. Your attention to detail is a weapon, but the mental chatter can crowd out your natural game when it counts most.',
    strength: 'High preparation quality and mechanical awareness.',
    challenge: 'Mental interference and analysis paralysis during competition.',
  },
  avoider: {
    name: 'The Avoider',
    tagline: 'Safe by default. Capable of more.',
    summary:
      'You pull back when failure feels close. You are wired for self-protection, which prevents embarrassing moments — but also limits your ceiling and keeps you playing small.',
    strength: 'Composure in low-stakes situations.',
    challenge: 'Full commitment and going after the challenge in high-risk moments.',
  },
  performer: {
    name: 'The Performer',
    tagline: 'Always aware of the audience.',
    summary:
      'You are highly attuned to who is watching. You can rise to the moment in front of a crowd — or shrink from it — depending on the approval signals around you.',
    strength: 'Rises to high-visibility moments when approval cues are positive.',
    challenge: 'Playing for approval instead of competing freely on every pitch.',
  },
  doubter: {
    name: 'The Doubter',
    tagline: 'Driven, aware, and fighting your own mind.',
    summary:
      'You question your readiness in key moments. It is not a lack of work ethic — it is an identity gap between who you are and what you believe you can handle under real pressure.',
    strength: 'High self-awareness and relentless drive to improve.',
    challenge: 'Negative self-talk and confidence collapse in critical moments.',
  },
  driver: {
    name: 'The Driver',
    tagline: 'Relentless. Disciplined. At risk of burnout.',
    summary:
      'You grind, push, and outwork everyone in the room. Your discipline is elite — but without recovery boundaries, it becomes your ceiling instead of your foundation.',
    strength: 'Unmatched work ethic, consistency, and discipline.',
    challenge: 'Rest guilt, overtraining, and tying self-worth to effort level.',
  },
};

export const LIKERT_LABELS: Record<number, string> = {
  1: 'Never',
  2: 'Rarely',
  3: 'Sometimes',
  4: 'Often',
  5: 'Always',
};

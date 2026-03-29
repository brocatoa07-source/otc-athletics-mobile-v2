/**
 * Hitting Practice Templates — Reusable session structures.
 *
 * Help athletes train with purpose when they don't know what to do.
 */

import type { ProgressionStage } from './hitting-vault-sections';

export interface TemplateDrill {
  name: string;
  sectionKey: string;
  sets?: string;
  reps?: string;
  notes?: string;
  progression: ProgressionStage;
}

export interface PracticeTemplate {
  key: string;
  label: string;
  duration: string;
  goal: string;
  description: string;
  bestFor: string;
  drills: TemplateDrill[];
}

export const HITTING_PRACTICE_TEMPLATES: PracticeTemplate[] = [
  {
    key: 'quick-20',
    label: '20-Minute Quick Session',
    duration: '20 min',
    goal: 'Feel and fundamentals',
    description: 'Short focused session. High tee work, foundation checks, and one skill focus.',
    bestFor: 'Before games, off days, or when short on time.',
    drills: [
      { name: 'Slow Motion Swing', sectionKey: 'foundations', sets: '1', reps: '5', progression: 'tee' },
      { name: 'High Tee Normal Swing', sectionKey: 'foundations', sets: '3', reps: '5', notes: 'Low line drives through the middle', progression: 'tee' },
      { name: 'Inside Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Away Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Hold Finish', sectionKey: 'foundations', sets: '1', reps: '5', notes: 'Check every position', progression: 'tee' },
    ],
  },
  {
    key: 'standard-30',
    label: '30-Minute Standard Session',
    duration: '30 min',
    goal: 'Mechanics + contact quality',
    description: 'Tee progression into front toss. Build positions, then test them against a moving ball.',
    bestFor: 'Regular training days.',
    drills: [
      { name: 'High Tee Normal Swing', sectionKey: 'foundations', sets: '3', reps: '5', progression: 'tee' },
      { name: 'High Tee — Stop at Contact', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Inside Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Away Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Deep Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Normal Front Toss', sectionKey: 'foundations', sets: '3', reps: '8', notes: 'Carry the tee feel', progression: 'flips' },
      { name: 'No Roll Overs', sectionKey: 'extension', sets: '2', reps: '5', progression: 'tee' },
    ],
  },
  {
    key: 'full-45',
    label: '45-Minute Full Session',
    duration: '45 min',
    goal: 'Complete tee-to-flips development',
    description: 'Full progression: high tee foundation → location work → adjustability → front toss → competition.',
    bestFor: 'Primary training days.',
    drills: [
      { name: 'Slow Motion Swing', sectionKey: 'foundations', sets: '1', reps: '5', progression: 'tee' },
      { name: 'High Tee Normal Swing', sectionKey: 'foundations', sets: '3', reps: '5', progression: 'tee' },
      { name: 'Middle Tee — Preset Posture', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Inside Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Away Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: '2-Ball High/Low Tee', sectionKey: 'adjustability', sets: '2', reps: '8', progression: 'tee' },
      { name: 'Normal Front Toss', sectionKey: 'foundations', sets: '3', reps: '8', progression: 'flips' },
      { name: 'Random Front Toss', sectionKey: 'foundations', sets: '2', reps: '8', progression: 'flips' },
      { name: 'Line Drive Challenge', sectionKey: 'competition', sets: '1', reps: 'until 5', notes: 'End on competition', progression: 'competition' },
    ],
  },
  {
    key: 'tee-only',
    label: 'Tee-Only Practice',
    duration: '25 min',
    goal: 'Positions and barrel control',
    description: 'No moving ball. Pure tee work. Build positions, check positions, feel positions.',
    bestFor: 'When you need to slow down and fix something specific.',
    drills: [
      { name: 'Slow Motion Swing', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'High Tee Normal Swing', sectionKey: 'foundations', sets: '3', reps: '5', progression: 'tee' },
      { name: 'High Tee — Bat on Shoulder, No Stride', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'High Tee — Stop at Contact', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Inside Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Away Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Deep Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Out Front Tee', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
    ],
  },
  {
    key: 'machine-day',
    label: 'Machine Day Practice',
    duration: '35 min',
    goal: 'Transfer tee positions to live velocity',
    description: 'Short tee warm-up → machine transfer. Carry your positions into real velocity.',
    bestFor: 'Machine access days. 2x/week max.',
    drills: [
      { name: 'High Tee Normal Swing', sectionKey: 'foundations', sets: '2', reps: '5', notes: 'Warm up your positions', progression: 'tee' },
      { name: 'Inside Tee', sectionKey: 'foundations', sets: '1', reps: '5', progression: 'tee' },
      { name: 'Away Tee', sectionKey: 'foundations', sets: '1', reps: '5', progression: 'tee' },
      { name: 'Fastball Only Machine', sectionKey: 'machine-training', sets: '3', reps: '8', notes: 'Be on time. Same swing.', progression: 'machine' },
      { name: 'Fastball In — Machine', sectionKey: 'machine-training', sets: '2', reps: '5', progression: 'machine' },
      { name: 'Fastball Away — Machine', sectionKey: 'machine-training', sets: '2', reps: '5', progression: 'machine' },
      { name: 'Random Pitch Machine', sectionKey: 'machine-training', sets: '2', reps: '8', notes: 'Compete. React. Adjust.', progression: 'machine' },
    ],
  },
  {
    key: 'pre-game',
    label: 'Pre-Game Short Session',
    duration: '10 min',
    goal: 'Feel and confidence',
    description: 'Quick feel session before the game. Find your swing. Don\'t overwork.',
    bestFor: 'Game days. 30-60 minutes before first pitch.',
    drills: [
      { name: 'Slow Motion Swing', sectionKey: 'foundations', sets: '1', reps: '3', notes: 'Feel every position', progression: 'tee' },
      { name: 'High Tee Normal Swing', sectionKey: 'foundations', sets: '2', reps: '5', notes: 'Low line drives. Find the barrel.', progression: 'tee' },
      { name: 'Inside Tee', sectionKey: 'foundations', sets: '1', reps: '3', progression: 'tee' },
      { name: 'Away Tee', sectionKey: 'foundations', sets: '1', reps: '3', progression: 'tee' },
    ],
  },
  {
    key: 'off-day-feel',
    label: 'Off-Day Feel Session',
    duration: '15 min',
    goal: 'Maintenance and body awareness',
    description: 'Low-volume maintenance. Don\'t train hard — just touch the swing and keep the feel alive.',
    bestFor: 'Off days, travel days, recovery days.',
    drills: [
      { name: 'Slow Motion Swing', sectionKey: 'foundations', sets: '2', reps: '5', notes: 'Easy. Feel every position.', progression: 'tee' },
      { name: 'High Tee Normal Swing', sectionKey: 'foundations', sets: '2', reps: '5', notes: 'Low line drives. 80% effort.', progression: 'tee' },
      { name: 'High Tee — One-Hand Finish', sectionKey: 'foundations', sets: '1', reps: '5', progression: 'tee' },
    ],
  },
  {
    key: 'competition-day',
    label: 'Competition Practice',
    duration: '30 min',
    goal: 'Pressure and game transfer',
    description: 'Short tee warm-up, then all competition. Points, consequences, scoring.',
    bestFor: 'Once a week. Make practice feel like games.',
    drills: [
      { name: 'High Tee Normal Swing', sectionKey: 'foundations', sets: '2', reps: '5', progression: 'tee' },
      { name: 'Line Drive Challenge', sectionKey: 'competition', sets: '1', reps: 'first to 5', progression: 'competition' },
      { name: '2-Strike Battle Round', sectionKey: 'competition', sets: '1', reps: '10 ABs', progression: 'competition' },
      { name: '21 Outs Game', sectionKey: 'competition', sets: '1', reps: 'full game', progression: 'competition' },
    ],
  },
];

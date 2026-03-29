/**
 * useEngagement — Central hook for all engagement systems.
 *
 * Loads daily score, streak, XP, skills, badges, challenge, and next priority.
 * Reloads on screen focus so dashboard always shows fresh data.
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  loadDailyScore,
  loadStreak,
  loadXP,
  loadEarnedBadges,
  loadChallengeProgress,
  loadPRStore,
  computeSkillScores,
  computeNextPriority,
  getCurrentChallenge,
  type DailyScoreRecord,
  type StreakData,
  type XPData,
  type SkillScores,
  type EarnedBadge,
  type WeeklyChallengeProgress,
  type ChallengeDefinition,
  type NextPriority,
} from '@/data/engagement-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EngagementState {
  dailyScore: DailyScoreRecord | null;
  streak: StreakData;
  xp: XPData;
  skills: SkillScores;
  badges: EarnedBadge[];
  challenge: WeeklyChallengeProgress;
  challengeDef: ChallengeDefinition;
  nextPriority: NextPriority;
  prCount: number;
  loaded: boolean;
}

const DEFAULT_STREAK: StreakData = { currentStreak: 0, lastActiveDate: '', longestStreak: 0 };
const DEFAULT_SKILLS: SkillScores = { confidence: 50, focus: 50, power: 50, timing: 50, consistency: 50 };

export function useEngagement(): EngagementState {
  const [state, setState] = useState<EngagementState>({
    dailyScore: null,
    streak: DEFAULT_STREAK,
    xp: { totalXP: 0, level: 1, xpForCurrentLevel: 0, xpForNextLevel: 100, xpInLevel: 0 },
    skills: DEFAULT_SKILLS,
    badges: [],
    challenge: {
      weekStart: '',
      challengeId: '',
      hittingSessions: 0,
      strengthWorkouts: 0,
      mentalSessions: 0,
      completed: false,
    },
    challengeDef: getCurrentChallenge(),
    nextPriority: { title: 'Get started', explanation: 'Complete your first training session.', category: 'hitting' },
    prCount: 0,
    loaded: false,
  });

  const loadAll = useCallback(async () => {
    try {
      const [dailyScore, streak, xp, badges, challenge, prStore] = await Promise.all([
        loadDailyScore(),
        loadStreak(),
        loadXP(),
        loadEarnedBadges(),
        loadChallengeProgress(),
        loadPRStore(),
      ]);

      // Load mental scores for skill computation
      let iss: number | null = null;
      let hss: number | null = null;
      let archetypeScores: Record<string, number> | null = null;
      try {
        const mentalRaw = await AsyncStorage.getItem('otc:mental-profile-scores');
        if (mentalRaw) {
          const parsed = JSON.parse(mentalRaw);
          iss = parsed.iss ?? null;
          hss = parsed.hss ?? null;
        }
      } catch {}

      // Load mechanical primary issue
      let mechanicalPrimary: string | null = null;
      try {
        const mechRaw = await AsyncStorage.getItem('otc:mechanical-diagnostic');
        if (mechRaw) {
          const parsed = JSON.parse(mechRaw);
          mechanicalPrimary = parsed.primary ?? null;
        }
      } catch {}

      const prCount = Object.keys(prStore.records).length;
      const score = dailyScore?.breakdown.total ?? 0;

      const skills = computeSkillScores({
        iss,
        hss,
        streakDays: streak.currentStreak,
        dailyScore: score,
        archetypeScores,
      });

      const nextPriority = computeNextPriority({
        iss,
        hss,
        streakDays: streak.currentStreak,
        dailyScore: score,
        mechanicalPrimary,
      });

      setState({
        dailyScore,
        streak,
        xp,
        skills,
        badges,
        challenge,
        challengeDef: getCurrentChallenge(),
        nextPriority,
        prCount,
        loaded: true,
      });
    } catch (err) {
      if (__DEV__) console.warn('[useEngagement] loadAll error:', err);
      setState((prev) => ({ ...prev, loaded: true }));
    }
  }, []);

  useFocusEffect(useCallback(() => { loadAll(); }, [loadAll]));

  return state;
}

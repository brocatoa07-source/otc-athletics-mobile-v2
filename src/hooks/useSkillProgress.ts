/**
 * useSkillProgress — Hook for loading and interacting with the Skill Progress Engine.
 *
 * Reloads on screen focus. Provides scores, focus skills, and a log function.
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  getSkillProgressState,
  logSkillChallenge,
  type SkillProgressState,
  type SkillScore,
  type SkillLogType,
  type SkillKey,
  type FocusSkills,
} from '@/data/skill-progress-engine';

export interface UseSkillProgressReturn {
  scores: Record<SkillKey, SkillScore>;
  focus: FocusSkills;
  loaded: boolean;
  /** Log a performance challenge. Returns the updated score for that skill. */
  logChallenge: (logType: SkillLogType, rawValue: number, metadata?: Record<string, unknown>) => Promise<SkillScore>;
  /** Force reload from storage */
  reload: () => void;
}

const EMPTY_SCORES: Record<SkillKey, SkillScore> = {} as any;
const EMPTY_FOCUS: FocusSkills = {
  hitting: ['timing', 'barrel_control'],
  mental: ['confidence', 'focus'],
  physical: ['speed', 'power'],
};

export function useSkillProgress(): UseSkillProgressReturn {
  const [scores, setScores] = useState<Record<SkillKey, SkillScore>>(EMPTY_SCORES);
  const [focus, setFocus] = useState<FocusSkills>(EMPTY_FOCUS);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const state = await getSkillProgressState();
      setScores(state.scores);
      setFocus(state.focusSkills);
    } catch (err) {
      if (__DEV__) console.warn('[useSkillProgress] load error:', err);
    }
    setLoaded(true);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const logChallengeWrapper = useCallback(
    async (logType: SkillLogType, rawValue: number, metadata?: Record<string, unknown>) => {
      const updatedScore = await logSkillChallenge(logType, rawValue, metadata);
      // Reload all scores after logging
      const state = await getSkillProgressState();
      setScores(state.scores);
      setFocus(state.focusSkills);
      return updatedScore;
    },
    [],
  );

  return {
    scores,
    focus,
    loaded,
    logChallenge: logChallengeWrapper,
    reload: load,
  };
}

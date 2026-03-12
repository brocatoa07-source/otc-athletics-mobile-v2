import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DeficiencyScores, QuizAnswer } from '@/data/deficiency-engine';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

const STORAGE_KEY = 'otc:assessment';

export type ArchetypeResult = 'static' | 'spring' | 'hybrid';

export interface AssessmentData {
  archetype: ArchetypeResult;
  scores: DeficiencyScores;
  quizAnswers: QuizAnswer[];
  completedAt: string; // ISO date
}

export function useAssessment() {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setAssessment(JSON.parse(raw));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const saveAssessment = useCallback(async (data: AssessmentData) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAssessment(data);

    // Sync to Supabase for coach visibility
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      supabase
        .from('athletes')
        .update({
          mover_type: data.archetype,
          deficiency_mobility: data.scores.mobility,
          deficiency_strength: data.scores.strength,
          deficiency_power: data.scores.power,
          deficiency_speed: data.scores.speed,
          deficiency_durability: data.scores.durability,
        })
        .eq('user_id', userId)
        .then(() => {});
    }
  }, []);

  const clearAssessment = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem('movement-archetype');
    setAssessment(null);
  }, []);

  return { assessment, loaded, saveAssessment, clearAssessment };
}

import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

const STORAGE_KEY = 'otc:sc-profile';

export type Position =
  | 'C' | '1B' | '2B' | '3B' | 'SS'
  | 'LF' | 'CF' | 'RF' | 'DH'
  | 'OF' | 'IF'
  | 'SP' | 'RP' | 'UTIL';

export type TrainingExperience = 'beginner' | 'intermediate' | 'advanced';

export type TrainingTimeline = 'offseason' | 'preseason' | 'in-season';

export type Equipment = 'full-gym' | 'home-gym' | 'minimal';

export interface ScProfile {
  position: Position;
  experience: TrainingExperience;
  timeline: TrainingTimeline;
  equipment: Equipment;
  daysPerWeek: number;
  moverType: string;
  age: number;
  completedAt: string | null;
}

export function useAthleteScProfile() {
  const [profile, setProfile] = useState<ScProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setProfile(JSON.parse(raw));
        } catch {}
      } else {
        setProfile(null);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  // Re-read on screen focus so dashboard picks up profile changes
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const saveProfile = useCallback(async (data: ScProfile) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setProfile(data);

    // Sync to Supabase for coach visibility
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      supabase
        .from('athletes')
        .update({
          sc_experience: data.experience,
          sc_equipment: data.equipment,
          sc_timeline: data.timeline,
        })
        .eq('user_id', userId)
        .then(() => {});
    }
  }, []);

  const clearProfile = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }, []);

  return { profile, loaded, saveProfile, clearProfile };
}

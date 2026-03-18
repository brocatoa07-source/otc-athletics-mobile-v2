import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { queryClient } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { handleUserSwitch, clearUserLocalState } from '@/lib/user-storage';

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const setSession = useAuthStore((s) => s.setSession);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const hydrated = useRef(false);

  useEffect(() => {
    // hydrate() restores session from AsyncStorage and sets isHydrated = true
    // when done. We gate the auth listener behind this flag so we never
    // double-fetch the profile during startup.
    hydrate().then(async () => {
      // Check for account switch on startup (session already restored)
      const currentSession = (await supabase.auth.getSession()).data.session;
      if (currentSession) {
        const switched = await handleUserSwitch(currentSession.user.id);
        if (switched) {
          queryClient.clear();
        }
      }
      hydrated.current = true;
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip INITIAL_SESSION — hydrate() already handles it.
      if (event === 'INITIAL_SESSION') return;

      // For SIGNED_IN / TOKEN_REFRESHED / SIGNED_OUT etc. that happen
      // after initial hydration, update state.
      if (!hydrated.current) return;

      if (session) {
        // Detect account switch and clear stale local state
        const switched = await handleUserSwitch(session.user.id);
        if (switched) {
          queryClient.clear();
        }
        setSession(session);
        await fetchProfile(session.user.id);
      } else {
        // Logout: clear all user-specific local state
        await clearUserLocalState();
        queryClient.clear();
        setSession(null);
        clearAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </StripeProvider>
  );
}
           
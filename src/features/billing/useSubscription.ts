/**
 * useSubscription — Fetches and caches the user's Stripe subscription from Supabase.
 *
 * Returns the subscription row from user_subscriptions, or null if none exists.
 * Provides a refresh function for post-checkout polling.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

export interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  tier: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const user = useAuthStore((s) => s.user);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user?.id) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchErr) {
        // Table may not exist yet — fail gracefully
        if (__DEV__) console.warn('[useSubscription] fetch error:', fetchErr.message);
        setError(fetchErr.message);
        setSubscription(null);
      } else {
        setSubscription(data as UserSubscription | null);
        setError(null);
      }
    } catch (err) {
      if (__DEV__) console.warn('[useSubscription] unexpected error:', err);
      setError('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Subscribe to realtime changes on user_subscriptions.
  // When the webhook writes a new tier, this fires and we immediately
  // refresh the athlete profile so useTier() reflects the change.
  const prevTierRef = useRef(subscription?.tier);
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (__DEV__) console.log('[useSubscription] realtime update:', payload.eventType);
          const updated = payload.new as UserSubscription;
          setSubscription(updated);

          // If tier changed, refresh the athlete profile so useTier() picks it up
          if (updated.tier !== prevTierRef.current) {
            prevTierRef.current = updated.tier;
            useAuthStore.getState().refreshAthleteProfile();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    subscription,
    loading,
    error,
    /** Manually refresh subscription (e.g., after checkout redirect) */
    refresh: fetchSubscription,
    /** Whether the subscription is actively paying */
    isActive: subscription?.status === 'active' || subscription?.status === 'trialing',
    /** Whether the subscription is past due (grace period) */
    isPastDue: subscription?.status === 'past_due',
    /** Whether the user will lose access at period end */
    isCanceling: subscription?.cancel_at_period_end === true,
  };
}

/**
 * Stripe Checkout — calls the create-checkout-session Edge Function
 * and opens the Stripe-hosted checkout page in the system browser.
 */

import { Linking } from 'react-native';
import { supabase } from '@/lib/supabase';
import type { PurchasableTier } from './stripeConfig';

interface CheckoutResult {
  success: boolean;
  error?: string;
}

/**
 * Start a Stripe Checkout session for the given tier.
 * Opens the checkout URL in the system browser.
 * The webhook handles the rest — the app listens for subscription changes via realtime.
 */
export async function startCheckout(tier: PurchasableTier): Promise<CheckoutResult> {
  try {
    // Get the current session for auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: 'Not logged in' };
    }

    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { tier },
    });

    if (error) {
      console.error('[checkout] Edge Function error:', error);
      return { success: false, error: error.message };
    }

    if (!data?.url) {
      return { success: false, error: 'No checkout URL returned' };
    }

    // Open Stripe Checkout in the system browser
    const canOpen = await Linking.canOpenURL(data.url);
    if (!canOpen) {
      return { success: false, error: 'Cannot open checkout URL' };
    }

    await Linking.openURL(data.url);
    return { success: true };
  } catch (err) {
    console.error('[checkout] unexpected error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Checkout failed',
    };
  }
}

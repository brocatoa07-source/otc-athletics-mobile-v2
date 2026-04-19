/**
 * Supabase Edge Function: create-checkout-session
 *
 * Creates a Stripe Checkout Session for tier upgrades.
 * Called from the mobile app's upgrade screen.
 *
 * Required env vars (set via Supabase Dashboard → Edge Functions → Secrets):
 *   STRIPE_SECRET_KEY
 *   STRIPE_PRICE_SINGLE
 *   STRIPE_PRICE_DOUBLE
 *   STRIPE_PRICE_TRIPLE
 *   STRIPE_PRICE_HOME_RUN
 *   APP_URL  (deep link base, e.g. "otcathletics://")
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
});

const PRICE_MAP: Record<string, string> = {
  SINGLE:   Deno.env.get('STRIPE_PRICE_SINGLE')!,
  DOUBLE:   Deno.env.get('STRIPE_PRICE_DOUBLE')!,
  TRIPLE:   Deno.env.get('STRIPE_PRICE_TRIPLE')!,
  HOME_RUN: Deno.env.get('STRIPE_PRICE_HOME_RUN')!,
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the user via their JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Parse the requested tier
    const { tier } = await req.json();
    const priceId = PRICE_MAP[tier];
    if (!priceId) {
      return new Response(JSON.stringify({ error: `Invalid tier: ${tier}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Find or create Stripe customer
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    let stripeCustomerId: string | null = null;

    // Check if user already has a subscription record with a Stripe customer ID
    const { data: existingSub } = await supabaseAdmin
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingSub?.stripe_customer_id) {
      stripeCustomerId = existingSub.stripe_customer_id;
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      stripeCustomerId = customer.id;
    }

    // 4. Create the Checkout Session
    const isOneTime = tier === 'HOME_RUN';
    const appUrl = Deno.env.get('APP_URL') || 'otclab://';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      mode: isOneTime ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        supabase_user_id: user.id,
        tier,
      },
      success_url: `${appUrl}upgrade-success`,
      cancel_url: `${appUrl}upgrade`,
    };

    // Add 7-day trial for DOUBLE tier (first time only)
    if (tier === 'DOUBLE' && !isOneTime) {
      sessionParams.subscription_data = {
        trial_period_days: 7,
        metadata: {
          supabase_user_id: user.id,
          tier,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

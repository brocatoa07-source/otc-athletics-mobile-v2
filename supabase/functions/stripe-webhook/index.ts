/**
 * Supabase Edge Function: stripe-webhook
 *
 * Handles Stripe webhook events to keep user_subscriptions in sync.
 *
 * Events handled:
 *   - checkout.session.completed  → create/update subscription row
 *   - invoice.paid               → renew / confirm active
 *   - invoice.payment_failed     → mark past_due
 *   - customer.subscription.updated → handle plan changes, trial end
 *   - customer.subscription.deleted → mark canceled, downgrade to WALK
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// ── Tier resolution from Stripe price → app tier ─────────────────────────

const PRICE_TO_TIER: Record<string, string> = {
  [Deno.env.get('STRIPE_PRICE_SINGLE')!]:   'SINGLE',
  [Deno.env.get('STRIPE_PRICE_DOUBLE')!]:   'DOUBLE',
  [Deno.env.get('STRIPE_PRICE_TRIPLE')!]:   'TRIPLE',
  [Deno.env.get('STRIPE_PRICE_HOME_RUN')!]: 'HOME_RUN',
};

function tierFromPriceId(priceId: string): string {
  return PRICE_TO_TIER[priceId] || 'WALK';
}

// ── Upsert subscription row ─────────────────────────────────────────────

interface SubUpsert {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  tier: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end?: boolean;
}

async function upsertSubscription(data: SubUpsert) {
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert(
      {
        user_id: data.user_id,
        stripe_customer_id: data.stripe_customer_id,
        stripe_subscription_id: data.stripe_subscription_id,
        tier: data.tier,
        status: data.status,
        current_period_end: data.current_period_end,
        cancel_at_period_end: data.cancel_at_period_end ?? false,
      },
      { onConflict: 'user_id' },
    );

  if (error) {
    console.error('upsertSubscription error:', error);
    throw error;
  }
}

// ── Resolve Supabase user_id from Stripe customer ───────────────────────

async function getUserId(customerId: string, metadata?: Record<string, string>): Promise<string | null> {
  // Try metadata first (most reliable)
  if (metadata?.supabase_user_id) return metadata.supabase_user_id;

  // Fall back to existing subscription record
  const { data } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();

  if (data?.user_id) return data.user_id;

  // Last resort: check Stripe customer metadata
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  return (customer.metadata?.supabase_user_id) || null;
}

// ── Event handlers ──────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = await getUserId(
    session.customer as string,
    session.metadata as Record<string, string>,
  );
  if (!userId) {
    console.error('checkout.session.completed: no user_id found', session.id);
    return;
  }

  const tier = session.metadata?.tier || 'WALK';

  if (session.mode === 'payment') {
    // One-time payment (HOME_RUN)
    await upsertSubscription({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: null,
      tier,
      status: 'active',
      current_period_end: null, // lifetime
    });
  } else if (session.mode === 'subscription') {
    // Subscription — full details come from invoice.paid / subscription.updated,
    // but set initial state here
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await upsertSubscription({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      tier,
      status: subscription.status === 'trialing' ? 'trialing' : 'active',
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    });
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return; // one-time payment, handled by checkout

  const userId = await getUserId(invoice.customer as string);
  if (!userId) {
    console.error('invoice.paid: no user_id found', invoice.id);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const priceId = subscription.items.data[0]?.price?.id;
  const tier = priceId ? tierFromPriceId(priceId) : 'WALK';

  await upsertSubscription({
    user_id: userId,
    stripe_customer_id: invoice.customer as string,
    stripe_subscription_id: subscription.id,
    tier,
    status: 'active',
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const userId = await getUserId(invoice.customer as string);
  if (!userId) return;

  // Mark as past_due but keep current tier (grace period)
  const { error } = await supabase
    .from('user_subscriptions')
    .update({ status: 'past_due', updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) console.error('invoice.payment_failed update error:', error);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = await getUserId(subscription.customer as string);
  if (!userId) return;

  const priceId = subscription.items.data[0]?.price?.id;
  const tier = priceId ? tierFromPriceId(priceId) : 'WALK';

  await upsertSubscription({
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    tier,
    status: subscription.status === 'trialing' ? 'trialing' : subscription.status === 'active' ? 'active' : subscription.status,
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = await getUserId(subscription.customer as string);
  if (!userId) return;

  // Downgrade to WALK
  await upsertSubscription({
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    tier: 'WALK',
    status: 'canceled',
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: false,
  });
}

// ── Main handler ────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'unknown'}`, { status: 400 });
  }

  console.log(`Stripe event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    return new Response(JSON.stringify({ error: 'Webhook handler failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

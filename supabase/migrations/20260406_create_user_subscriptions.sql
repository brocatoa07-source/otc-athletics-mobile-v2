-- ============================================================================
-- user_subscriptions — Stripe subscription state
-- ============================================================================
-- Populated by the stripe-webhook Edge Function.
-- The app reads this table to determine the user's active tier.
-- ============================================================================

-- ── Fix: Add GRAND_SLAM to athletes.tier CHECK constraint ───────────────────
-- The app supports GRAND_SLAM as a tier but the original schema omits it.
-- Must be done BEFORE creating the sync trigger that writes to athletes.tier.

ALTER TABLE public.athletes
  DROP CONSTRAINT IF EXISTS athletes_tier_check;

ALTER TABLE public.athletes
  ADD CONSTRAINT athletes_tier_check
  CHECK (tier IN ('WALK','SINGLE','DOUBLE','TRIPLE','HOME_RUN','GRAND_SLAM'));

-- ── Table ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_customer_id    text NOT NULL,
  stripe_subscription_id text,          -- NULL for one-time (HOME_RUN)
  tier            text NOT NULL DEFAULT 'WALK'
                  CHECK (tier IN ('WALK','SINGLE','DOUBLE','TRIPLE','HOME_RUN','GRAND_SLAM')),
  status          text NOT NULL DEFAULT 'inactive'
                  CHECK (status IN ('active','trialing','past_due','canceled','inactive')),
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- One subscription row per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_subscriptions_user_id
  ON public.user_subscriptions(user_id);

-- Lookup by Stripe customer
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer
  ON public.user_subscriptions(stripe_customer_id);

-- Lookup by Stripe subscription
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_sub
  ON public.user_subscriptions(stripe_subscription_id);

-- Auto-update updated_at (idempotent: drop + create)
DROP TRIGGER IF EXISTS set_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER set_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_subscriptions' AND policyname = 'Users can read own subscription'
  ) THEN
    CREATE POLICY "Users can read own subscription"
      ON public.user_subscriptions FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Service role (Edge Functions) can do everything
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_subscriptions' AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access"
      ON public.user_subscriptions FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ── Sync tier to athletes table ─────────────────────────────────────────────
-- When subscription changes, update athletes.tier so existing useTier() works.

CREATE OR REPLACE FUNCTION sync_subscription_tier()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.athletes
  SET tier = NEW.tier, updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_sub_tier_to_athlete ON public.user_subscriptions;
CREATE TRIGGER sync_sub_tier_to_athlete
  AFTER INSERT OR UPDATE OF tier ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION sync_subscription_tier();

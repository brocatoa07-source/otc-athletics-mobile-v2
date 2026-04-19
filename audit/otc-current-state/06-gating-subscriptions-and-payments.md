# OTC Athletics — Gating, Subscriptions & Payments

## Tier System

**Source:** `src/features/billing/tierAccess.ts`

| Tier | Rank | Price | Model |
|------|------|-------|-------|
| WALK | 0 | Free | Default |
| SINGLE | 1 | $29.99/mo | Subscription |
| DOUBLE | 2 | $54.99/mo | Subscription |
| TRIPLE | 3 | $99.99/mo | Subscription |
| HOME_RUN | 4 | $500 | One-time (lifetime) |
| GRAND_SLAM | 5 | Custom | Application only |

**Effective tier resolution:** `coaching > lifetime > monthlyTier > trial`

---

## Permission Keys (42)

**Source:** `src/features/billing/tierAccess.ts` — `ACCESS_MAP`

| Permission | Min Tier |
|-----------|----------|
| hittingVault.view | WALK |
| hittingVault.useLimited | WALK |
| hittingVault.useFull | SINGLE |
| mentalVault.view | WALK |
| mentalVault.useFull | DOUBLE |
| strengthVault.view | WALK |
| strengthVault.useFull | TRIPLE |
| diagnostics.hitting | SINGLE |
| diagnostics.mental | DOUBLE |
| diagnostics.strength | TRIPLE |
| dailyWork.hitting | WALK |
| dailyWork.mental | DOUBLE |
| dailyWork.strength | TRIPLE |
| myPath.hitting | WALK |
| myPath.mental | DOUBLE |
| myPath.strength | TRIPLE |
| weeklyReview | DOUBLE |
| progressDashboard | DOUBLE |
| monthlyReport | TRIPLE |
| prWindow | TRIPLE |
| coachBrain | TRIPLE |
| messages | DOUBLE |
| announcements | WALK |
| atBatAccountability | WALK |
| logging.basic | WALK |
| logging.advanced | SINGLE |
| adaptiveProgramming | TRIPLE |
| coaching | GRAND_SLAM |

---

## Access Control Stack

```
useTier() → reads athlete.tier from Zustand auth store
    ↓
useAccess() → loads trial state + builds SubscriptionState
    ↓
hasAccess(permissionKey) → tierAtLeast(effectiveTier, requiredTier)
    ↓
AccessGate component → lock overlay with upgrade CTA
InlineLock component → small lock badge
```

**Files:**
- `src/hooks/useTier.ts` — canonical tier from `athlete?.tier`
- `src/features/billing/useAccess.ts` — bridges tier + trial
- `src/features/billing/tierAccess.ts` — ACCESS_MAP, helpers
- `src/features/billing/AccessGate.tsx` — lock overlay component
- `src/features/billing/trialManager.ts` — 7-day DOUBLE trial

---

## Free Trial

- **Duration:** 7 days
- **Tier granted:** DOUBLE
- **Eligibility:** WALK users only, one-time
- **Storage:** AsyncStorage key `otc:double-trial`
- **Check:** `canStartTrial(trial)`, `isTrialActive(trial)`, `isTrialExpired(trial)`

---

## Stripe Integration

### Architecture
```
App (checkout.ts)
  → supabase.functions.invoke('create-checkout-session')
  → Opens Stripe Checkout in browser
  → Stripe fires webhook
  → Edge Function (stripe-webhook)
  → Upserts user_subscriptions table
  → DB trigger syncs athletes.tier
  → Realtime fires to useSubscription()
  → refreshAthleteProfile() updates useTier()
```

### Edge Functions
| Function | File | Status |
|----------|------|--------|
| create-checkout-session | `supabase/functions/create-checkout-session/index.ts` | **Written, NOT deployed** |
| stripe-webhook | `supabase/functions/stripe-webhook/index.ts` | **Written, NOT deployed** |

### Webhook Events Handled
- `checkout.session.completed` → create/update subscription
- `invoice.paid` → confirm active
- `invoice.payment_failed` → mark past_due
- `customer.subscription.updated` → handle plan changes
- `customer.subscription.deleted` → downgrade to WALK

### Required Secrets (not yet set)
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_SINGLE=price_xxx
STRIPE_PRICE_DOUBLE=price_xxx
STRIPE_PRICE_TRIPLE=price_xxx
STRIPE_PRICE_HOME_RUN=price_xxx
APP_URL=otclab://
```

### Post-Checkout Flow
1. Success redirect: `otclab://upgrade-success`
2. `upgrade-success.tsx` polls `refreshAthleteProfile()` up to 4 times (2s intervals)
3. Realtime listener in `useSubscription()` catches DB change
4. `useTier()` picks up new tier → UI re-renders
5. AppState listener in `upgrade.tsx` also refreshes on foreground return

---

## Pricing Inconsistencies

| Location | TRIPLE Price | Issue |
|----------|-------------|-------|
| `tierAccess.ts` TIER_PRICES | $99.99/mo | Canonical |
| `upgrade.tsx` tier cards | $99.99/mo | Matches |
| `community/index.tsx` upgrade hint | $120/mo | **WRONG** |

---

## Production Readiness

| Item | Status |
|------|--------|
| Tier system | Ready |
| Permission map | Ready |
| Access gates | Ready |
| Trial logic | Ready |
| Stripe edge functions | Written, not deployed |
| Webhook endpoint | Not registered |
| Price IDs | Not created |
| Subscription table | Migration applied |
| Realtime publication | Needs `ALTER PUBLICATION` |
| App scheme | `otclab://` — correctly configured |
| Post-checkout refresh | Built (3-layer: realtime + AppState + polling) |

---

## Course Purchase System

**Source:** `src/features/content/programsAndCourses.ts`

Courses use purchase-based gating (not tier-based):
- `canUserAccessContent()` checks `purchasedContentIds.includes(item.id)`
- GRAND_SLAM overrides (unlocks all)
- `user_purchases` table exists but **purchase flow is not built** (no checkout for individual courses)
- Current code: `purchasedIds: string[] = []` — TODO comment in training/index.tsx

**Risk:** Users can see courses listed at $99 each, but tapping them routes to the upgrade screen (tier upgrade), not a course purchase flow. This is misleading for courses that are independent purchases.

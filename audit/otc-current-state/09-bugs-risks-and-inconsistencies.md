# OTC Athletics — Bugs, Risks & Inconsistencies

## Critical

### C1. AsyncStorage data loss on reinstall
**Problem:** Exercise weight logs (500 entries), mental check-ins (60 entries), course progress, readiness history, workout completions, progression state — all stored only in AsyncStorage. Uninstall/reinstall = complete data loss.
**Why it matters:** Athletes lose months of training history. Progression engine makes wrong decisions without history.
**Files:** `exerciseLog.ts`, `mentalProgression.ts`, `useCourseProgress.ts`, `useReadiness.ts`, `progressionEngine.ts`
**Fix:** Sync critical AsyncStorage data to Supabase `athlete_logs` table (which already exists for this purpose).

### C2. Stripe not deployed
**Problem:** Edge functions exist in code but are not deployed. No webhook endpoint registered. No Stripe Price IDs created. Payment flow is completely non-functional.
**Why it matters:** Revenue = $0 until this works. Users see upgrade CTAs that lead nowhere functional.
**Files:** `supabase/functions/create-checkout-session/`, `supabase/functions/stripe-webhook/`, `checkout.ts`
**Fix:** Deploy edge functions, set secrets, register webhook, create Stripe products/prices.

### C3. Course purchase flow doesn't exist
**Problem:** 4 courses listed at $99 each but `purchasedIds` is hardcoded to `[]` in training/index.tsx. No purchase checkout flow exists. Tapping a locked course routes to the tier upgrade screen, not a course purchase.
**Why it matters:** Courses are revenue items that can't be purchased. UX is misleading.
**Files:** `training/index.tsx` (line 27: `const purchasedIds: string[] = []`), `programsAndCourses.ts`
**Fix:** Build course purchase flow or integrate with existing Stripe checkout.

---

## High

### H1. All 156 drill videos are empty
**Problem:** Every drill in `tagged-drills.ts` has `videoUrl: ''`. Drill detail screens show a "Drill Video" section with nothing.
**Why it matters:** Video-first training content has no video. Undermines credibility of the hitting system.
**Files:** `src/data/tagged-drills.ts`, `training/mechanical/[section].tsx`
**Fix:** Populate videoUrl fields or hide the video section when URL is empty.

### H2. Community pricing shows $120/mo for Triple
**Problem:** Community index upgrade hint shows "$120/mo" but TRIPLE is $99.99/mo everywhere else.
**Why it matters:** Price confusion erodes trust.
**Files:** `src/app/(app)/community/index.tsx` (hardcoded "$120/mo" string)
**Fix:** Replace with `TIER_PRICES.TRIPLE` from `tierAccess.ts`.

### H3. 16 of 20 troubleshooting topics have empty cues
**Problem:** `troubleshooting-engine.ts` has 16 topics where `cues: []` is empty. The topic screen renders a cues section that shows nothing.
**Why it matters:** Athletes are told to fix a problem but get no coaching cues.
**Files:** `src/data/troubleshooting-engine.ts`
**Fix:** Fill in cue content for all 20 topics.

### H4. Realtime not enabled for user_subscriptions
**Problem:** `useSubscription.ts` subscribes to realtime changes on `user_subscriptions`, but the table may not be in the `supabase_realtime` publication.
**Why it matters:** Post-checkout tier updates rely on realtime. Without it, the user must force-quit and re-open the app.
**Files:** `src/features/billing/useSubscription.ts`
**Fix:** `ALTER PUBLICATION supabase_realtime ADD TABLE user_subscriptions;`

### H5. Overlapping tool content systems
**Problem:** Three separate tool inventories with different content:
- `mental-tools.ts` (13 categories, 63 structured tools) — used by toolbox
- `mental-vault-sections.ts` (11 sections, 55 tools) — used by [section] route
- `mental-tool-catalog.ts` — unknown usage, likely legacy
**Why it matters:** Maintenance burden. Content updates must happen in multiple files. Athlete sees different tools depending on entry point.
**Files:** All three above
**Fix:** Consolidate to one canonical source. Likely keep `mental-tools.ts` as primary, deprecate others.

### H6. Programs have no detail screens
**Problem:** 5 programs listed on Train screen but tapping an unlocked program does nothing (empty onPress handler).
**Why it matters:** Programs are tier-locked content items that athletes pay for but can't access even when unlocked.
**Files:** `training/index.tsx` ContentCard component
**Fix:** Build program detail screens or route to existing vault subsystems.

---

## Medium

### M1. User switch doesn't clear all AsyncStorage keys
**Problem:** Root layout detects user ID change and clears ~15 specific keys. But there are 50+ keys total. Keys like `otc:course-progress-*` use dynamic suffixes and aren't cleared.
**Files:** `src/app/_layout.tsx`
**Fix:** Use a prefix-based clear that removes all `otc:*` keys on user switch.

### M2. Dead route files accessible via URL
**Problem:** `placeholder.tsx`, `connect-coach.tsx`, `mental-profile-quiz.tsx`, `mental-struggles-quiz.tsx` are reachable via Expo Router but serve no purpose.
**Files:** Listed above
**Fix:** Delete dead route files.

### M3. Own the Cost branding leak
**Problem:** Routes `own-the-cost-home`, `own-the-cost-checkin`, `own-the-cost-summary` use internal codename visible in URLs.
**Files:** `src/app/(app)/training/own-the-cost-*.tsx`
**Fix:** Rename to `readiness-*` or `checkin-*`.

### M4. Karteria files still in codebase
**Problem:** 10 files (`karteria-month-1.ts` through `karteria-subs.ts`) from a previous program format. Not imported anywhere active.
**Files:** `src/data/karteria-*.ts`
**Fix:** Delete all karteria files.

### M5. mental-vault-sections.ts shows 5 journals, 5 meditations
**Problem:** Vault sections list 5 journal tools and 5 meditation tools, but the actual screens have 9 journals and 7 meditations. Mismatch.
**Files:** `src/data/mental-vault-sections.ts` (tools arrays for journals/meditations sections)
**Fix:** Either update vault section tools to match actual counts or deprecate vault sections.

### M6. `movement-archetype` AsyncStorage key no prefix
**Problem:** Key `movement-archetype` doesn't use the `otc:` prefix convention. Won't be cleared on user switch.
**Files:** Referenced in various strength files
**Fix:** Rename to `otc:movement-archetype`.

### M7. sc/progress.tsx has hardcoded archetype
**Problem:** The strength progress screen has a TODO noting that archetype/need are hardcoded to 'hybrid'/'strength' instead of reading from stored profile.
**Files:** `src/app/(app)/training/sc/progress.tsx`
**Fix:** Read from `useStrengthProfile()` hook.

---

## Low

### L1. Duplicate colors import paths
**Problem:** `Colors.bg` (from constants/colors.ts), `colors.bg` (from theme), `accents.mental` (from theme) — three import patterns for colors.
**Files:** Throughout codebase
**Fix:** Standardize on `colors` from `@/theme`. The `constants/colors.ts` compat layer can remain.

### L2. Upload screen is a stub
**Problem:** `upload.tsx` renders "Phase 2 implementation" text with no functionality.
**Files:** `src/app/(app)/upload.tsx`
**Fix:** Either build or remove from navigation.

### L3. Exit Velo and Speed add-on programs incomplete
**Problem:** Full screen structure + data files exist but integration with main app flow is unclear. Listed under add-ons but access/gating model isn't defined.
**Files:** `src/app/(app)/training/add-ons/`, `src/data/exit-velo-program/`, `src/data/speed-program/`
**Fix:** Define access model and surface in Train hub or keep hidden until ready.

### L4. Recruiting and college-fit data unused
**Problem:** 5 data files with benchmarks and recruiting profiles exist but no screens render this content.
**Files:** `src/data/recruiting-*.ts`, `src/data/college-fit-*.ts`
**Fix:** Either build screens or remove data files.

### L5. coach/video-review.tsx unknown state
**Problem:** Video review screen exists for coaches but upload/storage integration is unclear.
**Files:** `src/app/(app)/coach/video-review.tsx`
**Fix:** Verify it works with actual video uploads or stub it.

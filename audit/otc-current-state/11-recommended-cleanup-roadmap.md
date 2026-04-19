# OTC Athletics — Recommended Cleanup Roadmap

## Phase 1: Stabilize Current App
**Objective:** Make the app reliable enough that a test user can complete the core loop without hitting a wall.

| Task | Files | Impact |
|------|-------|--------|
| Deploy Stripe edge functions + set secrets + register webhook | `supabase/functions/`, `.env` | Revenue unblocked |
| Enable realtime for `user_subscriptions` | Supabase SQL | Post-checkout tier updates work |
| Fix community pricing ($120 → $99.99) | `community/index.tsx` | Price consistency |
| Fix hardcoded `purchasedIds: []` — load from `user_purchases` | `training/index.tsx` | Course purchase tracking works |
| Hide video section when `videoUrl` is empty | `mechanical/[section].tsx` | No empty video placeholders |
| Fill 16 empty troubleshooting cue arrays | `troubleshooting-engine.ts` | Complete troubleshooting content |
| Fix sc/progress.tsx hardcoded archetype | `sc/progress.tsx` | Correct profile display |

**Dependency:** Stripe deployment must happen before any real user testing.

---

## Phase 2: Remove Confusion / Duplication
**Objective:** Clean the codebase of dead, duplicate, and misleading code.

| Task | Files | Impact |
|------|-------|--------|
| Delete karteria files (10 files) | `src/data/karteria-*.ts` | Remove 10 dead files |
| Delete dead screens: `placeholder.tsx`, `connect-coach.tsx`, `mental-profile-quiz.tsx`, `mental-struggles-quiz.tsx` | `src/app/` | Remove 4 dead routes |
| Delete `ConnectCodeCard.tsx` | `src/components/coach/` | Remove dead component |
| Delete or archive `UpgradeGate.tsx` (replaced by AccessGate) | `src/components/common/` | Reduce confusion |
| Consolidate mental tool systems: deprecate `mental-vault-sections.ts` and `mental-tool-catalog.ts` in favor of `mental-tools.ts` | `src/data/` | Single source of truth for tools |
| Audit 28 dashboard components — delete unused ones | `src/components/dashboard/` | Reduce maintenance surface |
| Delete `mental-struggles-data.ts`, `mental-profile-data.ts` (replaced by diagnostics system) | `src/data/` | Remove legacy data |
| Standardize AsyncStorage key prefix to `otc:` for all keys | Various | Clean key convention |

**Dependency:** None — pure cleanup, no behavioral changes.

---

## Phase 3: Content System Cleanup
**Objective:** Ensure all content is consistent, complete, and correctly counted.

| Task | Files | Impact |
|------|-------|--------|
| Update `mental-vault-sections.ts` journal/meditation tools to match actual counts (9/7) or deprecate the file | `mental-vault-sections.ts` | Accurate counts |
| Ensure all structured tools in `mental-tools.ts` have complete `items` arrays | `mental-tools.ts` | Correct toolbox counts |
| Populate empty troubleshooting cues (16 topics) | `troubleshooting-engine.ts` | Complete content |
| Review and update course content for all 11 weeks | `*-course-data.ts` | Polish course |
| Audit recruiting/college-fit data — surface or delete | `recruiting-*.ts`, `college-fit-*.ts` | Reduce dead data |
| Review exit-velo and speed program integration | `training/add-ons/`, `src/data/{exit-velo,speed}-program/` | Decide: ship or remove |

**Dependency:** Phase 2 cleanup should happen first to reduce surface area.

---

## Phase 4: Monetization / Gating Hardening
**Objective:** Ensure every paid feature can actually be purchased and every free feature is correctly accessible.

| Task | Files | Impact |
|------|-------|--------|
| Build course purchase flow (individual Stripe sessions per course) | `checkout.ts`, `training/index.tsx`, new edge function | $99 courses purchasable |
| Load `purchasedIds` from `user_purchases` table | `training/index.tsx` | Unlocked courses accessible |
| Build program detail screens (at least routing to vault subsystems) | `training/index.tsx`, new or existing screens | Programs accessible when unlocked |
| Build 3 remaining course detail experiences | New files or adapt existing course.tsx | Courses have content |
| Verify every permission key has correct tier mapping | `tierAccess.ts` | No access gaps |
| Test upgrade → downgrade → re-upgrade flow end-to-end | Multiple | Subscription lifecycle works |
| Test trial → expiry → upgrade flow | `trialManager.ts`, `useAccess.ts` | Trial-to-paid conversion works |

**Dependency:** Phase 1 Stripe deployment must be done first.

---

## Phase 5: Scale-Ready Architecture Improvements
**Objective:** Prepare the app for real users, multiple devices, and data reliability.

| Task | Files | Impact |
|------|-------|--------|
| Build AsyncStorage → Supabase sync for exercise logs | `exerciseLog.ts`, new sync service | Data persists across devices |
| Build sync for mental check-ins | `mentalProgression.ts`, sync layer | Trend data survives reinstall |
| Build sync for course progress | `useCourseProgress.ts`, sync layer | Course progress survives reinstall |
| Build sync for workout completions | Workout completion logic | Program position survives |
| Add user switch cleanup for dynamic keys (`otc:course-progress-*`) | `_layout.tsx` | No cross-user data leak |
| Migrate content from TS files to Supabase tables (drills, tools, exercises) | All data files → DB schema | CMS-like content updates |
| Add usage analytics (feature flags, event tracking) | New service | Data-driven decisions |
| Add search across drills, tools, and exercises | New component | Discoverability |
| Build onboarding flow for new users | New screens | First-run experience |
| Add offline support for core training flows | Cache layer | Works without internet |

**Dependency:** Phases 1-4 should be stable before investing in scale.

---

## Phase Summary

| Phase | Effort | Risk Reduction | Revenue Impact |
|-------|--------|---------------|----------------|
| 1. Stabilize | 2-3 days | High | Unblocks payments |
| 2. Cleanup | 1-2 days | Medium | Reduces bugs |
| 3. Content | 2-3 days | Medium | Improves polish |
| 4. Monetization | 5-7 days | High | Unblocks revenue |
| 5. Scale | 2-4 weeks | High | Retention & reliability |

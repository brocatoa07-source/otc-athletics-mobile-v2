# OTC Athletics — Build vs Vision Gap Analysis

## What the App Appears Designed to Become

Based on code evidence (data files, screen stubs, type definitions, architecture), the vision is:

**A comprehensive athlete development platform** that:
1. Diagnoses the athlete's profile across 3 domains (hitting, mental, strength)
2. Generates personalized programming for each domain
3. Delivers daily work prescriptions
4. Tracks compliance, readiness, and performance
5. Adapts programming based on feedback loops
6. Gates content behind a progressive subscription model
7. Supports coaches managing athletes with custom programs
8. Supports parents monitoring their children's development
9. Offers premium courses as standalone purchases
10. Builds a community with leaderboards, challenges, and social features

---

## What Is Already Real

| System | Completeness | Evidence |
|--------|-------------|---------|
| Mental diagnostic → profile → daily work | 95% | 60 Qs, 6 archetypes, profile synthesis, daily prescription engine, check-ins, trends, lane progression. Missing: cloud sync for check-in data. |
| Strength program generation | 90% | 18 templates, 7-step pipeline, weight logging with previous display, RPE tracking. Missing: cloud sync for exercise logs. |
| Hitting drill library + troubleshooting | 85% | 156 drills, 6 categories, 20 topics, plan builder. Missing: all drill videos, 16/20 topics have empty cues. |
| Subscription tier system | 90% | 6 tiers, 42 permissions, access gates everywhere, upgrade screen. Missing: Stripe deployment. |
| Authentication & roles | 95% | Email auth, 3 roles, role-specific routing and dashboards, session persistence. |
| Coach system | 85% | Roster, programs, CSV import, assignments, athlete detail. Missing: video review integration. |
| Parent system | 90% | Invite codes, linked dashboards, RLS-protected access. |
| Community (announcements + leaderboards) | 85% | Working feed, leaderboard with submission and filtering. |
| Mental Mastery course | 95% | 11 weeks, full content, sequential unlock, progress tracking. |
| Dashboard (athlete) | 80% | Coaching messages, PR window, behavior notifications, 4 pillars. Many stale components. |
| Mobility vault | 80% | Categories, drills, flows, library. Integrated under strength. |
| Daily Work hub | 85% | 6 items, tier-gated, status indicators. Working. |

---

## What Is Mocked or Partially Implemented

| System | Gap | Evidence |
|--------|-----|---------|
| **3 of 4 courses** | Card only, no detail screen | `programsAndCourses.ts` defines them but tapping does nothing |
| **5 programs** | Card only, no detail screen | Same — `ContentCard` has empty onPress for unlocked programs |
| **Course purchases** | `purchasedIds` hardcoded to `[]` | `training/index.tsx` line 27 |
| **Stripe checkout** | Code written, not deployed | Edge functions in `supabase/functions/` |
| **Exit Velo add-on** | Screens + data exist | `training/add-ons/exit-velo/` — 5 screens, data model |
| **Speed add-on** | Screens + data exist | `training/add-ons/speed/` — 5 screens, data model |
| **Drill videos** | All 156 URLs empty | `tagged-drills.ts` — every `videoUrl: ''` |
| **Notifications** | Manager exists, scheduling built | `notificationManager.ts` — not integrated with backend delivery |
| **Upload** | Stub screen | `upload.tsx` — "Phase 2 implementation" |
| **Recruiting data** | 5 data files | No screens surface this content |
| **College fit** | 2 data files | No screens surface this content |

---

## Systems That Are Overbuilt

| System | Evidence | Impact |
|--------|----------|--------|
| **Strength config** | 30 files, 11 config files, 17 service files | Sophisticated but may exceed what users actually interact with. Most users just see the workout screen. |
| **Dashboard components** | 28 components for a screen using ~10 | ~18 potentially unused components maintained in codebase |
| **Recommendation engines** | 4 recommendation layers in `src/lib/recommendation/` | Built before the content they recommend exists in full |
| **Mental tool inventories** | 3 separate content systems (tools, vault sections, catalog) | Overlapping content maintained in parallel |
| **Karteria program** | 10 legacy data files | Completely replaced by otcs-* system but still in repo |
| **Data engines** | `dashboard-engine.ts`, `engagement-engine.ts`, `next-priority-engine.ts`, `skill-progress-engine.ts` | Complex engines that may not all be actively consumed |

---

## Systems That Are Underbuilt

| System | Gap | Impact |
|--------|-----|--------|
| **Data sync** | No AsyncStorage → Supabase sync | Users lose all local data on reinstall. Critical. |
| **Course commerce** | No purchase flow for individual courses | $99 courses can't be bought. Revenue gap. |
| **Program detail** | No screens for programs | Paying subscribers can't access program content. |
| **Video content** | Zero videos in the entire app | Training content lacks the most impactful medium. |
| **Onboarding** | No onboarding flow | New users see a dashboard with no context on what to do first. |
| **Search** | No search functionality | 200+ tools, drills, exercises — no way to search. |
| **Analytics** | No usage analytics | No tracking of which features are used, retention, engagement. |

---

## Architecture vs Product Misalignment

### 1. Content in Code vs Content in DB
**Architecture:** TypeScript files hold all content (80+ data files)
**Product need:** Content updates (adding drills, updating tools) require code deployment
**Misalignment:** The DB has `drills`, `vault_content`, `courses` tables but they're empty/unused. The app was designed for DB-driven content but built with hardcoded data.

### 2. AsyncStorage vs Cloud Persistence
**Architecture:** AsyncStorage used for 50+ keys including critical training data
**Product need:** Athletes expect data persists across devices and reinstalls
**Misalignment:** The DB has `athlete_logs`, `exercise_logs`, `set_logs` tables designed for this data, but the app writes to AsyncStorage instead.

### 3. Subscription Tier vs Course Purchase
**Architecture:** Two distinct access models (tier-gated programs + purchase-gated courses)
**Product need:** Users need to be able to buy individual courses independently
**Misalignment:** Both use the same `ContentCard` component but only tier upgrades have a checkout flow. Course purchases route to the wrong screen.

### 4. 133 Screens vs Core User Journey
**Architecture:** 133 screen files across the app
**Product need:** Most athletes will use <20 screens daily
**Misalignment:** Feature sprawl means testing surface is enormous. Many screens are edge cases, legacy, or stubs that inflate the app's complexity without proportional user value.

### 5. Coach System vs Athlete-First
**Architecture:** Full coach management system (9 screens, CSV import, program assignment)
**Product need:** The app is marketed as an athlete development tool
**Misalignment:** Coach features are sophisticated but the core athlete experience has gaps (no onboarding, no videos, no search). Coach features may be premature.

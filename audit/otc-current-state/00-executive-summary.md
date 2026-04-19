# OTC Athletics — Executive Summary

**Audit Date:** 2026-04-06
**App Version:** 0.1.0
**Stack:** React Native 0.81.5 / Expo SDK 54 / Expo Router v6 / Supabase / React Query / Zustand / Stripe / AsyncStorage

---

## What the App Is

OTC Athletics is a baseball player development operating system. It personalizes training across three domains (hitting, mental, strength), tracks compliance, assesses readiness, adapts programming, and gates content behind a 6-tier subscription model. It also supports coaches (program management, roster, messaging) and parents (read-only athlete dashboards).

---

## Major Modules (10)

| Module | Status | Files | Notes |
|--------|--------|-------|-------|
| **Hitting Vault** | Built | 26 screens, 156 drills, 6 troubleshooting categories | All videoUrls empty |
| **Mental Vault** | Built | 27 screens, 60 diagnostic Qs, 13 tool categories, 11-week course | Most complete system |
| **Strength Vault (OTC-S)** | Built | 21 screens, 18 program templates, 100+ exercise metadata | Sophisticated generation engine |
| **Diagnostics** | Built | 3 mental (60 Qs), 1 hitting mover-type, 1 mechanical, 1 lifting-mover | All functional |
| **Subscription / Gating** | Built | 6 tiers, 42 permission keys, Stripe edge functions | Checkout built, needs deployment |
| **Dashboard** | Built | Coaching messages, PR window, behavior notifications, pillar CTAs | Complex, well-wired |
| **Community** | Built | Announcements, leaderboards, messaging | Functional |
| **Programs & Courses** | Partial | 5 programs, 4 courses listed | Detail screens only built for Mental Mastery |
| **Coach System** | Built | Roster, programs, assignments, CSV import, video review | Functional |
| **Parent System** | Built | Linked athlete dashboards, invite codes | Functional |

---

## Top 5 Risks

1. **Zero video content**: 156 hitting drills + all meditations reference video/media that doesn't exist. Empty `videoUrl` fields throughout.
2. **Stripe not deployed**: Edge functions exist in code but are not deployed. No webhook registered. Payment flow is blocked.
3. **AsyncStorage as source of truth**: 50+ storage keys hold critical state (progression, check-ins, exercise logs, course progress) that will be lost on app reinstall or device switch. No cloud sync for most local data.
4. **3 of 4 courses have no detail screens**: Only Mental Mastery routes to a real experience. Hitting Approach, Throwing & Arm Care, and Strength & Speed are card-only stubs.
5. **Program detail screens don't exist**: 5 programs are listed but tapping an unlocked program does nothing.

---

## Top 5 Architectural Inconsistencies

1. **Dual data layers**: Mental check-ins, exercise logs, course progress, and readiness live in AsyncStorage. Diagnostics, profiles, and subscriptions live in Supabase. No sync layer between them.
2. **Content in code, not in DB**: All drills, tools, exercises, course content, troubleshooting data are hardcoded TypeScript files. The `drills`, `vault_content`, `courses`, and `content_items` Supabase tables exist but are not read by the app.
3. **Multiple overlapping tool systems**: `mental-tools.ts` (13 categories, toolbox), `mental-vault-sections.ts` (11 sections, vault), `mental-tool-catalog.ts` (legacy), `mental-troubleshooting-issues.ts` — four different tool inventories with overlapping content.
4. **Legacy screens still routed**: `mental-profile-quiz.tsx`, `mental-struggles-quiz.tsx`, `placeholder.tsx`, `connect-coach.tsx` are reachable but serve no current purpose.
5. **Community pricing inconsistency**: Upgrade screen shows TRIPLE at $99.99/mo but community section shows "$120/mo" for the same tier.

---

## Top 5 Product Inconsistencies

1. **Journals appear in 3 places**: Mental Vault home (via toolbox), toolbox itself (as a category), and journals screen. User could be confused about where journals live.
2. **Meditations count mismatch**: `mental-vault-sections.ts` lists 5 meditations, `mental-tools.ts` lists 7, and the actual meditations screen has 7. The vault sections preview is stale.
3. **"Own the Cost" branding**: Dashboard links to `own-the-cost-home` and `own-the-cost-checkin` — this branding doesn't appear anywhere else in the user-facing app. It's a readiness check-in system with an internal codename that leaked into routes.
4. **At-bat tracking exists but is hidden**: Full at-bat logging (log-game, edit-at-bat, game-summary) exists in the hitting vault but is not prominently surfaced in the main hitting flow.
5. **Mobility vault gated behind strengthVault.useFull**: Mobility requires TRIPLE tier, same as full strength. Users who want mobility but not lifting cannot access it separately.

---

## Biggest Unfinished Areas

1. **Video content pipeline** — 0 of 156+ drill videos exist
2. **Program/Course detail screens** — 3 of 4 courses and 5 of 5 programs have no detail experience
3. **Cloud sync for local data** — exercise logs, course progress, check-ins, readiness all device-local only
4. **Stripe deployment** — edge functions written but not deployed, no webhook registered, no price IDs set
5. **Exit Velo & Speed add-on programs** — screens and data exist but integration is incomplete

---

## Most Production-Ready Areas

1. **Mental diagnostic → profile → daily work pipeline** — 60-question assessment → 6 archetypes → personalized daily prescriptions → check-in tracking → trend analysis. Fully wired end-to-end.
2. **Strength program generation engine** — 18 templates × 7-step customization pipeline → workout screen with weight logging and previous-weight display. Functional.
3. **Subscription tier system** — 6 tiers, 42 permissions, access gates on every screen, upgrade messaging per tier×permission. Only missing Stripe deployment.
4. **Hitting troubleshooting** — 6 categories → 20 topics → tagged drill recommendations → plan builder. Complete content, just needs videos.
5. **Authentication & role system** — Athlete/Coach/Parent roles with role-specific dashboards, parent-athlete linking, coach-athlete connections. Stable.

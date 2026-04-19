# OTC Athletics — Feature Inventory

## Legend
- **Built**: Functional, wired end-to-end
- **Partial**: Core exists but incomplete or missing pieces
- **Stub**: Screen/route exists but renders placeholder or does nothing
- **Dead**: Code present but unreachable or deprecated
- **Hidden**: Exists in code but not surfaced in any navigation

---

## 1. Authentication & Account

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Email/password login | Built | `(auth)/login.tsx` | Public | Supabase auth |
| Athlete registration | Built | `(auth)/register.tsx` | Public | |
| Coach registration | Built | `(auth)/register-coach.tsx` | Public | |
| Session persistence | Built | `src/store/auth.store.ts` | Auto | AsyncStorage-backed via Supabase |
| Role routing | Built | `(app)/_layout.tsx` | Auto | Athlete/Coach/Parent-specific tabs |
| Profile screen | Built | `(app)/profile/index.tsx` | Authenticated | Name, email, tier, settings |
| Sign out | Built | `(app)/profile/index.tsx` | Authenticated | Clears state, navigates to login |
| Dev tier override | Built | `(app)/profile/index.tsx` | Dev only | Dropdown to simulate any tier |
| Dev role override | Built | `src/lib/dev-role-override.ts` | Dev only | |

---

## 2. Hitting Vault

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Vault home | Built | `training/mechanical/index.tsx` | WALK+ (limited) | |
| Start Here guide | Built | `training/mechanical/start-here.tsx` | WALK+ | |
| Drill library | Built | `training/mechanical/hitting-library.tsx`, `[section].tsx` | SINGLE+ (full) | 94 drills in 12 sections |
| Drill detail | Built | `training/mechanical/[section].tsx` | SINGLE+ | Name, fixes, howTo, focus, video placeholder |
| Troubleshooting | Built | `training/mechanical/troubleshoot/` | SINGLE+ | 6 categories, 20 topics |
| Plan builder | Built | `training/mechanical/troubleshoot/plan-builder.tsx` | SINGLE+ | 7-day fix plans from tagged drills |
| Hitting diagnostics | Built | `training/mechanical/diagnostics.tsx` | WALK+ | Mover-type + mechanical quizzes |
| Mover type quiz | Built | `training/mechanical/mover-type-quiz.tsx` | WALK+ | |
| Mechanical quiz | Built | `training/mechanical/mechanical-diagnostic-quiz.tsx` | WALK+ | |
| At-bat tracking | Built | `training/mechanical/at-bat-home.tsx`, `log-game.tsx` | WALK+ | Log/edit at-bats, game summary |
| Hitting daily work | Built | `training/mechanical/daily-work.tsx` | WALK+ (limited) | |
| My Path (hitting) | Built | `training/mechanical/my-path.tsx` | WALK+ | |
| Fix My Problem | Built | `training/mechanical/fix-my-problem.tsx` | SINGLE+ | |
| Approach / velocity | Built | `training/mechanical/approach.tsx`, `velocity-approach.tsx` | SINGLE+ | |
| Drill videos | **Missing** | All `videoUrl: ''` in tagged-drills.ts | — | 0 of 156 videos exist |

---

## 3. Mental Vault

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Vault home | Built | `training/mental/index.tsx` | DOUBLE+ | 5 action cards |
| Diagnostics (3) | Built | `training/mental/diagnostics/` | DOUBLE+ | 60 Qs total, 6 archetypes |
| Profile summary | Built | `training/mental/profile-summary.tsx` | DOUBLE+ | Synthesized coach interpretation |
| Daily work | Built | `training/mental/daily-work.tsx` | DOUBLE+ | Archetype-driven prescriptions |
| Check-in | Built | `training/mental/mental-checkin.tsx` | DOUBLE+ | Confidence/focus/emotional 1-10 |
| Toolbox | Built | `training/mental/toolbox.tsx` | DOUBLE+ | 13 categories, 60+ structured tools |
| Tool detail | Built | `training/mental/tool-detail.tsx` | DOUBLE+ | Full tool pages |
| Journals | Built | `training/mental/journals.tsx` | DOUBLE+ | 9 journals with prompts |
| Meditations | Built | `training/mental/meditations.tsx` | DOUBLE+ | 7 guided sessions with timer |
| Troubleshooting | Built | `training/mental/troubleshooting.tsx` | DOUBLE+ | 10 problem cards |
| Progress/trends | Built | `training/mental/mental-progress.tsx` | DOUBLE+ | 6 lanes with trends |
| Lane detail | Built | `training/mental/lane-detail.tsx` | DOUBLE+ | Individual lane progression |
| 11-week course | Built | `training/mental/courses-list.tsx`, `course.tsx` | DOUBLE+ | Sequential unlock, full content |
| Skills list | Built | `training/mental/skills-list.tsx` | DOUBLE+ | |
| Skill detail | Built | `training/mental/skill-detail.tsx` | DOUBLE+ | |
| Dugout card | Built | `training/mental/dugout-card.tsx` | DOUBLE+ | Quick mental tips |
| Identity builder | Built | `training/mental/identity-builder.tsx` | DOUBLE+ | |
| Emergency reset | Built | `training/mental/emergency-reset.tsx` | DOUBLE+ | |
| 10-step reset | Built | `training/mental/ten-step-reset.tsx` | DOUBLE+ | |
| 10-second reset | Built | `training/mental/ten-second-reset.tsx` | DOUBLE+ | |
| Legacy profile quiz | Dead | `training/mental/mental-profile-quiz.tsx` | — | Replaced by diagnostics |
| Legacy struggles quiz | Dead | `training/mental/mental-struggles-quiz.tsx` | — | Replaced by troubleshooting |

---

## 4. Strength Vault (OTC-S)

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Vault home | Built | `training/sc/index.tsx` | TRIPLE+ | Execution-first landing |
| Workout screen | Built | `training/sc/workout.tsx` | TRIPLE+ | Weight logging, RPE, pain tracking |
| Training config | Built | `training/sc/training-config.tsx` | TRIPLE+ | Season/days/duration/goal/gym/limitations |
| Program generation | Built | `src/data/strength-program-engine.ts` | TRIPLE+ | 18 templates, 7-step pipeline |
| Lifting mover quiz | Built | `training/sc/lifting-mover-quiz.tsx` | TRIPLE+ | |
| Exercise log | Built | `src/features/strength/services/exerciseLog.ts` | TRIPLE+ | Previous weight display |
| Position select | Built | `training/sc/position-select.tsx` | TRIPLE+ | |
| Deficiency select | Built | `training/sc/deficiency-select.tsx` | TRIPLE+ | |
| Exercises | Built | `training/sc/exercises.tsx` | TRIPLE+ | |
| Fuel/nutrition | Built | `training/sc/fuel.tsx`, `fuel-section.tsx` | TRIPLE+ | |
| Progression engine | Built | `src/features/strength/services/progressionEngine.ts` | TRIPLE+ | Progress/hold/regress |
| Feedback loop | Built | `src/features/strength/services/feedbackLoop.ts` | TRIPLE+ | |
| PR window | Built | `src/features/strength/services/prWindow.ts` | TRIPLE+ | |
| Monthly report | Built | `training/sc/monthly-report.tsx` | TRIPLE+ | |
| Coach brain | Built | `training/sc/coach-brain.tsx` | TRIPLE+ | |
| Progress screen | Built | `training/sc/progress.tsx` | TRIPLE+ | |
| Philosophy | Built | `training/sc/philosophy.tsx` | TRIPLE+ | |
| My Path (strength) | Built | `training/sc/my-path.tsx` | TRIPLE+ | |
| Mobility vault | Built | `training/sc/mobility/` | TRIPLE+ | Library, categories, flows, movements |

---

## 5. Daily Work & Accountability

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Daily work hub | Built | `(app)/daily-work.tsx` | Tier-gated per item | 6 items |
| Own the Cost home | Built | `training/own-the-cost-home.tsx` | All | Readiness/accountability |
| Own the Cost check-in | Built | `training/own-the-cost-checkin.tsx` | All | Daily readiness gate |
| Own the Cost summary | Built | `training/own-the-cost-summary.tsx` | All | |
| Readiness hook | Built | `src/hooks/useReadiness.ts` | All | 1-per-day, 7-day history |
| Accountability hook | Built | `src/hooks/useAccountability.ts` | All | Streak, journal tracking |

---

## 6. Programs & Courses

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Programs list | Built | `(app)/training/index.tsx` | Tier-gated | 5 active programs |
| Courses list | Built | `(app)/training/index.tsx` | Purchase-gated | 4 active courses |
| Mental Mastery detail | Built | `training/mental/courses-list.tsx` + `course.tsx` | Purchase/$99 | 11 weeks, full content |
| Hitting Approach detail | **Stub** | Card only in training/index.tsx | $99 | No detail screen |
| Throwing & Arm Care detail | **Stub** | Card only | $99 | No detail screen |
| Strength & Speed detail | **Stub** | Card only | $99 | No detail screen |
| Program detail screens | **Stub** | Cards only | Tier-gated | No detail screen for any program |

---

## 7. Subscription & Payments

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Tier system (6 tiers) | Built | `src/features/billing/tierAccess.ts` | All | 42 permission keys |
| Access gate component | Built | `src/features/billing/AccessGate.tsx` | All | Lock overlay with CTA |
| useAccess hook | Built | `src/features/billing/useAccess.ts` | All | Bridges tier + trial |
| Upgrade screen | Built | `(app)/upgrade.tsx` | All | 6 tier cards with CTAs |
| Stripe checkout | Built | `src/features/billing/checkout.ts` | All | Calls edge function |
| Edge: checkout session | Built | `supabase/functions/create-checkout-session/` | Server | Not yet deployed |
| Edge: webhook | Built | `supabase/functions/stripe-webhook/` | Server | Not yet deployed |
| Subscription hook | Built | `src/features/billing/useSubscription.ts` | All | Realtime listener |
| Trial manager | Built | `src/features/billing/trialManager.ts` | WALK users | 7-day DOUBLE trial |
| Post-checkout success | Built | `(app)/upgrade-success.tsx` | Post-payment | Profile refresh + polling |

---

## 8. Community & Social

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Community hub | Built | `(app)/community/index.tsx` | All | Announcements, leaderboards |
| Leaderboards | Built | `(app)/community/[section].tsx` | All | 4 metrics, age-group filter |
| Announcements | Built | `(app)/announcements/` | All | CRUD, pinning |
| Messaging | Built | `(app)/messages/` | DOUBLE+ | Direct messaging |
| Community posts | Partial | `(app)/community/[section].tsx` | TRIPLE+ | Post creation, reactions |

---

## 9. Coach System

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Coach dashboard | Built | `(app)/coach/` | Coach role | |
| Roster management | Built | `coach/roster.tsx` | Coach | |
| Athlete detail | Built | `coach/athlete-detail.tsx` | Coach | |
| Program creation | Built | `coach/lifting-program.tsx`, `hitting-program.tsx` | Coach | |
| CSV import | Built | `coach/import-program.tsx`, `import-preview.tsx` | Coach | Full parser + validator |
| Assign programs | Built | `coach/assign-program.tsx` | Coach | |
| Video review | Built | `coach/video-review.tsx` | Coach | |

---

## 10. Parent System

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Parent dashboard | Built | `src/components/dashboard/ParentDashboard.tsx` | Parent role | |
| Invite parent | Built | `profile/invite-parent.tsx` | Athlete | |
| Redeem parent code | Built | `profile/redeem-parent-code.tsx` | Parent | |
| Read athlete data | Built | Multiple RLS policies | Parent | Read-only via links table |

---

## 11. Other Systems

| Feature | Status | Location | Access | Notes |
|---------|--------|----------|--------|-------|
| Playbook | Built | `(app)/playbook/` | All | Entries, videos, notes, journals |
| How It Works | Built | `(app)/how-it-works.tsx` | All | 7-step onboarding guide |
| My Path Levels | Built | `(app)/my-path-levels.tsx` | Tier-gated | 3-lane progression view |
| Notifications | Partial | `src/features/notifications/notificationManager.ts` | All | Types defined, scheduling built |
| Upload | Stub | `(app)/upload.tsx` | — | "Phase 2 implementation" |
| Performance Services | Hidden | `training/performance-services.tsx` | — | Unclear purpose |
| Skill Progress | Hidden | `training/skill-progress.tsx` | — | Skill tracking screen |
| Exit Velo program | Partial | `training/add-ons/exit-velo/` | — | Screens + data exist |
| Speed program | Partial | `training/add-ons/speed/` | — | Screens + data exist |

---

## 12. Recommendation Engines

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Mental recommendation | Built | `src/lib/recommendation/mentalRecommendationLayer.ts` | |
| Hitting recommendation | Built | `src/lib/recommendation/hittingRecommendationLayer.ts` | |
| Strength recommendation | Built | `src/lib/recommendation/strengthRecommendationLayer.ts` | |
| Drill recommendation | Built | `src/lib/recommendation/drillRecommendationEngine.ts` | |
| Dashboard insight | Built | `src/lib/dashboard/dashboardInsight.ts` | |

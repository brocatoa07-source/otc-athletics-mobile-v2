# OTC Athletics — Component & Folder Architecture

## Top-Level Structure

```
/
├── app.json                    — Expo config (scheme: otclab, bundle: com.otcathletics.v2)
├── schema.sql                  — Canonical DB schema (single source of truth)
├── package.json                — Dependencies (Expo 54, RN 0.81.5, React 19.1)
├── tsconfig.json
├── babel.config.js
├── .env / .env.example
├── supabase/
│   ├── migrations/ (13 files)
│   └── functions/ (2 edge functions)
└── src/
    ├── app/          — Expo Router file-based routing (~133 screen files)
    ├── assets/       — Icons, images
    ├── components/   — Shared UI components (~50 files)
    ├── constants/    — colors.ts (legacy compat layer)
    ├── data/         — Hardcoded content (~80+ files)
    ├── features/     — Domain logic modules (6 domains)
    ├── hooks/        — Custom React hooks (24 files)
    ├── lib/          — Infrastructure utilities (~20 files)
    ├── services/     — (empty or minimal)
    ├── store/        — Zustand stores (2 files)
    ├── theme/        — Theme tokens (1 file)
    ├── types/        — TypeScript types (3 files)
    └── utils/        — Utility functions (4 files)
```

---

## Component Organization

### `src/components/common/` (12 files)
- `Card.tsx`, `EmptyState.tsx`, `SectionHeader.tsx`, `SectionAccentBar.tsx`
- `IconGrid.tsx`, `IconTile.tsx`
- `UpgradeGate.tsx` — legacy (replaced by `AccessGate.tsx` in features/billing)
- `PRModal.tsx`
- `ContentPlaceholder.tsx`
- `TierBadge.tsx`, `TierPill.tsx`, `UpgradeDropdown.tsx`

### `src/components/dashboard/` (28 files)
Large number of dashboard card components, many potentially unused:
- **Active:** `ParentDashboard.tsx`, `TodayFocusCard.tsx`, `AnnouncementBanner.tsx`, `PRAlertBanner.tsx`, `ReadinessSummaryCard.tsx`, `StreakCard.tsx`, `PlaybookCard.tsx`
- **Potentially stale:** `AccountabilityScore.tsx`, `WeeklyChecklist.tsx`, `BlockIntelligenceStrip.tsx`, `RecentFeedbackCard.tsx`, `PerformanceTrendCard.tsx`, `IdentityStandardBanner.tsx`, `PhaseControlPanel.tsx`, `CurrentDevelopmentContext.tsx`, `ProgressionPanel.tsx`, `TodaysMissionHeader.tsx`, `DailyStandardsCard.tsx`, `DailyScoreCard.tsx`, `EngagementStrip.tsx`, `SkillBarsCard.tsx`, `NextPriorityCard.tsx`, `WeeklyChallengeCard.tsx`, `SkillFocusCard.tsx`, `RecentTrainingCard.tsx`, `TodaysTrainingCard.tsx`, `ActiveFocusBanner.tsx`, `AthleteIdentityCard.tsx`, `ProfileFocusCard.tsx`

**Risk:** 28 dashboard components but the actual dashboard only renders ~10 of them. The rest may be from earlier iterations.

### `src/components/training/` (4 files)
- `VaultDiagnosticsEntry.tsx`, `FuelCard.tsx`, `MentalProfileCard.tsx`, `ExpandableProfileCard.tsx`

### `src/components/coach/` (1 file)
- `ConnectCodeCard.tsx` — likely dead (coach code system removed)

### `src/components/community/` (1 file)
- `PostCard.tsx`

### `src/components/progress/` (2 files)
- `SparklineChart.tsx`, `MetricCard.tsx`

---

## Feature Modules

### `src/features/billing/` (9 files)
Clean, well-structured:
- `tierAccess.ts` — Central permission system
- `useAccess.ts` — React hook
- `AccessGate.tsx` — Lock overlay
- `TrialBanner.tsx` — Trial status display
- `trialManager.ts` — Trial state management
- `stripeConfig.ts` — Stripe config helpers
- `checkout.ts` — Checkout flow
- `useSubscription.ts` — Realtime subscription listener
- `debugAccess.ts` — Debug utilities

### `src/features/strength/` (30 files)
Most complex module:
- `config/` (11 files) — scoring, biases, mappings, metadata, overrides, progression
- `services/` (17 files) — profile building, block selection, feedback, progression, PR window
- `types/` (2 files) — TypeScript interfaces

### `src/features/mental/` (6 files)
- `mentalFocusEngine.ts` — Daily prescription generation
- `mentalProgression.ts` — Check-in logging, level-ups
- `mentalProgress.ts` — Trend computation, lane tracking
- `mentalProfileSummary.ts` — Profile synthesis
- `mentalTroubleshooting.ts` — Problem/solution data
- `mentalWeeklyReview.ts` — Weekly review logic

### `src/features/hitting/` (1 file)
- `hittingProgress.ts` — 9 hitting metrics, trend computation

### `src/features/content/` (2 files)
- `programsAndCourses.ts` — Programs/courses definitions + access logic
- `contentRegistry.ts` — Content registry helpers

### `src/features/notifications/` (1 file)
- `notificationManager.ts` — Push notification scheduling

---

## Data Layer (`src/data/`)

### By Domain

**Hitting (8 files):**
- `hitting-vault-sections.ts`, `hitting-drills.ts`, `tagged-drills.ts`
- `troubleshooting-engine.ts`, `hitting-mechanical-diagnostic-data.ts`
- `hitting-mover-type-data.ts`, `hitting-identity-data.ts`
- `hitting-practice-templates.ts`, `hitting-weekly-plans.ts`

**Mental (7 core + 11 course files):**
- `mental-diagnostics-data.ts`, `mental-tools.ts`, `mental-vault-sections.ts`
- `mental-profile-data.ts`, `mental-struggles-data.ts`, `mental-archetype-paths.ts`
- `mental-tool-catalog.ts`, `mental-troubleshooting-issues.ts`
- `course-registry.ts`, `course-types.ts`, `course-sections.ts`
- `awareness-course-data.ts` through `flow-state-course-data.ts`
- `skillsJournal.ts`, `advanced-skill-tracks.ts`, `skill-journal-prompts.ts`

**Strength (25+ files):**
- `strength-profile.ts`, `strength-program-engine.ts`, `strength-program-data.ts`
- `otcs-{static|spring|hybrid}-month-{1-6}.ts` (18 template files)
- `otcs-program.ts`, `otcs-types.ts`, `otcs-subs.ts`
- `karteria-month-{1-6}.ts` (6 legacy files), `karteria-program.ts`, `karteria-types.ts`, `karteria-subs.ts`
- `lifting-sections.ts`, `lifting-programs.ts`, `lifting-mover-type-data.ts`
- `session-blocks.ts`, `deficiency-engine.ts`, `injury-swap.ts`, `isometric-layer.ts`

**Mobility:**
- `mobility-vault/` — `types.ts`, `tags.ts`, `categories.ts`, `drills.ts`, `flows.ts`, `assignment-rules.ts`, `library.ts`

**Add-ons:**
- `exit-velo-program/` — `types.ts`, `product.ts`, `program.ts`, `progress.ts`, `index.ts`
- `speed-program/` — `types.ts`, `exercises.ts`, `product.ts`, `program.ts`, `progress.ts`, `index.ts`

**Nutrition:**
- `fuel-the-engine.ts`, `meal-prep-data.ts`, `nutrition-library.ts`, `ingredient-map.ts`

**Other:**
- `benchmarks.ts`, `college-fit-benchmarks.ts`, `college-fit-programs.ts`
- `recruiting-benchmarks.ts`, `recruiting-data.ts`, `recruiting-profile-data.ts`
- `dashboard-engine.ts`, `engagement-engine.ts`, `readiness-engine.ts`
- `accountability-engine.ts`, `next-priority-engine.ts`, `performance-trend.ts`
- `at-bat-accountability.ts`, `daily-work.ts`, `standard-status.ts`
- `mover-mlb-comparisons.ts`, `movement-library.ts`, `conditioning-catalog.ts`
- `own-the-cost-checkin.ts`, `skill-progress-engine.ts`, `week-program-engine.ts`
- `dev-map.ts`, `identity-data.ts`, `playbook.ts`

---

## Naming Inconsistencies

| Pattern | Examples | Issue |
|---------|----------|-------|
| Route naming | `mechanical/` (hitting), `sc/` (strength), `mental/` (mental) | `sc` is opaque — "strength coach" abbreviation not obvious |
| Color constants | `Colors.` (from constants), `colors.` (from theme), `accents.` (from theme) | 3 different color import paths |
| Diagnostic type names | `mover-type` vs `lifting-mover` vs `mechanical` | Inconsistent hyphenation and naming |
| Storage key prefixes | `otc:` (most), `@otc_` (dev overrides), none (`movement-archetype`) | Mixed conventions |

---

## Dead or Likely-Unused Files

| File | Evidence |
|------|----------|
| `src/data/karteria-*.ts` (10 files) | Legacy program format, replaced by `otcs-*` |
| `src/components/coach/ConnectCodeCard.tsx` | Coach code system removed |
| `src/app/(app)/training/placeholder.tsx` | Placeholder screen |
| `src/app/(app)/training/mental/mental-profile-quiz.tsx` | Replaced by diagnostics |
| `src/app/(app)/training/mental/mental-struggles-quiz.tsx` | Replaced by troubleshooting |
| `src/data/mental-tool-catalog.ts` | Replaced by `mental-tools.ts` |
| `src/data/mental-struggles-data.ts` | Replaced by `mentalTroubleshooting.ts` |
| `src/data/mental-profile-data.ts` | Replaced by `mental-diagnostics-data.ts` |
| `src/components/common/UpgradeGate.tsx` | Replaced by `features/billing/AccessGate.tsx` |
| `src/app/(app)/profile/connect-coach.tsx` | Coach code system removed |
| Many `src/components/dashboard/*.tsx` files | ~18 of 28 may be unused |

---

## Architectural Strengths

1. **Feature module isolation** — billing, mental, strength have clean boundaries
2. **Consistent gating pattern** — `useAccess()` + `hasAccess(key)` used everywhere
3. **Typed data models** — TypeScript interfaces for all major data structures
4. **File-based routing** — Expo Router gives clear screen inventory
5. **Separation of content from logic** — data files separate from rendering

## Architectural Weaknesses

1. **Content in code** — 80+ TypeScript data files instead of a CMS or database-driven content
2. **AsyncStorage overload** — 50+ keys holding critical state with no sync layer
3. **Dashboard component bloat** — 28 components for a screen that uses ~10
4. **Legacy code retention** — 10+ karteria files, 5+ dead data files, 3+ dead screens
5. **Overlapping tool inventories** — `mental-tools.ts` vs `mental-vault-sections.ts` vs `mental-tool-catalog.ts`

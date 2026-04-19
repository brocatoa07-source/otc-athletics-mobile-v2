# OTC Athletics — Content Inventory

## Content Storage Model

All athlete-facing content is **hardcoded in TypeScript files**. Supabase tables (`drills`, `vault_content`, `courses`, `content_items`) exist in the schema but are **not read by the app** for content delivery. The app uses them only for access control metadata.

---

## 1. Hitting Drills

### Vault Sections (`src/data/hitting-vault-sections.ts`)
| Section | Drills | Free Count |
|---------|--------|------------|
| High Tee Foundation | 17 | 3 |
| Timing | 8 | 2 |
| Forward Move | 5 | 2 |
| Posture & Direction | 7 | 2 |
| Barrel Turn | 5 | 2 |
| Connection | 5 | 2 |
| Extension | 5 | 2 |
| Adjustability | 7 | 2 |
| Approach | 8 | 2 |
| Machine Training | 8 | 2 |
| Competition | 8 | 2 |
| Troubleshooting | 0 | 0 (placeholder) |
| **Total** | **83** | **23 free** |

Each drill: `name`, `fixes`, `howTo`, `focus`, `progression`, `equipment`, `videoUrl`, `whenToUse`, `commonMistake`, `setsReps`

### Tagged Drills (`src/data/tagged-drills.ts`)
- **156 total drills** with topic-based tagging
- Each has: `id`, `name`, `shortDescription`, `whatItFixes`, `focusCue`, `drillType`, `topicIds[]`, `videoUrl`
- **Video status: ALL 156 have `videoUrl: ''` — zero videos populated**

### Troubleshooting (`src/data/troubleshooting-engine.ts`)
- 6 categories, 20 topics
- Each topic: `id`, `label`, `description`, `cues[]`, `drillNames[]`
- **16 of 20 topics have `cues: []` (empty)**

---

## 2. Mental Tools

### Toolbox Categories (`src/data/mental-tools.ts`)
| # | Category | Items | Structured Tools | Route |
|---|----------|-------|-----------------|-------|
| 1 | Stress & Anxiety | 14 | 13 | — |
| 2 | Pressure | 8 | 8 | — |
| 3 | Fear | varies | 7 | — |
| 4 | At-Bat Reset | varies | 5 | — |
| 5 | Visualization Protocol | varies | 5 | — |
| 6 | Confidence | varies | 5 | — |
| 7 | Focus | varies | 5 | — |
| 8 | Emotional Control | varies | 5 | — |
| 9 | Self-Talk | varies | 5 | — |
| 10 | Routines | varies | 5 | — |
| 11 | Journals | 9 | — | `/(app)/training/mental/journals` |
| 12 | Guided Meditations | 7 | — | `/(app)/training/mental/meditations` |

**Total structured tools: ~63**

Each `StructuredTool`: `id`, `name`, `tagline`, `whatIs`, `whyItWorks`, `howToUse[]`, `bestTime`, `cue?`, `difficulty`, `timeRequired`, `toolType`, `bestUsed[]`, `quickTool`

### Vault Sections (`src/data/mental-vault-sections.ts`)
11 sections × 5 tools each = **55 vault tools**
Each tool: `name`, `fixes`, `howTo`, `focus`

**Note:** This is a SEPARATE content set from `mental-tools.ts`. Both exist, with overlapping but not identical content. The toolbox uses `mental-tools.ts`. The vault sections are used by `[section].tsx` but that route is less prominently surfaced.

---

## 3. Journals

**Source:** `src/app/(app)/training/mental/journals.tsx` — `STANDARD_JOURNALS` array

| # | Key | Label |
|---|-----|-------|
| 1 | daily | Daily Reflection |
| 2 | pregame | Pre-Game Reflection |
| 3 | game_day | Post-Game Reflection |
| 4 | weekly | Weekly Reflection |
| 5 | confidence | Confidence Journal |
| 6 | self_talk | Self-Talk Journal |
| 7 | pressure | Pressure Journal |
| 8 | mistake_recovery | Mistake Recovery Journal |
| 9 | gratitude | Gratitude Journal |

Each journal has: `key`, `label`, `icon`, `color`, `desc`, `prompts[]`
Saved to: AsyncStorage per journal key + date

---

## 4. Guided Meditations

**Source:** `src/app/(app)/training/mental/meditations.tsx` — `MEDITATIONS` array

| # | Key | Title | Duration |
|---|-----|-------|----------|
| 1 | pregame-focus | Pre-Game Focus | 5 min |
| 2 | anxiety-release | Calm the Nerves | 3 min |
| 3 | confidence-builder | Confidence Builder | 4 min |
| 4 | post-game-reset | Post-Game Reset | 5 min |
| 5 | breathwork | Box Breathing | 3 min |
| 6 | sleep | Pre-Sleep Wind Down | 5 min |
| 7 | body-scan | Full Body Scan | 5 min |

Each meditation: `key`, `title`, `subtitle`, `icon`, `color`, `totalMin`, `when`, `steps[{ instruction, duration }]`

**Audio/video:** None — all text-based step-by-step with timers.

---

## 5. Mental Mastery Course

**Source:** `src/data/course-registry.ts` + 11 individual data files

| Week | Skill | Shadow Pattern |
|------|-------|----------------|
| 1 | Awareness | Autopilot |
| 2 | Confidence | Perfectionism / Fear of Failure |
| 3 | Focus | Distraction / Outcome Obsession |
| 4 | Emotional Control | Overreaction / Suppression |
| 5 | Resilience | Victim Mindset / Avoidance |
| 6 | Accountability | Excuses / Blame |
| 7 | Communication | Assumptions / Poor Listening |
| 8 | Presence | Anxiety / Rumination |
| 9 | Composure | Frustration / Ego |
| 10 | Leadership | Self-Centeredness / Inconsistency |
| 11 | Flow State | Over-Control / Tension |

Each week has: `title`, `quote`, `objective`, `lesson`, `tool`, `meditation`, `journalPrompt`, `weeklyChallenge`, `reflection`, `outline[]` (8 segments), `coachScience`, `questions[]`

---

## 6. Strength Programming

**Templates:** 18 pre-authored month templates (3 archetypes × 6 months)
- `src/data/otcs-static-month-{1-6}.ts`
- `src/data/otcs-spring-month-{1-6}.ts`
- `src/data/otcs-hybrid-month-{1-6}.ts`

**Legacy templates (Karteria):**
- `src/data/karteria-month-{1-6}.ts` — older program format
- `src/data/karteria-program.ts`, `karteria-types.ts`, `karteria-subs.ts`

**Exercise Metadata:** 100+ exercises in `src/features/strength/config/exerciseMetadataRegistry.ts`

**Mobility Vault:**
- `src/data/mobility-vault/` — categories, drills, flows, tags, library, assignment rules
- Separate structured content system with typed data

---

## 7. Nutrition / Fuel

**Source:** `src/data/fuel-the-engine.ts`, `meal-prep-data.ts`, `nutrition-library.ts`, `ingredient-map.ts`

- Fuel sections accessible from `training/sc/fuel.tsx`
- Nutrition library and meal prep content exist in data files
- Hardcoded content

---

## 8. Other Content

### Hit practice templates
- `src/data/hitting-practice-templates.ts`
- `src/data/hitting-weekly-plans.ts`

### Recruiting
- `src/data/recruiting-benchmarks.ts`
- `src/data/recruiting-data.ts`
- `src/data/recruiting-profile-data.ts`

### College fit
- `src/data/college-fit-benchmarks.ts`
- `src/data/college-fit-programs.ts`

### Performance benchmarks
- `src/data/benchmarks.ts`

### Add-on programs
- `src/data/exit-velo-program/` — 5 files (types, product, program, progress, index)
- `src/data/speed-program/` — 6 files (types, exercises, product, program, progress, index)

---

## Content Visibility Matrix

| Content | In Code | Visible in App | Video/Media |
|---------|---------|----------------|-------------|
| Hitting drills (156) | Yes | Yes (vault + troubleshoot) | **None** |
| Mental tools (63 structured) | Yes | Yes (toolbox) | None |
| Mental vault sections (55) | Yes | Partial (via [section] route) | None |
| Journals (9) | Yes | Yes | N/A |
| Meditations (7) | Yes | Yes (text-based timer) | No audio |
| Course (11 weeks) | Yes | Yes | None |
| Strength templates (18) | Yes | Yes (generated programs) | None |
| Mobility vault drills | Yes | Yes | None |
| Nutrition/fuel content | Yes | Yes | None |
| Recruiting data | Yes | **Not surfaced in current nav** | N/A |
| College fit data | Yes | **Not surfaced in current nav** | N/A |
| Exit velo program | Yes | Partial (add-ons section) | None |
| Speed program | Yes | Partial (add-ons section) | None |
| Karteria programs | Yes | **Dead** — old format, not rendered | None |

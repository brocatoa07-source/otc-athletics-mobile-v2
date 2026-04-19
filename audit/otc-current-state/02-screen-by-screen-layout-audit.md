# OTC Athletics — Screen-by-Screen Layout Audit

This document covers key screens. For the full route tree, see `01-app-map.md`.

---

## Auth Screens

### Login (`(auth)/login.tsx`)
- Title: "OTC Athletics"
- Email input + password input
- "Sign In" button (loading state)
- "Sign Up" link → register, "Coach Sign Up" link → register-coach

### Register (`(auth)/register.tsx`)
- Full name, email, password fields
- Account creation via Supabase auth
- Redirects to dashboard on success

### Register Coach (`(auth)/register-coach.tsx`)
- Same as register with coach-specific flow

---

## Dashboard (`(app)/dashboard/index.tsx`)

**Top → Bottom:**
1. Header: greeting + first name + avatar (→ profile) + tier badge
2. Trial banner (conditional)
3. Announcement banner (conditional)
4. Coaching message card: title, icon, color from progression + inline pills (streak, readiness, compliance)
5. PR Window alert (conditional, amber)
6. Behavior notifications (top 2, color-coded)
7. "Daily Work" CTA button (green)
8. 4 Pillar cards: Hitting, Strength, Mental, Accountability (with lock icons)
9. Quick access: Playbook, Profile
10. Coach Hub button (coach only)
11. Dev Logout (dev only)

**Dependencies:** `useTier`, `useAccess`, `useAccountability`, progression snapshot, workout streak, PR window, behavior notifications

---

## Train Hub (`(app)/training/index.tsx`)

**Top → Bottom:**
1. Header: "Train" / "Vaults, Programs & Courses"
2. Daily Work card (green flash icon)
3. VAULTS section label
4. 4 vault cards: Hitting, Strength, Mental, Mobility (with lock badges)
5. Playbook sub-card (nested under Mobility)
6. PROGRAMS section label + "Included in your membership"
7. 5 program cards (tier-locked): Strength, Speed, Arm Care, Bat Speed, Mobility
8. COURSES section label + "Premium educational programs"
9. 4 course cards (purchase-locked at $99): Mental Mastery, Hitting Approach, Throwing & Arm Care, Strength & Speed

**Dependencies:** `useAccess`, `programsAndCourses`, `canUserAccessContent`

---

## Daily Work (`(app)/daily-work.tsx`)

**Top → Bottom:**
1. Header: "TODAY" / "Daily Work"
2. Status bar with progression message + readiness/streak pills (conditional)
3. PR Window alert (conditional)
4. Behavior notification (1 max)
5. 6 work items (tier-gated):
   - Movement Prep → mobility category
   - Lifting → workout screen
   - Recovery → yoga flow
   - Hitting → hitting daily work
   - Mental → mental daily work
   - Daily Check-In → own-the-cost-checkin

**Dependencies:** `useAccess`, progression decision, workout streak, PR window, behavior notifications

---

## Hitting Vault Home (`training/mechanical/index.tsx`)

**Top → Bottom:**
1. Header: "HITTING" / "Hitting Vault"
2. Start Here card
3. Vault section cards (12 sections, each showing drill count)
4. Troubleshooting card
5. Diagnostics card
6. At-Bat Tracking card

**Dependencies:** `useTier`, hitting vault sections data

---

## Mental Vault Home (`training/mental/index.tsx`)

**States:**
- **Walk tier:** Lock icon + "Mental System Locked" + upgrade CTA
- **Diagnostics incomplete:** Clipboard icon + "Complete Your Mental Assessment" + start CTA
- **Active (all done):**

**Top → Bottom (active):**
1. Header: "MENTAL" / "Mental Vault" + diagnostics button
2. My Mental Profile card → profile-summary
3. Today's Mental Work card (primary): tool, reflection, reset reps, routine cue, journal + "Start Today's Work" button
4. Log Mental Check-In card (with checkmark if done today)
5. Troubleshoot My Mind card
6. Mental Tools card

**Dependencies:** `useTier`, `useGating`, `useMentalProfile`, `computeMentalFocus`, `generateMentalDailyWork`, `getTodayCheckIn`

---

## Strength Vault Home (`training/sc/index.tsx`)

**Execution-first landing:**
1. Header: "OTC-S" / "Strength Vault"
2. Today's workout card (primary CTA)
3. Exercise list
4. Quick links: progress, fuel, philosophy, diagnostics

**Dependencies:** `useTier`, `useStrengthProfile`, strength program engine

---

## Workout Screen (`training/sc/workout.tsx`)

**Top → Bottom:**
1. Header: session info (month, week, day type)
2. Exercise list with:
   - Exercise name + sets × reps
   - Weight inputs per set (TextInput)
   - "Last: X lbs × Y" previous weight display
   - RPE slider (1-5)
   - Pain tracking checkbox
3. Complete session button
4. Session log saving

**Dependencies:** `exerciseLog.ts`, `getNextWorkout`, strength progress, daily gating (one lift per day)

---

## Profile Summary (`training/mental/profile-summary.tsx`)

**States:**
- **Incomplete (1-2 diagnostics):** "Profile Incomplete" + partial results + CTA to continue
- **Complete:**

**Top → Bottom (complete):**
1. Header: "MENTAL VAULT" / "My Mental Profile"
2. Hero card: headline (archetype + identity + habits)
3. Coach Read card (italicized interpretation)
4. Score chips row: Archetype, ISS, HSS (color-coded)
5. STRENGTHS section (3 green bullet rows)
6. WATCH-OUTS section (3 amber bullet rows)
7. DEVELOPMENT PRIORITIES (2-3 numbered cards with source tags)
8. RECOMMENDED FOR YOU:
   - Toolbox categories → toolbox
   - Journal → journals?type={key} (deep-link)
   - Meditation → meditations?key={key} (deep-link)
   - Course week → course?id={weekId} (deep-link)
9. NEXT ACTIONS (3 action rows)
10. "View Individual Diagnostic Results" link

**Dependencies:** `useMentalProfile`, `synthesizeProfile`

---

## Upgrade Screen (`(app)/upgrade.tsx`)

**Top → Bottom:**
1. Header: "Membership"
2. "Pick Your Base." headline
3. Current tier badge
4. 6 tier cards (WALK → GRAND SLAM), each with:
   - Name, transformation, tagline
   - Price + period
   - Feature bullets (5-6 per tier)
   - CTA: current plan / included / upgrade button / "Apply Now"
5. Checkout loading state on button press

**Dependencies:** `useTier`, `useSubscription`, `startCheckout`

---

## Community Hub (`(app)/community/index.tsx`)

**Top → Bottom:**
1. Header: "Community" + "View Only" badge (WALK tier)
2. Announcements card (with count badge)
3. Leaderboards card
4. Messages card (conditional, DOUBLE+ only)
5. Upgrade hint (WALK tier only)

**Dependencies:** `useTier`, announcements count query

---

## Profile Screen (`(app)/profile/index.tsx`)

**Top → Bottom:**
1. Header: "Profile"
2. Avatar circle + name + email + tier badge
3. Stats: sport, position, age (if available)
4. Upgrade dropdown (non-coach)
5. Menu: Activity, Parent Access, Coach Hub (role-dependent)
6. Sign Out button (with confirmation)
7. Version: "OTC Lab v2.0.0"
8. Dev tier override (dev only)

---

## Key Patterns Across Screens

- **Consistent gating:** Every vault/feature checks `useAccess()` and shows lock icons + upgrade CTAs
- **Conditional rendering:** Most screens have 2-3 states (locked, incomplete, active)
- **Loading states:** Spinners during async operations
- **Empty states:** Handled explicitly when data is missing
- **Navigation:** Mix of `router.push()` for stacks and `router.replace()` for replacements

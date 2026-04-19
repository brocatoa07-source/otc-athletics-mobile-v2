# OTC Athletics — App Map

## Tab Structure

4 visible tabs (athlete view) + hidden stack routes:

```
(app)/_layout.tsx — Tabs
├── Home (dashboard/index.tsx)      — Coach: coach/_layout.tsx
├── Train (training/index.tsx)      — Athletes only
├── Progress (progress/_layout.tsx) — Athletes only
└── Community (community/_layout.tsx) — All roles
```

Parents see: Home (ParentDashboard) + Updates (community).
Coaches see: Home (coach hub) + Community.

---

## Full Route Tree

### Auth (unauthenticated)
```
(auth)/_layout.tsx
├── login.tsx
├── register.tsx
└── register-coach.tsx
```

### App (authenticated)

#### Dashboard
```
(app)/dashboard/_layout.tsx
└── index.tsx ← Athlete/Parent home
```

#### Coach
```
(app)/coach/_layout.tsx
├── programs.tsx
├── roster.tsx
├── athlete-detail.tsx
├── lifting-program.tsx
├── hitting-program.tsx
├── assign-program.tsx
├── import-program.tsx
├── import-preview.tsx
└── video-review.tsx
```

#### Training (Train tab)
```
(app)/training/_layout.tsx
├── index.tsx ← Train hub
├── placeholder.tsx
├── performance-services.tsx
├── skill-progress.tsx
├── own-the-cost-home.tsx
├── own-the-cost-checkin.tsx
├── own-the-cost-summary.tsx
│
├── mechanical/ (Hitting Vault — 26 files)
│   ├── index.tsx
│   ├── start-here.tsx
│   ├── where-to-start.tsx
│   ├── diagnostics.tsx
│   ├── mechanical-diagnostic-quiz.tsx
│   ├── mover-type-quiz.tsx
│   ├── hitting-library.tsx
│   ├── [section].tsx
│   ├── daily-work.tsx
│   ├── approach.tsx
│   ├── velocity-approach.tsx
│   ├── fix-my-problem.tsx
│   ├── my-path.tsx
│   ├── at-bat-home.tsx
│   ├── log-game.tsx
│   ├── edit-at-bat.tsx
│   ├── game-summary.tsx
│   └── troubleshoot/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── category.tsx
│       ├── topic.tsx
│       ├── plan-builder.tsx
│       ├── posture.tsx
│       ├── contact.tsx
│       └── history.tsx
│
├── mental/ (Mental Vault — 27+ files)
│   ├── index.tsx ← Mental Vault home
│   ├── profile-summary.tsx
│   ├── toolbox.tsx
│   ├── tool-detail.tsx
│   ├── journals.tsx
│   ├── meditations.tsx
│   ├── courses-list.tsx
│   ├── course.tsx
│   ├── daily-work.tsx
│   ├── mental-checkin.tsx
│   ├── mental-progress.tsx
│   ├── lane-detail.tsx
│   ├── troubleshooting.tsx
│   ├── skills-list.tsx
│   ├── skill-detail.tsx
│   ├── dugout-card.tsx
│   ├── identity-builder.tsx
│   ├── my-path.tsx
│   ├── mental-profile-quiz.tsx ← legacy
│   ├── mental-struggles-quiz.tsx ← legacy
│   ├── ten-step-reset.tsx
│   ├── ten-second-reset.tsx
│   ├── emergency-reset.tsx
│   ├── [section].tsx
│   └── diagnostics/
│       ├── entry.tsx
│       ├── quiz.tsx
│       └── results.tsx
│
├── sc/ (Strength Vault — 21 files)
│   ├── index.tsx
│   ├── workout.tsx
│   ├── training-config.tsx
│   ├── diagnostics.tsx
│   ├── lifting-mover-quiz.tsx
│   ├── exercises.tsx
│   ├── fuel.tsx
│   ├── fuel-section.tsx
│   ├── progress.tsx
│   ├── monthly-report.tsx
│   ├── coach-brain.tsx
│   ├── philosophy.tsx
│   ├── my-path.tsx
│   ├── position-select.tsx
│   ├── deficiency-select.tsx
│   └── mobility/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── library.tsx
│       ├── category.tsx
│       ├── movement.tsx
│       └── [flow].tsx
│
└── add-ons/ (Exit Velo + Speed programs)
    ├── _layout.tsx
    ├── index.tsx
    ├── exit-velo/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── week.tsx
    │   ├── workout.tsx
    │   └── testing.tsx
    └── speed/
        ├── _layout.tsx
        ├── index.tsx
        ├── week.tsx
        ├── workout.tsx
        └── testing.tsx
```

#### Community
```
(app)/community/_layout.tsx
├── index.tsx ← Community hub
└── [section].tsx ← announcements, leaderboards, challenges
```

#### Announcements
```
(app)/announcements/_layout.tsx
├── index.tsx
├── [id].tsx
└── create.tsx
```

#### Messages
```
(app)/messages/_layout.tsx
├── index.tsx
└── [conversationId].tsx
```

#### Profile
```
(app)/profile/_layout.tsx
├── index.tsx
├── activity.tsx
├── leaderboard.tsx
├── connect-coach.tsx ← likely dead
├── invite-parent.tsx
├── redeem-parent-code.tsx
└── athlete-identity.tsx
```

#### Progress
```
(app)/progress/_layout.tsx
├── entry.tsx
└── snapshot.tsx
```

#### Playbook
```
(app)/playbook/_layout.tsx
├── index.tsx
├── entry-detail.tsx
├── video-detail.tsx
├── new-entry.tsx
├── new-video.tsx
├── new-note.tsx
└── new-journal.tsx
```

#### Top-Level Screens (hidden from tabs)
```
(app)/daily-work.tsx
(app)/upgrade.tsx
(app)/upgrade-success.tsx
(app)/upload.tsx ← stub
(app)/how-it-works.tsx
(app)/my-path-levels.tsx
```

---

## User Flows

### New User (Athlete)
1. `(auth)/register` → create account
2. Redirected to `(app)/dashboard` → sees empty state
3. Tier = WALK → most vaults locked
4. Can: view hitting vault preview, take hitting diagnostics, view community
5. Upgrade CTA → `(app)/upgrade` → Stripe checkout

### Existing Athlete (DOUBLE tier, diagnostics done)
1. `(app)/dashboard` → coaching message, daily work CTA, 4 pillars
2. `(app)/daily-work` → 6 daily items (movement prep, lifting, recovery, hitting, mental, check-in)
3. `(app)/training` → vaults, programs, courses
4. `(app)/training/mental` → profile summary, daily work, check-in, toolbox
5. `(app)/training/mechanical` → drill library, troubleshooting, at-bat tracking
6. `(app)/training/sc` → workout, exercises, progress

### Coach
1. `(auth)/register-coach` → create coach account
2. `(app)/coach` → roster, programs, athlete detail, video review
3. Can assign programs, import CSV, manage athletes

### Parent
1. `(auth)/register` + parent role → or redeem parent invite code
2. `(app)/dashboard` → ParentDashboard (linked athlete data)
3. Read-only access to linked athlete's training data

---

## Deep Links

- `otclab://upgrade-success` — Post-Stripe checkout landing
- `otclab://upgrade` — Stripe cancel redirect
- Journal deep-link: `/(app)/training/mental/journals?type={key}`
- Meditation deep-link: `/(app)/training/mental/meditations?key={key}`
- Course week deep-link: `/(app)/training/mental/course?id={weekId}`
- Toolbox tool detail: `/(app)/training/mental/tool-detail?catIdx={n}&toolId={id}`

---

## Total Route Count

| Area | Screen Files |
|------|-------------|
| Auth | 3 |
| Dashboard | 1 |
| Coach | 9 |
| Training hub | 7 |
| Hitting (mechanical) | 26 |
| Mental | 27+ |
| Strength (sc) | 21 |
| Add-ons | 11 |
| Community | 2 |
| Announcements | 3 |
| Messages | 2 |
| Profile | 7 |
| Progress | 2 |
| Playbook | 6 |
| Top-level | 6 |
| **Total** | **~133 screen files** |

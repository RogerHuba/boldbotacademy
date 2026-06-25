# BoldBot Academy

A 72-hour onboarding LMS for BoldBot students. The site intentionally gates content so a new student finishes Day 3 with **one approved bot deployed on micro contracts on one account** — no overwhelm, no shortcuts.

Stack: **Next.js 15 (App Router) + React 19 + Supabase (Postgres / Auth / Storage / RLS) + Tailwind v3 + shadcn primitives**.

---

## Quickstart

```bash
pnpm install
cp .env.example .env.local           # fill in Supabase URL + keys
pnpm supabase start                  # local Postgres + Storage
pnpm db:push                         # apply migrations
psql "$DATABASE_URL" -f supabase/seed.sql
pnpm dev                             # http://localhost:3000
```

**Public signup is disabled** — accounts are issued by admins only (post-purchase flow lives outside the app for now). To bootstrap the first admin:

1. Open Supabase Studio (local: http://127.0.0.1:54323) → Authentication → Users → **Add user** → enter your email + password, check "Auto-confirm".
2. In the SQL editor:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Log in at `/login`. From `/admin/students` you can create all subsequent accounts via the **Invite a student** form — it generates a temp password to share with the student out-of-band.

Also disable signups at the Supabase project level (defense in depth): Dashboard → Authentication → Providers → Email → uncheck **Enable signups**. (For local dev, set `[auth] enable_signup = false` in `supabase/config.toml` after running `supabase init`.)

---

## Required env vars

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # server-only; used by admin client
```

---

## How the app is organized

```
app/
  (marketing)/              public landing + auth
  (app)/                    auth-required student app (sidebar layout)
    dashboard/
    day-0..day-3/           lessons, quizzes, validations
    certification/
    resources/  support/  profile/  progress/
  (admin)/admin/            review queue + student list
components/
  layout/  lesson/  quiz/  interactive/  gamification/  admin/
content/                    source-of-truth lesson/quiz/checklist data
  days.ts  lessons.ts  quizzes.ts (server-only) ...
lib/
  progress.ts               getStudentState — single source of truth
  gating.ts                 requireStudent / requireAdmin / requireUnlockedDay
  actions/                  server actions (quiz, lessons, uploads)
  supabase/                 client.ts / server.ts / admin.ts
supabase/
  migrations/0001_init.sql  schema + RLS + triggers
  seed.sql
```

### The "no overwhelm" mechanic

All gating happens server-side. A student lands on a Day route, and the page calls `requireUnlockedDay()` which reads `getStudentState()`. The unlock formula:

```
day_0           → always
day_1           → day-0.quiz passed
day_1_setup     → day-1.quiz passed
day_2           → day_1_setup validation == approved
day_3           → day_2 validation == approved
certification   → all quizzes passed + both validations approved + deployment-sim checklist complete
```

The sidebar reads the same state and shows 🔒 for locked items. **Never trusts the client.**

---

## Content workflow

Lessons, quizzes, checklists, validation slots, badges, and resources live in `/content/*.ts`. Staff edit those via PR — no migrations or DB writes needed when content changes.

Quiz answer keys live in `content/quizzes.ts` which imports `"server-only"`. They are never sent to the browser; the client only gets question text + option labels via `getQuizForClient()`.

---

## Screenshot validation

- **Day 1 Setup** requires 3 screenshots: VPS setup, NinjaTrader setup, workspace setup.
- **Day 2** requires 7: VPS connected, NT connected, chart, correct account, correct contract, bot enabled, max profit trigger.

Students upload through `ScreenshotUpload` → file goes to Supabase Storage bucket `screenshots/{userId}/{day}/{slot}-{uuid}.png` → row inserted into `validation_submissions`. Storage RLS requires the path prefix to match `auth.uid()`.

Admins review at `/admin` → pick a submission → see all slots side-by-side with signed URLs → approve or mark "needs correction" with a note. The unlock cascades automatically the next time the student loads any page (RSC recomputes `getStudentState`).

---

## Certification

When all criteria are met, `app/(app)/certification/page.tsx` calls `issueCertification()` server action — generates a `BB-2026-XXXXX` cert number, awards the `72_hour_certified` badge, and renders `CertificateCard`. Students "save as PDF" via the browser print dialog (the `PrintButton` component just calls `window.print()`).

---

## Verification plan

End-to-end smoke (manual, ~10 min):

1. Sign up → land on Dashboard → only Day 0 unlocked in sidebar.
2. Complete Day 0 lessons → Day 0 Quiz available → score 60% → Day 1 still locked.
3. Retake → score 100% → "First Quiz Passed" toast → Day 1 unlocks.
4. Walk Day 1 lessons → Risk Calculator computes correctly for MES 8-tick stop (= $10).
5. Pass Day 1 Quiz → Day 1 Setup unlocks → upload 3 screenshots → status = Pending.
6. Switch to admin → `/admin` shows the submission → approve all → student unlocks Day 2.
7. Play Manual Trading Sim → submit 7 Day-2 screenshots.
8. Admin marks one "Needs Correction" with a note → student re-uploads → admin approves.
9. Complete Day 3 deployment-sim checklist → Certification unlocks → print to PDF.
10. Confirm mobile drawer nav at 375px width.

RLS sanity:

```sql
-- as student A
select * from lesson_progress where user_id = '<student-B-uuid>';   -- expect 0 rows
update validation_submissions set status = 'approved' where id = '...';  -- expect denied
```

---

## What's stubbed in the prototype

- **Video**: YouTube unlisted embeds via `<VideoPlayer videoId="...">`. Swap to Mux later by changing one component.
- **Email**: Resend env wired but not sent — `// TODO Resend` in `lib/actions/uploads.ts`.
- **Streak cron**: tick function exists in `lib/streak.ts`; deploy via Supabase scheduled function.
- **Zoom / Slack**: external link-outs only.
- **Search on Resources**: client-side filter on the seeded list. Swap for Algolia later if the catalog grows.

---

## Scripts

```
pnpm dev          start the Next dev server
pnpm build        production build
pnpm typecheck    tsc --noEmit
pnpm lint         next lint
pnpm db:push      apply Supabase migrations
pnpm db:reset     wipe + re-apply (DESTRUCTIVE)
```

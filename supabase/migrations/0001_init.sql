-- BoldBot Academy initial schema
-- Run: pnpm supabase db push

create extension if not exists "pgcrypto";

-- ENUMS
do $$ begin
  create type user_role as enum ('student', 'admin', 'staff');
exception when duplicate_object then null; end $$;

do $$ begin
  create type validation_status as enum ('not_submitted', 'pending', 'approved', 'needs_correction');
exception when duplicate_object then null; end $$;

do $$ begin
  create type day_key as enum ('day_0', 'day_1', 'day_1_setup', 'day_2', 'day_3');
exception when duplicate_object then null; end $$;

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'student',
  avatar_url text,
  timezone text default 'America/New_York',
  created_at timestamptz default now(),
  last_active_at timestamptz default now()
);

-- LESSON PROGRESS
create table if not exists public.lesson_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  completed_at timestamptz default now(),
  video_watched_pct int default 0,
  primary key (user_id, lesson_slug)
);

-- CHECKLIST STATE
create table if not exists public.checklist_state (
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  item_key text not null,
  checked boolean default false,
  updated_at timestamptz default now(),
  primary key (user_id, lesson_slug, item_key)
);

-- QUIZ ATTEMPTS
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  quiz_slug text not null,
  score_pct int not null,
  passed boolean not null,
  answers jsonb not null,
  created_at timestamptz default now()
);
create index if not exists quiz_attempts_user_quiz_idx
  on public.quiz_attempts (user_id, quiz_slug, created_at desc);

-- VALIDATION SUBMISSIONS
create table if not exists public.validation_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  day_key day_key not null,
  slot text not null,
  storage_path text not null,
  status validation_status not null default 'pending',
  reviewer_id uuid references public.profiles(id),
  reviewer_note text,
  submitted_at timestamptz default now(),
  reviewed_at timestamptz
);
create index if not exists validation_status_idx
  on public.validation_submissions (status, submitted_at);
create unique index if not exists validation_active_slot_uq
  on public.validation_submissions (user_id, day_key, slot)
  where status in ('pending', 'approved');

-- BADGES
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  badge_key text not null,
  awarded_at timestamptz default now(),
  unique (user_id, badge_key)
);

-- STREAKS
create table if not exists public.streaks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_streak int default 0,
  longest_streak int default 0,
  last_active_date date
);

-- CERTIFICATIONS
create table if not exists public.certifications (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  issued_at timestamptz default now(),
  certificate_number text not null unique
);

-- ANNOUNCEMENTS
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  pinned boolean default false,
  published_at timestamptz default now()
);

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  insert into public.streaks (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.checklist_state enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.validation_submissions enable row level security;
alter table public.badges enable row level security;
alter table public.streaks enable row level security;
alter table public.certifications enable row level security;
alter table public.announcements enable row level security;

-- Helper: is_admin
create or replace function public.is_admin(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = uid and role in ('admin','staff'));
$$;

-- Profile policies
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id);

-- Generic owner-only policies
drop policy if exists "own lesson progress" on public.lesson_progress;
create policy "own lesson progress" on public.lesson_progress
  for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
  with check (auth.uid() = user_id);

drop policy if exists "own checklist state" on public.checklist_state;
create policy "own checklist state" on public.checklist_state
  for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
  with check (auth.uid() = user_id);

drop policy if exists "own quiz attempts" on public.quiz_attempts;
create policy "own quiz attempts" on public.quiz_attempts
  for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
  with check (auth.uid() = user_id);

drop policy if exists "own badges select" on public.badges;
create policy "own badges select" on public.badges
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
drop policy if exists "own badges insert" on public.badges;
create policy "own badges insert" on public.badges
  for insert with check (auth.uid() = user_id);

drop policy if exists "own streaks" on public.streaks;
create policy "own streaks" on public.streaks
  for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
  with check (auth.uid() = user_id);

drop policy if exists "own certification" on public.certifications;
create policy "own certification" on public.certifications
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- Validation submissions
drop policy if exists "validations read own" on public.validation_submissions;
create policy "validations read own" on public.validation_submissions
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "validations insert own" on public.validation_submissions;
create policy "validations insert own" on public.validation_submissions
  for insert with check (auth.uid() = user_id);

drop policy if exists "validations admin update" on public.validation_submissions;
create policy "validations admin update" on public.validation_submissions
  for update using (public.is_admin(auth.uid()));

-- Announcements: read for any authenticated user, admin writes via service role
drop policy if exists "announcements read" on public.announcements;
create policy "announcements read" on public.announcements
  for select using (auth.role() = 'authenticated');

-- STORAGE BUCKET (run via Studio if not present)
insert into storage.buckets (id, name, public)
  values ('screenshots', 'screenshots', false)
  on conflict (id) do nothing;

-- Storage policies: users can read & insert files under their own folder
drop policy if exists "screenshots read own" on storage.objects;
create policy "screenshots read own" on storage.objects
  for select using (
    bucket_id = 'screenshots'
    and (auth.uid()::text = split_part(name, '/', 1) or public.is_admin(auth.uid()))
  );

drop policy if exists "screenshots insert own" on storage.objects;
create policy "screenshots insert own" on storage.objects
  for insert with check (
    bucket_id = 'screenshots'
    and auth.uid()::text = split_part(name, '/', 1)
  );

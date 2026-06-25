-- First-login onboarding: capture last name, phone, timezone, and password change.
-- onboarded_at is null until the student finishes the onboarding form.

alter table public.profiles
  add column if not exists last_name text,
  add column if not exists phone text,
  add column if not exists onboarded_at timestamptz;

-- Admins are not routed through onboarding, so mark them as already-onboarded
-- to avoid any edge cases in the gate.
update public.profiles
set onboarded_at = coalesce(onboarded_at, created_at)
where role in ('admin', 'staff');

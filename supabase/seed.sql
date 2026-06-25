-- Seed announcements for the prototype
insert into public.announcements (title, body, pinned) values
  ('Welcome to BoldBot Academy', 'Your first 72 hours start now. Take it one module at a time — no skipping ahead.', true),
  ('Thursday Zoom: BoxSeats walkthrough', 'Live Q&A at 4:00 PM ET on Thursday. Bring your Day 2 questions.', false),
  ('New build: BoxSeats v3.2', 'Includes Max Profit Trigger improvements and a tighter morning routine.', false)
on conflict do nothing;

-- NOTE: To create the admin user, sign up normally via the app then:
--   update public.profiles set role = 'admin' where email = 'admin@example.com';

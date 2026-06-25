// One-shot seed script: creates an admin + a test student against whichever
// Supabase the env vars point to. Reads NEXT_PUBLIC_SUPABASE_URL +
// SUPABASE_SERVICE_ROLE_KEY from .env.local.
//
// Usage:  node --env-file=.env.local scripts/seed-users.mjs

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

const USERS = [
  {
    email: "admin@boldbot.local",
    password: "xe3=+AFR",
    full_name: "admin",
    role: "admin",
  },
  {
    email: "student@boldbot.local",
    password: "Welcome2026!",
    full_name: "student",
    role: "student",
  },
];

for (const u of USERS) {
  process.stdout.write(`→ ${u.email} (${u.role}) … `);

  // Idempotent: if the user already exists, find them and update password+role.
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { full_name: u.full_name },
  });

  let userId = created?.user?.id;

  if (createErr) {
    if (!/already.+registered|already exists/i.test(createErr.message)) {
      console.log(`ERROR ${createErr.message}`);
      continue;
    }
    // already exists — find them
    const { data: list } = await admin.auth.admin.listUsers();
    const existing = list?.users.find((x) => x.email === u.email);
    if (!existing) {
      console.log("ERROR could not locate existing user");
      continue;
    }
    userId = existing.id;
    await admin.auth.admin.updateUserById(userId, {
      password: u.password,
      user_metadata: { full_name: u.full_name },
    });
  }

  // profile is auto-created by handle_new_user trigger; ensure name + role are correct
  const { error: profileErr } = await admin
    .from("profiles")
    .update({ full_name: u.full_name, role: u.role })
    .eq("id", userId);

  if (profileErr) {
    console.log(`ERROR ${profileErr.message}`);
    continue;
  }

  console.log(`OK (${userId})`);
}

console.log("\nDone.");
console.log("Log in at http://localhost:3000/login");

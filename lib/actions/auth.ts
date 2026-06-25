"use server";

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { passwordError } from "@/lib/password";

export type ResetResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR =
  "We couldn't verify those details. Check your email and first name, then try again.";

export async function resetPasswordWithVerification(formData: FormData): Promise<ResetResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const firstName = String(formData.get("first_name") ?? "").trim().toLowerCase();
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!email || !firstName) {
    return { ok: false, error: "Email and first name are required." };
  }

  const pwErr = passwordError(newPassword);
  if (pwErr) return { ok: false, error: pwErr };
  if (newPassword !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }

  const admin = createAdminClient();

  const { data: profile, error: lookupErr } = await admin
    .from("profiles")
    .select("id, full_name")
    .ilike("email", email)
    .maybeSingle();

  if (lookupErr || !profile) {
    return { ok: false, error: GENERIC_ERROR };
  }

  const onFile = (profile.full_name ?? "").trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  if (!onFile || onFile !== firstName) {
    return { ok: false, error: GENERIC_ERROR };
  }

  const { error: updateErr } = await admin.auth.admin.updateUserById(profile.id, {
    password: newPassword,
  });
  if (updateErr) {
    return { ok: false, error: updateErr.message };
  }

  return { ok: true };
}

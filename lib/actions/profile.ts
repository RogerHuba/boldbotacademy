"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { passwordError } from "@/lib/password";

export type ProfileResult = { ok: true } | { ok: false; error: string };

const TIMEZONES = new Set([
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
]);

export async function completeOnboarding(formData: FormData): Promise<ProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "America/New_York").trim();
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!firstName) return { ok: false, error: "First name is required." };
  if (!lastName) return { ok: false, error: "Last name is required." };
  if (!phone) return { ok: false, error: "Phone number is required." };
  if (!TIMEZONES.has(timezone)) return { ok: false, error: "Pick a valid timezone." };
  const pwErr = passwordError(newPassword);
  if (pwErr) return { ok: false, error: pwErr };
  if (newPassword !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }

  const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
  if (updateErr) return { ok: false, error: updateErr.message };

  const fullName = `${firstName} ${lastName}`.trim();
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      last_name: lastName,
      phone,
      timezone,
      onboarded_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (profileError) return { ok: false, error: profileError.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateProfile(formData: FormData): Promise<ProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "America/New_York").trim();

  if (!firstName) return { ok: false, error: "First name is required." };
  if (!TIMEZONES.has(timezone)) return { ok: false, error: "Pick a valid timezone." };

  const fullName = lastName ? `${firstName} ${lastName}`.trim() : firstName;
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      last_name: lastName || null,
      phone: phone || null,
      timezone,
    })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function changePassword(formData: FormData): Promise<ProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  const pwErr = passwordError(newPassword);
  if (pwErr) return { ok: false, error: pwErr };
  if (newPassword !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

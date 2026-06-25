"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/gating";
import { createAdminClient } from "@/lib/supabase/admin";

export type InviteResult =
  | { ok: true; tempPassword: string; email: string }
  | { ok: false; error: string };

export async function inviteStudent(formData: FormData): Promise<InviteResult> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "student") as "student" | "admin" | "staff";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!fullName) {
    return { ok: false, error: "Full name is required." };
  }

  const tempPassword = generateTempPassword();
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    return { ok: false, error: error?.message ?? "Could not create user." };
  }

  // handle_new_user trigger created the profile with role='student' — adjust if needed
  const updates: Record<string, string> = { full_name: fullName };
  if (role !== "student") updates.role = role;
  await admin.from("profiles").update(updates).eq("id", data.user.id);

  revalidatePath("/admin/students");
  return { ok: true, tempPassword, email };
}

export async function deleteStudent(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  if (!userId) return { ok: false, error: "Missing user id." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/students");
  return { ok: true };
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 14; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

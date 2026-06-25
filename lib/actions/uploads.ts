"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { awardBadge } from "@/lib/badges";
import { generateCertNumber } from "@/lib/utils";
import { VALIDATIONS } from "@/content/validations";
import type { DayKey } from "@/content/types";

/** Student uploads a screenshot for a given day/slot. */
export async function uploadScreenshot(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not signed in" };

  const day = formData.get("day") as DayKey;
  const slot = formData.get("slot") as string;
  const file = formData.get("file") as File;
  if (!day || !slot || !file) return { ok: false as const, error: "Missing fields" };

  const ext = file.name.split(".").pop() || "png";
  const path = `${user.id}/${day}/${slot}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("screenshots")
    .upload(path, file, { upsert: false, cacheControl: "3600" });
  if (upErr) return { ok: false as const, error: upErr.message };

  // close any previous open submissions for this slot
  await supabase
    .from("validation_submissions")
    .update({ status: "needs_correction" })
    .eq("user_id", user.id)
    .eq("day_key", day)
    .eq("slot", slot)
    .eq("status", "pending");

  await supabase.from("validation_submissions").insert({
    user_id: user.id,
    day_key: day,
    slot,
    storage_path: path,
    status: "pending",
  });

  revalidatePath("/", "layout");
  return { ok: true as const, path };
}

/** Admin action: mark a submission approved or needs correction. */
export async function reviewSubmission(
  id: string,
  status: "approved" | "needs_correction",
  note?: string,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "staff") {
    return { ok: false, error: "Not authorized" };
  }

  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("validation_submissions")
    .update({
      status,
      reviewer_id: user.id,
      reviewer_note: note ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("user_id, day_key")
    .single();
  if (error || !row) return { ok: false, error: error?.message };

  if (status === "approved") {
    const spec = VALIDATIONS.find((v) => v.day === row.day_key);
    if (spec) {
      const { data: rows } = await admin
        .from("validation_submissions")
        .select("slot, status")
        .eq("user_id", row.user_id)
        .eq("day_key", row.day_key);
      const allApproved = spec.slots.every((s) =>
        (rows ?? []).find((r) => r.slot === s.key && r.status === "approved"),
      );
      if (allApproved) {
        if (row.day_key === "day_1_setup") {
          await admin.from("badges").insert({ user_id: row.user_id, badge_key: "setup_completed" });
        }
        if (row.day_key === "day_2") {
          await admin.from("badges").insert({ user_id: row.user_id, badge_key: "simulation_completed" });
        }
      }
    }
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function issueCertification() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const { data: existing } = await supabase
    .from("certifications")
    .select("certificate_number")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return { ok: true, certNumber: existing.certificate_number };

  const certNumber = generateCertNumber();
  await supabase.from("certifications").insert({
    user_id: user.id,
    certificate_number: certNumber,
  });
  await awardBadge(user.id, "first_bot_deployed");
  await awardBadge(user.id, "72_hour_certified");
  revalidatePath("/", "layout");
  return { ok: true, certNumber };
}

export async function getSignedUrl(path: string) {
  const admin = createAdminClient();
  const { data } = await admin.storage.from("screenshots").createSignedUrl(path, 60 * 60);
  return data?.signedUrl;
}

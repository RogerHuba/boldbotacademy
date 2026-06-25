"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { awardBadge } from "@/lib/badges";
import { tickStreak } from "@/lib/streak";

export async function markLessonComplete(lessonSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  await supabase
    .from("lesson_progress")
    .upsert(
      { user_id: user.id, lesson_slug: lessonSlug, video_watched_pct: 100 },
      { onConflict: "user_id,lesson_slug" },
    );

  await tickStreak(user.id);

  // welcome_aboard on first completed lesson
  await awardBadge(user.id, "welcome_aboard");

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function setChecklistItem(
  lessonSlug: string,
  itemKey: string,
  checked: boolean,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  await supabase
    .from("checklist_state")
    .upsert(
      { user_id: user.id, lesson_slug: lessonSlug, item_key: itemKey, checked },
      { onConflict: "user_id,lesson_slug,item_key" },
    );
  revalidatePath("/", "layout");
  return { ok: true };
}

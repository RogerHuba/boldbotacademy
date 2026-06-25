import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function tickStreak(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("streaks").select("*").eq("user_id", userId).maybeSingle();
  const today = new Date().toISOString().slice(0, 10);

  if (!data) {
    await supabase.from("streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today,
    });
    return;
  }

  if (data.last_active_date === today) return;

  const last = data.last_active_date ? new Date(data.last_active_date) : null;
  const todayDate = new Date(today);
  let current = 1;
  if (last) {
    const diff = Math.round((todayDate.getTime() - last.getTime()) / 86_400_000);
    current = diff === 1 ? (data.current_streak ?? 0) + 1 : 1;
  }
  const longest = Math.max(data.longest_streak ?? 0, current);
  await supabase
    .from("streaks")
    .update({ current_streak: current, longest_streak: longest, last_active_date: today })
    .eq("user_id", userId);
}

import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function awardBadge(userId: string, badgeKey: string) {
  const supabase = await createClient();
  await supabase
    .from("badges")
    .insert({ user_id: userId, badge_key: badgeKey })
    .select();
  // unique constraint on (user_id, badge_key) means duplicates are no-ops
}

import { DayOverview } from "@/components/lesson/DayOverview";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Day0Page() {
  const state = await requireUnlockedDay("day_0");
  return <DayOverview day="day_0" state={state} />;
}

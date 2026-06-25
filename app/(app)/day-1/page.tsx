import { DayOverview } from "@/components/lesson/DayOverview";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Day1Page() {
  const state = await requireUnlockedDay("day_1");
  return <DayOverview day="day_1" state={state} />;
}

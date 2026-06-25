import { DayOverview } from "@/components/lesson/DayOverview";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Day3Page() {
  const state = await requireUnlockedDay("day_3");
  return <DayOverview day="day_3" state={state} />;
}

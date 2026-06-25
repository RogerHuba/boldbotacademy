import { DayOverview } from "@/components/lesson/DayOverview";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Day2Page() {
  const state = await requireUnlockedDay("day_2");
  return <DayOverview day="day_2" state={state} />;
}

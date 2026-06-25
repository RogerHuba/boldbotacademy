import { DayOverview } from "@/components/lesson/DayOverview";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Day1SetupPage() {
  const state = await requireUnlockedDay("day_1_setup");
  return <DayOverview day="day_1_setup" state={state} />;
}

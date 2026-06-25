import { ValidationPortal } from "@/components/lesson/ValidationPortal";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Page() {
  await requireUnlockedDay("day_1_setup");
  return <ValidationPortal day="day_1_setup" />;
}

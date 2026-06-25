import { ValidationPortal } from "@/components/lesson/ValidationPortal";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Page() {
  await requireUnlockedDay("day_2");
  return <ValidationPortal day="day_2" />;
}

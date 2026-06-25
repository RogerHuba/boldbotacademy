import { LessonBody } from "@/components/lesson/LessonBody";
import { getLesson } from "@/content/lessons";
import { requireUnlockedDay } from "@/lib/gating";
export default async function Page() {
  const state = await requireUnlockedDay("day_2");
  return <LessonBody lesson={getLesson("day-2.manual-trading")!} state={state} />;
}

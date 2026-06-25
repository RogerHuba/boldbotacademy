import { LessonBody } from "@/components/lesson/LessonBody";
import { getLesson } from "@/content/lessons";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Page() {
  const state = await requireUnlockedDay("day_1");
  return <LessonBody lesson={getLesson("day-1.prop-firm-rules")!} state={state} />;
}

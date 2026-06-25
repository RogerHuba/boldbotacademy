import { LessonBody } from "@/components/lesson/LessonBody";
import { getLesson } from "@/content/lessons";
import { requireUnlockedDay } from "@/lib/gating";
export default async function Page() {
  const state = await requireUnlockedDay("day_2");
  const lesson = { ...getLesson("day-2.exercise-2")!, checklistKey: "exit-ninjatrader" };
  return <LessonBody lesson={lesson} state={state} />;
}

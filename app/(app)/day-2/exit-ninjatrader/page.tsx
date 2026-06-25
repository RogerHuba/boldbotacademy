import { LessonBody } from "@/components/lesson/LessonBody";
import { getLesson } from "@/content/lessons";
import { requireUnlockedDay } from "@/lib/gating";
export default async function Page() {
  const state = await requireUnlockedDay("day_2");
  // exit-ninjatrader uses checklist 'exit-ninjatrader' — link it
  const lesson = { ...getLesson("day-2.exit-ninjatrader")!, checklistKey: "exit-ninjatrader" };
  return <LessonBody lesson={lesson} state={state} />;
}

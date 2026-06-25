import Link from "next/link";
import { Clock, ChevronLeft } from "lucide-react";
import type { DayKey, Lesson } from "@/content/types";
import { dayMeta } from "@/content/days";
import { CompleteButton } from "./CompleteButton";

const DAY_PATH: Record<DayKey, string> = {
  day_0: "/day-0",
  day_1: "/day-1",
  day_1_setup: "/day-1/setup",
  day_2: "/day-2",
  day_3: "/day-3",
};

export function LessonShell({
  lesson,
  completed,
  children,
}: {
  lesson: Lesson;
  completed: boolean;
  children: React.ReactNode;
}) {
  const meta = dayMeta(lesson.day);
  const dayPath = DAY_PATH[lesson.day];
  return (
    <article className="mx-auto max-w-3xl space-y-8 animate-fade-in">
      <div className="space-y-3">
        <Link href={dayPath} className="inline-flex items-center gap-2 text-xs text-fg-muted hover:text-fg">
          <ChevronLeft className="size-3.5" />
          {meta.label} · {meta.title}
        </Link>
        <h1 className="font-display text-3xl font-semibold leading-tight md:text-4xl">{lesson.title}</h1>
        <div className="flex items-center gap-3 text-sm text-fg-muted">
          <span className="chip">
            <Clock className="size-3.5" />
            {lesson.estimatedMinutes} min
          </span>
          {completed && <span className="chip chip-success">Completed</span>}
        </div>
      </div>

      <div className="space-y-6">{children}</div>

      <div className="border-t border-border pt-6">
        <CompleteButton lessonSlug={lesson.slug} completed={completed} backHref={dayPath} />
      </div>
    </article>
  );
}

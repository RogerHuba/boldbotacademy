import Link from "next/link";
import { ChevronLeft, Rocket } from "lucide-react";
import { Checklist } from "@/components/lesson/Checklist";
import { CompleteButton } from "@/components/lesson/CompleteButton";
import { getLesson } from "@/content/lessons";
import { getChecklist } from "@/content/checklists";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Page() {
  const state = await requireUnlockedDay("day_3");
  const lesson = getLesson("day-3.deployment-sim")!;
  const checklist = getChecklist("deployment-sim")!;
  const initial = state.checklists[lesson.slug] ?? {};
  const completed = !!state.lessons[lesson.slug]?.completed;
  const allChecked = checklist.items.every((i) => initial[i.key]);

  return (
    <article className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <Link href="/day-3" className="inline-flex items-center gap-2 text-xs text-fg-muted hover:text-fg">
        <ChevronLeft className="size-3.5" /> Day 3 · First Bot Deployment
      </Link>
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Deployment simulation</div>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">{lesson.title}</h1>
        <p className="text-fg-muted">
          Every item below must be checked before you go live. If you can't honestly check one,
          stop and ping <strong>Dan</strong> in #tech-support.
        </p>
      </header>

      <Checklist checklist={checklist} lessonSlug={lesson.slug} initial={initial} />

      <Link
        href="/day-3/deploy"
        onClick={(e) => !allChecked && e.preventDefault()}
        className={`flex items-center justify-between rounded-2xl border px-5 py-4 transition ${
          allChecked
            ? "border-brand bg-brand/15 hover:bg-brand/25"
            : "border-border bg-bg-card opacity-60"
        }`}
      >
        <div>
          <div className="font-display text-lg font-semibold">Ready to deploy</div>
          <div className="text-xs text-fg-muted">
            {allChecked
              ? "All items checked. Take a breath, then continue."
              : "Check every item above to unlock live deployment."}
          </div>
        </div>
        <Rocket className="size-5 text-brand-hover" />
      </Link>

      <CompleteButton lessonSlug={lesson.slug} completed={completed} backHref="/day-3" />
    </article>
  );
}

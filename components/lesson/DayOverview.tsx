import Link from "next/link";
import { Clock, Check, Lock, FileCheck2, GraduationCap, ArrowRight } from "lucide-react";
import { LESSONS } from "@/content/lessons";
import { dayMeta } from "@/content/days";
import type { DayKey } from "@/content/types";
import type { StudentState } from "@/lib/progress";
import { dayCompletionPct } from "@/lib/progress";

const DAY_PATH: Record<DayKey, string> = {
  day_0: "/day-0",
  day_1: "/day-1",
  day_1_setup: "/day-1/setup",
  day_2: "/day-2",
  day_3: "/day-3",
};

function lessonHref(daySlugBase: string, slug: string) {
  // slug looks like "day-0.welcome" → segment "welcome"
  const segment = slug.split(".").pop();
  return `${daySlugBase}/${segment}`;
}

export function DayOverview({ day, state }: { day: DayKey; state: StudentState }) {
  const meta = dayMeta(day);
  const lessons = meta.lessons.map((slug) => LESSONS.find((l) => l.slug === slug)!).filter(Boolean);
  const pct = dayCompletionPct(state, day);
  const allLessonsComplete = lessons.every((l) => state.lessons[l.slug]?.completed);
  const quizPassed = meta.quizSlug ? state.quizzes[meta.quizSlug]?.passed : true;
  const validationApproved = meta.validationSlug ? state.validations[meta.validationSlug] === "approved" : true;
  const base = DAY_PATH[day];

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{meta.label}</div>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">{meta.title}</h1>
        <p className="text-fg-muted">{meta.subtitle}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">
            <Clock className="size-3.5" />
            {meta.estimatedMinutes} min
          </span>
          <span className="chip">{lessons.length} lessons</span>
          {meta.quizSlug && <span className="chip">Quiz · 80% to pass</span>}
          {meta.validationSlug && <span className="chip">Validation portal</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-card">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-hover" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-medium text-fg-muted">{pct}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {lessons.map((l, i) => {
          const done = state.lessons[l.slug]?.completed;
          return (
            <Link
              key={l.slug}
              href={lessonHref(base, l.slug)}
              className="flex items-center gap-4 rounded-2xl border border-border bg-bg-card px-4 py-3 transition hover:bg-bg-hover"
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  done ? "bg-success/20 text-success" : "bg-brand/20 text-brand-hover"
                }`}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{l.title}</div>
                <div className="text-xs text-fg-muted">{l.summary}</div>
              </div>
              <span className="chip">{l.estimatedMinutes}m</span>
            </Link>
          );
        })}

        {meta.quizSlug && (
          <Link
            href={`${base}/quiz`}
            className={`flex items-center gap-4 rounded-2xl border px-4 py-3 transition ${
              allLessonsComplete
                ? "border-brand/40 bg-brand/10 hover:bg-brand/20"
                : "border-border bg-bg-card opacity-60"
            }`}
            onClick={(e) => !allLessonsComplete && e.preventDefault()}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/20 text-brand-hover">
              {quizPassed ? <Check className="size-4 text-success" /> : <GraduationCap className="size-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{meta.label} Quiz</div>
              <div className="text-xs text-fg-muted">
                {quizPassed
                  ? `Passed · best ${state.quizzes[meta.quizSlug]?.bestScore}%`
                  : allLessonsComplete
                    ? "Ready when you are."
                    : "Finish all lessons above first."}
              </div>
            </div>
            {!quizPassed && allLessonsComplete && <ArrowRight className="size-4" />}
          </Link>
        )}

        {meta.validationSlug && (
          <Link
            href={`${base}/validation`}
            className={`flex items-center gap-4 rounded-2xl border px-4 py-3 transition ${
              quizPassed ? "border-warning/40 bg-warning/10 hover:bg-warning/20" : "border-border bg-bg-card opacity-60"
            }`}
            onClick={(e) => !quizPassed && e.preventDefault()}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-warning/20 text-warning">
              {validationApproved ? <Check className="size-4 text-success" /> : <FileCheck2 className="size-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{meta.label} Validation</div>
              <div className="text-xs text-fg-muted">
                {validationApproved
                  ? "All slots approved by the team."
                  : "Upload screenshots — the team reviews and approves."}
              </div>
            </div>
            {!validationApproved && quizPassed && (
              <span className="chip chip-warning">{state.validations[meta.validationSlug] ?? "pending"}</span>
            )}
          </Link>
        )}
      </div>

      <LockedHint day={day} state={state} />
    </div>
  );
}

function LockedHint({ day, state }: { day: DayKey; state: StudentState }) {
  if (state.unlocked[day]) return null;
  return (
    <div className="card flex items-center gap-3">
      <Lock className="size-4 text-fg-muted" />
      <span className="text-sm text-fg-muted">This day is locked. Finish the previous day to continue.</span>
    </div>
  );
}

import { CheckCircle2, Circle, Lock, Clock } from "lucide-react";
import { requireStudent } from "@/lib/gating";
import { DAYS } from "@/content/days";
import { LESSONS, getLesson } from "@/content/lessons";
import { VALIDATIONS } from "@/content/validations";
import { dayCompletionPct, unlockReason } from "@/lib/progress";

export default async function ProgressPage() {
  const state = await requireStudent();

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Tracker
        </div>
        <h1 className="font-display text-3xl font-semibold">Progress</h1>
        <p className="text-fg-muted">
          Everything that's required to get to 72-hour certified — and what's done.
        </p>
      </header>

      <section className="card-raised space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Overall</div>
          <div className="text-2xl font-display font-semibold">{state.overallPct}%</div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-bg">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-hover transition-all"
            style={{ width: `${state.overallPct}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
          <Mini label="Lessons" value={`${Object.keys(state.lessons).length} / ${LESSONS.length}`} />
          <Mini
            label="Quizzes passed"
            value={`${["day-0.quiz", "day-1.quiz", "day-2.quiz"].filter((s) => state.quizzes[s]?.passed).length} / 3`}
          />
          <Mini
            label="Validations approved"
            value={`${(["day_1_setup", "day_2"] as const).filter((d) => state.validations[d] === "approved").length} / 2`}
          />
        </div>
      </section>

      <section className="space-y-4">
        {DAYS.map((day) => {
          const unlocked = state.unlocked[day.key];
          const pct = dayCompletionPct(state, day.key);
          return (
            <div key={day.key} className="card-raised space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                    {day.label}
                  </div>
                  <div className="font-display text-xl font-semibold">{day.title}</div>
                  {!unlocked && (
                    <div className="mt-1 text-xs text-fg-muted">{unlockReason(state, day.key)}</div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {!unlocked && <Lock className="size-4 text-fg-subtle" />}
                  <span className="font-medium">{pct}%</span>
                </div>
              </div>

              <ul className="space-y-1.5">
                {day.lessons.map((slug) => {
                  const done = !!state.lessons[slug]?.completed;
                  const meta = getLesson(slug);
                  return (
                    <li key={slug} className="flex items-center gap-2 text-sm">
                      {done ? (
                        <CheckCircle2 className="size-4 text-success" />
                      ) : (
                        <Circle className="size-4 text-fg-subtle" />
                      )}
                      <span className={done ? "text-fg-muted line-through" : "text-fg"}>
                        {meta?.title ?? slug}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-fg-subtle">
                        <Clock className="size-3" />
                        {meta?.estimatedMinutes ?? 0}m
                      </span>
                    </li>
                  );
                })}

                {day.quizSlug && (
                  <li className="flex items-center gap-2 text-sm">
                    {state.quizzes[day.quizSlug]?.passed ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <Circle className="size-4 text-fg-subtle" />
                    )}
                    <span>{day.label} Quiz</span>
                    {state.quizzes[day.quizSlug] && (
                      <span className="ml-auto text-xs text-fg-subtle">
                        Best: {state.quizzes[day.quizSlug].bestScore}%
                      </span>
                    )}
                  </li>
                )}

                {day.validationSlug && (
                  <li className="flex items-center gap-2 text-sm">
                    {state.validations[day.validationSlug] === "approved" ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <Circle className="size-4 text-fg-subtle" />
                    )}
                    <span>
                      {day.label} Validation —{" "}
                      <span className="text-fg-muted">
                        {state.validations[day.validationSlug].replace("_", " ")}
                      </span>
                    </span>
                    <span className="ml-auto text-xs text-fg-subtle">
                      {VALIDATIONS.find((v) => v.day === day.validationSlug)?.slots.length ?? 0} slots
                    </span>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="card-raised flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Certification
          </div>
          <div className="font-display text-xl font-semibold">72-Hour Certified</div>
          <div className="text-sm text-fg-muted">
            All quizzes passed · all validations approved · deployment sim complete.
          </div>
        </div>
        <div>
          {state.certified ? (
            <span className="chip chip-success">Earned</span>
          ) : (
            <span className="chip">In progress</span>
          )}
        </div>
      </section>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg p-3">
      <div className="text-xs uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
} from "lucide-react";
import { requireAdmin } from "@/lib/gating";
import {
  getPipelineSnapshot,
  getStudentDetail,
  QUIZ_TITLES,
} from "@/lib/admin/pipeline";
import { DAYS, dayMeta } from "@/content/days";
import { VALIDATIONS } from "@/content/validations";
import { formatRelativeTime } from "@/lib/utils";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireAdmin();
  const { userId } = await params;
  const [detail, snapshot] = await Promise.all([
    getStudentDetail(userId),
    getPipelineSnapshot(),
  ]);
  if (!detail.profile) notFound();
  const row = snapshot.students.find((s) => s.userId === userId);
  if (!row) notFound();

  const name = detail.profile.full_name ?? detail.profile.email;
  const attemptsByQuiz = new Map<string, typeof detail.quizAttempts>();
  for (const a of detail.quizAttempts) {
    if (!attemptsByQuiz.has(a.quiz_slug)) attemptsByQuiz.set(a.quiz_slug, []);
    attemptsByQuiz.get(a.quiz_slug)!.push(a);
  }

  const lessonsCompletedByDay = new Map<string, number>();
  for (const l of detail.lessons) {
    const dayKey = DAYS.find((d) => d.lessons.includes(l.lesson_slug))?.key;
    if (dayKey)
      lessonsCompletedByDay.set(dayKey, (lessonsCompletedByDay.get(dayKey) ?? 0) + 1);
  }

  const validationsByDay = new Map<string, typeof detail.validations>();
  for (const v of detail.validations) {
    if (!validationsByDay.has(v.day_key)) validationsByDay.set(v.day_key, []);
    validationsByDay.get(v.day_key)!.push(v);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-xs text-fg-muted hover:text-fg"
      >
        <ArrowLeft className="size-3.5" /> Pipeline dashboard
      </Link>

      <header className="card-raised flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-brand/15 text-xl font-semibold text-brand-hover">
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">{name}</h1>
            <div className="text-sm text-fg-muted">{detail.profile.email}</div>
            <div className="text-xs text-fg-subtle">
              Joined {formatRelativeTime(detail.profile.created_at)} · Last active{" "}
              {formatRelativeTime(detail.profile.last_active_at ?? detail.profile.created_at)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip chip-brand">{row.stageLabel}</span>
          {row.needsAttention && <span className="chip chip-danger">Needs attention</span>}
        </div>
      </header>

      {row.reasons.length > 0 && (
        <section className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-danger">
            <AlertTriangle className="size-4" />
            Areas of opportunity
          </div>
          <ul className="mt-2 space-y-1 text-sm text-fg-muted">
            {row.reasons.map((r) => (
              <li key={r} className="flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-danger" />
                {r}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <Stat
          icon={<Flame className="size-4 text-warning" />}
          label="Current streak"
          value={`${detail.streak?.current_streak ?? 0}d`}
        />
        <Stat
          icon={<Award className="size-4 text-brand-hover" />}
          label="Badges"
          value={detail.badges.length}
        />
        <Stat
          icon={<Clock className="size-4 text-fg-muted" />}
          label="Days since active"
          value={`${row.daysSinceLastActive}d`}
        />
        <Stat
          icon={<Trophy className="size-4 text-success" />}
          label="Certification"
          value={detail.certification ? "Issued" : "Not yet"}
        />
      </section>

      <section className="card-raised space-y-3">
        <h2 className="font-display text-lg font-semibold">Quiz history</h2>
        <div className="space-y-4">
          {Object.keys(QUIZ_TITLES).map((slug) => {
            const stat = row.quizStats.find((q) => q.slug === slug)!;
            const attempts = (attemptsByQuiz.get(slug) ?? []).slice().sort((a, b) =>
              b.created_at.localeCompare(a.created_at),
            );
            return (
              <div key={slug} className="rounded-2xl border border-border bg-bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{QUIZ_TITLES[slug]}</div>
                    <div className="text-xs text-fg-subtle">
                      {stat.attempts === 0
                        ? "No attempts yet"
                        : `${stat.attempts} attempt${stat.attempts === 1 ? "" : "s"} · best ${stat.bestScore}%`}
                    </div>
                  </div>
                  {stat.passed ? (
                    <span className="chip chip-success">Passed</span>
                  ) : stat.attempts > 0 ? (
                    <span className="chip chip-warning">Failing</span>
                  ) : (
                    <span className="chip">Not started</span>
                  )}
                </div>
                {attempts.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-xs">
                    {attempts.map((a, i) => (
                      <li
                        key={`${a.created_at}-${i}`}
                        className="flex items-center justify-between rounded-lg bg-bg-raised px-3 py-1.5"
                      >
                        <span className="text-fg-muted">
                          Attempt {attempts.length - i} · {a.score_pct}%
                        </span>
                        <span className="flex items-center gap-2 text-fg-subtle">
                          {a.passed ? (
                            <CheckCircle2 className="size-3 text-success" />
                          ) : (
                            <AlertTriangle className="size-3 text-warning" />
                          )}
                          {formatRelativeTime(a.created_at)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-raised space-y-3">
        <h2 className="font-display text-lg font-semibold">Validation status</h2>
        <div className="space-y-3">
          {VALIDATIONS.map((spec) => {
            const meta = dayMeta(spec.day);
            const rows = validationsByDay.get(spec.day) ?? [];
            const slotState = new Map(rows.map((r) => [r.slot, r]));
            return (
              <div key={spec.day} className="rounded-2xl border border-border bg-bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{meta.label} validation</div>
                  <Link
                    href={`/admin/submissions/${userId}/${spec.day}`}
                    className="text-xs text-brand-hover hover:text-brand"
                  >
                    Open review →
                  </Link>
                </div>
                <ul className="mt-2 grid gap-1.5 text-xs md:grid-cols-2">
                  {spec.slots.map((slot) => {
                    const r = slotState.get(slot.key);
                    const status = r?.status ?? "not_submitted";
                    return (
                      <li
                        key={slot.key}
                        className="flex items-center justify-between rounded-lg bg-bg-raised px-3 py-1.5"
                      >
                        <span className="text-fg-muted">{slot.label}</span>
                        <span
                          className={
                            status === "approved"
                              ? "text-success"
                              : status === "needs_correction"
                                ? "text-danger"
                                : status === "pending"
                                  ? "text-warning"
                                  : "text-fg-subtle"
                          }
                        >
                          {status.replace("_", " ")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-raised space-y-3">
        <h2 className="font-display text-lg font-semibold">Lesson progress</h2>
        <ul className="space-y-1.5">
          {DAYS.map((d) => {
            const done = lessonsCompletedByDay.get(d.key) ?? 0;
            const total = d.lessons.length;
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            return (
              <li key={d.key} className="flex items-center gap-3">
                <div className="w-32 text-xs font-medium text-fg-muted">{d.label}</div>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-card">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
                <div className="w-20 text-right text-xs text-fg-subtle">
                  {done}/{total}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-bg-raised">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-fg-subtle">{label}</div>
        <div className="font-display text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

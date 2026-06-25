import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Inbox,
  Trophy,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/gating";
import { getPipelineSnapshot } from "@/lib/admin/pipeline";
import { formatRelativeTime } from "@/lib/utils";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const snapshot = await getPipelineSnapshot();

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Admin</div>
        <h1 className="font-display text-3xl font-semibold">Pipeline dashboard</h1>
        <p className="text-fg-muted">
          Where every student sits in their first 72 hours, where they're stuck, and what to act on
          today.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Stat
          icon={<Users className="size-4 text-brand-hover" />}
          label="Active students"
          value={snapshot.totalStudents}
        />
        <Stat
          icon={<Inbox className="size-4 text-warning" />}
          label="Pending reviews"
          value={snapshot.totalPendingReviewSessions}
          href="/admin/reviews"
        />
        <Stat
          icon={<AlertTriangle className="size-4 text-danger" />}
          label="Needs attention"
          value={snapshot.totalAttention}
          tone={snapshot.totalAttention > 0 ? "danger" : undefined}
        />
        <Stat
          icon={<Trophy className="size-4 text-success" />}
          label="Certified"
          value={snapshot.totalCertified}
        />
      </section>

      <section className="card-raised space-y-3">
        <h2 className="font-display text-lg font-semibold">Pipeline funnel</h2>
        <p className="text-xs text-fg-subtle">
          {snapshot.totalStudents} student{snapshot.totalStudents === 1 ? "" : "s"} distributed
          across stages.
        </p>
        <div className="space-y-2">
          {snapshot.funnel.map((row) => (
            <div key={row.stage} className="flex items-center gap-3">
              <div className="w-40 text-xs font-medium text-fg-muted">{row.label}</div>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-bg-card">
                <div
                  className={`h-full rounded-full ${
                    row.stage === "certified"
                      ? "bg-gradient-to-r from-success to-success/60"
                      : "bg-gradient-to-r from-brand to-brand-hover"
                  }`}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <div className="w-20 text-right text-xs text-fg-muted">
                {row.count} ({row.pct}%)
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-raised space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-danger" />
            <h2 className="font-display text-lg font-semibold">Needs attention</h2>
          </div>
          <span className="text-xs text-fg-subtle">
            ≥2 failed quiz attempts · validation correction · no activity in 3+ days
          </span>
        </div>
        {snapshot.attention.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-fg-muted">
            <CheckCircle2 className="size-6 text-success" />
            <span>Everyone is moving. Nothing flagged.</span>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {snapshot.attention.map((s) => (
              <Link
                key={s.userId}
                href={`/admin/students/${s.userId}`}
                className="flex items-center gap-4 py-3 transition hover:bg-bg-hover"
              >
                <div className="grid size-10 place-items-center rounded-full bg-danger/15 text-sm font-semibold text-danger">
                  {(s.fullName ?? s.email)[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{s.fullName ?? s.email}</div>
                  <div className="text-xs text-fg-muted">
                    {s.stageLabel} · {s.reasons.join(" · ")}
                  </div>
                </div>
                <span className="chip">{s.stageLabel}</span>
                <ArrowRight className="size-4 text-fg-muted" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card-raised space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent quiz activity</h2>
            <Link href="/admin/students" className="text-xs text-brand-hover hover:text-brand">
              All students →
            </Link>
          </div>
          {snapshot.recentQuizActivity.length === 0 ? (
            <p className="py-4 text-center text-sm text-fg-muted">No attempts yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {snapshot.recentQuizActivity.map((q, idx) => (
                <li key={`${q.userId}-${q.createdAt}-${idx}`}>
                  <Link
                    href={`/admin/students/${q.userId}`}
                    className="flex items-center gap-3 py-2.5 transition hover:bg-bg-hover"
                  >
                    {q.passed ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <AlertTriangle className="size-4 text-warning" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{q.name}</div>
                      <div className="text-xs text-fg-muted">
                        {q.quizTitle} · {q.scorePct}% ·{" "}
                        <span className={q.passed ? "text-success" : "text-warning"}>
                          {q.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                    </div>
                    <Clock className="size-3.5 text-fg-subtle" />
                    <span className="text-xs text-fg-subtle">
                      {formatRelativeTime(q.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-raised space-y-3">
          <h2 className="font-display text-lg font-semibold">All students</h2>
          {snapshot.students.length === 0 ? (
            <p className="py-4 text-center text-sm text-fg-muted">No students yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {snapshot.students.slice(0, 8).map((s) => (
                <li key={s.userId}>
                  <Link
                    href={`/admin/students/${s.userId}`}
                    className="flex items-center gap-3 py-2.5 transition hover:bg-bg-hover"
                  >
                    <div className="grid size-9 place-items-center rounded-full bg-brand/15 text-xs font-semibold text-brand-hover">
                      {(s.fullName ?? s.email)[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{s.fullName ?? s.email}</div>
                      <div className="text-xs text-fg-muted">{s.stageLabel}</div>
                    </div>
                    {s.pendingReviews > 0 && (
                      <span className="chip">{s.pendingReviews} pending</span>
                    )}
                    <span className="text-xs text-fg-subtle">
                      {s.daysSinceLastActive === 0
                        ? "today"
                        : `${s.daysSinceLastActive}d ago`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {snapshot.students.length > 8 && (
            <Link
              href="/admin/students"
              className="block pt-1 text-center text-xs text-brand-hover hover:text-brand"
            >
              See all {snapshot.students.length} →
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  href,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  href?: string;
  tone?: "danger";
}) {
  const inner = (
    <div
      className={`card flex items-center gap-3 ${tone === "danger" ? "border-danger/30" : ""} ${
        href ? "transition hover:border-brand/40" : ""
      }`}
    >
      <div className="grid size-10 place-items-center rounded-xl bg-bg-raised">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-fg-subtle">{label}</div>
        <div className="font-display text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

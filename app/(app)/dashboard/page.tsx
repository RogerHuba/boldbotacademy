import Link from "next/link";
import { requireStudent } from "@/lib/gating";
import { createClient } from "@/lib/supabase/server";
import { DAYS, dayMeta } from "@/content/days";
import type { DayKey } from "@/content/types";

const DAY_PATH: Record<DayKey, string> = {
  day_0: "/day-0",
  day_1: "/day-1",
  day_1_setup: "/day-1/setup",
  day_2: "/day-2",
  day_3: "/day-3",
};
import { LESSONS } from "@/content/lessons";
import { ZOOM_SCHEDULE } from "@/content/announcements";
import { TEAM } from "@/content/team";
import { BADGES } from "@/content/badges";
import {
  Award,
  ArrowRight,
  Megaphone,
  Calendar,
  Sparkles,
  Trophy,
  Flame,
  LifeBuoy,
} from "lucide-react";
import { dayCompletionPct } from "@/lib/progress";

export default async function DashboardPage() {
  const state = await requireStudent();
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(4);

  const current = dayMeta(state.currentDay);
  const nextDay = DAYS.find((d) => d.order === current.order + 1);
  const recentBadges = state.badges.slice(-3).map((k) => BADGES.find((b) => b.key === k)).filter(Boolean);
  const firstName = (state.fullName ?? state.email.split("@")[0]).split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold">Welcome back, {firstName}.</h1>
        <p className="text-fg-muted">
          {state.certified
            ? "You are 72-Hour Certified. Keep your daily routine sharp."
            : "Take it one module at a time. Future modules unlock as you finish each one."}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={<Sparkles className="size-4 text-brand-hover" />} label="Overall progress" value={`${state.overallPct}%`} />
        <Stat icon={<Flame className="size-4 text-warning" />} label="Current streak" value={`${state.streak.current} day${state.streak.current === 1 ? "" : "s"}`} />
        <Stat
          icon={<Trophy className="size-4 text-success" />}
          label="Certification status"
          value={state.certified ? "Certified" : "In progress"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-raised relative overflow-hidden">
          <div className="absolute right-6 top-6 chip chip-brand">Current</div>
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-fg-subtle">{current.label}</div>
            <h3 className="font-display text-xl font-semibold">{current.title}</h3>
            <p className="text-sm text-fg-muted">{current.subtitle}</p>
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-card">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-brand-hover"
                  style={{ width: `${dayCompletionPct(state, current.key)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-fg-muted">
                {dayCompletionPct(state, current.key)}%
              </span>
            </div>
            <Link href={`/${current.key.replace("_", "-")}`} className="btn-primary mt-2 w-fit">
              Continue <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="card-raised">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-fg-subtle">Next up</div>
            {nextDay ? (
              <>
                <h3 className="font-display text-xl font-semibold">{nextDay.title}</h3>
                <p className="text-sm text-fg-muted">{nextDay.subtitle}</p>
                <p className="pt-2 text-sm text-fg-subtle">
                  {state.unlocked[nextDay.key]
                    ? "Unlocked. Jump in when you're ready."
                    : nextDay.key === "day_1"
                      ? "Pass the Day 0 quiz to unlock."
                      : nextDay.key === "day_1_setup"
                        ? "Pass the Day 1 quiz to unlock setup."
                        : nextDay.key === "day_2"
                          ? "Day 1 Setup must be approved by the team."
                          : "Day 2 validation must be approved by the team."}
                </p>
              </>
            ) : (
              <p className="text-fg-muted">You've reached the end of onboarding. 🎉</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card">
          <SectionTitle icon={<Award className="size-4 text-brand-hover" />}>
            Recent badges
          </SectionTitle>
          <div className="mt-3 space-y-2">
            {recentBadges.length === 0 ? (
              <p className="text-sm text-fg-subtle">Earn your first badge by completing a lesson.</p>
            ) : (
              recentBadges.map((b) => (
                <div key={b!.key} className="flex items-center gap-3 rounded-xl border border-border bg-bg-raised px-3 py-2">
                  <div className="grid size-9 place-items-center rounded-full bg-brand/15">
                    <Award className="size-4 text-brand-hover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{b!.name}</div>
                    <div className="text-xs text-fg-subtle">{b!.description}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <SectionTitle icon={<Megaphone className="size-4 text-warning" />}>
            Announcements
          </SectionTitle>
          <div className="mt-3 space-y-2">
            {(announcements ?? []).map((a) => (
              <div key={a.id} className="rounded-xl border border-border bg-bg-raised px-3 py-2">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="line-clamp-2 text-xs text-fg-muted">{a.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <SectionTitle icon={<Calendar className="size-4 text-success" />}>
            Upcoming Zoom
          </SectionTitle>
          <div className="mt-3 space-y-2">
            {ZOOM_SCHEDULE.map((z) => (
              <div key={z.id} className="rounded-xl border border-border bg-bg-raised px-3 py-2">
                <div className="text-sm font-medium">{z.title}</div>
                <div className="text-xs text-fg-muted">
                  {z.when} · with {z.host}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <SectionTitle icon={<LifeBuoy className="size-4 text-fg-muted" />}>
          Support contacts
        </SectionTitle>
        <div className="mt-3 grid gap-3 md:grid-cols-5">
          {TEAM.map((m) => (
            <Link
              key={m.id}
              href="/support"
              className="rounded-xl border border-border bg-bg-raised p-3 text-center transition hover:bg-bg-hover"
            >
              <div className={`mx-auto grid size-10 place-items-center rounded-full bg-gradient-to-br ${m.color} font-semibold`}>
                {m.initials}
              </div>
              <div className="mt-2 text-sm font-medium">{m.name}</div>
              <div className="text-xs text-fg-subtle">{m.role}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="card-raised">
        <SectionTitle icon={<Sparkles className="size-4 text-brand-hover" />}>
          Your roadmap
        </SectionTitle>
        <div className="mt-3 space-y-2">
          {DAYS.map((d) => {
            const pct = dayCompletionPct(state, d.key);
            const unlocked = state.unlocked[d.key];
            const inner = (
              <>
                <div className="w-20 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                  {d.label}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{d.title}</div>
                  <div className="text-xs text-fg-muted">{LESSONS.filter((l) => l.day === d.key).length} lessons</div>
                </div>
                <div className="w-32">
                  <div className="h-1.5 overflow-hidden rounded-full bg-bg-card">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="w-10 text-right text-xs text-fg-muted">{pct}%</div>
              </>
            );
            const cls = `flex items-center gap-4 rounded-xl border border-border px-4 py-3 transition ${
              unlocked ? "hover:bg-bg-hover" : "cursor-not-allowed opacity-50"
            }`;
            return unlocked ? (
              <Link key={d.key} href={DAY_PATH[d.key]} className={cls}>
                {inner}
              </Link>
            ) : (
              <div key={d.key} className={cls} aria-disabled="true">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
      {icon}
      {children}
    </div>
  );
}

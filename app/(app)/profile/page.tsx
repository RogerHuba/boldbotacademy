import { requireStudent } from "@/lib/gating";
import { BADGES } from "@/content/badges";
import {
  Flame,
  Trophy,
  GraduationCap,
  Award,
  Sparkles,
  BookOpen,
  Wrench,
  Activity,
  Rocket,
} from "lucide-react";
import { ProfileEditor } from "./ProfileEditor";

const ICONS: Record<string, typeof Sparkles> = {
  Sparkles,
  GraduationCap,
  BookOpen,
  Wrench,
  Activity,
  Rocket,
  Award,
};

export default async function ProfilePage() {
  const state = await requireStudent();
  const earned = new Set(state.badges);
  const firstName = state.fullName?.split(" ")[0] ?? "";

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">You</div>
        <h1 className="font-display text-3xl font-semibold">Profile</h1>
        <p className="text-fg-muted">Update your details, change your password, see your badges.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card-raised md:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-2xl bg-brand/15 text-2xl font-semibold text-fg">
              {(state.fullName ?? state.email).slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="font-display text-2xl font-semibold">
                {state.fullName ?? "Add your name"}
              </div>
              <div className="text-sm text-fg-muted">{state.email}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-fg-subtle">
                Role · {state.role}
              </div>
            </div>
          </div>
          <ProfileEditor
            email={state.email}
            firstName={firstName}
            lastName={state.lastName ?? ""}
            phone={state.phone ?? ""}
            timezone={state.timezone}
          />
        </div>

        <div className="space-y-3">
          <Stat
            icon={Flame}
            label="Current streak"
            value={`${state.streak.current} day${state.streak.current === 1 ? "" : "s"}`}
          />
          <Stat
            icon={Trophy}
            label="Longest streak"
            value={`${state.streak.longest} day${state.streak.longest === 1 ? "" : "s"}`}
          />
          <Stat icon={Award} label="Badges earned" value={`${earned.size} / ${BADGES.length}`} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Badges</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {BADGES.map((b) => {
            const Icon = ICONS[b.icon] ?? Sparkles;
            const got = earned.has(b.key);
            return (
              <div
                key={b.key}
                className={
                  got ? "card-raised border-brand/40" : "card-raised opacity-60"
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      got
                        ? "grid size-10 place-items-center rounded-xl bg-brand/15 text-brand-hover"
                        : "grid size-10 place-items-center rounded-xl bg-bg text-fg-subtle"
                    }
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-xs text-fg-muted">
                      {got ? "Earned" : "Not yet earned"}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-fg-muted">{b.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="card-raised flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand-hover">
        <Icon className="size-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-fg-subtle">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

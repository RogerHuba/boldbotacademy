import Link from "next/link";
import { requireStudent } from "@/lib/gating";
import { TEAM } from "@/content/team";
import { MessageSquare, Mail, Calendar, BookOpen } from "lucide-react";

export default async function SupportPage() {
  await requireStudent();
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Help</div>
        <h1 className="font-display text-3xl font-semibold">Support</h1>
        <p className="text-fg-muted">
          Get help fast. Reach the right person, see what they cover, and find quick links to office
          hours and the FAQ.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <ChannelCard
          icon={MessageSquare}
          title="Slack"
          body="Day-to-day Q&A, fastest response from the team."
          cta="Open Slack"
          href="https://slack.com"
        />
        <ChannelCard
          icon={Calendar}
          title="Office Hours · Thu 4PM ET"
          body="Weekly Zoom Q&A with Tyler. New cohort intros every week."
          cta="Join Zoom"
          href="https://zoom.us"
        />
        <ChannelCard
          icon={Mail}
          title="Email"
          body="For billing or account access only. 24h response."
          cta="support@boldbot.com"
          href="mailto:support@boldbot.com"
        />
        <ChannelCard
          icon={BookOpen}
          title="FAQ & Troubleshooting"
          body="Self-serve answers to the most common questions."
          cta="Browse the Library"
          href="/resources"
          internal
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Meet your team</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <div key={m.id} className="card-raised flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${m.color} text-lg font-semibold text-fg`}
                >
                  {m.initials}
                </div>
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-fg-muted">{m.role}</div>
                </div>
              </div>
              <p className="text-sm text-fg-muted">{m.responsibilities}</p>
              <ul className="space-y-1 text-xs text-fg-muted">
                {m.helpsWith.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <span className="inline-block size-1.5 rounded-full bg-brand" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-bg px-3 py-2 text-xs text-fg">{m.contact}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ChannelCard({
  icon: Icon,
  title,
  body,
  cta,
  href,
  internal,
}: {
  icon: typeof MessageSquare;
  title: string;
  body: string;
  cta: string;
  href: string;
  internal?: boolean;
}) {
  const Wrapper = internal
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={href} className="card-raised flex flex-col gap-3 transition hover:border-brand/40">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="card-raised flex flex-col gap-3 transition hover:border-brand/40"
        >
          {children}
        </a>
      );
  return (
    <Wrapper>
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand-hover">
          <Icon className="size-5" />
        </div>
        <div className="font-medium">{title}</div>
      </div>
      <p className="text-sm text-fg-muted">{body}</p>
      <div className="text-xs font-medium text-brand-hover">{cta} →</div>
    </Wrapper>
  );
}

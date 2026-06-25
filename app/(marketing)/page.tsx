import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, GraduationCap } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <header className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="inline-block size-2.5 rounded-full bg-brand" />
          BoldBot Academy
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/login" className="btn-primary">Student log in <ArrowRight className="size-4" /></Link>
        </nav>
      </header>

      <section className="container grid gap-12 py-16 lg:grid-cols-2 lg:py-28">
        <div className="space-y-6">
          <div className="chip chip-brand">
            <Sparkles className="size-3.5" /> Your first 72 hours
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Deploy your first <span className="text-brand">automated trading bot</span>{" "}
            without overwhelm.
          </h1>
          <p className="max-w-xl text-lg text-fg-muted">
            BoldBot Academy is a focused 72-hour onboarding system. One bot. One account. Micros
            only. Future modules unlock only after you finish the current one — because the fastest
            path to a working bot is also the safest.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/login" className="btn-primary">
              Log in to your account <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="max-w-xl text-sm text-fg-subtle">
            Accounts are issued by the BoldBot team after enrollment. If you haven't received your
            login email yet, reach out to your onboarding lead.
          </p>
          <div className="flex flex-wrap gap-6 pt-4 text-sm text-fg-muted">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-success" /> Coach-reviewed setup</span>
            <span className="flex items-center gap-2"><GraduationCap className="size-4 text-brand" /> 80% quizzes to advance</span>
          </div>
        </div>

        <div className="card-raised relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/20 via-transparent to-transparent" />
          <div className="space-y-4">
            <Track step="Day 0" title="Welcome & Expectations" minutes={20} />
            <Track step="Day 1" title="Foundations + Setup" minutes={105} />
            <Track step="Day 2" title="Safe Trading Operations" minutes={60} />
            <Track step="Day 3" title="First Bot Deployment" minutes={90} />
          </div>
        </div>
      </section>

      <footer className="container border-t border-border py-8 text-sm text-fg-subtle">
        © {new Date().getFullYear()} BoldBot. Built for students who want a working system,
        not noise.
      </footer>
    </main>
  );
}

function Track({ step, title, minutes }: { step: string; title: string; minutes: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-bg-card px-4 py-3">
      <div>
        <div className="text-xs uppercase tracking-wider text-fg-subtle">{step}</div>
        <div className="font-medium">{title}</div>
      </div>
      <span className="chip">{minutes}m</span>
    </div>
  );
}

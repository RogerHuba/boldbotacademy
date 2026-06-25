import Link from "next/link";
import { CheckCircle2, Rocket, Award } from "lucide-react";
import { requireUnlockedDay } from "@/lib/gating";
import { DeployCelebration } from "./DeployCelebration";

export default async function Page() {
  const state = await requireUnlockedDay("day_3");
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in text-center">
      <DeployCelebration />
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-brand/20">
        <Rocket className="size-10 text-brand-hover" />
      </div>
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Day 3 · Live deployment</div>
        <h1 className="font-display text-4xl font-semibold">Congratulations.</h1>
        <p className="text-fg-muted">
          You are now ready to deploy your first bot. One bot. One account. Micros only.
          Stay in your routine and let the system do the work.
        </p>
      </div>
      <div className="card-raised text-left">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="size-4 text-success" /> Final confirmation
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-1 size-1.5 rounded-full bg-success" />
            <span>BoxSeats is armed on the correct chart and account.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 size-1.5 rounded-full bg-success" />
            <span>Max Profit Trigger is set.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 size-1.5 rounded-full bg-success" />
            <span>You know how to disable the bot in 5 seconds.</span>
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-center gap-3">
        {state.certified ? (
          <Link href="/certification" className="btn-primary">
            <Award className="size-4" /> View your certification
          </Link>
        ) : (
          <Link href="/certification" className="btn-primary">
            Check certification status
          </Link>
        )}
        <Link href="/dashboard" className="btn-ghost">Back to dashboard</Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, LogOut, Trophy, CircleDashed } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { StudentState } from "@/lib/progress";

export function Topbar({ state }: { state: StudentState }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-bg/80 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex flex-1 items-center gap-3 pl-14 md:pl-0">
        <div className="hidden flex-1 sm:flex sm:flex-col">
          <div className="text-xs text-fg-subtle">Overall progress</div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-48 overflow-hidden rounded-full bg-bg-raised">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-hover transition-all"
                style={{ width: `${state.overallPct}%` }}
              />
            </div>
            <span className="text-sm font-medium">{state.overallPct}%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="chip">
          <Flame className="size-3.5 text-warning" />
          {state.streak.current}-day streak
        </span>
        {state.certified ? (
          <span className="chip chip-success">
            <Trophy className="size-3.5" />
            Certified
          </span>
        ) : (
          <span className="chip">
            <CircleDashed className="size-3.5 text-fg-muted" />
            In progress
          </span>
        )}
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-xl border border-border bg-bg-card px-3 py-1.5 transition hover:border-brand/40"
          title="Edit your profile"
        >
          <span className="grid size-7 place-items-center rounded-full bg-brand/20 text-xs font-semibold text-brand-hover">
            {(state.fullName ?? state.email)[0]?.toUpperCase()}
          </span>
          <span className="hidden text-sm font-medium sm:block">
            {state.fullName ?? state.email.split("@")[0]}
          </span>
        </Link>
        <button
          onClick={async () => {
            const sb = createClient();
            await sb.auth.signOut();
            router.push("/login");
            router.refresh();
          }}
          className="btn-ghost inline-flex items-center gap-2"
          aria-label="Log off"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logoff</span>
        </button>
      </div>
    </div>
  );
}

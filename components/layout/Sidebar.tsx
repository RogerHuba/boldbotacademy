"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Lock,
  Check,
  Award,
  BookOpen,
  LifeBuoy,
  User2,
  TrendingUp,
  FolderOpen,
  Inbox,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentState } from "@/lib/progress";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  dayKey?: keyof StudentState["unlocked"];
  certGate?: boolean;
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/day-0", label: "Day 0", icon: BookOpen, dayKey: "day_0" },
  { href: "/day-1", label: "Day 1", icon: BookOpen, dayKey: "day_1" },
  { href: "/day-2", label: "Day 2", icon: BookOpen, dayKey: "day_2" },
  { href: "/day-3", label: "Day 3", icon: BookOpen, dayKey: "day_3" },
  { href: "/certification", label: "Certification", icon: Award, certGate: true },
  { href: "/resources", label: "Resources", icon: FolderOpen },
  { href: "/support", label: "Support", icon: LifeBuoy },
  { href: "/profile", label: "Profile", icon: User2 },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

export function Sidebar({ state }: { state: StudentState }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = state.role === "admin" || state.role === "staff";

  const content = (
    <nav className="flex h-full flex-col gap-1 px-3 py-5">
      <Link href="/dashboard" className="mb-4 flex items-center gap-2 px-2 py-2 text-base font-semibold">
        <span className="inline-block size-2.5 rounded-full bg-brand" />
        <span>BoldBot Academy</span>
      </Link>

      {NAV.map((item) => {
        const locked =
          (item.dayKey && !state.unlocked[item.dayKey]) ||
          (item.certGate && !state.certified);
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const completed = item.dayKey ? isDayComplete(state, item.dayKey) : false;

        return (
          <Link
            key={item.href}
            href={locked ? "#" : item.href}
            onClick={(e) => {
              if (locked) e.preventDefault();
              setOpen(false);
            }}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              isActive && !locked
                ? "bg-brand/15 text-fg"
                : "text-fg-muted hover:bg-bg-hover hover:text-fg",
              locked && "cursor-not-allowed opacity-50 hover:bg-transparent",
            )}
          >
            <span className="flex items-center gap-3">
              <item.icon className="size-4" />
              {item.label}
            </span>
            {locked ? (
              <Lock className="size-3.5 text-fg-subtle" />
            ) : completed ? (
              <Check className="size-3.5 text-success" />
            ) : null}
          </Link>
        );
      })}

      {isAdmin && (
        <div className="mt-6 border-t border-border pt-4">
          <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Admin
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-muted hover:bg-bg-hover hover:text-fg"
          >
            <LayoutDashboard className="size-4" />
            Pipeline
          </Link>
          <Link
            href="/admin/reviews"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-muted hover:bg-bg-hover hover:text-fg"
          >
            <Inbox className="size-4" />
            Review queue
          </Link>
          <Link
            href="/admin/students"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-muted hover:bg-bg-hover hover:text-fg"
          >
            <User2 className="size-4" />
            Students
          </Link>
        </div>
      )}
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex size-10 items-center justify-center rounded-xl border border-border bg-bg-card text-fg-muted md:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-bg-card md:block">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-border bg-bg-card">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-xl border border-border bg-bg-raised text-fg-muted"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

function isDayComplete(state: StudentState, day: keyof StudentState["unlocked"]) {
  // Day complete = quiz passed (where exists) AND validation approved (where exists)
  if (day === "day_0") return !!state.quizzes["day-0.quiz"]?.passed;
  if (day === "day_1") return !!state.quizzes["day-1.quiz"]?.passed;
  if (day === "day_2") return state.validations.day_2 === "approved";
  if (day === "day_3") return state.certified;
  return false;
}

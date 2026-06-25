"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Home } from "lucide-react";
import confetti from "canvas-confetti";
import { markLessonComplete } from "@/lib/actions/lessons";
import { getLessonNavigation } from "@/content/lessons";

export function CompleteButton({
  lessonSlug,
  completed,
  backHref,
}: {
  lessonSlug: string;
  completed: boolean;
  /** Fallback day URL when we can't resolve nav from the slug. */
  backHref: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(completed);
  const router = useRouter();
  const nav = getLessonNavigation(lessonSlug);
  const dayHref = nav?.dayHref ?? backHref;
  const prev = nav?.prev ?? null;
  const next = nav?.next ?? null;

  const handle = () =>
    startTransition(async () => {
      await markLessonComplete(lessonSlug);
      setDone(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#3B82F6", "#60A5FA", "#F5F5F7"],
      });
      router.refresh();
    });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {prev ? (
        <Link href={prev.href} className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-fg-subtle">Previous</span>
            <span className="text-sm">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block sm:w-32" aria-hidden />
      )}

      <Link
        href={dayHref}
        className="btn-ghost inline-flex items-center gap-2 text-sm"
        title="Back to day"
      >
        <Home className="size-4" />
        Back to day
      </Link>

      {done ? (
        next ? (
          <Link href={next.href} className="btn-primary inline-flex items-center gap-2">
            <span className="flex flex-col items-end leading-tight">
              <span className="text-[10px] uppercase tracking-wider opacity-80">Next</span>
              <span className="text-sm">{next.title}</span>
            </span>
            <ArrowRight className="size-4" />
          </Link>
        ) : (
          <Link href={dayHref} className="btn-primary inline-flex items-center gap-2">
            <Check className="size-4" />
            Lesson complete — back to day
          </Link>
        )
      ) : (
        <button disabled={pending} onClick={handle} className="btn-primary inline-flex items-center gap-2">
          {pending ? "Saving..." : "Mark complete"}
          {!pending && <ArrowRight className="size-4" />}
        </button>
      )}
    </div>
  );
}

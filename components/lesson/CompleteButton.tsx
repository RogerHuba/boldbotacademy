"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { markLessonComplete } from "@/lib/actions/lessons";

export function CompleteButton({
  lessonSlug,
  completed,
  backHref,
}: {
  lessonSlug: string;
  completed: boolean;
  backHref: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(completed);
  const router = useRouter();

  const handle = () =>
    startTransition(async () => {
      await markLessonComplete(lessonSlug);
      setDone(true);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 }, colors: ["#3B82F6", "#60A5FA", "#F5F5F7"] });
      router.refresh();
    });

  return (
    <div className="flex items-center justify-between">
      <button onClick={() => router.push(backHref)} className="btn-secondary">
        Back to day
      </button>
      {done ? (
        <button onClick={() => router.push(backHref)} className="btn-primary">
          <Check className="size-4" /> Lesson complete — back to day
        </button>
      ) : (
        <button disabled={pending} onClick={handle} className="btn-primary">
          {pending ? "Saving..." : "Mark complete"}
          {!pending && <ArrowRight className="size-4" />}
        </button>
      )}
    </div>
  );
}

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { getQuizForClient } from "@/content/quizzes";
import { requireUnlockedDay } from "@/lib/gating";

export default async function Page() {
  await requireUnlockedDay("day_1");
  const quiz = getQuizForClient("day-1.quiz")!;
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <Link href="/day-1" className="inline-flex items-center gap-2 text-xs text-fg-muted hover:text-fg">
        <ChevronLeft className="size-3.5" /> Day 1 · Foundations
      </Link>
      <h1 className="font-display text-3xl font-semibold md:text-4xl">{quiz.title}</h1>
      <p className="text-fg-muted">Score {quiz.passingScore}% or higher to unlock Day 1 Setup.</p>
      <QuizRunner quiz={quiz} nextHref="/day-1/setup" />
    </div>
  );
}

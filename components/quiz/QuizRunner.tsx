"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { submitQuiz, type QuizResult } from "@/lib/actions/quiz";
import type { ClientQuestion } from "@/content/quizzes";

type Quiz = {
  slug: string;
  title: string;
  passingScore: number;
  questions: ClientQuestion[];
};

export function QuizRunner({ quiz, nextHref }: { quiz: Quiz; nextHref: string }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pending, startTransition] = useTransition();

  const allAnswered = quiz.questions.every((q) => answers[q.id]);

  function submit() {
    startTransition(async () => {
      const res = await submitQuiz(quiz.slug, answers);
      setResult(res);
      if (res.passed) {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      }
      router.refresh();
    });
  }

  function retry() {
    setAnswers({});
    setResult(null);
  }

  if (result) return <Result result={result} quiz={quiz} onRetry={retry} nextHref={nextHref} />;

  return (
    <div className="space-y-6">
      {quiz.questions.map((q, i) => (
        <div key={q.id} className="card-raised">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Question {i + 1} of {quiz.questions.length}
          </div>
          <h3 className="font-display text-lg font-semibold">{q.prompt}</h3>
          <div className="mt-4 space-y-2">
            {q.options.map((o) => (
              <label
                key={o.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                  answers[q.id] === o.id
                    ? "border-brand bg-brand/10"
                    : "border-border bg-bg-card hover:bg-bg-hover"
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={o.id}
                  checked={answers[q.id] === o.id}
                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                  className="size-4 accent-brand"
                />
                <span className="text-sm">{o.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-bg-raised p-4">
        <div className="text-xs text-fg-muted">
          {Object.keys(answers).length} / {quiz.questions.length} answered. Passing score:{" "}
          <strong className="text-fg">{quiz.passingScore}%</strong>.
        </div>
        <button onClick={submit} disabled={!allAnswered || pending} className="btn-primary">
          {pending ? "Scoring..." : "Submit quiz"}
        </button>
      </div>
    </div>
  );
}

function Result({
  result,
  quiz,
  onRetry,
  nextHref,
}: {
  result: QuizResult;
  quiz: Quiz;
  onRetry: () => void;
  nextHref: string;
}) {
  const router = useRouter();
  return (
    <div className="card-raised space-y-5">
      <div className="flex flex-col items-center gap-2 text-center">
        {result.passed ? (
          <CheckCircle2 className="size-14 text-success" />
        ) : (
          <XCircle className="size-14 text-danger" />
        )}
        <div className="font-display text-3xl font-semibold">{result.scorePct}%</div>
        <p className="text-fg-muted">
          {result.passed
            ? "Nicely done. You're cleared to continue."
            : `You need ${quiz.passingScore}% to advance. Review the lessons and try again.`}
        </p>
      </div>

      <div className="space-y-2">
        {result.perQuestion.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
              p.correct
                ? "border-success/30 bg-success/10"
                : "border-danger/30 bg-danger/10"
            }`}
          >
            {p.correct ? (
              <CheckCircle2 className="size-4 text-success" />
            ) : (
              <AlertCircle className="size-4 text-danger" />
            )}
            <span>Question {i + 1}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onRetry} className="btn-secondary">
          <RefreshCw className="size-4" /> Try again
        </button>
        {result.passed && (
          <button onClick={() => router.push(nextHref)} className="btn-primary">
            Continue <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

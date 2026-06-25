"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getQuiz } from "@/content/quizzes";
import { awardBadge } from "@/lib/badges";

export type QuizResult = {
  ok: boolean;
  scorePct: number;
  passed: boolean;
  perQuestion: { id: string; correct: boolean }[];
  error?: string;
};

export async function submitQuiz(
  quizSlug: string,
  answers: Record<string, string>,
): Promise<QuizResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, scorePct: 0, passed: false, perQuestion: [], error: "Not signed in" };
  }

  const quiz = getQuiz(quizSlug);
  if (!quiz) {
    return { ok: false, scorePct: 0, passed: false, perQuestion: [], error: "Unknown quiz" };
  }

  const perQuestion = quiz.questions.map((q) => ({
    id: q.id,
    correct: answers[q.id] === q.correct,
  }));
  const correctCount = perQuestion.filter((p) => p.correct).length;
  const scorePct = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = scorePct >= quiz.passingScore;

  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    quiz_slug: quizSlug,
    score_pct: scorePct,
    passed,
    answers,
  });

  if (passed) {
    await awardBadge(user.id, "first_quiz_passed");
    if (quizSlug === "day-1.quiz") {
      await awardBadge(user.id, "foundations_complete");
    }
  }

  revalidatePath("/", "layout");
  return { ok: true, scorePct, passed, perQuestion };
}

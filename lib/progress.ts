import "server-only";
import { createClient } from "@/lib/supabase/server";
import { DAYS, dayMeta } from "@/content/days";
import { CHECKLISTS } from "@/content/checklists";
import { VALIDATIONS } from "@/content/validations";
import type { DayKey } from "@/content/types";

export type StudentState = {
  userId: string;
  fullName: string | null;
  lastName: string | null;
  phone: string | null;
  timezone: string;
  onboardedAt: string | null;
  email: string;
  role: "student" | "admin" | "staff";
  unlocked: Record<DayKey, boolean>;
  lessons: Record<string, { completed: boolean; watchedPct: number }>;
  quizzes: Record<string, { passed: boolean; bestScore: number; attempts: number }>;
  validations: Record<DayKey, "not_submitted" | "pending" | "approved" | "needs_correction">;
  checklists: Record<string, Record<string, boolean>>;
  badges: string[];
  streak: { current: number; longest: number };
  overallPct: number;
  certified: boolean;
  certNumber?: string;
  currentDay: DayKey;
};

const EMPTY_VALIDATION = {
  day_0: "not_submitted",
  day_1: "not_submitted",
  day_1_setup: "not_submitted",
  day_2: "not_submitted",
  day_3: "not_submitted",
} as const;

export async function getStudentState(): Promise<StudentState | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [
    profile,
    lessonsRes,
    quizzesRes,
    validationsRes,
    checklistRes,
    badgesRes,
    streakRes,
    certRes,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("lesson_progress").select("*").eq("user_id", user.id),
    supabase.from("quiz_attempts").select("*").eq("user_id", user.id),
    supabase.from("validation_submissions").select("*").eq("user_id", user.id),
    supabase.from("checklist_state").select("*").eq("user_id", user.id),
    supabase.from("badges").select("*").eq("user_id", user.id),
    supabase.from("streaks").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("certifications").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  const lessons: StudentState["lessons"] = {};
  for (const row of lessonsRes.data ?? []) {
    lessons[row.lesson_slug] = { completed: true, watchedPct: row.video_watched_pct ?? 0 };
  }

  const quizzes: StudentState["quizzes"] = {};
  for (const row of quizzesRes.data ?? []) {
    const existing = quizzes[row.quiz_slug];
    quizzes[row.quiz_slug] = {
      passed: existing?.passed || row.passed,
      bestScore: Math.max(existing?.bestScore ?? 0, row.score_pct),
      attempts: (existing?.attempts ?? 0) + 1,
    };
  }

  const validations: StudentState["validations"] = { ...EMPTY_VALIDATION };
  for (const spec of VALIDATIONS) {
    const dayRows = (validationsRes.data ?? []).filter((r) => r.day_key === spec.day);
    if (dayRows.length === 0) {
      validations[spec.day] = "not_submitted";
      continue;
    }
    const everySlotApproved = spec.slots.every((slot) =>
      dayRows.find((r) => r.slot === slot.key && r.status === "approved"),
    );
    const anyNeedsCorrection = dayRows.some((r) => r.status === "needs_correction");
    if (everySlotApproved) validations[spec.day] = "approved";
    else if (anyNeedsCorrection) validations[spec.day] = "needs_correction";
    else validations[spec.day] = "pending";
  }

  const checklists: StudentState["checklists"] = {};
  for (const row of checklistRes.data ?? []) {
    checklists[row.lesson_slug] ??= {};
    checklists[row.lesson_slug][row.item_key] = !!row.checked;
  }

  const badges = (badgesRes.data ?? []).map((b) => b.badge_key);

  const streak = streakRes.data
    ? { current: streakRes.data.current_streak ?? 0, longest: streakRes.data.longest_streak ?? 0 }
    : { current: 0, longest: 0 };

  // unlock formula
  const unlocked: Record<DayKey, boolean> = {
    day_0: true,
    day_1: !!quizzes["day-0.quiz"]?.passed,
    day_1_setup: !!quizzes["day-1.quiz"]?.passed,
    day_2: validations.day_1_setup === "approved",
    day_3: validations.day_2 === "approved",
  };

  // deployment-sim checklist all checked?
  const depSim = checklists["day-3.deployment-sim"] ?? {};
  const depSimComplete =
    CHECKLISTS.find((c) => c.key === "deployment-sim")?.items.every(
      (it) => depSim[it.key],
    ) ?? false;

  const allQuizzesPassed = ["day-0.quiz", "day-1.quiz", "day-2.quiz"].every(
    (s) => quizzes[s]?.passed,
  );
  const allValidationsApproved =
    validations.day_1_setup === "approved" && validations.day_2 === "approved";

  const certified = !!certRes.data || (allQuizzesPassed && allValidationsApproved && depSimComplete);

  // current day = first locked OR last
  let currentDay: DayKey = "day_0";
  for (const d of DAYS) {
    if (unlocked[d.key]) currentDay = d.key;
  }

  // overall pct = weighted
  const totalLessons = DAYS.flatMap((d) => d.lessons).length;
  const doneLessons = Object.keys(lessons).length;
  const lessonPct = doneLessons / totalLessons;
  const quizPct =
    ["day-0.quiz", "day-1.quiz", "day-2.quiz"].filter((s) => quizzes[s]?.passed).length / 3;
  const valPct =
    (Number(validations.day_1_setup === "approved") +
      Number(validations.day_2 === "approved")) /
    2;
  const overallPct = Math.round(((lessonPct + quizPct + valPct) / 3) * 100);

  return {
    userId: user.id,
    fullName: profile.data?.full_name ?? null,
    lastName: profile.data?.last_name ?? null,
    phone: profile.data?.phone ?? null,
    timezone: profile.data?.timezone ?? "America/New_York",
    onboardedAt: profile.data?.onboarded_at ?? null,
    email: profile.data?.email ?? user.email!,
    role: (profile.data?.role as "student" | "admin" | "staff") ?? "student",
    unlocked,
    lessons,
    quizzes,
    validations,
    checklists,
    badges,
    streak,
    overallPct,
    certified,
    certNumber: certRes.data?.certificate_number,
    currentDay,
  };
}

export function unlockReason(state: StudentState, day: DayKey): string {
  switch (day) {
    case "day_1":
      return "Pass the Day 0 quiz to unlock.";
    case "day_1_setup":
      return "Pass the Day 1 quiz to unlock setup.";
    case "day_2":
      return "Day 1 Setup must be approved by the team.";
    case "day_3":
      return "Day 2 validation must be approved by the team.";
    default:
      return "Locked.";
  }
}

export function dayCompletionPct(state: StudentState, day: DayKey): number {
  const meta = dayMeta(day);
  const total = meta.lessons.length + (meta.quizSlug ? 1 : 0) + (meta.validationSlug ? 1 : 0);
  if (total === 0) return 0;
  let done = meta.lessons.filter((slug) => state.lessons[slug]?.completed).length;
  if (meta.quizSlug && state.quizzes[meta.quizSlug]?.passed) done++;
  if (meta.validationSlug && state.validations[meta.validationSlug] === "approved") done++;
  return Math.round((done / total) * 100);
}

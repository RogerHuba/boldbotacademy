import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { VALIDATIONS } from "@/content/validations";
import type { DayKey } from "@/content/types";

export type Stage = "day_0" | "day_1" | "day_1_setup" | "day_2" | "day_3" | "certified";

export const STAGE_ORDER: Stage[] = [
  "day_0",
  "day_1",
  "day_1_setup",
  "day_2",
  "day_3",
  "certified",
];

export const STAGE_LABELS: Record<Stage, string> = {
  day_0: "Day 0 · Welcome",
  day_1: "Day 1 · Foundations",
  day_1_setup: "Day 1 · Setup",
  day_2: "Day 2 · Safe Ops",
  day_3: "Day 3 · Deploy",
  certified: "72-Hour Certified",
};

export const QUIZ_TITLES: Record<string, string> = {
  "day-0.quiz": "Day 0 Quiz",
  "day-1.quiz": "Day 1 Quiz",
  "day-2.quiz": "Day 2 Quiz",
};

const TRACKED_QUIZZES = ["day-0.quiz", "day-1.quiz", "day-2.quiz"];

export type QuizStat = {
  slug: string;
  title: string;
  attempts: number;
  bestScore: number;
  passed: boolean;
  lastAttemptAt: string | null;
};

export type ValidationStatus = "approved" | "pending" | "needs_correction" | "not_submitted";

export type StudentRow = {
  userId: string;
  fullName: string | null;
  email: string;
  createdAt: string;
  lastActiveAt: string;
  stage: Stage;
  stageLabel: string;
  daysSinceLastActive: number;
  quizStats: QuizStat[];
  validations: Record<DayKey, ValidationStatus>;
  pendingReviews: number;
  hasCorrection: boolean;
  stuck: boolean;
  needsAttention: boolean;
  reasons: string[];
};

export type RecentQuizAttempt = {
  userId: string;
  name: string;
  quizSlug: string;
  quizTitle: string;
  scorePct: number;
  passed: boolean;
  createdAt: string;
};

export type PipelineSnapshot = {
  totalStudents: number;
  totalCertified: number;
  totalPendingReviewSessions: number;
  totalAttention: number;
  funnel: { stage: Stage; label: string; count: number; pct: number }[];
  attention: StudentRow[];
  recentQuizActivity: RecentQuizAttempt[];
  students: StudentRow[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const STUCK_THRESHOLD_DAYS = 3;
const QUIZ_ATTEMPT_FLOOR = 2;

export async function getPipelineSnapshot(): Promise<PipelineSnapshot> {
  const admin = createAdminClient();

  const [profilesRes, quizRes, validationsRes, certsRes] = await Promise.all([
    admin
      .from("profiles")
      .select("id, email, full_name, role, created_at, last_active_at")
      .eq("role", "student")
      .order("created_at", { ascending: false }),
    admin
      .from("quiz_attempts")
      .select("user_id, quiz_slug, score_pct, passed, created_at")
      .order("created_at", { ascending: false }),
    admin
      .from("validation_submissions")
      .select("user_id, day_key, slot, status, submitted_at")
      .order("submitted_at", { ascending: false }),
    admin.from("certifications").select("user_id, certificate_number, issued_at"),
  ]);

  const profiles = profilesRes.data ?? [];
  const quizzes = quizRes.data ?? [];
  const validationsAll = validationsRes.data ?? [];
  const certs = certsRes.data ?? [];

  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const studentIds = new Set(profiles.map((p) => p.id));

  type QuizAgg = { attempts: number; bestScore: number; passed: boolean; lastAt: string };
  const quizzesByUser = new Map<string, Map<string, QuizAgg>>();
  for (const r of quizzes) {
    if (!quizzesByUser.has(r.user_id)) quizzesByUser.set(r.user_id, new Map());
    const map = quizzesByUser.get(r.user_id)!;
    const existing = map.get(r.quiz_slug);
    map.set(r.quiz_slug, {
      attempts: (existing?.attempts ?? 0) + 1,
      bestScore: Math.max(existing?.bestScore ?? 0, r.score_pct),
      passed: existing?.passed || r.passed,
      lastAt: existing?.lastAt ?? r.created_at,
    });
  }

  const validationsByUser = new Map<string, Record<DayKey, ValidationStatus>>();
  const pendingCountByUser = new Map<string, number>();
  const correctionByUser = new Set<string>();
  const pendingSessions = new Set<string>();

  for (const id of studentIds) {
    validationsByUser.set(id, {
      day_0: "not_submitted",
      day_1: "not_submitted",
      day_1_setup: "not_submitted",
      day_2: "not_submitted",
      day_3: "not_submitted",
    });
  }

  for (const spec of VALIDATIONS) {
    const byUser = new Map<string, typeof validationsAll>();
    for (const v of validationsAll) {
      if (v.day_key !== spec.day) continue;
      if (!byUser.has(v.user_id)) byUser.set(v.user_id, []);
      byUser.get(v.user_id)!.push(v);
    }
    for (const [userId, rows] of byUser) {
      const allByDay = validationsByUser.get(userId);
      if (!allByDay) continue;
      const everyApproved = spec.slots.every((slot) =>
        rows.find((r) => r.slot === slot.key && r.status === "approved"),
      );
      const anyCorrection = rows.some((r) => r.status === "needs_correction");
      const pendingCount = rows.filter((r) => r.status === "pending").length;
      if (everyApproved) allByDay[spec.day] = "approved";
      else if (anyCorrection) {
        allByDay[spec.day] = "needs_correction";
        correctionByUser.add(userId);
      } else if (pendingCount > 0) allByDay[spec.day] = "pending";
      if (pendingCount > 0) {
        pendingCountByUser.set(
          userId,
          (pendingCountByUser.get(userId) ?? 0) + pendingCount,
        );
        pendingSessions.add(`${userId}:${spec.day}`);
      }
    }
  }

  const certifiedSet = new Set(certs.map((c) => c.user_id));

  function computeStage(userId: string): Stage {
    if (certifiedSet.has(userId)) return "certified";
    const q = quizzesByUser.get(userId);
    const v = validationsByUser.get(userId)!;
    if (v.day_2 === "approved") return "day_3";
    if (v.day_1_setup === "approved") return "day_2";
    if (q?.get("day-1.quiz")?.passed) return "day_1_setup";
    if (q?.get("day-0.quiz")?.passed) return "day_1";
    return "day_0";
  }

  const now = Date.now();

  const students: StudentRow[] = profiles.map((p) => {
    const stage = computeStage(p.id);
    const lastActive = p.last_active_at ?? p.created_at;
    const daysSinceLastActive = Math.floor((now - new Date(lastActive).getTime()) / DAY_MS);

    const qMap = quizzesByUser.get(p.id);
    const quizStats: QuizStat[] = TRACKED_QUIZZES.map((slug) => {
      const agg = qMap?.get(slug);
      return {
        slug,
        title: QUIZ_TITLES[slug],
        attempts: agg?.attempts ?? 0,
        bestScore: agg?.bestScore ?? 0,
        passed: agg?.passed ?? false,
        lastAttemptAt: agg?.lastAt ?? null,
      };
    });

    const strugglingQuiz = quizStats.find(
      (q) => !q.passed && q.attempts >= QUIZ_ATTEMPT_FLOOR,
    );
    const hasCorrection = correctionByUser.has(p.id);
    const stuck = stage !== "certified" && daysSinceLastActive >= STUCK_THRESHOLD_DAYS;

    const reasons: string[] = [];
    if (strugglingQuiz)
      reasons.push(
        `${strugglingQuiz.title}: ${strugglingQuiz.attempts} attempts, best ${strugglingQuiz.bestScore}%`,
      );
    if (hasCorrection) reasons.push("Validation needs correction");
    if (stuck) reasons.push(`No activity in ${daysSinceLastActive}d`);

    return {
      userId: p.id,
      fullName: p.full_name,
      email: p.email,
      createdAt: p.created_at,
      lastActiveAt: lastActive,
      stage,
      stageLabel: STAGE_LABELS[stage],
      daysSinceLastActive,
      quizStats,
      validations: validationsByUser.get(p.id)!,
      pendingReviews: pendingCountByUser.get(p.id) ?? 0,
      hasCorrection,
      stuck,
      needsAttention: !!strugglingQuiz || hasCorrection || stuck,
      reasons,
    };
  });

  const funnel = STAGE_ORDER.map((stage) => {
    const count = students.filter((s) => s.stage === stage).length;
    const pct = students.length === 0 ? 0 : Math.round((count / students.length) * 100);
    return { stage, label: STAGE_LABELS[stage], count, pct };
  });

  const attention = students
    .filter((s) => s.needsAttention)
    .sort((a, b) => b.daysSinceLastActive - a.daysSinceLastActive);

  const recentQuizActivity: RecentQuizAttempt[] = quizzes
    .filter((r) => studentIds.has(r.user_id))
    .slice(0, 10)
    .map((r) => {
      const profile = profileById.get(r.user_id);
      return {
        userId: r.user_id,
        name: profile?.full_name ?? profile?.email ?? "Unknown",
        quizSlug: r.quiz_slug,
        quizTitle: QUIZ_TITLES[r.quiz_slug] ?? r.quiz_slug,
        scorePct: r.score_pct,
        passed: r.passed,
        createdAt: r.created_at,
      };
    });

  return {
    totalStudents: students.length,
    totalCertified: students.filter((s) => s.stage === "certified").length,
    totalPendingReviewSessions: pendingSessions.size,
    totalAttention: attention.length,
    funnel,
    attention,
    recentQuizActivity,
    students,
  };
}

export async function getStudentDetail(userId: string) {
  const admin = createAdminClient();
  const [profileRes, lessonsRes, quizRes, validationRes, certRes, badgesRes, streakRes] =
    await Promise.all([
      admin
        .from("profiles")
        .select("id, email, full_name, role, created_at, last_active_at, timezone")
        .eq("id", userId)
        .single(),
      admin
        .from("lesson_progress")
        .select("lesson_slug, completed_at, video_watched_pct")
        .eq("user_id", userId),
      admin
        .from("quiz_attempts")
        .select("quiz_slug, score_pct, passed, answers, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      admin
        .from("validation_submissions")
        .select("day_key, slot, status, submitted_at, reviewed_at, reviewer_note")
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false }),
      admin
        .from("certifications")
        .select("certificate_number, issued_at")
        .eq("user_id", userId)
        .maybeSingle(),
      admin.from("badges").select("badge_key, awarded_at").eq("user_id", userId),
      admin
        .from("streaks")
        .select("current_streak, longest_streak, last_active_date")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

  return {
    profile: profileRes.data,
    lessons: lessonsRes.data ?? [],
    quizAttempts: quizRes.data ?? [],
    validations: validationRes.data ?? [],
    certification: certRes.data,
    badges: badgesRes.data ?? [],
    streak: streakRes.data,
  };
}

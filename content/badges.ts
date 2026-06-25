import type { Badge } from "./types";

export const BADGES: Badge[] = [
  {
    key: "welcome_aboard",
    name: "Welcome Aboard",
    description: "Created your account and started Day 0.",
    icon: "Sparkles",
  },
  {
    key: "first_quiz_passed",
    name: "First Quiz Passed",
    description: "Scored 80% or higher on your first quiz.",
    icon: "GraduationCap",
  },
  {
    key: "foundations_complete",
    name: "Foundations Complete",
    description: "Finished Day 1 — Futures, contracts, prop firms, VPS.",
    icon: "BookOpen",
  },
  {
    key: "setup_completed",
    name: "Setup Completed",
    description: "VPS, NinjaTrader, and workspace verified by the team.",
    icon: "Wrench",
  },
  {
    key: "simulation_completed",
    name: "Simulation Completed",
    description: "Practiced manual trading and emergency procedures.",
    icon: "Activity",
  },
  {
    key: "first_bot_deployed",
    name: "First Bot Deployed",
    description: "BoxSeats Starter is live on micros.",
    icon: "Rocket",
  },
  {
    key: "72_hour_certified",
    name: "72-Hour Certified",
    description: "All quizzes passed. All validations approved. You did it.",
    icon: "Award",
  },
];

export function badgeMeta(key: string) {
  return BADGES.find((b) => b.key === key);
}

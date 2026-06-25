import type { DayKey } from "./types";

export type DayMeta = {
  key: DayKey;
  label: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  order: number;
  lessons: string[];
  quizSlug?: string;
  validationSlug?: DayKey;
};

export const DAYS: DayMeta[] = [
  {
    key: "day_0",
    label: "Day 0",
    title: "Welcome & Expectations",
    subtitle: "Meet the team and set the tone for your first 72 hours.",
    estimatedMinutes: 20,
    order: 0,
    lessons: ["day-0.welcome", "day-0.ecosystem", "day-0.team", "day-0.expectations"],
    quizSlug: "day-0.quiz",
  },
  {
    key: "day_1",
    label: "Day 1",
    title: "Foundations",
    subtitle: "Futures, contracts, prop firms, and VPS basics.",
    estimatedMinutes: 60,
    order: 1,
    lessons: [
      "day-1.futures-basics",
      "day-1.mini-vs-micro",
      "day-1.prop-firm-rules",
      "day-1.vps-basics",
    ],
    quizSlug: "day-1.quiz",
  },
  {
    key: "day_1_setup",
    label: "Day 1 · Setup",
    title: "Setup & Configuration",
    subtitle: "VPS, NinjaTrader, and your trading workspace.",
    estimatedMinutes: 45,
    order: 2,
    lessons: ["day-1.vps-setup", "day-1.nt-setup", "day-1.workspace-setup"],
    validationSlug: "day_1_setup",
  },
  {
    key: "day_2",
    label: "Day 2",
    title: "Safe Trading Operations",
    subtitle: "How trades work, manual trading, and emergency procedures.",
    estimatedMinutes: 60,
    order: 3,
    lessons: [
      "day-2.how-trades-work",
      "day-2.manual-trading",
      "day-2.emergency",
      "day-2.exit-ninjatrader",
      "day-2.exercise-1",
      "day-2.exercise-2",
    ],
    validationSlug: "day_2",
  },
  {
    key: "day_3",
    label: "Day 3",
    title: "First Bot Deployment",
    subtitle: "BoxSeats, the status panel, and your live launch.",
    estimatedMinutes: 90,
    order: 4,
    lessons: [
      "day-3.boxseats",
      "day-3.status-panel",
      "day-3.daily-procedures",
      "day-3.deployment-sim",
    ],
  },
];

export function dayMeta(key: DayKey): DayMeta {
  return DAYS.find((d) => d.key === key)!;
}

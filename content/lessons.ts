import type { DayKey, Lesson } from "./types";

const DAY_BASE: Record<DayKey, string> = {
  day_0: "/day-0",
  day_1: "/day-1",
  day_1_setup: "/day-1/setup",
  day_2: "/day-2",
  day_3: "/day-3",
};

export const LESSONS: Lesson[] = [
  // ─────────────────────────────  DAY 0  ─────────────────────────────
  {
    slug: "day-0.welcome",
    day: "day_0",
    title: "Welcome to BoldBot",
    estimatedMinutes: 5,
    videoId: "dQw4w9WgXcQ",
    summary:
      "A 3-minute orientation: what you're going to build over the next 72 hours, and why we do it in this order.",
    takeaways: [
      "Your goal this week is not profit — it is one safely-deployed bot on micros.",
      "Future modules unlock only after you finish the current one.",
      "Slow is smooth. Smooth is fast.",
    ],
    body:
      "BoldBot is a team-built ecosystem: trained coaches, a working tech stack, and a strategy library. Your job over the next three days is to learn the system, set up safely, and prove you can run one bot without intervention.",
  },
  {
    slug: "day-0.ecosystem",
    day: "day_0",
    title: "The BoldBot Ecosystem",
    estimatedMinutes: 5,
    summary:
      "A map of every tool and channel you'll touch this week — Slack, Zoom, Calendar, Resources, Support, Spreadsheets.",
    takeaways: [
      "Slack is the main channel for support and community.",
      "Zoom calls are scheduled in the Calendar — replays live in Resources.",
      "All spreadsheets and templates live in Resources.",
    ],
    interactive: "ecosystem",
  },
  {
    slug: "day-0.team",
    day: "day_0",
    title: "Meet The Team",
    estimatedMinutes: 5,
    summary:
      "The five people behind BoldBot and exactly who to ping when you get stuck.",
    takeaways: [
      "Amy → onboarding & success.",
      "Irma → billing & access.",
      "Tyler → trade strategy.",
      "Dan → tech & VPS support.",
      "Jenn → Slack & calls.",
    ],
    interactive: "team",
  },
  {
    slug: "day-0.expectations",
    day: "day_0",
    title: "Setting Expectations",
    estimatedMinutes: 5,
    summary:
      "Why the first week is about discipline, not profit. Common patterns that sink new students.",
    takeaways: [
      "You are not here to get rich this week.",
      "You are here to build a system that can produce consistent income.",
      "Avoid the four common mistakes: too many bots, minis too early, ignoring rules, constant tweaking.",
    ],
    interactive: "expectations",
  },

  // ─────────────────────────────  DAY 1  ─────────────────────────────
  {
    slug: "day-1.futures-basics",
    day: "day_1",
    title: "Futures Basics",
    estimatedMinutes: 15,
    videoId: "dQw4w9WgXcQ",
    summary:
      "Trading days, market sessions, and the terms you'll see every day. Built for total beginners.",
    takeaways: [
      "Regular session: 9:30 AM – 4:00 PM ET; many bots only trade RTH.",
      "Globex (overnight) is thinner and riskier — most BoldBot strategies stay out.",
      "Tick, point, contract — three terms you must internalize.",
    ],
    body:
      "Futures contracts represent an agreement to buy or sell an underlying asset at a fixed price on a future date. For day-trading purposes, what matters is the tick size, tick value, session hours, and the rules of the venue (CME, ICE, etc).",
  },
  {
    slug: "day-1.mini-vs-micro",
    day: "day_1",
    title: "Mini vs Micro Contracts",
    estimatedMinutes: 15,
    summary:
      "Side-by-side comparison cards plus an interactive risk calculator. You will trade micros only this week.",
    takeaways: [
      "Micros are 1/10 the size of minis. Tick value is 1/10.",
      "An 8-tick stop on MES = $10 risk; on ES = $100.",
      "Until you have proven discipline and a green sim record, you trade micros only.",
    ],
    interactive: "contract-compare",
  },
  {
    slug: "day-1.prop-firm-rules",
    day: "day_1",
    title: "Prop Firm Rules",
    estimatedMinutes: 15,
    summary:
      "Daily drawdown, trailing drawdown, consistency, payouts, and the most common violations.",
    takeaways: [
      "Daily drawdown is calculated from the start-of-day balance.",
      "Trailing drawdown follows your highest point and locks at the funded threshold.",
      "Consistency rules cap your best day relative to your average.",
    ],
    interactive: "prop-firm-rules",
  },
  {
    slug: "day-1.vps-basics",
    day: "day_1",
    title: "VPS Basics",
    estimatedMinutes: 15,
    videoId: "dQw4w9WgXcQ",
    summary:
      "Why a VPS matters, how to keep bots online, and what to do when you disconnect.",
    takeaways: [
      "A VPS keeps NinjaTrader running 24/7 even if your home power or internet fails.",
      "Always log out via Disconnect — never close the window.",
      "Bookmark the VPS IP, port, username, and password somewhere safe.",
    ],
  },
  {
    slug: "day-1.vps-setup",
    day: "day_1_setup",
    title: "VPS Setup",
    estimatedMinutes: 15,
    summary:
      "Step-by-step from receiving your credentials to a connected RDP session.",
    takeaways: [
      "Save your credentials to a password manager, not a sticky note.",
      "Always reconnect using the IP, not the saved profile name.",
    ],
    checklistKey: "vps-setup",
  },
  {
    slug: "day-1.nt-setup",
    day: "day_1_setup",
    title: "NinjaTrader Setup",
    estimatedMinutes: 15,
    summary:
      "Install NinjaTrader, link your prop-firm credentials, verify data feed.",
    takeaways: [
      "Use the prop firm's exact instructions for the connection adapter.",
      "Confirm a live tick is streaming before you proceed.",
    ],
    checklistKey: "ninjatrader-setup",
  },
  {
    slug: "day-1.workspace-setup",
    day: "day_1_setup",
    title: "Workspace Setup",
    estimatedMinutes: 15,
    summary:
      "Import templates and workspaces, configure Chart Trader and Max Profit Trigger.",
    takeaways: [
      "Templates carry the visual settings; workspaces carry the layout.",
      "Max Profit Trigger is non-negotiable — set it before you enable any bot.",
    ],
    checklistKey: "workspace-setup",
  },

  // ─────────────────────────────  DAY 2  ─────────────────────────────
  {
    slug: "day-2.how-trades-work",
    day: "day_2",
    title: "How Trades Work",
    estimatedMinutes: 10,
    summary:
      "An interactive diagram of entry, stop loss, take profit, and how risk maps to reward.",
    takeaways: [
      "Every trade has an entry, a stop, and a target.",
      "Risk is the distance from entry to stop times tick value times contracts.",
      "Reward-to-risk is a planning tool — not a guarantee.",
    ],
    interactive: "trade-diagram",
  },
  {
    slug: "day-2.manual-trading",
    day: "day_2",
    title: "Manual Trading Basics",
    estimatedMinutes: 15,
    summary:
      "Practice Buy Market, Sell Market, Close Position, and Flatten Everything in a safe simulator.",
    takeaways: [
      "Buy/Sell Market = immediate order at current price.",
      "Close Position = exit only this contract on this chart.",
      "Flatten Everything = panic button. Use it when in doubt.",
    ],
    interactive: "manual-trading",
  },
  {
    slug: "day-2.emergency",
    day: "day_2",
    title: "Emergency Procedures",
    estimatedMinutes: 15,
    summary:
      "Decision-tree flowchart for the five things that go wrong: internet, VPS, sizing, frozen NT, runaway trade.",
    takeaways: [
      "Internet down → connect via phone hotspot, re-enter RDP.",
      "Wrong position size → flatten, then re-enter at intended size.",
      "Runaway trade → flatten, disable bot, then investigate.",
    ],
    interactive: "emergency-tree",
  },
  {
    slug: "day-2.exit-ninjatrader",
    day: "day_2",
    title: "Properly Exiting NinjaTrader",
    estimatedMinutes: 5,
    summary:
      "A short, mandatory checklist for closing NT without leaving orders or bots running.",
    takeaways: [
      "Disable all strategies before closing NT.",
      "Confirm flat across all accounts.",
      "Disconnect, don't close the window.",
    ],
    interactive: "exit-checklist",
  },
  {
    slug: "day-2.exercise-1",
    day: "day_2",
    title: "Practical Exercise #1 — Simulated Trade",
    estimatedMinutes: 10,
    summary:
      "Complete one full round-trip trade in the simulator. We track your completion automatically.",
    takeaways: ["Place an order, watch fill, exit cleanly."],
    interactive: "manual-trading",
  },
  {
    slug: "day-2.exercise-2",
    day: "day_2",
    title: "Practical Exercise #2 — Enable & Disable",
    estimatedMinutes: 5,
    summary:
      "Practice enabling a strategy on a chart, then disabling it before market close.",
    takeaways: [
      "Enable a bot via Chart Trader → Strategies.",
      "Disable via the same panel before walking away.",
    ],
    interactive: "exit-checklist",
  },

  // ─────────────────────────────  DAY 3  ─────────────────────────────
  {
    slug: "day-3.boxseats",
    day: "day_3",
    title: "BoxSeats Starter Strategy",
    estimatedMinutes: 20,
    videoId: "dQw4w9WgXcQ",
    summary:
      "What BoxSeats does, when it trades, expected drawdown, and normal-day examples.",
    takeaways: [
      "BoxSeats trades the morning open on MES only by default.",
      "Expected drawdown: ~$200 intraday on a worst-case sequence.",
      "If behavior looks abnormal, disable the bot and ping Tyler.",
    ],
  },
  {
    slug: "day-3.status-panel",
    day: "day_3",
    title: "Reading The Status Panel",
    estimatedMinutes: 15,
    summary:
      "Interactive mockup of the BoxSeats status panel — green, yellow, red, and warnings.",
    takeaways: [
      "Green = bot is armed and waiting for a setup.",
      "Yellow = position open; let the bot manage.",
      "Red = error or disabled — read the message first.",
    ],
    interactive: "status-panel",
  },
  {
    slug: "day-3.daily-procedures",
    day: "day_3",
    title: "Daily Operating Procedures",
    estimatedMinutes: 15,
    summary:
      "Morning checklist, evening checklist, mobile-friendly and printable.",
    takeaways: [
      "Morning: VPS connected, NT logged in, account correct, bot armed.",
      "Evening: bot disabled, flat across accounts, day logged.",
    ],
    interactive: "daily-procedures",
  },
  {
    slug: "day-3.deployment-sim",
    day: "day_3",
    title: "Deployment Simulation",
    estimatedMinutes: 20,
    summary:
      "A mandatory checklist you must complete before live deployment. Every item must be checked.",
    takeaways: [
      "Eight items, all must be true.",
      "If you can't honestly check one, get help — don't skip.",
    ],
    interactive: "deployment-sim",
    checklistKey: "deployment-sim",
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function lessonsForDay(day: string): Lesson[] {
  return LESSONS.filter((l) => l.day === day);
}

export function lessonHref(lesson: Lesson): string {
  const segment = lesson.slug.split(".").pop();
  return `${DAY_BASE[lesson.day]}/${segment}`;
}

export type LessonNavigation = {
  dayHref: string;
  prev: { href: string; title: string } | null;
  next: { href: string; title: string } | null;
};

export function getLessonNavigation(slug: string): LessonNavigation | null {
  const lesson = getLesson(slug);
  if (!lesson) return null;
  const dayLessons = lessonsForDay(lesson.day);
  const idx = dayLessons.findIndex((l) => l.slug === slug);
  const prevLesson = idx > 0 ? dayLessons[idx - 1] : null;
  const nextLesson =
    idx >= 0 && idx < dayLessons.length - 1 ? dayLessons[idx + 1] : null;
  return {
    dayHref: DAY_BASE[lesson.day],
    prev: prevLesson ? { href: lessonHref(prevLesson), title: prevLesson.title } : null,
    next: nextLesson ? { href: lessonHref(nextLesson), title: nextLesson.title } : null,
  };
}

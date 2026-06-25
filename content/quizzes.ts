import "server-only";
import type { Quiz } from "./types";

// ⚠️ Answer keys are server-only. Never import this file from a client component.

export const QUIZZES: Quiz[] = [
  {
    slug: "day-0.quiz",
    day: "day_0",
    title: "Day 0 — Welcome Quiz",
    passingScore: 80,
    questions: [
      {
        id: "q1",
        prompt: "What is the realistic goal for your first 72 hours at BoldBot?",
        options: [
          { id: "a", label: "Make $1,000 of profit." },
          { id: "b", label: "Pass a prop firm evaluation." },
          { id: "c", label: "Safely deploy one bot on micros." },
          { id: "d", label: "Run three bots simultaneously." },
        ],
        correct: "c",
      },
      {
        id: "q2",
        prompt: "Which channel is the main hub for support and community?",
        options: [
          { id: "a", label: "Email" },
          { id: "b", label: "Slack" },
          { id: "c", label: "SMS" },
          { id: "d", label: "Discord" },
        ],
        correct: "b",
      },
      {
        id: "q3",
        prompt: "Who is your first point of contact for onboarding questions?",
        options: [
          { id: "a", label: "Tyler" },
          { id: "b", label: "Dan" },
          { id: "c", label: "Amy" },
          { id: "d", label: "Irma" },
        ],
        correct: "c",
      },
      {
        id: "q4",
        prompt: "Which of the following is a common mistake we want to avoid?",
        options: [
          { id: "a", label: "Following the curriculum in order." },
          { id: "b", label: "Trading micros first." },
          { id: "c", label: "Running too many bots at once." },
          { id: "d", label: "Asking questions in Slack." },
        ],
        correct: "c",
      },
      {
        id: "q5",
        prompt: "True or false: You should jump to mini contracts as soon as your bot looks good.",
        options: [
          { id: "a", label: "True" },
          { id: "b", label: "False" },
        ],
        correct: "b",
      },
    ],
  },
  {
    slug: "day-1.quiz",
    day: "day_1",
    title: "Day 1 — Foundations Quiz",
    passingScore: 80,
    questions: [
      {
        id: "q1",
        prompt: "What is the approximate tick value of MES (Micro E-mini S&P)?",
        options: [
          { id: "a", label: "$1.25" },
          { id: "b", label: "$12.50" },
          { id: "c", label: "$5.00" },
          { id: "d", label: "$0.10" },
        ],
        correct: "a",
      },
      {
        id: "q2",
        prompt: "If you take an 8-tick stop on one MES contract, what is your dollar risk?",
        options: [
          { id: "a", label: "$5" },
          { id: "b", label: "$10" },
          { id: "c", label: "$80" },
          { id: "d", label: "$100" },
        ],
        correct: "b",
      },
      {
        id: "q3",
        prompt: "What is daily drawdown calculated from?",
        options: [
          { id: "a", label: "Your highest-ever balance." },
          { id: "b", label: "Your start-of-day balance." },
          { id: "c", label: "The firm's initial funding amount." },
          { id: "d", label: "Your trailing low." },
        ],
        correct: "b",
      },
      {
        id: "q4",
        prompt: "Why do we use a VPS?",
        options: [
          { id: "a", label: "It's faster than home internet for all websites." },
          { id: "b", label: "It keeps NinjaTrader and bots online 24/7." },
          { id: "c", label: "It is required by the broker." },
          { id: "d", label: "It saves money on electricity." },
        ],
        correct: "b",
      },
      {
        id: "q5",
        prompt: "Which contracts will you trade during your first 72 hours?",
        options: [
          { id: "a", label: "Minis only." },
          { id: "b", label: "Micros only." },
          { id: "c", label: "A mix." },
          { id: "d", label: "Options." },
        ],
        correct: "b",
      },
      {
        id: "q6",
        prompt: "Trailing drawdown typically:",
        options: [
          { id: "a", label: "Resets every day." },
          { id: "b", label: "Follows your highest equity until you reach a threshold." },
          { id: "c", label: "Only applies to weekends." },
          { id: "d", label: "Is the same as daily drawdown." },
        ],
        correct: "b",
      },
    ],
  },
  {
    slug: "day-2.quiz",
    day: "day_2",
    title: "Day 2 — Operations Quiz",
    passingScore: 80,
    questions: [
      {
        id: "q1",
        prompt: "Your VPS disconnects mid-session. What is the FIRST thing you check?",
        options: [
          { id: "a", label: "Your home internet." },
          { id: "b", label: "Your phone signal." },
          { id: "c", label: "The market direction." },
          { id: "d", label: "Whether the bot is profitable." },
        ],
        correct: "a",
      },
      {
        id: "q2",
        prompt: "You discover a position that is the wrong size. What do you do?",
        options: [
          { id: "a", label: "Wait to see if it works out." },
          { id: "b", label: "Add more contracts to average." },
          { id: "c", label: "Flatten, then re-enter at the intended size." },
          { id: "d", label: "Disable the chart and walk away." },
        ],
        correct: "c",
      },
      {
        id: "q3",
        prompt: "Which button cancels every open order and exits every position?",
        options: [
          { id: "a", label: "Close Position" },
          { id: "b", label: "Flatten Everything" },
          { id: "c", label: "Disable Strategy" },
          { id: "d", label: "Disconnect" },
        ],
        correct: "b",
      },
      {
        id: "q4",
        prompt: "Before closing NinjaTrader for the day, you must:",
        options: [
          { id: "a", label: "Disable strategies and confirm flat." },
          { id: "b", label: "Just close the window." },
          { id: "c", label: "Restart the VPS." },
          { id: "d", label: "Change your password." },
        ],
        correct: "a",
      },
      {
        id: "q5",
        prompt: "A trade is running away against you and the bot's stop is far away. What is the safest action?",
        options: [
          { id: "a", label: "Move the stop to break-even." },
          { id: "b", label: "Add to the position." },
          { id: "c", label: "Flatten, disable the bot, then investigate." },
          { id: "d", label: "Take a nap." },
        ],
        correct: "c",
      },
    ],
  },
];

export function getQuiz(slug: string) {
  return QUIZZES.find((q) => q.slug === slug);
}

export type ClientQuestion = {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
};

export function getQuizForClient(slug: string) {
  const q = getQuiz(slug);
  if (!q) return undefined;
  return {
    slug: q.slug,
    day: q.day,
    title: q.title,
    passingScore: q.passingScore,
    questions: q.questions.map<ClientQuestion>(({ id, prompt, options }) => ({
      id,
      prompt,
      options,
    })),
  };
}

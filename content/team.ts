import type { TeamMember } from "./types";

export const TEAM: TeamMember[] = [
  {
    id: "amy",
    name: "Amy",
    role: "Billing & Initial Setup",
    responsibilities:
      "Handles all billing questions, Premium upgrades, mentorship purchases, and your initial setup (Machine ID / Access). Send your Machine ID and access details to Amy.",
    helpsWith: [
      "Billing questions",
      "Premium upgrades",
      "Mentorship purchases",
      "Machine ID / Access",
    ],
    contact: "Slack DM @amy",
    initials: "A",
    color: "from-pink-500/30 to-pink-700/10",
  },
  {
    id: "irma",
    name: "Irma",
    role: "Setup Verification & Algo",
    responsibilities:
      "Makes sure your setup is correct — right chart, right settings. Once you're set up, Irma is also your point of contact for Algo questions.",
    helpsWith: [
      "Setup verification",
      "Chart & settings checks",
      "Algo questions",
    ],
    contact: "Slack DM @irma",
    initials: "I",
    color: "from-amber-500/30 to-amber-700/10",
  },
  {
    id: "tyler",
    name: "Tyler",
    role: "Weekly Planning Zoom",
    responsibilities:
      "Runs a weekly Zoom call to help you build a plan for your account. Tyler cannot give specific advice on what to run, but he shares what has worked: diversify and stay slow & steady.",
    helpsWith: [
      "Weekly Zoom call",
      "Account planning",
      "What has worked historically",
    ],
    contact: "Slack #weekly-zoom",
    initials: "T",
    color: "from-brand/30 to-brand-subtle/10",
  },
  {
    id: "lauren",
    name: "Lauren",
    role: "Student Lead & Mentorship",
    responsibilities:
      "Handles all student questions. If you are in the mentorship program, Lauren is your ONLY contact — DM her directly. Escalations from Amy, Irma, and Tyler also route to Lauren.",
    helpsWith: [
      "All student questions",
      "Mentorship (sole contact)",
      "Escalations from the admin team",
    ],
    contact: "Slack DM @lauren",
    initials: "L",
    color: "from-violet-500/30 to-violet-700/10",
  },
  {
    id: "jenn",
    name: "Jenn",
    role: "Dev / Testing — Do Not Contact",
    responsibilities:
      "Jenn is not part of the Admin team and not an employee of BoldBot. She is on Roger's dev/testing side and cannot help with your bots.",
    helpsWith: [],
    contact: "Please do not DM — message Amy, Irma, Tyler, or Lauren instead.",
    initials: "J",
    color: "from-zinc-500/30 to-zinc-700/10",
    notContactable: true,
    notContactableReason:
      "Not on the Admin team and not a BoldBot employee — part of Roger's dev/testing crew. Cannot assist with bots.",
  },
  {
    id: "dan",
    name: "Dan",
    role: "Dev / Testing — Do Not Contact",
    responsibilities:
      "Dan is not part of the Admin team and not an employee of BoldBot. He is on Roger's dev/testing side and cannot help with your bots.",
    helpsWith: [],
    contact: "Please do not DM — message Amy, Irma, Tyler, or Lauren instead.",
    initials: "D",
    color: "from-zinc-500/30 to-zinc-700/10",
    notContactable: true,
    notContactableReason:
      "Not on the Admin team and not a BoldBot employee — part of Roger's dev/testing crew. Cannot assist with bots.",
  },
];

export const TEAM_HOURS_NOTE =
  "All employees work on Eastern Time (EST). Questions sent late in the evening will likely receive a response the following morning.";

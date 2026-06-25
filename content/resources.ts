export type Resource = {
  id: string;
  title: string;
  category:
    | "Beginner Videos"
    | "Setup Guides"
    | "Bot Settings"
    | "Prop Firm Guides"
    | "FAQ"
    | "Troubleshooting"
    | "Zoom Replays";
  description: string;
  url?: string;
  duration?: string;
};

export const RESOURCES: Resource[] = [
  { id: "r1", title: "What is BoldBot?", category: "Beginner Videos", description: "A 5-minute introduction.", duration: "5m" },
  { id: "r2", title: "Tour of the Member Portal", category: "Beginner Videos", description: "Where everything lives.", duration: "8m" },
  { id: "r3", title: "VPS Setup Walkthrough", category: "Setup Guides", description: "From order email to first connection.", duration: "12m" },
  { id: "r4", title: "NinjaTrader 8 Install Guide", category: "Setup Guides", description: "Install, license, connect.", duration: "10m" },
  { id: "r5", title: "Workspace Import Cheat Sheet", category: "Setup Guides", description: "PDF.", duration: "PDF" },
  { id: "r6", title: "BoxSeats Settings Reference", category: "Bot Settings", description: "Every parameter, what it does.", duration: "PDF" },
  { id: "r7", title: "Apex Trader Funding — Rules", category: "Prop Firm Guides", description: "Drawdown, payouts, consistency.", duration: "Guide" },
  { id: "r8", title: "TopstepX — Rules", category: "Prop Firm Guides", description: "Drawdown, payouts.", duration: "Guide" },
  { id: "r9", title: "Why isn't my bot trading?", category: "FAQ", description: "The 6 most common reasons.", duration: "FAQ" },
  { id: "r10", title: "What if my VPS disconnects?", category: "FAQ", description: "Recovery steps.", duration: "FAQ" },
  { id: "r11", title: "NT shows red — what now?", category: "Troubleshooting", description: "Decision tree.", duration: "Guide" },
  { id: "r12", title: "Office Hours — Last Thursday", category: "Zoom Replays", description: "Q&A on Day 2 setup.", duration: "47m" },
  { id: "r13", title: "BoxSeats Deep Dive", category: "Zoom Replays", description: "Strategy walkthrough.", duration: "1h 12m" },
];

export const RESOURCE_CATEGORIES = [
  "Beginner Videos",
  "Setup Guides",
  "Bot Settings",
  "Prop Firm Guides",
  "FAQ",
  "Troubleshooting",
  "Zoom Replays",
] as const;

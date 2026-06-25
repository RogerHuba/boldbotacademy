export type DayKey = "day_0" | "day_1" | "day_1_setup" | "day_2" | "day_3";

export type Lesson = {
  slug: string;
  day: DayKey;
  title: string;
  estimatedMinutes: number;
  videoId?: string;
  summary: string;
  takeaways: string[];
  body?: string;
  interactive?:
    | "ecosystem"
    | "team"
    | "expectations"
    | "contract-compare"
    | "risk-calculator"
    | "prop-firm-rules"
    | "trade-diagram"
    | "manual-trading"
    | "emergency-tree"
    | "exit-checklist"
    | "status-panel"
    | "daily-procedures"
    | "deployment-sim";
  checklistKey?: string;
  validationDay?: DayKey;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correct: string;
  explanation?: string;
};

export type Quiz = {
  slug: string;
  day: DayKey;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
};

export type ChecklistItem = { key: string; label: string; note?: string };
export type Checklist = { key: string; title: string; items: ChecklistItem[] };

export type ValidationSlot = {
  key: string;
  label: string;
  hint: string;
};
export type ValidationSpec = {
  day: DayKey;
  title: string;
  slots: ValidationSlot[];
};

export type Badge = {
  key: string;
  name: string;
  description: string;
  icon: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  responsibilities: string;
  helpsWith: string[];
  contact: string;
  initials: string;
  color: string;
};

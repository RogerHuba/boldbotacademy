"use client";

import { useState } from "react";

const RULES = [
  {
    id: "daily",
    title: "Daily Drawdown",
    body:
      "Maximum loss from your start-of-day balance. Hit it and your account is closed for the day or permanently — depends on the firm.",
    example: "Start of day: $50,000. Daily DD: $1,250. Balance can't fall below $48,750.",
  },
  {
    id: "trailing",
    title: "Trailing Drawdown",
    body:
      "Follows your highest equity peak by a fixed dollar amount, then locks once you reach the funded threshold.",
    example: "Peak: $52,500. Trailing DD: $2,500. New floor: $50,000.",
  },
  {
    id: "consistency",
    title: "Consistency Rule",
    body:
      "Caps your single best day relative to your total profit. Prevents a one-off lucky day from being your whole payout.",
    example: "If consistency is 30%, your best day can't be more than 30% of total payout-eligible profit.",
  },
  {
    id: "payout",
    title: "Payout Rules",
    body:
      "How and when you can withdraw. Typically requires minimum trading days, profit thresholds, and a buffer.",
    example: "Most firms: 5+ trading days, $500+ above original balance, leave a $100 buffer.",
  },
];

export function PropFirmRules() {
  const [active, setActive] = useState(RULES[0].id);
  const current = RULES.find((r) => r.id === active)!;
  return (
    <div className="card-raised">
      <div className="flex flex-wrap gap-2">
        {RULES.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(r.id)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition ${
              active === r.id
                ? "border-brand bg-brand/15 text-fg"
                : "border-border bg-bg-card text-fg-muted hover:text-fg"
            }`}
          >
            {r.title}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        <h3 className="font-display text-xl font-semibold">{current.title}</h3>
        <p className="text-sm text-fg-muted">{current.body}</p>
        <div className="rounded-xl border border-border bg-bg-card p-3 text-xs">
          <span className="text-fg-subtle">Example: </span>
          {current.example}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const STATES = [
  {
    id: "green",
    label: "Green — Armed",
    body: "Bot is loaded, market is open, no position. Waiting for a setup.",
    color: "border-success/40 bg-success/10 text-success",
    advice: "Do nothing. This is the normal idle state.",
  },
  {
    id: "yellow",
    label: "Yellow — Position open",
    body: "A trade is in progress. Stop and target are set.",
    color: "border-warning/40 bg-warning/10 text-warning",
    advice: "Let the bot manage it. Don't move the stop manually.",
  },
  {
    id: "red",
    label: "Red — Disabled or error",
    body: "Bot is off or NinjaTrader hit an error.",
    color: "border-danger/40 bg-danger/10 text-danger",
    advice: "Read the error message. If unsure, screenshot and ping #tech-support.",
  },
  {
    id: "max",
    label: "Warning — Max Profit hit",
    body: "Bot has hit your Max Profit Trigger for the day and disabled itself.",
    color: "border-brand/40 bg-brand/10 text-brand-hover",
    advice: "Don't override. The system saved you from giving back.",
  },
];

export function StatusPanelMock() {
  const [current, setCurrent] = useState(STATES[0]);

  return (
    <div className="card-raised space-y-4">
      <div className="grid gap-2 sm:grid-cols-4">
        {STATES.map((s) => (
          <button
            key={s.id}
            onClick={() => setCurrent(s)}
            className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
              current.id === s.id ? s.color : "border-border bg-bg-card text-fg-muted hover:text-fg"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-bg-card p-5">
        <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${current.color}`}>
          <span className="inline-block size-2 rounded-full bg-current" />
          BoxSeats · {current.label}
        </div>
        <div className="space-y-2">
          <div className="text-sm">{current.body}</div>
          <div className="text-xs text-fg-muted">
            <strong>What to do:</strong> {current.advice}
          </div>
        </div>
      </div>
    </div>
  );
}

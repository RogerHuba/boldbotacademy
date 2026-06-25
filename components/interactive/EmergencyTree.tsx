"use client";

import { useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";

const SCENARIOS = [
  {
    id: "internet",
    title: "Internet went down",
    steps: [
      "Switch to your phone hotspot.",
      "Reconnect to the VPS over RDP.",
      "Confirm NinjaTrader is still connected.",
      "Verify position size — if wrong, flatten and restart.",
    ],
  },
  {
    id: "vps",
    title: "VPS disconnected",
    steps: [
      "Open RDP and reconnect using the saved IP.",
      "Open NinjaTrader and check Connections.",
      "Confirm the bot is still running on the correct chart.",
      "If unsure, disable the bot then re-enable after verifying.",
    ],
  },
  {
    id: "size",
    title: "Wrong position size",
    steps: [
      "Do not 'fix' by adding more contracts.",
      "Hit Flatten Everything immediately.",
      "Re-enter at intended size via Chart Trader.",
      "Log it in your daily journal.",
    ],
  },
  {
    id: "frozen",
    title: "NinjaTrader frozen",
    steps: [
      "Open Task Manager on the VPS.",
      "Check CPU/memory before killing.",
      "If unresponsive, end the task and relaunch.",
      "On relaunch, confirm flat across accounts before enabling bots.",
    ],
  },
  {
    id: "runaway",
    title: "Trade running away",
    steps: [
      "Hit Flatten Everything.",
      "Disable the strategy.",
      "Screenshot the chart and order log.",
      "Post in #tech-support with screenshots.",
    ],
  },
];

export function EmergencyTree() {
  const [open, setOpen] = useState<string | null>(SCENARIOS[0].id);

  return (
    <div className="card-raised space-y-3">
      <div className="flex items-center gap-2 text-warning">
        <AlertTriangle className="size-4" />
        <span className="text-sm font-semibold">Decision tree — pick what happened</span>
      </div>
      {SCENARIOS.map((s) => (
        <div key={s.id} className="rounded-xl border border-border bg-bg-card">
          <button
            onClick={() => setOpen(open === s.id ? null : s.id)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="font-medium">{s.title}</span>
            <ChevronRight className={`size-4 text-fg-muted transition ${open === s.id ? "rotate-90" : ""}`} />
          </button>
          {open === s.id && (
            <ol className="space-y-1 border-t border-border px-4 py-3 text-sm">
              {s.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand/20 text-xs font-semibold text-brand-hover">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
}

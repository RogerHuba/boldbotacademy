"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { setChecklistItem } from "@/lib/actions/lessons";
import type { Checklist as ChecklistType } from "@/content/types";

export function Checklist({
  checklist,
  lessonSlug,
  initial,
}: {
  checklist: ChecklistType;
  lessonSlug: string;
  initial: Record<string, boolean>;
}) {
  const [state, setState] = useState<Record<string, boolean>>(initial);
  const [, startTransition] = useTransition();

  const toggle = (key: string) => {
    const next = !state[key];
    setState((s) => ({ ...s, [key]: next }));
    startTransition(() => {
      setChecklistItem(lessonSlug, key, next);
    });
  };

  const done = checklist.items.filter((i) => state[i.key]).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{checklist.title}</h3>
        <span className="chip">
          {done} / {checklist.items.length}
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {checklist.items.map((item) => {
          const checked = state[item.key];
          return (
            <li key={item.key}>
              <button
                onClick={() => toggle(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                  checked
                    ? "border-success/40 bg-success/10"
                    : "border-border bg-bg-raised hover:bg-bg-hover"
                }`}
              >
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-md border ${
                    checked ? "border-success bg-success" : "border-border"
                  }`}
                >
                  {checked && <Check className="size-3.5 text-white" />}
                </span>
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  {item.note && <div className="text-xs text-fg-muted">{item.note}</div>}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

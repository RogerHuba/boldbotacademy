import { AlertTriangle, Quote } from "lucide-react";

const MISTAKES = [
  "Running too many bots",
  "Using minis too early",
  "Ignoring prop firm rules",
  "Changing settings constantly",
];

export function ExpectationsCard() {
  return (
    <div className="space-y-4">
      <div className="card-raised relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/20 via-transparent to-transparent" />
        <Quote className="size-6 text-brand/60" />
        <p className="mt-3 font-display text-2xl font-semibold leading-snug">
          You are not here to get rich this week. You are here to build a system that can produce
          consistent income.
        </p>
      </div>
      <div className="rounded-2xl border border-warning/40 bg-warning/5 p-5">
        <div className="flex items-center gap-2 text-warning">
          <AlertTriangle className="size-5" />
          <h3 className="font-display text-lg font-semibold">Common mistakes new students make</h3>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {MISTAKES.map((m) => (
            <li
              key={m}
              className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-fg"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

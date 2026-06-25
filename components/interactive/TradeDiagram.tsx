"use client";

import { useState } from "react";

export function TradeDiagram() {
  const [entry, setEntry] = useState(5300);
  const [stop, setStop] = useState(5295);
  const [target, setTarget] = useState(5310);

  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  const rr = risk > 0 ? (reward / risk).toFixed(2) : "—";

  // graphical positions
  const lo = Math.min(stop, target, entry) - 2;
  const hi = Math.max(stop, target, entry) + 2;
  const span = hi - lo;
  const yOf = (price: number) => `${((hi - price) / span) * 100}%`;

  return (
    <div className="card-raised space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <NumField label="Entry" value={entry} setValue={setEntry} />
        <NumField label="Stop loss" value={stop} setValue={setStop} />
        <NumField label="Take profit" value={target} setValue={setTarget} />
      </div>

      <div className="relative h-56 rounded-2xl border border-border bg-bg-card">
        <Line label={`Target ${target}`} y={yOf(target)} color="bg-success" textColor="text-success" />
        <Line label={`Entry ${entry}`} y={yOf(entry)} color="bg-brand" textColor="text-brand-hover" />
        <Line label={`Stop ${stop}`} y={yOf(stop)} color="bg-danger" textColor="text-danger" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat label="Risk (pts)" value={risk.toFixed(2)} />
        <Stat label="Reward (pts)" value={reward.toFixed(2)} />
        <Stat label="R:R" value={rr} highlight />
      </div>
    </div>
  );
}

function NumField({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-fg-muted">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="input"
      />
    </label>
  );
}

function Line({ label, y, color, textColor }: { label: string; y: string; color: string; textColor: string }) {
  return (
    <div className="absolute inset-x-0 flex items-center gap-3 px-4" style={{ top: y, transform: "translateY(-50%)" }}>
      <span className={`text-xs font-medium ${textColor}`}>{label}</span>
      <div className={`h-px flex-1 ${color}/60`} />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border border-border p-3 ${highlight ? "bg-brand/15" : "bg-bg-card"}`}>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className={`font-display text-xl font-semibold ${highlight ? "text-brand-hover" : ""}`}>{value}</div>
    </div>
  );
}

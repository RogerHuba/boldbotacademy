"use client";

import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, XCircle, AlertOctagon } from "lucide-react";

type Position = "flat" | "long" | "short";

export function ManualTradingSim() {
  const [position, setPosition] = useState<Position>("flat");
  const [entry, setEntry] = useState<number | null>(null);
  const [price, setPrice] = useState(5300);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => +(p + (Math.random() - 0.5) * 0.5).toFixed(2));
    }, 800);
    return () => clearInterval(id);
  }, []);

  const pnl = entry === null ? 0 : position === "long" ? price - entry : entry - price;

  function buy() {
    setPosition("long");
    setEntry(price);
    setLog((l) => [`▲ Buy market @ ${price.toFixed(2)}`, ...l]);
  }
  function sell() {
    setPosition("short");
    setEntry(price);
    setLog((l) => [`▼ Sell market @ ${price.toFixed(2)}`, ...l]);
  }
  function close() {
    setLog((l) => [`✕ Close position @ ${price.toFixed(2)} (P&L ${pnl.toFixed(2)})`, ...l]);
    setPosition("flat");
    setEntry(null);
  }
  function flatten() {
    setLog((l) => [`⚠ FLATTEN EVERYTHING @ ${price.toFixed(2)}`, ...l]);
    setPosition("flat");
    setEntry(null);
  }

  return (
    <div className="card-raised space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-fg-subtle">Simulated MES — practice safely</div>
          <div className="font-display text-3xl font-semibold">{price.toFixed(2)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-fg-subtle">Position</div>
          <div className="font-display text-lg font-semibold capitalize">
            {position === "flat" ? "—" : position}
          </div>
          {entry !== null && (
            <div className={`text-xs ${pnl >= 0 ? "text-success" : "text-danger"}`}>
              P&L {pnl.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button onClick={buy} className="flex flex-col items-center gap-1 rounded-xl border border-success/30 bg-success/10 px-3 py-3 text-success transition hover:bg-success/20">
          <ArrowUp className="size-5" />
          <span className="text-sm font-medium">Buy Market</span>
        </button>
        <button onClick={sell} className="flex flex-col items-center gap-1 rounded-xl border border-danger/30 bg-danger/10 px-3 py-3 text-danger transition hover:bg-danger/20">
          <ArrowDown className="size-5" />
          <span className="text-sm font-medium">Sell Market</span>
        </button>
        <button onClick={close} disabled={position === "flat"} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-bg-card px-3 py-3 transition hover:bg-bg-hover disabled:opacity-50">
          <XCircle className="size-5" />
          <span className="text-sm font-medium">Close Position</span>
        </button>
        <button onClick={flatten} className="flex flex-col items-center gap-1 rounded-xl border border-warning/30 bg-warning/10 px-3 py-3 text-warning transition hover:bg-warning/20">
          <AlertOctagon className="size-5" />
          <span className="text-sm font-medium">Flatten All</span>
        </button>
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-3 text-xs">
        <div className="mb-1 text-fg-subtle">Order log</div>
        <ul className="max-h-32 overflow-auto font-mono">
          {log.length === 0 && <li className="text-fg-subtle">No orders yet.</li>}
          {log.slice(0, 8).map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

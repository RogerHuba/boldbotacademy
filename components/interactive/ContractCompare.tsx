"use client";

import { useState } from "react";

const PAIRS = [
  {
    micro: { symbol: "MES", name: "Micro E-mini S&P 500", tick: 1.25, contract: "$5/pt", risk8: 10 },
    mini: { symbol: "ES", name: "E-mini S&P 500", tick: 12.5, contract: "$50/pt", risk8: 100 },
  },
  {
    micro: { symbol: "MNQ", name: "Micro E-mini Nasdaq", tick: 0.5, contract: "$2/pt", risk8: 4 },
    mini: { symbol: "NQ", name: "E-mini Nasdaq", tick: 5, contract: "$20/pt", risk8: 40 },
  },
  {
    micro: { symbol: "MGC", name: "Micro Gold", tick: 1, contract: "$10/pt", risk8: 8 },
    mini: { symbol: "GC", name: "Gold", tick: 10, contract: "$100/pt", risk8: 80 },
  },
];

export function ContractCompare() {
  const [contracts, setContracts] = useState(1);

  return (
    <div className="space-y-4">
      <div className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium">Risk Calculator</div>
          <div className="text-xs text-fg-muted">
            See how dollar risk on an 8-tick stop scales with contract count.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-fg-muted">Contracts</label>
          <input
            type="number"
            min={1}
            max={10}
            value={contracts}
            onChange={(e) => setContracts(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
            className="input h-10 w-20 text-center"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {PAIRS.map(({ micro, mini }) => (
          <div key={micro.symbol} className="card-raised space-y-3">
            <div className="flex items-center justify-between text-xs text-fg-subtle">
              <span>{micro.name.replace("Micro ", "")}</span>
              <span className="chip chip-brand">{contracts}x</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Side title={`${micro.symbol} (micro)`} tick={micro.tick} contract={micro.contract} risk={micro.risk8 * contracts} highlight />
              <Side title={`${mini.symbol} (mini)`} tick={mini.tick} contract={mini.contract} risk={mini.risk8 * contracts} />
            </div>
            <div className="text-xs text-fg-subtle">
              8-tick stop · {contracts} contract{contracts > 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Side({
  title,
  tick,
  contract,
  risk,
  highlight,
}: {
  title: string;
  tick: number;
  contract: string;
  risk: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight ? "border-brand/40 bg-brand/10" : "border-border bg-bg-card"
      }`}
    >
      <div className="text-xs font-semibold">{title}</div>
      <div className="mt-1 text-xs text-fg-muted">Tick: ${tick.toFixed(2)}</div>
      <div className="text-xs text-fg-muted">Value: {contract}</div>
      <div className={`mt-2 font-display text-xl font-semibold ${highlight ? "text-brand-hover" : "text-danger"}`}>
        ${risk.toFixed(2)}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Risk</div>
    </div>
  );
}

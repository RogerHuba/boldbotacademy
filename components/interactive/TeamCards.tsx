import { TEAM } from "@/content/team";

export function TeamCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {TEAM.map((m) => (
        <div key={m.id} className="card-raised flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${m.color} text-xl font-semibold`}>
              {m.initials}
            </div>
            <div>
              <div className="font-display text-lg font-semibold">{m.name}</div>
              <div className="text-xs uppercase tracking-wider text-fg-subtle">{m.role}</div>
            </div>
          </div>
          <p className="text-sm text-fg-muted">{m.responsibilities}</p>
          <div className="flex flex-wrap gap-1.5">
            {m.helpsWith.map((h) => (
              <span key={h} className="chip">
                {h}
              </span>
            ))}
          </div>
          <div className="mt-auto text-xs text-fg-subtle">{m.contact}</div>
        </div>
      ))}
    </div>
  );
}

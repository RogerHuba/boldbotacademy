import { AlertTriangle, Clock } from "lucide-react";
import { TEAM, TEAM_HOURS_NOTE } from "@/content/team";

export function TeamCards() {
  const contactable = TEAM.filter((m) => !m.notContactable);
  const doNotContact = TEAM.filter((m) => m.notContactable);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-fg">
        <Clock className="mt-0.5 size-4 text-warning" />
        <p>{TEAM_HOURS_NOTE}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contactable.map((m) => (
          <div key={m.id} className="card-raised flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${m.color} text-xl font-semibold`}
              >
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

      {doNotContact.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warning">
            <AlertTriangle className="size-4" />
            Do not contact
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {doNotContact.map((m) => (
              <div
                key={m.id}
                className="flex flex-col gap-2 rounded-2xl border border-warning/30 bg-warning/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${m.color} text-base font-semibold opacity-80`}
                  >
                    {m.initials}
                  </div>
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-fg-muted">{m.role}</div>
                  </div>
                </div>
                <p className="text-sm text-fg-muted">{m.responsibilities}</p>
                <div className="text-xs text-fg-subtle">{m.contact}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

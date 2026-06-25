import { MessageSquare, LifeBuoy, Video, FileSpreadsheet, Calendar, FolderOpen, GraduationCap } from "lucide-react";

const NODES = [
  { id: "slack", label: "Slack", icon: MessageSquare, color: "from-purple-500/30 to-purple-700/10", note: "Community + support" },
  { id: "support", label: "Support Team", icon: LifeBuoy, color: "from-emerald-500/30 to-emerald-700/10", note: "Amy, Irma, Dan" },
  { id: "zoom", label: "Zoom Calls", icon: Video, color: "from-brand/30 to-brand-subtle/10", note: "Office hours + labs" },
  { id: "sheets", label: "Spreadsheets", icon: FileSpreadsheet, color: "from-amber-500/30 to-amber-700/10", note: "Trade journals" },
  { id: "cal", label: "Calendar", icon: Calendar, color: "from-rose-500/30 to-rose-700/10", note: "Live sessions" },
  { id: "res", label: "Resources", icon: FolderOpen, color: "from-cyan-500/30 to-cyan-700/10", note: "Templates + replays" },
];

export function EcosystemDiagram() {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,theme(colors.brand/15),transparent_60%)]" />
      <div className="flex flex-col items-center">
        <div className="grid size-24 place-items-center rounded-full border border-brand/40 bg-brand/10">
          <GraduationCap className="size-10 text-brand-hover" />
        </div>
        <div className="mt-2 font-display text-lg font-semibold">You</div>
        <div className="text-xs text-fg-subtle">Center of the system</div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NODES.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl border border-border bg-gradient-to-br ${n.color} p-4`}
          >
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-bg-card/60">
                <n.icon className="size-5" />
              </div>
              <div>
                <div className="font-semibold">{n.label}</div>
                <div className="text-xs text-fg-muted">{n.note}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

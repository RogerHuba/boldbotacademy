import { Sun, Moon } from "lucide-react";
import { getChecklist } from "@/content/checklists";

export function DailyProcedures() {
  const morning = getChecklist("morning")!;
  const evening = getChecklist("evening")!;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RoutineCard icon={<Sun className="size-4 text-warning" />} title="Morning routine" items={morning.items.map((i) => i.label)} />
      <RoutineCard icon={<Moon className="size-4 text-brand-hover" />} title="Evening routine" items={evening.items.map((i) => i.label)} />
    </div>
  );
}

function RoutineCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="card-raised">
      <div className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block size-1.5 rounded-full bg-brand" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-xs text-fg-subtle">Tip: print this card or pin it on your phone home screen.</div>
    </div>
  );
}

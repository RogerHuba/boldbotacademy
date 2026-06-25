import { CheckCircle2 } from "lucide-react";

export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <div className="card">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-muted">Key takeaways</h3>
      <ul className="space-y-2">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

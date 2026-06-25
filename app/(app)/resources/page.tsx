import { requireStudent } from "@/lib/gating";
import { ResourceLibrary } from "./ResourceLibrary";
import { RESOURCES } from "@/content/resources";

export default async function ResourcesPage() {
  await requireStudent();
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Library</div>
        <h1 className="font-display text-3xl font-semibold">Resources</h1>
        <p className="text-fg-muted">Videos, guides, settings references, and Zoom replays.</p>
      </header>
      <ResourceLibrary resources={RESOURCES} />
    </div>
  );
}

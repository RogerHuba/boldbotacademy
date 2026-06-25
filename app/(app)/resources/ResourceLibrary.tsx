"use client";

import { useMemo, useState } from "react";
import { Search, Video, FileText, Settings2, Shield, HelpCircle, Wrench, Play } from "lucide-react";
import type { Resource } from "@/content/resources";
import { RESOURCE_CATEGORIES } from "@/content/resources";

const CATEGORY_ICON: Record<Resource["category"], typeof Video> = {
  "Beginner Videos": Video,
  "Setup Guides": FileText,
  "Bot Settings": Settings2,
  "Prop Firm Guides": Shield,
  FAQ: HelpCircle,
  Troubleshooting: Wrench,
  "Zoom Replays": Play,
};

export function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Resource["category"] | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (activeCategory !== "All" && r.category !== activeCategory) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [resources, query, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<Resource["category"], Resource[]>();
    for (const r of filtered) {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="card-raised flex flex-col gap-3 md:flex-row md:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2">
          <Search className="size-4 text-fg-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-fg-subtle"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          <CategoryChip
            label="All"
            active={activeCategory === "All"}
            onClick={() => setActiveCategory("All")}
          />
          {RESOURCE_CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              label={c}
              active={activeCategory === c}
              onClick={() => setActiveCategory(c)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card-raised text-center text-sm text-fg-muted">
          No resources match that search.
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([category, list]) => {
            const Icon = CATEGORY_ICON[category];
            return (
              <section key={category} className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-fg-muted">
                  <Icon className="size-4" />
                  <span className="font-medium">{category}</span>
                  <span className="text-xs text-fg-subtle">· {list.length}</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((r) => (
                    <ResourceTile key={r.id} resource={r} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-fg"
          : "rounded-full border border-border px-3 py-1 text-xs font-medium text-fg-muted hover:bg-bg-hover hover:text-fg"
      }
    >
      {label}
    </button>
  );
}

function ResourceTile({ resource }: { resource: Resource }) {
  const Icon = CATEGORY_ICON[resource.category];
  return (
    <a
      href={resource.url ?? "#"}
      target={resource.url ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex h-full flex-col gap-2 rounded-2xl border border-border bg-bg-card p-4 transition hover:border-brand/40 hover:bg-bg-raised"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-bg-raised px-2 py-1 text-[10px] uppercase tracking-wider text-fg-muted">
          <Icon className="size-3" />
          {resource.category}
        </span>
        {resource.duration && (
          <span className="text-[10px] uppercase tracking-wider text-fg-subtle">
            {resource.duration}
          </span>
        )}
      </div>
      <div className="font-medium text-fg group-hover:text-brand-hover">{resource.title}</div>
      <div className="text-sm text-fg-muted">{resource.description}</div>
    </a>
  );
}

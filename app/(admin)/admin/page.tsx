import Link from "next/link";
import { ChevronRight, Inbox } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/gating";
import { formatRelativeTime } from "@/lib/utils";
import { dayMeta } from "@/content/days";

export default async function AdminPage() {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: pending } = await admin
    .from("validation_submissions")
    .select("id, user_id, day_key, slot, status, submitted_at, profiles:profiles!validation_submissions_user_id_fkey(full_name,email)")
    .eq("status", "pending")
    .order("submitted_at", { ascending: true })
    .limit(50);

  // group by user_id + day_key
  const grouped = new Map<string, { user_id: string; day_key: string; count: number; full_name: string | null; email: string; earliest: string }>();
  for (const row of pending ?? []) {
    const key = `${row.user_id}:${row.day_key}`;
    const profile = row.profiles as unknown as { full_name: string | null; email: string };
    const existing = grouped.get(key);
    if (!existing) {
      grouped.set(key, {
        user_id: row.user_id,
        day_key: row.day_key,
        count: 1,
        full_name: profile?.full_name ?? null,
        email: profile?.email ?? "",
        earliest: row.submitted_at,
      });
    } else {
      existing.count++;
      if (row.submitted_at < existing.earliest) existing.earliest = row.submitted_at;
    }
  }

  const queue = Array.from(grouped.values()).sort((a, b) => a.earliest.localeCompare(b.earliest));

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Admin</div>
        <h1 className="font-display text-3xl font-semibold">Review queue</h1>
        <p className="text-fg-muted">
          {queue.length} student{queue.length === 1 ? "" : "s"} waiting for review. Oldest first.
        </p>
      </header>

      <div className="card-raised divide-y divide-border">
        {queue.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-fg-muted">
            <Inbox className="size-8" />
            <span>Inbox zero. Nothing to review right now.</span>
          </div>
        )}
        {queue.map((q) => {
          const meta = dayMeta(q.day_key as "day_1_setup" | "day_2");
          return (
            <Link
              key={`${q.user_id}-${q.day_key}`}
              href={`/admin/submissions/${q.user_id}/${q.day_key}`}
              className="flex items-center gap-4 py-4 transition hover:bg-bg-hover"
            >
              <div className="grid size-10 place-items-center rounded-full bg-brand/15 text-sm font-semibold text-brand-hover">
                {(q.full_name ?? q.email)[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{q.full_name ?? q.email}</div>
                <div className="text-xs text-fg-muted">{meta.label} · {meta.title}</div>
              </div>
              <span className="chip">{q.count} screenshot{q.count === 1 ? "" : "s"}</span>
              <span className="text-xs text-fg-subtle">{formatRelativeTime(q.earliest)}</span>
              <ChevronRight className="size-4 text-fg-muted" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

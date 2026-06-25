import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { requireAdmin } from "@/lib/gating";
import { createAdminClient } from "@/lib/supabase/admin";
import { getValidation } from "@/content/validations";
import { dayMeta } from "@/content/days";
import { ReviewActions } from "./ReviewActions";
import type { DayKey } from "@/content/types";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string; day: string }>;
}) {
  await requireAdmin();
  const { userId, day } = await params;
  const dayKey = day as DayKey;
  const spec = getValidation(dayKey)!;
  const meta = dayMeta(dayKey);
  const admin = createAdminClient();

  const { data: profile } = await admin.from("profiles").select("full_name,email").eq("id", userId).single();
  const { data: rows } = await admin
    .from("validation_submissions")
    .select("*")
    .eq("user_id", userId)
    .eq("day_key", dayKey)
    .order("submitted_at", { ascending: false });

  // most recent per slot
  type Row = NonNullable<typeof rows>[number];
  const bySlot = new Map<string, Row>();
  for (const r of rows ?? []) if (!bySlot.has(r.slot)) bySlot.set(r.slot, r);

  const signed = new Map<string, string>();
  for (const r of bySlot.values()) {
    const { data } = await admin.storage.from("screenshots").createSignedUrl(r.storage_path, 60 * 60);
    if (data?.signedUrl) signed.set(r.id, data.signedUrl);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <Link href="/admin" className="inline-flex items-center gap-2 text-xs text-fg-muted hover:text-fg">
        <ChevronLeft className="size-3.5" /> Back to queue
      </Link>
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          {meta.label} · {meta.title}
        </div>
        <h1 className="font-display text-3xl font-semibold">{profile?.full_name ?? profile?.email}</h1>
        <p className="text-fg-muted">{profile?.email}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {spec.slots.map((slot) => {
          const row = bySlot.get(slot.key);
          const url = row ? signed.get(row.id) : null;
          return (
            <div key={slot.key} className="card-raised space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{slot.label}</div>
                  <div className="text-xs text-fg-muted">{slot.hint}</div>
                </div>
                {row && <StatusChip status={row.status} />}
              </div>
              <div className="aspect-video overflow-hidden rounded-xl border border-border bg-bg-card">
                {url ? (
                  <Image src={url} alt={slot.label} width={800} height={450} className="size-full object-contain" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-fg-subtle">
                    Not submitted
                  </div>
                )}
              </div>
              {row && <ReviewActions id={row.id} currentStatus={row.status} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "chip chip-warning",
    approved: "chip chip-success",
    needs_correction: "chip chip-danger",
    not_submitted: "chip",
  };
  return <span className={map[status] ?? "chip"}>{status.replace("_", " ")}</span>;
}

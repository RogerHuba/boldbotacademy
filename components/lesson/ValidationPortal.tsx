import Link from "next/link";
import { ChevronLeft, CheckCircle2, FileCheck2, Clock, AlertTriangle } from "lucide-react";
import { ScreenshotUpload } from "./ScreenshotUpload";
import { createClient } from "@/lib/supabase/server";
import { getValidation } from "@/content/validations";
import { dayMeta } from "@/content/days";
import type { DayKey } from "@/content/types";

const DAY_PATH: Record<DayKey, string> = {
  day_0: "/day-0",
  day_1: "/day-1",
  day_1_setup: "/day-1/setup",
  day_2: "/day-2",
  day_3: "/day-3",
};

export async function ValidationPortal({ day }: { day: DayKey }) {
  const spec = getValidation(day)!;
  const meta = dayMeta(day);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: rows } = await supabase
    .from("validation_submissions")
    .select("*")
    .eq("user_id", user!.id)
    .eq("day_key", day)
    .order("submitted_at", { ascending: false });

  // most recent submission per slot
  const bySlot = new Map<string, { status: "not_submitted" | "pending" | "approved" | "needs_correction"; note?: string }>();
  for (const slot of spec.slots) {
    const row = (rows ?? []).find((r) => r.slot === slot.key);
    bySlot.set(slot.key, {
      status: (row?.status as "pending" | "approved" | "needs_correction") ?? "not_submitted",
      note: row?.reviewer_note ?? undefined,
    });
  }

  const counts = spec.slots.reduce(
    (acc, slot) => {
      const s = bySlot.get(slot.key)!.status;
      acc[s as keyof typeof acc]++;
      return acc;
    },
    { not_submitted: 0, pending: 0, approved: 0, needs_correction: 0 },
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <Link href={DAY_PATH[day]} className="inline-flex items-center gap-2 text-xs text-fg-muted hover:text-fg">
        <ChevronLeft className="size-3.5" /> Back to {meta.label}
      </Link>
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold md:text-4xl">{spec.title}</h1>
        <p className="text-fg-muted">
          Upload a clear screenshot for each required slot. Your reviewer will approve or send back
          for correction within one business day.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="chip chip-success">
            <CheckCircle2 className="size-3.5" /> {counts.approved} approved
          </span>
          <span className="chip chip-warning">
            <Clock className="size-3.5" /> {counts.pending} pending
          </span>
          <span className="chip chip-danger">
            <AlertTriangle className="size-3.5" /> {counts.needs_correction} needs correction
          </span>
          <span className="chip">
            <FileCheck2 className="size-3.5" /> {counts.not_submitted} not submitted
          </span>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {spec.slots.map((slot) => {
          const { status, note } = bySlot.get(slot.key)!;
          return (
            <ScreenshotUpload
              key={slot.key}
              day={day}
              slot={slot.key}
              label={slot.label}
              hint={slot.hint}
              status={status}
              note={note}
            />
          );
        })}
      </div>

      <div className="card-raised">
        <h3 className="font-display text-lg font-semibold">What happens next?</h3>
        <p className="mt-2 text-sm text-fg-muted">
          Once every slot is <strong className="text-success">Approved</strong>, the next Day unlocks
          automatically. If a slot comes back as <strong className="text-danger">Needs Correction</strong>,
          read the reviewer note, re-upload, and you're back in the queue.
        </p>
      </div>
    </div>
  );
}

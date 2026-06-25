"use client";

import { useState, useTransition } from "react";
import { Upload, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { uploadScreenshot } from "@/lib/actions/uploads";
import type { DayKey } from "@/content/types";

type Status = "not_submitted" | "pending" | "approved" | "needs_correction";

export function ScreenshotUpload({
  day,
  slot,
  label,
  hint,
  status,
  note,
}: {
  day: DayKey;
  slot: string;
  label: string;
  hint: string;
  status: Status;
  note?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState<Status>(status);
  const [error, setError] = useState<string | null>(null);

  const onFile = (file: File) => {
    setError(null);
    const fd = new FormData();
    fd.append("day", day);
    fd.append("slot", slot);
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadScreenshot(fd);
      if (!res.ok) setError(res.error ?? "Upload failed");
      else setLocalStatus("pending");
    });
  };

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border bg-bg-raised p-4 ${
        localStatus === "approved" ? "border-success/40" :
        localStatus === "needs_correction" ? "border-danger/40" :
        localStatus === "pending" ? "border-warning/40" :
        "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{label}</div>
        <StatusBadge status={localStatus} />
      </div>
      <p className="text-xs text-fg-muted">{hint}</p>
      {note && localStatus === "needs_correction" && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          <strong className="block">Reviewer note</strong>
          {note}
        </div>
      )}
      <label className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-bg-card px-3 py-3 text-sm text-fg-muted hover:border-brand hover:text-fg">
        <Upload className="size-4" />
        {pending ? "Uploading…" : localStatus === "approved" ? "Replace screenshot" : "Upload screenshot"}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </label>
      {error && <div className="text-xs text-danger">{error}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "approved")
    return (
      <span className="chip chip-success">
        <CheckCircle2 className="size-3.5" /> Approved
      </span>
    );
  if (status === "pending")
    return (
      <span className="chip chip-warning">
        <Clock className="size-3.5" /> Pending review
      </span>
    );
  if (status === "needs_correction")
    return (
      <span className="chip chip-danger">
        <AlertTriangle className="size-3.5" /> Needs correction
      </span>
    );
  return <span className="chip">Not submitted</span>;
}

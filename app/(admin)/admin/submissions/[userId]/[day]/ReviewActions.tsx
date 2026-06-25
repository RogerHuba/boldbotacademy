"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertTriangle } from "lucide-react";
import { reviewSubmission } from "@/lib/actions/uploads";

export function ReviewActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  function approve() {
    startTransition(async () => {
      await reviewSubmission(id, "approved");
      router.refresh();
    });
  }

  function reject() {
    if (!note.trim()) return;
    startTransition(async () => {
      await reviewSubmission(id, "needs_correction", note.trim());
      setShowNote(false);
      setNote("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={approve}
          disabled={pending || currentStatus === "approved"}
          className="flex-1 rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm font-medium text-success transition hover:bg-success/20 disabled:opacity-50"
        >
          <Check className="mr-1 inline size-3.5" /> Approve
        </button>
        <button
          onClick={() => setShowNote((v) => !v)}
          disabled={pending}
          className="flex-1 rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm font-medium text-danger transition hover:bg-danger/20 disabled:opacity-50"
        >
          <AlertTriangle className="mr-1 inline size-3.5" /> Needs correction
        </button>
      </div>
      {showNote && (
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What needs to change? Be specific so the student can fix it."
            className="input min-h-24 resize-y py-2"
          />
          <button
            onClick={reject}
            disabled={pending || !note.trim()}
            className="btn-primary w-full"
          >
            {pending ? "Saving..." : "Send back to student"}
          </button>
        </div>
      )}
    </div>
  );
}

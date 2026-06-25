"use client";

import { useState } from "react";
import { Copy, Check, UserPlus } from "lucide-react";
import { inviteStudent, type InviteResult } from "@/lib/actions/students";

export function InviteStudentForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<InviteResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);
    setCopied(false);
    const fd = new FormData(e.currentTarget);
    const res = await inviteStudent(fd);
    setResult(res);
    setPending(false);
    if (res.ok) e.currentTarget.reset();
  }

  async function copyPassword() {
    if (!result?.ok) return;
    await navigator.clipboard.writeText(result.tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="card-raised space-y-4">
      <div>
        <div className="flex items-center gap-2 font-medium">
          <UserPlus className="size-4 text-brand-hover" />
          Invite a student
        </div>
        <p className="text-xs text-fg-muted">
          Creates a confirmed account with a temporary password. Share the password out-of-band; the
          student can change it on first login.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-[1fr_1fr_140px_auto]">
        <input name="full_name" placeholder="Full name" required className="input" />
        <input name="email" type="email" placeholder="email@example.com" required className="input" />
        <select name="role" className="input" defaultValue="student">
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Creating…" : "Create"}
        </button>
      </form>

      {result && !result.ok && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {result.error}
        </div>
      )}

      {result?.ok && (
        <div className="rounded-xl border border-success/30 bg-success/10 px-3 py-3 text-sm">
          <div className="text-success">
            Account created for <strong>{result.email}</strong>.
          </div>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-bg px-3 py-2 font-mono text-sm">
              {result.tempPassword}
            </code>
            <button onClick={copyPassword} className="btn-secondary">
              {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-2 text-xs text-fg-muted">
            Send this password to the student via Slack DM or email. It will not be shown again.
          </div>
        </div>
      )}
    </div>
  );
}

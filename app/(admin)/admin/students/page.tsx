import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/gating";
import { InviteStudentForm } from "./InviteStudentForm";

export default async function StudentsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <header className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Admin</div>
        <h1 className="font-display text-3xl font-semibold">Students</h1>
        <p className="text-fg-muted">
          {data?.length ?? 0} account{(data?.length ?? 0) === 1 ? "" : "s"} total.
        </p>
      </header>

      <InviteStudentForm />

      <div className="card-raised divide-y divide-border">
        {(data ?? []).map((p) => {
          const isStudent = p.role === "student";
          const rowInner = (
            <>
              <div className="grid size-10 place-items-center rounded-full bg-brand/15 text-sm font-semibold text-brand-hover">
                {(p.full_name ?? p.email)[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{p.full_name ?? p.email}</div>
                <div className="text-xs text-fg-muted">{p.email}</div>
              </div>
              <span className="chip">{p.role}</span>
              {isStudent && <ChevronRight className="size-4 text-fg-muted" />}
            </>
          );
          return isStudent ? (
            <Link
              key={p.id}
              href={`/admin/students/${p.id}`}
              className="flex items-center gap-4 py-3 transition hover:bg-bg-hover"
            >
              {rowInner}
            </Link>
          ) : (
            <div key={p.id} className="flex items-center gap-4 py-3">
              {rowInner}
            </div>
          );
        })}
        {(data ?? []).length === 0 && (
          <div className="py-6 text-center text-sm text-fg-muted">
            No accounts yet. Invite your first student above.
          </div>
        )}
      </div>
    </div>
  );
}

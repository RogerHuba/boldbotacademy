import { Award, Lock, Check } from "lucide-react";
import { requireStudent } from "@/lib/gating";
import { issueCertification } from "@/lib/actions/uploads";
import { CertificateCard } from "@/components/gamification/CertificateCard";
import { PrintButton } from "./PrintButton";

export default async function CertificationPage() {
  const state = await requireStudent();

  if (
    !state.certified &&
    state.quizzes["day-0.quiz"]?.passed &&
    state.quizzes["day-1.quiz"]?.passed &&
    state.validations.day_1_setup === "approved" &&
    state.validations.day_2 === "approved"
  ) {
    const checks = state.checklists["day-3.deployment-sim"] ?? {};
    const required = ["vps", "nt", "account", "contract", "bot", "micros", "max-profit", "disable"];
    if (required.every((k) => checks[k])) {
      await issueCertification();
    }
  }

  const criteria = [
    { label: "Day 0 quiz passed", done: !!state.quizzes["day-0.quiz"]?.passed },
    { label: "Day 1 quiz passed", done: !!state.quizzes["day-1.quiz"]?.passed },
    { label: "Day 1 Setup validated", done: state.validations.day_1_setup === "approved" },
    { label: "Day 2 validation approved", done: state.validations.day_2 === "approved" },
    { label: "Deployment simulation complete", done:
      ["vps","nt","account","contract","bot","micros","max-profit","disable"].every(
        (k) => (state.checklists["day-3.deployment-sim"] ?? {})[k],
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <header className="space-y-2 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand/15">
          <Award className="size-8 text-brand-hover" />
        </div>
        <h1 className="font-display text-3xl font-semibold">72-Hour Certification</h1>
        <p className="text-fg-muted">
          {state.certified
            ? "You did it. Your certificate is below."
            : "Finish every requirement below to unlock your certificate."}
        </p>
      </header>

      {state.certified ? (
        <>
          <CertificateCard
            fullName={state.fullName ?? state.email}
            certNumber={state.certNumber!}
          />
          <div className="flex flex-col items-center gap-2">
            <PrintButton />
            <p className="text-xs text-fg-subtle">
              Tip: use your browser's Print → Save as PDF for a printable copy.
            </p>
          </div>
        </>
      ) : (
        <div className="card-raised space-y-3">
          {criteria.map((c) => (
            <div
              key={c.label}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                c.done ? "border-success/30 bg-success/10" : "border-border bg-bg-card"
              }`}
            >
              {c.done ? (
                <Check className="size-4 text-success" />
              ) : (
                <Lock className="size-4 text-fg-muted" />
              )}
              <span className={c.done ? "" : "text-fg-muted"}>{c.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

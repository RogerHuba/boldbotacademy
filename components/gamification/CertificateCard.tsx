import { Award } from "lucide-react";

export function CertificateCard({
  fullName,
  certNumber,
}: {
  fullName: string;
  certNumber: string;
}) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand/40 bg-gradient-to-br from-bg-raised via-bg-card to-bg p-8 text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,theme(colors.brand/25),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,theme(colors.brand-subtle/30),transparent_50%)]" />
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-brand/15">
        <Award className="size-10 text-brand-hover" />
      </div>
      <div className="mt-4 text-xs uppercase tracking-[0.3em] text-fg-subtle">Certificate of Completion</div>
      <h2 className="mt-4 font-display text-4xl font-semibold">{fullName}</h2>
      <p className="mt-3 text-fg-muted">
        has completed the <strong className="text-fg">BoldBot Academy</strong> 72-hour onboarding —
        deploying one approved bot safely on micros.
      </p>
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-fg-muted">
        <div>
          <div className="text-fg-subtle">Issued</div>
          <div className="text-fg">{date}</div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <div className="text-fg-subtle">Cert #</div>
          <div className="text-fg">{certNumber}</div>
        </div>
      </div>
    </div>
  );
}

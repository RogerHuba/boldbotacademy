import { redirect } from "next/navigation";
import { requireStudent } from "@/lib/gating";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const state = await requireStudent({ allowUnonboarded: true });
  if (state.role !== "student" || state.onboardedAt) {
    redirect("/dashboard");
  }

  const fallbackFirst = state.fullName?.split(" ")[0] ?? state.email.split("@")[0];

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="inline-block size-2.5 rounded-full bg-brand" />
          BoldBot Academy
        </div>
        <div className="card-raised space-y-6">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold">Finish setting up your account</h1>
            <p className="text-sm text-fg-muted">
              Set a password only you know and confirm your contact details. This takes about a
              minute.
            </p>
          </div>
          <OnboardingForm
            initialFirstName={fallbackFirst}
            initialLastName={state.lastName ?? ""}
            initialPhone={state.phone ?? ""}
            initialTimezone={state.timezone}
          />
        </div>
      </div>
    </div>
  );
}

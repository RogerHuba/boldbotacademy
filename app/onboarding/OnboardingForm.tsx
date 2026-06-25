"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/actions/profile";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (New York)" },
  { value: "America/Chicago", label: "Central (Chicago)" },
  { value: "America/Denver", label: "Mountain (Denver)" },
  { value: "America/Phoenix", label: "Arizona (Phoenix)" },
  { value: "America/Los_Angeles", label: "Pacific (Los Angeles)" },
  { value: "America/Anchorage", label: "Alaska (Anchorage)" },
  { value: "Pacific/Honolulu", label: "Hawaii (Honolulu)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney" },
];

export function OnboardingForm({
  initialFirstName,
  initialLastName,
  initialPhone,
  initialTimezone,
}: {
  initialFirstName: string;
  initialLastName: string;
  initialPhone: string;
  initialTimezone: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await completeOnboarding(formData);
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          name="first_name"
          label="First name"
          defaultValue={initialFirstName}
          required
        />
        <Field name="last_name" label="Last name" defaultValue={initialLastName} required />
      </div>
      <Field
        name="phone"
        label="Phone number"
        type="tel"
        defaultValue={initialPhone}
        placeholder="+1 (555) 123-4567"
        required
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">Timezone</label>
        <select name="timezone" defaultValue={initialTimezone} className="input" required>
          {TIMEZONES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-bg-card p-4 space-y-3">
        <div>
          <div className="text-sm font-semibold">Set your password</div>
          <p className="text-xs text-fg-muted">
            Replace the temporary password from your invite so only you can sign in.
          </p>
        </div>
        <Field
          name="new_password"
          label="New password"
          type="password"
          minLength={8}
          required
        />
        <Field
          name="confirm_password"
          label="Confirm new password"
          type="password"
          minLength={8}
          required
        />
      </div>

      {error && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Saving..." : "Finish setup"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  required,
  minLength,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-fg-muted">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="input"
      />
    </div>
  );
}

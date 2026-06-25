"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Lock } from "lucide-react";
import { changePassword, updateProfile } from "@/lib/actions/profile";

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

type Mode = "view" | "details" | "password";

export function ProfileEditor({
  email,
  firstName,
  lastName,
  phone,
  timezone,
}: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  timezone: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("view");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null,
  );

  function onDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res.ok) {
        setMessage({ tone: "success", text: "Profile updated." });
        setMode("view");
        router.refresh();
      } else {
        setMessage({ tone: "error", text: res.error });
      }
    });
  }

  function onPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await changePassword(formData);
      if (res.ok) {
        setMessage({ tone: "success", text: "Password updated." });
        setMode("view");
      } else {
        setMessage({ tone: "error", text: res.error });
      }
    });
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={
            message.tone === "success"
              ? "rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm text-success"
              : "rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
          }
        >
          {message.text}
        </div>
      )}

      {mode === "view" && (
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <Row label="First name" value={firstName || "—"} />
          <Row label="Last name" value={lastName || "—"} />
          <Row label="Email" value={email} />
          <Row label="Phone" value={phone || "—"} />
          <Row label="Timezone" value={timezone} />
        </div>
      )}

      {mode === "details" && (
        <form onSubmit={onDetails} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="first_name" label="First name" defaultValue={firstName} required />
            <Field name="last_name" label="Last name" defaultValue={lastName} />
          </div>
          <Field name="phone" label="Phone number" type="tel" defaultValue={phone} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-muted">Timezone</label>
            <select name="timezone" defaultValue={timezone} className="input" required>
              {TIMEZONES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="btn-primary">
              {pending ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("view");
                setMessage(null);
              }}
              className="btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "password" && (
        <form onSubmit={onPassword} className="space-y-3">
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
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="btn-primary">
              {pending ? "Saving..." : "Update password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("view");
                setMessage(null);
              }}
              className="btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "view" && (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setMessage(null);
              setMode("details");
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Pencil className="size-4" /> Edit profile
          </button>
          <button
            type="button"
            onClick={() => {
              setMessage(null);
              setMode("password");
            }}
            className="btn-ghost inline-flex items-center gap-2"
          >
            <Lock className="size-4" /> Change password
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-card px-3 py-2">
      <div className="text-xs uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  required,
  minLength,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
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
        required={required}
        minLength={minLength}
        className="input"
      />
    </div>
  );
}

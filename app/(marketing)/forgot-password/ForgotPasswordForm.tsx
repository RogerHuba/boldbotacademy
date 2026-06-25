"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { resetPasswordWithVerification } from "@/lib/actions/auth";
import { PASSWORD_REQUIREMENTS } from "@/lib/password";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await resetPasswordWithVerification(formData);
      if (res.ok) {
        setDone(true);
      } else {
        setError(res.error);
      }
    });
  }

  if (done) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
          Password updated. You can now sign in with your new password.
        </div>
        <Link href="/login" className="btn-primary w-full justify-center">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field name="email" label="Email" type="email" placeholder="you@example.com" required />
      <Field name="first_name" label="First name" placeholder="As it appears on your profile" required />
      <Field
        name="new_password"
        label="New password"
        type="password"
        placeholder="••••••••"
        required
      />
      <Field
        name="confirm_password"
        label="Confirm new password"
        type="password"
        placeholder="••••••••"
        required
      />
      <p className="text-xs text-fg-subtle">{PASSWORD_REQUIREMENTS}</p>
      {error && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Working..." : "Reset password"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-fg-muted">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="input"
      />
    </div>
  );
}

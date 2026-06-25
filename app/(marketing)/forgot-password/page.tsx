import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="inline-block size-2.5 rounded-full bg-brand" /> BoldBot Academy
          </Link>
          <div className="card-raised space-y-6">
            <div>
              <h1 className="font-display text-2xl font-semibold">Reset your password</h1>
              <p className="text-sm text-fg-muted">
                Confirm your email and first name to verify it's you, then choose a new password.
              </p>
            </div>
            <ForgotPasswordForm />
            <p className="text-center text-xs text-fg-subtle">
              Remembered it?{" "}
              <Link href="/login" className="text-brand-hover hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

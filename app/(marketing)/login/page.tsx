import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="inline-block size-2.5 rounded-full bg-brand" /> BoldBot Academy
          </Link>
          <div className="card-raised space-y-6">
            <div>
              <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
              <p className="text-sm text-fg-muted">Sign in to continue your onboarding.</p>
            </div>
            <AuthForm />
            <p className="text-center text-xs text-fg-subtle">
              Accounts are created by the BoldBot team after purchase. Need access? Email
              support@boldbot.com.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

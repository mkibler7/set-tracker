"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const next = sp.get("next");
  const nextPath = next && next.startsWith("/") ? next : "/login";
  const initialEmail = sp.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && !isSubmitting,
    [email, isSubmitting]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = email.trim();
    if (!trimmed) return setError("Please enter your email.");

    try {
      setIsSubmitting(true);
      const resp = await AuthAPI.forgotPassword({ email: trimmed });
      setSuccess(
        resp.message ??
          "If an account exists for that email, we sent a password reset link."
      );
    } catch (err: any) {
      setError(err?.message ?? "Failed to send reset link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-lg border border-border bg-card/30 p-4"
      >
        {error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground">
            {success}
          </div>
        ) : null}

        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="block text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>

        <div className="flex items-center justify-center pt-1">
          <Link
            href={`/login?next=${encodeURIComponent(nextPath)}`}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to Log In
          </Link>
        </div>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() =>
            router.push(`/signup?next=${encodeURIComponent(nextPath)}`)
          }
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Need an account? Create one
        </button>
      </div>
    </section>
  );
}

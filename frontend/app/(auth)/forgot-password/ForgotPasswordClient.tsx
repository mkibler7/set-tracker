"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";
import TitleIcon from "@/components/icons/title-icon";

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
    [email, isSubmitting],
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
          "If an account exists for that email, we sent a password reset link.",
      );
    } catch (err: any) {
      setError(err?.message ?? "Failed to send reset link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md space-y-5 px-4 sm:px-0 max-[380px]:space-y-3">
      {/* Logo (same placement/sizing behavior as Login) */}
      <TitleIcon className="mx-auto h-auto w-36 min-[400px]:w-48 text-primary mb-10 sm:mx-0 max-[380px]:w-28 max-[380px]:mb-4" />

      <header className="space-y-1 text-center sm:text-left">
        <h1 className="text-xl pb-2 sm:text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground max-[380px]:text-xs">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-3 sm:space-y-4 rounded-lg p-3 sm:p-4 bg-card/20 sm:bg-card/30 border border-transparent sm:border-border/60 shadow-none sm:shadow-sm max-[380px]:p-2 max-[380px]:space-y-2"
      >
        {error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive max-[380px]:p-2 max-[380px]:text-xs">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground max-[380px]:p-2 max-[380px]:text-xs">
            {success}
          </div>
        ) : null}

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-foreground max-[380px]:text-[11px]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm max-[380px]:px-2 max-[380px]:py-1.5 max-[380px]:text-xs"
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

        <div className="text-center">
          <Link
            href={`/login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to Log In
          </Link>
        </div>

        <div className="border-t border-border pt-3" />

        <div className="pb-2 text-center text-sm text-muted-foreground">
          Need an account?{" "}
          <button
            type="button"
            onClick={() =>
              router.push(`/signup?next=${encodeURIComponent(nextPath)}`)
            }
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </button>
        </div>
      </form>
    </section>
  );
}

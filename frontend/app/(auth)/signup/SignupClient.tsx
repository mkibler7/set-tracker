"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";
import TitleIcon from "@/components/icons/title-icon";

export default function SignupPageClient() {
  const sp = useSearchParams();
  const next = sp.get("next");
  const nextPath = next && next.startsWith("/") ? next : "/dashboard";

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      displayName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length >= 8 &&
      !isSubmitting
    );
  }, [displayName, email, password, isSubmitting]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const resp = await AuthAPI.register({
        email: email.trim(),
        password,
        displayName,
      });

      setSuccess(
        resp.message ??
          "Account created. Please check your email to verify your account.",
      );
    } catch (err: any) {
      setError(err?.message ?? "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onResend() {
    setError(null);
    setSuccess(null);

    const trimmed = email.trim();
    if (!trimmed) return setError("Please enter your email first.");

    try {
      setIsResending(true);
      const resp = await AuthAPI.resendVerification({ email: trimmed });
      setSuccess(
        resp.message ??
          "If an account exists for that email, we sent a verification link.",
      );
    } catch (err: any) {
      setError(err?.message ?? "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md space-y-5 px-4 sm:px-0 max-[380px]:space-y-3">
      {/* Logo (same placement/sizing as Login) */}
      <TitleIcon className="mx-auto h-auto w-36 min-[400px]:w-48 text-primary mb-10 sm:mx-0 max-[380px]:w-28 max-[380px]:mb-4" />

      <header className="space-y-1 text-center sm:text-left">
        <h1 className="text-xl pb-2 sm:text-2xl font-semibold tracking-tight">
          Sign Up
        </h1>
        <p className="text-sm text-muted-foreground max-[380px]:text-xs">
          Start tracking your training with SetTracker.
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
            htmlFor="displayName"
            className="block text-xs font-medium text-foreground max-[380px]:text-[11px]"
          >
            Name
          </label>
          <input
            id="displayName"
            type="text"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm max-[380px]:px-2 max-[380px]:py-1.5 max-[380px]:text-xs"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            required
            disabled={!!success}
          />
        </div>

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
            disabled={!!success}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-foreground max-[380px]:text-[11px]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm max-[380px]:px-2 max-[380px]:py-1.5 max-[380px]:text-xs"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            disabled={!!success}
          />
          <p className="mt-2 text-xs text-muted-foreground max-[380px]:text-[11px]">
            Must be at least 8 characters.
          </p>
        </div>

        {!success ? (
          <>
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(nextPath)}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onResend}
              disabled={isResending}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-card/80 disabled:opacity-60"
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </button>

            <Link
              href={`/login?email=${encodeURIComponent(
                email.trim(),
              )}&next=${encodeURIComponent(nextPath)}`}
              className="block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Back to Log In
            </Link>
          </>
        )}
      </form>
    </section>
  );
}

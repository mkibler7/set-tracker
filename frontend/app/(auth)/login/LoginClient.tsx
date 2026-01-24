"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";
import TitleIcon from "@/components/icons/title-icon";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const nextPath = next && next.startsWith("/") ? next : "/dashboard";

  const reason = searchParams.get("reason");
  const verified = searchParams.get("verified");
  const prefillEmail = searchParams.get("email") ?? "";

  // Only show “expired” if the user previously had a session
  const [hadSessionBefore, setHadSessionBefore] = useState(false);
  useEffect(() => {
    setHadSessionBefore(localStorage.getItem("has_session") === "1");
  }, []);

  const reasonMessage = useMemo(() => {
    if (!hadSessionBefore) return null;

    switch (reason) {
      case "expired":
        return "Your session expired. Please log in again.";
      case "logged_out":
        return "You've been logged out.";
      default:
        return null;
    }
  }, [reason, hadSessionBefore]);

  const verifiedMessage = useMemo(() => {
    if (verified === "1") return "Email verified. Log in to continue.";
    return null;
  }, [verified]);

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  const isUnverifiedError = useMemo(() => {
    if (!error) return false;
    return error.toLowerCase().includes("not verified");
  }, [error]);

  async function onDemo() {
    setError(null);
    setInfo(null);
    setIsDemoSubmitting(true);

    try {
      await AuthAPI.demoLogin();

      localStorage.setItem("has_session", "1");

      // same reasoning as onSubmit: hard navigation so middleware sees cookies
      window.location.assign(nextPath);
    } catch (err: any) {
      setError(err?.message ?? "Demo login failed");
    } finally {
      setIsDemoSubmitting(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setIsSubmitting(true);

    try {
      await AuthAPI.login({ email: email.trim(), password });

      localStorage.setItem("has_session", "1");

      // Hard navigation so middleware runs with the cookie
      window.location.assign(nextPath);
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onResendVerification() {
    setError(null);
    setInfo(null);

    const trimmed = email.trim();
    if (!trimmed) return setError("Please enter your email first.");

    try {
      setIsResending(true);
      const resp = await AuthAPI.resendVerification({ email: trimmed });
      setInfo(
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
      <TitleIcon className="mx-auto h-auto w-36 min-[400px]:w-48 text-primary mb-10 sm:mx-0 max-[380px]:w-28 max-[380px]:mb-4" />
      <header className="space-y-1 text-center sm:text-left ">
        <h1 className="text-xl pb-2 sm:text-2xl font-semibold tracking-tight">
          Log In
        </h1>
        <p className="text-sm text-muted-foreground max-[380px]:text-xs">
          Access your SetTracker account.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-3 sm:space-y-4 rounded-lg p-3 sm:p-4 bg-card/20 sm:bg-card/30 border border-transparent sm:border-border/60 shadow-none sm:shadow-sm max-[380px]:p-2 max-[380px]:space-y-2"
      >
        {verifiedMessage ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground max-[380px]:p-2 max-[380px]:text-xs">
            {verifiedMessage}
          </div>
        ) : null}

        {reasonMessage && hadSessionBefore ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground max-[380px]:p-2 max-[380px]:text-xs">
            {reasonMessage}
          </div>
        ) : null}

        {info ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground max-[380px]:p-2 max-[380px]:text-xs">
            {info}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {isUnverifiedError ? (
          <button
            type="button"
            onClick={onResendVerification}
            disabled={isResending}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-card/80 disabled:opacity-60"
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </button>
        ) : null}

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-foreground max-[380px]:text-[11px]"
          >
            E-mail
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
            className="w-full rounded-md border border-border bg-card px-3 py-2 mb-3 text-sm max-[380px]:px-2 max-[380px]:py-1.5 max-[380px]:text-xs"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>

        <div className="text-center">
          <Link
            href={`/forgot-password?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="border-t border-border pt-3" />

        {/* Mobile-compact secondary actions */}
        <div className="space-y-2 pb-2 text-center text-sm text-muted-foreground">
          <div>
            New here?{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(nextPath)}`}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </div>

          <div>
            Recruiter?{" "}
            <button
              type="button"
              onClick={onDemo}
              disabled={isDemoSubmitting || isSubmitting}
              className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-60"
            >
              {isDemoSubmitting ? "Starting demo..." : "Try the demo"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

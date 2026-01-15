"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";

function hasCookie(name: string): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${name}=`));
}

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const nextPath = next && next.startsWith("/") ? next : "/dashboard";

  const reason = searchParams.get("reason");

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await AuthAPI.login({ email, password });

      localStorage.setItem("has_session", "1");

      // Hard navigation so middleware runs with the cookie
      window.location.assign(nextPath);
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Log In</h1>
        <p className="text-sm text-muted-foreground">
          Access your RepTrack account.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-lg border border-border p-4"
      >
        {reasonMessage && hadSessionBefore ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground">
            {reasonMessage}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="space-y-1 text-sm text-foreground">
          <label htmlFor="email" className="ml-2 block text-foreground">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-border bg-card px-3 py-2 mt-1 text-sm"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="ml-2 block text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 mt-1 text-sm"
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
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>

        {/* Forgot password */}
        <div className="text-center">
          <Link
            href={`/forgot-password?email=${encodeURIComponent(
              email
            )}&next=${encodeURIComponent(nextPath)}`}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mb-4 border-t border-border" />

        {/* Create account */}
        <Link
          href={`/signup?next=${encodeURIComponent(nextPath)}`}
          className="block w-full rounded-md border border-border bg-card px-3 py-2 text-center text-sm font-medium text-foreground hover:bg-card/80"
        >
          Create new account
        </Link>
      </form>
    </section>
  );
}

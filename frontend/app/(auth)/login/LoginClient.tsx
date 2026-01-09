"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const nextPath = next && next.startsWith("/") ? next : "/dashboard";

  const reason = searchParams.get("reason");
  const reasonMessage = useMemo(() => {
    switch (reason) {
      case "expired":
        return "Your session expired. Please log in again.";
      case "logged_out":
        return "You've been logged out.";
      default:
        return null;
    }
  }, [reason]);

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
        {/* Reason banner (session expired, logged out, etc.) */}
        {reasonMessage ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground">
            {reasonMessage}
          </div>
        ) : null}

        {/* Credential / request error */}
        {error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
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
      </form>
    </section>
  );
}

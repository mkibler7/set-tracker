"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";

export default function SignupPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await AuthAPI.register({ email, password, displayName });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm text-muted-foreground">
          Start tracking your training with RepTrack.
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

        <div className="space-y-1 text-sm">
          <label htmlFor="displayName" className="block text-foreground">
            Name
          </label>
          <input
            id="displayName"
            type="text"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

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

        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="block text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </section>
  );
}

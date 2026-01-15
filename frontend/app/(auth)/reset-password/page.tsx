"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      token.trim().length > 0 &&
      password.length >= 8 &&
      confirm.length >= 8 &&
      password === confirm &&
      !isSubmitting
    );
  }, [token, password, confirm, isSubmitting]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) return setError("Reset token missing.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    try {
      setIsSubmitting(true);
      await AuthAPI.resetPassword({ token, password });
      setSuccess("Password updated. You can log in now.");

      // optional redirect after a moment
      setTimeout(() => router.replace("/login?reason=logged_out"), 800);
    } catch (err: any) {
      setError(err?.message ?? "Reset failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Choose a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter a new password for your account.
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
          <label className="block text-foreground" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block text-foreground" htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Reset password"}
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to Log In
          </Link>
        </div>
      </form>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";
import TitleIcon from "@/components/icons/title-icon";

export default function ResetPasswordClient() {
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

      setTimeout(() => router.replace("/login?reason=logged_out"), 800);
    } catch (err: any) {
      setError(err?.message ?? "Reset failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md space-y-5 px-4 sm:px-0 max-[380px]:space-y-3">
      <TitleIcon className="mx-auto h-auto w-36 min-[400px]:w-48 text-primary mb-10 sm:mx-0 max-[380px]:w-28 max-[380px]:mb-4" />

      <header className="space-y-1 text-center sm:text-left">
        <h1 className="text-xl pb-2 sm:text-2xl font-semibold tracking-tight">
          Choose a new password
        </h1>
        <p className="text-sm text-muted-foreground max-[380px]:text-xs">
          Enter a new password for your account.
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
            htmlFor="password"
            className="block text-xs font-medium text-foreground max-[380px]:text-[11px]"
          >
            New password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm max-[380px]:px-2 max-[380px]:py-1.5 max-[380px]:text-xs"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            disabled={!!success}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirm"
            className="block text-xs font-medium text-foreground max-[380px]:text-[11px]"
          >
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm max-[380px]:px-2 max-[380px]:py-1.5 max-[380px]:text-xs"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            disabled={!!success}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-80 disabled:cursor-not-allowed"
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

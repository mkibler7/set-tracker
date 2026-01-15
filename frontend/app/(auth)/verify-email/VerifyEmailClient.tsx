"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/api/apiAuth";

export default function VerifyEmailClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const canVerify = useMemo(
    () => token.trim().length > 0 && !isVerifying,
    [token, isVerifying]
  );

  useEffect(() => {
    // auto-verify on load if token exists
    if (!token || isVerifying || success || error) return;

    (async () => {
      try {
        setIsVerifying(true);
        await AuthAPI.verifyEmail({ token });
        setSuccess("Email verified. You can log in now.");
        // redirect quickly to login with a banner flag
        setTimeout(() => router.replace("/login?verified=1"), 800);
      } catch (err: any) {
        setError(err?.message ?? "Verification failed.");
      } finally {
        setIsVerifying(false);
      }
    })();
  }, [token]);

  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Verify Email</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;re verifying your email address.
        </p>
      </header>

      <div className="space-y-4 rounded-lg border border-border bg-card/30 p-4">
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

        {!success && !error ? (
          <div className="text-sm text-muted-foreground">
            {canVerify ? "Verifying..." : "Verification token missing."}
          </div>
        ) : null}

        <div className="flex items-center justify-center pt-1">
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to Log In
          </Link>
        </div>
      </div>
    </section>
  );
}

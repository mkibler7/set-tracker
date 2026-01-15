import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-6">Loading…</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}

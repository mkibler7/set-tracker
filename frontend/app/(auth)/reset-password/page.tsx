import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-6">Loading…</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}

import { Suspense } from "react";
import ForgotPasswordClient from "./ForgotPasswordClient";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-6">Loading…</div>}>
      <ForgotPasswordClient />
    </Suspense>
  );
}

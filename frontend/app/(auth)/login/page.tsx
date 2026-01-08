import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-4">Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}

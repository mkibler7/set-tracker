"use client";
import { useRouter } from "next/navigation";

export default function PageBackButton() {
  const router = useRouter();
  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded-md border border-border text-xs hover:primary-button/80 primary-button"
      >
        ← Back
      </button>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function RequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [token, router, pathname]);

  // While redirecting, render nothing (or a small loading state if you want)
  if (!token) return null;

  return null;
}

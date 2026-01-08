"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AuthAPI } from "@/lib/api/apiAuth";

type Props = { children: React.ReactNode };

export default function RequireAuth({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        // If already have user in store, no need to re-check
        if (user) return;

        // Cookie-based session check; will throw on 401
        const me = await AuthAPI.me();
        if (mounted) setUser({ ...me, displayName: me.displayName ?? "" });
      } catch {
        const next = encodeURIComponent(pathname || "/dashboard");
        router.replace(`/login?next=${next}`);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [user, pathname, router, setUser]);

  if (checking) return null;
  return <>{children}</>;
}

"use client";

import { useRouter } from "next/navigation";
import { appLogout } from "@/lib/auth/logout";
import clsx from "clsx";

export default function LogoutNavLink({ className }: { className?: string }) {
  const router = useRouter();

  async function onClick() {
    await appLogout();
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx("text-left", className)}
    >
      Log-out
    </button>
  );
}

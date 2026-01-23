"use client";

import { useRouter } from "next/navigation";
import { appLogout } from "@/lib/auth/logout";
import clsx from "clsx";
import Link from "next/dist/client/link";

export default function LogoutNavLink({ className }: { className?: string }) {
  const router = useRouter();

  async function onClick() {
    await appLogout();
    // router.replace("/login");
  }

  return (
    <Link
      href="/login"
      onClick={onClick}
      className={clsx("text-left", className)}
    >
      Log-out
    </Link>
  );
}

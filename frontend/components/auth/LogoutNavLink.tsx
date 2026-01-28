"use client";

import { useRouter } from "next/navigation";
import { appLogout } from "@/lib/auth/logout";
import clsx from "clsx";
import Link from "next/link";

export default function LogoutNavLink({ className }: { className?: string }) {
  const router = useRouter();

  async function onClick() {
    await appLogout();
  }

  return (
    <Link
      href="/login"
      onClick={onClick}
      className={clsx("text-left !hover:text-red-400", className)}
    >
      Log-out
    </Link>
  );
}

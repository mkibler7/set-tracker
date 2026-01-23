import Link from "next/link";
import LogoutNavLink from "@/components/auth/LogoutNavLink";

export default function WebNavBar() {
  return (
    <div>
      <div className="text-xl text-primary font-semibold tracking-tight mb-3">
        SetTracker
      </div>
      <nav className="flex flex-col gap-2 text-sm">
        <Link href="/dashboard" className="hover:text-primary">
          Dashboard
        </Link>
        <Link href="/dailylog" className="hover:text-primary">
          Daily Log
        </Link>
        <Link href="/workouts" className="hover:text-primary">
          Workouts
        </Link>
        <Link href="/exercises" className="hover:text-primary">
          Exercises
        </Link>
        <Link href="/charts" className="hover:text-primary">
          Charts
        </Link>
        <LogoutNavLink className="text-left hover:text-red-500" />
      </nav>
    </div>
  );
}

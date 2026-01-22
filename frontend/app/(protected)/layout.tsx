import type { Metadata } from "next";

import Link from "next/link";
import "../globals.css";
import { Inter } from "next/font/google";
import MobileNavBar from "@/components/layout/MobileNav";
import AuthBootstrap from "@/components/auth/AuthBootstrap";
import LogoutNavLink from "@/components/auth/LogoutNavLink";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SetTracker",
  description: "Track your workouts like a pro.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <AuthBootstrap />

        {/* Outer layout: column on mobile, row on desktop */}
        <div className="flex min-h-screen flex-col md:flex-row overflow-hidden">
          {/* Sidebar (desktop only) */}
          <aside className="hidden md:flex w-60 flex-col border-r border-slate-800 bg-slate-900/60 p-4 gap-4">
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

            <div className="mt-auto">
              <Link
                href="/login"
                className="text-xs text-slate-400 hover:text-primary"
              >
                Log in
              </Link>
            </div>
          </aside>

          {/* Main column: mobile header + content */}
          <div className="flex flex-1 flex-col">
            {/* Mobile navigation (only < md) */}
            <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 md:hidden">
              <div className="text-lg text-primary font-semibold tracking-tight">
                SetTracker
              </div>
              <MobileNavBar />
            </header>

            {/* Main content */}
            <main className="flex-1 bg-background-dark p-4 md:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

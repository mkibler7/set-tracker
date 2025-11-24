import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RepTracker",
  description: "Track your workouts like a pro.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex w-60 flex-col border-r border-slate-800 bg-slate-900/60 p-4 gap-4">
            <div className="text-xl font-semibold tracking-tight">
              RepTracker
            </div>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/dashboard" className="hover:text-emerald-400">
                Dashboard
              </Link>
              <Link href="/start" className="hover:text-emerald-400">
                Start Workout
              </Link>
              <Link href="/workouts" className="hover:text-emerald-400">
                Workouts
              </Link>
              <Link href="/exercises" className="hover:text-emerald-400">
                Exercises
              </Link>
            </nav>

            <div className="mt-auto">
              <Link
                href="/login"
                className="text-xs text-slate-400 hover:text-emerald-400"
              >
                Log in
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 bg-slate-950 p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}

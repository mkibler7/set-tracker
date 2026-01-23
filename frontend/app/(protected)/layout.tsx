import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import MobileNavBar from "@/components/layout/MobileNav";
import AuthBootstrap from "@/components/auth/AuthBootstrap";
import WebNavBar from "@/components/layout/WebNav";

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
            <WebNavBar />
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

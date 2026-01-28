import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import MobileNavBar from "@/components/layout/NavBar";
import AuthBootstrap from "@/components/auth/AuthBootstrap";
import NavBar from "@/components/layout/NavBar";

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

        {/* App shell */}
        <div className="flex h-dvh flex-col overflow-hidden">
          {/* Always-visible header */}
          <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900">
            <div className="mx-auto flex h-14 items-center px-4 md:px-8">
              <NavBar />
            </div>
          </header>

          {/* Scroll container */}
          <main className="flex-1 min-h-0 overflow-y-auto bg-background-dark">
            <div className="p-4 md:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}

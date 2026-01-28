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

        {/* Outer layout: column on mobile, row on desktop */}
        <div className="flex min-h-screen flex-col md:flex-row overflow-hidden">
          {/* Main column: mobile header + content */}
          <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/70 backdrop-blur">
              <div className="mx-auto flex h-14 items-center px-4 md:px-8">
                <NavBar /> {/* responsive */}
              </div>
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

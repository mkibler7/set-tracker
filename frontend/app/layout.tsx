import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AuthBootstrap from "@/components/auth/AuthBootstrap";

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
      <body className={`${inter.className} bg-background text-foreground`}>
        <AuthBootstrap />
        {children}
      </body>
    </html>
  );
}

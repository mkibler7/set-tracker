import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AuthBootstrap from "@/components/auth/AuthBootstrap";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SetTracker",
  description: "Track your workouts like a pro.",
  icons: {
    icon: [
      {
        url: "/logos/set-tracker-logo-v2.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/logos/set-tracker-logo-v2.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logos/set-tracker-logo-v2.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
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

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/40 p-4 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

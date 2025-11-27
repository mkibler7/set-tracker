import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border hover:bg-card/70 bg-gradient-to-b from-card/60 to-card/40 p-4 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

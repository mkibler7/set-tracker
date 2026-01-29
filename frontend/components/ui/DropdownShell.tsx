"use client";
import React from "react";

type DropdownShellProps = {
  leftLabel: string;
  valueText: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function DropdownShell({
  leftLabel,
  valueText,
  onClick,
  className = "",
  disabled = false,
  children,
}: DropdownShellProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="h-10 w-full rounded-md border border-border bg-card/60 px-3 pr-10 text-left text-sm text-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-60"
      >
        <span className="text-muted-foreground">{leftLabel} </span>
        <span className="font-medium text-foreground">{valueText}</span>
      </button>

      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
          clipRule="evenodd"
        />
      </svg>

      {children}
    </div>
  );
}

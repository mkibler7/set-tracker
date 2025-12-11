"use client";

import { Card } from "@/components/ui/Card";
import clsx from "clsx";

type StatTileProps = {
  label: string;
  value: string | number;
  helperText?: string;
  asCard?: boolean; // default: true (for future reuse)
  className?: string;
};

export function StatTile({
  label,
  value,
  helperText,
  asCard = true,
  className,
}: StatTileProps) {
  const content = (
    <div className={`flex h-full flex-col text-center gap-1}`}>
      <p className="text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase mb-2">
        {label}
      </p>
      <p className="text-2xl font-semibold text-foreground mb-2">{value}</p>
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );

  if (!asCard) {
    // flat version: no hover, no border, just text on the page background
    return <div className={clsx("h-full", className)}>{content}</div>;
  }

  // default card version (for later, when we make them clickable)
  return <Card className={clsx("h-full", className)}>{content}</Card>;
}

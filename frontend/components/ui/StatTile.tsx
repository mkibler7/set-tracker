import React from "react";
import { Card } from "./Card";

interface StatTileProps {
  label: string;
  value: string | number;
  helperText?: string;
}

export function StatTile({ label, value, helperText }: StatTileProps) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-2xl font-semibold text-foreground">{value}</span>
      {helperText && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
    </Card>
  );
}

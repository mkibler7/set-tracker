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
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-2xl font-semibold text-slate-50">{value}</span>
      {helperText && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
    </Card>
  );
}

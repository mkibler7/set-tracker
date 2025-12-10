"use client";

import React from "react";

export type HoverInfo = {
  label: string;
  value: number;
  percentOfTotal: number;
  x?: number;
  y?: number;
};

type Props = {
  hover: HoverInfo | null;
  metricLabel: string;
  formatNumber: (n: number) => string;
};

export function MuscleHoverOverlay({
  hover,
  metricLabel,
  formatNumber,
}: Props) {
  if (!hover) return null;

  const hasCoords = typeof hover.x === "number" && typeof hover.y === "number";

  const style: React.CSSProperties = hasCoords
    ? {
        left: hover.x,
        top: hover.y,
        transform: "translate(-50%, -110%)", // above the tap / cursor
      }
    : {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };

  return (
    <div
      className="pointer-events-none absolute z-10 rounded-md border border-border bg-slate-950/95 px-3 py-2 text-xs text-foreground shadow-lg"
      style={style}
    >
      <div className="font-semibold mb-1">{hover.label}</div>
      <div className="mb-1">{formatNumber(hover.value)}</div>
      <div className="text-[0.7rem] text-muted-foreground">
        {hover.percentOfTotal.toFixed(1)}% of {metricLabel}
      </div>
    </div>
  );
}

// "use client";

// export type HoverInfo = {
//   label: string;
//   value: number;
//   percentOfTotal: number;
//   x: number;
//   y: number;
// };

// type Props = {
//   hover: HoverInfo | null;
//   metricLabel: string;
//   formatNumber: (n: number) => string;
// };

// export function MuscleHoverOverlay({
//   hover,
//   metricLabel,
//   formatNumber,
// }: Props) {
//   if (!hover) return null;

//   return (
//     <div
//       className="pointer-events-none absolute z-10 rounded-md border border-border bg-slate-950/95 px-3 py-2 text-xs text-foreground shadow-lg"
//       style={{
//         left: hover.x,
//         top: hover.y,
//         transform: "translate(-50%, -110%)", // center horizontally, sit above cursor
//       }}
//     >
//       <div className="font-semibold">{hover.label}</div>
//       <div>{formatNumber(hover.value)}</div>
//       <div className="text-[0.7rem] text-muted-foreground">
//         {hover.percentOfTotal.toFixed(1)}% of {metricLabel}
//       </div>
//     </div>
//   );
// }

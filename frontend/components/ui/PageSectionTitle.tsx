import React from "react";

interface PageSectionTitleProps {
  title: string;
  subtitle?: string;
}

export function PageSectionTitle({ title, subtitle }: PageSectionTitleProps) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold tracking-wide text-slate-200 uppercase">
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}

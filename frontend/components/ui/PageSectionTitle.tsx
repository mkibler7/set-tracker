import React from "react";

interface PageSectionTitleProps {
  title: string;
  subtitle?: string;
}

export function PageSectionTitle({ title, subtitle }: PageSectionTitleProps) {
  return (
    <div className="my-5 text-center">
      <h2 className="text-base font-semibold tracking-wide text-foreground uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

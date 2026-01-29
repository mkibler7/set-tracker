import React from "react";
import { MuscleGroup } from "@reptracker/shared/muscles";

type SplitSelectorProps = {
  allGroups: readonly MuscleGroup[];
  selected: MuscleGroup[];
  onToggleGroup: (group: MuscleGroup) => void;
  onClear: () => void;
  onCancel: () => void;
  onBegin: () => void;
  primaryLabel?: string;
  title?: string;
  description?: string;
};

export default function SplitSelector({
  allGroups,
  selected,
  onToggleGroup,
  onClear,
  onCancel,
  onBegin,
  primaryLabel = "Begin Session",
  title = "Choose today's split",
  description = "Pick one or more muscle groups you plan to train.",
}: SplitSelectorProps) {
  const hasSelection = selected.length > 0;

  return (
    <section className="w-full overflow-hidden rounded-xl border border-border/70 bg-card/60 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border/60 bg-background/10 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="shrink-0 rounded-full border border-border/70 bg-card/40 px-2.5 py-1 text-[11px] text-muted-foreground">
          {selected.length} selected
        </div>
      </div>

      {/* Selected summary */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Selected
            </div>

            {hasSelection ? (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {selected.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200"
                  >
                    {g}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-1 text-xs text-muted-foreground">
                None yet — tap chips below.
              </div>
            )}
          </div>

          {hasSelection && (
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 rounded-md border border-border/70 bg-card/30 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-card/60"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Chip grid */}
      <div className="px-5 pb-5 pt-4">
        <div className="flex flex-wrap gap-2">
          {allGroups.map((group) => {
            const active = selected.includes(group);

            return (
              <button
                key={group}
                type="button"
                onClick={() => onToggleGroup(group)}
                className={[
                  "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40",
                  active
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-100"
                    : "border-border/70 bg-card/40 text-muted-foreground hover:bg-card/60 hover:text-foreground",
                ].join(" ")}
              >
                {/* check indicator */}
                <span
                  className={[
                    "grid h-4 w-4 place-items-center rounded-full border text-[10px] leading-none",
                    active
                      ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-200"
                      : "border-border/70 bg-background/10 text-transparent group-hover:text-muted-foreground",
                  ].join(" ")}
                  aria-hidden
                >
                  ✓
                </span>

                {group}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t border-border/60 bg-background/10 px-5 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border/70 bg-card/30 px-3 py-2 text-xs text-muted-foreground hover:bg-card/60"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!hasSelection}
          onClick={onBegin}
          className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground
                     disabled:cursor-not-allowed disabled:opacity-50"
        >
          {primaryLabel}
        </button>
      </div>
    </section>
  );
}

import React from "react";

type SplitSelectorProps = {
  allGroups: string[];
  selected: string[];
  onToggleGroup: (group: string) => void;
  onCancel: () => void;
  onBegin: () => void;
  primaryLabel?: string;
};

export default function SplitSelector({
  allGroups,
  selected,
  onToggleGroup,
  onCancel,
  onBegin,
  primaryLabel = "Begin Session",
}: SplitSelectorProps) {
  return (
    <section className="mx-auto mt-10 max-w-xl rounded-lg border border-border bg-card/60 p-4 shadow-sm">
      <h2 className="text-base font-semibold text-foreground mb-4 mt-2 ml-2">
        Choose today&apos;s split
      </h2>
      <p className="mt-1 ml-2 text-xs text-muted-foreground ">
        Pick one or more muscle groups you plan to train.
      </p>

      <div className="mt-6 mx-3 flex flex-wrap gap-2">
        {allGroups.map((group) => {
          const active = selected.includes(group);
          return (
            <button
              key={group}
              type="button"
              onClick={() => onToggleGroup(group)}
              className={`rounded-full border px-3 py-1 text-xs ${
                active
                  ? "border-accent bg-accent/20 text-accent-foreground"
                  : "border-border bg-card/60 text-muted-foreground hover:bg-card/80"
              }`}
            >
              {group}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-card/70"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={selected.length === 0}
          onClick={onBegin}
          className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {primaryLabel}
        </button>
      </div>
    </section>
  );
}

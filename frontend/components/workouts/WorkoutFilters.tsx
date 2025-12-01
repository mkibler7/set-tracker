"use client";

import { TimeFilter } from "@/types/workout";

type WorkoutsFiltersProps = {
  timeFilter: TimeFilter;
  search: string;
  onTimeFilterChange: (value: TimeFilter) => void;
  onSearchChange: (value: string) => void;
};

/**
 * WorkoutsFilters
 * Time-range pill buttons + search input used on the workouts list page.
 */
export function WorkoutsFilters({
  timeFilter,
  onTimeFilterChange,
  search,
  onSearchChange,
}: WorkoutsFiltersProps) {
  return (
    <section className="mb-4 flex flex-wrap justify-between items-center gap-3">
      {/* Time filter pills */}
      <div className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-border bg-card/40 px-2 py-1">
        {[
          { value: "all", label: "All" },
          { value: "7d", label: "Last 7 days" },
          { value: "30d", label: "Last 30 days" },
        ].map((option) => {
          const active = timeFilter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onTimeFilterChange(option.value as TimeFilter)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-card/70"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex-1 min-w-[150px] max-w-xs">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search workouts…"
          className="w-full rounded-md border border-border bg-card/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
        />
      </div>
    </section>
  );
}

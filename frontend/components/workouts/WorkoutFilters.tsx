"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { TimeFilter } from "@/types/workout";
import { MuscleGroup, ALL_MUSCLE_GROUPS } from "@reptracker/shared/muscles";
import SplitSelector from "@/components/dailylog/SplitSelector";
import FocusOverlay from "@/components/ui/FocusOverlay";
import DropdownShell from "@/components/ui/DropdownShell";

const filterClassName =
  "block w-full px-3 py-2 text-left text-slate-100 hover:bg-slate-800 hover:text-primary";

const TIME_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

type WorkoutsFiltersProps = {
  timeFilter: TimeFilter;
  onTimeFilterChange: (value: TimeFilter) => void;

  selectedGroups: MuscleGroup[];
  onChangeSelectedGroups: (groups: MuscleGroup[]) => void;
};

export function WorkoutsFilters({
  timeFilter,
  onTimeFilterChange,
  selectedGroups,
  onChangeSelectedGroups,
}: WorkoutsFiltersProps) {
  const [splitOpen, setSplitOpen] = useState(false);

  // custom menu state for time dropdown (mobile)
  const [timeOpen, setTimeOpen] = useState(false);
  const timeWrapRef = useRef<HTMLDivElement | null>(null);

  const timeLabel = useMemo(() => {
    return TIME_OPTIONS.find((o) => o.value === timeFilter)?.label ?? "All";
  }, [timeFilter]);

  const splitLabel = useMemo(() => {
    if (selectedGroups.length === 0) return "Any";
    if (selectedGroups.length === 1) return selectedGroups[0];
    return `${selectedGroups.length} selected`;
  }, [selectedGroups]);

  function toggleGroup(group: MuscleGroup) {
    onChangeSelectedGroups(
      selectedGroups.includes(group)
        ? selectedGroups.filter((g) => g !== group)
        : [...selectedGroups, group],
    );
  }

  function clearAllGroups() {
    onChangeSelectedGroups([]);
  }

  // Close time dropdown on outside click / Escape
  useEffect(() => {
    if (!timeOpen) return;

    const onDown = (e: MouseEvent) => {
      const el = timeWrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setTimeOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTimeOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [timeOpen]);

  return (
    <section className="mb-4 flex flex-col gap-3">
      {/* Desktop row: pills + split dropdown on right */}
      <div className="hidden sm:flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-2 py-1">
          {TIME_OPTIONS.map((option) => {
            const active = timeFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onTimeFilterChange(option.value)}
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

        {/* Desktop split */}
        <div className="w-full max-w-xs">
          <DropdownShell
            leftLabel="Split:"
            valueText={splitLabel}
            onClick={() => setSplitOpen(true)}
          />
        </div>
      </div>

      {/* Mobile: time + split stacked and identical */}
      <div className="sm:hidden flex flex-col gap-2">
        {/* Time (custom dropdown menu like navbar) */}
        <div ref={timeWrapRef} className="relative w-full">
          <DropdownShell
            leftLabel="Time:"
            valueText={timeLabel}
            onClick={() => setTimeOpen((v) => !v)}
          />

          {timeOpen && (
            <div
              className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-md
                         border border-slate-700 bg-slate-900/95 shadow-lg backdrop-blur"
              role="menu"
              aria-label="Time filter"
            >
              {TIME_OPTIONS.map((o) => {
                const active = o.value === timeFilter;
                return (
                  <button
                    key={o.value}
                    type="button"
                    className={`${filterClassName} ${
                      active ? "text-primary" : ""
                    }`}
                    onClick={() => {
                      onTimeFilterChange(o.value);
                      setTimeOpen(false);
                    }}
                    role="menuitem"
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Split */}
        <DropdownShell
          leftLabel="Split:"
          valueText={splitLabel}
          onClick={() => setSplitOpen(true)}
        />
      </div>

      {/* Split selector overlay */}
      <FocusOverlay
        open={splitOpen}
        onClose={() => setSplitOpen(false)}
        maxWidthClassName="max-w-xl"
      >
        <SplitSelector
          allGroups={ALL_MUSCLE_GROUPS}
          selected={selectedGroups}
          onToggleGroup={toggleGroup}
          onClear={clearAllGroups}
          onCancel={() => setSplitOpen(false)}
          onBegin={() => setSplitOpen(false)}
          primaryLabel="Done"
          title="Choose muscle groups to filter"
          description="Pick one or more muscle groups you want to search for."
        />
      </FocusOverlay>
    </section>
  );
}

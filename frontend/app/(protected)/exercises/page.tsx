"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { ExerciseAPI } from "@/lib/api/exercises";
import ExercisesHeader from "@/components/exercises/ExercisesHeader";
import { formatExerciseMuscleLabel } from "@/lib/util/exercises";
import ExerciseFormModal from "@/components/exercises/ExerciseFormModal";
import { Exercise, ExerciseFormValues } from "@/types/exercise";
import { MuscleGroup, ALL_MUSCLE_GROUPS } from "@reptracker/shared/muscles";
import { PaginationBar } from "@/components/shared/PaginationBar";
import DropdownShell from "@/components/ui/DropdownShell";

const PAGE_SIZE = 17;

const filterClassName =
  "block w-full px-3 py-2 text-left text-slate-100 hover:bg-slate-800 hover:text-primary";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<MuscleGroup[]>([]);
  const [groupsOpen, setGroupsOpen] = useState(false);
  const groupsWrapRef = useRef<HTMLDivElement | null>(null);

  const groupLabel = useMemo(() => {
    return selectedGroups.length === 0 ? "Any" : selectedGroups[0];
  }, [selectedGroups]);

  // controls the Add Exercise modal
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);

  // Backend-Loaded exercises
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load exercises on mount
  useEffect(() => {
    let cancelled = false;

    async function loadExercises() {
      try {
        setLoading(true);
        setError(null);
        const list = await ExerciseAPI.list();
        if (cancelled) return;
        setExercises(list);
      } catch (err) {
        if (cancelled) return;
        setError("Failed to load exercises.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadExercises();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!groupsOpen) return;

    const onDown = (e: MouseEvent) => {
      const el = groupsWrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setGroupsOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGroupsOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [groupsOpen]);

  // Reset to page 1 whenever filters/search change
  useEffect(() => {
    setPage(1);
  }, [search, selectedGroups]);

  useEffect(() => {
    setGroupsOpen(false);
  }, [search]);

  // All distinct muscle groups from current exercises
  const muscleGroupFilters = useMemo<MuscleGroup[]>(() => {
    const set = new Set<MuscleGroup>();
    exercises.forEach((exercise) => {
      set.add(exercise.primaryMuscleGroup);
    });
    // Sort alphabetically
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [exercises]);

  const clearGroups = () => setSelectedGroups([]);

  const toggleGroup = (group: MuscleGroup) => {
    setSelectedGroups((prev) => (prev.includes(group) ? [] : [group]));
  };

  // Filter by muscles + search text
  const filteredExercises = useMemo(() => {
    let list = [...exercises];

    if (selectedGroups.length > 0) {
      list = list.filter((exercise) => {
        return selectedGroups.includes(exercise.primaryMuscleGroup);
      });
    }

    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter((exercise) => exercise.name.toLowerCase().includes(q));
    }

    // Ensure stable ordering before pagination
    list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [search, selectedGroups, exercises]);

  const totalCount = filteredExercises.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Clamp page if data changes (safety)
  const currentPage = Math.min(page, totalPages);

  const paginatedExercises = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredExercises.slice(start, start + PAGE_SIZE);
  }, [filteredExercises, currentPage]);

  // Group filtered exercises alphabetically
  const groupedExercises = useMemo(() => {
    const map: Record<string, Exercise[]> = {};

    paginatedExercises.forEach((exercise) => {
      const letter = exercise.name.charAt(0).toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(exercise);
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, exercises]) => ({ letter, exercises }));
  }, [paginatedExercises]);

  async function handleCreateExercise(values: ExerciseFormValues) {
    try {
      const created = await ExerciseAPI.create({
        name: values.name.trim(),
        primaryMuscleGroup: values.primaryMuscleGroup,
        secondaryMuscleGroups: values.secondaryMuscleGroups,
        description: values.description?.trim() || undefined,
      });
      // Add it to local list
      setExercises((prev) => [...prev, created]);
      setIsFormOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <main className="page">
      <ExercisesHeader
        search={search}
        onSearchChange={setSearch}
        onAddExercise={() => setIsFormOpen(true)}
        splitControl={
          <div ref={groupsWrapRef} className="relative w-full">
            <DropdownShell
              leftLabel="Split:"
              valueText={groupLabel}
              onClick={() => setGroupsOpen((v) => !v)}
            />

            {groupsOpen && (
              <div
                className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-md
                     border border-slate-700 bg-slate-900/95 shadow-lg backdrop-blur text-sm"
                role="menu"
                aria-label="Split filter"
              >
                <button
                  type="button"
                  className={`${filterClassName} ${
                    selectedGroups.length === 0 ? "text-primary" : ""
                  }`}
                  onClick={() => {
                    setSelectedGroups([]);
                    setGroupsOpen(false);
                  }}
                  role="menuitem"
                >
                  Any
                </button>

                {ALL_MUSCLE_GROUPS.map((g) => {
                  const active =
                    selectedGroups.length === 1 && selectedGroups[0] === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      className={`${filterClassName} ${active ? "text-primary" : ""}`}
                      onClick={() => {
                        setSelectedGroups([g]);
                        setGroupsOpen(false);
                      }}
                      role="menuitem"
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        }
      />

      {/* exercise list viewer */}
      <section className="mt-4 flex-1 overflow-y-auto rounded-xl bg-background-dark scroll">
        <div className="max-w-2xl mx-auto w-full pb-10 px-4 pr-2">
          {loading && (
            <p className="text-xs text-muted-foreground">
              Loading exercises...
            </p>
          )}

          {!loading && error && <p className="text-xs text-red-400">{error}</p>}

          {!loading &&
            !error &&
            groupedExercises.map(({ letter, exercises }) => (
              <div key={letter} className="mb-3">
                <div className="sticky top-0 z-20 bg-background-dark">
                  <div className="flex items-end px-4 py-2">
                    <h2 className="text-[1rem] font-semibold uppercase tracking-wide text-foreground">
                      {letter}
                    </h2>
                  </div>
                </div>

                <ul className="mt-2 space-y-2">
                  {exercises.map((exercise) => (
                    <li key={exercise.id}>
                      <Link
                        href={`/exercises/${exercise.id}`}
                        className="group flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3 text-sm shadow-sm transition-colors hover:bg-card/70"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium mb-2 text-foreground transition group-hover:text-primary">
                            {exercise.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatExerciseMuscleLabel(exercise)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          {!loading && !error && groupedExercises.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No exercises match your filters.
            </p>
          )}
        </div>
      </section>

      <PaginationBar
        page={page}
        totalItems={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Add Exercise modal */}
      <ExerciseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleCreateExercise}
        muscleGroupOptions={muscleGroupFilters}
      />
    </main>
  );
}

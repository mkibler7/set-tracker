"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExerciseAPI } from "@/lib/api/exercises";
import ExercisesHeader from "@/components/exercises/ExercisesHeader";
import { formatExerciseMuscleLabel } from "@/lib/util/exercises";
import ExerciseFormModal from "@/components/exercises/ExerciseFormModal";
import { Exercise, ExerciseFormValues } from "@/types/exercise";
import { MuscleGroup } from "@reptracker/shared/muscles";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const PAGE_SIZE = 17;

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<MuscleGroup[]>([]);
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

  // Reset to page 1 whenever filters/search change
  useEffect(() => {
    setPage(1);
  }, [search, selectedGroups]);

  // All distinct muscle groups from current exercises
  const muscleGroupFilters = useMemo<MuscleGroup[]>(() => {
    const set = new Set<MuscleGroup>();
    exercises.forEach((exercise) => {
      set.add(exercise.primaryMuscleGroup);
      // (exercise.secondaryMuscleGroups ?? []).forEach((group) => set.add(group));
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
        // const groups = [
        //   exercise.primaryMuscleGroup,s
        //   ...(exercise.secondaryMuscleGroups ?? []),
        // ];
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
      />

      {/* filters */}
      <div className="mt-3">
        <div className="max-w-2xl mx-auto w-full px-4 pr-2">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={clearGroups}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                selectedGroups.length === 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground hover:bg-card/70"
              }`}
            >
              All groups
            </button>

            {muscleGroupFilters.map((group) => {
              const active = selectedGroups.includes(group);
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => toggleGroup(group)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground hover:bg-card/70"
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>
      </div>

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

      {/* bottom pagination bar */}
      <div className="mt-3">
        <div className="max-w-2xl mx-auto w-full px-4 pr-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center">
              {/* Prev */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="inline-flex items-center justify-center px-2 py-2 text-muted-foreground hover:bg-card/70 disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </button>

              {/* Page indicator */}

              {totalCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {currentPage} / {totalPages}
                </p>
              )}

              {/* Next */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="inline-flex items-center justify-center px-2 py-2 text-muted-foreground hover:bg-card/70 disabled:opacity-50"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {totalCount} {totalCount === 1 ? "exercise" : "exercises"}
            </p>
          </div>
        </div>
      </div>

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

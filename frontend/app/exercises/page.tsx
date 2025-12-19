"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExerciseAPI } from "@/services/exercises";
import ExercisesHeader from "@/components/exercises/ExercisesHeader";
import { formatExerciseMuscleLabel } from "@/lib/util/exercises";
import ExerciseFormModal from "@/components/exercises/ExerciseFormModal";
import { Exercise, ExerciseFormValues } from "@/types/exercise";
import { MuscleGroup } from "@reptracker/shared/muscles";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<MuscleGroup[]>([]);
  // controls the Add Exercise modal
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  // All distinct muscle groups from current exercises
  const muscleGroupFilters = useMemo<MuscleGroup[]>(() => {
    const set = new Set<MuscleGroup>();
    exercises.forEach((exercise) => {
      set.add(exercise.primaryMuscleGroup);
      (exercise.secondaryMuscleGroups ?? []).forEach((group) => set.add(group));
    });
    // Sort alphabetically
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [exercises]);

  const clearGroups = () => setSelectedGroups([]);

  const toggleGroup = (group: MuscleGroup) => {
    clearGroups();
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  // Filter by muscles + search text
  const filteredExercises = useMemo(() => {
    let list = [...exercises];

    if (selectedGroups.length > 0) {
      list = list.filter((exercise) => {
        const groups = [
          exercise.primaryMuscleGroup,
          ...(exercise.secondaryMuscleGroups ?? []),
        ];
        return groups.some((g) => selectedGroups.includes(g));
      });
    }

    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter((exercise) => exercise.name.toLowerCase().includes(q));
    }

    return list;
  }, [search, selectedGroups, exercises]);

  // Group filtered exercises alphabetically
  const groupedExercises = useMemo(() => {
    const map: Record<string, Exercise[]> = {};

    filteredExercises.forEach((exercise) => {
      const letter = exercise.name.charAt(0).toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(exercise);
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, exercises]) => ({ letter, exercises }));
  }, [filteredExercises]);

  const totalCount = filteredExercises.length;

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

  // turn "Barbell Bench Press" → "barbell-bench-press"
  function toExerciseId(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // strip weird chars
      .replace(/\s+/g, "-");
  }

  return (
    <main className="page">
      <ExercisesHeader
        search={search}
        onSearchChange={setSearch}
        onAddExercise={() => setIsFormOpen(true)}
      />

      {/* summary + chips */}
      <div className="mt-3 flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          {totalCount} {totalCount === 1 ? "exercise" : "exercises"}
        </p>

        <div className="flex flex-wrap gap-2">
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

      {/* exercise list viewer */}
      <section className="mt-4 flex-1 overflow-y-auto rounded-xl bg-background-dark scroll">
        <div className="max-w-2xl mx-auto w-full pb-10 px-4 pr-2">
          {groupedExercises.map(({ letter, exercises }) => (
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

          {groupedExercises.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No exercises match your filters.
            </p>
          )}
        </div>
      </section>

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

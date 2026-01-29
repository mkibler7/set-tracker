"use client";

import { useRouter } from "next/navigation";
import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/Button";
import Link from "next/link";
import { WorkoutsAPI } from "@/lib/api/workouts";
import type { Workout, TimeFilter } from "@/types/workout";
import DeleteWorkoutModal from "@/components/workouts/DeleteWorkoutModal";
import { WorkoutsFilters } from "@/components/workouts/WorkoutFilters";
import { WorkoutList } from "@/components/workouts/WorkoutsList";
import { Header } from "@/components/workouts/Header";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "../shared/EmptyState";
import type { MuscleGroup } from "@reptracker/shared/muscles";
import {
  getUserErrorMessage,
  getUserErrorTitle,
} from "@/lib/api/getUserErrorMessage";

function useResponsivePageSize() {
  const [pageSize, setPageSize] = React.useState(10);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)"); // lg breakpoint

    const apply = () => setPageSize(mq.matches ? 12 : 10);
    apply();

    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  return pageSize;
}

export default function WorkoutsClientPage() {
  const router = useRouter();
  const canReplaceEditDraft = useWorkoutStore((s) => s.canReplaceEditDraft);
  const resetEditDraft = useWorkoutStore((s) => s.resetEditDraft);
  const pageSize = useResponsivePageSize();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null);
  // const [search, setSearch] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<MuscleGroup[]>([]);
  const [page, setPage] = useState(1);
  const [splitKey, setSplitKey] = useState<string | null>(null);

  // Backend-Loaded workouts
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const splitKeyOf = (groups: readonly string[]) =>
    groups
      .map((g) => g.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .join(" / ");

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await WorkoutsAPI.list();
      setWorkouts(list);
    } catch (e) {
      setError(e);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  async function retryLoad() {
    try {
      setLoading(true);
      setError(null);
      const list = await WorkoutsAPI.list();
      setWorkouts(list);
    } catch (e) {
      setError(e);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkouts();
  }, []);

  const normalize = (s: string) => s.trim().toLowerCase();
  const filteredWorkouts = useMemo(() => {
    const now = new Date();
    const required = selectedGroups.map((g) => normalize(String(g)));

    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);

      if (timeFilter === "7d") {
        const diffDays =
          (now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) return false;
      }

      if (timeFilter === "30d") {
        const diffDays =
          (now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 30) return false;
      }

      // AND match: workout must contain ALL selected muscle groups
      if (required.length > 0) {
        const workoutGroups = (workout.muscleGroups ?? []).map((g) =>
          normalize(String(g)),
        );

        for (const rg of required) {
          if (!workoutGroups.includes(rg)) return false;
        }
      }

      return true;
    });
  }, [timeFilter, selectedGroups, workouts]);

  // Reset pagination when filters/search change
  useEffect(() => {
    setPage(1);
  }, [timeFilter, selectedGroups]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredWorkouts.length / pageSize));
  }, [filteredWorkouts.length, pageSize]);

  // Clamp page if list shrinks (e.g., after delete)
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pageWorkouts = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredWorkouts.slice(start, start + pageSize);
  }, [filteredWorkouts, page, totalPages, pageSize]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await WorkoutsAPI.delete(deleteTarget.id);
      setWorkouts((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      setError(e);
      // keep modal open or close it—your call. I'd close it:
      setDeleteTarget(null);
    }
  };

  const handleEdit = (workoutId: string) => {
    // Guard: if user has a different edit draft with unsaved changes, decide what to do.
    const decision = canReplaceEditDraft(workoutId);

    if (!decision.ok && decision.reason === "dirty") {
      const discard = window.confirm(
        "You have unsaved changes while editing another workout. Discard changes and open this workout?",
      );

      if (!discard) return;

      resetEditDraft();
    }

    // Navigate with param so DailyLog saves as UPDATE not CREATE.
    router.push(`/dailylog?fromWorkout=${encodeURIComponent(workoutId)}`);
  };

  const splitOptions = useMemo(() => {
    const map = new Map<
      string,
      { key: string; label: string; count: number; groups: MuscleGroup[] }
    >();

    for (const w of workouts) {
      const key = splitKeyOf(w.muscleGroups);
      if (!key) continue;

      const entry = map.get(key);
      if (entry) {
        entry.count += 1;
      } else {
        map.set(key, {
          key,
          label: key,
          count: 1,
          groups: w.muscleGroups as MuscleGroup[], // your muscleGroups appear to be strings; cast is ok if same values
        });
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    );
  }, [workouts]);

  const handleDuplicate = async (workoutId: string) => {
    const payloadWorkout = workouts.find((w) => w.id === workoutId);
    if (!payloadWorkout) return;

    try {
      const newWorkout = await WorkoutsAPI.create({
        date: new Date().toISOString().slice(0, 10),
        muscleGroups: payloadWorkout.muscleGroups,
        exercises: payloadWorkout.exercises,
      });
      setWorkouts((prev) => [newWorkout, ...prev]);
    } catch (e) {
      setError(e);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  if (error) {
    return (
      <main className="page">
        <ErrorState
          title={getUserErrorTitle(error)}
          description={getUserErrorMessage(error)}
          action={
            <button
              className="text-primary hover:underline"
              onClick={loadWorkouts}
            >
              Retry
            </button>
          }
        />
      </main>
    );
  }

  return (
    <main className="page flex min-h-0 flex-1 flex-col overflow-x-hidden">
      {/* Header */}

      <div className="shrink-0">
        <Header />

        {/* Filters */}
        <WorkoutsFilters
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          selectedGroups={selectedGroups}
          onChangeSelectedGroups={setSelectedGroups}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pt-1">
        {/* List/Empty State on Load/Empty State on Empty */}
        {loading ? (
          <EmptyState
            title="Loading workouts, please wait.."
            description="Fetching your sessions."
          />
        ) : filteredWorkouts.length === 0 ? (
          <EmptyState
            title="No results"
            description="Try adjusting your filters or starting a new workout."
            action={
              <Button>
                <Link href="/dailylog" className="">
                  Start a workout
                </Link>
              </Button>
            }
          />
        ) : (
          <WorkoutList
            filteredWorkouts={filteredWorkouts}
            pageWorkouts={pageWorkouts}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            setWorkouts={setWorkouts}
            onDuplicate={handleDuplicate}
            onRequestDelete={setDeleteTarget}
            onEdit={handleEdit}
          />
        )}
      </div>

      <DeleteWorkoutModal
        isOpen={!!deleteTarget}
        workoutName={deleteTarget?.muscleGroups.join(" / ") || ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </main>
  );
}

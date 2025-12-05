"use client";

import { useMemo, useState } from "react";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts"; // TODO: replace MOCK_WORKOUTS with API data once backend is wired up
import type { Workout } from "@/types/workout";
import DeleteWorkoutModal from "@/components/workouts/DeleteWorkoutModal";
import { WorkoutsFilters } from "@/components/workouts/WorkoutFilters";
import { WorkoutList } from "@/components/workouts/WorkoutsList";
import { Header } from "@/components/workouts/Header";
import { TimeFilter } from "@/types/workout";
import PageBackButton from "@/components/shared/PageBackButton";

export default function WorkoutsClientPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [workouts, setWorkouts] = useState<Workout[]>(MOCK_WORKOUTS); // TODO: replace MOCK_WORKOUTS with API data once backend is wired up
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null);
  const [search, setSearch] = useState("");

  const filteredWorkouts = useMemo(() => {
    const now = new Date();
    const lowerSearch = search.toLowerCase();

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

      if (lowerSearch) {
        const exerciseNames = workout.exercises.map((ex) => ex.name).join(" ");
        const haystack = `${workout.split} ${exerciseNames}`.toLowerCase();

        if (!haystack.includes(lowerSearch)) return false;
      }

      return true;
    });
  }, [timeFilter, search, workouts]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    setWorkouts((prev) => prev.filter((w) => w.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <main className="page">
      {/* Header */}
      <PageBackButton />
      <Header />

      {/* Filters */}
      <WorkoutsFilters
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        search={search}
        onSearchChange={setSearch}
      />

      {/* List */}
      <WorkoutList
        filteredWorkouts={filteredWorkouts}
        setWorkouts={setWorkouts}
        setDeleteTarget={setDeleteTarget}
      />

      <DeleteWorkoutModal
        isOpen={!!deleteTarget}
        workoutName={deleteTarget?.split}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </main>
  );
}

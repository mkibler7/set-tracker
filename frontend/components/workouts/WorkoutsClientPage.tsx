"use client";

import React, { use } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";
import type { Workout, TimeFilter } from "@/types/workout";
import DeleteWorkoutModal from "@/components/workouts/DeleteWorkoutModal";
import { WorkoutsFilters } from "@/components/workouts/WorkoutFilters";
import { WorkoutList } from "@/components/workouts/WorkoutsList";
import { Header } from "@/components/workouts/Header";
import PageBackButton from "@/components/shared/PageBackButton";

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
  const pageSize = useResponsivePageSize();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [workouts, setWorkouts] = useState<Workout[]>(MOCK_WORKOUTS);
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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
        const exerciseNames = workout.exercises
          .map((exercise) => exercise.exerciseName)
          .join(" ");
        const haystack = `${workout.muscleGroups.join(
          " / "
        )} ${exerciseNames}`.toLowerCase();
        if (!haystack.includes(lowerSearch)) return false;
      }

      return true;
    });
  }, [timeFilter, search, workouts]);

  // Reset pagination when filters/search change
  useEffect(() => {
    setPage(1);
  }, [timeFilter, search]);

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

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setWorkouts((prev) => prev.filter((w) => w.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="page flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header */}

      <div className="shrink-0">
        <PageBackButton />
        <Header />

        {/* Filters */}
        <WorkoutsFilters
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      {/* List */}
      <WorkoutList
        filteredWorkouts={filteredWorkouts}
        pageWorkouts={pageWorkouts}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        setWorkouts={setWorkouts}
        setDeleteTarget={setDeleteTarget}
      />

      <DeleteWorkoutModal
        isOpen={!!deleteTarget}
        workoutName={deleteTarget?.muscleGroups.join(" / ") || ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </main>
  );
}

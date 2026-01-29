import type { Workout } from "@/types/workout";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { WorkoutCard } from "./WorkoutCard";
import { PaginationBar } from "../shared/PaginationBar";
type WorkoutsListProps = {
  filteredWorkouts: Workout[];
  pageWorkouts: Workout[];
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (nextPage: number) => void;
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  onDuplicate: (workoutId: string) => void;
  onRequestDelete: (workout: Workout) => void;
  onEdit: (workoutId: string) => void;
};

export function WorkoutList({
  filteredWorkouts,
  pageWorkouts,
  page,
  totalPages,
  pageSize,
  onPageChange,
  setWorkouts,
  onDuplicate,
  onRequestDelete,
  onEdit,
}: WorkoutsListProps) {
  const listRef = useRef<HTMLElement | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Scroll list to top when user changes pages
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const behavior: ScrollBehavior = isCoarse ? "auto" : "smooth";

    window.scrollTo({ top: 0, left: 0, behavior });

    const el = listRef.current;
    if (el) el.scrollTop = 0;
  }, [page]);

  const rangeText = useMemo(() => {
    if (filteredWorkouts.length === 0) return "";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, filteredWorkouts.length);
    return `Showing ${start} – ${end} of ${filteredWorkouts.length}`;
  }, [filteredWorkouts.length, page, pageSize]);

  const pageWindow = useMemo(() => {
    if (totalPages <= 3)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (page <= 1) return [1, 2, 3];
    if (page >= totalPages) return [totalPages - 2, totalPages - 1, totalPages];

    return [page - 1, page, page + 1];
  }, [page, totalPages]);

  const handleDuplicate = (workoutId: string) => {
    onDuplicate(workoutId);
    setActiveMenuId(null);
  };

  const handleEdit = (workoutId: string) => {
    onEdit(workoutId);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (workout: Workout) => {
    setActiveMenuId(null);
    onRequestDelete(workout);
  };

  return (
    <section
      ref={listRef}
      className="mt-2 min-h-0 flex-1 overflow-y-auto scroll px-3 pb-3 pt-1"
    >
      {filteredWorkouts.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-6 text-sm text-muted-foreground">
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
            <span>No workouts found. Try adjusting your filters or</span>

            <Link
              href="/dailylog"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              Start a new workout
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div
            className="mx-auto grid w-full max-w-md gap-3 sm:max-w-none md:grid-cols-2 xl:grid-cols-3"
            onClick={() => setActiveMenuId(null)}
          >
            <AnimatePresence>
              {pageWorkouts.map((workout, index) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  index={index}
                  activeMenuId={activeMenuId}
                  setActiveMenuId={setActiveMenuId}
                  handleDuplicate={handleDuplicate}
                  handleEdit={handleEdit}
                  handleDeleteClick={handleDeleteClick}
                />
              ))}
            </AnimatePresence>
          </div>

          <PaginationBar
            page={page}
            totalItems={filteredWorkouts.length}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
}

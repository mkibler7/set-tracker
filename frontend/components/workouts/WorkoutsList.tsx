import type { Workout } from "@/types/workout";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkoutCard } from "./WorkoutCard";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

type WorkoutsListProps = {
  filteredWorkouts: Workout[];
  pageWorkouts: Workout[];
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (nextPage: number) => void;
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  setDeleteTarget: React.Dispatch<React.SetStateAction<Workout | null>>;
};

export function WorkoutList({
  filteredWorkouts,
  pageWorkouts,
  page,
  totalPages,
  pageSize,
  onPageChange,
  setWorkouts,
  setDeleteTarget,
}: WorkoutsListProps) {
  const router = useRouter();
  const listRef = useRef<HTMLElement | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Scroll list to top when user changes pages
  useEffect(() => {
    // useEffect only runs client-side, but keep it explicit anyway
    if (typeof window === "undefined") return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const behavior: ScrollBehavior = isCoarse ? "auto" : "smooth";

    window.scrollTo({ top: 0, left: 0, behavior });

    // Optional: if your list is also independently scrollable, reset it too
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
    setWorkouts((prev) => {
      const original = prev.find((w) => w.id === workoutId);
      if (!original) return prev;

      const copy: Workout = {
        ...original,
        id: `${original.id}-copy-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
      };

      return [copy, ...prev];
    });

    setActiveMenuId(null);
  };

  const handleEdit = (workoutId: string) => {
    router.push(`/dailylog?fromWorkout=${workoutId}`);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (workout: Workout) => {
    setActiveMenuId(null);
    setDeleteTarget(workout);
  };

  return (
    <section
      ref={listRef}
      className="mt-2 min-h-0 flex-1 overflow-y-auto scroll px-3 pb-3"
    >
      {filteredWorkouts.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
          No workouts found. Try adjusting your filters or{" "}
          <Link
            href="/dailylog"
            className="primary-button font-medium text-foreground underline-offset-2 underline decoration-dotted "
          >
            Start a new workout
          </Link>
          .
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

          {filteredWorkouts.length > pageSize && (
            <div className="mt-5 flex flex-col items-center gap-2">
              {/* Pager row */}
              <div className="flex items-center justify-center gap-2">
                {/* Jump to first */}
                <button
                  type="button"
                  aria-label="First page"
                  onClick={() => onPageChange(1)}
                  disabled={page <= 1}
                  className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-muted-foreground 
                  hover:bg-accent/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronDoubleLeftIcon className="h-5 w-5" />
                </button>

                {/* Previous page */}
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-muted-foreground 
                  hover:bg-accent/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                {/* 3 page numbers */}
                <div className="flex items-center gap-1">
                  {pageWindow.map((p) => {
                    const active = p === page;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={
                          active
                            ? "min-w-[2.25rem] rounded-full bg-transparent px-3 py-1 text-base font-semibold text-foreground ring-1 ring-border"
                            : "min-w-[2.25rem] rounded-full bg-transparent px-3 py-1 text-sm text-muted-foreground hover:bg-accent/15 hover:text-primary"
                        }
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                {/* Next page */}
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-muted-foreground 
                  hover:bg-accent/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>

                {/* Jump to last */}
                <button
                  type="button"
                  aria-label="Last page"
                  onClick={() => onPageChange(totalPages)}
                  disabled={page >= totalPages}
                  className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-muted-foreground 
                  hover:bg-accent/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronDoubleRightIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Range text below */}
              <div className="mt-2 text-xs text-muted-foreground">
                {rangeText}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

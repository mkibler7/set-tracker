import { Workout } from "@/types/workout";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WorkoutCard } from "./WorkoutCard";
import { MOCK_WORKOUTS } from "@/data/mockWorkouts";

type WorkoutsListProps = {
  filteredWorkouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  setDeleteTarget: React.Dispatch<React.SetStateAction<Workout | null>>;
};
type WorkoutStep = "empty" | "split" | "session";

export function WorkoutList({
  filteredWorkouts,
  setWorkouts,
  setDeleteTarget,
}: WorkoutsListProps) {
  const router = useRouter();
  const useSearchParamss = useSearchParams();
  const fromWorkoutId = useSearchParamss.get("fromWorkoutId");

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null); // To track which workout menu is open
  const [step, setStep] = useState<WorkoutStep>("empty");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    []
  );

  // If user arrives with ?fromWorkoutId, navigate to edit that workout
  useEffect(() => {
    if (!fromWorkoutId) return;

    const workout: Workout | undefined = MOCK_WORKOUTS.find(
      (w) => w.id === fromWorkoutId
    );
    if (!workout) return;

    // Derive muscle groups from the split label
    const groups = workout.split
      .split("/")
      .map((g) => g.trim())
      .filter(Boolean);

    setSelectedMuscleGroups(groups);
    setStep("session");
  }, [fromWorkoutId]);

  const splitLabel =
    selectedMuscleGroups.length > 0
      ? selectedMuscleGroups.join(" / ")
      : "Start Workout";

  const headerTitle = step === "session" ? splitLabel : "Start Workout";

  /* 
    Handlers for workout actions 
  */
  const handleDuplicate = (workoutId: string) => {
    setWorkouts((prev) => {
      const original = prev.find((workout) => workout.id === workoutId);
      if (!original) return prev;

      const copy: Workout = {
        ...original,
        id: `${original.id}-copy-${Date.now()}`, // simple unique id
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
    <section className="mt-2 flex-1 overflow-y-auto scroll p-3">
      {filteredWorkouts.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
          No workouts found. Try adjusting your filters or{" "}
          <Link
            href="/dailylog"
            className="font-medium text-foreground underline-offset-2 underline decoration-dotted hover:decoration-solid"
          >
            Start a new workout
          </Link>
          .
        </div>
      ) : (
        <div
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 mr-3"
          onClick={() => setActiveMenuId(null)}
        >
          <AnimatePresence>
            {filteredWorkouts.map((workout, index) => {
              return (
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
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

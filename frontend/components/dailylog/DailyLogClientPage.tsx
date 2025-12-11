"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/dailylog/Header";
import EmptyState from "@/components/dailylog/EmptyState";
import SplitSelector from "@/components/dailylog/SplitSelector";
import SessionView from "@/components/dailylog/SessionView";
import { useWorkoutSession } from "@/components/dailylog/useWorkoutSession";
import { MOCK_WORKOUTS, Workout } from "@/data/mockWorkouts";

type WorkoutStep = "empty" | "split" | "session";

const ALL_SPLIT_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Traps",
  "Biceps",
  "Triceps",
  "Calves",
  "Adductors",
  "Abductors",
  "Abs",
];

export default function DailyLogClientPage() {
  const {
    currentWorkout,
    startWorkout,
    addExercise,
    removeExercise,
    addSet,
    updateSet,
    deleteSet,
    updateExerciseNotes,
  } = useWorkoutSession();

  const searchParams = useSearchParams();
  const fromWorkoutId = searchParams.get("fromWorkout");

  const [step, setStep] = useState<WorkoutStep>("empty");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    []
  );
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // 1) If we arrive with ?fromWorkout=123, auto-load that workout
  useEffect(() => {
    if (!fromWorkoutId) return;

    const workout: Workout | undefined = MOCK_WORKOUTS.find(
      (w) => w.id === fromWorkoutId
    );
    if (!workout) return;

    const groups = workout.split
      .split("/")
      .map((g) => g.trim())
      .filter(Boolean);

    setSelectedMuscleGroups(groups);
    setWorkoutDate(new Date(workout.date));

    // Start a session seeded from this workout
    startWorkout(workout.split, workout.date, workout.exercises);
    setStep("session");
  }, [fromWorkoutId, startWorkout]);

  // 2) If there is already a current workout in the store, auto-resume it
  useEffect(() => {
    if (fromWorkoutId || !currentWorkout || step !== "empty") return;

    const groups = currentWorkout.split
      .split("/")
      .map((g) => g.trim())
      .filter(Boolean);

    setSelectedMuscleGroups(groups);
    setWorkoutDate(new Date(currentWorkout.date));
    setStep("session");
  }, [fromWorkoutId, currentWorkout, step]);

  const splitLabel =
    selectedMuscleGroups.length > 0
      ? selectedMuscleGroups.join(" / ")
      : "Start Workout";

  const headerTitle = step === "session" ? splitLabel : "Start Workout";

  const handleToggleMuscleGroup = (group: string) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleBeginSession = () => {
    if (selectedMuscleGroups.length === 0) return;

    const splitName = selectedMuscleGroups.join(" / ");
    const dateString = workoutDate.toISOString();

    // 🔹 Make sure a workout session exists in the store
    startWorkout(splitName, dateString);
    setStep("session");
  };

  return (
    <main className="page">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
        <Header
          title={headerTitle}
          date={workoutDate}
          isSession={step === "session"}
          onEditSplit={step === "session" ? () => setStep("split") : undefined}
          onAddExercise={
            step === "session" ? () => setIsPickerOpen(true) : undefined
          }
        />

        {step === "empty" && <EmptyState onStart={() => setStep("split")} />}

        {step === "split" && (
          <SplitSelector
            allGroups={ALL_SPLIT_GROUPS}
            selected={selectedMuscleGroups}
            onToggleGroup={handleToggleMuscleGroup}
            onCancel={() => {
              setSelectedMuscleGroups([]);
              setStep("empty");
            }}
            onBegin={handleBeginSession}
          />
        )}

        {step === "session" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <SessionView
              selectedMuscleGroups={selectedMuscleGroups}
              fromWorkoutId={fromWorkoutId}
              isPickerOpen={isPickerOpen}
              onClosePicker={() => setIsPickerOpen(false)}
              onOpenPicker={() => setIsPickerOpen(true)}
            />
          </div>
        )}
      </div>
    </main>
  );
}

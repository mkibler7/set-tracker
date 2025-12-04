"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/dailylog/Header";
import EmptyState from "@/components/dailylog/EmptyState";
import SplitSelector from "@/components/dailylog/SplitSelector";
import SessionView from "@/components/dailylog/SessionView";
import { MOCK_WORKOUTS, Workout } from "@/data/mockWorkouts"; // TODO: replace MOCK_WORKOUTS with API data once backend is wired up

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

export default function DailyLogPage() {
  const searchParams = useSearchParams();
  const fromWorkoutId = searchParams.get("fromWorkout");

  const [step, setStep] = useState<WorkoutStep>("empty");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    []
  );
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // 🔹 If we arrive with ?fromWorkout=123, auto-load that workout
  useEffect(() => {
    if (!fromWorkoutId) return;

    // TODO: replace MOCK_WORKOUTS with API data once backend is wired up
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
    setStep("session");
  }, [fromWorkoutId]);

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
    setStep("session");
  };

  return (
    <main className="page">
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
        <div className="flex-1 flex flex-col overflow-hidden scroll">
          <SessionView
            selectedMuscleGroups={selectedMuscleGroups}
            fromWorkoutId={fromWorkoutId}
            isPickerOpen={isPickerOpen}
            onClosePicker={() => setIsPickerOpen(false)}
            onOpenPicker={() => setIsPickerOpen(true)}
          />
        </div>
      )}
    </main>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/dailylog/Header";
import EmptyState from "@/components/dailylog/EmptyState";
import SplitSelector from "@/components/dailylog/SplitSelector";
import SessionView from "@/components/dailylog/SessionView";
import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import { WorkoutsAPI } from "@/lib/api/workouts";
import { ExerciseAPI } from "@/lib/api/exercises";
import type { Exercise } from "@/types/exercise";
import {
  ALL_MUSCLE_GROUPS,
  type MuscleGroup,
} from "@reptracker/shared/muscles";
import FocusOverlay from "../ui/FocusOverlay";

type ViewMode = "empty" | "session";

export default function DailyLogClientPage() {
  // Zustand workout session store
  const sessionDraft = useWorkoutStore((s) => s.sessionDraft);
  const editDraft = useWorkoutStore((s) => s.editDraft);

  const startSession = useWorkoutStore((s) => s.startSession);
  const updateSessionMeta = useWorkoutStore((s) => s.updateSessionMeta);
  const resetSession = useWorkoutStore((s) => s.resetSession);

  const canReplaceEditDraft = useWorkoutStore((s) => s.canReplaceEditDraft);
  const startEdit = useWorkoutStore((s) => s.startEdit);
  const resetEditDraft = useWorkoutStore((s) => s.resetEditDraft);

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromWorkoutId = searchParams.get("fromWorkout");

  const isEditingHistory = !!fromWorkoutId;
  const activeDraft = isEditingHistory ? editDraft : sessionDraft;

  const [view, setView] = useState<ViewMode>("empty");

  // Split overlay state (this replaces the old `step === "split"` view)
  const [isSplitOverlayOpen, setIsSplitOverlayOpen] = useState(false);
  const [isEditingSplit, setIsEditingSplit] = useState(false);

  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    MuscleGroup[]
  >([]);
  const [workoutDate, setWorkoutDate] = useState(new Date());

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Backend-loaded exercise catalog (used for ExercisePicker / adding to session)
  const [exerciseCatalog, setExerciseCatalog] = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [exercisesError, setExercisesError] = useState<string | null>(null);

  function fromYYYYMMDDToUTCNoon(yyyyMmDd: string) {
    // store as UTC noon to avoid day-shift
    return new Date(`${yyyyMmDd}T12:00:00.000Z`);
  }

  // Load exercise catalog once (client-side)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setExercisesLoading(true);
        setExercisesError(null);
        const list = await ExerciseAPI.list();
        if (!cancelled) setExerciseCatalog(list);
      } catch (err) {
        if (!cancelled) setExercisesError("Failed to load exercises.");
      } finally {
        if (!cancelled) setExercisesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 1) If we arrive with ?fromWorkout=123, auto-load that workout
  useEffect(() => {
    if (!fromWorkoutId) return;

    let cancelled = false;

    (async () => {
      try {
        const gate = canReplaceEditDraft(fromWorkoutId);
        if (!gate.ok && gate.reason === "dirty") {
          const discard = window.confirm(
            "You have unsaved changes from another edit. Discard them and edit this workout instead?",
          );
          if (!discard) {
            router.replace("/workouts");
            return;
          }
          resetEditDraft();
        }

        const workout = await WorkoutsAPI.get(fromWorkoutId);
        if (cancelled) return;

        startEdit({
          id: workout.id,
          date: workout.date,
          muscleGroups: workout.muscleGroups,
          exercises: workout.exercises,
        });

        // Underlying page stays "session"
        setView("session");
        setSelectedMuscleGroups(workout.muscleGroups);
        setWorkoutDate(new Date(workout.date));

        // Make sure overlays/modals are closed
        setIsEditingSplit(false);
        setIsSplitOverlayOpen(false);
        setIsPickerOpen(false);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load workout:", error);
        router.replace("/dailylog");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fromWorkoutId, canReplaceEditDraft, resetEditDraft, startEdit, router]);

  // 2) If there is already a current workout in the store, auto-resume it
  useEffect(() => {
    if (fromWorkoutId || !sessionDraft || view !== "empty") return;

    setSelectedMuscleGroups(sessionDraft.muscleGroups);
    setWorkoutDate(new Date(sessionDraft.date));
    setView("session");
  }, [fromWorkoutId, sessionDraft, view]);

  const splitLabel =
    (selectedMuscleGroups?.length ?? 0) > 0
      ? selectedMuscleGroups.join(" / ")
      : "Start Workout";

  // IMPORTANT: header title should NOT change just because overlay is open
  const headerTitle = view === "session" ? splitLabel : "Start Workout";

  const handleToggleMuscleGroup = (group: MuscleGroup) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    );
  };

  const openStartOverlay = () => {
    setIsEditingSplit(false);
    setIsSplitOverlayOpen(true);
  };

  const handleEditSplit = () => {
    if (!activeDraft) return;

    setSelectedMuscleGroups(activeDraft.muscleGroups);
    setWorkoutDate(new Date(activeDraft.date));
    setIsEditingSplit(true);
    setIsSplitOverlayOpen(true);
  };

  const handleCancelSplit = () => {
    // If user was starting a brand new session and cancels, go back to empty
    if (!isEditingSplit && !activeDraft) {
      setSelectedMuscleGroups([]);
      setWorkoutDate(new Date());
      setView("empty");
    }

    // Otherwise just close overlay and keep the session view as-is
    setIsEditingSplit(false);
    setIsSplitOverlayOpen(false);
  };

  const handleBeginOrSaveSplit = () => {
    if (selectedMuscleGroups.length === 0) return;

    // Editing split of an existing draft (session OR edit) -> update meta + close overlay
    if (isEditingSplit && activeDraft) {
      if (isEditingHistory) {
        useWorkoutStore.getState().updateEditMeta({
          muscleGroups: selectedMuscleGroups,
          date: workoutDate.toISOString(),
        });
      } else {
        updateSessionMeta({
          muscleGroups: selectedMuscleGroups,
          date: workoutDate.toISOString(),
        });
      }

      setIsEditingSplit(false);
      setIsSplitOverlayOpen(false);
      return;
    }

    // Starting a NEW session draft
    if (!isEditingHistory) {
      startSession(selectedMuscleGroups, workoutDate.toISOString());
      setView("session");
      setIsSplitOverlayOpen(false);
      return;
    }

    // If we’re editing history and not in "edit split" mode, do nothing here.
    // Edit draft is created by the fromWorkout effect.
  };

  const handleClearSplit = () => {
    setSelectedMuscleGroups([]);
  };

  const handleSaveWorkout = async () => {
    if (!activeDraft) return;

    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    const payload = {
      date: activeDraft.date,
      muscleGroups: activeDraft.muscleGroups,
      exercises: activeDraft.exercises,
    };

    try {
      if (isEditingHistory && fromWorkoutId) {
        await WorkoutsAPI.update(fromWorkoutId, payload);

        // Clear edit mode + draft
        resetEditDraft();
        setIsPickerOpen(false);
        setIsEditingSplit(false);
        setIsSplitOverlayOpen(false);

        router.replace("/dailylog");

        // If a session draft exists, show it; otherwise empty
        if (sessionDraft) {
          setSelectedMuscleGroups(sessionDraft.muscleGroups);
          setWorkoutDate(new Date(sessionDraft.date));
          setView("session");
        } else {
          setSelectedMuscleGroups([]);
          setWorkoutDate(new Date());
          setView("empty");
        }

        return;
      }

      // Normal session save -> create new workout
      await WorkoutsAPI.create(payload);

      resetSession();
      setIsPickerOpen(false);
      setIsEditingSplit(false);
      setIsSplitOverlayOpen(false);

      setSelectedMuscleGroups([]);
      setWorkoutDate(new Date());
      setView("empty");
    } catch (error) {
      console.error("Failed to save workout:", error);
      setSaveError(
        error instanceof Error ? error.message : "Failed to save workout.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="page">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
        <Header
          title={headerTitle}
          date={workoutDate}
          isSession={view === "session"}
          onEditSplit={view === "session" ? handleEditSplit : undefined}
          canEditDate={isEditingHistory && view === "session"}
          onCommitDate={(ymd) => {
            if (!isEditingHistory) return;

            const next = fromYYYYMMDDToUTCNoon(ymd);
            setWorkoutDate(next);

            // Persist into edit draft so Save Workout uses it
            useWorkoutStore.getState().updateEditMeta({
              date: next.toISOString(),
            });
          }}
        />

        {view === "empty" && (
          <div className="flex flex-1 items-center justify-center pb-10 sm:pb-16 lg:pb-20">
            <EmptyState onStart={openStartOverlay} />
          </div>
        )}

        {view === "session" && (
          <div className="flex flex-1 flex-col">
            <SessionView
              mode={isEditingHistory ? "edit" : "session"}
              selectedMuscleGroups={selectedMuscleGroups}
              fromWorkoutId={fromWorkoutId}
              isPickerOpen={isPickerOpen}
              onClosePicker={() => setIsPickerOpen(false)}
              onOpenPicker={() => setIsPickerOpen(true)}
              onSaveWorkout={handleSaveWorkout}
              exerciseCatalog={exerciseCatalog}
              exercisesCatalogLoading={exercisesLoading}
            />
          </div>
        )}

        {/* Overlay floats above current view; underlying header/page does NOT change */}
        <FocusOverlay
          open={isSplitOverlayOpen}
          onClose={handleCancelSplit}
          maxWidthClassName="max-w-xl"
        >
          <SplitSelector
            allGroups={ALL_MUSCLE_GROUPS}
            selected={selectedMuscleGroups}
            onToggleGroup={handleToggleMuscleGroup}
            onClear={handleClearSplit}
            onCancel={handleCancelSplit}
            onBegin={handleBeginOrSaveSplit}
            primaryLabel={isEditingSplit ? "Save changes" : "Begin Session"}
          />
        </FocusOverlay>
      </div>
    </main>
  );
}

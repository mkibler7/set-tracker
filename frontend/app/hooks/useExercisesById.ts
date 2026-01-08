"use client";

import { useEffect, useState } from "react";
import type { Exercise } from "@/types/exercise";
import { apiClient } from "@/lib/api/apiClient";
import {
  buildExercisesById,
  type ExercisesById,
} from "@/lib/charts/muscleVolume";

type Result = {
  exercisesById: ExercisesById;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

export function useExercisesById(): Result {
  const [exercisesById, setExercisesById] = useState<ExercisesById>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const retry = () => setRetryKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const list = await apiClient<Exercise[]>("/api/exercises");
        const map = buildExercisesById(list);

        if (!cancelled) setExercisesById(map);
      } catch (e: any) {
        console.error(e);
        const message =
          typeof e?.message === "string" && e.message.length > 0
            ? e.message
            : "Failed to load exercises.";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return { exercisesById, loading, error, retry };
}

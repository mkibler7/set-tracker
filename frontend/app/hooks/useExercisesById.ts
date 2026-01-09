"use client";

import { useEffect, useState } from "react";
import type { Exercise } from "@/types/exercise";
import { ExerciseAPI } from "@/lib/api/exercises";
import {
  buildExercisesById,
  type ExercisesById,
} from "@/lib/charts/muscleVolume";

type Result = {
  exercisesById: ExercisesById;
  loading: boolean;
  error: unknown | null;
  retry: () => void;
};

export function useExercisesById(): Result {
  const [exercisesById, setExercisesById] = useState<ExercisesById>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const retry = () => setRetryKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const list = await ExerciseAPI.list();
        const map = buildExercisesById(list);

        if (!cancelled) setExercisesById(map);
      } catch (e: any) {
        if (!cancelled) setError(e);
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

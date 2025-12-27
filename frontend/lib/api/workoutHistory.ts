import { apiServer } from "@/lib/api/apiServer";
import type { ExerciseHistoryEntry } from "@/types/exercise";

export const WorkoutHistoryAPI = {
  byExercise: (exerciseId: string) =>
    apiServer<ExerciseHistoryEntry[]>(
      `/workouts/history/exercise/${exerciseId}`
    ),
};

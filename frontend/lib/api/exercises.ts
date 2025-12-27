import { apiClient } from "@/lib/api/apiClient";
import type { Exercise, ExerciseFormValues } from "@/types/exercise";

// Backend returns Mongo documents with `_id`.
// Normalize them so the frontend always uses `id`.
type ExerciseFromApi = Omit<Exercise, "id"> & {
  _id: string;
  id?: string; // in case the backend ever sends both
};

function normalizeExercise(e: ExerciseFromApi): Exercise {
  return {
    ...e,
    id: e.id ?? e._id,
  };
}

export const ExerciseAPI = {
  list: async (): Promise<Exercise[]> => {
    const res = await apiClient<ExerciseFromApi[]>("/api/exercises");
    return res.map(normalizeExercise);
  },

  get: async (id: string): Promise<Exercise> => {
    const res = await apiClient<ExerciseFromApi>(`/api/exercises/${id}`);
    return normalizeExercise(res);
  },

  create: async (payload: {
    name: string;
    primaryMuscleGroup: string;
    secondaryMuscleGroups?: string[];
    description?: string;
  }): Promise<Exercise> => {
    const res = await apiClient<ExerciseFromApi>("/api/exercises", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return normalizeExercise(res);
  },
};

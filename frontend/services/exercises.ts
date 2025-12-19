import { apiClient } from "@/lib/apiClient";
import type { Exercise, ExerciseFormValues } from "@/types/exercise";

export const ExerciseAPI = {
  list: () => apiClient<Exercise[]>("/api/exercises"),
  get: (id: string) => apiClient<Exercise>(`/api/exercises/${id}`),
  create: (payload: {
    name: string;
    primaryMuscleGroup: string;
    secondaryMuscleGroups?: string[];
    description?: string;
  }) =>
    apiClient<Exercise>("/api/exercises", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

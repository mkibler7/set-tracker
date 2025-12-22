import { apiClient } from "@/lib/api/apiClient";
import type { Workout } from "@/types/workout";
import { MuscleGroup } from "@reptracker/shared/muscles";

export const WorkoutsAPI = {
  // Fetch a list of all workouts
  list: () => apiClient<Workout[]>("/api/workouts"),

  // Fetch a single workout by ID
  get: (id: string) => apiClient<Workout>(`/api/workouts/${id}`),

  // Create a new workout
  create: (payload: {
    date: string;
    muscleGroups: MuscleGroup[];
    exercises: Workout["exercises"];
  }) =>
    apiClient<Workout>("/api/workouts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Update an existing workout using ID
  update: (
    id: string,
    payload: {
      date?: string;
      muscleGroups?: MuscleGroup[];
      exercises?: Workout["exercises"];
    }
  ) => {
    if (!payload.date && !payload.muscleGroups && !payload.exercises) {
      throw new Error(
        "At least one field must be provided to update a workout."
      );
    }
    return apiClient<Workout>(`/api/workouts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Delete a workout by ID
  delete: (id: string) =>
    apiClient<{ success: boolean }>(`/api/workouts/${id}`, {
      method: "DELETE",
    }),
};

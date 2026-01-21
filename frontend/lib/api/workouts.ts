import { apiClient } from "@/lib/api/apiClient";
import type { Workout } from "@/types/workout";
import { MuscleGroup } from "@reptracker/shared/muscles";

function normalizeWorkout(raw: any): Workout {
  return {
    ...raw,
    id: raw.id ?? raw._id,
    exercises: (raw.exercises ?? []).map((exercise: any) => ({
      ...exercise,
      id: exercise.id ?? exercise._id,
      sets: (exercise.sets ?? []).map((set: any) => ({
        ...set,
        id: set.id ?? set._id,
      })),
    })),
  } as Workout;
}

export const WorkoutsAPI = {
  // Fetch a list of all workouts
  list: async () => {
    const data = await apiClient<Workout[]>("/api/workouts");
    return data.map(normalizeWorkout);
  },

  // Fetch a single workout by ID
  get: async (id: string) => {
    const data = await apiClient<Workout>(`/api/workouts/${id}`);
    return normalizeWorkout(data);
  },

  // Create a new workout
  create: async (payload: {
    date: string;
    muscleGroups: MuscleGroup[];
    exercises: Workout["exercises"];
  }) => {
    const data = await apiClient<Workout>("/api/workouts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return normalizeWorkout(data);
  },

  // Update an existing workout using ID
  update: async (
    id: string,
    payload: {
      date?: string;
      muscleGroups?: MuscleGroup[];
      exercises?: Workout["exercises"];
    },
  ) => {
    if (!payload.date && !payload.muscleGroups && !payload.exercises) {
      throw new Error(
        "At least one field must be provided to update a workout.",
      );
    }
    const data = await apiClient<Workout>(`/api/workouts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return normalizeWorkout(data);
  },

  // Delete a workout by ID
  delete: (id: string) =>
    apiClient<{ success: boolean }>(`/api/workouts/${id}`, {
      method: "DELETE",
    }),
};

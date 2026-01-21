export default function toWorkoutDTO(doc: any) {
  const obj = doc.toObject?.() ?? doc;
  const exercises = Array.isArray(obj.exercises) ? obj.exercises : [];

  const normalizedExercises = exercises.map((exercise: any) => {
    const exerciseIdRaw =
      exercise?.exerciseId ??
      exercise?.id ??
      exercise?.exercise?._id ??
      exercise?.exercise?.id;

    const exerciseId = exerciseIdRaw != null ? String(exerciseIdRaw) : "";

    const sets = Array.isArray(exercise?.sets) ? exercise.sets : [];
    const normalizedSets = sets.map((set: any) => {
      const setIdRaw = set?.id ?? set?._id;
      const setId = setIdRaw != null ? String(setIdRaw) : "";

      return {
        id: setId,
        reps: Number(set?.reps ?? 0),
        weight: Number(set?.weight ?? 0),
        tempo: set?.tempo,
        rpe: set?.rpe != null ? Number(set.rpe) : undefined,
        isWarmup: set?.isWarmup ?? false,
      };
    });

    return {
      exerciseId,
      notes: exercise?.notes ?? "",
      sets: normalizedSets,
    };
  });

  return {
    id: String(obj._id),
    date: obj.date instanceof Date ? obj.date.toISOString() : obj.date,
    muscleGroups: obj.muscleGroups ?? [],
    exercises: normalizedExercises,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

export default function toWorkoutDTO(doc: any) {
  const obj = doc.toObject?.() ?? doc;

  const exercises = Array.isArray(obj.exercises) ? obj.exercises : [];

  const normalizedExercises = exercises.map((ex: any) => {
    // Canonical: exerciseId (string)
    // Back-compat fallbacks
    const exerciseIdRaw =
      ex?.exerciseId ?? ex?.id ?? ex?.exercise?._id ?? ex?.exercise?.id;

    const exerciseId = exerciseIdRaw != null ? String(exerciseIdRaw) : "";

    const sets = Array.isArray(ex?.sets) ? ex.sets : [];
    const normalizedSets = sets.map((s: any) => ({
      reps: Number(s?.reps ?? 0),
      weight: Number(s?.weight ?? 0),
      tempo: s?.tempo,
      rpe: s?.rpe != null ? Number(s.rpe) : undefined,
    }));

    return {
      exerciseId,
      notes: ex?.notes ?? "",
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

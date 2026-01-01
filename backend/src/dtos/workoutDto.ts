export default function toWorkoutDTO(doc: any) {
  const obj = doc.toObject?.() ?? doc;
  return {
    id: String(obj._id),
    date: obj.date instanceof Date ? obj.date.toISOString() : obj.date,
    muscleGroups: obj.muscleGroups ?? [],
    exercises: obj.exercises ?? [],
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

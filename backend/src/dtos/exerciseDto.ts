export default function toExerciseDTO(doc: any) {
  const obj = doc.toObject?.() ?? doc;
  return {
    id: String(obj._id),
    name: obj.name,
    primaryMuscleGroup: obj.primaryMuscleGroup,
    secondaryMuscleGroups: obj.secondaryMuscleGroups ?? [],
    description: obj.description,
  };
}

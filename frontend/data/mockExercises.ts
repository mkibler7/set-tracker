import type { Exercise } from "@/types/exercise";

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: "incline-bench-press",
    name: "Incline Barbell Bench Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
    description:
      "The incline bench press is a variation of the traditional bench press that targets the upper portion of the pectoral muscles. It is performed on an inclined bench set at a 30 to 45-degree angle. This exercise primarily works the upper chest, shoulders, and triceps.",
  },
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
    description:
      "The bench press is a classic compound exercise that primarily targets the chest muscles (pectoralis major) while also engaging the shoulders (deltoids) and triceps. It is performed by lying flat on a bench and pressing a weighted barbell upwards from chest level until the arms are fully extended, then lowering it back down.",
  },
  {
    id: "incline-dumbbell-bench-press",
    name: "Incline Dumbbell Bench Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
    description:
      "The incline dumbbell bench press is a variation of the traditional bench press that targets the upper portion of the pectoral muscles. It is performed on an inclined bench set at a 30 to 45-degree angle using dumbbells instead of a barbell. This exercise primarily works the upper chest, shoulders, and triceps.",
  },
  {
    id: "machine-chest-press",
    name: "Machine Chest Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
    description:
      "The machine chest press is a strength training exercise that targets the chest muscles (pectoralis major) using a specialized machine. It is designed to mimic the motion of a traditional bench press while providing added stability and support. This exercise primarily works the chest, shoulders, and triceps.",
  },
  {
    id: "adductor-machine",
    name: "Adductor Machine",
    primaryMuscleGroup: "Adductors",
    secondaryMuscleGroups: [],
    description:
      "The adductor machine is a strength training exercise that targets the inner thigh muscles (adductors) using a specialized machine. It is designed to isolate and strengthen the adductor muscles while providing added stability and support. This exercise primarily works the adductors.",
  },
  {
    id: "incline-dumbbell-bench-press",
    name: "Incline Dumbbell Bench Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
  },
  {
    id: "machine-chest-press",
    name: "Machine Chest Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
  },
  {
    id: "back-squat",
    name: "Barbell Squat",
    primaryMuscleGroup: "Quads",
    secondaryMuscleGroups: ["Hamstrings", "Glutes"],
    description:
      "The barbell squat is a fundamental lower-body compound lift that primarily targets the quadriceps while also heavily involving the glutes and hamstrings.",
  },
  {
    id: "front-squat",
    name: "Front Squat",
    primaryMuscleGroup: "Quads",
    secondaryMuscleGroups: ["Glutes", "Abs"],
    description:
      "The front squat places the barbell on the front of the shoulders, emphasizing the quadriceps and core stability with a more upright torso position.",
  },
  {
    id: "walking-lunge",
    name: "Walking Lunge",
    primaryMuscleGroup: "Quads",
    secondaryMuscleGroups: ["Glutes", "Hamstrings"],
    description:
      "Walking lunges are a unilateral lower-body exercise that targets the quads and glutes while improving balance, coordination, and hip stability.",
  },
  {
    id: "front-squat",
    name: "Front Squat",
    primaryMuscleGroup: "Quads",
    secondaryMuscleGroups: ["Glutes", "Hamstrings"],
  },
  {
    id: "walking-lunge",
    name: "Walking Lunge",
    primaryMuscleGroup: "Quads",
    secondaryMuscleGroups: ["Glutes", "Hamstrings"],
  },
  {
    id: "deadlift",
    name: "Barbell Deadlift",
    primaryMuscleGroup: "Hamstrings",
    secondaryMuscleGroups: ["Glutes", "Back", "Traps"],
    description:
      "The barbell deadlift is a heavy compound movement that targets the posterior chain—hamstrings, glutes, and lower back—while also engaging the upper back and grip.",
  },
  {
    id: "overhead-press",
    name: "Barbell Overhead Press",
    primaryMuscleGroup: "Shoulders",
    secondaryMuscleGroups: ["Triceps", "Back"],
    description:
      "The barbell overhead press is a vertical pressing movement that targets the shoulders and triceps while requiring strong core and upper-back stability.",
  },
  {
    id: "hangling-leg-raise",
    name: "Hanging Leg Raise",
    primaryMuscleGroup: "Abs",
    secondaryMuscleGroups: [],
    description:
      "The hanging leg raise is an abdominal exercise that targets the rectus abdominis and hip flexors by lifting the legs while hanging from a bar.",
  },
  {
    id: "lateral-raise",
    name: "Lateral Raise",
    primaryMuscleGroup: "Shoulders",
    secondaryMuscleGroups: ["Traps"],
    description:
      "The lateral raise isolates the side deltoids to build width and roundness in the shoulders using dumbbells or cables.",
  },
  {
    id: "barbell-curl",
    name: "Barbell Curl",
    primaryMuscleGroup: "Biceps",
    secondaryMuscleGroups: [],
    description:
      "The barbell curl is a staple arm exercise that targets the biceps through elbow flexion with a barbell.",
  },
  {
    id: "triceps-pushdown",
    name: "Triceps Pushdown",
    primaryMuscleGroup: "Triceps",
    secondaryMuscleGroups: [],
    description:
      "The triceps pushdown uses a cable machine to isolate the triceps, emphasizing elbow extension with constant tension.",
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    primaryMuscleGroup: "Back",
    secondaryMuscleGroups: ["Biceps", "Shoulders"],
    description:
      "The barbell row is a horizontal pulling exercise that targets the upper and mid-back while also engaging the biceps and rear delts.",
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown (Standard Grip)",
    primaryMuscleGroup: "Back",
    secondaryMuscleGroups: ["Biceps"],
    description:
      "The standard-grip lat pulldown targets the lats and upper back by pulling a cable bar from overhead down toward the chest.",
  },
  {
    id: "pull-up",
    name: "Pull Up",
    primaryMuscleGroup: "Back",
    secondaryMuscleGroups: ["Biceps", "Abs"],
    description:
      "The pull-up is a bodyweight exercise that targets the lats and upper back by pulling the body up to a bar from a hanging position.",
  },
  {
    id: "single-arm-row",
    name: "Single Arm Row",
    primaryMuscleGroup: "Back",
    secondaryMuscleGroups: ["Biceps", "Shoulders"],
    description:
      "The single-arm row uses a dumbbell or cable to train each side of the back independently, helping correct imbalances and improve mind–muscle connection.",
  },
  {
    id: "pull-up",
    name: "Pull Up",
    primaryMuscleGroup: "Back",
    secondaryMuscleGroups: ["Biceps", "Shoulders"],
  },
  {
    id: "single-arm-row",
    name: "Single Arm Row",
    primaryMuscleGroup: "Back",
    secondaryMuscleGroups: ["Biceps", "Shoulders"],
  },
  {
    id: "lat-pulldown-wide",
    name: "Lat Pulldown (Wide Grip)",
    primaryMuscleGroup: "Back",
    secondaryMuscleGroups: ["Biceps"],
    description:
      "The wide-grip lat pulldown emphasizes the outer portion of the lats and upper back with a wider hand position on the bar.",
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    primaryMuscleGroup: "Hamstrings",
    secondaryMuscleGroups: ["Glutes", "Back"],
    description:
      "The Romanian deadlift is a hip-hinge movement that focuses on stretching and strengthening the hamstrings and glutes with minimal knee bend.",
  },
  {
    id: "t-bar-row",
    name: "T-Bar Row",
    primaryMuscleGroup: "Back",
    secondaryMuscleGroups: ["Biceps", "Shoulders"],
    description:
      "The T-bar row is a heavy rowing variation that targets the mid-back and lats while also recruiting the biceps and rear delts.",
  },
  {
    id: "dumbbell-curl",
    name: "Dumbbell Curl",
    primaryMuscleGroup: "Biceps",
    secondaryMuscleGroups: [],
    description:
      "The dumbbell curl targets the biceps with independent loading on each arm, allowing for a greater range of motion and better control.",
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    primaryMuscleGroup: "Triceps",
    secondaryMuscleGroups: [],
    description:
      "The tricep pushdown isolates the triceps using a cable machine and various handle attachments to emphasize elbow extension.",
  },
  {
    id: "leg-press",
    name: "Leg Press",
    primaryMuscleGroup: "Quads",
    secondaryMuscleGroups: ["Glutes", "Hamstrings"],
    description:
      "The leg press is a machine-based compound movement that primarily targets the quadriceps while also working the glutes and hamstrings.",
  },
  {
    id: "calf-raise",
    name: "Calf Raise",
    primaryMuscleGroup: "Calves",
    secondaryMuscleGroups: [],
    description:
      "The calf raise targets the calf muscles by lifting the heels against resistance, typically using a machine or bodyweight.",
  },
  {
    id: "leg-curl",
    name: "Leg Curl",
    primaryMuscleGroup: "Hamstrings",
    secondaryMuscleGroups: [],
    description:
      "The leg curl isolates the hamstrings by flexing the knee against resistance, typically using a lying or seated machine.",
  },
  {
    id: "dumbbell-bench-press",
    name: "Flat Dumbbell Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
    description:
      "The flat dumbbell press targets the mid-chest using dumbbells, allowing for a freer range of motion and independent loading for each arm.",
  },
  {
    id: "incline-dumbbell-bench",
    name: "Incline Dumbbell Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
    description:
      "The incline dumbbell press focuses on the upper chest while also recruiting the shoulders and triceps through a pressing motion on an incline bench.",
  },
  {
    id: "incline-machine-press",
    name: "Incline Machine Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
    description:
      "The incline machine press targets the upper chest with added stability and a fixed path, making it easier to control heavy loads.",
  },
  {
    id: "decline-machine-press",
    name: "Decline Machine Press",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps"],
    description:
      "The decline machine press emphasizes the lower chest while providing support and a guided range of motion.",
  },
  {
    id: "machine-fly",
    name: "Machine Chest Fly",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders"],
    description:
      "The machine chest fly isolates the chest through a hugging motion, focusing on stretching and contracting the pectoral muscles.",
  },
  {
    id: "incline-db-fly",
    name: "Incline Dumbbell Fly",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders"],
    description:
      "The incline dumbbell fly targets the upper chest with a wide arc motion, emphasizing stretch and contraction of the pecs.",
  },
  {
    id: "decline-db-fly",
    name: "Decline Dumbbell Fly",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders"],
    description:
      "The decline dumbbell fly emphasizes the lower portion of the chest using a wide, sweeping motion on a decline bench.",
  },
  {
    id: "peck-deck",
    name: "Peck Deck Fly",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders"],
    description:
      "The pec deck fly uses a machine to guide the fly motion, isolating the chest with consistent resistance and minimal stabilization demands.",
  },
  {
    id: "push-up",
    name: "Push Up",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders", "Triceps", "Abs"],
    description:
      "The push-up is a bodyweight pressing exercise that targets the chest, shoulders, and triceps while also engaging the core for stability.",
  },
  {
    id: "dip",
    name: "Chest Dip",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Triceps", "Shoulders"],
    description:
      "The chest dip is a bodyweight exercise performed on parallel bars that targets the lower chest while also working the triceps and shoulders.",
  },
  {
    id: "flat-db-fly",
    name: "Flat Bench Dumbbell Fly",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders"],
    description:
      "The flat dumbbell fly isolates the chest on a flat bench using a wide arc motion to emphasize stretch and contraction of the pecs.",
  },
  {
    id: "cable-fly",
    name: "Cable Fly",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders"],
    description:
      "The cable fly uses adjustable pulleys to maintain constant tension on the chest throughout the fly motion.",
  },
  {
    id: "decline-cable-fly",
    name: "Decline Cable Fly",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders"],
    description:
      "The decline cable fly targets the lower chest using cables set to create a downward sweeping motion.",
  },
  {
    id: "incline-cable-fly",
    name: "Incline Cable Fly",
    primaryMuscleGroup: "Chest",
    secondaryMuscleGroups: ["Shoulders"],
    description:
      "The incline cable fly emphasizes the upper chest with cables set to create an upward sweeping motion.",
  },
];

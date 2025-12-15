const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// GET /api/workouts - Get all workouts in descending order by date
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/workouts - Create a new workout
router.post("/", async (req, res) => {
  try {
    const { date, muscleGroups, exercises } = req.body;

    const newWorkout = await Workout.create({
      date: new Date(date),
      muscleGroups: muscleGroups ?? [],
      exercises: exercises ?? [],
    });

    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

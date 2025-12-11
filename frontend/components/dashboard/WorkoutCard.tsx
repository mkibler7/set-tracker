"use client";

import Link from "next/link";
import type { Workout } from "@/types/workout";
import { getSetCount, getTotalVolume } from "@/lib/workouts/stats";
import { formatWorkoutDate } from "@/lib/util/date";
import { Card } from "../ui/Card";

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const volume = getTotalVolume(workout).toLocaleString();

  return (
    <Link href={`/workouts/${workout.id}`}>
      <Card className="flex items-center justify-between gap-2 cursor-pointer hover:text-primary">
        {/* left side */}
        <div className="ml-2">
          <p className="mb-2 font-semibold">{workout.split}</p>

          <p className="text-xs text-muted-foreground">
            {formatWorkoutDate(workout.date)}
          </p>
        </div>

        {/* right side */}
        <div className="text-right flex items-center gap-6 mr-2">
          <div className="flex-col items-center text-center">
            <span className="font-semibold">{volume}</span>
            <span className="block text-muted-foreground text-[0.7rem] uppercase tracking-wide">
              Volume
            </span>
          </div>
          <div className="flex-col items-center text-center">
            <span className="font-semibold">{getSetCount(workout)}</span>
            <span className="block text-muted-foreground text-[0.7rem] uppercase tracking-wide">
              Sets
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

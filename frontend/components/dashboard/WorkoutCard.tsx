import React from "react";
import { Card } from "../ui/Card";

export interface DashboardWorkout {
  id: string;
  date: string; // e.g., "Mon, Nov 24"
  name: string; // e.g., "Push Day"
  totalSets: number;
  totalVolume: number; // in kg or lbs
}

interface WorkoutCardProps {
  workout: DashboardWorkout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Card className="flex items-center justify-between gap-2">
      <div>
        <p className="text-sm font-semibold text-foreground">{workout.name}</p>
        <p className="text-xs text-muted-foreground">{workout.date}</p>
      </div>

      <div className="flex gap-6 text-xs text-muted-foreground">
        <div className="flex flex-col items-end">
          <span className="font-semibold">{workout.totalSets}</span>
          <span className="text-[0.7rem] uppercase tracking-wide">Sets</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold">
            {workout.totalVolume.toLocaleString()}
          </span>
          <span className="text-[0.7rem] uppercase tracking-wide">Volume</span>
        </div>
      </div>
    </Card>
  );
}
